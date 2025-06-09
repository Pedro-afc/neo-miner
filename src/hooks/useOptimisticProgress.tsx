
import { useState, useCallback, useRef } from 'react';
import { UserProgress } from './useUserProgress';
import { toast } from '@/hooks/use-toast';

interface OptimisticUpdate {
  id: string;
  type: 'coins' | 'diamonds' | 'experience';
  amount: number;
  timestamp: number;
}

export const useOptimisticProgress = (
  progress: UserProgress | null,
  updateProgress: (updates: Partial<UserProgress>) => Promise<void>
) => {
  const [optimisticUpdates, setOptimisticUpdates] = useState<OptimisticUpdate[]>([]);
  const pendingUpdates = useRef<{ [key: string]: number }>({});
  const syncTimeout = useRef<NodeJS.Timeout>();

  // Debounced sync function
  const syncUpdates = useCallback(async () => {
    if (Object.keys(pendingUpdates.current).length === 0) return;

    try {
      const updates = { ...pendingUpdates.current };
      pendingUpdates.current = {};

      await updateProgress(updates);
      
      // Clear optimistic updates that have been synced
      setOptimisticUpdates(prev => prev.filter(update => 
        Date.now() - update.timestamp < 1000 // Keep recent updates for visual feedback
      ));
    } catch (error) {
      console.error('Failed to sync updates:', error);
      // Revert optimistic updates on error
      setOptimisticUpdates([]);
      toast({
        description: "Failed to save progress, please try again",
        variant: "destructive",
      });
    }
  }, [updateProgress]);

  // Optimistic update function
  const addOptimisticUpdate = useCallback((type: 'coins' | 'diamonds' | 'experience', amount: number) => {
    const updateId = Date.now().toString();
    
    // Add optimistic update for immediate UI feedback
    setOptimisticUpdates(prev => [...prev, {
      id: updateId,
      type,
      amount,
      timestamp: Date.now()
    }]);

    // Accumulate pending updates
    if (!pendingUpdates.current[type]) {
      pendingUpdates.current[type] = 0;
    }
    pendingUpdates.current[type] += amount;

    // Debounce sync
    if (syncTimeout.current) {
      clearTimeout(syncTimeout.current);
    }
    syncTimeout.current = setTimeout(syncUpdates, 300); // Sync after 300ms of inactivity

    // Clean up old optimistic updates
    setTimeout(() => {
      setOptimisticUpdates(prev => prev.filter(update => update.id !== updateId));
    }, 1000);
  }, [syncUpdates]);

  // Calculate optimistic values
  const getOptimisticValue = useCallback((type: 'coins' | 'diamonds' | 'experience') => {
    if (!progress) return 0;
    
    const baseValue = progress[type];
    const optimisticAmount = optimisticUpdates
      .filter(update => update.type === type)
      .reduce((sum, update) => sum + update.amount, 0);
    
    return baseValue + optimisticAmount;
  }, [progress, optimisticUpdates]);

  return {
    addOptimisticUpdate,
    getOptimisticValue,
    hasPendingUpdates: optimisticUpdates.length > 0
  };
};
