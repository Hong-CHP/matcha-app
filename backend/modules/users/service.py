from modules.users.repository import UsersRepository
from modules.users.schemas import (
    UserProfile,
    PhotoOut,
    UserLocationInput,
    UserAccountInput,
    UserProfileInput
)
from modules.users.exceptions import (
    UserNotFoundException,
    InvalidLocationException,
)
from modules.tags.schemas import TagInput, TagOut
from modules.tags.exceptions import TagContentProfanity
from modules.tags.service import profanity
from typing import List
from fastapi import UploadFile

class UsersService:
    def __init__(
            self,
            repository: UsersRepository
    ):
        self.repository = repository
    
    async def get_profile(
            self,
            current_user_id: int
            ) -> UserProfile:
        current_user = await self.repository.get_user_by_id(current_user_id)
        if not current_user:
            raise UserNotFoundException()
        
        tags = await self.repository.get_my_tags(current_user_id)
        photos = await self.repository.get_my_photos(current_user_id)

        is_completed = (
            current_user.bio is not None
            and current_user.age is not None
            and current_user.gender is not None
            and current_user.sexual_preference is not None
            and len(tags) > 0
            and len(photos) > 0
        )
        
        return current_user.model_copy(update={"is_profile_completed": is_completed})
    
    async def patch_profile(
            self,
            current_user_id: int,
            payload: UserProfileInput
            ) -> UserProfile:
        user_profile = await self.repository.patch_user_profile(current_user_id, payload)
        if not user_profile:
            raise UserNotFoundException()
        return user_profile

    async def update_location(
            self,
            current_user_id: int,
<<<<<<< HEAD
            payload: UserLocationInput,
    ) -> UserProfile:
        if not payload.location_consent:
            raise InvalidLocationException()
        user_profile = await self.repository.update_location(current_user_id, payload)
        if not user_profile:
            raise UserNotFoundException()
        return user_profile

    async def update_account(
            self,
            current_user_id: int,
            payload: UserAccountInput,
    ) -> UserProfile:
        current = await self.repository.get_user_by_id(current_user_id)
        if not current:
            raise UserNotFoundException()
        email_changed = str(current.email).lower() != str(payload.email).lower()
        user_profile = await self.repository.update_account(
            current_user_id,
            payload,
            reverify_email=email_changed,
        )
=======
            payload: EditProfileInput
            ) -> UserProfile:
        user_profile = await self.repository.patch_full_profile(current_user_id, payload)
>>>>>>> 3e75ab0 (normally, i fixed all issues mentionned in pull request review)
        if not user_profile:
            raise UserNotFoundException()
        return user_profile
    
<<<<<<< HEAD
    # async def patch_full_profile(
    #         self,
    #         current_user_id: int,
    #         payload: EditProfileInput
    #         ) -> UserProfile:
    #     await self.repository.patch_user_profile(current_user_id, payload)
    #     user_profile = await self.repository.patch_user_location(current_user_id, payload)
    #     if not user_profile:
    #         raise UserNotFoundException()
    #     return user_profile
    
    # async def patch_accout(
    #         self,
    #         payload: EditAccoutInput,
    #         current_user_id: int ,
    #         service: UsersService
    #     ) -> UserProfile:
    #     user_profile = await self.repository.patch_accout(current_user_id, payload)
    #     if not user_profile:
    #         raise UserNotFoundException()
    #     return user_profile
=======
    async def patch_account(
            self,
            current_user_id: int,
            payload: EditAccountInput,
        ) -> UserProfile:
        user_profile = await self.repository.patch_account(current_user_id, payload)
        if not user_profile:
            raise UserNotFoundException()
        return user_profile
>>>>>>> 3e75ab0 (normally, i fixed all issues mentionned in pull request review)
    
    async def add_one_profile_tag(
            self,
            current_user_id: int,
            tag_input: TagInput
    ) -> TagOut:
        if profanity.contains_profanity(tag_input.name):
            raise TagContentProfanity()
        return await self.repository.add_one_tag(current_user_id, tag_input)

    async def get_my_tags(
            self,
            current_user_id: int
    ) -> List[TagOut]:
        return await self.repository.get_my_tags(current_user_id)

    async def delete_one_tag(
            self,
            tag_id: int,
            current_user_id: int,
    ) -> None:
        return await self.repository.delete_one_tag(tag_id, current_user_id)
    
    async def get_my_photos(
            self,
            current_user_id: int,
        ) -> List[PhotoOut]:
        return await self.repository.get_my_photos(current_user_id)
    
    async def upload_photo(
            self, 
            current_user_id: int, 
            file: UploadFile
    ) -> PhotoOut:
        return await self.repository.upload_photo(current_user_id, file)
    
    async def delete_my_photo(
            self,
            photo_id: int,
            current_user_id: int
        ) -> None:
        return await self.repository.delete_my_photo(photo_id, current_user_id)
    
    async def set_photo_as_avatar(
            self,
            photo_id: int,
            current_user_id: int
        ) -> None:
        return await self.repository.set_photo_as_avatar(photo_id, current_user_id)
    
    async def patch_photo_by_new(
            self,
            photo_id: int,
            file: UploadFile,
            current_user_id: int
        ) -> PhotoOut:
        return await self.repository.patch_photo_by_new(photo_id, file, current_user_id)
<<<<<<< HEAD
=======

    async def request_email_change(
            self,
            current_user_id: int,
            new_email: str
        ) -> None:
        email_token = str(uuid.uuid4())
        user = await self.repository.request_email_change(current_user_id, new_email, email_token)
        if not user:
            raise UserNotFoundException()
        
    async def confirm_email_change(
        self,
        token: str,
        ) -> UserProfile:
        user = await self.repository.confirm_email_change(token)
        if not user:
            raise InvalidVerificationTokenException()
        return user
    
    async def change_password(
            self,
            passwords: PasswordChangeInput,
            current_user_id: int,
    ) -> None:
        from modules.auth.service import AuthService
        from modules.auth.repository import AuthRepository
        user = await AuthRepository(self.repository.connection).find_by_id(current_user_id)
        if not user: 
            raise InvalidCredentialsException()
        if not user.password_hash:
            raise NoPasswordSetException()
        if not user.is_verified:
            raise AccountNotVerifiedException()
        if not bcrypt.checkpw(
            passwords.current_password.encode("utf-8"), user.password_hash.encode("utf-8")
        ):
            raise InvalidCredentialsException()
        hashed_password = AuthService(AuthRepository(self.repository.connection)).hash_password(passwords.new_password)
        await self.repository.change_password(hashed_password, current_user_id)
        
>>>>>>> 3e75ab0 (normally, i fixed all issues mentionned in pull request review)
