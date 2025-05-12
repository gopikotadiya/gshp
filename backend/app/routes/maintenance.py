from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..schemas.maintenanceDto import MaintenanceResponse, MaintenanceUpdate
from ..service import maintenanceService
from typing import List

router = APIRouter(prefix="/maintenance-requests", tags=["Maintenance Requests"])

@router.get("/", response_model=List[MaintenanceResponse])
def get_maintenance_requests(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return maintenanceService.get_maintenance_requests(db, skip, limit)

@router.patch("/{request_id}", response_model=MaintenanceResponse)
def update_maintenance_request(
    request_id: int,
    maintenance_data: MaintenanceUpdate,
    db: Session = Depends(get_db)
):
    request = maintenanceService.update_maintenance_request(db, request_id, maintenance_data)
    if not request:
        raise HTTPException(status_code=404, detail="Maintenance request not found")
    return request