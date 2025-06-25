"use client";

import { useState } from "react";
import { Recipe } from "../types/recipe";

interface RecipeCardProps {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const [showIngredients, setShowIngredients] = useState(true);
  const [showInstructions, setShowInstructions] = useState(true);

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-gray-100">
        <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 leading-tight">
          {recipe.title}
        </h3>

        {(recipe.prepTime || recipe.servings) && (
          <div className="flex flex-wrap gap-3 sm:gap-4 text-sm text-gray-600">
            {recipe.prepTime && (
              <span className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-full">
                <span className="text-blue-600">🕒</span>
                {recipe.prepTime} mins
              </span>
            )}
            {recipe.servings && (
              <span className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-full">
                <span className="text-green-600">👥</span>
                {recipe.servings} servings
              </span>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6">
        {/* Desktop: Side by side layout */}
        <div className="hidden md:grid md:grid-cols-2 gap-8">
          <IngredientSection recipe={recipe} />
          <InstructionSection recipe={recipe} />
        </div>

        {/* Mobile: Collapsible sections */}
        <div className="md:hidden space-y-4">
          <CollapsibleSection
            title="Ingredients"
            isOpen={showIngredients}
            onToggle={() => setShowIngredients(!showIngredients)}
            count={recipe.ingredients.length}
          >
            <IngredientSection recipe={recipe} />
          </CollapsibleSection>

          <CollapsibleSection
            title="Instructions"
            isOpen={showInstructions}
            onToggle={() => setShowInstructions(!showInstructions)}
            count={recipe.instructions.length}
          >
            <InstructionSection recipe={recipe} />
          </CollapsibleSection>
        </div>
      </div>

      {/* Nutritional Information */}
      <div className="px-4 sm:px-6 pb-4 sm:pb-6">
        <div className="pt-4 border-t border-gray-200">
          <h4 className="font-medium mb-3 text-gray-700 text-center sm:text-left">
            Nutritional Information (per serving)
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            <NutritionalCard
              value={recipe.nutritionalInfo.calories}
              unit=""
              label="Calories"
              color="orange"
            />
            <NutritionalCard
              value={recipe.nutritionalInfo.protein}
              unit="g"
              label="Protein"
              color="red"
            />
            <NutritionalCard
              value={recipe.nutritionalInfo.carbs}
              unit="g"
              label="Carbs"
              color="blue"
            />
            <NutritionalCard
              value={recipe.nutritionalInfo.fat}
              unit="g"
              label="Fat"
              color="green"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function IngredientSection({ recipe }: { recipe: Recipe }) {
  return (
    <div>
      <h4 className="font-medium mb-3 text-gray-700">Ingredients:</h4>
      <ul className="space-y-2">
        {recipe.ingredients.map((ingredient, index) => (
          <li
            key={index}
            className="text-sm text-gray-600 flex items-start gap-2 leading-relaxed"
          >
            <span className="text-blue-500 mt-1 text-xs">•</span>
            <span>{ingredient}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function InstructionSection({ recipe }: { recipe: Recipe }) {
  return (
    <div>
      <h4 className="font-medium mb-3 text-gray-700">Instructions:</h4>
      <ol className="space-y-3">
        {recipe.instructions.map((instruction, index) => (
          <li
            key={index}
            className="text-sm text-gray-600 flex gap-3 leading-relaxed"
          >
            <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">
              {index + 1}
            </span>
            <span>{instruction}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function CollapsibleSection({
  title,
  isOpen,
  onToggle,
  count,
  children,
}: {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 flex items-center justify-between transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-700">{title}</span>
          <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
            {count}
          </span>
        </div>
        <span
          className={`transform transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          ▼
        </span>
      </button>

      {isOpen && <div className="p-4 bg-white">{children}</div>}
    </div>
  );
}

function NutritionalCard({
  value,
  unit,
  label,
  color,
}: {
  value: number;
  unit: string;
  label: string;
  color: string;
}) {
  const colorClasses = {
    orange: "from-orange-400 to-orange-500",
    red: "from-red-400 to-red-500",
    blue: "from-blue-400 to-blue-500",
    green: "from-green-400 to-green-500",
  };

  return (
    <div className="text-center p-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow">
      <div
        className={`text-lg sm:text-xl font-bold bg-gradient-to-r ${
          colorClasses[color as keyof typeof colorClasses]
        } bg-clip-text text-transparent`}
      >
        {value}
        {unit}
      </div>
      <div className="text-xs text-gray-500 font-medium mt-1">{label}</div>
    </div>
  );
}
