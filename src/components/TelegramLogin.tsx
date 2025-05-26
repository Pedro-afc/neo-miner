
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Zap } from 'lucide-react';

interface TelegramLoginProps {
  onLogin: () => void;
}

const TelegramLogin = ({ onLogin }: TelegramLoginProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-black/20 backdrop-blur-lg border-white/10">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-full flex items-center justify-center">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">
            Bienvenido al Juego
          </CardTitle>
          <p className="text-gray-300 mt-2">
            Inicia sesión con tu cuenta de Telegram para comenzar a jugar
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <Button
            onClick={onLogin}
            className="w-full bg-[#0088cc] hover:bg-[#0077bb] text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-5 h-5" />
            Continuar con Telegram
          </Button>
          
          <div className="text-center text-sm text-gray-400">
            <p>Al continuar, aceptas nuestros términos de servicio</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TelegramLogin;
