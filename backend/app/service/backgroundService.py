from sqlalchemy.orm import Session
from ..repository import backgroundRepository
from ..schemas.backgroundDto import BackgroundCheckCreate, BackgroundCheckStatusUpdate

def create_background_check(db: Session, background_check: BackgroundCheckCreate):
    return backgroundRepository.create_background_check(db, background_check)

def update_background_check_status(db: Session, check_id: int, status_update: BackgroundCheckStatusUpdate):
    return backgroundRepository.update_background_check_status(db, check_id, status_update)

def get_background_checks(db: Session, skip: int, limit: int):
    return backgroundRepository.get_background_checks(db, skip, limit)

def verify_background_check(db: Session, check_id: int, verify_data):
    return backgroundRepository.verify_background_check(db, check_id, verify_data)