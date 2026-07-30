from typing import List
import asyncpg
from modules.chat.schemas import MessageOut


class ChatRepository:
    def __init__(self, connection: asyncpg.Connection):
        self.connection = connection

    async def insert_message(
        self, from_user_id: int, to_user_id: int, body: str
    ) -> MessageOut:
        row = await self.connection.fetchrow(
            """
            INSERT INTO chat_messages (from_user_id, to_user_id, body)
            VALUES ($1, $2, $3)
            RETURNING id, from_user_id, to_user_id, body, created_at
            """,
            from_user_id,
            to_user_id,
            body,
        )
        return self._to_out(row)

    async def list_messages(
        self, me: int, peer: int, limit: int, offset: int
    ) -> List[MessageOut]:
        rows = await self.connection.fetch(
            """
            SELECT id, from_user_id, to_user_id, body, created_at
            FROM chat_messages
            WHERE
                (from_user_id = $1 AND to_user_id = $2)
                OR (from_user_id = $2 AND to_user_id = $1)
            ORDER BY created_at ASC, id ASC
            LIMIT $3 OFFSET $4
            """,
            me,
            peer,
            limit,
            offset,
        )
        return [self._to_out(row) for row in rows]

    @staticmethod
    def _to_out(row) -> MessageOut:
        return MessageOut(
            id=row["id"],
            from_user_id=row["from_user_id"],
            to_user_id=row["to_user_id"],
            body=row["body"],
            created_at=row["created_at"],
        )
