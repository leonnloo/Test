from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.database import get_database
from app.schemas import RecipeAnalysisRequest, RecipeAnalysisResponse, ApiError
from app.services.openrouter_service import OpenRouterService
from app.services.recipe_service import RecipeService

router = APIRouter(
    tags=["recipes"],
    responses={404: {"description": "Not found"}},
)

# Dependency to get OpenRouter service
def get_openrouter_service() -> OpenRouterService:
    return OpenRouterService()

# Dependency to get Recipe service
def get_recipe_service(
    openrouter_service: OpenRouterService = Depends(get_openrouter_service)
) -> RecipeService:
    return RecipeService(openrouter_service)

@router.post(
    "/analyze-recipes",
    response_model=RecipeAnalysisResponse,
    status_code=status.HTTP_200_OK,
    responses={
        400: {"model": ApiError, "description": "Invalid request"},
        500: {"model": ApiError, "description": "Internal server error"}
    }
)
async def analyze_recipes(
    request: RecipeAnalysisRequest,
    db: AsyncSession = Depends(get_database),
    recipe_service: RecipeService = Depends(get_recipe_service)
):
    """
    Analyze ingredients and generate recipe suggestions with nutritional information.
    
    - **ingredients**: List of ingredients (1-20 items, non-empty strings)
    - Returns list of AI-generated recipes with nutritional analysis
    """
    
    try:
        # Additional validation beyond Pydantic (Pydantic already handles basic validation)
        # Clean and validate ingredients
        cleaned_ingredients = [ing.strip() for ing in request.ingredients if ing.strip()]
        if not cleaned_ingredients:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="At least one non-empty ingredient is required"
            )
        
        # Update request with cleaned ingredients
        request.ingredients = cleaned_ingredients
        
        # Generate recipes
        response = await recipe_service.analyze_ingredients(request, db)
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to analyze recipes: {str(e)}"
        )

@router.get(
    "/recipe-history",
    response_model=List[RecipeAnalysisResponse],
    status_code=status.HTTP_200_OK
)
async def get_recipe_history(
    limit: int = 10,
    db: AsyncSession = Depends(get_database),
    recipe_service: RecipeService = Depends(get_recipe_service)
):
    """
    Get recent recipe analysis history.
    
    - **limit**: Number of recent analyses to return (default: 10, max: 50)
    """
    
    if limit > 50:
        limit = 50
    
    try:
        history = await recipe_service.get_recipe_history(db, limit)
        return history
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch recipe history: {str(e)}"
        ) 