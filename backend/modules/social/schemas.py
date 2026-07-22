from pydantic import BaseModel
from datetime import datetime

class OkResponse(BaseModel):
    ok: bool = True

class LikeStateResponse(BaseModel):
    liked: bool
    connected: bool

class RelationshipResponse(BaseModel):
    liked_by_me: bool
    liked_you: bool
    connected: bool

class SocialUserCard(BaseModel):
    id: int
    username: str
    first_name: str
    last_name: str

class VisitorOut(SocialUserCard):
    visited_at: datetime

class LikeReceivedOut(SocialUserCard):
    liked_at: datetime
