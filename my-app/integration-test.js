#!/usr/bin/env node
/**
 * Integration test for Smart Recipe Analyzer
 * This script tests the connection between frontend and backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function testApiConnection() {
  console.log("🧪 Testing API Connection...");
  console.log(`📡 API URL: ${API_BASE_URL}`);
  console.log("-".repeat(50));

  try {
    // Test health endpoint
    console.log("1️⃣ Testing health endpoint...");
    const healthResponse = await fetch(`${API_BASE_URL}/health`);

    if (!healthResponse.ok) {
      throw new Error(`Health check failed: ${healthResponse.status}`);
    }

    const healthData = await healthResponse.json();
    console.log("✅ Health check passed:", healthData.status);
    console.log(`   Version: ${healthData.version}`);
    console.log(`   Timestamp: ${healthData.timestamp}`);

    // Test recipe analysis endpoint
    console.log("\n2️⃣ Testing recipe analysis endpoint...");
    const testIngredients = ["chicken", "rice", "vegetables"];

    const recipeResponse = await fetch(`${API_BASE_URL}/api/analyze-recipes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ingredients: testIngredients }),
    });

    if (!recipeResponse.ok) {
      const errorData = await recipeResponse.text();
      throw new Error(
        `Recipe analysis failed: ${recipeResponse.status} - ${errorData}`
      );
    }

    const recipeData = await recipeResponse.json();
    console.log("✅ Recipe analysis passed");
    console.log(`   Generated ${recipeData.recipes.length} recipes`);

    if (recipeData.message) {
      console.log(`   Message: ${recipeData.message}`);
    }

    // Test recipe format
    if (recipeData.recipes.length > 0) {
      const recipe = recipeData.recipes[0];
      console.log(
        `   Sample recipe: ${recipe.name || recipe.title || "Unknown"}`
      );
      console.log(
        `   Cooking time: ${
          recipe.cookingTime || recipe.prepTime + " mins" || "N/A"
        }`
      );
      console.log(`   Difficulty: ${recipe.difficulty || "N/A"}`);

      const nutrition = recipe.nutrition || recipe.nutritionalInfo;
      if (nutrition) {
        console.log(`   Calories: ${nutrition.calories}`);
      }
    }

    // Test recipe history endpoint
    console.log("\n3️⃣ Testing recipe history endpoint...");
    const historyResponse = await fetch(
      `${API_BASE_URL}/api/recipe-history?limit=3`
    );

    if (!historyResponse.ok) {
      throw new Error(`Recipe history failed: ${historyResponse.status}`);
    }

    const historyData = await historyResponse.json();
    console.log("✅ Recipe history passed");
    console.log(`   Found ${historyData.length} historical entries`);

    console.log("\n" + "=".repeat(50));
    console.log(
      "🎉 All tests passed! Frontend-Backend integration is working correctly."
    );
    console.log("\n💡 Next steps:");
    console.log("   • Start your Next.js frontend: npm run dev");
    console.log("   • Start your FastAPI backend: python main.py");
    console.log("   • Open http://localhost:3000 in your browser");
  } catch (error) {
    console.error("\n❌ Integration test failed:");
    console.error(`   Error: ${error.message}`);
    console.log("\n🔧 Troubleshooting:");
    console.log(
      "   • Make sure the FastAPI server is running on http://localhost:8000"
    );
    console.log(
      "   • Check that OPENROUTER_API_KEY is set in the backend .env file"
    );
    console.log("   • Verify your internet connection");
    console.log("   • Check the backend logs for detailed error information");

    process.exit(1);
  }
}

// Run the test
if (require.main === module) {
  testApiConnection();
}

module.exports = { testApiConnection };
