# Smart Recipe Analyzer

> **AI-Powered Recipe Discovery and Nutritional Analysis Platform**

A full-stack application that transforms your available ingredients into delicious recipes with detailed nutritional analysis, powered by AI and modern web technologies.

![Architecture](https://img.shields.io/badge/Architecture-Full--Stack-blue)
![Backend](https://img.shields.io/badge/Backend-FastAPI-green)
![Frontend](https://img.shields.io/badge/Frontend-Next.js-black)
![AI](https://img.shields.io/badge/AI-OpenRouter-purple)
![Database](https://img.shields.io/badge/Database-SQLite-orange)

## 🚀 Features

### 🤖 **AI-Powered Recipe Generation**

- Advanced LLM integration via OpenRouter API
- Creative recipe suggestions based on available ingredients
- Fallback recipe system for offline reliability
- Support for 1-20 ingredients per analysis

### 📊 **Comprehensive Nutritional Analysis**

- Detailed nutritional breakdown per serving
- Calories, protein, carbohydrates, fat, fiber, and sugar content
- Professional nutritionist-level accuracy
- Visual nutritional cards with color-coded categories

### 🎨 **Modern User Experience**

- Responsive design optimized for all devices
- Real-time API status monitoring
- Intelligent error handling with user-friendly messages
- Smooth animations and loading states
- Offline detection and graceful degradation

### 📈 **Recipe History & Management**

- Persistent recipe storage with SQLite database
- Recipe analysis history tracking
- Searchable recipe database
- Export and sharing capabilities

## 🏗️ Architecture

```
┌─────────────────┐    HTTP/JSON    ┌─────────────────┐
│                 │    Requests     │                 │
│   Next.js       │◄──────────────► │   FastAPI       │
│   Frontend      │                 │   Backend       │
│                 │                 │                 │
│  • React 19     │                 │  • Python 3.9+ │
│  • TypeScript   │                 │  • Async/Await │
│  • Tailwind CSS │                 │  • SQLAlchemy   │
│  • Server Comp. │                 │  • Pydantic     │
└─────────────────┘                 └─────────────────┘
                                             │
                                             │ API Calls
                                             ▼
                                    ┌─────────────────┐
                                    │                 │
                                    │   OpenRouter    │
                                    │   LLM API       │
                                    │                 │
                                    │  • Claude 3     │
                                    │  • Cost-Effective│
                                    │  • JSON Response │
                                    └─────────────────┘
```

## 🛠️ Quick Start

### Prerequisites

- **Python 3.9+** with pip
- **Node.js 18+** with npm
- **OpenRouter API Key** ([Get one here](https://openrouter.ai/))

### 1. Clone & Setup

```bash
# Clone the repository
git clone <repository-url>
cd Smart-Recipe-Analyzer

# Set up backend
cd api
pip install -r requirements.txt

# Set up frontend
cd ../my-app
npm install
```

### 2. Configure Environment

**Backend Configuration** (`api/.env`):

```bash
# Create .env file in api directory
OPENROUTER_API_KEY=your_openrouter_api_key_here
DEBUG=True
CORS_ORIGINS=http://localhost:3000
```

**Frontend Configuration** (`my-app/.env.local`):

```bash
# Create .env.local file in my-app directory
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 3. Start the Services

**Terminal 1 - Backend:**

```bash
cd api
python main.py
# Backend available at: http://localhost:8000
# API Docs available at: http://localhost:8000/docs
```

**Terminal 2 - Frontend:**

```bash
cd my-app
npm run dev
# Frontend available at: http://localhost:3000
```

### 4. Test the Integration

```bash
# Run integration test
cd my-app
node integration-test.js
```

### 5. Start Cooking! 🍳

1. Open http://localhost:3000
2. Enter ingredients (e.g., "chicken, rice, vegetables")
3. Get AI-generated recipes with nutritional analysis
4. Cook and enjoy!

## 📁 Project Structure

```
Smart-Recipe-Analyzer/
├── README.md                     # This file
│
├── api/                          # FastAPI Backend
│   ├── app/
│   │   ├── models.py            # SQLAlchemy database models
│   │   ├── schemas.py           # Pydantic request/response schemas
│   │   ├── database.py          # Database configuration
│   │   ├── routers/
│   │   │   ├── recipes.py       # Recipe analysis endpoints
│   │   │   └── health.py        # Health check endpoints
│   │   └── services/
│   │       ├── openrouter_service.py  # LLM integration
│   │       └── recipe_service.py      # Business logic
│   ├── main.py                  # FastAPI app entry point
│   ├── requirements.txt         # Python dependencies
│   ├── test_api.py             # API test suite
│   └── README.md               # Backend documentation
│
└── my-app/                      # Next.js Frontend
    ├── app/
    │   ├── page.tsx            # Main application page
    │   ├── layout.tsx          # Root layout
    │   └── globals.css         # Global styles
    ├── components/
    │   ├── IngredientForm.tsx  # Ingredient input form
    │   ├── RecipeCard.tsx      # Recipe display component
    │   ├── RecipeResults.tsx   # Results container
    │   └── ErrorBoundary.tsx   # Error handling
    ├── services/
    │   └── recipeService.ts    # API communication
    ├── types/
    │   └── recipe.ts           # TypeScript definitions
    ├── integration-test.js     # Frontend-backend test
    └── README.md               # Frontend documentation
```

## 🔧 Technology Stack

### Backend (`/api`)

- **[FastAPI](https://fastapi.tiangolo.com/)** - Modern Python web framework
- **[SQLAlchemy](https://www.sqlalchemy.org/)** - Database ORM with async support
- **[Pydantic](https://pydantic-docs.helpmanual.io/)** - Data validation and serialization
- **[OpenRouter](https://openrouter.ai/)** - LLM API integration
- **[SQLite](https://www.sqlite.org/)** - Lightweight database
- **[Uvicorn](https://www.uvicorn.org/)** - ASGI server

### Frontend (`/my-app`)

- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[React 19](https://react.dev/)** - UI library with latest features
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework

### AI & External Services

- **[OpenRouter API](https://openrouter.ai/)** - Access to multiple LLM models
- **[Claude 3 Haiku](https://anthropic.com/)** - Primary LLM for recipe generation

## 🧪 Testing

### Backend Tests

```bash
cd api
python test_api.py              # Basic API functionality
python test_improvements.py     # LLM integration tests
```

### Frontend Tests

```bash
cd my-app
node integration-test.js        # Frontend-backend integration
npm run lint                    # Code quality checks
```

### Manual Testing Checklist

- [ ] Backend health check responds
- [ ] Recipe generation works with sample ingredients
- [ ] Frontend displays recipes correctly
- [ ] Error handling works (try with backend offline)
- [ ] Mobile responsiveness
- [ ] API status indicators function

## 🚀 Deployment

### Production Setup

**Backend Deployment:**

```bash
# Using Docker (recommended)
cd api
docker build -t recipe-analyzer-api .
docker run -p 8000:8000 -e OPENROUTER_API_KEY=your_key recipe-analyzer-api

# Or using traditional hosting
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
```

**Frontend Deployment (Vercel):**

```bash
cd my-app
npm run build
# Deploy to Vercel with NEXT_PUBLIC_API_URL=https://your-api-domain.com
```

### Environment Variables for Production

**Backend:**

- `OPENROUTER_API_KEY` - Your OpenRouter API key
- `DATABASE_URL` - Production database URL
- `CORS_ORIGINS` - Allowed frontend domains
- `DEBUG=False` - Disable debug mode

**Frontend:**

- `NEXT_PUBLIC_API_URL` - Production API URL

## 📖 API Documentation

### Endpoints

| Method | Endpoint               | Description                        |
| ------ | ---------------------- | ---------------------------------- |
| `GET`  | `/health`              | Health check and API status        |
| `POST` | `/api/analyze-recipes` | Generate recipes from ingredients  |
| `GET`  | `/api/recipe-history`  | Retrieve recipe generation history |

### Example Request/Response

**POST /api/analyze-recipes**

```json
// Request
{
  "ingredients": ["chicken", "rice", "vegetables", "soy sauce"]
}

// Response
{
  "recipes": [
    {
      "id": "recipe_1_abc123",
      "name": "Chicken Fried Rice",
      "cookingTime": "25 minutes",
      "difficulty": "Easy",
      "nutrition": {
        "calories": 350,
        "protein": "18g",
        "carbs": "45g",
        "fat": "12g",
        "fiber": "6g"
      },
      "ingredients": ["boneless chicken", "rice", "mixed vegetables", "soy sauce"],
      "instructions": ["Heat oil in pan", "Cook chicken until done", "Add rice and vegetables"],
      "servings": 4
    }
  ],
  "message": "Generated 1 recipes from your ingredients!"
}
```

## 🐛 Troubleshooting

### Common Issues

**"API is not available" Error:**

1. Ensure FastAPI backend is running on port 8000
2. Check `NEXT_PUBLIC_API_URL` configuration
3. Verify firewall settings
4. Run integration test: `node my-app/integration-test.js`

**No Recipes Generated:**

1. Verify OpenRouter API key is configured
2. Check backend logs for LLM service errors
3. Test with simple ingredients: `["chicken", "rice"]`
4. Ensure internet connectivity for LLM API calls

**Styling Issues:**

1. Ensure Tailwind CSS is properly installed
2. Check console for CSS errors
3. Verify no conflicting CSS imports

**Database Errors:**

1. Check SQLite file permissions
2. Ensure database directory is writable
3. Run: `python -c "from app.models import Base; from app.database import engine; Base.metadata.create_all(engine)"`

### Debug Mode

Enable detailed logging:

```bash
# Backend
DEBUG=True python main.py

# Frontend
npm run dev  # Automatic console logging
```

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** changes: `git commit -m 'Add amazing feature'`
4. **Push** to branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Development Guidelines

- Follow existing code style and conventions
- Add tests for new features
- Update documentation
- Ensure cross-platform compatibility
- Test both frontend and backend integration

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenRouter** for providing accessible LLM API services
- **FastAPI** team for the excellent Python web framework
- **Next.js** team for the powerful React framework
- **Anthropic** for Claude 3 language model
- **Tailwind CSS** for the utility-first CSS framework

## 📞 Support

For support and questions:

1. **Check the troubleshooting section** above
2. **Run the integration test** to diagnose issues
3. **Review backend API docs** at `http://localhost:8000/docs`
4. **Check browser console** for frontend errors
5. **Open an issue** on GitHub with detailed error information

---

**Built with ❤️ for food lovers and cooking enthusiasts**

_Transform your ingredients into culinary masterpieces with the power of AI!_
