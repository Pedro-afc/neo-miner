
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useTelegramAuth } from './useTelegramAuth';
import { useOptimisticProgress } from './useOptimisticProgress';
import { calculateExperienceRequired, calculateLevelFromExperience } from '@/utils/gameUtils';
import { getTelegramStars } from '@/utils/telegramWalletUtils';
import { toast } from '@/hooks/use-toast';

export interface UserProgress {
  id: string;
  user_id: string;
  coins: number;
  diamonds: number;
  telegram_stars: number;
  level: number;
  experience: number;
  experience_required: number;
  auto_click_power: number;
  last_daily_reward?: string;
  upgrade_rewards_claimed: number;
  created_at: string;
  updated_at: string;
}

// Cache for authentication state
let authCache: { user: any; timestamp: number } | null = null;
const AUTH_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useUserProgress = () => {
  const { user } = useTelegramAuth();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);

  const { addOptimisticUpdate, getOptimisticValue } = useOptimisticProgress(
    progress,
    updateProgressInDB
  );

  // Update progress in database with retry logic
  async function updateProgressInDB(updates: Partial<UserProgress>, retryCount = 0): Promise<void> {
    const maxRetries = 3;
    const baseDelay = 1000;

    try {
      // Use cached auth if available and recent
      let authUser;
      const now = Date.now();
      
      if (authCache && (now - authCache.timestamp) < AUTH_CACHE_DURATION) {
        authUser = authCache.user;
      } else {
        const { data: { user: freshUser }, error: authError } = await supabase.auth.getUser();
        if (authError) throw authError;
        
        authUser = freshUser;
        authCache = { user: authUser, timestamp: now };
      }

      if (!authUser) throw new Error('No authenticated user');

      const { error } = await supabase
        .from('user_progress')
        .update(updates)
        .eq('user_id', authUser.id);

      if (error) throw error;

      // Update local state
      setProgress(prev => prev ? { ...prev, ...updates } : null);
      
    } catch (error) {
      console.error('Error updating progress:', error);
      
      if (retryCount < maxRetries) {
        const delay = baseDelay * Math.pow(2, retryCount);
        console.log(`Retrying in ${delay}ms... (attempt ${retryCount + 1}/${maxRetries})`);
        
        setTimeout(() => {
          updateProgressInDB(updates, retryCount + 1);
        }, delay);
      } else {
        // Clear auth cache on persistent errors
        authCache = null;
        throw error;
      }
    }
  }

  const loadUserProgress = useCallback(async () => {
    if (!user) return;

    try {
      // Use cached auth if available
      let authUser;
      const now = Date.now();
      
      if (authCache && (now - authCache.timestamp) < AUTH_CACHE_DURATION) {
        authUser = authCache.user;
      } else {
        const { data: { user: freshUser } } = await supabase.auth.getUser();
        authUser = freshUser;
        if (authUser) {
          authCache = { user: authUser, timestamp: now };
        }
      }

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
        // Get real Telegram Stars and update if different
        const realStars = await getTelegramStars();
        
        let updatedData = { ...data };
        
        // Always use 1,000,000 as experience required
        updatedData.experience_required = 1000000;
        
        // Update level based on experience and new requirement
        const newLevel = calculateLevelFromExperience(data.experience);
        if (newLevel !== data.level) {
          updatedData.level = newLevel;
        }
        
        // Update Telegram Stars if different
        if (realStars !== data.telegram_stars) {
          updatedData.telegram_stars = realStars;
          
          // Update in database
          await supabase
            .from('user_progress')
            .update({ 
              telegram_stars: realStars,
              experience_required: 1000000,
              level: newLevel
            })
            .eq('user_id', authUser.id);
        } else if (newLevel !== data.level || data.experience_required !== 1000000) {
          // Update level and experience requirement
          await supabase
            .from('user_progress')
            .update({ 
              experience_required: 1000000,
              level: newLevel
            })
            .eq('user_id', authUser.id);
        }
        
        setProgress(updatedData);
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
  }, [user]);

  useEffect(() => {
    loadUserProgress();
  }, [loadUserProgress]);

  const addCoins = useCallback((amount: number) => {
    addOptimisticUpdate('coins', amount);
  }, [addOptimisticUpdate]);

  const addDiamonds = useCallback((amount: number) => {
    addOptimisticUpdate('diamonds', amount);
  }, [addOptimisticUpdate]);

  const addExperience = useCallback((amount: number) => {
    addOptimisticUpdate('experience', amount);
  }, [addOptimisticUpdate]);

  const updateAutoClickPower = useCallback(async (newPower: number) => {
    if (!progress) return;
    
    try {
      await updateProgressInDB({ auto_click_power: newPower });
    } catch (error) {
      console.error('Error updating auto-click power:', error);
    }
  }, [progress]);

  const optimisticProgress = progress ? {
    ...progress,
    coins: getOptimisticValue('coins'),
    diamonds: getOptimisticValue('diamonds'),
    experience: getOptimisticValue('experience'),
    experience_required: 1000000, // Always 1M
    level: calculateLevelFromExperience(getOptimisticValue('experience'))
  } : null;

  return {
    progress: optimisticProgress,
    loading,
    addCoins,
    addDiamonds,
    addExperience,
    updateAutoClickPower,
    refreshProgress: loadUserProgress
  };
};
