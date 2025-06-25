import {
  RecipeAnalysisRequest,
  RecipeAnalysisResponse,
} from "../types/recipe";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export class RecipeService {
  static async analyzeIngredients(
    ingredients: string[]
  ): Promise<RecipeAnalysisResponse> {
    try {
      const request: RecipeAnalysisRequest = { ingredients };

      const response = await fetch(`${API_BASE_URL}/api/analyze-recipes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Unknown error occurred" }));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const data: RecipeAnalysisResponse = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to analyze recipes: ${error.message}`);
      }
      throw new Error("Failed to analyze recipes: Unknown error occurred");
    }
  }

  static async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: "GET",
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}
