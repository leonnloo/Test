export interface Recipe {
  id: string;
  title: string;
  ingredients: string[];
  instructions: string[];
  nutritionalInfo: NutritionalInfo;
  prepTime?: number; // in minutes
  servings?: number;
}

export interface NutritionalInfo {
  calories: number;
  protein: number; // in grams
  carbs: number; // in grams
  fat: number; // in grams
  fiber?: number; // in grams
  sugar?: number; // in grams
}

export interface RecipeAnalysisRequest {
  ingredients: string[];
}

export interface RecipeAnalysisResponse {
  recipes: Recipe[];
  message?: string;
}

export interface ApiError {
  message: string;
  status?: number;
}
