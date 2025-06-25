from sqlalchemy import Column, Integer, String, Float, DateTime, Text, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

Base = declarative_base()

class RecipeAnalysis(Base):
    __tablename__ = "recipe_analyses"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    ingredients = Column(Text, nullable=False)  # JSON string of ingredients
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationship to generated recipes
    recipes = relationship("GeneratedRecipe", back_populates="analysis")

class GeneratedRecipe(Base):
    __tablename__ = "generated_recipes"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    analysis_id = Column(String, ForeignKey("recipe_analyses.id"), nullable=False)
    title = Column(String, nullable=False)
    ingredients = Column(Text, nullable=False)  # JSON string
    instructions = Column(Text, nullable=False)  # JSON string
    prep_time = Column(Integer)  # in minutes
    servings = Column(Integer)
    
    # Nutritional information
    calories = Column(Float)
    protein = Column(Float)
    carbs = Column(Float)
    fat = Column(Float)
    fiber = Column(Float)
    sugar = Column(Float)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationship back to analysis
    analysis = relationship("RecipeAnalysis", back_populates="recipes") 