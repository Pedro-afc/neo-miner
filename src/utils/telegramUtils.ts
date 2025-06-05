
export const isInTelegramWebApp = (): boolean => {
  return window.Telegram?.WebApp !== undefined;
};

export const isExternalBrowser = (): boolean => {
  const userAgent = navigator.userAgent.toLowerCase();
  return !userAgent.includes('telegram') && !userAgent.includes('tdesktop');
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
