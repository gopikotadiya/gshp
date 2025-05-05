from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from ..database import get_db
from ..schemas.applicationDto import ApplicationCreate, ApplicationUpdate, ApplicationResponse, ApplicationResponseDto
from ..service import applicationSrevice
from typing import List

router = APIRouter(prefix="/applications", tags=["Applications"])

@router.post("/", response_model=ApplicationResponse)
def create_application(application_data: ApplicationCreate, db: Session = Depends(get_db)):
    return applicationSrevice.create_application(db, application_data)

@router.get("/{application_id}", response_model=ApplicationResponse)
def get_application(application_id: int, db: Session = Depends(get_db)):
    application = applicationSrevice.get_application_by_id(db, application_id)
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    return application

@router.get("/", response_model=List[ApplicationResponseDto])
def get_all_applications_route(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return applicationSrevice.get_all_applications_service(db=db, skip=skip, limit=limit)


@router.put("/{application_id}", response_model=ApplicationResponse)
def update_application(application_id: int, application_data: ApplicationUpdate, db: Session = Depends(get_db)):
    application = applicationSrevice.update_application(db, application_id, application_data)
    if not application:
        raise HTTPException(status_code=400, detail="Application cannot be updated or does not exist")
    return application

@router.delete("/{application_id}")
def delete_application(application_id: int, db: Session = Depends(get_db)):
    success = applicationSrevice.delete_application(db, application_id)
    if not success:
        raise HTTPException(status_code=404, detail="Application not found")
    return {"message": "Application deleted successfully"}


# @router.get("/", response_model=List[ApplicationResponse])
# def get_applications(
#     status: str = Query(None, description="Filter by status", enum=["pending"]),
#     skip: int = 0, 
#     limit: int = 10, 
#     db: Session = Depends(get_db)
# ):
#     return applicationSrevice.get_applications(db, status, skip, limit)

@router.get("/tenant/{tenant_id}", response_model=List[ApplicationResponse])
def get_application(tenant_id: int, db: Session = Depends(get_db)):
    applications = applicationSrevice.get_application_by_tenant_id(db, tenant_id)
    return applications
