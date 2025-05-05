from sqlalchemy.orm import Session
from ..models import Payment

def create_payment(db: Session, lease_id: int, payment_data):
    new_payment = Payment(**payment_data.dict(), lease_id=lease_id)
    db.add(new_payment)
    db.commit()
    db.refresh(new_payment)
    return new_payment

def get_payments_by_lease(db: Session, lease_id: int):
    return db.query(Payment).filter(
        Payment.lease_id == lease_id,
        Payment.is_deleted == False
    ).all()

def update_payment(db: Session, payment_id: int, payment_data):
    payment = db.query(Payment).filter(Payment.id == payment_id).first()
    if not payment:
        return None
    for key, value in payment_data.dict(exclude_unset=True).items():
        setattr(payment, key, value)
    db.commit()
    db.refresh(payment)
    return payment
