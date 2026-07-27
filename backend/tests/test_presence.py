import logging
import pytest
from core.presence import get_current_user_id_and_touch
from modules.users.repository import UsersRepository


class RecordingConnection:
    def __init__(self):
        self.executed = []

    async def execute(self, query, *args):
        self.executed.append((query, args))


class RaisingConnection:
    async def execute(self, *args, **kwargs):
        raise RuntimeError("db down")


@pytest.mark.asyncio
async def test_touch_last_connection_updates_users_row():
    conn = RecordingConnection()
    await UsersRepository(conn).touch_last_connection(42)
    assert len(conn.executed) == 1
    query, args = conn.executed[0]
    assert "last_connection" in query
    assert args == (42,)


@pytest.mark.asyncio
async def test_get_current_user_id_and_touch_writes_then_returns_id():
    conn = RecordingConnection()
    result = await get_current_user_id_and_touch(user_id=7, db=conn)
    assert result == 7
    assert len(conn.executed) == 1
    assert "last_connection" in conn.executed[0][0]
    assert conn.executed[0][1] == (7,)


@pytest.mark.asyncio
async def test_touch_failure_is_swallowed_and_request_survives(caplog):
    with caplog.at_level(logging.WARNING):
        result = await get_current_user_id_and_touch(user_id=1, db=RaisingConnection())
    assert result == 1
    assert "presence touch failed" in caplog.text
