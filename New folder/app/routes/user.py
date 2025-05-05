from fastapi import APIRouter, Depends, HTTPException, Query, status, Request
from sqlalchemy.orm import Session
from ..database import get_db
from ..schemas.userDto import User, UserUpdate, UserCreate, Token, UserTenant
from ..models import User as DBUser
from ..service import userService
from ..auth import authenticate_user, create_access_token, get_current_user
from ..repository.userRepository import create_user
from typing import List

router = APIRouter(prefix="/user", tags=["Users"])

# Registration and Authentication Endpoints
@router.post("/register", response_model=User)
def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(DBUser).filter(DBUser.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return create_user(db, user)

@router.post("/login", response_model=Token)
def login(email: str, password: str, db: Session = Depends(get_db)):
    user = authenticate_user(db, email, password)
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    access_token = create_access_token(data={"sub": user.email})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": User.from_orm(user)
    }

# @router.post("/login", response_model=Token)
# def login(email: str, password: str, db: Session = Depends(get_db)):
#     user = authenticate_user(db, email, password)
#     if not user:
#         raise HTTPException(status_code=400, detail="Incorrect email or password")
#     access_token = create_access_token(data={"sub": user.email})
#     user_schema = User(
#         id=user.id,
#         email=user.email,
#         first_name=user.first_name,
#         last_name=user.last_name,
#         role=user.role,
#         created_at=user.created_at,
#         address=user.address,
#         location=user.location,
#         preference=user.preference,
#         looking_for_roommate=user.looking_for_roommate
#     )

#     return {
#         "access_token": access_token,
#         "token_type": "bearer",
#         "user": user_schema  # Include the user details in the response
#     }

@router.post("/logout")
def logout(current_user: DBUser = Depends(get_current_user)):
    return {"message": "Logged out successfully"}

@router.put("/{user_id}", response_model=User)
def update_profile(user_id: int, user_update: UserUpdate, db: Session = Depends(get_db)):
    updated_user = userService.update_user(db, user_id, user_update)
    print(user_update)
    return updated_user

@router.get("/roommates/{user_id}", response_model=List[UserTenant])
def get_tenants(user_id: int, db: Session = Depends(get_db)):
    tenants = userService.get_tenants_looking_for_roommates(db, user_id)
    return tenants

@router.get("/", response_model=List[User])
def get_users(
    
    skip: int = 0, 
    limit: int = 10,
    db: Session = Depends(get_db)
):
    return userService.get_users(db=db, skip=skip, limit=limit)

@router.put("/{user_id}/status", response_model=User)
def update_user_status(
    user_id: int, 
    user_data: UserUpdate,
    db: Session = Depends(get_db)
):
    user = userService.update_user_status(db, user_id, user_data)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user