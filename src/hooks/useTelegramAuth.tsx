
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

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

  useEffect(() => {
    const initTelegram = async () => {
      try {
        // Check if running in Telegram Web App
        if (window.Telegram?.WebApp) {
          const tg = window.Telegram.WebApp;
          tg.ready();
          tg.expand();
          
          const telegramUser = tg.initDataUnsafe.user;
          
          if (telegramUser) {
            // Save user to Supabase
            const { data, error } = await supabase
              .from('profiles')
              .upsert({
                telegram_id: telegramUser.id,
                username: telegramUser.username,
                first_name: telegramUser.first_name,
                last_name: telegramUser.last_name,
                photo_url: telegramUser.photo_url,
                updated_at: new Date().toISOString()
              }, {
                onConflict: 'telegram_id'
              })
              .select()
              .single();

            if (error) {
              console.error('Error saving user:', error);
              setError('Error al guardar usuario');
            } else {
              setUser(telegramUser);
            }
          } else {
            // If no Telegram user, try to get from localStorage for development
            const savedUser = localStorage.getItem('telegram_user');
            if (savedUser) {
              setUser(JSON.parse(savedUser));
            }
          }
        } else {
          // Development mode - create a mock user
          const mockUser: TelegramUser = {
            id: 123456789,
            first_name: 'Demo',
            last_name: 'User',
            username: 'demouser'
          };
          
          // Save mock user to localStorage and database
          localStorage.setItem('telegram_user', JSON.stringify(mockUser));
          
          const { error } = await supabase
            .from('profiles')
            .upsert({
              telegram_id: mockUser.id,
              username: mockUser.username,
              first_name: mockUser.first_name,
              last_name: mockUser.last_name,
              updated_at: new Date().toISOString()
            }, {
              onConflict: 'telegram_id'
            });

          if (error) {
            console.error('Error saving mock user:', error);
          }
          
          setUser(mockUser);
        }
      } catch (err) {
        console.error('Error initializing Telegram auth:', err);
        setError('Error de autenticación');
      } finally {
        setIsLoading(false);
      }
    };

    initTelegram();
  }, []);

  const logout = () => {
    setUser(null);
    localStorage.removeItem('telegram_user');
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.close();
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
