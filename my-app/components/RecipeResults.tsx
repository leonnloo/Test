import RecipeCard from "./RecipeCard";
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
      <div className="w-full max-w-4xl mx-auto">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">
            Analyzing ingredients and generating recipes...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-600 text-lg font-medium mb-2">Error</div>
          <p className="text-red-700">{error}</p>
          <p className="text-sm text-red-600 mt-2">
            Please try again or check your connection.
          </p>
        </div>
      </div>
    );
  }

  if (recipes.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <div className="text-gray-600 text-lg mb-2">No recipes found</div>
          <p className="text-gray-500">
            Try entering different ingredients or adding more variety to your
            list.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Recipe Suggestions
        </h2>
        <p className="text-gray-600">
          Found {recipes.length} recipe{recipes.length !== 1 ? "s" : ""} based
          on your ingredients
        </p>
      </div>

      <div className="space-y-6">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}
