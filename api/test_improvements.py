#!/usr/bin/env python3
"""
Test script to validate LLM integration improvements
"""

import asyncio
import httpx
import json

API_BASE_URL = "http://localhost:8000"

async def test_improved_llm_integration():
    """Test the improved LLM integration with new prompt and format"""
    print("🧪 Testing Improved LLM Integration")
    print("=" * 50)
    
    test_ingredients = [
        ["chicken", "rice", "soy sauce", "vegetables"],
        ["pasta", "garlic", "butter", "parmesan"],
        ["eggs", "bread", "milk", "cheese"]
    ]
    
    for i, ingredients in enumerate(test_ingredients, 1):
        print(f"\n🧅 Test {i}: {', '.join(ingredients)}")
        print("-" * 30)
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    f"{API_BASE_URL}/api/analyze-recipes",
                    json={"ingredients": ingredients},
                    timeout=60.0
                )
                
                if response.status_code == 200:
                    data = response.json()
                    print(f"✅ Success! Generated {len(data['recipes'])} recipes")
                    
                    for j, recipe in enumerate(data['recipes'], 1):
                        print(f"\n📖 Recipe {j}: {recipe.get('name', recipe.get('title', 'Unknown'))}")
                        print(f"   🕐 Time: {recipe.get('cookingTime', 'N/A')}")
                        print(f"   🎯 Difficulty: {recipe.get('difficulty', 'N/A')}")
                        print(f"   👥 Servings: {recipe.get('servings', 'N/A')}")
                        
                        # Show nutrition info
                        nutrition = recipe.get('nutrition', recipe.get('nutritionalInfo', {}))
                        if nutrition:
                            print(f"   🔥 Nutrition: {nutrition.get('calories', 'N/A')} cal, "
                                  f"{nutrition.get('protein', 'N/A')} protein, "
                                  f"{nutrition.get('carbs', 'N/A')} carbs")
                        
                        # Show ingredients count
                        ingredient_count = len(recipe.get('ingredients', []))
                        print(f"   🥕 Ingredients: {ingredient_count} items")
                        
                        # Show instruction count
                        instruction_count = len(recipe.get('instructions', []))
                        print(f"   📝 Instructions: {instruction_count} steps")
                        
                else:
                    print(f"❌ Failed: {response.status_code}")
                    print(f"Response: {response.text[:200]}...")
                    
            except Exception as e:
                print(f"❌ Error: {e}")

async def test_format_compatibility():
    """Test that both old and new formats work"""
    print("\n\n🔄 Testing Format Compatibility")
    print("=" * 50)
    
    # Test with minimal ingredients to get fallback recipe
    async with httpx.AsyncClient() as client:
        try:
            # This might trigger fallback recipe if LLM is not available
            response = await client.post(
                f"{API_BASE_URL}/api/analyze-recipes",
                json={"ingredients": ["tomato"]},
                timeout=60.0
            )
            
            if response.status_code == 200:
                data = response.json()
                recipe = data['recipes'][0]
                
                # Check if new format fields exist
                new_format_fields = ['name', 'cookingTime', 'difficulty', 'nutrition']
                has_new_format = all(field in recipe for field in new_format_fields)
                
                # Check if legacy fields exist
                legacy_fields = ['title', 'nutritionalInfo', 'prepTime']
                has_legacy_format = all(field in recipe for field in legacy_fields)
                
                print(f"✅ New format fields present: {has_new_format}")
                print(f"✅ Legacy format fields present: {has_legacy_format}")
                
                if has_new_format and has_legacy_format:
                    print("🎉 Perfect backward compatibility!")
                else:
                    print("⚠️ Some compatibility issues detected")
                    
        except Exception as e:
            print(f"❌ Compatibility test error: {e}")

async def main():
    """Run all improvement tests"""
    await test_improved_llm_integration()
    await test_format_compatibility()
    
    print("\n" + "=" * 50)
    print("🏁 LLM Integration Tests Complete!")

if __name__ == "__main__":
    asyncio.run(main()) 