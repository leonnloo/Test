# Smart Recipe Analyzer - Frontend

A modern Next.js frontend for the Smart Recipe Analyzer API that provides AI-powered recipe suggestions and nutritional analysis.

## 🚀 Features

- **AI-Powered Recipe Generation**: Get creative recipe suggestions based on your ingredients
- **Detailed Nutritional Analysis**: View calories, protein, carbs, fat, fiber, and sugar content
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Real-time API Status**: Visual indicators for backend connectivity
- **Smart Error Handling**: Graceful degradation with helpful error messages
- **Recipe History**: View previously generated recipes
- **Offline Detection**: Alerts when internet connection is lost

## 🏗️ Backend Integration

This frontend is designed to work with the FastAPI backend located in the `/api` directory. The integration includes:

### API Endpoints Used

- `GET /health` - Health check and API status
- `POST /api/analyze-recipes` - Generate recipes from ingredients
- `GET /api/recipe-history` - Retrieve recipe generation history

### Data Format Compatibility

The frontend supports both new and legacy recipe formats for maximum compatibility:

#### New Format (Primary)

```typescript
{
  id: string;
  name: string;
  cookingTime: string;  // e.g., "25 minutes"
  difficulty: string;   // "Easy", "Medium", "Hard"
  nutrition: {
    calories: number;
    protein: string;    // e.g., "12g"
    carbs: string;      // e.g., "60g"
    fat?: string;       // e.g., "15g"
    fiber?: string;     // e.g., "8g"
    sugar?: string;     // e.g., "5g"
  };
  ingredients: string[];
  instructions: string[];
  servings?: number;
}
```

#### Legacy Format (Backward Compatibility)

```typescript
{
  id: string;
  title: string;
  prepTime: number; // in minutes
  nutritionalInfo: {
    calories: number;
    protein: number; // numeric values
    carbs: number;
    fat: number;
    // ...
  }
  // ... other fields
}
```

## 🛠️ Setup Instructions

### Prerequisites

- Node.js 18+
- npm or yarn
- Running FastAPI backend (see `/api` directory)

### Installation

1. **Install dependencies:**

   ```bash
   cd my-app
   npm install
   ```

2. **Configure API connection:**

   Create a `.env.local` file in the `my-app` directory:

   ```bash
   # For local development
   NEXT_PUBLIC_API_URL=http://localhost:8000

   # For production
   # NEXT_PUBLIC_API_URL=https://your-api-domain.com
   ```

3. **Start the development server:**

   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Production Deployment

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 🧪 Testing Backend Integration

Use the included integration test to verify the connection:

```bash
# Test the API connection
node integration-test.js
```

This will test:

- ✅ Health endpoint connectivity
- ✅ Recipe generation functionality
- ✅ Recipe history retrieval
- ✅ Data format compatibility

## 🔧 Configuration

### Environment Variables

| Variable              | Description          | Default                 | Required |
| --------------------- | -------------------- | ----------------------- | -------- |
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:8000` | No       |

### API Configuration

The frontend automatically detects and adapts to:

- **Backend availability**: Shows connection status indicators
- **Response format**: Handles both new and legacy API formats
- **Error scenarios**: Provides specific error messages for different failure types

## 🛡️ Error Handling

The frontend includes comprehensive error handling:

### Connection Errors

- **Offline detection**: Alerts when internet is unavailable
- **API unavailable**: Shows status when backend is down
- **Network timeouts**: Graceful handling with retry options

### Validation Errors

- **Empty ingredients**: Prevents submission with no ingredients
- **Invalid format**: Handles malformed API responses
- **Rate limiting**: Shows appropriate messages for API limits

### User Experience

- **Loading states**: Skeleton loaders during API calls
- **Success messages**: Displays backend success messages
- **Retry mechanisms**: Easy retry buttons for failed requests

## 🎨 Components

### Main Components

- **`IngredientForm`**: Input form for ingredients with validation
- **`RecipeResults`**: Display container for recipe suggestions
- **`RecipeCard`**: Individual recipe display with nutritional info
- **`ErrorBoundary`**: Global error handling and recovery

### Service Layer

- **`RecipeService`**: API communication with error handling
  - `analyzeIngredients()`: Generate recipes from ingredients
  - `getRecipeHistory()`: Fetch previous analyses
  - `healthCheck()`: Check API availability
  - `isApiAvailable()`: Simple availability check

## 🔍 Troubleshooting

### Common Issues

#### "API is not available" Error

1. Ensure the FastAPI backend is running on port 8000
2. Check that `NEXT_PUBLIC_API_URL` is correctly set
3. Verify no firewall is blocking the connection
4. Run the integration test: `node integration-test.js`

#### "Failed to analyze recipes" Error

1. Check the backend logs for detailed error information
2. Verify the OpenRouter API key is configured in backend
3. Ensure ingredients are properly formatted (non-empty strings)
4. Test with simple ingredients like ["chicken", "rice"]

#### No Recipes Generated

1. Backend may be using fallback recipes due to LLM service issues
2. Check backend OpenRouter API key configuration
3. Verify backend has internet access for LLM API calls

#### Styling Issues

1. Ensure Tailwind CSS is properly installed
2. Check that CSS files are being imported correctly
3. Verify no CSS conflicts with custom styles

### Debug Mode

Enable detailed logging by opening browser console. The app logs:

- API request/response details
- Connection status changes
- Error details with stack traces
- Performance metrics

## 📁 Project Structure

```
my-app/
├── app/
│   ├── page.tsx              # Main application page
│   ├── layout.tsx            # Root layout with ErrorBoundary
│   └── globals.css           # Global styles
├── components/
│   ├── ErrorBoundary.tsx     # Error handling component
│   ├── IngredientForm.tsx    # Ingredient input form
│   ├── RecipeCard.tsx        # Recipe display component
│   ├── RecipeResults.tsx     # Results container
│   └── SkeletonLoader.tsx    # Loading state components
├── services/
│   └── recipeService.ts      # API communication service
├── types/
│   └── recipe.ts             # TypeScript type definitions
├── integration-test.js       # Backend integration test
└── package.json              # Dependencies and scripts
```

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your repository to Vercel
2. Set environment variable: `NEXT_PUBLIC_API_URL=https://your-api-domain.com`
3. Deploy automatically on push

### Other Platforms

The app is a standard Next.js application and can be deployed to:

- Netlify
- AWS Amplify
- Docker containers
- Traditional hosting

Ensure the `NEXT_PUBLIC_API_URL` environment variable points to your deployed backend.

## 🤝 Backend Integration Checklist

- ✅ Backend running on port 8000
- ✅ CORS configured for frontend domain
- ✅ OpenRouter API key configured
- ✅ Database initialized
- ✅ All endpoints returning expected formats
- ✅ Error responses include helpful messages
- ✅ Integration test passing

## 📞 Support

If you encounter issues:

1. Run the integration test: `node integration-test.js`
2. Check browser console for detailed error logs
3. Verify backend API documentation at `http://localhost:8000/docs`
4. Review backend logs for API-side issues

The frontend is designed to work seamlessly with the FastAPI backend when properly configured.
