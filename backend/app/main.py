# app/main.py
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from app.schemas import Book, BookCreate, BookUpdate, BooksResponse
from app.db import get_client
from app import crud

app = FastAPI(title="Biblioteca API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # ajuste se quiser restringir
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
    record = crud.create_book(client, book.model_dump())
    return record

@app.get("/books", response_model=BooksResponse)
def list_books(
    limit: int = Query(50, ge=1, le=1000),
    offset: int = Query(0, ge=0),
    sort: str = Query("-created_at", description="campo para ordenação; use '-' para desc"),
):
    client = get_client()
    books, total = crud.list_books(client, limit=limit, offset=offset, sort=sort)
    return {"books": books, "total": total}

@app.get("/books/{book_id}", response_model=Book)
def get_book(book_id: str):
    client = get_client()
    book = crud.get_book(client, book_id)
    if not book:
        raise HTTPException(status_code=404, detail="Livro não encontrado")
    return book

@app.put("/books/{book_id}", response_model=Book)
def put_book(book_id: str, book: BookCreate):
    client = get_client()
    updated = crud.update_book(client, book_id, book.model_dump())
    if not updated:
        raise HTTPException(status_code=404, detail="Livro não encontrado")
    return updated

@app.patch("/books/{book_id}", response_model=Book)
def patch_book(book_id: str, book: BookUpdate):
    payload = book.model_dump(exclude_unset=True)
    if not payload:
        raise HTTPException(status_code=400, detail="Nada para atualizar")
    client = get_client()
    updated = crud.update_book(client, book_id, payload)
    if not updated:
        raise HTTPException(status_code=404, detail="Livro não encontrado")
    return updated

@app.delete("/books/{book_id}", status_code=204)
def delete_book(book_id: str):
    client = get_client()
    ok = crud.delete_book(client, book_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Livro não encontrado")
    return None
