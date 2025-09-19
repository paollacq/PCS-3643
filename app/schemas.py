from pydantic import BaseModel, Field, field_validator
from typing import List, Optional
from datetime import datetime

# Condições mínimas de preenchimento de cada campo da tabela
# Aqui o ano pode ir até 3000 mas quem se importa kk
# Observe que ao dar Update, a lógica de criação deve ser seguida porém o update é opcional para podermos atualizar parcialmente o cadastro do livro

class BookBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=500)
    authors: List[str] = Field(default_factory=list, description="Lista de autores/as/es")
    pages: int = Field(..., gt=0, description="Número de páginas (>0)")
    publish_year: int = Field(..., ge=0, le=3000, description="Ano de publicação (0..3000)")

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

class Book(BookBase):
    id: str
    created_at: datetime
