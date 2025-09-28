## Estrutura do Projeto - FRONTEND

```
|frontend/
├── src/                    # React + TypeScript
│   ├── components/         # Componentes 
│   ├── hooks/             # Custom hooks
│   ├── types/             
│   └── pages/             # Páginas da aplicação
│   ├── requirements.txt     

```

## Como Executar

### 1. Backend (FastAPI) (Em um terminal)

```bash
cd backend

pip install -r requirements.txt

echo "SUPABASE_URL=https://seu-projeto.supabase.co" > .env
echo "SUPABASE_SERVICE_KEY=sua_service_key" >> .env

# Iniciar API
uvicorn app.main:app --reload
```

### 2. Frontend (React) (Em outro terminal)

```bash
npm install

# Iniciar desenvolvimento
npm run dev
```

## API Endpoints

| Método | URL | Descrição |
|--------|-----|-----------|
| GET | /books | Listar livros |
| POST | /books | Criar livro |
| GET | /books/{id} | Buscar por ID |
| PATCH | /books/{id} | Atualizar parcial |
| DELETE | /books/{id} | Remover livro |

