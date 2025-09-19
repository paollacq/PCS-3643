from typing import List, Optional, Tuple
from uuid import uuid4
from supabase import Client

TABLE = "books"

# Aqui define-se as condições de preenchimento da tabela bem como cada call da API é executada
# Seria: o que um get faz? o que preciso ter ou fazer para criar um novo livro no database?

def create_book(client: Client, payload: dict) -> dict:
    if not payload.get("id"):
        payload = {**payload, "id": str(uuid4())}

    ins = client.table(TABLE).insert(payload).execute()
    if ins.data is None:
        raise RuntimeError("Falha ao inserir livro.")

    sel = client.table(TABLE).select("*").eq("id", payload["id"]).execute()
    if not sel.data:
        raise RuntimeError("Livro inserido mas não encontrado na consulta.")
    return sel.data[0]

def get_book(client: Client, book_id: str) -> Optional[dict]:
    res = client.table(TABLE).select("*").eq("id", book_id).execute()
    if not res.data:
        return None
    return res.data[0]

def list_books(client: Client, limit: int = 50, offset: int = 0, sort: str = "-created_at") -> Tuple[List[dict], int]:
    direction = "asc"
    column = sort
    if sort.startswith("-"):
        direction = "desc"
        column = sort[1:]

    q = (
        client.table(TABLE)
        .select("*", count="exact")
        .order(column, desc=(direction == "desc"))
        .range(offset, offset + limit - 1)
    )
    res = q.execute()
    return res.data or [], (res.count or 0)

def update_book(client: Client, book_id: str, payload: dict) -> Optional[dict]:
    upd = client.table(TABLE).update(payload).eq("id", book_id).execute()
    # Após atualizar, busque o registro atualizado
    sel = client.table(TABLE).select("*").eq("id", book_id).execute()
    if not sel.data:
        return None
    return sel.data[0]

def delete_book(client: Client, book_id: str) -> bool:
    res = client.table(TABLE).delete().eq("id", book_id).execute()
    if res.data and len(res.data) > 0:
        return True
    still = client.table(TABLE).select("id").eq("id", book_id).execute()
    return not bool(still.data)
