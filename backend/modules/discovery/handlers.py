from fastapi import FastAPI, status
from fastapi.responses import JSONResponse
from modules.discovery.exceptions import (
    DiscoveryException,
    LocationRequiredException,
    InvalidFilterException,
)

_EXCEPTION_STATUS = {
    LocationRequiredException: status.HTTP_400_BAD_REQUEST,
    InvalidFilterException: status.HTTP_400_BAD_REQUEST,
}


def register_discovery_exception_handlers(app: FastAPI) -> None:
    @app.exception_handler(DiscoveryException)
    async def handle_discovery_exception(_, exc: DiscoveryException):
        status_code = _EXCEPTION_STATUS.get(type(exc), status.HTTP_400_BAD_REQUEST)
        return JSONResponse(
            status_code=status_code,
            content={"detail": str(exc), "code": exc.code, "field": exc.field},
        )
