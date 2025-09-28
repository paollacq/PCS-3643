import { useState, useEffect, useCallback } from 'react';
import { Book } from '@/types/book';
import { toast } from '@/hooks/use-toast';

const API_BASE_URL = 'http://localhost:8000';

export const useBooks = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const parseListResponse = useCallback((data: any) => {
    if (data && Array.isArray(data.books)) {
      setBooks(data.books);
      setTotal(typeof data.total === 'number' ? data.total : data.books.length);
    } else if (Array.isArray(data)) {
      setBooks(data);
      setTotal(data.length);
    } else {
      console.error('Resposta inesperada de /books:', data);
      setBooks([]);
      setTotal(0);
    }
  }, []);

  const fetchBooks = useCallback(async (limit = 50, offset = 0, sort = '-created_at') => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/books?limit=${limit}&offset=${offset}&sort=${encodeURIComponent(sort)}`
      );
      if (!response.ok) throw new Error(`Erro ao buscar livros (${response.status})`);
      const data = await response.json();
      parseListResponse(data);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Falha ao carregar livros',
        variant: 'destructive',
      });
      setBooks([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [parseListResponse]);

  const createBook = useCallback(async (payload: Partial<Book>) => {
    try {
      const res = await fetch(`${API_BASE_URL}/books`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || 'Erro ao criar livro');
      }
      const created: Book = await res.json();
      setBooks(prev => [created, ...prev]);
      setTotal(prev => prev + 1);
      toast({ title: 'Sucesso', description: 'Livro criado com sucesso!' });
      return created;
    } catch (error) {
      toast({ title: 'Erro', description: error instanceof Error ? error.message : 'Erro ao criar livro', variant: 'destructive' });
      return null;
    }
  }, []);

  const updateBook = useCallback(async (id: string, payload: Partial<Book>) => {
    try {
      const res = await fetch(`${API_BASE_URL}/books/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || 'Erro ao atualizar livro');
      }
      const updated: Book = await res.json();
      setBooks(prev => prev.map(b => (b.id === id ? updated : b)));
      toast({ title: 'Sucesso', description: 'Livro atualizado com sucesso!' });
      return updated;
    } catch (error) {
      toast({ title: 'Erro', description: error instanceof Error ? error.message : 'Erro ao atualizar livro', variant: 'destructive' });
      return null;
    }
  }, []);

  const deleteBook = useCallback(async (id: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/books/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || 'Erro ao excluir livro');
      }
      setBooks(prev => prev.filter(b => b.id !== id));
      setTotal(prev => Math.max(prev - 1, 0));
      toast({ title: 'Sucesso', description: 'Livro excluído com sucesso!' });
      return true;
    } catch (error) {
      toast({ title: 'Erro', description: error instanceof Error ? error.message : 'Erro ao excluir livro', variant: 'destructive' });
      return false;
    }
  }, []);

  useEffect(() => { fetchBooks(); }, [fetchBooks]);

  return { books, loading, total, fetchBooks, createBook, updateBook, deleteBook };
};
