import pytest
from contextlib import asynccontextmanager
from modules.social.service import SocialService, FAME_LIKE_DELTA, FAME_VISIT_DELTA
from modules.social.exceptions import (
    CannotVisitSelfException,
    CannotLikeSelfException,
    ProfilePhotoRequiredException,
    SocialUserNotFoundException,
)
from modules.social.schemas import RelationshipResponse


class FakeConnection:
    @asynccontextmanager
    async def transaction(self):
        yield


class FakeSocialRepository:
    def __init__(self):
        self.connection = FakeConnection()
        self.existing_users = {1, 2, 3}
        self.visits = {}  # (viewer, target) -> True
        self.likes = {}  # (from, to) -> "active" | "inactive"
        self.visit_inserts = []
        self.activate_results = []

    async def user_exists(self, user_id: int) -> bool:
        return user_id in self.existing_users

    async def upsert_visit(self, viewer_id: int, target_id: int) -> bool:
        key = (viewer_id, target_id)
        inserted = key not in self.visits
        self.visits[key] = True
        self.visit_inserts.append(inserted)
        return inserted

    async def activate_like(self, from_user_id: int, to_user_id: int) -> bool:
        key = (from_user_id, to_user_id)
        existing = self.likes.get(key)
        if existing is None:
            self.likes[key] = "active"
            self.activate_results.append(True)
            return True
        if existing == "inactive":
            self.likes[key] = "active"
            self.activate_results.append(False)
            return False
        self.activate_results.append(False)
        return False

    async def soft_unlike(self, from_user_id: int, to_user_id: int) -> None:
        key = (from_user_id, to_user_id)
        if self.likes.get(key) == "active":
            self.likes[key] = "inactive"

    async def is_connected(self, a: int, b: int) -> bool:
        return (
            self.likes.get((a, b)) == "active"
            and self.likes.get((b, a)) == "active"
        )

    async def get_relationship_flags(self, me: int, target: int) -> RelationshipResponse:
        liked_by_me = self.likes.get((me, target)) == "active"
        liked_you = self.likes.get((target, me)) == "active"
        return RelationshipResponse(
            liked_by_me=liked_by_me,
            liked_you=liked_you,
            connected=liked_by_me and liked_you,
        )

    async def list_visitors(self, user_id: int, limit: int, offset: int):
        return []

    async def list_likes_received(self, user_id: int, limit: int, offset: int):
        return []


class FakeUsersRepository:
    def __init__(self, has_avatar: bool = True, fame: int = 0):
        self.has_avatar = has_avatar
        self.fame = fame
        self.fame_bumps = []

    async def has_profile_photo(self, user_id: int) -> bool:
        return self.has_avatar

    async def bump_fame(self, user_id: int, delta: int) -> None:
        self.fame_bumps.append((user_id, delta))
        self.fame = min(100, max(0, self.fame + delta))


@pytest.mark.asyncio
async def test_record_visit_rejects_self():
    social = FakeSocialRepository()
    users = FakeUsersRepository()
    service = SocialService(social, users)
    with pytest.raises(CannotVisitSelfException):
        await service.record_visit(1, 1)
    assert users.fame_bumps == []


@pytest.mark.asyncio
async def test_first_visit_bumps_fame_repeat_does_not():
    social = FakeSocialRepository()
    users = FakeUsersRepository(fame=10)
    service = SocialService(social, users)
    await service.record_visit(1, 2)
    await service.record_visit(1, 2)
    assert users.fame_bumps == [(2, FAME_VISIT_DELTA)]
    assert users.fame == 11


@pytest.mark.asyncio
async def test_like_requires_profile_photo():
    social = FakeSocialRepository()
    users = FakeUsersRepository(has_avatar=False)
    service = SocialService(social, users)
    with pytest.raises(ProfilePhotoRequiredException):
        await service.like(1, 2)
    assert users.fame_bumps == []


@pytest.mark.asyncio
async def test_like_self_rejected():
    social = FakeSocialRepository()
    users = FakeUsersRepository()
    service = SocialService(social, users)
    with pytest.raises(CannotLikeSelfException):
        await service.like(1, 1)


@pytest.mark.asyncio
async def test_like_target_not_found():
    social = FakeSocialRepository()
    users = FakeUsersRepository()
    service = SocialService(social, users)
    with pytest.raises(SocialUserNotFoundException):
        await service.like(1, 99)


@pytest.mark.asyncio
async def test_mutual_like_sets_connected():
    social = FakeSocialRepository()
    users = FakeUsersRepository()
    service = SocialService(social, users)
    first = await service.like(1, 2)
    assert first.liked is True
    assert first.connected is False
    second = await service.like(2, 1)
    assert second.connected is True


@pytest.mark.asyncio
async def test_unlike_clears_connected_and_is_idempotent():
    social = FakeSocialRepository()
    users = FakeUsersRepository()
    service = SocialService(social, users)
    await service.like(1, 2)
    await service.like(2, 1)
    res = await service.unlike(1, 2)
    assert res.liked is False
    assert res.connected is False
    again = await service.unlike(1, 2)
    assert again.liked is False


@pytest.mark.asyncio
async def test_like_bumps_fame_only_when_newly_inserted():
    social = FakeSocialRepository()
    users = FakeUsersRepository(fame=0)
    service = SocialService(social, users)
    await service.like(1, 2)
    await service.like(1, 2)
    assert users.fame_bumps == [(2, FAME_LIKE_DELTA)]
    assert users.fame == 5


@pytest.mark.asyncio
async def test_unlike_then_relike_does_not_bump_fame():
    social = FakeSocialRepository()
    users = FakeUsersRepository(fame=0)
    service = SocialService(social, users)
    await service.like(1, 2)
    await service.unlike(1, 2)
    await service.like(1, 2)
    assert users.fame_bumps == [(2, FAME_LIKE_DELTA)]
    assert users.fame == 5


@pytest.mark.asyncio
async def test_fame_clamp_at_100():
    social = FakeSocialRepository()
    users = FakeUsersRepository(fame=99)
    service = SocialService(social, users)
    await service.like(1, 2)
    assert users.fame == 100
