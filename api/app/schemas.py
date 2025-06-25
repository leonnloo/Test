from pydantic import BaseModel, Field, validator
from typing import List, Optional
from datetime import datetime

class NutritionalInfo(BaseModel):
    calories: int = Field(..., ge=0, description="Calories per serving")
    protein: str = Field(..., description="Protein amount (e.g., '12g')")
    carbs: str = Field(..., description="Carbohydrates amount (e.g., '60g')")
    fat: Optional[str] = Field(None, description="Fat amount (e.g., '15g')")
    fiber: Optional[str] = Field(None, description="Fiber amount (e.g., '8g')")

class Recipe(BaseModel):
    id: str
    name: str = Field(..., min_length=1, max_length=200, description="Recipe name")
    ingredients: List[str] = Field(..., min_items=1, description="List of ingredients")
    instructions: List[str] = Field(..., min_items=1, description="Step-by-step cooking instructions")
    cookingTime: str = Field(..., description="Cooking time (e.g., '20 minutes')")
    difficulty: str = Field(..., description="Difficulty level (Easy, Medium, Hard)")
    nutrition: NutritionalInfo = Field(..., description="Nutritional information")
    
    # Keep these for backward compatibility
    title: Optional[str] = Field(None, description="Recipe title (deprecated, use name)")
    nutritionalInfo: Optional[NutritionalInfo] = Field(None, description="Legacy nutritional info")
    prepTime: Optional[int] = Field(None, ge=1, description="Preparation time in minutes (deprecated)")
    servings: Optional[int] = Field(None, ge=1, description="Number of servings")

class RecipeAnalysisRequest(BaseModel):
    ingredients: List[str] = Field(..., min_items=1, max_items=20)
    
    @validator('ingredients')
    def validate_ingredients(cls, v):
        # Remove empty strings and strip whitespace
        cleaned = [ingredient.strip() for ingredient in v if ingredient.strip()]
        if not cleaned:
            raise ValueError('At least one non-empty ingredient is required')
        if len(cleaned) > 20:
            raise ValueError('Maximum 20 ingredients allowed')
        return cleaned

class RecipeAnalysisResponse(BaseModel):
    recipes: List[Recipe]
    message: Optional[str] = None

class ApiError(BaseModel):
    message: str
    status: Optional[int] = None

class HealthResponse(BaseModel):
    status: str
    timestamp: datetime
    version: str = "1.0.0" 