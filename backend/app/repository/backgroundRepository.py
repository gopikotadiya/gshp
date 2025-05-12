from ..models import BackgroundCheck, BackgroundCheckStatus
from ..schemas.backgroundDto import BackgroundCheckCreate, BackgroundCheckStatusUpdate
from sqlalchemy import func
from sqlalchemy.orm import joinedload

def create_background_check(db, background_check: BackgroundCheckCreate):
    db_check = BackgroundCheck(
        tenant_id=background_check.tenant_id,
        apartment_id=background_check.apartment_id,
        application_id=background_check.application_id,
        status=BackgroundCheckStatus.PENDING
    )
    db.add(db_check)
    db.commit()
    db.refresh(db_check)
    return db_check

def update_background_check_status(db, check_id: int, status_update: BackgroundCheckStatusUpdate):
    check = db.query(BackgroundCheck).filter(BackgroundCheck.id == check_id).first()
    if check:
        check.status = status_update.status
        if check.status != BackgroundCheckStatus.PENDING:
            check.completed_at = func.now()
        db.commit()
        db.refresh(check)
    return check

def get_background_checks(db, skip: int, limit: int):
    return db.query(BackgroundCheck)\
             .options(
                 joinedload(BackgroundCheck.tenant),
                 joinedload(BackgroundCheck.apartment),
                 joinedload(BackgroundCheck.application)
             )\
             .offset(skip)\
             .limit(limit)\
             .all()

def verify_background_check(db, check_id: int, verify_data):
    check = db.query(BackgroundCheck).filter(BackgroundCheck.id == check_id).first()
    if check:
        check.status = verify_data.status
        check.completed_at = func.now()
        db.commit()
        db.refresh(check)
    return check