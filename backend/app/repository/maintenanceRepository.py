from ..models import MaintenanceRequest

def get_maintenance_requests(db, skip: int, limit: int):
    return db.query(MaintenanceRequest).offset(skip).limit(limit).all()

def update_maintenance_request(db, request_id: int, maintenance_data):
    request = db.query(MaintenanceRequest).filter(MaintenanceRequest.id == request_id).first()
    if request:
        for key, value in maintenance_data.dict().items():
            setattr(request, key, value)
        db.commit()
        db.refresh(request)
    return request