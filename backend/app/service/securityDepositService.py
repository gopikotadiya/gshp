from sqlalchemy.orm import Session
from ..repository import securityDepositRepository
from ..schemas.leaseDto import SecurityDepositCreate, SecurityDepositUpdate

def create_security_deposit(db: Session, lease_id: int, deposit_data: SecurityDepositCreate):
    return securityDepositRepository.create_security_deposit(db, lease_id, deposit_data)

def update_security_deposit(db: Session, deposit_id: int, deposit_data: SecurityDepositUpdate):
    return securityDepositRepository.update_security_deposit(db, deposit_id, deposit_data)

def get_security_deposit_by_lease(db: Session, lease_id: int):
    return securityDepositRepository.get_security_deposit_by_lease(db, lease_id)
