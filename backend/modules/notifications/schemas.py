from datetime import datetime
from typing import Literal, Optional
from pydantic import BaseModel, Field

NotificationType = Literal["liked", "visited", "matched", "unliked", "message"]


class NotificationOut(BaseModel):
    id: int
    type: NotificationType
    actor_id: int
    entity_id: Optional[int] = None
    read_at: Optional[datetime] = None
    created_at: datetime


class UnreadCountOut(BaseModel):
    unread_count: int = Field(..., ge=0)


class OkResponse(BaseModel):
    ok: bool = True
