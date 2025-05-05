from datetime import datetime
from pydantic import BaseModel
from typing import Optional
from .userDto import User
from .apartmentsDto import Apartment
from .applicationDto import ApplicationResponse

class LeaseCreate(BaseModel):
    application_id: int
    apartment_id: int
    tenant_id: int
    start_date: datetime
    end_date: datetime
    monthly_rent: float
    deposit_amount: float
    payment_due_day: int

class LeaseUpdate(BaseModel):
    lease_status: Optional[str] = None
    end_date: Optional[datetime] = None
    monthly_rent: Optional[float] = None
    payment_due_day: Optional[int] = None

class LeaseResponse(BaseModel):
    id: int
    application_id: int
    apartment_id: int
    tenant_id: int
    start_date: datetime
    end_date: datetime
    monthly_rent: float
    deposit_amount: float
    payment_due_day: int
    lease_status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class LeaseResponseDto(LeaseResponse):
    application: ApplicationResponse
    apartment: Apartment
    tenant: User

class PaymentCreate(BaseModel):
    lease_id: int
    amount: float
    due_date: datetime
    payment_method: Optional[str] = None

class PaymentUpdate(BaseModel):
    payment_date: Optional[datetime] = None
    status: Optional[str] = None
    payment_method: Optional[str] = None

class PaymentResponse(BaseModel):
    id: int
    lease_id: int
    amount: float
    payment_date: Optional[datetime]
    payment_method: Optional[str]
    status: str
    due_date: datetime
    created_at: datetime

    class Config:
        from_attributes = True

class SecurityDepositCreate(BaseModel):
    lease_id: int
    amount: float
    deposit_date: datetime

class SecurityDepositUpdate(BaseModel):
    returned_date: Optional[datetime] = None
    deductions: Optional[float] = None
    status: Optional[str] = None
    notes: Optional[str] = None

class SecurityDepositResponse(BaseModel):
    id: int
    lease_id: int
    amount: float
    deposit_date: datetime
    returned_date: Optional[datetime]
    deductions: float
    status: str
    notes: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True

class LeaseDetailsResponseDto(BaseModel):
    lease: LeaseResponseDto
    payments: list[PaymentResponse]
    security_deposit: Optional[SecurityDepositResponse]