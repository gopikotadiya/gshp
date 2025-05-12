from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from .utils.security import verify_password, create_access_token, SECRET_KEY, ALGORITHM
from .schemas.userDto import TokenData, User
from .database import SessionLocal
from .models import User as DBUser

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def authenticate_user(db, email: str, password: str):
    user = db.query(DBUser).filter(DBUser.email == email).first()
    if not user or not verify_password(password, user.password):
        return False
    return user

def get_current_user(db=Depends(get_db), token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email)
    except JWTError:
        raise credentials_exception
    user = db.query(DBUser).filter(DBUser.email == token_data.email).first()
    if user is None:
        raise credentials_exception
    return user