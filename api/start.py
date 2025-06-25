#!/usr/bin/env python3
"""
Startup script for the Smart Recipe Analyzer API
"""

import os
import sys
import subprocess
from pathlib import Path

def check_requirements():
    """Check if requirements are installed"""
    try:
        import fastapi
        import uvicorn
        import sqlalchemy
        import httpx
        import pydantic
        print("✅ All required packages are installed")
        return True
    except ImportError as e:
        print(f"❌ Missing required package: {e}")
        print("Please run: pip install -r requirements.txt")
        return False

def check_env():
    """Check environment configuration"""
    env_file = Path(".env")
    if not env_file.exists():
        print("⚠️  .env file not found")
        print("Please copy .env.example to .env and configure your OpenRouter API key")
        return False
    
    # Load .env file
    from dotenv import load_dotenv
    load_dotenv()
    
    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key or api_key == "your_openrouter_api_key_here":
        print("⚠️  OpenRouter API key not configured")
        print("Please set OPENROUTER_API_KEY in your .env file")
        print("Get your API key from: https://openrouter.ai/")
        return False
    
    print("✅ Environment configuration looks good")
    return True

def main():
    """Main startup function"""
    print("🚀 Starting Smart Recipe Analyzer API...")
    print("-" * 50)
    
    # Check requirements
    if not check_requirements():
        sys.exit(1)
    
    # Check environment
    if not check_env():
        print("\n💡 API will still start but LLM features may not work without proper configuration")
    
    print("\n🌟 Starting FastAPI server...")
    print("📖 API Documentation: http://localhost:8000/docs")
    print("💚 Health Check: http://localhost:8000/health")
    print("🔄 Press Ctrl+C to stop")
    print("-" * 50)
    
    # Start the server
    try:
        import uvicorn
        uvicorn.run(
            "main:app", 
            host="0.0.0.0", 
            port=8000, 
            reload=True,
            log_level="info"
        )
    except KeyboardInterrupt:
        print("\n👋 Server stopped by user")
    except Exception as e:
        print(f"\n❌ Error starting server: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main() 