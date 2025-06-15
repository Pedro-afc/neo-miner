
import { useState, useEffect } from 'react';
import { getTelegramStars } from '@/utils/telegramWalletUtils';

export const useTelegramStars = () => {
  const [stars, setStars] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStars = async () => {
      try {
        const telegramStars = await getTelegramStars();
        setStars(telegramStars);
      } catch (error) {
        console.error('Error fetching Telegram stars:', error);
        setStars(0);
      } finally {
        setLoading(false);
      }
    };

    fetchStars();

    // Refresh stars every 30 seconds
    const interval = setInterval(fetchStars, 30000);

    return () => clearInterval(interval);
  }, []);

  const refreshStars = async () => {
    setLoading(true);
    try {
      const telegramStars = await getTelegramStars();
      setStars(telegramStars);
    } catch (error) {
      console.error('Error refreshing Telegram stars:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    stars,
    loading,
    refreshStars
  };
};
