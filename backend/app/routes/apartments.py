from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status, Request
from pathlib import Path
from datetime import datetime
import shutil
import os
from sqlalchemy.orm import Session
from typing import List
from ..service import apartmentsService
from ..schemas.apartmentsDto import ApartmentCreate, ApartmentUpdate, Apartment, ApartmentList
from ..database import get_db

router = APIRouter(prefix="/apartments", tags=["Apartments"])

@router.post("/", response_model=Apartment, status_code=status.HTTP_201_CREATED)
async def create_apartment_route(
    apartment_json: str = Form(...),
    files: List[UploadFile] = File(default=[]),
    db: Session = Depends(get_db)
):
    try:
        apartment_data = ApartmentCreate.parse_raw(apartment_json)
        print(apartment_json)
        apartment = apartmentsService.create_apartment_service(db=db, apartment=apartment_data)
        base_dir = Path("static/apartments")
        landlord_dir = base_dir / f"apt_{apartment.landlord_id}"
        apartment_dir = landlord_dir / f"aptID_{apartment.id}"

        try:
            if not landlord_dir.exists():
                landlord_dir.mkdir(parents=False, exist_ok=False)
                print(f"Created landlord directory: {landlord_dir}")
            apartment_dir.mkdir(parents=False, exist_ok=True)
            print(f"Created apartment directory: {apartment_dir}")

        except Exception as dir_error:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Directory creation failed: {str(dir_error)}"
            )

        saved_paths = []
        
        if files:
            for file in files:
                if file.content_type not in ["image/jpeg", "image/png"]:
                    continue  
                clean_filename = file.filename.replace(" ", "_").lower()
                timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
                unique_filename = f"{timestamp}_{clean_filename}"
                
                file_path = apartment_dir / unique_filename

                try:
                    with open(file_path, "wb") as buffer:
                        shutil.copyfileobj(file.file, buffer)
                    
                    relative_path = str(file_path.relative_to("static"))
                    saved_paths.append(relative_path)
                    print(f"Saved image: {relative_path}")

                except Exception as file_error:
                    print(f"Failed to save file {clean_filename}: {str(file_error)}")
                    continue  

            if saved_paths:
                apartment.images = saved_paths
                db.commit()
                db.refresh(apartment)

        return apartment

    except HTTPException as he:
        raise he

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Apartment creation failed: {str(e)}"
        )
       
@router.get("/{apartment_id}", response_model=Apartment)
def get_apartment_route(
    request: Request,
    apartment_id: int, 
    db: Session = Depends(get_db),
):
    apartment = apartmentsService.get_apartment_service(db=db, apartment_id=apartment_id)
    if not apartment:
        raise HTTPException(status_code=404, detail="Apartment not found")
    base_url = str(request.base_url)
    apartment.images = [f"{base_url}static/{img_path}" for img_path in apartment.images]
    return apartment

@router.get("/", response_model=List[ApartmentList])
def get_apartments_route(
    request: Request,
    skip: int = 0, 
    limit: int = 10, 
    db: Session = Depends(get_db),
):
    apartments = apartmentsService.list_apartments_service(db=db, skip=skip, limit=limit)
    for apt in apartments:
        apt.images = [f"{request.base_url}static/{img_path}" for img_path in apt.images]
    return apartments

# Get landlord's apartments with image URLs
@router.get("/landlord/{landlord_id}", response_model=List[ApartmentList])
def get_apartments_by_landlord_route(
    request: Request,
    landlord_id: int, 
    skip: int = 0, 
    limit: int = 10, 
    db: Session = Depends(get_db)
    
):
    apartments = apartmentsService.list_apartments_by_landlord_service(
        db=db, landlord_id=landlord_id, skip=skip, limit=limit
    )
    if not apartments:
        raise HTTPException(status_code=404, detail="No apartments found for this landlord")
    for apt in apartments:
        apt.images = [f"{request.base_url}static/{img_path}" for img_path in apt.images]
    return apartments

@router.put("/{apartment_id}", response_model=Apartment)
def update_apartment_route(apartment_id: int, apartment: ApartmentUpdate, db: Session = Depends(get_db)):
    updated_apartment = apartmentsService.update_apartment_service(db=db, apartment_id=apartment_id, apartment=apartment)
    if not updated_apartment:
        raise HTTPException(status_code=404, detail="Apartment not found")
    return updated_apartment


@router.delete("/{apartment_id}", response_model=Apartment)
def delete_apartment_route(apartment_id: int, db: Session = Depends(get_db)):
    deleted_apartment = apartmentsService.delete_apartment_service(db=db, apartment_id=apartment_id)
    if not deleted_apartment:
        raise HTTPException(status_code=404, detail="Apartment not found")
    return deleted_apartment


# @router.get("/apartments/", response_model=List[ApartmentList])
# def get_apartments_route(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
#     return apartmentsService.list_apartments_service(db=db, skip=skip, limit=limit)

# @router.get("/apartments/landlord/{landlord_id}", response_model=List[ApartmentList])
# def get_apartments_by_landlord_route(landlord_id: int, skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
#     apartments = apartmentsService.list_apartments_by_landlord_service(db=db, landlord_id=landlord_id, skip=skip, limit=limit)
#     if not apartments:
#         raise HTTPException(status_code=404, detail="No apartments found for this landlord")
#     return apartments





#  ------------------------------------------TENANT-------------------------------------------


@router.get("/available/", response_model=List[ApartmentList])
def get_available_apartments_route(
    request: Request,
    skip: int = 0, 
    limit: int = 10, 
    db: Session = Depends(get_db)
):
    """Get list of available apartments (availability=True)"""
    apartments = apartmentsService.list_available_apartments_service(db=db, skip=skip, limit=limit)
    for apt in apartments:
        apt.images = [f"{request.base_url}static/{img_path}" for img_path in apt.images]
    return apartments

@router.get("/rented/{landlord_id}", response_model=List[ApartmentList])
def get_apartments_by_landlord_route(
    request: Request,
    landlord_id: int, 
    skip: int = 0, 
    limit: int = 10, 
    db: Session = Depends(get_db)
    
):
    apartments = apartmentsService.list_rented_apartments_by_landlord_service(
        db=db, landlord_id=landlord_id, skip=skip, limit=limit
    )
    if not apartments:
        raise HTTPException(status_code=404, detail="No apartments found for this landlord")
    for apt in apartments:
        apt.images = [f"{request.base_url}static/{img_path}" for img_path in apt.images]
    return apartments