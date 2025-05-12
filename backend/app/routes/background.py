from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..schemas.backgroundDto import BackgroundCheckResponse, BackgroundCheckVerify, BackgroundCheckCreate, BackgroundCheckStatusUpdate, BackgroundCheckResponseDto
from ..schemas.applicationDto import ApplicationUpdate
from ..service import backgroundService, applicationSrevice
from ..models import BackgroundCheck, Application, ApplicationStatus
from typing import List

router = APIRouter(prefix="/background-checks", tags=["Background Checks"])

@router.post("", response_model=BackgroundCheckResponse)
def create_background_check(
    # application_id: int,
    background_check: BackgroundCheckCreate,
    db: Session = Depends(get_db)
):
    application = applicationSrevice.get_application_by_id(db, background_check.application_id)
    print(application)
    update_data = ApplicationUpdate(
        status="under_review",
        # lease_duration=application.lease_duration,
        # desired_move_in_date=application.desired_move_in_date,
        # application_notes=application.application_notes
    )
    applicationSrevice.update_application(db, application.id, update_data)
    print(background_check.application_id)
    return backgroundService.create_background_check(db, background_check)

@router.put("/{check_id}", response_model=BackgroundCheckResponse)
def update_background_check_status(
    check_id: int,
    status_update: BackgroundCheckStatusUpdate,
    db: Session = Depends(get_db)
):
    check = db.query(BackgroundCheck).get(check_id)
    if not check:
        raise HTTPException(status_code=404, detail="Background check not found")
    print(check.application_id)
    application = applicationSrevice.get_application_by_id(db, check.application_id) 

    if application and application.status == "under_review":
        print(status_update.status.value)
        updatedStatus = "background_verified" if status_update.status.value == "approved" else "rejected"
        print(updatedStatus)
        update_data = ApplicationUpdate(
            status= updatedStatus
        )
        try:
            applicationSrevice.update_application(db, application.id, update_data)
        except Exception as e:
            print("Update failed:", e)
    
    
    return backgroundService.update_background_check_status(db, check_id, status_update)

@router.get("/", response_model=List[BackgroundCheckResponseDto])
def get_background_checks(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return backgroundService.get_background_checks(db, skip, limit)

@router.post("/{check_id}/verify", response_model=BackgroundCheckResponse)
def verify_background_check(
    check_id: int,
    verify_data: BackgroundCheckVerify,
    db: Session = Depends(get_db)
):
    check = backgroundService.verify_background_check(db, check_id, verify_data)
    if not check:
        raise HTTPException(status_code=404, detail="Background check not found")
    return check