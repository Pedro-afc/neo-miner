
import { supabase } from "@/integrations/supabase/client";
import { toast } from '@/hooks/use-toast';
import type { TelegramUser } from '@/types/telegram';

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
    const { data: authData, error: authError } = await supabase.auth.signInAnonymously();
    
    if (authError) {
      console.error('Anonymous sign in error:', authError);
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
      
      toast({
        description: `¡Bienvenido ${telegramUser.first_name}!`,
        variant: "default",
      });
    }
  } catch (err) {
    console.error('Supabase authentication error:', err);
    throw new Error('Error al conectar con el servidor de juego');
  }
};

export const logoutFromSupabase = async (): Promise<void> => {
  try {
    await supabase.auth.signOut();
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.close();
    }
  } catch (err) {
    console.error('Logout error:', err);
  }
};
