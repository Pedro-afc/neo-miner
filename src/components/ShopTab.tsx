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
      description: 'Clicks automáticamente por 1 hora',
      icon: Bot,
      price: 5000,
      currency: 'coins',
      rarity: 'common',
      effect: 'Auto-click x1 hora'
    },
    {
      id: 'coin_magnet',
      name: 'Imán de Monedas',
      description: 'Atrae monedas automáticamente',
      icon: Coins,
      price: 8000,
      currency: 'coins',
      rarity: 'rare',
      effect: '+50% Monedas por click'
    },
    {
      id: 'exp_multiplier',
      name: 'Multiplicador EXP',
      description: 'Dobla la experiencia ganada por 2 horas',
      icon: Star,
      price: 15000,
      currency: 'coins',
      rarity: 'rare',
      effect: '+100% EXP x2 horas'
    },
    {
      id: 'speed_boost',
      name: 'Acelerador Temporal',
      description: 'Reduce tiempos de cooldown a la mitad',
      icon: Clock,
      price: 25000,
      currency: 'coins',
      rarity: 'epic',
      effect: '-50% Cooldowns x1 hora'
    },
    {
      id: 'lucky_charm',
      name: 'Amuleto de la Suerte',
      description: 'Aumenta la probabilidad de recompensas',
      icon: Sparkles,
      price: 35000,
      currency: 'coins',
      rarity: 'epic',
      effect: '+25% Drop Rate x3 horas'
    },
    {
      id: 'robot_army',
      name: 'Ejército Robótico',
      description: 'Todos tus robots ganan EXP extra',
      icon: Target,
      price: 50000,
      currency: 'coins',
      rarity: 'legendary',
      effect: '+200% Robot EXP x2 horas'
    },
    {
      id: 'golden_touch',
      name: 'Toque Dorado',
      description: 'Convierte clicks en oro puro',
      icon: Crown,
      price: 75000,
      currency: 'coins',
      rarity: 'legendary',
      effect: '+500% Coin Value x1 hora'
    },

    // Diamonds Items - Premium game effects
    {
      id: 'instant_upgrade',
      name: 'Mejora Instantánea',
      description: 'Mejora una carta sin cooldown ni costo',
      icon: TrendingUp,
      price: 15,
      currency: 'diamonds',
      rarity: 'rare',
      effect: '1 Mejora Gratis'
    },
    {
      id: 'diamond_rain',
      name: 'Lluvia de Diamantes',
      description: 'Recibe diamantes cada minuto por 1 hora',
      icon: Diamond,
      price: 25,
      currency: 'diamonds',
      rarity: 'epic',
      effect: '+1 Diamante/min x1 hora'
    },
    {
      id: 'premium_robot',
      name: 'Robot Premium',
      description: 'Desbloquea un robot exclusivo temporalmente',
      icon: Bot,
      price: 40,
      currency: 'diamonds',
      rarity: 'epic',
      effect: 'Robot Temporal +1000% EXP'
    },
    {
      id: 'time_skip',
      name: 'Salto Temporal',
      description: 'Completa instantáneamente todos los cooldowns',
      icon: Clock,
      price: 50,
      currency: 'diamonds',
      rarity: 'legendary',
      effect: 'Reset All Cooldowns'
    },
    {
      id: 'level_boost',
      name: 'Impulso de Nivel',
      description: 'Gana experiencia equivalente a un nivel completo',
      icon: Rocket,
      price: 75,
      currency: 'diamonds',
      rarity: 'legendary',
      effect: '+1 Nivel Completo'
    },
    {
      id: 'ultimate_package',
      name: 'Paquete Supremo',
      description: 'Todos los boosts activos por 6 horas',
      icon: Crown,
      price: 100,
      currency: 'diamonds',
      rarity: 'mythic',
      effect: 'All Boosts x6 horas'
    },

    // TON Items - Exclusive and special
    {
      id: 'nft_robot_ton',
      name: 'Robot NFT Exclusivo',
      description: 'Robot único solo disponible con TON',
      icon: Bot,
      price: 0.5,
      currency: 'ton',
      rarity: 'mythic',
      effect: 'Robot NFT Permanente'
    },
    {
      id: 'ton_multiplier',
      name: 'Multiplicador TON',
      description: 'Multiplica todas las ganancias por 10',
      icon: Zap,
      price: 1.0,
      currency: 'ton',
      rarity: 'mythic',
      effect: '+1000% All Gains x24h'
    },
    {
      id: 'cosmic_upgrade',
      name: 'Mejora Cósmica',
      description: 'Mejora todas las cartas al nivel máximo',
      icon: Star,
      price: 1.5,
      currency: 'ton',
      rarity: 'mythic',
      effect: 'Max Level All Cards'
    },
    {
      id: 'infinity_token',
      name: 'Token del Infinito',
      description: 'Recursos ilimitados por 1 hora',
      icon: Gem,
      price: 2.0,
      currency: 'ton',
      rarity: 'mythic',
      effect: 'Infinite Resources x1h'
    },
    {
      id: 'god_mode_ton',
      name: 'Modo Dios TON',
      description: 'Poder supremo absoluto',
      icon: Crown,
      price: 5.0,
      currency: 'ton',
      rarity: 'mythic',
      effect: 'God Mode x1 hora'
    },

    // NEW: Telegram Stars Items - Exclusive features
    {
      id: 'star_booster',
      name: 'Acelerador Estelar',
      description: 'Acelera todos los cooldowns por 30 minutos',
      icon: Star,
      price: 5,
      currency: 'stars',
      rarity: 'epic',
      effect: 'No Cooldowns x30min'
    },
    {
      id: 'stellar_multiplier',
      name: 'Multiplicador Estelar',
      description: 'Triplica ganancias de monedas por 1 hora',
      icon: Sparkles,
      price: 10,
      currency: 'stars',
      rarity: 'legendary',
      effect: '+300% Coins x1h'
    },
    {
      id: 'star_shield',
      name: 'Escudo de Estrellas',
      description: 'Protege contra pérdidas por 2 horas',
      icon: Shield,
      price: 15,
      currency: 'stars',
      rarity: 'legendary',
      effect: 'Protection x2h'
    },
    {
      id: 'cosmic_fortune',
      name: 'Fortuna Cósmica',
      description: 'Duplica todas las recompensas por 1 hora',
      icon: Crown,
      price: 25,
      currency: 'stars',
      rarity: 'mythic',
      effect: '+100% All Rewards x1h'
    },
    {
      id: 'star_factory',
      name: 'Fábrica de Estrellas',
      description: 'Genera 1 estrella cada 10 minutos por 1 hora',
      icon: Target,
      price: 20,
      currency: 'stars',
      rarity: 'mythic',
      effect: '+1 Star/10min x1h'
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
          description: "¡TON Wallet conectada exitosamente!",
          variant: "default",
        });
        
        // Simulate wallet address (in real implementation, this would come from TON Connect)
        localStorage.setItem('tonWalletAddress', 'UQAbc123...def456');
        
      } else {
        // Fallback for testing outside Telegram
        setTonWalletConnected(true);
        localStorage.setItem('tonWalletConnected', 'true');
        toast({
          description: "TON Wallet simulada conectada (modo desarrollo)",
          variant: "default",
        });
      }
    } catch (error) {
      toast({
        description: "Error al conectar TON Wallet",
        variant: "destructive",
      });
    }
  };

  const disconnectTonWallet = () => {
    setTonWalletConnected(false);
    localStorage.removeItem('tonWalletConnected');
    localStorage.removeItem('tonWalletAddress');
    toast({
      description: "TON Wallet desconectada",
      variant: "default",
    });
  };

  const buyItem = (item: ShopItem) => {
    if (item.currency === 'ton' && !tonWalletConnected) {
      toast({
        description: "Necesitas conectar tu TON Wallet primero",
        variant: "destructive",
      });
      return;
    }

    if (item.currency === 'stars' && !user) {
      toast({
        description: "Necesitas estar conectado con Telegram para usar estrellas",
        variant: "destructive",
      });
      return;
    }

    const canAfford = item.currency === 'coins' ? coins >= item.price : 
                     item.currency === 'diamonds' ? diamonds >= item.price :
                     item.currency === 'stars' ? telegramStars >= item.price :
                     tonWalletConnected; // For TON, just check if wallet is connected

    if (!canAfford) {
      const currencyName = item.currency === 'coins' ? 'monedas' : 
                          item.currency === 'diamonds' ? 'diamantes' :
                          item.currency === 'stars' ? 'estrellas' : 'TON';
      toast({
        description: `No tienes suficientes ${currencyName} para comprar este item.`,
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
          description: "¡Auto Clicker activado por 1 hora!",
          variant: "default",
        });
        break;
      case 'coin_magnet':
        setCoins(prev => prev + 25000);
        toast({
          description: "¡Imán de Monedas activado! +25,000 monedas bonus",
          variant: "default",
        });
        break;
      case 'exp_multiplier':
        setExperience(prev => prev + 100000);
        toast({
          description: "¡Multiplicador EXP activado! +100,000 EXP",
          variant: "default",
        });
        break;
      case 'instant_upgrade':
        setCoins(prev => prev + 50000);
        toast({
          description: "¡Mejora Instantánea disponible! +50,000 monedas",
          variant: "default",
        });
        break;
      case 'level_boost':
        setExperience(prev => prev + 500000);
        toast({
          description: "¡Impulso de Nivel activado! +500,000 EXP",
          variant: "default",
        });
        break;
      case 'nft_robot_ton':
        setCoins(prev => prev + 1000000);
        setExperience(prev => prev + 1000000);
        toast({
          description: "¡Robot NFT Exclusivo adquirido! +1M Monedas y +1M EXP",
          variant: "default",
        });
        break;
      case 'god_mode_ton':
        setCoins(prev => prev + 5000000);
        setDiamonds(prev => prev + 1000);
        setExperience(prev => prev + 5000000);
        toast({
          description: "¡MODO DIOS ACTIVADO! +5M Monedas, +1K Diamantes, +5M EXP",
          variant: "default",
        });
        break;
      // Star items effects
      case 'star_booster':
        toast({
          description: "¡Acelerador Estelar activado! Sin cooldowns por 30 minutos",
          variant: "default",
        });
        break;
      case 'stellar_multiplier':
        setCoins(prev => prev + 100000);
        toast({
          description: "¡Multiplicador Estelar activado! +100K Monedas bonus",
          variant: "default",
        });
        break;
      case 'cosmic_fortune':
        setCoins(prev => prev + 200000);
        setDiamonds(prev => prev + 50);
        toast({
          description: "¡Fortuna Cósmica activada! +200K Monedas, +50 Diamantes",
          variant: "default",
        });
        break;
      case 'star_factory':
        setTelegramStars(prev => prev + 6); // Bonus 6 stars immediately
        saveGameData('telegramStars', telegramStars + 6);
        toast({
          description: "¡Fábrica de Estrellas activada! +6 Estrellas bonus",
          variant: "default",
        });
        break;
      default:
        setCoins(prev => prev + 20000);
        toast({
          description: `¡${item.name} adquirido! +20,000 Monedas bonus`,
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
                  COMPRAR
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
          Tienda
        </h2>
        <p className="text-white text-base mt-2 font-semibold drop-shadow-md">Mejora tu experiencia de juego</p>
      </div>

      {/* Enhanced TON Wallet Connection */}
      <Card className={`${tonWalletConnected ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/30' : 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-cyan-500/30'} p-4 backdrop-blur-sm`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Wallet className={`w-8 h-8 ${tonWalletConnected ? 'text-green-400' : 'text-cyan-400'}`} />
            <div>
              <h3 className="text-lg font-bold text-white">
                {tonWalletConnected ? 'TON Wallet Conectada' : 'Conecta tu TON Wallet'}
              </h3>
              <p className={`text-sm ${tonWalletConnected ? 'text-green-300' : 'text-cyan-300'}`}>
                {tonWalletConnected ? 'Acceso completo a items exclusivos TON' : 'Accede a items exclusivos con TON'}
              </p>
            </div>
          </div>
          {tonWalletConnected ? (
            <Button
              onClick={disconnectTonWallet}
              variant="outline"
              className="border-red-500 text-red-400 hover:bg-red-500/20"
            >
              Desconectar
            </Button>
          ) : (
            <Button
              onClick={connectTonWallet}
              className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold"
            >
              Conectar Wallet
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
          <span className="font-bold">MONEDAS</span>
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
          <span className="font-bold">DIAMANTES</span>
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
          <span className="font-bold">ESTRELLAS</span>
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
        <h3 className="text-xl font-bold text-white mb-4 drop-shadow-md">Tu Balance</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-yellow-500/20">
              <Coins className="w-6 h-6 text-yellow-400 drop-shadow-lg" />
            </div>
            <div>
              <p className="text-sm text-gray-300 font-medium">Monedas</p>
              <p className="text-xl font-bold text-yellow-400 drop-shadow-md">{coins.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-blue-500/20">
              <Diamond className="w-6 h-6 text-blue-400 drop-shadow-lg" />
            </div>
            <div>
              <p className="text-sm text-gray-300 font-medium">Diamantes</p>
              <p className="text-xl font-bold text-blue-400 drop-shadow-md">{diamonds.toLocaleString()}</p>
            </div>
          </div>
          {user && (
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-yellow-500/20">
                <span className="text-2xl">⭐</span>
              </div>
              <div>
                <p className="text-sm text-gray-300 font-medium">Estrellas</p>
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
                {tonWalletConnected ? 'Conectada ✓' : 'No conectada'}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ShopTab;
