
import { supabase } from "@/integrations/supabase/client";
import { toast } from '@/hooks/use-toast';
import type { TelegramUser } from '@/types/telegram';

// Flag para controlar si ya se mostró el mensaje de bienvenida
let hasShownWelcomeMessage = false;

export const authenticateWithSupabase = async (telegramUser: TelegramUser): Promise<void> => {
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
        throw new Error('La autenticación anónima está deshabilitada. Por favor, contacta al administrador.');
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
      
      // Solo mostrar el toast de bienvenida una vez por sesión
      if (!hasShownWelcomeMessage) {
        toast({
          description: `¡Bienvenido ${telegramUser.first_name}!`,
          variant: "default",
        });
        hasShownWelcomeMessage = true;
      }
    }
  } catch (err) {
    console.error('Supabase authentication error:', err);
    const errorMessage = err instanceof Error ? err.message : 'Error al conectar con el servidor de juego';
    throw new Error(errorMessage);
  }
};

export const logoutFromSupabase = async (): Promise<void> => {
  try {
    // Reset welcome message flag on logout
    hasShownWelcomeMessage = false;
    await supabase.auth.signOut();
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.close();
    }
  } catch (err) {
    console.error('Logout error:', err);
  }
};

// Reset welcome message flag when app starts
export const resetWelcomeMessage = () => {
  hasShownWelcomeMessage = false;
};
