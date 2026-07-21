from pydantic import BaseModel, EmailStr, Field, model_validator
from datetime import datetime
from typing import Literal, Optional

class UserProfile(BaseModel):
    id: int
    email: EmailStr
    username: str 
    first_name: str 
    last_name: str 
    is_verified: bool
    created_at: datetime
    gender: Optional[Literal["male", "female", "other"]] = None
    sexual_preference: Optional[Literal["man", "woman", "bisexual"]] = None
    age: Optional[int] = None
    bio: Optional[str] = None
    is_profile_completed: bool = False
    fame_rating: int = 0
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    location_label: Optional[str] = None
    location_consent: bool = False
    last_connection: Optional[datetime] = None

class UserProfileInput(BaseModel):
    gender: Literal["male", "female", "other"]
    sexual_preference: Literal["man", "woman", "bisexual"]
    age: int = Field(..., ge=18, le=100)
    bio: str = Field(..., min_length=1)

class UserLocationInput(BaseModel):
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)
    location_label: Optional[str] = None
    location_consent: bool

class UserAccountInput(BaseModel):
    first_name: str = Field(..., min_length=1)
    last_name: str = Field(..., min_length=1)
    email: EmailStr
    
class PhotoOut(BaseModel):
    id: int
    url: str
    is_profile_photo: bool

class EditProfileInput(UserProfileInput):
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    location_text: Optional[str] = None    

    @model_validator(mode="after")
    def check_location_complete(self) -> "EditProfileInput":
        has_coords = self.latitude is not None and self.longitude is not None
        has_text = bool(self.location_text is not None and self.location_text.strip())
        if not (has_coords and has_text):
            raise ValueError("latitude, longitude and location_text must all be provided together")
        return self
        
