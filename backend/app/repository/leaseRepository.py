from sqlalchemy.orm import Session, joinedload
from ..models import Lease

def create_lease(db: Session, lease_data):
    new_lease = Lease(**lease_data.dict())
    db.add(new_lease)
    db.commit()
    db.refresh(new_lease)
    return new_lease

def get_lease_by_id(db: Session, lease_id: int):
    return db.query(Lease).options(
        joinedload(Lease.application),
        joinedload(Lease.apartment),
        joinedload(Lease.tenant)
    ).filter(Lease.id == lease_id, Lease.is_deleted == False).first()

def update_lease(db: Session, lease_id: int, lease_data):
    lease = db.query(Lease).filter(Lease.id == lease_id).first()
    if not lease:
        return None
    for key, value in lease_data.dict(exclude_unset=True).items():
        setattr(lease, key, value)
    db.commit()
    db.refresh(lease)
    return lease

def delete_lease(db: Session, lease_id: int):
    lease = db.query(Lease).filter(Lease.id == lease_id).first()
    if lease:
        lease.is_deleted = True
        db.commit()
        return True
    return False

def get_leases_by_tenant_id(db: Session, tenant_id: int):
    return db.query(Lease).options(
        joinedload(Lease.application),
        joinedload(Lease.apartment),
        joinedload(Lease.tenant)
    ).filter(
        Lease.tenant_id == tenant_id,
        Lease.is_deleted == False
    ).all()

def get_leases_by_apartment_id(db: Session, apartment_id: int):
    return db.query(Lease).options(
        joinedload(Lease.application),
        joinedload(Lease.apartment),
        joinedload(Lease.tenant),
        joinedload(Lease.payments),
        joinedload(Lease.security_deposit)
    ).filter(
        Lease.apartment_id == apartment_id,
        Lease.is_deleted == False
    ).first()