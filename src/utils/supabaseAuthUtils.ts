
import { supabase } from "@/integrations/supabase/client";
import { toast } from '@/hooks/use-toast';
import type { TelegramUser } from '@/types/telegram';

// Use sessionStorage instead of a global variable to persist across tab changes
const WELCOME_MESSAGE_KEY = 'telegram_welcome_shown';
const AUTH_CACHE_KEY = 'telegram_auth_cache';
const AUTH_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Exponential backoff retry function
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> => {
  let lastError: any;
  
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      
      // Check if it's a rate limit error
      if (error.message?.includes('rate limit') || error.status === 429) {
        if (i < maxRetries) {
          const delayTime = baseDelay * Math.pow(2, i); // Exponential backoff
          console.log(`Rate limited, retrying in ${delayTime}ms...`);
          await delay(delayTime);
          continue;
        }
      } else {
        // For non-rate-limit errors, throw immediately
        throw error;
      }
    }
  }
  
  throw lastError;
};

// Check if authentication is cached and still valid
const getCachedAuth = (telegramUser: TelegramUser): boolean => {
  try {
    const cached = sessionStorage.getItem(AUTH_CACHE_KEY);
    if (!cached) return false;
    
    const { userId, timestamp } = JSON.parse(cached);
    const isExpired = Date.now() - timestamp > AUTH_CACHE_DURATION;
    
    return !isExpired && userId === telegramUser.id;
  } catch {
    return false;
  }
};

// Cache successful authentication
const setCachedAuth = (telegramUser: TelegramUser): void => {
  try {
    sessionStorage.setItem(AUTH_CACHE_KEY, JSON.stringify({
      userId: telegramUser.id,
      timestamp: Date.now()
    }));
  } catch {
    // Ignore storage errors
  }
};

export const authenticateWithSupabase = async (telegramUser: TelegramUser): Promise<void> => {
  try {
    console.log('Starting Supabase authentication for user:', telegramUser.id);
    
    // Check if authentication is cached
    if (getCachedAuth(telegramUser)) {
      console.log('Using cached authentication');
      const hasShownWelcome = sessionStorage.getItem(WELCOME_MESSAGE_KEY);
      if (!hasShownWelcome) {
        toast({
          description: `Welcome back ${telegramUser.first_name}!`,
          variant: "default",
        });
        sessionStorage.setItem(WELCOME_MESSAGE_KEY, 'true');
      }
      return;
    }

    // Use retry logic for authentication
    await retryWithBackoff(async () => {
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

      console.log('Creating anonymous session...');
      // Create new anonymous user
      const { data: authData, error: authError } = await supabase.auth.signInAnonymously({
        options: {
          data: {
            telegram_id: telegramUser.id,
            telegram_username: telegramUser.username,
            telegram_first_name: telegramUser.first_name,
            telegram_last_name: telegramUser.last_name,
            telegram_photo_url: telegramUser.photo_url
          }
        }
      });
      
      if (authError) {
        console.error('Anonymous sign in error:', authError);
        
        // Handle specific error for disabled anonymous sign-ins
        if (authError.message?.includes('Anonymous sign-ins are disabled')) {
          throw new Error('Anonymous authentication is disabled. Please contact the administrator.');
        }
        
        throw authError;
      }
      
      const authUser = authData.user;

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

        console.log('✓ Authentication complete - user set successfully');
        
        // Cache successful authentication
        setCachedAuth(telegramUser);
        
        // Check sessionStorage to see if welcome message was already shown
        const hasShownWelcome = sessionStorage.getItem(WELCOME_MESSAGE_KEY);
        
        if (!hasShownWelcome) {
          toast({
            description: `Welcome ${telegramUser.first_name}!`,
            variant: "default",
          });
          sessionStorage.setItem(WELCOME_MESSAGE_KEY, 'true');
        }
      }
    }, 3, 2000); // 3 retries with 2 second base delay
  } catch (err) {
    console.error('Supabase authentication error:', err);
    const errorMessage = err instanceof Error ? err.message : 'Error connecting to game server';
    
    // Show user-friendly error message for rate limiting
    if (errorMessage.includes('rate limit')) {
      toast({
        description: "Server is busy, please wait a moment and try again",
        variant: "destructive",
      });
    }
    
    throw new Error(errorMessage);
  }
};

export const logoutFromSupabase = async (): Promise<void> => {
  try {
    // Clear all caches on logout
    sessionStorage.removeItem(WELCOME_MESSAGE_KEY);
    sessionStorage.removeItem(AUTH_CACHE_KEY);
    await supabase.auth.signOut();
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.close();
    }
  } catch (err) {
    console.error('Logout error:', err);
  }
};

// Reset welcome message flag when app starts (for new sessions)
export const resetWelcomeMessage = () => {
  // Don't clear sessionStorage here - let it persist across tab changes
  console.log('Welcome message system initialized');
};
