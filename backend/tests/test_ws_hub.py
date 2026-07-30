import pytest
from core.ws_hub import ConnectionHub, decode_user_id_from_token
from core.config import settings
import jwt
import datetime
import time


class FakeWebSocket:
    def __init__(self):
        self.accepted = False
        self.sent = []
        self.closed = False

    async def accept(self):
        self.accepted = True

    async def send_json(self, data):
        self.sent.append(data)

    async def close(self):
        self.closed = True


def _token(user_id: int) -> str:
    now = datetime.datetime.now(datetime.UTC)
    return jwt.encode(
        {"sub": str(user_id), "exp": time.time() + 3600, "iat": int(now.timestamp())},
        settings.JWT_SECRET.get_secret_value(),
        algorithm=settings.JWT_ALGORITHM,
    )


@pytest.mark.asyncio
async def test_should_push_when_user_connected():
    hub = ConnectionHub()
    ws = FakeWebSocket()
    await hub.connect(1, ws)
    await hub.push(1, {"type": "notification", "payload": {"id": 1}})
    assert ws.sent == [{"type": "notification", "payload": {"id": 1}}]


@pytest.mark.asyncio
async def test_should_noop_push_when_user_offline():
    hub = ConnectionHub()
    await hub.push(99, {"type": "notification", "payload": {}})


def test_should_decode_valid_token():
    assert decode_user_id_from_token(_token(7)) == 7


def test_should_reject_invalid_token():
    assert decode_user_id_from_token("not-a-jwt") is None
    assert decode_user_id_from_token("") is None
