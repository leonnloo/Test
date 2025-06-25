"use client";

import { useState } from "react";

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

    onSubmit(ingredients);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="mb-4">
        <label htmlFor="ingredients" className="block text-sm font-medium mb-2">
          Available Ingredients
        </label>
        <textarea
          id="ingredients"
          value={ingredientText}
          onChange={(e) => setIngredientText(e.target.value)}
          placeholder="Enter your available ingredients separated by commas (e.g., chicken, rice, onion, garlic)"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          rows={4}
          disabled={isLoading}
        />
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? "Analyzing Ingredients..." : "Find Recipes"}
      </button>
    </form>
  );
}
