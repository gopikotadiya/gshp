from sqlalchemy.orm import Session
from ..models import Apartment
from ..schemas.apartmentsDto import ApartmentCreate, ApartmentUpdate
from ..schemas.userDto import User
from sqlalchemy.orm import selectinload


def create_apartment(db: Session, apartment: ApartmentCreate):
    db_apartment = Apartment(
        title=apartment.title,
        address=apartment.address,
        apartment_number=apartment.apartment_number,
        city=apartment.city,
        state=apartment.state,
        zip_code=apartment.zip_code,
        price=apartment.price,
        bedrooms=apartment.bedrooms,
        bathrooms=apartment.bathrooms,
        landlord_id=apartment.landlord_id,
        availability=apartment.availability,
        images=apartment.images
    )
    db.add(db_apartment)
    db.commit()
    db.refresh(db_apartment)
    return db_apartment


def get_apartment_by_id(db: Session, apartment_id: int):
    return db.query(Apartment).filter(Apartment.id == apartment_id, Apartment.is_deleted == False).first()


def update_apartment(db: Session, apartment_id: int, apartment: ApartmentUpdate):
    db_apartment = db.query(Apartment).filter(Apartment.id == apartment_id, Apartment.is_deleted == False).first()
    if db_apartment:
        for key, value in apartment.dict(exclude_unset=True).items():
            setattr(db_apartment, key, value)
        db.commit()
        db.refresh(db_apartment)
        return db_apartment
    return None


def delete_apartment(db: Session, apartment_id: int):
    db_apartment = db.query(Apartment).filter(Apartment.id == apartment_id).first()
    if db_apartment:
        db_apartment.is_deleted = True
        db.commit()
        return db_apartment
    return None


def get_apartments(db: Session, skip: int = 0, limit: int = 10):
    return db.query(Apartment).filter(Apartment.is_deleted == False).offset(skip).limit(limit).all()

def get_apartments_by_landlord(db: Session, landlord_id: int, skip: int = 0, limit: int = 10):
    return db.query(Apartment).filter(Apartment.landlord_id == landlord_id,Apartment.is_deleted == False).offset(skip).limit(limit).all()

def list_rented_apartments_by_landlord(db: Session, landlord_id: int, skip: int = 0, limit: int = 10):
    return db.query(Apartment).filter(Apartment.landlord_id == landlord_id,Apartment.availability == False,Apartment.is_deleted == False).offset(skip).limit(limit).all()

def get_available_apartments(db: Session, skip: int = 0, limit: int = 10):
    return db.query(Apartment).filter(
        Apartment.is_deleted == False,
        Apartment.availability == True
    ).offset(skip).limit(limit).all()