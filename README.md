# PCS-3643 – Cadastro de Livros (FastAPI + Supabase)

Aplicação simples de **cadastro de livros**.

---

## Projeto

Dentro de cada parte do projeto (Frontend/Backend) tem um ReadME.md detalhado explicando como executar

---

## Estrutura do projeto (Backend)

```
.backend/
├── app/
│   ├── main.py          # instância `app`
│   ├── db.py            # Conexão e utilitários de acesso ao banco 
│   ├── crud.py          # Operações de CRUD sobre a tabela books
│   └── schemas.py       # entrada/saída da API
├── requirements.txt     
├── supabase_schema.sql  # Script SQL para criar/ajustar a estrutura do banco
└── README.md
```
## Estrutura do projeto (Frontend)

```
.frontend/
├── src/                    # React + TypeScript
│   ├── components/         # Componentes 
│   ├── hooks/             # Custom hooks
│   ├── types/             
│   └── pages/             # Páginas da aplicação
│   ├── requirements.txt     

```
---


## Licença

MIT

---

## Créditos

João Ricardo, Paolla e Stephanie
Projeto da disciplina **PCS-3643**.  
