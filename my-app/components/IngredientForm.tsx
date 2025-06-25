"use client";

import { useState } from "react";
import LoadingSpinner from "./LoadingSpinner";

interface IngredientFormProps {
  onSubmit: (ingredients: string[]) => void;
  isLoading: boolean;
}

export default function IngredientForm({
  onSubmit,
  isLoading,
}: IngredientFormProps) {
  const [ingredientText, setIngredientText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [charCount, setCharCount] = useState(0);

  const maxChars = 500;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!ingredientText.trim()) {
      setError("Please enter at least one ingredient");
      return;
    }

    const ingredients = ingredientText
      .split(",")
      .map((ingredient) => ingredient.trim())
      .filter((ingredient) => ingredient.length > 0);

    if (ingredients.length === 0) {
      setError("Please enter valid ingredients separated by commas");
      return;
    }

    if (ingredients.length > 20) {
      setError("Please limit to 20 ingredients maximum");
      return;
    }

    onSubmit(ingredients);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (text.length <= maxChars) {
      setIngredientText(text);
      setCharCount(text.length);
      if (error) setError(null);
    }
  };

  const exampleIngredients = [
    "chicken breast",
    "rice",
    "onion",
    "garlic",
    "olive oil",
  ];

  const handleExampleClick = () => {
    if (!isLoading) {
      setIngredientText(exampleIngredients.join(", "));
      setCharCount(exampleIngredients.join(", ").length);
      setError(null);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="ingredients"
            className="block text-sm font-medium mb-2 text-gray-700"
          >
            Available Ingredients
          </label>

          <div className="relative">
            <textarea
              id="ingredients"
              value={ingredientText}
              onChange={handleTextChange}
              placeholder="Enter your available ingredients separated by commas..."
              className={`w-full p-3 pr-16 border rounded-lg resize-none transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                error
                  ? "border-red-300 bg-red-50"
                  : isLoading
                  ? "border-gray-200 bg-gray-50 cursor-not-allowed"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              rows={4}
              disabled={isLoading}
              maxLength={maxChars}
            />

            {/* Character counter */}
            <div className="absolute bottom-2 right-2 text-xs text-gray-400">
              {charCount}/{maxChars}
            </div>
          </div>

          {/* Example ingredients button */}
          <button
            type="button"
            onClick={handleExampleClick}
            disabled={isLoading}
            className="mt-2 text-sm text-blue-600 hover:text-blue-800 disabled:text-gray-400 transition-colors"
          >
            Try example: {exampleIngredients.join(", ")}
          </button>

          {error && (
            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600 flex items-center gap-2">
                <span className="text-red-500">⚠️</span>
                {error}
              </p>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading || !ingredientText.trim()}
          className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
            isLoading || !ingredientText.trim()
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg active:scale-[0.98] focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          }`}
        >
          {isLoading ? (
            <>
              <LoadingSpinner size="sm" variant="secondary" />
              <span className="animate-pulse">Analyzing Ingredients...</span>
            </>
          ) : (
            <>
              <span>🔍</span>
              Find Recipes
            </>
          )}
        </button>
      </form>

      {/* Mobile-friendly ingredient tips */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <h3 className="text-sm font-medium text-blue-800 mb-2">
          💡 Tips for better results:
        </h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Separate ingredients with commas</li>
          <li>• Include proteins, grains, and vegetables</li>
          <li>
            • Be specific (e.g., &quot;chicken breast&quot; vs
            &quot;chicken&quot;)
          </li>
          <li className="sm:hidden">• Swipe up to see results below</li>
        </ul>
      </div>
    </div>
  );
}
