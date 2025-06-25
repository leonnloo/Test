# Smart Recipe Analyzer - Frontend

A Next.js web application that allows users to input available ingredients and receive AI-powered recipe suggestions with detailed nutritional analysis.

## Features

- **Ingredient Input**: Easy-to-use form for entering available ingredients
- **Recipe Suggestions**: AI-generated recipes based on your ingredients
- **Nutritional Analysis**: Detailed nutritional information for each recipe
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Loading States**: Visual feedback during API calls

## Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **React 19** - Latest React features

## Getting Started

### Prerequisites

- Node.js 18+ installed
- FastAPI backend running on `http://localhost:8000`

### Installation

1. Install dependencies:

   ```bash
   npm install
   ```

2. Set up environment variables:

   ```bash
   # Copy .env.local and update if needed
   cp .env.local.example .env.local
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
my-app/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # Reusable React components
│   ├── IngredientForm.tsx # Ingredient input form
│   ├── RecipeCard.tsx     # Individual recipe display
│   ├── RecipeResults.tsx  # Recipe results container
│   └── ErrorBoundary.tsx  # Error boundary component
├── services/              # API service layer
│   └── recipeService.ts   # Recipe API calls
├── types/                 # TypeScript type definitions
│   └── recipe.ts          # Recipe-related types
└── .env.local            # Environment variables
```

## API Integration

The frontend expects a FastAPI backend with the following endpoints:

- `POST /api/analyze-recipes` - Analyze ingredients and return recipes
- `GET /health` - Health check endpoint

### Request/Response Format

**Request:**

```json
{
  "ingredients": ["chicken", "rice", "onion", "garlic"]
}
```

**Response:**

```json
{
  "recipes": [
    {
      "id": "1",
      "title": "Chicken Fried Rice",
      "ingredients": [
        "1 lb chicken breast",
        "2 cups rice",
        "1 onion",
        "3 cloves garlic"
      ],
      "instructions": [
        "Cook rice",
        "Sauté chicken",
        "Add vegetables",
        "Combine all"
      ],
      "nutritionalInfo": {
        "calories": 450,
        "protein": 35,
        "carbs": 40,
        "fat": 12
      },
      "prepTime": 30,
      "servings": 4
    }
  ]
}
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Environment Variables

- `NEXT_PUBLIC_API_URL` - FastAPI backend URL (default: http://localhost:8000)

## Contributing

1. Follow TypeScript best practices
2. Use Tailwind CSS for styling
3. Ensure components are modular and reusable
4. Add proper error handling
5. Test with the FastAPI backend
