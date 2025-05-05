from sqlalchemy.orm import Session
from ..repository import leaseRepository
from ..schemas.leaseDto import LeaseCreate, LeaseUpdate

def create_lease(db: Session, lease_data: LeaseCreate):
    return leaseRepository.create_lease(db, lease_data)

def get_lease_by_id(db: Session, lease_id: int):
    return leaseRepository.get_lease_by_id(db, lease_id)

def update_lease(db: Session, lease_id: int, lease_data: LeaseUpdate):
    return leaseRepository.update_lease(db, lease_id, lease_data)

def delete_lease(db: Session, lease_id: int):
    return leaseRepository.delete_lease(db, lease_id)

def get_leases_by_tenant_id(db: Session, tenant_id: int):
    return leaseRepository.get_leases_by_tenant_id(db, tenant_id)

def get_leases_by_apartment_id(db: Session, apartment_id: int):
    return leaseRepository.get_leases_by_apartment_id(db, apartment_id)
