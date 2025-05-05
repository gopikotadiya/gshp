from sqlalchemy.orm import Session
from ..repository import maintenanceRepository

def get_maintenance_requests(db: Session, skip: int, limit: int):
    return maintenanceRepository.get_maintenance_requests(db, skip, limit)

def update_maintenance_request(db: Session, request_id: int, maintenance_data):
    return maintenanceRepository.update_maintenance_request(db, request_id, maintenance_data)