from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..schemas.userDto import UserUpdate, User, UserTenant  
from ..models import User as DBUser  
from ..repository.userRepository import update_user, get_tenants_looking_for_roommates
from ..database import get_db
from ..auth import get_current_user

router = APIRouter(prefix="/profile", tags=["User"])

@router.put("/{user_id}", response_model=User)
def update_profile(user_id: int, user_update: UserUpdate, db: Session = Depends(get_db)):
    updated_user = update_user(db, user_id, user_update)
    print(user_update)
    return updated_user

@router.get("/looking-for-roommates/{user_id}", response_model=List[UserTenant])
def get_tenants(user_id: int, db: Session = Depends(get_db)):
    tenants = get_tenants_looking_for_roommates(db, user_id)
    return tenants