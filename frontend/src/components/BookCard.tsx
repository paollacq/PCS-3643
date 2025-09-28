import { Book } from '@/types/book';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit2, Trash2, BookOpen, Users, FileText, Calendar } from 'lucide-react';

interface BookCardProps {
  book: Book;
  onEdit: (book: Book) => void;
  onDelete: (id: string) => void;
}

// Para editar o Layout de cada ficha de livro

export const BookCard = ({ book, onEdit, onDelete }: BookCardProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const coverSrc =
    (book as any).cover_url && (book as any).cover_url.trim() !== ''
      ? (book as any).cover_url
      : (book as any).isbn
        ? `https://covers.openlibrary.org/b/isbn/${(book as any).isbn}-L.jpg`
        : 'https://placehold.co/600x800?text=Sem+Capa';

  return (
    <Card className="h-full shadow-card gradient-card border-0 transition-smooth hover:shadow-glow group">
      <div className="relative w-full aspect-[3/4] overflow-hidden rounded-t-lg bg-muted">
        <img
          src={coverSrc}
          alt={`Capa de ${book.title}`}
          loading="lazy"
          className="h-full w-full object-cover"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = 'https://placehold.co/600x800?text=Sem+Capa';
          }}
        />
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-smooth">
              {book.title}
            </h3>

            <div className="flex items-center gap-2 mt-2 flex-wrap text-muted-foreground">
              <Users className="h-3.5 w-3.5" />
              <div className="flex items-center gap-1 flex-wrap">
                {book.authors?.length
                  ? book.authors.map((author, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {author}
                      </Badge>
                    ))
                  : <span className="text-sm">Autor desconhecido</span>}
              </div>
            </div>
          </div>

          <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
            <BookOpen className="h-4 w-4 text-primary" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="py-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <FileText className="h-3 w-3" />
            <span>{book.pages} páginas</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>{book.publish_year}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-2">
        <div className="w-full flex items-center justify-between gap-2">
          <div className="text-xs text-muted-foreground">
            Adicionado em {book.created_at ? formatDate(book.created_at) : '—'}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(book)}
              className="flex-1 hover:border-primary/30 hover:text-primary"
            >
              <Edit2 className="h-3 w-3" />
              Editar
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(book.id)}
              className="flex-1 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20"
            >
              <Trash2 className="h-3 w-3" />
              Excluir
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};
