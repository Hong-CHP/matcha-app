class NotificationsException(Exception):
    def __init__(self, message: str, code: str, field: str | None = None):
        self.message = message
        self.code = code
        self.field = field
        super().__init__(message)

    def __str__(self) -> str:
        return self.message


class NotificationNotFoundException(NotificationsException):
    def __init__(self):
        super().__init__("Notification not found", "NOTIFICATION_NOT_FOUND")
