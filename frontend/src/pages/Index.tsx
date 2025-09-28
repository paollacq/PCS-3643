import { useState, useEffect } from 'react';
import { LibraryManager } from '@/components/LibraryManager';
import { ApiInstructions } from '@/components/ApiInstructions';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Server, RefreshCw } from 'lucide-react';

const Index = () => {
  const [showInstructions, setShowInstructions] = useState(false);
  const [isCheckingApi, setIsCheckingApi] = useState(false);
  const [apiStatus, setApiStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');

  const checkApiConnection = async () => {
    setIsCheckingApi(true);
    try {
      const response = await fetch('http://localhost:8000/health');
      if (response.ok) {
        setApiStatus('connected');
        setShowInstructions(false);
      } else {
        throw new Error('API não respondeu');
      }
    } catch (error) {
      setApiStatus('disconnected');
      if (!showInstructions) {
        setShowInstructions(true);
      }
    } finally {
      setIsCheckingApi(false);
    }
  };

  // Check API connection on component mount
  useEffect(() => {
    checkApiConnection();
  }, []);

  if (showInstructions || apiStatus === 'disconnected') {
    return (
      <div className="min-h-screen bg-gradient-surface p-6">
        <div className="mb-6">
          <Card className="shadow-card border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Server className="h-4 w-4" />
                    <span className="font-medium">Status da API:</span>
                  </div>
                  {apiStatus === 'checking' ? (
                    <Badge variant="secondary">
                      <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                      Verificando...
                    </Badge>
                  ) : apiStatus === 'connected' ? (
                    <Badge className="bg-success/10 text-success border-success/20">
                      Conectado
                    </Badge>
                  ) : (
                    <Badge variant="destructive">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Desconectado
                    </Badge>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={checkApiConnection}
                    disabled={isCheckingApi}
                  >
                    <RefreshCw className={`h-3 w-3 mr-1 ${isCheckingApi ? 'animate-spin' : ''}`} />
                    Verificar
                  </Button>
                  {apiStatus === 'connected' && (
                    <Button
                      variant="hero"
                      size="sm"
                      onClick={() => setShowInstructions(false)}
                    >
                      Ir para o Sistema
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <ApiInstructions />
      </div>
    );
  }

  return <LibraryManager />;
};

export default Index;
