# app/crud.py
# Assumindo app.db.get_client() retorna um supabase client
# e a tabela chama-se 'books'

from typing import Tuple, List, Optional

TABLE = "books"

def _order_params(sort: str):
    # sort: "campo" ou "-campo"
    desc = sort.startswith("-")
    col = sort.lstrip("-")
    return col, desc

def _exec(query):
    """
    Executa a query compatível com supabase-py v1 e v2.
    v2: levanta exceção em erro; res tem .data e .count.
    v1: res pode ter .data, .count e .error.
    """
    res = query.execute()
    # se for v1, ainda pode existir res.error
    err = getattr(res, "error", None)
    if err:  # só entra aqui em v1 com erro
        # em v1, err tem .message
        msg = getattr(err, "message", str(err))
        raise RuntimeError(msg)
    return res

def list_books(client, limit: int, offset: int, sort: str) -> Tuple[List[dict], int]:
    col, desc = _order_params(sort)
    query = client.table(TABLE).select("*", count="exact")
    query = query.order(col, desc=desc, nullsfirst=False)

    start = offset
    end = offset + limit - 1

    try:
        res = _exec(query.range(start, end))
    except Exception as e:
        raise RuntimeError(f"Erro ao listar livros: {e}")

    items = getattr(res, "data", None) or []
    total = getattr(res, "count", None) or 0

    # Se autores estiver como string no banco (ex: "Autor A, Autor B"), converta para lista:
    for it in items:
        if isinstance(it.get("authors"), str):
            it["authors"] = [a.strip() for a in it["authors"].split(",") if a.strip()]
    return items, total

def get_book(client, book_id: str) -> Optional[dict]:
    try:
        res = _exec(client.table(TABLE).select("*").eq("id", book_id).single())
    except Exception as e:
        # Em v2, exceção também para "not found"? depende do PostgREST;
        # se quiser diferenciar, inspecione e.args/str(e).
        # Aqui, retornamos None quando for "no rows".
        msg = str(e)
        if "PGRST116" in msg or "No rows found" in msg or "no rows" in msg.lower():
            return None
        raise RuntimeError(f"Erro ao buscar livro: {e}")

    item = getattr(res, "data", None)
    if not item:
        return None

    if isinstance(item.get("authors"), str):
        item["authors"] = [a.strip() for a in item["authors"].split(",") if a.strip()]
    return item

def create_book(client, data: dict) -> dict:
    payload = data.copy()
    if isinstance(payload.get("authors"), list):
        payload["authors"] = ", ".join(payload["authors"])

    try:
        res = _exec(client.table(TABLE).insert(payload).select("*").single())
    except Exception as e:
        raise RuntimeError(f"Erro ao criar livro: {e}")

    item = getattr(res, "data", None) or {}
    if isinstance(item.get("authors"), str):
        item["authors"] = [a.strip() for a in item["authors"].split(",") if a.strip()]
    return item

def update_book(client, book_id: str, data: dict) -> Optional[dict]:
    payload = data.copy()
    if isinstance(payload.get("authors"), list):
        payload["authors"] = ", ".join(payload["authors"])

    try:
        res = _exec(client.table(TABLE).update(payload).eq("id", book_id).select("*").single())
    except Exception as e:
        msg = str(e)
        if "PGRST116" in msg or "No rows found" in msg or "no rows" in msg.lower():
            return None
        raise RuntimeError(f"Erro ao atualizar livro: {e}")

    item = getattr(res, "data", None)
    if not item:
        return None

    if isinstance(item.get("authors"), str):
        item["authors"] = [a.strip() for a in item["authors"].split(",") if a.strip()]
    return item

def delete_book(client, book_id: str) -> bool:
    try:
        _exec(client.table(TABLE).delete().eq("id", book_id))
    except Exception as e:
        msg = str(e)
        if "PGRST116" in msg or "No rows found" in msg or "no rows" in msg.lower():
            return False
        raise RuntimeError(f"Erro ao excluir livro: {e}")
    return True
