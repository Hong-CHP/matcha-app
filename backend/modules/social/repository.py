import asyncpg
from typing import List
from modules.social.schemas import VisitorOut, LikeReceivedOut, RelationshipResponse


class SocialRepository:
    def __init__(self, connection: asyncpg.Connection):
        self.connection = connection

    async def user_exists(self, user_id: int) -> bool:
        return await self.connection.fetchval(
            "SELECT 1 FROM users WHERE id = $1", user_id
        ) is not None

    async def upsert_visit(self, viewer_id: int, target_id: int) -> bool:
        """Return True iff a new visit row was inserted (first visit)."""
        row = await self.connection.fetchrow(
            """
            INSERT INTO visits (viewer_id, target_id, visited_at)
            VALUES ($1, $2, NOW())
            ON CONFLICT (viewer_id, target_id)
            DO UPDATE SET visited_at = NOW()
            RETURNING (xmax = 0) AS inserted
            """,
            viewer_id,
            target_id,
        )
        return bool(row["inserted"])

    async def list_visitors(self, user_id: int, limit: int, offset: int) -> List[VisitorOut]:
        rows = await self.connection.fetch(
            """
            SELECT u.id, u.username, u.first_name, u.last_name, v.visited_at
            FROM visits v
            JOIN users u ON u.id = v.viewer_id
            WHERE v.target_id = $1
            ORDER BY v.visited_at DESC
            LIMIT $2 OFFSET $3
            """,
            user_id, limit, offset,
        )
        return [VisitorOut.model_validate(dict(r)) for r in rows]

    async def activate_like(self, from_user_id: int, to_user_id: int) -> bool:
        """Activate like. Return True iff the row was newly inserted (first like ever).

        Soft re-activate of an inactive row sets status=active but returns False
        so fame is not awarded again.
        """
        row = await self.connection.fetchrow(
            """
            INSERT INTO likes (from_user_id, to_user_id, status, created_at, updated_at)
            VALUES ($1, $2, 'active', NOW(), NOW())
            ON CONFLICT (from_user_id, to_user_id)
            DO UPDATE SET
                status = 'active',
                updated_at = NOW()
            WHERE likes.status IS DISTINCT FROM 'active'
            RETURNING (xmax = 0) AS inserted
            """,
            from_user_id,
            to_user_id,
        )
        if row is None:
            return False
        return bool(row["inserted"])

    async def soft_unlike(self, from_user_id: int, to_user_id: int) -> None:
        await self.connection.execute(
            """
            UPDATE likes
            SET status = 'inactive', updated_at = NOW()
            WHERE from_user_id = $1 AND to_user_id = $2 AND status = 'active'
            """,
            from_user_id,
            to_user_id,
        )

    async def is_connected(self, a: int, b: int) -> bool:
        row = await self.connection.fetchrow(
            """
            SELECT
              EXISTS (
                SELECT 1 FROM likes
                WHERE from_user_id = $1 AND to_user_id = $2 AND status = 'active'
              ) AS ab,
              EXISTS (
                SELECT 1 FROM likes
                WHERE from_user_id = $2 AND to_user_id = $1 AND status = 'active'
              ) AS ba
            """,
            a, b,
        )
        return bool(row["ab"] and row["ba"])

    async def get_relationship_flags(self, me: int, target: int) -> RelationshipResponse:
        row = await self.connection.fetchrow(
            """
            SELECT
              EXISTS (
                SELECT 1 FROM likes
                WHERE from_user_id = $1 AND to_user_id = $2 AND status = 'active'
              ) AS liked_by_me,
              EXISTS (
                SELECT 1 FROM likes
                WHERE from_user_id = $2 AND to_user_id = $1 AND status = 'active'
              ) AS liked_you
            """,
            me, target,
        )
        liked_by_me = bool(row["liked_by_me"])
        liked_you = bool(row["liked_you"])
        return RelationshipResponse(
            liked_by_me=liked_by_me,
            liked_you=liked_you,
            connected=liked_by_me and liked_you,
        )

    async def list_likes_received(
        self, user_id: int, limit: int, offset: int
    ) -> List[LikeReceivedOut]:
        rows = await self.connection.fetch(
            """
            SELECT u.id, u.username, u.first_name, u.last_name,
                   l.updated_at AS liked_at
            FROM likes l
            JOIN users u ON u.id = l.from_user_id
            WHERE l.to_user_id = $1 AND l.status = 'active'
            ORDER BY l.updated_at DESC
            LIMIT $2 OFFSET $3
            """,
            user_id, limit, offset,
        )
        return [LikeReceivedOut.model_validate(dict(r)) for r in rows]
