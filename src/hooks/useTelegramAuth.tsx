
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from '@/hooks/use-toast';

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
}

interface TelegramWebApp {
  initData: string;
  initDataUnsafe: {
    user?: TelegramUser;
    auth_date: number;
    hash: string;
  };
  ready(): void;
  close(): void;
  expand(): void;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}

export const useTelegramAuth = () => {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isInTelegramWebApp = () => {
    return window.Telegram?.WebApp !== undefined;
  };

  const isExternalBrowser = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    return !userAgent.includes('telegram') && !userAgent.includes('tdesktop');
  };

  const waitForTelegramScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      let attempts = 0;
      const maxAttempts = 20;
      const checkInterval = 100;

      const checkTelegram = () => {
        attempts++;
        console.log(`Checking for Telegram script... Attempt ${attempts}/${maxAttempts}`);
        
        if (window.Telegram?.WebApp) {
          console.log('✓ Telegram WebApp script loaded successfully');
          resolve(true);
          return;
        }

        if (attempts >= maxAttempts) {
          console.log('✗ Telegram WebApp script failed to load after maximum attempts');
          resolve(false);
          return;
        }

        setTimeout(checkTelegram, checkInterval);
      };

      checkTelegram();
    });
  };

  useEffect(() => {
    const initTelegram = async () => {
      try {
        console.log('Starting Telegram initialization...');
        
        // Check if running in external browser first
        if (isExternalBrowser()) {
          console.log('✗ Running in external browser - showing Telegram message');
          setError('Esta aplicación debe ejecutarse dentro de Telegram');
          setIsLoading(false);
          return;
        }

        // Check if running in Telegram WebApp
        if (isInTelegramWebApp()) {
          console.log('✓ Detected Telegram WebApp environment');
          
          // Wait for Telegram script to load
          const scriptLoaded = await waitForTelegramScript();
          
          if (scriptLoaded && window.Telegram?.WebApp) {
            console.log('Initializing Telegram WebApp...');
            const tg = window.Telegram.WebApp;
            tg.ready();
            tg.expand();
            
            console.log('Telegram WebApp data:', {
              initData: tg.initData,
              initDataUnsafe: tg.initDataUnsafe
            });
            
            const telegramUser = tg.initDataUnsafe.user;
            
            if (telegramUser) {
              console.log('✓ Telegram user detected:', telegramUser);
              await authenticateWithSupabase(telegramUser);
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
          description: "Error al inicializar la autenticación",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    initTelegram();
  }, []);

  const authenticateWithSupabase = async (telegramUser: TelegramUser) => {
    try {
      console.log('Starting Supabase authentication for user:', telegramUser.id);
      
      // Check if user already exists in profiles table
      const { data: existingProfile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('telegram_id', telegramUser.id)
        .maybeSingle();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Profile lookup error:', profileError);
        throw profileError;
      }

      let authUser;

      if (existingProfile) {
        console.log('Existing user found, signing in anonymously and linking profile...');
        // Sign in anonymously
        const { data: authData, error: authError } = await supabase.auth.signInAnonymously();
        
        if (authError) {
          console.error('Anonymous sign in error:', authError);
          throw authError;
        }
        
        authUser = authData.user;
      } else {
        console.log('New user, creating anonymous session...');
        // Create new anonymous user
        const { data: authData, error: authError } = await supabase.auth.signInAnonymously();
        
        if (authError) {
          console.error('Anonymous sign in error:', authError);
          throw authError;
        }
        
        authUser = authData.user;
      }

      if (authUser) {
        console.log('Successfully authenticated with Supabase:', authUser.id);
        
        // Create or update profile with Telegram data
        const { error: upsertError } = await supabase
          .from('profiles')
          .upsert({
            id: authUser.id,
            telegram_id: telegramUser.id,
            username: telegramUser.username,
            first_name: telegramUser.first_name,
            last_name: telegramUser.last_name,
            photo_url: telegramUser.photo_url,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'telegram_id'
          });

        if (upsertError) {
          console.error('Profile upsert error:', upsertError);
          // Don't throw here as auth is successful, just log the error
        } else {
          console.log('Profile created/updated successfully');
        }

        setUser(telegramUser);
        console.log('✓ Authentication complete - user set successfully');
        
        toast({
          description: `¡Bienvenido ${telegramUser.first_name}!`,
          variant: "default",
        });
      }
    } catch (err) {
      console.error('Supabase authentication error:', err);
      setError('Error al autenticar con Supabase');
      toast({
        description: "Error al conectar con el servidor de juego",
        variant: "destructive",
      });
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.close();
      }
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return {
    user,
    isLoading,
    error,
    logout,
    isAuthenticated: !!user
  };
};
