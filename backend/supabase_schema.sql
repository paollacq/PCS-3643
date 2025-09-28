create extension if not exists "pgcrypto";

create table if not exists public.books (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  authors jsonb not null default '[]'::jsonb,
  pages integer not null check (pages > 0),
  publish_year integer not null check (publish_year between 0 and 3000),
  created_at timestamptz not null default now()
);

alter table public.books disable row level security;

-- Se vc quiser rodar com a sua própria tabela do banco de dados, é necessário rodar esse código na parte de SQL pq o supabase
-- tem um nível de segurança que inicialmente não permite que um vscode anon acesse tudo sem problemas, isso abaixa o nível
-- de segurança da tabela.