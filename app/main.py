from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from app.schemas import Book, BookCreate, BookUpdate
from app.db import get_client
from app import crud

app = FastAPI(title="Biblioteca API", version="1.0.0")

# Esse é o código principal, o cérebro do projeto
# Aqui define-se como chama cada rota da API e o que ela está fazendo
# Se quiser adicionar mais funções, adicione ou modifique a lógica das rotas
# Coloque condições de conferência para não ter uma chamada falsa com sinal de verdadeira (200 OK mas nada funcionou)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/books", response_model=Book, status_code=201)
def create_book(book: BookCreate):
    client = get_client()
    payload = book.model_dump()
    record = crud.create_book(client, payload)
    return record

@app.get("/books", response_model=List[Book])
def list_books(
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    sort: str = Query("-created_at", description="Campo para ordenação (prefixe com '-' para desc)"),
):
    client = get_client()
    records, total = crud.list_books(client, limit=limit, offset=offset, sort=sort)
    # FastAPI não permite facilmente setar header aqui sem Response, então devolvemos como lista
    # e o cliente pode paginar via limit/offset. Opcional: criar rota que retorne {items, total}.
    return records

@app.get("/books/{book_id}", response_model=Book)
def get_book(book_id: str):
    client = get_client()
    record = crud.get_book(client, book_id)
    if not record:
        raise HTTPException(status_code=404, detail="Livro não encontrado")
    return record

@app.put("/books/{book_id}", response_model=Book)
def put_book(book_id: str, book: BookCreate):
    client = get_client()
    payload = book.model_dump()
    record = crud.update_book(client, book_id, payload)
    if not record:
        raise HTTPException(status_code=404, detail="Livro não encontrado")
    return record

@app.patch("/books/{book_id}", response_model=Book)
def patch_book(book_id: str, book: BookUpdate):
    client = get_client()
    payload = {k: v for k, v in book.model_dump(exclude_unset=True).items()}
    if not payload:
        raise HTTPException(status_code=400, detail="Nada para atualizar")
    record = crud.update_book(client, book_id, payload)
    if not record:
        raise HTTPException(status_code=404, detail="Livro não encontrado")
    return record

@app.delete("/books/{book_id}", status_code=204)
def delete_book(book_id: str):
    client = get_client()
    ok = crud.delete_book(client, book_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Livro não encontrado")
    return None
