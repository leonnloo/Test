import RecipeCard from "./RecipeCard";
import { SkeletonRecipeList } from "./SkeletonLoader";
import { Recipe } from "../types/recipe";

interface RecipeResultsProps {
  recipes: Recipe[];
  isLoading: boolean;
  error: string | null;
}

export default function RecipeResults({
  recipes,
  isLoading,
  error,
}: RecipeResultsProps) {
  if (isLoading) {
    return (
      <div className="w-full">
        <div className="max-w-4xl mx-auto">
          {/* Loading header with skeleton */}
          <div className="text-center mb-8 px-4">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded mx-auto mb-2 w-48"></div>
              <div className="h-4 bg-gray-200 rounded mx-auto w-64"></div>
            </div>
          </div>

          {/* Skeleton recipe cards */}
          <div className="px-4">
            <SkeletonRecipeList count={3} />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-500 text-4xl mb-4">😞</div>
          <div className="text-red-600 text-lg font-medium mb-2">
            Oops! Something went wrong
          </div>
          <p className="text-red-700 mb-4">{error}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <p className="text-sm text-red-600">
              Please try again or check your connection.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (recipes.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <div className="text-gray-400 text-5xl mb-4">🍽️</div>
          <div className="text-gray-600 text-lg mb-2">No recipes found</div>
          <p className="text-gray-500 mb-4">
            Try entering different ingredients or adding more variety to your
            list.
          </p>
          <div className="text-sm text-gray-400">
            <p>Suggestions:</p>
            <ul className="mt-2 space-y-1">
              <li>• Add more ingredients for better matches</li>
              <li>• Include basic ingredients like salt, oil, onion</li>
              <li>• Try common proteins like chicken, beef, or fish</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="max-w-4xl mx-auto px-4">
        {/* Results header */}
        <div className="mb-6 text-center sm:text-left">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
            Recipe Suggestions
          </h2>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <p className="text-gray-600">
              Found {recipes.length} recipe{recipes.length !== 1 ? "s" : ""}{" "}
              based on your ingredients
            </p>
            <div className="text-sm text-gray-500">
              Scroll down to see all recipes
            </div>
          </div>
        </div>

        {/* Recipe grid */}
        <div className="space-y-6 lg:space-y-8">
          {recipes.map((recipe, index) => (
            <div
              key={recipe.id}
              className="animate-in slide-in-from-bottom-4 duration-500"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <RecipeCard recipe={recipe} />
            </div>
          ))}
        </div>

        {/* Bottom spacing for mobile */}
        <div className="h-8 sm:h-4"></div>
      </div>
    </div>
  );
}
