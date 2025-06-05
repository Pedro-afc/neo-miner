
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import type { TelegramUser } from '@/types/telegram';
import { 
  isInTelegramWebApp, 
  isExternalBrowser, 
  initializeTelegramWebApp,
  createMockTelegramUser
} from '@/utils/telegramUtils';
import { 
  authenticateWithSupabase, 
  logoutFromSupabase,
  resetWelcomeMessage
} from '@/utils/supabaseAuthUtils';

export const useTelegramAuth = () => {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Reset welcome message when component mounts
    resetWelcomeMessage();
    
    const initTelegram = async () => {
      try {
        console.log('Starting Telegram initialization...');
        
        // Check if running in external browser first
        if (isExternalBrowser()) {
          console.log('✗ Running in external browser');
          
          // For development, allow using mock user
          const urlParams = new URLSearchParams(window.location.search);
          if (urlParams.get('telegram') === 'true') {
            console.log('✓ Development mode - using mock Telegram user');
            const mockUser = createMockTelegramUser();
            await authenticateWithSupabase(mockUser);
            setUser(mockUser);
            setIsLoading(false);
            return;
          }
          
          setError('Esta aplicación debe ejecutarse dentro de Telegram');
          setIsLoading(false);
          return;
        }

        // Check if running in Telegram WebApp
        if (isInTelegramWebApp()) {
          console.log('✓ Detected Telegram WebApp environment');
          
          const initialized = await initializeTelegramWebApp();
          
          if (initialized && window.Telegram?.WebApp) {
            const telegramUser = window.Telegram.WebApp.initDataUnsafe.user;
            
            if (telegramUser) {
              console.log('✓ Telegram user detected:', telegramUser);
              await authenticateWithSupabase(telegramUser);
              setUser(telegramUser);
            } else {
              console.log('✗ No Telegram user found in WebApp data');
              setError('No se pudo obtener información del usuario de Telegram');
              toast({
                description: "No se pudo obtener datos de usuario desde Telegram",
                variant: "destructive",
              });
            }
          } else {
            console.log('✗ Telegram WebApp script failed to load');
            setError('Error cargando la interfaz de Telegram');
            toast({
              description: "Error al cargar la interfaz de Telegram. Intenta recargar la página.",
              variant: "destructive",
            });
          }
        } else {
          console.log('✗ Running in Telegram browser but not as WebApp');
          setError('Por favor, abre esta aplicación como una WebApp de Telegram');
          toast({
            description: "Esta aplicación debe ejecutarse como WebApp de Telegram",
            variant: "destructive",
          });
        }
      } catch (err) {
        console.error('Error initializing Telegram auth:', err);
        setError('Error de autenticación');
        toast({
          description: err instanceof Error ? err.message : "Error al inicializar la autenticación",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    initTelegram();
  }, []);

  const logout = async () => {
    await logoutFromSupabase();
    setUser(null);
  };

  return {
    user,
    isLoading,
    error,
    logout,
    isAuthenticated: !!user
  };
};
