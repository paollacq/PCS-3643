import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Server, Terminal, Database, ExternalLink, Copy, CheckCircle } from 'lucide-react';
import { useState } from 'react';

// Quando a API dá erro nós caimos nessa página
// Deixar?

export const ApiInstructions = () => {
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  const copyToClipboard = async (text: string, item: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItem(item);
      setTimeout(() => setCopiedItem(null), 2000);
    } catch (err) {
      console.error('Erro ao copiar:', err);
    }
  };

  const CopyButton = ({ text, item }: { text: string; item: string }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => copyToClipboard(text, item)}
      className="h-8 w-8 p-0"
    >
      {copiedItem === item ? (
        <CheckCircle className="h-3 w-3 text-success" />
      ) : (
        <Copy className="h-3 w-3" />
      )}
    </Button>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Sistema de Biblioteca</h1>
        <p className="text-muted-foreground">
          API completa para gerenciamento de livros
        </p>
      </div>

      <Alert>
        <Server className="h-4 w-4" />
        <AlertDescription>
          <strong>API não conectada!</strong> Para usar o sistema, você precisa iniciar o backend FastAPI primeiro.
          Siga as instruções abaixo.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Terminal className="h-5 w-5" />
            Como rodar o Backend
          </CardTitle>
          <CardDescription>
            Siga estes passos para inicializar a API FastAPI
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-medium">1. Instale as dependências</span>
            </div>
            <div className="bg-muted/30 rounded-lg p-3 font-mono text-sm">
              <div className="flex items-center justify-between">
                <span>pip install -r requirements.txt</span>
                <CopyButton text="pip install -r requirements.txt" item="install" />
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-medium">2. Configure o Supabase</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Crie um arquivo <code>.env</code> na raiz do projeto backend:
            </p>
            <div className="bg-muted/30 rounded-lg p-3 font-mono text-sm">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span>SUPABASE_URL=sua_url_aqui</span>
                  <CopyButton text="SUPABASE_URL=sua_url_aqui" item="url" />
                </div>
                <div className="flex items-center justify-between">
                  <span>SUPABASE_SERVICE_KEY=sua_service_key_aqui</span>
                  <CopyButton text="SUPABASE_SERVICE_KEY=sua_service_key_aqui" item="key" />
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-medium">3. Execute o servidor</span>
            </div>
            <div className="bg-muted/30 rounded-lg p-3 font-mono text-sm">
              <div className="flex items-center justify-between">
                <span>uvicorn app.main:app --reload</span>
                <CopyButton text="uvicorn app.main:app --reload" item="server" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Endpoints da API
          </CardTitle>
          <CardDescription>
            URLs disponíveis no backend (http://localhost:8000)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="bg-success/10 text-success">POST</Badge>
                  <span className="font-mono text-sm">/books</span>
                  <span className="text-sm text-muted-foreground">- Criar livro</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="bg-primary/10 text-primary">GET</Badge>
                  <span className="font-mono text-sm">/books</span>
                  <span className="text-sm text-muted-foreground">- Listar livros</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="bg-primary/10 text-primary">GET</Badge>
                  <span className="font-mono text-sm">/books/{'{id}'}</span>
                  <span className="text-sm text-muted-foreground">- Buscar por ID</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="bg-accent/10 text-accent-foreground">PATCH</Badge>
                  <span className="font-mono text-sm">/books/{'{id}'}</span>
                  <span className="text-sm text-muted-foreground">- Atualizar livro</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="bg-destructive/10 text-destructive">DELETE</Badge>
                  <span className="font-mono text-sm">/books/{'{id}'}</span>
                  <span className="text-sm text-muted-foreground">- Remover livro</span>
                </div>
              </div>
            </div>

            <Separator />
            
            <div className="text-center">
              <Button variant="outline" asChild>
                <a 
                  href="http://localhost:8000/docs" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  Abrir Swagger UI
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Estrutura do Livro</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/30 rounded-lg p-4 font-mono text-sm">
            <pre className="whitespace-pre-wrap">{JSON.stringify({
              "title": "Nome do livro",
              "authors": ["Autor 1", "Autor 2"],
              "pages": 256,
              "publish_year": 2024
            }, null, 2)}</pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};