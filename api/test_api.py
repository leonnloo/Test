#!/usr/bin/env python3
"""
Test script for the Smart Recipe Analyzer API
"""

import asyncio
import httpx
import json
from typing import Dict, Any

API_BASE_URL = "http://localhost:8000"

async def test_health_check():
    """Test the health check endpoint"""
    print("🏥 Testing health check...")
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(f"{API_BASE_URL}/health")
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Health check passed: {data['status']}")
                return True
            else:
                print(f"❌ Health check failed: {response.status_code}")
                return False
        except Exception as e:
            print(f"❌ Health check error: {e}")
            return False

async def test_analyze_recipes():
    """Test the recipe analysis endpoint"""
    print("\n🍳 Testing recipe analysis...")
    
    test_data = {
        "ingredients": ["chicken", "rice", "vegetables", "soy sauce"]
    }
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                f"{API_BASE_URL}/api/analyze-recipes",
                json=test_data,
                timeout=60.0
            )
            
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Recipe analysis successful!")
                print(f"📝 Generated {len(data['recipes'])} recipes")
                
                if data['recipes']:
                    recipe = data['recipes'][0]
                    print(f"🍽️  First recipe: {recipe.get('name', recipe.get('title', 'Unknown'))}")
                    print(f"⏱️  Cooking time: {recipe.get('cookingTime', 'N/A')}")
                    print(f"🎯 Difficulty: {recipe.get('difficulty', 'N/A')}")
                    print(f"🥄 Servings: {recipe.get('servings', 'N/A')}")
                    nutrition = recipe.get('nutrition', recipe.get('nutritionalInfo', {}))
                    print(f"🔥 Calories: {nutrition.get('calories', 'N/A')}")
                    print(f"🥩 Protein: {nutrition.get('protein', 'N/A')}")
                
                return True
            else:
                print(f"❌ Recipe analysis failed: {response.status_code}")
                print(f"Response: {response.text}")
                return False
                
        except Exception as e:
            print(f"❌ Recipe analysis error: {e}")
            return False

async def test_invalid_request():
    """Test request validation"""
    print("\n🚫 Testing request validation...")
    
    # Test 1: Empty ingredients list
    test_data = {"ingredients": []}
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                f"{API_BASE_URL}/api/analyze-recipes",
                json=test_data
            )
            
            if response.status_code == 422:  # FastAPI returns 422 for validation errors
                print("✅ Request validation working - empty ingredients rejected (422)")
            else:
                print(f"❌ Empty ingredients test failed: expected 422, got {response.status_code}")
                return False
        except Exception as e:
            print(f"❌ Empty ingredients test error: {e}")
            return False
    
    # Test 2: Whitespace-only ingredients
    test_data = {"ingredients": ["   ", "\t", ""]}
    
    async with httpx.AsyncClient() as client:  # Create a new client for the second test
        try:
            response = await client.post(
                f"{API_BASE_URL}/api/analyze-recipes",
                json=test_data
            )
            
            if response.status_code == 422:  # Pydantic validation catches whitespace ingredients
                print("✅ Request validation working - whitespace ingredients rejected (422)")
                return True
            else:
                print(f"❌ Whitespace ingredients test failed: expected 422, got {response.status_code}")
                print(f"Response: {response.text}")
                return False
                
        except Exception as e:
            print(f"❌ Whitespace ingredients test error: {e}")
            return False

async def test_recipe_history():
    """Test recipe history endpoint"""
    print("\n📚 Testing recipe history...")
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(f"{API_BASE_URL}/api/recipe-history?limit=5")
            
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Recipe history retrieved: {len(data)} entries")
                return True
            else:
                print(f"❌ Recipe history failed: {response.status_code}")
                return False
                
        except Exception as e:
            print(f"❌ Recipe history error: {e}")
            return False

async def main():
    """Run all tests"""
    print("🧪 Smart Recipe Analyzer API Tests")
    print("=" * 50)
    
    tests = [
        test_health_check,
        test_analyze_recipes,
        test_invalid_request,
        test_recipe_history
    ]
    
    passed = 0
    total = len(tests)
    
    for test in tests:
        try:
            if await test():
                passed += 1
        except Exception as e:
            print(f"❌ Test {test.__name__} failed with error: {e}")
    
    print("\n" + "=" * 50)
    print(f"📊 Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! API is working correctly.")
    else:
        print("⚠️  Some tests failed. Check the API configuration.")
        
    return passed == total

if __name__ == "__main__":
    asyncio.run(main()) 