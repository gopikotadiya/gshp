
from sqlalchemy.orm import Session
from ..models import SecurityDeposit

def create_security_deposit(db: Session, lease_id: int, deposit_data):
    new_deposit = SecurityDeposit(**deposit_data.dict(), lease_id=lease_id)
    db.add(new_deposit)
    db.commit()
    db.refresh(new_deposit)
    return new_deposit

def update_security_deposit(db: Session, deposit_id: int, deposit_data):
    deposit = db.query(SecurityDeposit).filter(SecurityDeposit.id == deposit_id).first()
    if not deposit:
        return None
    for key, value in deposit_data.dict(exclude_unset=True).items():
        setattr(deposit, key, value)
    db.commit()
    db.refresh(deposit)
    return deposit

def get_security_deposit_by_lease(db: Session, lease_id: int):
    return db.query(SecurityDeposit).filter(
        SecurityDeposit.lease_id == lease_id,
        SecurityDeposit.is_deleted == False
    ).all()