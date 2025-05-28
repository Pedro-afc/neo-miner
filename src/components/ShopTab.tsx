
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Coins, Diamond, Zap, Star, Crown, Rocket, Gift, Axe, Flame, Shield, Target, Award, Sparkles, Gem, Globe, Clock } from 'lucide-react';
import { toast } from "@/hooks/use-toast";

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
  currency: 'coins' | 'diamonds';
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';
  effect: string;
  purchased?: boolean;
}

const ShopTab = ({ gameState }: { gameState: GameState }) => {
  const { coins, setCoins, diamonds, setDiamonds, setExperience } = gameState;
  const [activeSection, setActiveSection] = useState<'coins' | 'diamonds'>('coins');
  
  const shopItems: ShopItem[] = [
    {
      id: 'click_boost',
      name: 'Boost de Click',
      description: 'Duplica el poder de click por 1 hora',
      icon: Zap,
      price: 5000,
      currency: 'coins',
      rarity: 'common',
      effect: '+100% Click Power'
    },
    {
      id: 'exp_boost',
      name: 'Boost de Experiencia',
      description: 'Triple experiencia por 30 minutos',
      icon: Star,
      price: 15000,
      currency: 'coins',
      rarity: 'rare',
      effect: '+200% EXP'
    },
    {
      id: 'coin_multiplier',
      name: 'Multiplicador de Monedas',
      description: 'Multiplica las monedas ganadas x5 por 2 horas',
      icon: Coins,
      price: 50000,
      currency: 'coins',
      rarity: 'epic',
      effect: '+400% Coins'
    },
    {
      id: 'flame_sword',
      name: 'Espada de Fuego',
      description: 'Daño ardiente continuo por 1 hora',
      icon: Flame,
      price: 25000,
      currency: 'coins',
      rarity: 'epic',
      effect: '+200 DPS'
    },
    {
      id: 'axe_power',
      name: 'Hacha de Guerra',
      description: 'Golpes críticos por 45 minutos',
      icon: Axe,
      price: 35000,
      currency: 'coins',
      rarity: 'rare',
      effect: '+50% Crítico'
    },
    {
      id: 'premium_boost',
      name: 'Boost Premium',
      description: 'Todos los boosts activos por 6 horas',
      icon: Crown,
      price: 50,
      currency: 'diamonds',
      rarity: 'legendary',
      effect: 'All Boosts Active'
    },
    {
      id: 'instant_level',
      name: 'Subida de Nivel',
      description: 'Gana un nivel completo al instante',
      icon: Rocket,
      price: 25,
      currency: 'diamonds',
      rarity: 'epic',
      effect: '+1 Level'
    },
    {
      id: 'diamond_pack',
      name: 'Pack de Diamantes',
      description: 'Recibe diamantes adicionales',
      icon: Diamond,
      price: 100,
      currency: 'diamonds',
      rarity: 'rare',
      effect: '+50 Diamonds'
    },
    {
      id: 'mythic_shield',
      name: 'Escudo Mítico',
      description: 'Protección total contra daños',
      icon: Shield,
      price: 75,
      currency: 'diamonds',
      rarity: 'mythic',
      effect: '100% Protección'
    },
    {
      id: 'legendary_trophy',
      name: 'Trofeo Legendario',
      description: 'Recompensas diarias mejoradas',
      icon: Award,
      price: 200,
      currency: 'diamonds',
      rarity: 'legendary',
      effect: '+300% Daily Rewards'
    },
    {
      id: 'cosmic_sparkle',
      name: 'Destello Cósmico',
      description: 'Efecto visual premium y bonus de experiencia',
      icon: Sparkles,
      price: 120,
      currency: 'diamonds',
      rarity: 'legendary',
      effect: '+250% Visual Effects'
    },
    {
      id: 'gem_master',
      name: 'Maestro de Gemas',
      description: 'Aumenta la rareza de los drops por 24 horas',
      icon: Gem,
      price: 150,
      currency: 'diamonds',
      rarity: 'epic',
      effect: '+100% Rare Drops'
    },
    {
      id: 'global_boost',
      name: 'Boost Global',
      description: 'Aumenta todas las estadísticas por 12 horas',
      icon: Globe,
      price: 180,
      currency: 'diamonds',
      rarity: 'mythic',
      effect: '+50% All Stats'
    },
    {
      id: 'time_warp',
      name: 'Distorsión Temporal',
      description: 'Acelera el tiempo de enfriamiento de las cartas',
      icon: Clock,
      price: 90,
      currency: 'diamonds',
      rarity: 'rare',
      effect: '-75% Cooldowns'
    }
  ];

  const buyItem = (item: ShopItem) => {
    const canAfford = item.currency === 'coins' ? coins >= item.price : diamonds >= item.price;
    if (!canAfford) {
      toast({
        description: `No tienes suficientes ${item.currency === 'coins' ? 'monedas' : 'diamantes'} para comprar este item.`,
        variant: "destructive",
      });
      return;
    }

    if (item.currency === 'coins') {
      setCoins(prev => prev - item.price);
    } else {
      setDiamonds(prev => prev - item.price);
    }

    switch (item.id) {
      case 'exp_boost':
        setExperience(prev => prev + 100000);
        toast({
          description: "¡Boost de Experiencia aplicado! +100,000 EXP",
          variant: "default",
        });
        break;
      case 'instant_level':
        setExperience(prev => prev + 1000000);
        toast({
          description: "¡Subida de Nivel aplicada! +1,000,000 EXP",
          variant: "default",
        });
        break;
      case 'diamond_pack':
        setDiamonds(prev => prev + 50);
        toast({
          description: "¡Pack de Diamantes adquirido! +50 Diamantes",
          variant: "default",
        });
        break;
      case 'cosmic_sparkle':
        setExperience(prev => prev + 200000);
        toast({
          description: "¡Destello Cósmico activado! +200,000 EXP y efectos visuales mejorados",
          variant: "default",
        });
        break;
      case 'global_boost':
        setCoins(prev => prev + 25000);
        setExperience(prev => prev + 150000);
        toast({
          description: "¡Boost Global activado! +25,000 Monedas y +150,000 EXP",
          variant: "default",
        });
        break;
      default:
        setCoins(prev => prev + 10000);
        toast({
          description: "¡Item adquirido! +10,000 Monedas",
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

  const renderShopItems = (items: ShopItem[]) => (
    <div className="space-y-4">
      {items.map((item) => {
        const Icon = item.icon;
        const canAfford = item.currency === 'coins' ? coins >= item.price : diamonds >= item.price;
        
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
                  <p className="text-sm text-gray-200 mb-2 drop-shadow-sm">{item.description}</p>
                  <p className="text-sm text-green-300 font-bold drop-shadow-sm">{item.effect}</p>
                </div>
              </div>
              
              <div className="text-right flex flex-col items-end gap-3">
                <div className={`flex items-center gap-2 ${
                  item.currency === 'coins' ? 'text-yellow-300' : 'text-blue-300'
                }`}>
                  {item.currency === 'coins' ? 
                    <Coins className="w-5 h-5 drop-shadow-lg" /> : 
                    <Diamond className="w-5 h-5 drop-shadow-lg" />
                  }
                  <span className="font-bold text-lg drop-shadow-md">{item.price.toLocaleString()}</span>
                </div>
                
                <Button
                  onClick={() => buyItem(item)}
                  disabled={!canAfford}
                  size="sm"
                  className={`${
                    canAfford 
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 border-0' 
                      : 'bg-gray-700 cursor-not-allowed border-0'
                  } text-white font-bold px-4 py-2`}
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
      </div>

      {/* Content based on active section */}
      <div className="mt-6">
        {activeSection === 'coins' && renderShopItems(coinsItems)}
        {activeSection === 'diamonds' && renderShopItems(diamondsItems)}
      </div>

      {/* Current Balance */}
      <Card className="bg-gray-900/80 backdrop-blur-sm border-2 border-gray-600 p-6">
        <h3 className="text-xl font-bold text-white mb-4 drop-shadow-md">Tu Balance</h3>
        <div className="grid grid-cols-2 gap-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-yellow-500/20">
              <Coins className="w-6 h-6 text-yellow-400 drop-shadow-lg" />
            </div>
            <div>
              <p className="text-sm text-gray-300 font-medium">Monedas</p>
              <p className="text-2xl font-bold text-yellow-400 drop-shadow-md">{coins.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-blue-500/20">
              <Diamond className="w-6 h-6 text-blue-400 drop-shadow-lg" />
            </div>
            <div>
              <p className="text-sm text-gray-300 font-medium">Diamantes</p>
              <p className="text-2xl font-bold text-blue-400 drop-shadow-md">{diamonds.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ShopTab;
