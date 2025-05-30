
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Zap } from 'lucide-react';

interface TelegramLoginProps {
  onLogin: () => void;
}

const TelegramLogin = ({ onLogin }: TelegramLoginProps) => {
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
            Sign in with your Telegram account to start playing
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4 md:space-y-6 px-4 md:px-6 lg:px-8 pb-6 md:pb-8">
          <Button
            onClick={onLogin}
            className="w-full bg-[#0088cc] hover:bg-[#0077bb] text-white font-medium py-3 md:py-4 text-sm md:text-base rounded-lg flex items-center justify-center gap-2 min-h-[44px]"
          >
            <MessageCircle className="w-4 h-4 md:w-5 md:h-5" />
            Continue with Telegram
          </Button>
          
          <div className="text-center text-xs md:text-sm text-gray-400">
            <p>By continuing, you accept our terms of service</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TelegramLogin;
