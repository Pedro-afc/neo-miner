
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Coins, Diamond, Zap, Star, Crown, Rocket, Gift, Axe, Flame, Shield, Target, Award, Sparkles, Gem, Globe, Clock, Wallet, Bot, Heart, TrendingUp, Orbit, Satellite, Atom, Infinity } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { useTelegramAuth } from '@/hooks/useTelegramAuth';
import { useUserProgress } from '@/hooks/useUserProgress';
import { connectTelegramWallet, disconnectTelegramWallet, getTelegramWalletInfo, sendTONPayment, type TelegramWallet } from '@/utils/telegramWalletUtils';

interface GameState {
  coins: number;
  setCoins: (value: number | ((prev: number) => number)) => void;
  diamonds: number;
  setDiamonds: (value: number | ((prev: number) => number)) => void;
  level: number;
  experience: number;
  setExperience: (value: number | ((prev: number) => number)) => void;
  experienceRequired: number;
}

interface ShopItem {
  id: string;
  name: string;
  description: string;
  icon: any;
  price: number;
  currency: 'coins' | 'diamonds' | 'ton' | 'stars';
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';
  effect: string;
  purchased?: boolean;
}

const ShopTab = ({ gameState, telegramStars }: { gameState: GameState; telegramStars: number }) => {
  const { coins, setCoins, diamonds, setDiamonds, setExperience } = gameState;
  const [activeSection, setActiveSection] = useState<'coins' | 'diamonds' | 'ton' | 'stars'>('coins');
  const [telegramWallet, setTelegramWallet] = useState<TelegramWallet | null>(() => getTelegramWalletInfo());
  
  const { user } = useTelegramAuth();
  const { addDiamonds } = useUserProgress();
  
  const shopItems: ShopItem[] = [
    // Coins Items - Game-related rewards
    {
      id: 'auto_clicker',
      name: 'Auto Clicker Bot',
      description: 'Automatically clicks for 1 hour',
      icon: Bot,
      price: 5000,
      currency: 'coins',
      rarity: 'common',
      effect: 'Auto-click x1 hour'
    },
    {
      id: 'coin_magnet',
      name: 'Coin Magnet',
      description: 'Attracts coins automatically',
      icon: Coins,
      price: 8000,
      currency: 'coins',
      rarity: 'rare',
      effect: '+50% Coins per click'
    },
    {
      id: 'exp_multiplier',
      name: 'EXP Multiplier',
      description: 'Doubles experience gained for 30 minutes',
      icon: Star,
      price: 15000,
      currency: 'coins',
      rarity: 'rare',
      effect: '+100% EXP x30min'
    },
    {
      id: 'speed_boost',
      name: 'Time Accelerator',
      description: 'Reduces cooldown times by half',
      icon: Clock,
      price: 25000,
      currency: 'coins',
      rarity: 'epic',
      effect: '-50% Cooldowns x1 hour'
    },
    {
      id: 'lucky_charm',
      name: 'Lucky Charm',
      description: 'Increases probability of rewards',
      icon: Sparkles,
      price: 35000,
      currency: 'coins',
      rarity: 'epic',
      effect: '+25% Drop Rate x3 hours'
    },
    {
      id: 'robot_army',
      name: 'Robotic Army',
      description: 'All your robots gain extra rewards',
      icon: Target,
      price: 50000,
      currency: 'coins',
      rarity: 'legendary',
      effect: '+50% Robot Rewards x2 hours'
    },
    {
      id: 'golden_touch',
      name: 'Golden Touch',
      description: 'Converts clicks into pure gold',
      icon: Crown,
      price: 75000,
      currency: 'coins',
      rarity: 'legendary',
      effect: '+500% Coin Value x30min'
    },

    // Diamonds Items - Premium game effects
    {
      id: 'instant_upgrade',
      name: 'Instant Upgrade',
      description: 'Upgrade a card without cooldown or cost',
      icon: TrendingUp,
      price: 15,
      currency: 'diamonds',
      rarity: 'rare',
      effect: '1 Free Upgrade'
    },
    {
      id: 'diamond_rain',
      name: 'Diamond Rain',
      description: 'Receive diamonds every minute for 1 hour',
      icon: Diamond,
      price: 25,
      currency: 'diamonds',
      rarity: 'epic',
      effect: '+1 Diamond/min x1 hour'
    },
    {
      id: 'premium_robot',
      name: 'Premium Robot',
      description: 'Unlocks triple coin earnings temporarily',
      icon: Bot,
      price: 40,
      currency: 'diamonds',
      rarity: 'epic',
      effect: '+300% Coin Earnings x2 hours'
    },
    {
      id: 'time_skip',
      name: 'Time Skip',
      description: 'Instantly complete all cooldowns',
      icon: Clock,
      price: 50,
      currency: 'diamonds',
      rarity: 'legendary',
      effect: 'Reset All Cooldowns'
    },
    {
      id: 'level_boost',
      name: 'Level Boost',
      description: 'Gain experience equivalent to a full level',
      icon: Rocket,
      price: 75,
      currency: 'diamonds',
      rarity: 'legendary',
      effect: '+1 Complete Level'
    },
    {
      id: 'ultimate_package',
      name: 'Supreme Package',
      description: 'All boosts active for 1 hour',
      icon: Crown,
      price: 100,
      currency: 'diamonds',
      rarity: 'mythic',
      effect: 'All Boosts x1 hour'
    },

    // NEW COSMIC THEME TON ITEMS
    {
      id: 'galactic_outpost',
      name: 'Galactic Mining Outpost',
      description: 'Establish your first base in deep space for cosmic resource extraction',
      icon: Satellite,
      price: 0.5,
      currency: 'ton',
      rarity: 'mythic',
      effect: 'Permanent +1000% Mining Efficiency'
    },
    {
      id: 'stellar_command',
      name: 'Stellar Command Center',
      description: 'Command your intergalactic fleet from this advanced space station',
      icon: Orbit,
      price: 1.0,
      currency: 'ton',
      rarity: 'mythic',
      effect: 'Control Space Fleet +2000% All Gains x24h'
    },
    {
      id: 'alien_tech_core',
      name: 'Alien Technology Core',
      description: 'Harness ancient alien artifacts to unlock forbidden technologies',
      icon: Atom,
      price: 1.5,
      currency: 'ton',
      rarity: 'mythic',
      effect: 'Alien Tech Integration +5000% EXP x48h'
    },
    {
      id: 'cosmic_empire_crown',
      name: 'Cosmic Empire Crown',
      description: 'Rule over entire galaxies with this legendary crown of cosmic power',
      icon: Crown,
      price: 2.0,
      currency: 'ton',
      rarity: 'mythic',
      effect: 'Galactic Dominion +10000% All Resources x72h'
    },
    {
      id: 'universal_domination',
      name: 'Universal Domination Protocol',
      description: 'Achieve absolute control over the known universe and beyond',
      icon: Infinity,
      price: 5.0,
      currency: 'ton',
      rarity: 'mythic',
      effect: 'Universal Power - Infinite Resources x168h'
    },

    // Stars Items - Exclusive features
    {
      id: 'star_booster',
      name: 'Stellar Booster',
      description: 'Accelerates all cooldowns for 30 minutes',
      icon: Star,
      price: 50,
      currency: 'stars',
      rarity: 'epic',
      effect: 'No Cooldowns x30min'
    },
    {
      id: 'stellar_multiplier',
      name: 'Stellar Multiplier',
      description: 'Triples coin earnings for 1 hour',
      icon: Sparkles,
      price: 100,
      currency: 'stars',
      rarity: 'legendary',
      effect: '+300% Coins x1h'
    },
    {
      id: 'star_shield',
      name: 'Star Shield',
      description: 'Protects against losses for 2 hours',
      icon: Shield,
      price: 150,
      currency: 'stars',
      rarity: 'legendary',
      effect: 'Protection x2h'
    },
    {
      id: 'cosmic_fortune',
      name: 'Cosmic Fortune',
      description: 'Doubles all rewards for 1 hour',
      icon: Crown,
      price: 250,
      currency: 'stars',
      rarity: 'mythic',
      effect: '+100% All Rewards x1h'
    },
    {
      id: 'cosmic_accelerator',
      name: 'Cosmic Accelerator',
      description: 'Accelerates time flow for all processes',
      icon: Zap,
      price: 200,
      currency: 'stars',
      rarity: 'mythic',
      effect: '+500% Game Speed x1h'
    }
  ];

  // Diamond packages for TON purchase
  const diamondPackages = [
    {
      id: 'diamonds_10',
      name: '10 Diamonds',
      description: 'Perfect starter pack for beginners',
      amount: 10,
      price: 0.1,
      icon: Diamond,
      rarity: 'common' as const
    },
    {
      id: 'diamonds_50',
      name: '50 Diamonds',
      description: 'Popular choice for active players',
      amount: 50,
      price: 0.5,
      icon: Diamond,
      rarity: 'rare' as const
    },
    {
      id: 'diamonds_100',
      name: '100 Diamonds',
      description: 'Great value for serious gamers',
      amount: 100,
      price: 1.0,
      icon: Diamond,
      rarity: 'epic' as const
    },
    {
      id: 'diamonds_500',
      name: '500 Diamonds',
      description: 'Ultimate diamond package for champions',
      amount: 500,
      price: 5.0,
      icon: Diamond,
      rarity: 'legendary' as const
    }
  ];

  const connectWallet = async () => {
    try {
      const wallet = await connectTelegramWallet();
      setTelegramWallet(wallet);
      
      toast({
        description: "Telegram wallet connected successfully!",
        variant: "default",
      });
    } catch (error) {
      toast({
        description: "Error connecting Telegram wallet",
        variant: "destructive",
      });
    }
  };

  const disconnectWallet = () => {
    disconnectTelegramWallet();
    setTelegramWallet(null);
    toast({
      description: "Telegram wallet disconnected",
      variant: "default",
    });
  };

  const buyDiamonds = async (packageItem: typeof diamondPackages[0]) => {
    if (!telegramWallet?.isConnected) {
      toast({
        description: "You need to connect your Telegram wallet first",
        variant: "destructive",
      });
      return;
    }

    try {
      const success = await sendTONPayment(
        packageItem.price, 
        `Purchase of ${packageItem.amount} diamonds`
      );
      
      if (success) {
        await addDiamonds(packageItem.amount);
        
        toast({
          description: `Purchase successful! You received ${packageItem.amount} diamonds for ${packageItem.price} TON`,
          variant: "default",
        });
      } else {
        toast({
          description: "Payment error. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        description: "Error processing payment",
        variant: "destructive",
      });
    }
  };

  const buyItem = async (item: ShopItem) => {
    if (item.currency === 'ton' && !telegramWallet?.isConnected) {
      toast({
        description: "You need to connect your Telegram wallet first",
        variant: "destructive",
      });
      return;
    }

    if (item.currency === 'stars' && !user) {
      toast({
        description: "You need to be connected with Telegram to use stars",
        variant: "destructive",
      });
      return;
    }

    const canAfford = item.currency === 'coins' ? coins >= item.price : 
                     item.currency === 'diamonds' ? diamonds >= item.price :
                     item.currency === 'stars' ? telegramStars >= item.price :
                     telegramWallet?.isConnected;

    if (!canAfford) {
      const currencyName = item.currency === 'coins' ? 'coins' : 
                          item.currency === 'diamonds' ? 'diamonds' :
                          item.currency === 'stars' ? 'stars' : 'TON';
      toast({
        description: `You don't have enough ${currencyName} to buy this item.`,
        variant: "destructive",
      });
      return;
    }

    // Handle TON payments
    if (item.currency === 'ton') {
      try {
        const success = await sendTONPayment(item.price, `Purchase: ${item.name}`);
        if (!success) {
          toast({
            description: "Payment error. Please try again.",
            variant: "destructive",
          });
          return;
        }
      } catch (error) {
        toast({
          description: "Error processing payment",
          variant: "destructive",
        });
        return;
      }
    } else {
      // Handle regular currency deductions
      if (item.currency === 'coins') {
        setCoins(prev => prev - item.price);
      } else if (item.currency === 'diamonds') {
        setDiamonds(prev => prev - item.price);
      }
    }

    // Apply specific effects based on item
    switch (item.id) {
      case 'galactic_outpost':
        setCoins(prev => prev + 2000000);
        toast({
          description: "Galactic Outpost established! +2M Coins, +1000% Mining Efficiency",
          variant: "default",
        });
        break;
      case 'stellar_command':
        setCoins(prev => prev + 5000000);
        setExperience(prev => prev + 2000000);
        toast({
          description: "Stellar Command Center activated! +5M Coins, +2M EXP, Fleet Control Online",
          variant: "default",
        });
        break;
      case 'alien_tech_core':
        setExperience(prev => prev + 10000000);
        setCoins(prev => prev + 3000000);
        toast({
          description: "Alien Technology Core integrated! +10M EXP, +3M Coins, Ancient Power Unlocked",
          variant: "default",
        });
        break;
      case 'cosmic_empire_crown':
        setCoins(prev => prev + 20000000);
        setDiamonds(prev => prev + 5000);
        setExperience(prev => prev + 15000000);
        toast({
          description: "COSMIC EMPIRE CROWN CLAIMED! +20M Coins, +5K Diamonds, +15M EXP, Galactic Ruler!",
          variant: "default",
        });
        break;
      case 'universal_domination':
        setCoins(prev => prev + 100000000);
        setDiamonds(prev => prev + 25000);
        setExperience(prev => prev + 50000000);
        toast({
          description: "UNIVERSAL DOMINATION ACHIEVED! +100M Coins, +25K Diamonds, +50M EXP, UNIVERSE CONQUERED!",
          variant: "default",
        });
        break;
      default:
        setCoins(prev => prev + 20000);
        toast({
          description: `${item.name} acquired! +20,000 Coins bonus`,
          variant: "default",
        });
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'from-gray-800 to-gray-700 border-gray-500';
      case 'rare':
        return 'from-blue-800 to-blue-700 border-blue-400';
      case 'epic':
        return 'from-purple-800 to-purple-700 border-purple-400';
      case 'legendary':
        return 'from-yellow-800 to-orange-700 border-yellow-400';
      case 'mythic':
        return 'from-red-800 to-pink-700 border-red-400';
      default:
        return 'from-gray-800 to-gray-700 border-gray-500';
    }
  };

  const getRarityBadgeColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'bg-gray-600 text-white border-0';
      case 'rare':
        return 'bg-blue-600 text-white border-0';
      case 'epic':
        return 'bg-purple-600 text-white border-0';
      case 'legendary':
        return 'bg-yellow-600 text-white border-0';
      case 'mythic':
        return 'bg-red-600 text-white border-0';
      default:
        return 'bg-gray-600 text-white border-0';
    }
  };

  const coinsItems = shopItems.filter(item => item.currency === 'coins');
  const diamondsItems = shopItems.filter(item => item.currency === 'diamonds');
  const tonItems = shopItems.filter(item => item.currency === 'ton');
  const starsItems = shopItems.filter(item => item.currency === 'stars');

  const renderShopItems = (items: ShopItem[]) => (
    <div className="space-y-3 md:space-y-4">
      {items.map((item) => {
        const Icon = item.icon;
        const canAfford = item.currency === 'coins' ? coins >= item.price : 
                         item.currency === 'diamonds' ? diamonds >= item.price :
                         item.currency === 'stars' ? telegramStars >= item.price :
                         telegramWallet?.isConnected;
        
        return (
          <Card key={item.id} className={`bg-gradient-to-r ${getRarityColor(item.rarity)} p-3 md:p-4 border-2 backdrop-blur-sm`}>
            <div className="flex items-center justify-between gap-3 md:gap-4">
              <div className="flex items-center gap-3 md:gap-4 min-w-0 flex-1">
                <div className="p-2 md:p-3 rounded-lg bg-white/20 backdrop-blur-sm flex-shrink-0">
                  <Icon className="w-5 h-5 md:w-6 md:h-6 text-white drop-shadow-lg" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2 flex-wrap">
                    <h3 className="font-bold text-white text-sm md:text-base lg:text-lg drop-shadow-md">{item.name}</h3>
                    <Badge className={`${getRarityBadgeColor(item.rarity)} text-xs`}>
                      {item.rarity.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-xs md:text-sm text-white/90 mb-1 md:mb-2 drop-shadow-sm line-clamp-2">{item.description}</p>
                  <p className="text-xs md:text-sm text-green-300 font-bold drop-shadow-sm">{item.effect}</p>
                </div>
              </div>
              
              <div className="text-right flex flex-col items-end gap-2 md:gap-3 flex-shrink-0">
                <div className={`flex items-center gap-1 md:gap-2 ${
                  item.currency === 'coins' ? 'text-yellow-300' : 
                  item.currency === 'diamonds' ? 'text-blue-300' :
                  item.currency === 'stars' ? 'text-yellow-300' :
                  'text-cyan-300'
                }`}>
                  {item.currency === 'coins' ? 
                    <Coins className="w-4 h-4 md:w-5 md:h-5 drop-shadow-lg" /> : 
                    item.currency === 'diamonds' ?
                    <Diamond className="w-4 h-4 md:w-5 md:h-5 drop-shadow-lg" /> :
                    item.currency === 'stars' ?
                    <span className="text-base md:text-lg">⭐</span> :
                    <Wallet className="w-4 h-4 md:w-5 md:h-5 drop-shadow-lg" />
                  }
                  <span className="font-bold text-sm md:text-base lg:text-lg drop-shadow-md">
                    {item.currency === 'ton' ? `${item.price} TON` : 
                     item.currency === 'stars' ? `${item.price}` :
                     item.price.toLocaleString()}
                  </span>
                </div>
                
                <Button
                  onClick={() => buyItem(item)}
                  disabled={!canAfford}
                  size="sm"
                  className={`${
                    canAfford 
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 border-0 text-white' 
                      : 'bg-gray-700 cursor-not-allowed border-0 text-gray-400'
                  } font-bold px-3 md:px-4 py-1 md:py-2 text-xs md:text-sm`}
                >
                  <ShoppingBag className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                  BUY
                </Button>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );

  const renderDiamondPackages = () => (
    <div className="space-y-3 md:space-y-4">
      <div className="text-center mb-4 md:mb-6">
        <h3 className="text-xl md:text-2xl font-bold text-cyan-300 mb-2">💎 Diamond Packages</h3>
        <p className="text-sm md:text-base text-white">Buy diamonds with TON - Real Telegram prices</p>
      </div>
      
      {diamondPackages.map((pkg) => {
        const Icon = pkg.icon;
        
        return (
          <Card key={pkg.id} className={`bg-gradient-to-r ${getRarityColor(pkg.rarity)} p-3 md:p-4 border-2 backdrop-blur-sm`}>
            <div className="flex items-center justify-between gap-3 md:gap-4">
              <div className="flex items-center gap-3 md:gap-4 min-w-0 flex-1">
                <div className="p-2 md:p-3 rounded-lg bg-blue-500/30 backdrop-blur-sm flex-shrink-0">
                  <Icon className="w-6 h-6 md:w-8 md:h-8 text-blue-300 drop-shadow-lg" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2 flex-wrap">
                    <h3 className="font-bold text-white text-base md:text-xl drop-shadow-md">{pkg.name}</h3>
                    <Badge className={`${getRarityBadgeColor(pkg.rarity)} text-xs`}>
                      {pkg.rarity.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-xs md:text-sm text-white/90 mb-1 md:mb-2 drop-shadow-sm">{pkg.description}</p>
                  <p className="text-sm md:text-lg text-blue-300 font-bold drop-shadow-sm">+{pkg.amount} Diamonds</p>
                </div>
              </div>
              
              <div className="text-right flex flex-col items-end gap-2 md:gap-3 flex-shrink-0">
                <div className="flex items-center gap-1 md:gap-2 text-cyan-300">
                  <Wallet className="w-4 h-4 md:w-5 md:h-5 drop-shadow-lg" />
                  <span className="font-bold text-base md:text-xl drop-shadow-md">{pkg.price} TON</span>
                </div>
                
                <Button
                  onClick={() => buyDiamonds(pkg)}
                  disabled={!telegramWallet?.isConnected}
                  size="sm"
                  className={`${
                    telegramWallet?.isConnected
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 border-0 text-white' 
                      : 'bg-gray-700 cursor-not-allowed border-0 text-gray-400'
                  } font-bold px-4 md:px-6 py-1 md:py-2 text-xs md:text-sm`}
                >
                  <ShoppingBag className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                  BUY
                </Button>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-4 md:space-y-6 max-w-4xl mx-auto pb-16 md:pb-20 px-3 md:px-4">
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent drop-shadow-lg">
          Cosmic Shop
        </h2>
        <p className="text-sm md:text-base text-white mt-2 font-semibold drop-shadow-md">Upgrade your galactic empire</p>
      </div>

      {/* Enhanced Telegram Wallet Connection - Responsive */}
      <Card className={`${telegramWallet?.isConnected ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/30' : 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-cyan-500/30'} p-3 md:p-4 backdrop-blur-sm`}>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
            <Wallet className={`w-6 h-6 md:w-8 md:h-8 ${telegramWallet?.isConnected ? 'text-green-400' : 'text-cyan-400'} flex-shrink-0`} />
            <div className="min-w-0 flex-1">
              <h3 className="text-sm md:text-lg font-bold text-white">
                {telegramWallet?.isConnected ? 'Telegram Wallet Connected' : 'Connect your Telegram Wallet'}
              </h3>
              <p className={`text-xs md:text-sm ${telegramWallet?.isConnected ? 'text-green-300' : 'text-cyan-300'}`}>
                {telegramWallet?.isConnected ? 
                  `Address: ${telegramWallet.address?.slice(0, 8)}...${telegramWallet.address?.slice(-6)} - Full access to cosmic items` : 
                  'Access exclusive items and buy diamonds with TON'}
              </p>
            </div>
          </div>
          {telegramWallet?.isConnected ? (
            <Button
              onClick={disconnectWallet}
              variant="outline"
              size="sm"
              className="border-red-500 text-red-400 hover:bg-red-500/20 text-xs md:text-sm flex-shrink-0"
            >
              Disconnect
            </Button>
          ) : (
            <Button
              onClick={connectWallet}
              size="sm"
              className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs md:text-sm flex-shrink-0"
            >
              Connect Wallet
            </Button>
          )}
        </div>
      </Card>

      {/* Navigation Tabs - Responsive */}
      <div className="flex space-x-1 bg-gray-900/80 p-1 rounded-xl backdrop-blur-sm border border-gray-600 overflow-x-auto">
        <Button
          onClick={() => setActiveSection('coins')}
          variant="ghost"
          className={`flex-1 flex items-center justify-center gap-1 md:gap-2 rounded-lg transition-all duration-200 text-xs md:text-sm whitespace-nowrap ${
            activeSection === 'coins' 
              ? 'bg-gradient-to-r from-yellow-600 to-orange-600 text-white shadow-lg' 
              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
          }`}
        >
          <Coins className="w-4 h-4 md:w-5 md:h-5" />
          <span className="font-bold">COINS</span>
        </Button>
        <Button
          onClick={() => setActiveSection('diamonds')}
          variant="ghost"
          className={`flex-1 flex items-center justify-center gap-1 md:gap-2 rounded-lg transition-all duration-200 text-xs md:text-sm whitespace-nowrap ${
            activeSection === 'diamonds' 
              ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg' 
              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
          }`}
        >
          <Diamond className="w-4 h-4 md:w-5 md:h-5" />
          <span className="font-bold">DIAMONDS</span>
        </Button>
        <Button
          onClick={() => setActiveSection('stars')}
          variant="ghost"
          className={`flex-1 flex items-center justify-center gap-1 md:gap-2 rounded-lg transition-all duration-200 text-xs md:text-sm whitespace-nowrap ${
            activeSection === 'stars' 
              ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg' 
              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
          }`}
        >
          <span className="text-base md:text-lg">⭐</span>
          <span className="font-bold">STARS</span>
        </Button>
        <Button
          onClick={() => setActiveSection('ton')}
          variant="ghost"
          className={`flex-1 flex items-center justify-center gap-1 md:gap-2 rounded-lg transition-all duration-200 text-xs md:text-sm whitespace-nowrap ${
            activeSection === 'ton' 
              ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-lg' 
              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
          }`}
        >
          <Wallet className="w-4 h-4 md:w-5 md:h-5" />
          <span className="font-bold">TON</span>
        </Button>
      </div>

      {/* Content based on active section */}
      <div className="mt-4 md:mt-6">
        {activeSection === 'coins' && renderShopItems(coinsItems)}
        {activeSection === 'diamonds' && renderShopItems(diamondsItems)}
        {activeSection === 'stars' && renderShopItems(starsItems)}
        {activeSection === 'ton' && (
          <div className="space-y-6 md:space-y-8">
            {renderDiamondPackages()}
            <div className="border-t border-gray-600 pt-4 md:pt-6">
              <div className="text-center mb-4 md:mb-6">
                <h3 className="text-xl md:text-2xl font-bold text-purple-300 mb-2">🌌 Cosmic Empire Collection</h3>
                <p className="text-sm md:text-base text-white">Supreme cosmic power items for galactic domination</p>
              </div>
              {renderShopItems(tonItems)}
            </div>
          </div>
        )}
      </div>

      {/* Current Balance - Responsive */}
      <Card className="bg-gray-900/80 backdrop-blur-sm border-2 border-gray-600 p-4 md:p-6">
        <h3 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4 drop-shadow-md">Your Balance</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="p-2 md:p-3 rounded-lg bg-yellow-500/20 flex-shrink-0">
              <Coins className="w-5 h-5 md:w-6 md:h-6 text-yellow-400 drop-shadow-lg" />
            </div>
            <div className="min-w-0">
              <p className="text-xs md:text-sm text-gray-300 font-medium">Coins</p>
              <p className="text-sm md:text-xl font-bold text-yellow-400 drop-shadow-md truncate">{coins.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <div className="p-2 md:p-3 rounded-lg bg-blue-500/20 flex-shrink-0">
              <Diamond className="w-5 h-5 md:w-6 md:h-6 text-blue-400 drop-shadow-lg" />
            </div>
            <div className="min-w-0">
              <p className="text-xs md:text-sm text-gray-300 font-medium">Diamonds</p>
              <p className="text-sm md:text-xl font-bold text-blue-400 drop-shadow-md truncate">{diamonds.toLocaleString()}</p>
            </div>
          </div>
          {user && (
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-2 md:p-3 rounded-lg bg-yellow-500/20 flex-shrink-0">
                <span className="text-lg md:text-2xl">⭐</span>
              </div>
              <div className="min-w-0">
                <p className="text-xs md:text-sm text-gray-300 font-medium">Stars</p>
                <p className="text-sm md:text-xl font-bold text-yellow-400 drop-shadow-md truncate">{telegramStars}</p>
              </div>
            </div>
          )}
          <div className="flex items-center gap-2 md:gap-3">
            <div className="p-2 md:p-3 rounded-lg bg-cyan-500/20 flex-shrink-0">
              <Wallet className="w-5 h-5 md:w-6 md:h-6 text-cyan-400 drop-shadow-lg" />
            </div>
            <div className="min-w-0">
              <p className="text-xs md:text-sm text-gray-300 font-medium">TON Wallet</p>
              <p className="text-xs md:text-sm font-bold text-cyan-400 drop-shadow-md">
                {telegramWallet?.isConnected ? 'Connected ✓' : 'Not connected'}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ShopTab;
