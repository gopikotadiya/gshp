from .models import User as DBUser
from .schemas.userDto import UserCreate, User
from .utils.security import get_password_hash

def create_user(db, user: UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = DBUser(email=user.email, first_name=user.first_name, last_name=user.last_name, password=hashed_password, role=user.role)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return User(
        id=db_user.id,
        email=db_user.email,
        first_name=db_user.first_name,
        last_name=db_user.last_name,
        role=db_user.role,
        created_at=db_user.created_at
    )