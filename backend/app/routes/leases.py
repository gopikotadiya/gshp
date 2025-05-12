from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..schemas.leaseDto import (
    LeaseCreate, LeaseUpdate, LeaseResponse, LeaseResponseDto, LeaseDetailsResponseDto,
    PaymentCreate, PaymentResponse, PaymentUpdate,
    SecurityDepositCreate, SecurityDepositResponse, SecurityDepositUpdate
)
from ..schemas.applicationDto import ( ApplicationResponse)
from ..schemas.userDto import User
from ..schemas.apartmentsDto import Apartment
from ..service import leaseService, paymentService, securityDepositService

router = APIRouter(prefix="/leases", tags=["Leases"])

@router.post("/", response_model=LeaseResponse)
def create_lease(lease_data: LeaseCreate, db: Session = Depends(get_db)):
    return leaseService.create_lease(db, lease_data)

@router.get("/{lease_id}", response_model=LeaseResponseDto)
def get_lease(lease_id: int, db: Session = Depends(get_db)):
    lease = leaseService.get_lease_by_id(db, lease_id)
    if not lease:
        raise HTTPException(status_code=404, detail="Lease not found")
    return lease

@router.put("/{lease_id}", response_model=LeaseResponse)
def update_lease(lease_id: int, lease_data: LeaseUpdate, db: Session = Depends(get_db)):
    lease = leaseService.update_lease(db, lease_id, lease_data)
    if not lease:
        raise HTTPException(status_code=404, detail="Lease not found")
    return lease

@router.delete("/{lease_id}")
def delete_lease(lease_id: int, db: Session = Depends(get_db)):
    success = leaseService.delete_lease(db, lease_id)
    if not success:
        raise HTTPException(status_code=404, detail="Lease not found")
    return {"message": "Lease deleted successfully"}

# @router.get("/apartment/{apartment_id}", response_model=LeaseDetailsResponseDto)
# def get_apartment_lease_details(apartment_id: int, db: Session = Depends(get_db)):
#     # Get the lease with relationships
#     lease = leaseService.get_leases_by_apartment_id(db, apartment_id)
#     if not lease:
#         raise HTTPException(status_code=404, detail="No active lease found")
    
#     # Convert lease to DTO
#     lease_dto = LeaseResponseDto.from_orm(lease)
    
#     # Get and convert payments
#     payments = [
#         PaymentResponse.from_orm(p) 
#         for p in paymentService.get_payments_by_lease(db, lease.id)
#     ]
    
#     # Get and convert security deposit
#     deposit = None
#     if security_deposit := securityDepositService.get_security_deposit_by_lease(db, lease.id):
#         deposit = SecurityDepositResponse.from_orm(security_deposit)
    
#     # Build the final response
#     return LeaseDetailsResponseDto(
#         lease=lease_dto,
#         payments=payments,
#         security_deposit=deposit
#     )

@router.get("/apartment/{apartment_id}", response_model=LeaseResponseDto)
def get_apartment_lease_details(apartment_id: int, db: Session = Depends(get_db)):
    return leaseService.get_leases_by_apartment_id(db, apartment_id)

@router.post("/{lease_id}/payments", response_model=PaymentResponse)
def create_payment(lease_id: int, payment_data: PaymentCreate, db: Session = Depends(get_db)):
    return paymentService.create_payment(db, lease_id, payment_data)

@router.get("/{lease_id}/payments", response_model=list[PaymentResponse])
def get_lease_payments(lease_id: int, db: Session = Depends(get_db)):
    return paymentService.get_payments_by_lease(db, lease_id)

@router.put("/payments/{payment_id}", response_model=PaymentResponse)
def update_payment(payment_id: int, payment_data: PaymentUpdate, db: Session = Depends(get_db)):
    payment = paymentService.update_payment(db, payment_id, payment_data)
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    return payment

@router.post("/{lease_id}/security-deposit", response_model=SecurityDepositResponse)
def create_security_deposit(lease_id: int, deposit_data: SecurityDepositCreate, db: Session = Depends(get_db)):
    return securityDepositService.create_security_deposit(db, lease_id, deposit_data)

@router.get("/{lease_id}/security-deposit", response_model=list[SecurityDepositResponse])
def get_lease_security_deposit(lease_id: int, db: Session = Depends(get_db)):
    deposits = securityDepositService.get_security_deposit_by_lease(db, lease_id)
    # if security_deposit is None:
    #     return []  
    return deposits or []  

@router.put("/security-deposit/{deposit_id}", response_model=SecurityDepositResponse)
def update_security_deposit(deposit_id: int, deposit_data: SecurityDepositUpdate, db: Session = Depends(get_db)):
    deposit = securityDepositService.update_security_deposit(db, deposit_id, deposit_data)
    if not deposit:
        raise HTTPException(status_code=404, detail="Security deposit not found")
    return deposit




@router.get("/tenant/{tenant_id}", response_model=list[LeaseResponseDto])
def get_leases_by_tenant(tenant_id: int, db: Session = Depends(get_db)):
    return leaseService.get_leases_by_tenant_id(db, tenant_id)