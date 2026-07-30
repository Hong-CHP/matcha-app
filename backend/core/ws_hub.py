"""In-process WebSocket connection hub (ADR-0003).

Auth for ``/ws``: JWT via query param ``?token=<jwt>`` using the same secret and
algorithm as HTTP Bearer auth in ``core.auth``. Anonymous sockets are rejected.
One registry entry per user id (latest connection wins if the client reconnects).
"""

from __future__ import annotations

import logging
from typing import Any, Dict, Optional

from fastapi import WebSocket
import jwt

from core.config import settings

logger = logging.getLogger(__name__)


def decode_user_id_from_token(token: str) -> Optional[int]:
    """Return user id from a JWT, or None if missing/invalid/expired."""
    if not token:
        return None
    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET.get_secret_value(),
            algorithms=[settings.JWT_ALGORITHM],
        )
    except jwt.PyJWTError:
        return None
    sub = payload.get("sub")
    if sub is None:
        return None
    try:
        return int(sub)
    except (ValueError, TypeError):
        return None


class ConnectionHub:
    def __init__(self) -> None:
        self._connections: Dict[int, WebSocket] = {}

    async def connect(self, user_id: int, websocket: WebSocket) -> None:
        await websocket.accept()
        previous = self._connections.get(user_id)
        self._connections[user_id] = websocket
        if previous is not None and previous is not websocket:
            try:
                await previous.close()
            except Exception:
                logger.debug("Failed closing previous socket for user %s", user_id)

    def disconnect(self, user_id: int, websocket: WebSocket) -> None:
        current = self._connections.get(user_id)
        if current is websocket:
            self._connections.pop(user_id, None)

    async def push(self, user_id: int, envelope: dict[str, Any]) -> None:
        websocket = self._connections.get(user_id)
        if websocket is None:
            return
        try:
            await websocket.send_json(envelope)
        except Exception:
            logger.exception("Failed WS push to user %s", user_id)
            self._connections.pop(user_id, None)

    def is_connected(self, user_id: int) -> bool:
        return user_id in self._connections


hub = ConnectionHub()
