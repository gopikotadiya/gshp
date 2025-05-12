from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from .userDto import User
from .apartmentsDto import Apartment

class ApplicationCreate(BaseModel):
    tenant_id: int
    apartment_id: int
    lease_duration: Optional[int] = None
    desired_move_in_date: Optional[datetime] = None
    application_notes: Optional[str] = None

class ApplicationUpdate(BaseModel):
    status: str  
    lease_duration: Optional[int] = None
    desired_move_in_date: Optional[datetime] = None
    application_notes: Optional[str] = None

class ApplicationResponse(BaseModel):
    id: int
    tenant_id: int
    apartment_id: int
    status: str
    submitted_at: datetime
    updated_at: datetime
    lease_duration: Optional[int] = None
    desired_move_in_date: Optional[datetime] = None
    application_notes: Optional[str] = None

    class Config:
        from_attributes = True

class ApplicationResponseDto(BaseModel):
    id: int
    tenant: User
    apartment: Apartment
    status: str
    submitted_at: datetime
    updated_at: datetime
    lease_duration: Optional[int] = None
    desired_move_in_date: Optional[datetime] = None
    application_notes: Optional[str] = None
    admin_notes: Optional[str] = None

    class Config:
        orm_mode = True