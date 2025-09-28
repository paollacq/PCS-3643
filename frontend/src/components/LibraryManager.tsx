import { useEffect, useState } from 'react';
import { useBooks } from '@/hooks/useBooks';
import { BookCard } from '@/components/BookCard';
import { BookForm } from '@/components/BookForm';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Book } from '@/types/book';
import { Plus, Search, BookOpen, Library, Loader2, Grid3X3, List } from 'lucide-react';
import libraryHero from '@/assets/library.jpg';

export const LibraryManager = () => {
  const { books, loading, total, createBook, updateBook, deleteBook, fetchBooks } = useBooks();
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | undefined>();
  const [deleteBookId, setDeleteBookId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('-created_at');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchBooks(50, 0, sortBy);
  }, [sortBy, fetchBooks]);

  const safeBooks: Book[] = Array.isArray(books) ? books : [];

  const term = searchTerm.trim().toLowerCase();
  const filteredBooks = term
    ? safeBooks.filter((book) => {
        const t = (book.title ?? '').toLowerCase();
        const authors = Array.isArray(book.authors) ? book.authors : [];
        const matchesTitle = t.includes(term);
        const matchesAuthor = authors.some((a) => (a ?? '').toLowerCase().includes(term));
        return matchesTitle || matchesAuthor;
      })
    : safeBooks;

  const handleCreateBook = () => {
    setEditingBook(undefined);
    setShowForm(true);
  };

  const handleEditBook = (book: Book) => {
    setEditingBook(book);
    setShowForm(true);
  };

  const handleFormSubmit = async (data: any) => {
    setFormLoading(true);
    try {
      if (editingBook) {
        await updateBook(editingBook.id, data);
      } else {
        await createBook(data);
      }
      setShowForm(false);
      setEditingBook(undefined);
      await fetchBooks(50, 0, sortBy);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (deleteBookId) {
      await deleteBook(deleteBookId);
      setDeleteBookId(null);
      await fetchBooks(50, 0, sortBy);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-surface">
      <div className="relative h-96 bg-gradient-to-r from-primary/90 to-accent/90 overflow-hidden">
        <img
          src={libraryHero}
          alt="Biblioteca moderna"
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-accent/60" />

        <div className="relative h-full flex items-center justify-center px-6">
          <div className="text-center text-white">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                <Library className="h-8 w-8" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold">Sistema de Biblioteca</h1>
            </div>
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
              Gerencie o acervo da sua biblioteca de forma inteligente e eficiente
            </p>
            <div className="mt-6 flex items-center justify-center gap-4">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                <BookOpen className="h-3 w-3 mr-1" />
                {total} livros cadastrados
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <Card className="shadow-card border-0">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                <div className="flex-1 w-full lg:max-w-md">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por título ou autor..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full lg:w-auto">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full lg:w-48">
                      <SelectValue placeholder="Ordenar por" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="-created_at">Mais recente</SelectItem>
                      <SelectItem value="created_at">Mais antigo</SelectItem>
                      <SelectItem value="title">Título A-Z</SelectItem>
                      <SelectItem value="-title">Título Z-A</SelectItem>
                      <SelectItem value="publish_year">Ano ↑</SelectItem>
                      <SelectItem value="-publish_year">Ano ↓</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex border rounded-lg p-1 bg-muted/30">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                      className="h-8 w-8 p-0"
                    >
                      <Grid3X3 className="h-3 w-3" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                      className="h-8 w-8 p-0"
                    >
                      <List className="h-3 w-3" />
                    </Button>
                  </div>

                  <Button onClick={handleCreateBook} variant="hero" className="transition-bounce hover:scale-105">
                    <Plus className="h-4 w-4" />
                    Novo Livro
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">Carregando livros...</p>
            </div>
          </div>
        ) : filteredBooks.length === 0 ? (
          <Card className="shadow-card border-0">
            <CardContent className="p-12 text-center">
              <div className="p-4 bg-muted/30 rounded-full w-fit mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {searchTerm ? 'Nenhum livro encontrado' : 'Nenhum livro cadastrado'}
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchTerm ? 'Tente alterar os termos de busca' : 'Comece adicionando o primeiro livro à sua biblioteca'}
              </p>
              {!searchTerm && (
                <Button onClick={handleCreateBook} variant="hero">
                  <Plus className="h-4 w-4" />
                  Adicionar Primeiro Livro
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'space-y-4'
            }
          >
            {filteredBooks.map((book) => (
              <BookCard key={book.id} book={book} onEdit={handleEditBook} onDelete={setDeleteBookId} />
            ))}
          </div>
        )}
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 border-0">
          <BookForm
            book={editingBook}
            onSubmit={handleFormSubmit}
            onCancel={() => setShowForm(false)}
            loading={formLoading}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteBookId} onOpenChange={() => setDeleteBookId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este livro? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
