"use client";

import { useState, useEffect } from "react";
import IngredientForm from "../components/IngredientForm";
import RecipeResults from "../components/RecipeResults";
import { RecipeService } from "../services/recipeService";
import { Recipe } from "../types/recipe";

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  // Check online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleIngredientSubmit = async (ingredients: string[]) => {
    // Check if offline
    if (!isOnline) {
      setError(
        "You appear to be offline. Please check your internet connection."
      );
      return;
    }

    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    // Scroll to results section on mobile
    if (window.innerWidth < 768) {
      setTimeout(() => {
        const resultsSection = document.getElementById("results-section");
        if (resultsSection) {
          resultsSection.scrollIntoView({
            behavior: "smooth",
            block: "start",
            inline: "nearest",
          });
        }
      }, 100);
    }

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Offline indicator */}
      {!isOnline && (
        <div className="bg-orange-500 text-white px-4 py-2 text-center text-sm font-medium">
          ⚠️ You&apos;re currently offline. Some features may not work properly.
        </div>
      )}

      <div className="container mx-auto px-4 py-6 sm:py-8 lg:py-12">
        {/* Header */}
        <header className="text-center mb-8 sm:mb-12 lg:mb-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-4 leading-tight">
              Smart Recipe Analyzer
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
              Transform your available ingredients into delicious recipes with
              detailed nutritional analysis powered by AI
            </p>
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8 lg:space-y-12">
          {/* Ingredient Form */}
          <section className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 border border-white/50 backdrop-blur-sm">
            <IngredientForm
              onSubmit={handleIngredientSubmit}
              isLoading={isLoading}
            />
          </section>

          {/* Results Section */}
          {hasSearched && (
            <section id="results-section" className="scroll-mt-20">
              <RecipeResults
                recipes={recipes}
                isLoading={isLoading}
                error={error}
              />
            </section>
          )}

          {/* Empty state call-to-action */}
          {!hasSearched && (
            <section className="text-center py-8 sm:py-12">
              <div className="max-w-2xl mx-auto">
                <div className="text-4xl sm:text-6xl mb-4">🍳</div>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-3">
                  Ready to cook something amazing?
                </h2>
                <p className="text-gray-600 mb-6">
                  Enter your ingredients above and let AI suggest personalized
                  recipes just for you!
                </p>

                {/* Feature highlights */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-8">
                  <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                    <div className="text-2xl mb-2">🤖</div>
                    <div className="text-sm font-medium text-gray-700">
                      AI-Powered
                    </div>
                    <div className="text-xs text-gray-500">
                      Smart recipe suggestions
                    </div>
                  </div>
                  <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                    <div className="text-2xl mb-2">📊</div>
                    <div className="text-sm font-medium text-gray-700">
                      Nutritional Info
                    </div>
                    <div className="text-xs text-gray-500">
                      Calories, protein & more
                    </div>
                  </div>
                  <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                    <div className="text-2xl mb-2">📱</div>
                    <div className="text-sm font-medium text-gray-700">
                      Mobile Friendly
                    </div>
                    <div className="text-xs text-gray-500">
                      Cook anywhere, anytime
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>

        {/* Footer */}
        <footer className="text-center mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-gray-200">
          <div className="max-w-4xl mx-auto">
            <p className="text-gray-500 text-sm sm:text-base">
              Powered by AI • Get personalized recipe suggestions based on your
              ingredients
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs text-gray-400">
              <span>Made with ❤️ for food lovers</span>
              <span>•</span>
              <span>Works offline-ready</span>
              <span>•</span>
              <span>Mobile optimized</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
