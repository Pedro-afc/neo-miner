
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useTelegramAuth } from './useTelegramAuth';
import { useUserProgress } from './useUserProgress';
import { calculateAutoClickIncrement } from '@/utils/gameUtils';
import { toast } from '@/hooks/use-toast';

interface UserCard {
  id: string;
  card_id: string;
  level: number;
  current_price: number;
  exp_bonus: number;
  cooldown_end: string | null;
}

export const useUserCards = () => {
  const { user } = useTelegramAuth();
  const { progress, updateAutoClickPower } = useUserProgress();
  const [cards, setCards] = useState<UserCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadUserCards();
    }
  }, [user]);

  const loadUserCards = async () => {
    if (!user) return;

    try {
      // Get the authenticated user's UUID
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return;

      const { data, error } = await supabase
        .from('user_cards')
        .select('*')
        .eq('user_id', authUser.id);

      if (error) throw error;

      setCards(data || []);
      
      // Calculate total auto-click power
      const totalAutoClick = (data || []).reduce((total, card) => {
        return total + calculateAutoClickIncrement(card.current_price);
      }, 0);
      
      await updateAutoClickPower(totalAutoClick);
    } catch (error) {
      console.error('Error loading user cards:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCard = (cardId: string) => {
    return cards.find(card => card.card_id === cardId);
  };

  const upgradeCard = async (cardId: string, newLevel: number, newPrice: number, newExpBonus: number) => {
    if (!user || !progress) return false;

    try {
      // Get the authenticated user's UUID
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return false;

      const existingCard = getCard(cardId);
      
      if (existingCard) {
        // Update existing card
        const { error } = await supabase
          .from('user_cards')
          .update({
            level: newLevel,
            current_price: newPrice,
            exp_bonus: newExpBonus,
            cooldown_end: new Date(Date.now() + 10000).toISOString() // 10 second cooldown
          })
          .eq('user_id', authUser.id)
          .eq('card_id', cardId);

        if (error) throw error;
      } else {
        // Create new card
        const { error } = await supabase
          .from('user_cards')
          .insert({
            user_id: authUser.id,
            card_id: cardId,
            level: newLevel,
            current_price: newPrice,
            exp_bonus: newExpBonus,
            cooldown_end: new Date(Date.now() + 10000).toISOString()
          });

        if (error) throw error;
      }

      // Reload cards and recalculate auto-click power
      await loadUserCards();
      
      toast({
        description: `Card upgraded to level ${newLevel}!`,
        variant: "default",
      });

      return true;
    } catch (error) {
      console.error('Error upgrading card:', error);
      toast({
        description: "Error upgrading card",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    cards,
    loading,
    getCard,
    upgradeCard,
    refreshCards: loadUserCards
  };
};
