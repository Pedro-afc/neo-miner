
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

  const detectTelegramEnvironment = () => {
    console.log('=== TELEGRAM DETECTION DEBUG ===');
    console.log('User Agent:', navigator.userAgent);
    console.log('Current URL:', window.location.href);
    console.log('URL Params:', window.location.search);
    console.log('Referrer:', document.referrer);
    console.log('Window.Telegram:', window.Telegram);
    console.log('Window.Telegram?.WebApp:', window.Telegram?.WebApp);

    // Method 1: Check for Telegram WebApp API (most reliable for WebApp)
    if (window.Telegram?.WebApp) {
      console.log('✓ Telegram WebApp API detected - confirmed WebApp environment');
      return { isTelegram: true, isWebApp: true };
    }

    // Method 2: Check URL parameters (common in Telegram web apps)
    const urlParams = new URLSearchParams(window.location.search);
    const hasTelegramParams = urlParams.has('tgWebAppData') || 
                            urlParams.has('tgWebAppVersion') ||
                            urlParams.has('tgWebAppPlatform') ||
                            window.location.search.includes('tgWebApp');
    
    if (hasTelegramParams) {
      console.log('✓ Telegram URL parameters detected - likely WebApp');
      return { isTelegram: true, isWebApp: true };
    }

    // Method 3: Check User Agent for Telegram browsers
    const userAgent = navigator.userAgent.toLowerCase();
    const isTelegramUserAgent = userAgent.includes('telegram') || 
                               userAgent.includes('tdesktop');
    
    if (isTelegramUserAgent) {
      console.log('✓ Telegram User Agent detected - in Telegram browser');
      return { isTelegram: true, isWebApp: false };
    }

    // Method 4: Check referrer for Telegram domains
    const referrer = document.referrer.toLowerCase();
    const isTelegramReferrer = referrer.includes('telegram') || 
                              referrer.includes('t.me') ||
                              referrer.includes('web.telegram');
    
    if (isTelegramReferrer) {
      console.log('✓ Telegram referrer detected - came from Telegram');
      return { isTelegram: true, isWebApp: false };
    }

    // Method 5: Check for embedded iframe context (Telegram WebApps run in iframes)
    try {
      if (window.self !== window.top) {
        console.log('✓ Running in iframe - possibly Telegram WebApp');
        return { isTelegram: true, isWebApp: true };
      }
    } catch (e) {
      console.log('✓ Cross-origin iframe detected - likely Telegram WebApp');
      return { isTelegram: true, isWebApp: true };
    }

    console.log('✗ No Telegram environment detected');
    return { isTelegram: false, isWebApp: false };
  };

  const waitForTelegramScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      let attempts = 0;
      const maxAttempts = 20; // Increased attempts
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
        
        // Check environment first
        const environment = detectTelegramEnvironment();
        
        if (!environment.isTelegram) {
          console.log('✗ Not running in Telegram environment - showing external browser message');
          setError('Esta aplicación debe ejecutarse dentro de Telegram');
          setIsLoading(false);
          return;
        }

        if (environment.isWebApp) {
          console.log('Detected WebApp environment, waiting for script...');
          // Wait for Telegram script to load
          const scriptLoaded = await waitForTelegramScript();
          
          if (window.Telegram?.WebApp) {
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
          } else if (!scriptLoaded) {
            console.log('✗ Telegram environment detected but script not loaded');
            setError('Error cargando la interfaz de Telegram');
            toast({
              description: "Error al cargar la interfaz de Telegram. Intenta recargar la página.",
              variant: "destructive",
            });
          }
        } else {
          // In Telegram browser but not WebApp - create demo user
          console.log('In Telegram browser but not WebApp, creating demo user...');
          const demoUser: TelegramUser = {
            id: Date.now(), // Simple demo ID
            first_name: 'Usuario Demo',
            username: 'demo_user'
          };
          await authenticateWithSupabase(demoUser);
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
      
      // Generate a unique email and password based on Telegram ID
      const email = `user${telegramUser.id}@telegram.app`;
      const password = `tg_${telegramUser.id}_${process.env.NODE_ENV || 'dev'}`;
      
      console.log('Attempting to sign in existing user...');
      let { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError && signInError.message.includes('Invalid login credentials')) {
        console.log('User does not exist, creating new user...');
        // If user doesn't exist, create a new account
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              telegram_id: telegramUser.id,
              first_name: telegramUser.first_name,
              last_name: telegramUser.last_name,
              username: telegramUser.username,
              photo_url: telegramUser.photo_url,
            }
          }
        });

        if (signUpError) {
          console.error('Sign up error:', signUpError);
          throw signUpError;
        }

        console.log('User created successfully:', signUpData.user?.id);
        signInData = signUpData;
      } else if (signInError) {
        console.error('Sign in error:', signInError);
        throw signInError;
      }

      if (signInData.user) {
        console.log('Successfully authenticated with Supabase:', signInData.user.id);
        
        // Update or create profile with Telegram data
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: signInData.user.id,
            telegram_id: telegramUser.id,
            username: telegramUser.username,
            first_name: telegramUser.first_name,
            last_name: telegramUser.last_name,
            photo_url: telegramUser.photo_url,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'id'
          });

        if (profileError) {
          console.error('Profile update error:', profileError);
          // Don't throw here as auth is successful, just log the error
        } else {
          console.log('Profile updated successfully');
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
