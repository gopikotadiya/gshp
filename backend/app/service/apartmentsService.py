from sqlalchemy.orm import Session
from ..repository.apartmentsRepository import (
    create_apartment, get_apartment_by_id, update_apartment, delete_apartment, get_apartments, get_apartments_by_landlord, get_available_apartments, list_rented_apartments_by_landlord
)
from ..schemas.apartmentsDto import ApartmentCreate, ApartmentUpdate
import shutil
from pathlib import Path


def create_apartment_service(db: Session, apartment: ApartmentCreate):
    return create_apartment(db, apartment)


def get_apartment_service(db: Session, apartment_id: int):
    return get_apartment_by_id(db, apartment_id)


def update_apartment_service(db: Session, apartment_id: int, apartment: ApartmentUpdate):
    existing_apartment = get_apartment_by_id(db, apartment_id)
    if not existing_apartment:
        return None
    return update_apartment(db, apartment_id, apartment)


def delete_apartment_service(db: Session, apartment_id: int):
    existing_apartment = get_apartment_by_id(db, apartment_id)
    if not existing_apartment:
        return None
    deleted_apartment = delete_apartment(db, apartment_id)
    if deleted_apartment:
        try:
            base_dir = Path("static/apartments")
            landlord_dir = base_dir / f"apt_{deleted_apartment.landlord_id}"
            apartment_dir = landlord_dir / f"aptID_{deleted_apartment.id}"
            if apartment_dir.exists():
                shutil.rmtree(apartment_dir)
                print(f"Deleted apartment directory: {apartment_dir}")
            if landlord_dir.exists() and not any(landlord_dir.iterdir()):
                landlord_dir.rmdir()
                print(f"Removed empty landlord directory: {landlord_dir}")
        except Exception as e:
            print(f"Error deleting files: {str(e)}")
    return deleted_apartment


def list_apartments_service(db: Session, skip: int, limit: int):
    return get_apartments(db, skip, limit)

def list_apartments_by_landlord_service(db: Session, landlord_id:int, skip: int, limit: int):
    return get_apartments_by_landlord(db, landlord_id, skip, limit)

def list_rented_apartments_by_landlord_service(db: Session, landlord_id:int, skip: int, limit: int):
    return list_rented_apartments_by_landlord(db, landlord_id, skip, limit)

#  ------------------------------------------TENANT-------------------------------------------

def list_available_apartments_service(db: Session, skip: int, limit: int):
    return get_available_apartments(db, skip, limit)
