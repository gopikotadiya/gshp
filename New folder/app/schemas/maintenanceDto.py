from pydantic import BaseModel
from datetime import datetime

class MaintenanceResponse(BaseModel):
    id: int
    apartment_id: int
    tenant_id: int
    description: str
    urgency: str
    status: str
    created_at: datetime
    completed_at: datetime | None

class MaintenanceUpdate(BaseModel):
    status: str | None = None
    completed_at: datetime | None = None
