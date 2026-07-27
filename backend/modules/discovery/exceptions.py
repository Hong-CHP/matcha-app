class DiscoveryException(Exception):
    code: str = "DISCOVERY_ERROR"
    field: str | None = None


class LocationRequiredException(DiscoveryException):
    code = "LOCATION_REQUIRED"
    field = "location"

    def __init__(self):
        super().__init__("Viewer location is required for this discovery query")


class InvalidFilterException(DiscoveryException):
    code = "INVALID_FILTER"
    field = None

    def __init__(self, message: str = "Invalid discovery filter", field: str | None = None):
        self.field = field
        super().__init__(message)
