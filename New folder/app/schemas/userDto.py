from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str

class UserCreate(UserBase):
    password: str
    role: str

class User(UserBase):
    id: int
    role: str
    created_at: datetime
    address: Optional[str]
    location: Optional[str]
    preference: Optional[str]
    looking_for_roommate: Optional[bool]
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: User

class TokenData(BaseModel):
    email: str | None = None

class UserUpdate(BaseModel):
    # email: Optional[EmailStr]
    # first_name: Optional[str]
    # last_name: Optional[str]
    address: Optional[str]
    location: Optional[str]
    preference: Optional[str]
    looking_for_roommate: Optional[bool]

    class Config:
        orm_mode = True

class UserTenant(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    address: Optional[str]
    location: Optional[str]
    preference: Optional[str]
    looking_for_roommate: bool

    class Config:
        from_attributes = True