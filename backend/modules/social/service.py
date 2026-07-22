from modules.social.repository import SocialRepository
from modules.users.repository import UsersRepository
from modules.social.exceptions import (
    SocialUserNotFoundException,
    CannotVisitSelfException,
    CannotLikeSelfException,
    ProfilePhotoRequiredException,
)
from modules.social.schemas import (
    OkResponse,
    LikeStateResponse,
    RelationshipResponse,
    VisitorOut,
    LikeReceivedOut,
)
from typing import List

FAME_LIKE_DELTA = 5
FAME_VISIT_DELTA = 1


class SocialService:
    def __init__(self, social_repo: SocialRepository, users_repo: UsersRepository):
        self.social_repo = social_repo
        self.users_repo = users_repo

    async def record_visit(self, viewer_id: int, target_id: int) -> OkResponse:
        if viewer_id == target_id:
            raise CannotVisitSelfException()
        if not await self.social_repo.user_exists(target_id):
            raise SocialUserNotFoundException()
        async with self.social_repo.connection.transaction():
            inserted = await self.social_repo.upsert_visit(viewer_id, target_id)
            if inserted:
                await self.users_repo.bump_fame(target_id, FAME_VISIT_DELTA)
        return OkResponse()

    async def list_visitors(self, user_id: int, limit: int, offset: int) -> List[VisitorOut]:
        return await self.social_repo.list_visitors(user_id, limit, offset)

    async def like(self, from_user_id: int, to_user_id: int) -> LikeStateResponse:
        if from_user_id == to_user_id:
            raise CannotLikeSelfException()
        if not await self.social_repo.user_exists(to_user_id):
            raise SocialUserNotFoundException()
        if not await self.users_repo.has_profile_photo(from_user_id):
            raise ProfilePhotoRequiredException()
        async with self.social_repo.connection.transaction():
            newly_inserted = await self.social_repo.activate_like(from_user_id, to_user_id)
            if newly_inserted:
                await self.users_repo.bump_fame(to_user_id, FAME_LIKE_DELTA)
            connected = await self.social_repo.is_connected(from_user_id, to_user_id)
        return LikeStateResponse(liked=True, connected=connected)

    async def unlike(self, from_user_id: int, to_user_id: int) -> LikeStateResponse:
        await self.social_repo.soft_unlike(from_user_id, to_user_id)
        connected = await self.social_repo.is_connected(from_user_id, to_user_id)
        return LikeStateResponse(liked=False, connected=connected)

    async def list_likes_received(
        self, user_id: int, limit: int, offset: int
    ) -> List[LikeReceivedOut]:
        return await self.social_repo.list_likes_received(user_id, limit, offset)

    async def get_relationship(self, me: int, target_id: int) -> RelationshipResponse:
        if not await self.social_repo.user_exists(target_id):
            raise SocialUserNotFoundException()
        return await self.social_repo.get_relationship_flags(me, target_id)
