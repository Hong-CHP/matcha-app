from fastapi import FastAPI, status
from fastapi.responses import JSONResponse
from modules.notifications.exceptions import (
    NotificationsException,
    NotificationNotFoundException,
)

_EXCEPTION_STATUS = {
    NotificationNotFoundException: status.HTTP_404_NOT_FOUND,
}


def register_notifications_exception_handlers(app: FastAPI) -> None:
    @app.exception_handler(NotificationsException)
    async def handle_notifications_exception(_, exc: NotificationsException):
        status_code = _EXCEPTION_STATUS.get(
            type(exc), status.HTTP_400_BAD_REQUEST
        )
        return JSONResponse(
            status_code=status_code,
            content={"detail": str(exc), "code": exc.code, "field": exc.field},
        )
