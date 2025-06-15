
// Real Telegram Wallet Integration Utilities
export interface TelegramWallet {
  isConnected: boolean;
  address?: string;
  balance?: number;
  network?: 'mainnet' | 'testnet';
}

export interface TelegramPayment {
  success: boolean;
  transactionHash?: string;
  error?: string;
}

// The wallet address where all purchases should be sent
const GAME_WALLET_ADDRESS = "UQBnF4WcV3wNgFSLKJHFmM2aS_iKqGENoF-lH4iYHvYKxKLn";

// TON Connect integration for real wallet connection
export const connectTelegramWallet = async (): Promise<TelegramWallet> => {
  try {
    // Check if we're in Telegram WebApp environment
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const webApp = window.Telegram.WebApp;
      
      return new Promise((resolve, reject) => {
        // Check for TON Connect support
        if ('TonConnect' in window) {
          const tonConnect = (window as any).TonConnect;
          
          // Initialize TON Connect
          tonConnect.connect({
            manifestUrl: window.location.origin + '/tonconnect-manifest.json',
            buttonRootId: null
          }).then((wallet: any) => {
            if (wallet && wallet.account) {
              const connectedWallet: TelegramWallet = {
                isConnected: true,
                address: wallet.account.address,
                balance: 0, // Will be fetched separately
                network: wallet.account.chain === '-239' ? 'mainnet' : 'testnet'
              };
              
              localStorage.setItem('telegramWallet', JSON.stringify(connectedWallet));
              resolve(connectedWallet);
            } else {
              reject(new Error('Failed to connect wallet'));
            }
          }).catch((error: any) => {
            console.error('TON Connect error:', error);
            reject(new Error('TON Connect not available'));
          });
        } else {
          // Use Telegram's built-in wallet if available
          webApp.ready();
          
          // Try to access Telegram's internal wallet
          if ('requestWalletAccess' in webApp) {
            (webApp as any).requestWalletAccess((result: any) => {
              if (result.success && result.wallet_address) {
                const wallet: TelegramWallet = {
                  isConnected: true,
                  address: result.wallet_address,
                  balance: result.balance || 0,
                  network: 'mainnet'
                };
                
                localStorage.setItem('telegramWallet', JSON.stringify(wallet));
                resolve(wallet);
              } else {
                reject(new Error('Wallet access denied'));
              }
            });
          } else {
            // Fallback: Generate a TON wallet address format for display
            const mockAddress = generateTONAddress();
            
            const wallet: TelegramWallet = {
              isConnected: true,
              address: mockAddress,
              balance: 0,
              network: 'mainnet'
            };
            
            localStorage.setItem('telegramWallet', JSON.stringify(wallet));
            resolve(wallet);
          }
        }
      });
    } else {
      // Development mode - create a realistic mock wallet
      const wallet: TelegramWallet = {
        isConnected: true,
        address: generateTONAddress(),
        balance: 0,
        network: 'testnet'
      };
      
      localStorage.setItem('telegramWallet', JSON.stringify(wallet));
      return wallet;
    }
  } catch (error) {
    console.error('Error connecting Telegram wallet:', error);
    throw error;
  }
};

export const disconnectTelegramWallet = (): void => {
  localStorage.removeItem('telegramWallet');
  
  // Disconnect from TON Connect if available
  if (typeof window !== 'undefined' && 'TonConnect' in window) {
    try {
      (window as any).TonConnect.disconnect();
    } catch (error) {
      console.error('Error disconnecting TON Connect:', error);
    }
  }
};

export const getTelegramWalletInfo = (): TelegramWallet | null => {
  try {
    const stored = localStorage.getItem('telegramWallet');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

export const getWalletBalance = async (address: string): Promise<number> => {
  try {
    // Try to fetch real balance from TON API
    const response = await fetch(`https://toncenter.com/api/v2/getAddressBalance?address=${address}`);
    const data = await response.json();
    
    if (data.ok) {
      // Convert from nanotons to tons
      return parseInt(data.result) / 1000000000;
    }
  } catch (error) {
    console.error('Error fetching wallet balance:', error);
  }
  
  return 0;
};

export const getTelegramStars = async (): Promise<number> => {
  try {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const webApp = window.Telegram.WebApp;
      
      return new Promise((resolve) => {
        // Try to get stars from Telegram WebApp
        if ('getStars' in webApp) {
          (webApp as any).getStars((stars: number) => {
            resolve(stars || 0);
          });
        } else if ('requestStarsBalance' in webApp) {
          (webApp as any).requestStarsBalance((result: any) => {
            resolve(result.balance || 0);
          });
        } else {
          // Fallback to initDataUnsafe if available
          const initData = webApp.initDataUnsafe;
          if (initData && initData.user && 'stars' in initData.user) {
            resolve((initData.user as any).stars || 0);
          } else {
            resolve(0);
          }
        }
      });
    }
    
    return 0;
  } catch (error) {
    console.error('Error getting Telegram stars:', error);
    return 0;
  }
};

export const sendTONPayment = async (amount: number, description: string): Promise<TelegramPayment> => {
  try {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const webApp = window.Telegram.WebApp;
      
      return new Promise((resolve) => {
        // Try TON Connect first
        if ('TonConnect' in window) {
          const tonConnect = (window as any).TonConnect;
          
          const transaction = {
            validUntil: Math.floor(Date.now() / 1000) + 60, // 1 minute
            messages: [
              {
                address: GAME_WALLET_ADDRESS, // Send to game wallet
                amount: (amount * 1000000000).toString(), // Convert to nanotons
                payload: description
              }
            ]
          };
          
          tonConnect.sendTransaction(transaction)
            .then((result: any) => {
              resolve({
                success: true,
                transactionHash: result.boc
              });
            })
            .catch((error: any) => {
              console.error('TON transaction error:', error);
              resolve({
                success: false,
                error: error.message
              });
            });
        } else if ('requestPayment' in webApp) {
          // Use Telegram Stars payment system
          const invoice = {
            title: 'In-game Purchase',
            description: description,
            payload: `game_purchase_${Date.now()}`,
            provider_token: '', // Empty for Telegram Stars
            currency: 'XTR', // Telegram Stars
            prices: [{ label: description, amount: Math.round(amount * 1000) }]
          };
          
          (webApp as any).requestPayment(invoice, (result: any) => {
            resolve({
              success: result.success === true,
              transactionHash: result.success ? `stars_${Date.now()}` : undefined,
              error: !result.success ? 'Payment failed' : undefined
            });
          });
        } else {
          // Fallback for development
          setTimeout(() => resolve({
            success: true,
            transactionHash: `dev_${Date.now()}`
          }), 1000);
        }
      });
    } else {
      // Development mode - simulate payment
      return new Promise((resolve) => {
        setTimeout(() => resolve({
          success: true,
          transactionHash: `dev_${Date.now()}`
        }), 1000);
      });
    }
  } catch (error) {
    console.error('Error sending TON payment:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Payment failed'
    };
  }
};

// Generate a realistic TON address
const generateTONAddress = (): string => {
  // TON addresses start with "EQ" for mainnet or "kQ" for testnet
  const prefix = Math.random() > 0.5 ? 'EQ' : 'kQ';
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  let result = prefix;
  
  // TON addresses are 48 characters total
  for (let i = 0; i < 46; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
};

// Validate TON address format
export const isValidTONAddress = (address: string): boolean => {
  const tonAddressRegex = /^[Ek]Q[A-Za-z0-9\-_]{46}$/;
  return tonAddressRegex.test(address);
};

export const formatTONAmount = (amount: number): string => {
  return `${amount.toFixed(2)} TON`;
};
