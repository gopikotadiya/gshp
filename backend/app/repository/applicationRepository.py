from sqlalchemy.orm import Session, joinedload
from ..models import Application
from ..schemas.applicationDto import ApplicationCreate, ApplicationUpdate

def create_application(db: Session, application_data: ApplicationCreate):
    new_application = Application(**application_data.model_dump())
    db.add(new_application)
    db.commit()
    db.refresh(new_application)
    return new_application

def get_application_by_id(db: Session, application_id: int):
    return db.query(Application).filter(Application.id == application_id, Application.is_deleted == False).first()

def get_all_applications(db: Session, skip: int = 0, limit: int = 10):
    return db.query(Application).filter(Application.is_deleted == False) \
        .options(joinedload(Application.tenant), joinedload(Application.apartment)) \
        .offset(skip).limit(limit).all()

def update_application(db: Session, application_id: int, application_data: ApplicationUpdate):
    application = db.query(Application).filter(Application.id == application_id).first()
    if not application:
        return None
    for key, value in application_data.model_dump(exclude_unset=True).items():
        setattr(application, key, value)
    db.commit()
    db.refresh(application)
    return application

def delete_application(db: Session, application_id: int):
    application = db.query(Application).filter(Application.id == application_id).first()
    if application:
        application.is_deleted = True
        db.commit()
        return True
    return False

def get_application_by_tenant_id(db: Session, tenant_id: int):
    return db.query(Application).filter(Application.tenant_id == tenant_id, Application.is_deleted == False).all()
