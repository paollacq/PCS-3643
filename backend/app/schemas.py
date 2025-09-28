from pydantic import BaseModel, Field, field_validator
from typing import List, Optional
from datetime import datetime

class BookBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=500)
    authors: List[str] = Field(default_factory=list, description="Lista de autores/as/es")
    pages: int = Field(..., gt=0, description="Número de páginas (>0)")
    publish_year: int = Field(..., ge=0, le=3000, description="Ano de publicação (0..3000)")
    cover_url: Optional[str] = Field(default=None, description="URL da capa (opcional)")
    isbn: Optional[str] = Field(default=None, description="ISBN (opcional)")

    @field_validator('authors')
    @classmethod
    def validate_authors(cls, v: List[str]) -> List[str]:
        return [a.strip() for a in v if a and a.strip()]

class BookCreate(BookBase):
    pass

class BookUpdate(BaseModel):
    title: Optional[str] = Field(default=None, min_length=1, max_length=500)
    authors: Optional[List[str]] = None
    pages: Optional[int] = Field(default=None, gt=0)
    publish_year: Optional[int] = Field(default=None, ge=0, le=3000)
    cover_url: Optional[str] = None
    isbn: Optional[str] = None

class Book(BookBase):
    id: str
    created_at: datetime

class BooksResponse(BaseModel):
    books: List[Book]
    total: int
