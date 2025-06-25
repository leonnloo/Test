import {
  RecipeAnalysisRequest,
  RecipeAnalysisResponse,
  HealthResponse,
  ApiError,
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
        let errorData: ApiError;
        try {
          errorData = await response.json();
        } catch {
          errorData = {
            message: `HTTP error! status: ${response.status}`,
            status: response.status,
          };
        }

        // Handle specific error status codes
        if (response.status === 400) {
          throw new Error(
            errorData.message ||
              "Invalid ingredients provided. Please check your input."
          );
        } else if (response.status === 500) {
          throw new Error(
            errorData.message || "Server error. Please try again later."
          );
        } else {
          throw new Error(
            errorData.message || `Unexpected error (${response.status})`
          );
        }
      }

      const data: RecipeAnalysisResponse = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error; // Re-throw known errors
      }
      throw new Error(
        "Failed to analyze recipes: Network error or unexpected issue"
      );
    }
  }

  static async getRecipeHistory(
    limit: number = 10
  ): Promise<RecipeAnalysisResponse[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/recipe-history?limit=${limit}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Failed to fetch recipe history" }));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const data: RecipeAnalysisResponse[] = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch recipe history: ${error.message}`);
      }
      throw new Error("Failed to fetch recipe history: Unknown error occurred");
    }
  }

  static async healthCheck(): Promise<HealthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`Health check failed: ${response.status}`);
      }

      const data: HealthResponse = await response.json();
      return data;
    } catch (error) {
      throw new Error("API is not available");
    }
  }

  static async isApiAvailable(): Promise<boolean> {
    try {
      await this.healthCheck();
      return true;
    } catch {
      return false;
    }
  }
}
