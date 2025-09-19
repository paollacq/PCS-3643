import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()
# Conexão do banco de dados com o backend, é necessário colocar as chaves do supabase para conectar 
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise RuntimeError("SUPABASE_URL e SUPABASE_SERVICE_KEY são obrigatórios no .env")

def get_client() -> Client:
    return create_client(SUPABASE_URL, SUPABASE_KEY)
