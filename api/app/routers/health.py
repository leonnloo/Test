from datetime import datetime
from fastapi import APIRouter
from app.schemas import HealthResponse

router = APIRouter(
    tags=["health"],
    responses={404: {"description": "Not found"}},
)

@router.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    return HealthResponse(
        status="healthy",
        timestamp=datetime.utcnow(),
        version="1.0.0"
    ) 