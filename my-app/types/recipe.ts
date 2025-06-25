export interface Recipe {
  id: string;
  name: string;
  ingredients: string[];
  instructions: string[];
  cookingTime: string;
  difficulty: string;
  nutrition: NutritionalInfo;
  servings?: number;
  title?: string;
  nutritionalInfo?: NutritionalInfo;
  prepTime?: number; // in minutes
}

export interface NutritionalInfo {
  calories: number;
  protein: string;
  carbs: string;
  fat?: string;
  fiber?: string;
  sugar?: string;
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

export interface HealthResponse {
  status: string;
  timestamp: string;
  version: string;
}
