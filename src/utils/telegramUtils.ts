
export const isInTelegramWebApp = (): boolean => {
  return window.Telegram?.WebApp !== undefined;
};

export const isExternalBrowser = (): boolean => {
  // For development/testing purposes, allow bypassing Telegram check
  const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  
  if (isDevelopment) {
    // Check if we have a development override
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('telegram') === 'true') {
      return false; // Simulate being in Telegram
    }
  }

  const userAgent = navigator.userAgent.toLowerCase();
  return !userAgent.includes('telegram') && !userAgent.includes('tdesktop') && !isInTelegramWebApp();
};

export const waitForTelegramScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    let attempts = 0;
    const maxAttempts = 20;
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

export const initializeTelegramWebApp = async (): Promise<boolean> => {
  const scriptLoaded = await waitForTelegramScript();
  
  if (scriptLoaded && window.Telegram?.WebApp) {
    console.log('Initializing Telegram WebApp...');
    const tg = window.Telegram.WebApp;
    tg.ready();
    tg.expand();
    
    console.log('Telegram WebApp data:', {
      initData: tg.initData,
      initDataUnsafe: tg.initDataUnsafe
    });
    
    return true;
  }
  
  return false;
};

// Helper function to create mock Telegram user for development
export const createMockTelegramUser = () => {
  return {
    id: 123456789,
    first_name: "Test",
    last_name: "User",
    username: "testuser",
    photo_url: undefined
  };
};
