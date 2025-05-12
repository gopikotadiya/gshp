from sqlalchemy.orm import Session
from ..repository import paymentRepository
from ..schemas.leaseDto import PaymentCreate, PaymentUpdate

def create_payment(db: Session, lease_id: int, payment_data: PaymentCreate):
    return paymentRepository.create_payment(db, lease_id, payment_data)

def get_payments_by_lease(db: Session, lease_id: int):
    return paymentRepository.get_payments_by_lease(db, lease_id)

def update_payment(db: Session, payment_id: int, payment_data: PaymentUpdate):
    return paymentRepository.update_payment(db, payment_id, payment_data)
