from sqlalchemy.orm import Session
from ..repository import userRepository

def get_users(db: Session, skip: int, limit: int):
    return userRepository.get_users_by_role(db, skip, limit)

def update_user(db: Session, user_id: int, user_data):
    return userRepository.update_user(db, user_id, user_data)

def update_user_status(db: Session, user_id: int, user_data):
    return userRepository.update_user_status(db, user_id, user_data)

def get_tenants_looking_for_roommates(db: Session, user_id: int):
    return userRepository.get_tenants_looking_for_roommates(db, user_id)