
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Zap, ExternalLink } from 'lucide-react';

interface TelegramLoginProps {
  onLogin: () => void;
}

const TelegramLogin = ({ onLogin }: TelegramLoginProps) => {
  const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  
  const handleDevelopmentLogin = () => {
    // Add telegram=true parameter for development testing
    const url = new URL(window.location.href);
    url.searchParams.set('telegram', 'true');
    window.location.href = url.toString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4 md:p-6 lg:p-8">
      <Card className="w-full max-w-sm md:max-w-md lg:max-w-lg bg-black/20 backdrop-blur-lg border-white/10">
        <CardHeader className="text-center px-4 md:px-6 lg:px-8 pt-6 md:pt-8">
          <div className="mx-auto mb-4 md:mb-6 w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-full flex items-center justify-center">
            <Zap className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 text-white" />
          </div>
          <CardTitle className="text-xl md:text-2xl lg:text-3xl font-bold text-white">
            Welcome to the Game
          </CardTitle>
          <p className="text-gray-300 mt-2 md:mt-3 text-sm md:text-base">
            Esta aplicación debe ejecutarse dentro de Telegram como una WebApp
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4 md:space-y-6 px-4 md:px-6 lg:px-8 pb-6 md:pb-8">
          <div className="text-center space-y-4">
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
              <p className="text-yellow-200 text-sm">
                Para usar esta aplicación:
              </p>
              <ol className="text-yellow-100 text-xs mt-2 space-y-1 text-left">
                <li>1. Abre Telegram</li>
                <li>2. Busca el bot de tu juego</li>
                <li>3. Inicia la WebApp desde el bot</li>
              </ol>
            </div>
            
            {isDevelopment && (
              <div className="space-y-2">
                <p className="text-gray-400 text-xs">Modo desarrollo:</p>
                <Button
                  onClick={handleDevelopmentLogin}
                  variant="outline"
                  className="w-full bg-gray-800 hover:bg-gray-700 text-white border-gray-600"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Usar modo desarrollo
                </Button>
              </div>
            )}
            
            <Button
              onClick={onLogin}
              className="w-full bg-[#0088cc] hover:bg-[#0077bb] text-white font-medium py-3 md:py-4 text-sm md:text-base rounded-lg flex items-center justify-center gap-2 min-h-[44px]"
            >
              <MessageCircle className="w-4 h-4 md:w-5 md:h-5" />
              Recargar página
            </Button>
          </div>
          
          <div className="text-center text-xs md:text-sm text-gray-400">
            <p>Esta aplicación funciona solo dentro de Telegram</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TelegramLogin;
