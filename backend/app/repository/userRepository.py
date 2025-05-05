from sqlalchemy.orm import Session
from ..models import User as DBUser
from ..schemas.userDto import UserCreate, User, UserUpdate, UserTenant
from ..utils.security import get_password_hash
from sqlalchemy import or_

def create_user(db, user: UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = DBUser(email=user.email, first_name=user.first_name, last_name=user.last_name, password=hashed_password, role=user.role, is_deleted=False)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return User(
        id=db_user.id,
        email=db_user.email,
        first_name=db_user.first_name,
        last_name=db_user.last_name,
        role=db_user.role,
        created_at=db_user.created_at,
        phone_number=db_user.phone_number,
        address=db_user.address,
        location=db_user.location,
        preference=db_user.preference,
        looking_for_roommate=db_user.looking_for_roommate,
        is_deleted=db_user.is_deleted
    )

def update_user(db, user_id: int, user_update: UserUpdate):
    db_user = db.query(DBUser).filter(DBUser.id == user_id).first()
    
    if not db_user:
        return None  
    print(user_update)
    if user_update.address is not None:
        db_user.address = user_update.address
    if user_update.location is not None:
        db_user.location = user_update.location
    if user_update.preference is not None:
        db_user.preference = user_update.preference
    if user_update.looking_for_roommate is not None:
        db_user.looking_for_roommate = user_update.looking_for_roommate
    

    db.commit()
    db.refresh(db_user)

    return User(
        id=db_user.id,
        email=db_user.email,
        first_name=db_user.first_name,
        last_name=db_user.last_name,
        role=db_user.role,
        created_at=db_user.created_at,
        address=db_user.address,
        location=db_user.location,
        preference=db_user.preference,
        looking_for_roommate=db_user.looking_for_roommate
    )


def get_tenants_looking_for_roommates(db, current_user_id: int):
    tenants = db.query(DBUser).filter(
        DBUser.role == "tenant",
        DBUser.looking_for_roommate == True,
        DBUser.id != current_user_id
    ).all()

    return [UserTenant.from_orm(tenant) for tenant in tenants]

def get_users_by_role(db: Session, skip: int = 0, limit: int = 10):
    query = db.query(DBUser).filter(
        DBUser.role.in_(['tenant', 'landlord']),
        DBUser.is_deleted == False
        ).offset(skip).limit(limit).all()
    
    return query

def update_user_status(db, user_id: int, user_data):
    user = db.query(DBUser).filter(DBUser.id == user_id).first()
    if user:
        for key, value in user_data.dict().items():
            setattr(user, key, value)
        db.commit()
        db.refresh(user)
    return user