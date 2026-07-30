import logging
import asyncpg
from fastapi import Depends
from core.database import get_db_connection
from core.auth import get_current_user_id
from modules.users.repository import UsersRepository

logger = logging.getLogger(__name__)

# Shared presence window for is_online (users public profile + social relationship).
ONLINE_WINDOW_SECONDS = 900


async def get_current_user_id_and_touch(
    user_id: int = Depends(get_current_user_id),
    db: asyncpg.Connection = Depends(get_db_connection),
) -> int:
    # Presence is best-effort: a failed touch must never break an
    # authenticated request. Swallow and log, keep serving the route.
    try:
        await UsersRepository(db).touch_last_connection(user_id)
    except Exception:
        logger.warning("presence touch failed for user %s", user_id, exc_info=True)
    return user_id
