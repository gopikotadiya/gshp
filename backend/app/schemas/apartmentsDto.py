from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

# Base Apartment schema for basic fields
class ApartmentBase(BaseModel):
    title: str
    address: str
    apartment_number: Optional[str] = None
    city: str
    state: str
    zip_code: str
    price: float
    bedrooms: int
    bathrooms: int
    availability: bool = True
    images: Optional[List[str]] = []

# Schema for creating a new Apartment
class ApartmentCreate(ApartmentBase):
    landlord_id: int

# Schema for updating an Apartment (allows partial updates)
class ApartmentUpdate(ApartmentBase):
    availability: Optional[bool] = None
    price: Optional[float] = None
    images: Optional[List[str]] = None

# Schema for Apartment response (with all details)
class Apartment(ApartmentBase):
    id: int
    landlord_id: int
    created_at: datetime
    is_deleted: bool = False

    class Config:
        orm_mode = True

# Schema for listing apartments (without full detail)
class ApartmentList(ApartmentBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True
