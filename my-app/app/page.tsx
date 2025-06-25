"use client";

import { useState } from "react";
import IngredientForm from "../components/IngredientForm";
import RecipeResults from "../components/RecipeResults";
import { RecipeService } from "../services/recipeService";
import { Recipe } from "../types/recipe";

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleIngredientSubmit = async (ingredients: string[]) => {
    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const response = await RecipeService.analyzeIngredients(ingredients);
      setRecipes(response.recipes);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
      setRecipes([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Smart Recipe Analyzer
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Transform your available ingredients into delicious recipes with
            detailed nutritional analysis powered by AI
          </p>
        </header>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Ingredient Form */}
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <IngredientForm
              onSubmit={handleIngredientSubmit}
              isLoading={isLoading}
            />
          </div>

          {/* Results Section */}
          {hasSearched && (
            <RecipeResults
              recipes={recipes}
              isLoading={isLoading}
              error={error}
            />
          )}
        </div>

        {/* Footer */}
        <footer className="text-center mt-16 pt-8 border-t border-gray-200">
          <p className="text-gray-500 text-sm">
            Powered by AI • Get personalized recipe suggestions based on your
            ingredients
          </p>
        </footer>
      </div>
    </div>
  );
}
