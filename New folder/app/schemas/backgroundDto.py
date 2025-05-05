from pydantic import BaseModel
from datetime import datetime
from ..models import BackgroundCheckStatus
from .userDto import User
from .apartmentsDto import Apartment
from .applicationDto import ApplicationResponse

class BackgroundCheckResponse(BaseModel):
    id: int
    apartment_id: int
    tenant_id: int
    status: str
    report_url: str | None
    requested_at: datetime
    completed_at: datetime | None

class BackgroundCheckVerify(BaseModel):
    status: str
    report_url: str | None = None

class BackgroundCheckCreate(BaseModel):
    application_id: int
    tenant_id: int
    apartment_id: int

class BackgroundCheckStatusUpdate(BaseModel):
    status: BackgroundCheckStatus

class BackgroundCheckResponseDto(BaseModel):
    id: int
    apartment: Apartment
    tenant: User
    application: ApplicationResponse
    status: str
    report_url: str | None
    requested_at: datetime
    completed_at: datetime | None

    class Config:
        orm_mode = True