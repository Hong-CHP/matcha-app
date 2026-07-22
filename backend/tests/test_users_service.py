import pytest
from datetime import datetime, UTC
from modules.users.schemas import UserProfile, UserLocationInput, UserAccountInput
from modules.users.service import UsersService
from modules.users.exceptions import (
    UserNotFoundException,
    InvalidLocationException,
    EmailAlreadyTakenException,
)


class FakeRepository:
    def __init__(self, user, tags=None, photos=None):
        self.user = user
        self.tags = tags or []
        self.photos = photos or []
        self.current_user_id = None
        self.updated_location = None
        self.updated_account = None
        self.raise_on_account = None

    async def get_user_by_id(self, user_id: int):
        self.current_user_id = user_id
        return self.user

    async def get_my_tags(self, user_id: int):
        return self.tags

    async def get_my_photos(self, user_id: int):
        return self.photos

    async def update_location(self, current_user_id: int, payload: UserLocationInput):
        self.updated_location = (current_user_id, payload)
        if not self.user:
            return None
        return self.user.model_copy(
            update={
                "latitude": payload.latitude,
                "longitude": payload.longitude,
                "location_label": payload.location_label,
                "location_consent": payload.location_consent,
            }
        )

    async def update_account(self, current_user_id: int, payload: UserAccountInput):
        if self.raise_on_account is not None:
            raise self.raise_on_account
        self.updated_account = (current_user_id, payload)
        if not self.user:
            return None
        return self.user.model_copy(
            update={
                "first_name": payload.first_name,
                "last_name": payload.last_name,
                "email": payload.email,
            }
        )


def _complete_user(**overrides) -> UserProfile:
    data = dict(
        id=1,
        email="aaa@gmail.com",
        username="aaa",
        first_name="Ann",
        last_name="MOMO",
        is_verified=True,
        created_at=datetime.now(UTC),
        gender="female",
        sexual_preference="man",
        age=24,
        bio="hello",
        fame_rating=0,
        location_consent=False,
    )
    data.update(overrides)
    return UserProfile(**data)


@pytest.mark.asyncio
async def test_get_profile_when_user_found():
    user = _complete_user()
    repo = FakeRepository(user, tags=[{"id": 1}], photos=[{"id": 1}])
    service = UsersService(repo)

    res = await service.get_profile(1)
    assert res.id == user.id
    assert res.is_profile_completed is True
    assert res.fame_rating == 0
    assert res.location_consent is False
    assert repo.current_user_id == 1


@pytest.mark.asyncio
async def test_get_profile_is_incomplete_without_photos() -> None:
    user = _complete_user()
    repo = FakeRepository(user, tags=[{"id": 1}], photos=[])
    service = UsersService(repo)

    res = await service.get_profile(1)
    assert res.is_profile_completed is False


@pytest.mark.asyncio
async def test_get_profile_completed_without_location() -> None:
    user = _complete_user(latitude=None, longitude=None, location_consent=False)
    repo = FakeRepository(user, tags=[{"id": 1}], photos=[{"id": 1}])
    service = UsersService(repo)

    res = await service.get_profile(1)
    assert res.is_profile_completed is True


@pytest.mark.asyncio
async def test_get_profile_when_user_not_found():
    repo = FakeRepository(None)
    service = UsersService(repo)

    with pytest.raises(UserNotFoundException):
        await service.get_profile(12)


@pytest.mark.asyncio
async def test_update_location_rejects_when_consent_false():
    user = _complete_user()
    repo = FakeRepository(user, tags=[1], photos=[1])
    service = UsersService(repo)
    with pytest.raises(InvalidLocationException):
        await service.update_location(
            1,
            UserLocationInput(
                latitude=48.85,
                longitude=2.35,
                location_label="Paris",
                location_consent=False,
            ),
        )
    assert repo.updated_location is None


@pytest.mark.asyncio
async def test_update_location_succeeds_when_consent_true():
    user = _complete_user()
    repo = FakeRepository(user, tags=[1], photos=[1])
    service = UsersService(repo)
    payload = UserLocationInput(
        latitude=48.85,
        longitude=2.35,
        location_label="Paris",
        location_consent=True,
    )
    res = await service.update_location(1, payload)
    assert res.latitude == 48.85
    assert res.longitude == 2.35
    assert res.location_label == "Paris"
    assert res.location_consent is True
    assert repo.updated_location == (1, payload)


@pytest.mark.asyncio
async def test_update_account_succeeds():
    user = _complete_user()
    repo = FakeRepository(user)
    service = UsersService(repo)
    payload = UserAccountInput(
        first_name="New",
        last_name="Name",
        email="new@example.com",
    )
    res = await service.update_account(1, payload)
    assert res.first_name == "New"
    assert res.last_name == "Name"
    assert res.email == "new@example.com"


@pytest.mark.asyncio
async def test_update_account_propagates_email_taken():
    user = _complete_user()
    repo = FakeRepository(user)
    repo.raise_on_account = EmailAlreadyTakenException("taken@example.com")
    service = UsersService(repo)
    with pytest.raises(EmailAlreadyTakenException):
        await service.update_account(
            1,
            UserAccountInput(
                first_name="Ann",
                last_name="MOMO",
                email="taken@example.com",
            ),
        )
