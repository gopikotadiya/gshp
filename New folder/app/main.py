from fastapi import FastAPI
from .database import engine, Base
from .routes import auth, apartments, application, profile, user, maintenance, background, leases
from fastapi.middleware.cors import CORSMiddleware


# Create all database tables
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI()

# Include routers
# app.include_router(auth.router)
app.include_router(user.router)
app.include_router(apartments.router)
app.include_router(application.router)
# app.include_router(profile.router)
app.include_router(maintenance.router)
app.include_router(background.router)
app.include_router(leases.router)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Adjust based on frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root endpoint
@app.get("/")
def read_root():
    return {"message": "Welcome to FastAPI Auth"}


