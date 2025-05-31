import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Coins, Diamond, Zap, Star, Crown, Rocket, Gift, Axe, Flame, Shield, Target, Award, Sparkles, Gem, Globe, Clock, Wallet, Bot, Heart, TrendingUp } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { useTelegramAuth } from '@/hooks/useTelegramAuth';
import { loadGameData, saveGameData } from '@/utils/gameUtils';

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

const ShopTab = ({ gameState }: { gameState: GameState }) => {
  const { coins, setCoins, diamonds, setDiamonds, setExperience } = gameState;
  const [activeSection, setActiveSection] = useState<'coins' | 'diamonds' | 'ton' | 'stars'>('coins');
  const [tonWalletConnected, setTonWalletConnected] = useState(() => {
    return localStorage.getItem('tonWalletConnected') === 'true';
  });
  
  const { user } = useTelegramAuth();
  
  // Mock Telegram stars - in real implementation, this would come from Telegram API
  const [telegramStars, setTelegramStars] = useState(() => {
    return loadGameData('telegramStars', 50); // Start with 50 stars for demo
  });
  
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

    // TON Items - Exclusive and special
    {
      id: 'nft_robot_ton',
      name: 'Exclusive NFT Robot',
      description: 'Unique robot only available with TON',
      icon: Bot,
      price: 0.5,
      currency: 'ton',
      rarity: 'mythic',
      effect: 'Permanent NFT Robot'
    },
    {
      id: 'ton_multiplier',
      name: 'TON Multiplier',
      description: 'Multiplies all earnings by 10',
      icon: Zap,
      price: 1.0,
      currency: 'ton',
      rarity: 'mythic',
      effect: '+1000% All Gains x24h'
    },
    {
      id: 'cosmic_upgrade',
      name: 'Cosmic Upgrade',
      description: 'Upgrades all cards to maximum level',
      icon: Star,
      price: 1.5,
      currency: 'ton',
      rarity: 'mythic',
      effect: 'Max Level All Cards'
    },
    {
      id: 'infinity_token',
      name: 'Infinity Token',
      description: 'Unlimited resources for 1 hour',
      icon: Gem,
      price: 2.0,
      currency: 'ton',
      rarity: 'mythic',
      effect: 'Infinite Resources x1h'
    },
    {
      id: 'god_mode_ton',
      name: 'God Mode TON',
      description: 'Absolute supreme power',
      icon: Crown,
      price: 5.0,
      currency: 'ton',
      rarity: 'mythic',
      effect: 'God Mode x1 hour'
    },

    // Telegram Stars Items - Exclusive features (prices multiplied by 10)
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

  const connectTonWallet = async () => {
    try {
      // Simulate TON wallet connection with better detection
      if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
        // Check if we're in Telegram WebApp
        const webApp = (window as any).Telegram.WebApp;
        
        // Simulate TON Connect integration
        setTonWalletConnected(true);
        localStorage.setItem('tonWalletConnected', 'true');
        
        toast({
          description: "TON Wallet connected successfully!",
          variant: "default",
        });
        
        // Simulate wallet address (in real implementation, this would come from TON Connect)
        localStorage.setItem('tonWalletAddress', 'UQAbc123...def456');
        
      } else {
        // Fallback for testing outside Telegram
        setTonWalletConnected(true);
        localStorage.setItem('tonWalletConnected', 'true');
        toast({
          description: "Simulated TON Wallet connected (development mode)",
          variant: "default",
        });
      }
    } catch (error) {
      toast({
        description: "Error connecting TON Wallet",
        variant: "destructive",
      });
    }
  };

  const disconnectTonWallet = () => {
    setTonWalletConnected(false);
    localStorage.removeItem('tonWalletConnected');
    localStorage.removeItem('tonWalletAddress');
    toast({
      description: "TON Wallet disconnected",
      variant: "default",
    });
  };

  const buyItem = (item: ShopItem) => {
    if (item.currency === 'ton' && !tonWalletConnected) {
      toast({
        description: "You need to connect your TON Wallet first",
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
                     tonWalletConnected; // For TON, just check if wallet is connected

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

    if (item.currency === 'coins') {
      setCoins(prev => prev - item.price);
    } else if (item.currency === 'diamonds') {
      setDiamonds(prev => prev - item.price);
    } else if (item.currency === 'stars') {
      setTelegramStars(prev => prev - item.price);
      saveGameData('telegramStars', telegramStars - item.price);
    }
    // For TON items, we simulate the purchase

    // Apply specific effects based on item
    switch (item.id) {
      case 'auto_clicker':
        toast({
          description: "Auto Clicker activated for 1 hour!",
          variant: "default",
        });
        break;
      case 'coin_magnet':
        setCoins(prev => prev + 25000);
        toast({
          description: "Coin Magnet activated! +25,000 coins bonus",
          variant: "default",
        });
        break;
      case 'exp_multiplier':
        setExperience(prev => prev + 100000);
        toast({
          description: "EXP Multiplier activated! +100,000 EXP",
          variant: "default",
        });
        break;
      case 'robot_army':
        setCoins(prev => prev + 75000);
        toast({
          description: "Robotic Army activated! +75,000 coins bonus",
          variant: "default",
        });
        break;
      case 'golden_touch':
        setCoins(prev => prev + 150000);
        toast({
          description: "Golden Touch activated! +150,000 coins bonus",
          variant: "default",
        });
        break;
      case 'instant_upgrade':
        setCoins(prev => prev + 50000);
        toast({
          description: "Instant Upgrade available! +50,000 coins",
          variant: "default",
        });
        break;
      case 'premium_robot':
        setCoins(prev => prev + 200000);
        toast({
          description: "Premium Robot activated! +200,000 coins bonus",
          variant: "default",
        });
        break;
      case 'ultimate_package':
        setCoins(prev => prev + 500000);
        setDiamonds(prev => prev + 100);
        toast({
          description: "Supreme Package activated! +500K coins, +100 diamonds",
          variant: "default",
        });
        break;
      case 'level_boost':
        setExperience(prev => prev + 500000);
        toast({
          description: "Level Boost activated! +500,000 EXP",
          variant: "default",
        });
        break;
      case 'nft_robot_ton':
        setCoins(prev => prev + 1000000);
        setExperience(prev => prev + 1000000);
        toast({
          description: "Exclusive NFT Robot acquired! +1M Coins and +1M EXP",
          variant: "default",
        });
        break;
      case 'god_mode_ton':
        setCoins(prev => prev + 5000000);
        setDiamonds(prev => prev + 1000);
        setExperience(prev => prev + 5000000);
        toast({
          description: "GOD MODE ACTIVATED! +5M Coins, +1K Diamonds, +5M EXP",
          variant: "default",
        });
        break;
      // Star items effects
      case 'star_booster':
        toast({
          description: "Stellar Booster activated! No cooldowns for 30 minutes",
          variant: "default",
        });
        break;
      case 'stellar_multiplier':
        setCoins(prev => prev + 100000);
        toast({
          description: "Stellar Multiplier activated! +100K Coins bonus",
          variant: "default",
        });
        break;
      case 'cosmic_fortune':
        setCoins(prev => prev + 200000);
        setDiamonds(prev => prev + 50);
        toast({
          description: "Cosmic Fortune activated! +200K Coins, +50 Diamonds",
          variant: "default",
        });
        break;
      case 'cosmic_accelerator':
        setCoins(prev => prev + 300000);
        setTelegramStars(prev => prev + 20);
        saveGameData('telegramStars', telegramStars + 20);
        toast({
          description: "Cosmic Accelerator activated! +300K Coins, +20 Stars",
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
    <div className="space-y-4">
      {items.map((item) => {
        const Icon = item.icon;
        const canAfford = item.currency === 'coins' ? coins >= item.price : 
                         item.currency === 'diamonds' ? diamonds >= item.price :
                         item.currency === 'stars' ? telegramStars >= item.price :
                         tonWalletConnected;
        
        return (
          <Card key={item.id} className={`bg-gradient-to-r ${getRarityColor(item.rarity)} p-4 border-2 backdrop-blur-sm`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-white/20 backdrop-blur-sm">
                  <Icon className="w-6 h-6 text-white drop-shadow-lg" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-white text-lg drop-shadow-md">{item.name}</h3>
                    <Badge className={getRarityBadgeColor(item.rarity)}>
                      {item.rarity.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm text-white/90 mb-2 drop-shadow-sm">{item.description}</p>
                  <p className="text-sm text-green-300 font-bold drop-shadow-sm">{item.effect}</p>
                </div>
              </div>
              
              <div className="text-right flex flex-col items-end gap-3">
                <div className={`flex items-center gap-2 ${
                  item.currency === 'coins' ? 'text-yellow-300' : 
                  item.currency === 'diamonds' ? 'text-blue-300' :
                  item.currency === 'stars' ? 'text-yellow-300' :
                  'text-cyan-300'
                }`}>
                  {item.currency === 'coins' ? 
                    <Coins className="w-5 h-5 drop-shadow-lg" /> : 
                    item.currency === 'diamonds' ?
                    <Diamond className="w-5 h-5 drop-shadow-lg" /> :
                    item.currency === 'stars' ?
                    <span className="text-lg">⭐</span> :
                    <Wallet className="w-5 h-5 drop-shadow-lg" />
                  }
                  <span className="font-bold text-lg drop-shadow-md">
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
                  } font-bold px-4 py-2`}
                >
                  <ShoppingBag className="w-4 h-4 mr-2" />
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
    <div className="space-y-6 max-w-4xl mx-auto pb-20">
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent drop-shadow-lg">
          Shop
        </h2>
        <p className="text-white text-base mt-2 font-semibold drop-shadow-md">Enhance your gaming experience</p>
      </div>

      {/* Enhanced TON Wallet Connection */}
      <Card className={`${tonWalletConnected ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/30' : 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-cyan-500/30'} p-4 backdrop-blur-sm`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Wallet className={`w-8 h-8 ${tonWalletConnected ? 'text-green-400' : 'text-cyan-400'}`} />
            <div>
              <h3 className="text-lg font-bold text-white">
                {tonWalletConnected ? 'TON Wallet Connected' : 'Connect your TON Wallet'}
              </h3>
              <p className={`text-sm ${tonWalletConnected ? 'text-green-300' : 'text-cyan-300'}`}>
                {tonWalletConnected ? 'Full access to exclusive TON items' : 'Access exclusive items with TON'}
              </p>
            </div>
          </div>
          {tonWalletConnected ? (
            <Button
              onClick={disconnectTonWallet}
              variant="outline"
              className="border-red-500 text-red-400 hover:bg-red-500/20"
            >
              Disconnect
            </Button>
          ) : (
            <Button
              onClick={connectTonWallet}
              className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold"
            >
              Connect Wallet
            </Button>
          )}
        </div>
      </Card>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-900/80 p-1 rounded-xl backdrop-blur-sm border border-gray-600">
        <Button
          onClick={() => setActiveSection('coins')}
          variant="ghost"
          className={`flex-1 flex items-center justify-center gap-2 rounded-lg transition-all duration-200 ${
            activeSection === 'coins' 
              ? 'bg-gradient-to-r from-yellow-600 to-orange-600 text-white shadow-lg' 
              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
          }`}
        >
          <Coins className="w-5 h-5" />
          <span className="font-bold">COINS</span>
        </Button>
        <Button
          onClick={() => setActiveSection('diamonds')}
          variant="ghost"
          className={`flex-1 flex items-center justify-center gap-2 rounded-lg transition-all duration-200 ${
            activeSection === 'diamonds' 
              ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg' 
              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
          }`}
        >
          <Diamond className="w-5 h-5" />
          <span className="font-bold">DIAMONDS</span>
        </Button>
        <Button
          onClick={() => setActiveSection('stars')}
          variant="ghost"
          className={`flex-1 flex items-center justify-center gap-2 rounded-lg transition-all duration-200 ${
            activeSection === 'stars' 
              ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg' 
              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
          }`}
        >
          <span className="text-lg">⭐</span>
          <span className="font-bold">STARS</span>
        </Button>
        <Button
          onClick={() => setActiveSection('ton')}
          variant="ghost"
          className={`flex-1 flex items-center justify-center gap-2 rounded-lg transition-all duration-200 ${
            activeSection === 'ton' 
              ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-lg' 
              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
          }`}
        >
          <Wallet className="w-5 h-5" />
          <span className="font-bold">TON</span>
        </Button>
      </div>

      {/* Content based on active section */}
      <div className="mt-6">
        {activeSection === 'coins' && renderShopItems(coinsItems)}
        {activeSection === 'diamonds' && renderShopItems(diamondsItems)}
        {activeSection === 'stars' && renderShopItems(starsItems)}
        {activeSection === 'ton' && renderShopItems(tonItems)}
      </div>

      {/* Current Balance */}
      <Card className="bg-gray-900/80 backdrop-blur-sm border-2 border-gray-600 p-6">
        <h3 className="text-xl font-bold text-white mb-4 drop-shadow-md">Your Balance</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-yellow-500/20">
              <Coins className="w-6 h-6 text-yellow-400 drop-shadow-lg" />
            </div>
            <div>
              <p className="text-sm text-gray-300 font-medium">Coins</p>
              <p className="text-xl font-bold text-yellow-400 drop-shadow-md">{coins.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-blue-500/20">
              <Diamond className="w-6 h-6 text-blue-400 drop-shadow-lg" />
            </div>
            <div>
              <p className="text-sm text-gray-300 font-medium">Diamonds</p>
              <p className="text-xl font-bold text-blue-400 drop-shadow-md">{diamonds.toLocaleString()}</p>
            </div>
          </div>
          {user && (
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-yellow-500/20">
                <span className="text-2xl">⭐</span>
              </div>
              <div>
                <p className="text-sm text-gray-300 font-medium">Stars</p>
                <p className="text-xl font-bold text-yellow-400 drop-shadow-md">{telegramStars}</p>
              </div>
            </div>
          )}
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-cyan-500/20">
              <Wallet className="w-6 h-6 text-cyan-400 drop-shadow-lg" />
            </div>
            <div>
              <p className="text-sm text-gray-300 font-medium">TON Wallet</p>
              <p className="text-sm font-bold text-cyan-400 drop-shadow-md">
                {tonWalletConnected ? 'Connected ✓' : 'Not connected'}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ShopTab;
