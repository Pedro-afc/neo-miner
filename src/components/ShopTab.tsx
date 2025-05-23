
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingBag, Coins, Diamond, Zap, Star, Crown, Rocket, Gift, Axe, Flame, Shield, Target, Award } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";

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
  const [activeTab, setActiveTab] = useState<string>('coins');
  
  const [shopItems] = useState<ShopItem[]>([
    // Coins section
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
    
    // Diamonds section
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
  ]);

  const buyItem = (item: ShopItem) => {
    const canAfford = item.currency === 'coins' ? coins >= item.price : diamonds >= item.price;
    if (!canAfford) {
      toast({
        description: `No tienes suficientes ${item.currency === 'coins' ? 'monedas' : 'diamantes'} para comprar este item.`,
        variant: "destructive",
      });
      return;
    }

    // Deduct currency
    if (item.currency === 'coins') {
      setCoins(prev => prev - item.price);
    } else {
      setDiamonds(prev => prev - item.price);
    }

    // Apply item effect (simplified for demo)
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
      default:
        setCoins(prev => prev + 10000); // Default reward
        toast({
          description: "¡Item adquirido! +10,000 Monedas",
          variant: "default",
        });
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'from-gray-500/20 to-gray-600/20 border-gray-500/30';
      case 'rare':
        return 'from-blue-500/20 to-cyan-500/20 border-blue-500/30';
      case 'epic':
        return 'from-purple-500/20 to-pink-500/20 border-purple-500/30';
      case 'legendary':
        return 'from-yellow-500/20 to-orange-500/20 border-yellow-500/30';
      case 'mythic':
        return 'from-red-500/20 to-rose-500/20 border-red-500/30';
      default:
        return 'from-gray-500/20 to-gray-600/20 border-gray-500/30';
    }
  };

  const getRarityBadgeColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'bg-gray-500/20 text-white border-gray-500/30';
      case 'rare':
        return 'bg-blue-500/20 text-white border-blue-500/30';
      case 'epic':
        return 'bg-purple-500/20 text-white border-purple-500/30';
      case 'legendary':
        return 'bg-yellow-500/20 text-white border-yellow-500/30';
      case 'mythic':
        return 'bg-red-500/20 text-white border-red-500/30';
      default:
        return 'bg-gray-500/20 text-white border-gray-500/30';
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
          <Card key={item.id} className={`bg-gradient-to-r ${getRarityColor(item.rarity)} p-4`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-white/10">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-white">{item.name}</h3>
                    <Badge className={getRarityBadgeColor(item.rarity)}>
                      {item.rarity}
                    </Badge>
                  </div>
                  <p className="text-sm text-white mb-1">{item.description}</p>
                  <p className="text-xs text-green-300 font-medium">{item.effect}</p>
                </div>
              </div>
              
              <div className="text-right">
                <div className={`flex items-center gap-1 mb-3 ${
                  item.currency === 'coins' ? 'text-yellow-400' : 'text-blue-400'
                }`}>
                  {item.currency === 'coins' ? 
                    <Coins className="w-4 h-4" /> : 
                    <Diamond className="w-4 h-4" />
                  }
                  <span className="font-bold">{item.price.toLocaleString()}</span>
                </div>
                
                <Button
                  onClick={() => buyItem(item)}
                  disabled={!canAfford}
                  size="sm"
                  className={`${
                    canAfford 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400' 
                      : 'bg-gray-600 cursor-not-allowed'
                  } text-white font-bold`}
                >
                  <ShoppingBag className="w-4 h-4 mr-1" />
                  Comprar
                </Button>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-6 max-w-md mx-auto pb-20">
      <div className="text-center">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">
          Tienda
        </h2>
        <p className="text-gray-300 text-sm mt-1">Mejora tu experiencia de juego</p>
      </div>

      <Tabs defaultValue="coins" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-black/30">
          <TabsTrigger value="coins" className="flex items-center gap-2 text-white data-[state=active]:bg-yellow-800/30">
            <Coins className="w-4 h-4" />
            Monedas
          </TabsTrigger>
          <TabsTrigger value="diamonds" className="flex items-center gap-2 text-white data-[state=active]:bg-blue-800/30">
            <Diamond className="w-4 h-4" />
            Diamantes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="coins" className="mt-6">
          {renderShopItems(coinsItems)}
        </TabsContent>

        <TabsContent value="diamonds" className="mt-6">
          {renderShopItems(diamondsItems)}
        </TabsContent>
      </Tabs>

      {/* Current Balance */}
      <Card className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border-indigo-500/30 p-4">
        <h3 className="text-lg font-bold text-white mb-3">Tu Balance</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-yellow-400" />
            <div>
              <p className="text-xs text-yellow-300">Monedas</p>
              <p className="text-lg font-bold text-yellow-100">{coins.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Diamond className="w-5 h-5 text-blue-400" />
            <div>
              <p className="text-xs text-blue-300">Diamantes</p>
              <p className="text-lg font-bold text-blue-100">{diamonds.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ShopTab;
