
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useTelegramAuth } from './useTelegramAuth';
import { toast } from '@/hooks/use-toast';

interface UserProgress {
  id: string;
  coins: number;
  diamonds: number;
  telegram_stars: number;
  level: number;
  experience: number;
  experience_required: number;
  auto_click_power: number;
  last_daily_reward: string | null;
  upgrade_rewards_claimed: number;
}

export const useUserProgress = () => {
  const { user } = useTelegramAuth();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadUserProgress();
      
      // Subscribe to real-time updates
      const channel = supabase
        .channel('user_progress_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'user_progress',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            if (payload.new) {
              setProgress(payload.new as UserProgress);
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  const loadUserProgress = async () => {
    if (!user) return;

    try {
      // Get the authenticated user's UUID
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return;

      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', authUser.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProgress(data);
      }
    } catch (error) {
      console.error('Error loading user progress:', error);
      toast({
        description: "Error loading progress",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async (updates: Partial<UserProgress>) => {
    if (!user || !progress) return;

    try {
      // Get the authenticated user's UUID
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return;

      const { error } = await supabase
        .from('user_progress')
        .update(updates)
        .eq('user_id', authUser.id);

      if (error) throw error;

      setProgress(prev => prev ? { ...prev, ...updates } : null);
    } catch (error) {
      console.error('Error updating progress:', error);
      toast({
        description: "Error saving progress",
        variant: "destructive",
      });
    }
  };

  const addCoins = async (amount: number) => {
    if (!progress) return;
    await updateProgress({ coins: progress.coins + amount });
  };

  const addDiamonds = async (amount: number) => {
    if (!progress) return;
    await updateProgress({ diamonds: progress.diamonds + amount });
  };

  const addExperience = async (amount: number) => {
    if (!progress) return;
    const newExperience = progress.experience + amount;
    let newLevel = progress.level;
    let newExpRequired = progress.experience_required;

    // Level up logic
    if (newExperience >= progress.experience_required) {
      newLevel++;
      newExpRequired = progress.experience_required * 2;
      
      toast({
        description: `Level up! You reached level ${newLevel}`,
        variant: "default",
      });
    }

    await updateProgress({
      experience: newExperience >= progress.experience_required ? 0 : newExperience,
      level: newLevel,
      experience_required: newExpRequired
    });
  };

  const updateAutoClickPower = async (power: number) => {
    await updateProgress({ auto_click_power: power });
  };

  return {
    progress,
    loading,
    updateProgress,
    addCoins,
    addDiamonds,
    addExperience,
    updateAutoClickPower,
    refreshProgress: loadUserProgress
  };
};
