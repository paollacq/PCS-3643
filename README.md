# Biblioteca API (FastAPI + Supabase)

API REST para cadastrar, editar, remover e listar livros de uma biblioteca.
Os dados são salvos no banco de dados **Supabase (Postgres)**.

## Requisitos

- Python 3.11+
- Conta e projeto no [Supabase](https://supabase.com/)
- URL do projeto e **Service Role Key** CUIDADO (não use a `anon key` no backend)

### Estrutura da Tabela

```
books (
  id uuid PK,
  title text,
  authors jsonb,          -- lista de autores/as/es (ex.: ["Ana", "Bruno"])
  pages integer,
  publish_year integer,
  created_at timestamptz
)
```

## Como Rodar 

1. Crie seu arquivo `.env`:

Edite o `.env` com:
```
SUPABASE_URL=...          # URL do projeto
SUPABASE_SERVICE_KEY=...  # service_role key
```

2. Instale dependências e rode o servidor:

```
python3 -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host ${APP_HOST:-0.0.0.0} --port ${APP_PORT:-8000} (ou uvicorn app.main:app --reload)
```

3. Acesse a documentação interativa:
- Swagger UI: `http://localhost:8000/docs`

## Endpoints (URLs e exemplos)

Base URL local: `http://localhost:8000`

- **Criar livro**
  - `POST /books`
  - Body (JSON):
    ```json
    {
      "title": "Dom Casmurro",
      "authors": ["Machado de Assis"],
      "pages": 256,
      "publish_year": 1899
    }
    ```

- **Listar livros (paginado)**
  - `GET /books?limit=50&offset=0&sort=-created_at`

- **Buscar por ID**
  - `GET /books/{id}`

- **Atualizar (completo)**
  - `PUT /books/{id}`
  - Body: mesmo formato do POST

- **Atualizar (parcial)**
  - `PATCH /books/{id}`
  - Body: qualquer subset dos campos

- **Remover**
  - `DELETE /books/{id}`

- **Healthcheck**
  - `GET /health`

### Exemplos `curl`

```
# Criar
curl -X POST http://localhost:8000/books   -H "Content-Type: application/json"   -d '{"title":"Dom Casmurro","authors":["Machado de Assis"],"pages":256,"publish_year":1899}'

# Listar
curl "http://localhost:8000/books?limit=10&offset=0"

# Obter por ID
curl http://localhost:8000/books/<UUID>

ex:
curl http://localhost:8000/books/49a66ba9-3188-463a-adac-c24a8833edef

# Atualizar parcial
curl -X PATCH http://localhost:8000/books/<UUID>   -H "Content-Type: application/json"   -d '{"pages":300}'

ex:
curl -X PATCH http://localhost:8000/books/49a66ba9-3188-463a-adac-c24a8833edef   -H "Content-Type: application/json"   -d '{"pages":300}'

# Remover
curl -X DELETE http://localhost:8000/books/<UUID>

ex:
curl -X DELETE http://localhost:8000/books/49a66ba9-3188-463a-adac-c24a8833edef
```

## Estrutura do Projeto

```
.
├── app
│   ├── main.py
│   ├── db.py
│   ├── schemas.py
│   └── crud.py
├── requirements.txt
├── supabase_schema.sql
├── .env
└── README.md
```

## Licença

MIT
