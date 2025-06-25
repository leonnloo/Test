import json
import uuid
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models import RecipeAnalysis, GeneratedRecipe
from app.schemas import Recipe, RecipeAnalysisRequest, RecipeAnalysisResponse
from app.services.openrouter_service import OpenRouterService

class RecipeService:
    def __init__(self, openrouter_service: OpenRouterService):
        self.openrouter_service = openrouter_service
    
    async def analyze_ingredients(
        self, 
        request: RecipeAnalysisRequest, 
        db: AsyncSession
    ) -> RecipeAnalysisResponse:
        """Analyze ingredients and generate recipes with nutritional info"""
        
        # Create analysis record
        analysis = RecipeAnalysis(
            id=str(uuid.uuid4()),
            ingredients=json.dumps(request.ingredients)
        )
        db.add(analysis)
        await db.flush()  # Get the ID without committing
        
        try:
            # Generate recipes using LLM
            recipes = await self.openrouter_service.generate_recipes(request.ingredients)
            
            # Save generated recipes to database
            for recipe in recipes:
                db_recipe = GeneratedRecipe(
                    id=recipe.id,
                    analysis_id=analysis.id,
                    title=recipe.title,
                    ingredients=json.dumps(recipe.ingredients),
                    instructions=json.dumps(recipe.instructions),
                    prep_time=recipe.prepTime,
                    servings=recipe.servings,
                    calories=recipe.nutritionalInfo.calories,
                    protein=recipe.nutritionalInfo.protein,
                    carbs=recipe.nutritionalInfo.carbs,
                    fat=recipe.nutritionalInfo.fat,
                    fiber=recipe.nutritionalInfo.fiber,
                    sugar=recipe.nutritionalInfo.sugar
                )
                db.add(db_recipe)
            
            await db.commit()
            
            return RecipeAnalysisResponse(
                recipes=recipes,
                message=f"Generated {len(recipes)} recipes from your ingredients!"
            )
            
        except Exception as e:
            await db.rollback()
            # Return fallback recipes if LLM fails
            fallback_recipes = self._create_fallback_recipes(request.ingredients)
            
            return RecipeAnalysisResponse(
                recipes=fallback_recipes,
                message="Using fallback recipes due to service unavailability. Please try again later for AI-generated suggestions."
            )
    
    async def get_recipe_history(self, db: AsyncSession, limit: int = 10) -> List[RecipeAnalysisResponse]:
        """Get recent recipe analyses"""
        
        stmt = select(RecipeAnalysis).order_by(RecipeAnalysis.created_at.desc()).limit(limit)
        result = await db.execute(stmt)
        analyses = result.scalars().all()
        
        history = []
        for analysis in analyses:
            # Get recipes for this analysis
            recipe_stmt = select(GeneratedRecipe).where(GeneratedRecipe.analysis_id == analysis.id)
            recipe_result = await db.execute(recipe_stmt)
            db_recipes = recipe_result.scalars().all()
            
            # Convert to Recipe objects
            recipes = []
            for db_recipe in db_recipes:
                recipe = Recipe(
                    id=db_recipe.id,
                    title=db_recipe.title,
                    ingredients=json.loads(db_recipe.ingredients),
                    instructions=json.loads(db_recipe.instructions),
                    nutritionalInfo={
                        "calories": db_recipe.calories,
                        "protein": db_recipe.protein,
                        "carbs": db_recipe.carbs,
                        "fat": db_recipe.fat,
                        "fiber": db_recipe.fiber,
                        "sugar": db_recipe.sugar
                    },
                    prepTime=db_recipe.prep_time,
                    servings=db_recipe.servings
                )
                recipes.append(recipe)
            
            history.append(RecipeAnalysisResponse(recipes=recipes))
        
        return history
    
    def _create_fallback_recipes(self, ingredients: List[str]) -> List[Recipe]:
        """Create simple fallback recipes when LLM is unavailable"""
        from app.schemas import NutritionalInfo
        
        # Basic recipe templates based on common ingredients
        nutrition = NutritionalInfo(
            calories=250,
            protein="15g",
            carbs="20g",
            fat="12g",
            fiber="5g"
        )
        
        fallback_recipe = Recipe(
            id=str(uuid.uuid4()),
            name=f"Simple {ingredients[0].title()} Recipe",
            ingredients=ingredients + ["salt", "pepper", "cooking oil"],
            instructions=[
                f"Prepare all ingredients: {', '.join(ingredients[:3])}",
                "Heat oil in a pan over medium heat",
                "Add the main ingredients and cook until tender (5-10 minutes)",
                "Season with salt and pepper to taste",
                "Serve hot and enjoy your homemade dish!"
            ],
            cookingTime="20 minutes",
            difficulty="Easy",
            nutrition=nutrition,
            # Legacy fields for compatibility
            title=f"Simple {ingredients[0].title()} Recipe",
            nutritionalInfo=nutrition,
            prepTime=20,
            servings=2
        )
        
        return [fallback_recipe] 