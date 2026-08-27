from typing import List, Annotated
from fastapi import APIRouter, Depends, Query
import asyncpg
from core.database import get_db_connection
from core.presence import get_current_user_id_and_touch
from modules.discovery.repository import DiscoveryRepository
from modules.discovery.service import DiscoveryService
from modules.discovery.schemas import (
    DiscoveryProfileCard,
    SuggestQueryParams,
    SearchQueryParams,
    SearchingBarProfile
)

discovery_router = APIRouter(prefix="/discovery", tags=["discovery"])


def get_discovery_service(
    db: asyncpg.Connection = Depends(get_db_connection),
) -> DiscoveryService:
    return DiscoveryService(DiscoveryRepository(db))


@discovery_router.get("/suggest", response_model=List[DiscoveryProfileCard])
async def suggest_profiles(
    params: Annotated[SuggestQueryParams, Query()],
    current_user_id: int = Depends(get_current_user_id_and_touch),
    service: DiscoveryService = Depends(get_discovery_service),
) -> List[DiscoveryProfileCard]:
    return await service.suggest(current_user_id, params)


@discovery_router.get("/search", response_model=List[DiscoveryProfileCard])
async def search_profiles(
    params: Annotated[SearchQueryParams, Query()],
    current_user_id: int = Depends(get_current_user_id_and_touch),
    service: DiscoveryService = Depends(get_discovery_service),
) -> List[DiscoveryProfileCard]:
    return await service.search(current_user_id, params)


@discovery_router.get("/search-list", response_model=List[SearchingBarProfile])
async def get_seaching_bar_profiles(
    target: str,
    current_user_id: int = Depends(get_current_user_id_and_touch),
    service: DiscoveryService = Depends(get_discovery_service),
) -> List[SearchingBarProfile]:
    return await service.get_seaching_bar_profiles(target)