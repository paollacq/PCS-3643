import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Book, BookFormData } from '@/types/book';
import { X, BookOpen, Users, FileText, Calendar } from 'lucide-react';

interface BookFormProps {
  book?: Book;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  loading?: boolean;
}

export const BookForm = ({ book, onSubmit, onCancel, loading }: BookFormProps) => {
  const [formData, setFormData] = useState<BookFormData>({
    title: book?.title || '',
    authors: book?.authors.join(', ') || '',
    pages: book?.pages?.toString() || '',
    publish_year: book?.publish_year?.toString() || '',
    cover_url: (book as any)?.cover_url || '',
    isbn: (book as any)?.isbn || '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof BookFormData, string>>>({});

  const validateForm = () => {
    const newErrors: Partial<Record<keyof BookFormData, string>> = {};

    if (!formData.title.trim()) newErrors.title = 'Título é obrigatório';
    if (!formData.authors.trim()) newErrors.authors = 'Pelo menos um autor é obrigatório';

    const pages = parseInt(formData.pages);
    if (Number.isNaN(pages) || pages < 1) newErrors.pages = 'Informe um número válido de páginas (>= 1)';

    const year = parseInt(formData.publish_year);
    if (Number.isNaN(year) || year < 1000 || year > 2100) {
      newErrors.publish_year = 'Informe um ano válido (1000–2100)';
    }

    if (formData.cover_url && !/^https?:\/\/.+/i.test(formData.cover_url.trim())) {
      newErrors.cover_url = 'Informe uma URL válida (http/https) ou deixe em branco';
    }

    if (formData.isbn && !/^[0-9Xx\-]+$/.test(formData.isbn.trim())) {
      newErrors.isbn = 'ISBN deve conter dígitos, X e hífens';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof BookFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const submitData = {
      title: formData.title.trim(),
      authors: formData.authors.split(',').map(author => author.trim()).filter(Boolean),
      pages: parseInt(formData.pages),
      publish_year: parseInt(formData.publish_year),
      ...(formData.cover_url ? { cover_url: formData.cover_url.trim() } : {}),
      ...(formData.isbn ? { isbn: formData.isbn.trim() } : {}),
    };

    onSubmit(submitData);
  };

  return (
    <Card className="shadow-card gradient-card border-0">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              {book ? 'Editar Livro' : 'Novo Livro'}
            </CardTitle>
            <CardDescription>
              {book ? 'Atualize as informações do livro' : 'Preencha os dados para cadastrar um novo livro'}
            </CardDescription>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onCancel}
            className="rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="title" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Título
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Ex.: Clean Code"
              className={errors.title ? 'border-destructive' : ''}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="authors" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Autor(es)
            </Label>
            <Input
              id="authors"
              value={formData.authors}
              onChange={(e) => handleInputChange('authors', e.target.value)}
              placeholder="Ex.: Robert C. Martin, Martin Fowler"
              className={errors.authors ? 'border-destructive' : ''}
            />
            {errors.authors && (
              <p className="text-sm text-destructive">{errors.authors}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Separe múltiplos autores por vírgula
            </p>
          </div>

          {/* Campos de capa/ISBN */}
          <div className="space-y-2">
            <Label htmlFor="cover_url">URL da capa (opcional)</Label>
            <Input
              id="cover_url"
              type="url"
              value={formData.cover_url ?? ''}
              onChange={(e) => handleInputChange('cover_url', e.target.value)}
              placeholder="https://exemplo.com/capa.jpg"
              className={errors.cover_url ? 'border-destructive' : ''}
            />
            {errors.cover_url && (
              <p className="text-sm text-destructive">{errors.cover_url}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Informe o ISBN abaixo para buscar capa automática.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="isbn">ISBN (opcional)</Label>
            <Input
              id="isbn"
              value={formData.isbn ?? ''}
              onChange={(e) => handleInputChange('isbn', e.target.value)}
              placeholder="9788535930310"
              className={errors.isbn ? 'border-destructive' : ''}
            />
            {errors.isbn && (
              <p className="text-sm text-destructive">{errors.isbn}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pages">Páginas</Label>
              <Input
                id="pages"
                type="number"
                value={formData.pages}
                onChange={(e) => handleInputChange('pages', e.target.value)}
                placeholder="0"
                min="1"
                className={errors.pages ? 'border-destructive' : ''}
              />
              {errors.pages && (
                <p className="text-sm text-destructive">{errors.pages}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="publish_year" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Ano
              </Label>
              <Input
                id="publish_year"
                type="number"
                value={formData.publish_year}
                onChange={(e) => handleInputChange('publish_year', e.target.value)}
                placeholder="2008"
                min="1000"
                max="2100"
                className={errors.publish_year ? 'border-destructive' : ''}
              />
              {errors.publish_year && (
                <p className="text-sm text-destructive">{errors.publish_year}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button type="submit" disabled={loading}>
              {book ? 'Salvar alterações' : 'Cadastrar livro'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
