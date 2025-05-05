from sqlalchemy import Column, Integer, String, DateTime, func, Numeric, Boolean, ARRAY, ForeignKey, Text
from sqlalchemy.orm import relationship
from .database import Base
from enum import Enum

class ApplicationStatus(str, Enum):
    PENDING = "pending"
    UNDER_REVIEW = "under_review"
    BACKGROUND_VERIFIED = "background_verified"
    APPROVED = "approved"
    REJECTED = "rejected"

class BackgroundCheckStatus(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"

class MaintenanceStatus(str, Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"

class UrgencyLevel(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    email = Column(String, unique=True, index=True, nullable=False)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    role = Column(String, nullable=False, default="tenant")
    password = Column(String, nullable=False)
    created_at = Column(DateTime, default=func.now())
    phone_number = Column(String, nullable=True)  
    address = Column(String, nullable=True)
    location = Column(String, nullable=True)
    preference = Column(Text, nullable=True)
    looking_for_roommate = Column(Boolean, default=False)
    is_deleted = Column(Boolean, default=False)

    apartments = relationship("Apartment", back_populates="landlord")
    maintenance_requests = relationship("MaintenanceRequest", back_populates="tenant")
    background_checks = relationship("BackgroundCheck", back_populates="tenant")
    applications = relationship("Application", back_populates="tenant")

class Apartment(Base):
    __tablename__ = "apartments"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    landlord_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    title = Column(String, nullable=False)
    address = Column(String, nullable=False)
    apartment_number = Column(String, nullable=True)
    city = Column(String, nullable=False)
    state = Column(String, nullable=False)
    zip_code = Column(String, nullable=False)
    price = Column(Numeric(10, 2), nullable=False)
    bedrooms = Column(Integer, nullable=False)
    bathrooms = Column(Integer, nullable=False)
    availability = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())
    is_deleted = Column(Boolean, default=False)
    images = Column(ARRAY(String), nullable=True)

    landlord = relationship("User", back_populates="apartments")
    maintenance_requests = relationship("MaintenanceRequest", back_populates="apartment")
    background_checks = relationship("BackgroundCheck", back_populates="apartment")
    applications = relationship("Application", back_populates="apartment") 

class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    tenant_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    apartment_id = Column(Integer, ForeignKey("apartments.id"), nullable=False)
    status = Column(String, nullable=False, default=ApplicationStatus.PENDING)
    admin_notes = Column(String, nullable=True)  
    background_check_status = Column(String, nullable=True, default=BackgroundCheckStatus.PENDING) 
    submitted_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    lease_duration = Column(Integer, nullable=True)
    desired_move_in_date = Column(DateTime, nullable=True)
    application_notes = Column(Text, nullable=True)
    is_deleted = Column(Boolean, default=False)

    tenant = relationship("User", back_populates="applications")
    apartment = relationship("Apartment", back_populates="applications")
    background_checks = relationship("BackgroundCheck", back_populates="application")
    lease = relationship("Lease", back_populates="application")

class MaintenanceRequest(Base):
    __tablename__ = "maintenance_requests"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    apartment_id = Column(Integer, ForeignKey('apartments.id'), nullable=False)
    tenant_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    description = Column(String, nullable=False)
    urgency = Column(String, nullable=False, default=UrgencyLevel.MEDIUM)
    status = Column(String, nullable=False, default=MaintenanceStatus.PENDING)
    created_at = Column(DateTime, server_default=func.now())
    completed_at = Column(DateTime, nullable=True)

    apartment = relationship("Apartment", back_populates="maintenance_requests")
    tenant = relationship("User", back_populates="maintenance_requests")

class BackgroundCheck(Base):
    __tablename__ = "background_checks"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    apartment_id = Column(Integer, ForeignKey('apartments.id'), nullable=False)
    tenant_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    application_id = Column(Integer, ForeignKey('applications.id'), nullable=True)
    status = Column(String, nullable=False, default="pending")
    report_url = Column(String, nullable=True)
    requested_at = Column(DateTime, server_default=func.now())
    completed_at = Column(DateTime, nullable=True)

    tenant = relationship("User", back_populates="background_checks")
    apartment = relationship("Apartment", back_populates="background_checks")
    application = relationship("Application", back_populates="background_checks")

class Lease(Base):
    __tablename__ = "leases"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    application_id = Column(Integer, ForeignKey('applications.id'), unique=True, nullable=False)
    apartment_id = Column(Integer, ForeignKey('apartments.id'), nullable=False)
    tenant_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=False)
    monthly_rent = Column(Numeric(10, 2), nullable=False)
    deposit_amount = Column(Numeric(10, 2), nullable=False)
    payment_due_day = Column(Integer, nullable=False)
    lease_status = Column(String, default="active")
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    is_deleted = Column(Boolean, default=False)

    application = relationship("Application", back_populates="lease")
    apartment = relationship("Apartment")
    tenant = relationship("User")
    payments = relationship("Payment", back_populates="lease")
    security_deposit = relationship("SecurityDeposit", back_populates="lease", uselist=False)

class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    lease_id = Column(Integer, ForeignKey('leases.id'), nullable=False)
    amount = Column(Numeric(10, 2), nullable=False)
    payment_date = Column(DateTime, nullable=True)
    payment_method = Column(String, nullable=True)
    status = Column(String, default="pending")
    due_date = Column(DateTime, nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    is_deleted = Column(Boolean, default=False)

    lease = relationship("Lease", back_populates="payments")

class SecurityDeposit(Base):
    __tablename__ = "security_deposits"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    lease_id = Column(Integer, ForeignKey('leases.id'), nullable=False)
    amount = Column(Numeric(10, 2), nullable=False)
    deposit_date = Column(DateTime, nullable=False)
    returned_date = Column(DateTime, nullable=True)
    deductions = Column(Numeric(10, 2), default=0)
    status = Column(String, default="held")
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    is_deleted = Column(Boolean, default=False)

    lease = relationship("Lease", back_populates="security_deposit")

                    