import os
import json
import httpx
import uuid
from typing import List, Dict, Any
from app.schemas import Recipe, NutritionalInfo

class OpenRouterService:
    def __init__(self):
        self.api_key = os.getenv("OPENROUTER_API_KEY")
        self.api_url = os.getenv("OPENROUTER_API_URL", "https://openrouter.ai/api/v1")
        self.model = "anthropic/claude-3-haiku"  # Using a cost-effective model
        
        if not self.api_key:
            raise ValueError("OPENROUTER_API_KEY environment variable is required")
    
    async def generate_recipes(self, ingredients: List[str]) -> List[Recipe]:
        """Generate recipes based on ingredients using OpenRouter LLM"""
        prompt = self._create_recipe_prompt(ingredients)
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.api_url}/chat/completions",
                    headers={
                        "Authorization": f"Bearer {self.api_key}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": self.model,
                        "messages": [
                            {
                                "role": "system",
                                "content": "You are a professional chef and nutritionist. Generate recipes in valid JSON format only."
                            },
                            {
                                "role": "user",
                                "content": prompt
                            }
                        ],
                        "temperature": 0.7,
                        "max_tokens": 2000
                    },
                    timeout=30.0
                )
                
                if response.status_code != 200:
                    raise Exception(f"OpenRouter API error: {response.status_code} - {response.text}")
                
                result = response.json()
                content = result["choices"][0]["message"]["content"].strip()
                
                # Try to extract JSON if LLM included extra text
                if not content.startswith('{'):
                    # Look for JSON content between markers or extract first JSON block
                    json_start = content.find('{')
                    json_end = content.rfind('}') + 1
                    if json_start != -1 and json_end > json_start:
                        content = content[json_start:json_end]
                
                # Parse the JSON response
                try:
                    recipes_data = json.loads(content)
                except json.JSONDecodeError as e:
                    # Try to fix common JSON issues
                    print(f"Initial JSON parse failed: {e}")
                    print(f"Content: {content[:500]}...")
                    
                    # Try to clean up the JSON
                    content = content.replace('\n', ' ').replace('\t', ' ')
                    content = ' '.join(content.split())  # Normalize whitespace
                    recipes_data = json.loads(content)
                
                # Convert to Recipe objects
                recipes = []
                for i, recipe_data in enumerate(recipes_data.get("recipes", [])):
                    # Ensure recipe has an ID
                    if "id" not in recipe_data:
                        recipe_data["id"] = f"recipe_{i+1}_{str(uuid.uuid4())[:8]}"
                    
                    recipe = self._parse_recipe_data(recipe_data)
                    if recipe:
                        recipes.append(recipe)
                
                if not recipes:
                    raise Exception("No valid recipes could be parsed from LLM response")
                
                return recipes[:3]  # Return max 3 recipes
                
        except json.JSONDecodeError as e:
            raise Exception(f"Failed to parse LLM response as JSON: {str(e)}")
        except httpx.TimeoutException:
            raise Exception("Request to OpenRouter API timed out")
        except Exception as e:
            raise Exception(f"Error generating recipes: {str(e)}")
    
    def _create_recipe_prompt(self, ingredients: List[str]) -> str:
        """Create a structured prompt for the LLM to generate recipes"""
        ingredients_str = ", ".join(ingredients)
        
        return f"""
You are a professional chef and nutritionist. Generate 2-3 creative and delicious recipes using these ingredients: {ingredients_str}

REQUIREMENTS:
✓ Use as many provided ingredients as possible
✓ Add reasonable common ingredients if needed
✓ Create practical, home-cookable recipes
✓ Include accurate nutritional estimates
✓ Provide clear step-by-step instructions
✓ Estimate realistic cooking times and difficulty levels

RESPONSE FORMAT: Return ONLY valid JSON, no other text:

{{
    "recipes": [
        {{
            "id": "recipe_1",
            "name": "Recipe Name",
            "ingredients": ["main ingredient", "additional ingredient", "seasoning"],
            "instructions": [
                "Step 1: Preparation details",
                "Step 2: Cooking process", 
                "Step 3: Final assembly"
            ],
            "cookingTime": "25 minutes",
            "difficulty": "Easy",
            "nutrition": {{
                "calories": 350,
                "protein": "18g",
                "carbs": "45g",
                "fat": "12g",
                "fiber": "6g"
            }},
            "servings": 4
        }}
    ]
}}

DIFFICULTY LEVELS: Easy (basic cooking), Medium (some skill required), Hard (advanced techniques)
COOKING TIME: Include prep + cook time (e.g., "30 minutes", "1 hour 15 minutes")
NUTRITION: Realistic estimates per serving

Generate recipes now using: {ingredients_str}
"""
    
    def _parse_recipe_data(self, recipe_data: Dict[str, Any]) -> Recipe:
        """Parse recipe data from LLM response into Recipe object"""
        try:
            # Handle both new and legacy nutrition formats
            nutrition_data = recipe_data.get("nutrition", recipe_data.get("nutritionalInfo", {}))
            nutritional_info = NutritionalInfo(**nutrition_data)
            
            # Create recipe with new format, fallback to legacy fields
            recipe = Recipe(
                id=recipe_data["id"],
                name=recipe_data.get("name", recipe_data.get("title", "Unnamed Recipe")),
                ingredients=recipe_data["ingredients"],
                instructions=recipe_data["instructions"],
                cookingTime=recipe_data.get("cookingTime", f"{recipe_data.get('prepTime', 30)} minutes"),
                difficulty=recipe_data.get("difficulty", "Medium"),
                nutrition=nutritional_info,
                # Legacy fields for backward compatibility
                title=recipe_data.get("title", recipe_data.get("name")),
                nutritionalInfo=nutritional_info,
                prepTime=recipe_data.get("prepTime"),
                servings=recipe_data.get("servings", 4)
            )
            return recipe
        except Exception as e:
            print(f"Error parsing recipe data: {e}")
            print(f"Recipe data: {recipe_data}")
            return None 