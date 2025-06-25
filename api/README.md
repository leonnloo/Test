# Smart Recipe Analyzer API

A FastAPI backend that provides AI-powered recipe suggestions and nutritional analysis based on user ingredients.

## Features

- 🤖 **AI-Powered Recipe Generation**: Uses OpenRouter LLM integration for creative recipe suggestions
- 📊 **Nutritional Analysis**: Detailed nutritional information for each recipe
- 🗄️ **SQLite Database**: Stores recipe analysis history
- ✅ **Request Validation**: Comprehensive input validation using Pydantic
- 🔄 **Fallback System**: Graceful degradation when LLM services are unavailable
- 📝 **API Documentation**: Automatic Swagger/OpenAPI documentation
- 🔒 **CORS Support**: Configured for frontend integration

## Quick Start

### 1. Install Dependencies

```bash
cd api
pip install -r requirements.txt
```

### 2. Environment Setup

Copy the environment template and add your OpenRouter API key:

```bash
cp .env.example .env
```

Edit `.env` and add your OpenRouter API key:

```
OPENROUTER_API_KEY=your_actual_api_key_here
```

### 3. Run the Server

```bash
# Development mode with auto-reload
python main.py

# Or using uvicorn directly
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at:

- **API**: http://localhost:8000
- **Documentation**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

## API Endpoints

### Core Endpoints

#### `POST /api/analyze-recipes`

Generate recipes from ingredients list.

**Request Body:**

```json
{
  "ingredients": ["chicken", "rice", "vegetables"]
}
```

**Response:**

```json
{
  "recipes": [
    {
      "id": "uuid-string",
      "title": "Chicken Fried Rice",
      "ingredients": ["chicken", "rice", "vegetables", "soy sauce"],
      "instructions": ["Step 1...", "Step 2..."],
      "nutritionalInfo": {
        "calories": 450,
        "protein": 25.5,
        "carbs": 35.2,
        "fat": 18.7,
        "fiber": 8.3,
        "sugar": 12.1
      },
      "prepTime": 30,
      "servings": 4
    }
  ],
  "message": "Generated 1 recipes from your ingredients!"
}
```

#### `GET /api/recipe-history?limit=10`

Get recent recipe analysis history.

#### `GET /health`

Health check endpoint.

## Architecture

### Directory Structure

```
api/
├── main.py                 # FastAPI app entry point
├── requirements.txt        # Python dependencies
├── .env                   # Environment variables
├── app/
│   ├── __init__.py
│   ├── models.py          # SQLAlchemy database models
│   ├── schemas.py         # Pydantic request/response schemas
│   ├── database.py        # Database configuration
│   ├── services/
│   │   ├── __init__.py
│   │   ├── openrouter_service.py    # LLM integration
│   │   └── recipe_service.py        # Business logic
│   └── routers/
│       ├── __init__.py
│       ├── health.py      # Health check endpoints
│       └── recipes.py     # Recipe analysis endpoints
```

### Key Components

1. **OpenRouter Integration**: Cost-effective LLM API access with fallback handling
2. **SQLAlchemy Models**: Async database operations with relationship mapping
3. **Pydantic Validation**: Comprehensive request/response validation
4. **Service Layer**: Clean separation of business logic and API concerns
5. **Error Handling**: Graceful error responses with informative messages

## Database Schema

### Tables

- **recipe_analyses**: Stores ingredient analysis requests
- **generated_recipes**: Stores AI-generated recipes with nutritional data

### Models

```python
class RecipeAnalysis(Base):
    id: str (Primary Key)
    ingredients: str (JSON)
    created_at: datetime
    recipes: List[GeneratedRecipe]

class GeneratedRecipe(Base):
    id: str (Primary Key)
    analysis_id: str (Foreign Key)
    title: str
    ingredients: str (JSON)
    instructions: str (JSON)
    prep_time: int
    servings: int
    calories: float
    protein: float
    carbs: float
    fat: float
    fiber: float
    sugar: float
    created_at: datetime
```

## Environment Variables

| Variable             | Description                  | Default                        |
| -------------------- | ---------------------------- | ------------------------------ |
| `OPENROUTER_API_KEY` | Your OpenRouter API key      | Required                       |
| `OPENROUTER_API_URL` | OpenRouter API base URL      | `https://openrouter.ai/api/v1` |
| `DATABASE_URL`       | SQLite database URL          | `sqlite+aiosqlite:///./app.db` |
| `DEBUG`              | Enable debug mode            | `True`                         |
| `CORS_ORIGINS`       | Comma-separated CORS origins | `http://localhost:3000`        |

## Error Handling

The API includes comprehensive error handling:

- **400 Bad Request**: Invalid ingredients or request format
- **500 Internal Server Error**: LLM service errors, database issues
- **Fallback Recipes**: When LLM is unavailable, returns simple template recipes

## Development

### Adding New Features

1. **New Endpoints**: Add to appropriate router in `app/routers/`
2. **Database Changes**: Modify models in `app/models.py`
3. **Validation**: Update schemas in `app/schemas.py`
4. **Business Logic**: Extend services in `app/services/`

### Testing

```bash
# Run the server and test endpoints
curl -X POST "http://localhost:8000/api/analyze-recipes" \
  -H "Content-Type: application/json" \
  -d '{"ingredients": ["chicken", "rice"]}'

# Check health
curl http://localhost:8000/health
```

## Frontend Integration

The API is designed to work with the Next.js frontend. Ensure the frontend's `NEXT_PUBLIC_API_URL` environment variable points to this API:

```bash
# In my-app/.env.local
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## OpenRouter Setup

1. Sign up at [OpenRouter](https://openrouter.ai/)
2. Create an API key
3. Add the key to your `.env` file
4. The default model is `anthropic/claude-3-haiku` for cost-effectiveness

## Production Deployment

For production deployment:

1. Set `DEBUG=False`
2. Use a production database (PostgreSQL recommended)
3. Set secure CORS origins
4. Use environment secrets for API keys
5. Configure proper logging
6. Set up monitoring and health checks
