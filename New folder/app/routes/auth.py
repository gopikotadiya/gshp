from fastapi import APIRouter, Depends, HTTPException, status
from ..schemas.userDto import UserCreate, Token, User  
from ..models import User as DBUser  
from ..repository.userRepository import create_user
from ..auth import authenticate_user, create_access_token, get_current_user
from ..database import get_db
from sqlalchemy.orm import Session

router = APIRouter(prefix="", tags=["User"])

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
    user_schema = User(
        id=user.id,
        email=user.email,
        first_name=user.first_name,
        last_name=user.last_name,
        role=user.role,
        created_at=user.created_at,
        address=user.address,
        location=user.location,
        preference=user.preference,
        looking_for_roommate=user.looking_for_roommate
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user_schema  
    }

@router.post("/logout")
def logout(current_user: DBUser = Depends(get_current_user)):  
    return {"message": "Logged out successfully"}

