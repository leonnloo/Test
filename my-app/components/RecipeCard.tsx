import { Recipe } from "../types/recipe";

interface RecipeCardProps {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <h3 className="text-xl font-semibold mb-3 text-gray-800">
        {recipe.title}
      </h3>

      {(recipe.prepTime || recipe.servings) && (
        <div className="flex gap-4 mb-4 text-sm text-gray-600">
          {recipe.prepTime && (
            <span className="flex items-center gap-1">
              🕒 {recipe.prepTime} mins
            </span>
          )}
          {recipe.servings && (
            <span className="flex items-center gap-1">
              👥 {recipe.servings} servings
            </span>
          )}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium mb-2 text-gray-700">Ingredients:</h4>
          <ul className="space-y-1">
            {recipe.ingredients.map((ingredient, index) => (
              <li
                key={index}
                className="text-sm text-gray-600 flex items-start gap-2"
              >
                <span className="text-blue-500 mt-1">•</span>
                {ingredient}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-medium mb-2 text-gray-700">Instructions:</h4>
          <ol className="space-y-2">
            {recipe.instructions.map((instruction, index) => (
              <li key={index} className="text-sm text-gray-600 flex gap-2">
                <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">
                  {index + 1}
                </span>
                {instruction}
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <h4 className="font-medium mb-3 text-gray-700">
          Nutritional Information (per serving):
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="text-center p-2 bg-gray-50 rounded">
            <div className="text-lg font-semibold text-gray-800">
              {recipe.nutritionalInfo.calories}
            </div>
            <div className="text-xs text-gray-500">Calories</div>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded">
            <div className="text-lg font-semibold text-gray-800">
              {recipe.nutritionalInfo.protein}g
            </div>
            <div className="text-xs text-gray-500">Protein</div>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded">
            <div className="text-lg font-semibold text-gray-800">
              {recipe.nutritionalInfo.carbs}g
            </div>
            <div className="text-xs text-gray-500">Carbs</div>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded">
            <div className="text-lg font-semibold text-gray-800">
              {recipe.nutritionalInfo.fat}g
            </div>
            <div className="text-xs text-gray-500">Fat</div>
          </div>
        </div>
      </div>
    </div>
  );
}
