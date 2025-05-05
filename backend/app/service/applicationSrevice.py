from sqlalchemy.orm import Session
from ..repository import applicationRepository
from ..schemas.applicationDto import ApplicationCreate, ApplicationUpdate

def create_application(db: Session, application_data: ApplicationCreate):
    return applicationRepository.create_application(db, application_data)

def get_application_by_id(db: Session, application_id: int):
    return applicationRepository.get_application_by_id(db, application_id)

def get_all_applications_service(db: Session, skip: int, limit: int):
    return applicationRepository.get_all_applications(db=db, skip=skip, limit=limit)

def update_application(db: Session, application_id: int, application_data: ApplicationUpdate):
    return applicationRepository.update_application(db, application_id, application_data)

def delete_application(db: Session, application_id: int):
    return applicationRepository.delete_application(db, application_id)

def get_application_by_tenant_id(db: Session, tenant_id: int):
    return applicationRepository.get_application_by_tenant_id(db, tenant_id)
