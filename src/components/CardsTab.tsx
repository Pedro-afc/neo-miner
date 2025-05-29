import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Coins, Clock, TrendingUp, Zap, Shield, Gem, Heart, Rocket, Bolt, Sword, Target } from 'lucide-react';
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

interface CardData {
  id: string;
  name: string;
  description: string;
  icon: any;
  level: number;
  basePrice: number;
  currentPrice: number;
  expBonus: number;
  upgradeTime: number;
  cooldownEnd?: number;
  category: 'combat' | 'defense' | 'utility' | 'legendary' | 'nano';
  tradingPerHour?: string;
}

const CardsTab = ({ gameState }: { gameState: GameState }) => {
  const { coins, setCoins, setExperience } = gameState;
  const [activeCategory, setActiveCategory] = useState<'combat' | 'defense' | 'utility' | 'legendary' | 'nano'>('combat');
  
  const [cards, setCards] = useState<CardData[]>([
    // Combat Bots
    {
      id: 'assault_bot',
      name: 'Assault Bot X1',
      description: 'High-damage combat android',
      icon: Zap,
      level: 1,
      basePrice: 100,
      currentPrice: 100,
      expBonus: 5,
      upgradeTime: 30000,
      category: 'combat',
      tradingPerHour: '+1.2K'
    },
    {
      id: 'striker_mech',
      name: 'Striker Mech',
      description: 'Lightning-fast attack robot',
      icon: Bolt,
      level: 1,
      basePrice: 1500,
      currentPrice: 1500,
      expBonus: 30,
      upgradeTime: 180000,
      category: 'combat',
      tradingPerHour: '+7.1K'
    },
    // Defense Drones
    {
      id: 'guardian_drone',
      name: 'Guardian Drone',
      description: 'Protective shield generator',
      icon: Shield,
      level: 1,
      basePrice: 250,
      currentPrice: 250,
      expBonus: 10,
      upgradeTime: 60000,
      category: 'defense',
      tradingPerHour: '+2.1K'
    },
    {
      id: 'repair_bot',
      name: 'Repair Bot V2',
      description: 'Self-healing maintenance unit',
      icon: Heart,
      level: 1,
      basePrice: 800,
      currentPrice: 800,
      expBonus: 20,
      upgradeTime: 90000,
      category: 'defense',
      tradingPerHour: '+4.2K'
    },
    // Utility Mechs
    {
      id: 'mining_mech',
      name: 'Mining Mech Pro',
      description: 'Resource extraction specialist',
      icon: Gem,
      level: 1,
      basePrice: 500,
      currentPrice: 500,
      expBonus: 15,
      upgradeTime: 120000,
      category: 'utility',
      tradingPerHour: '+3.5K'
    },
    {
      id: 'booster_robot',
      name: 'Booster Robot',
      description: 'Performance enhancement unit',
      icon: Rocket,
      level: 1,
      basePrice: 1200,
      currentPrice: 1200,
      expBonus: 25,
      upgradeTime: 150000,
      category: 'utility',
      tradingPerHour: '+5.8K'
    },
    // Legendary Cyborgs
    {
      id: 'cyber_warrior',
      name: 'Cyber Warrior Elite',
      description: 'Ultimate combat cyborg',
      icon: Sword,
      level: 1,
      basePrice: 5000,
      currentPrice: 5000,
      expBonus: 50,
      upgradeTime: 300000,
      category: 'legendary',
      tradingPerHour: '+12.5K'
    },
    // Nano Swarms
    {
      id: 'nano_swarm',
      name: 'Nano Swarm Alpha',
      description: 'Precision microscopic army',
      icon: Target,
      level: 1,
      basePrice: 3000,
      currentPrice: 3000,
      expBonus: 40,
      upgradeTime: 240000,
      category: 'nano',
      tradingPerHour: '+9.3K'
    }
  ]);

  const categories = [
    { id: 'combat', name: 'Combat Bots', icon: Zap },
    { id: 'defense', name: 'Defense Drones', icon: Shield },
    { id: 'utility', name: 'Utility Mechs', icon: Gem },
    { id: 'legendary', name: 'Legendary Cyborgs', icon: Sword },
    { id: 'nano', name: 'Nano Swarms', icon: Target }
  ];

  // Effect to update cooldowns in real-time
  useEffect(() => {
    const interval = setInterval(() => {
      setCards(prevCards => 
        prevCards.map(card => {
          if (card.cooldownEnd && card.cooldownEnd <= Date.now()) {
            return { ...card, cooldownEnd: undefined };
          }
          return card;
        })
      );
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const upgradeCard = (cardId: string) => {
    setCards(prevCards => 
      prevCards.map(card => {
        if (card.id === cardId && coins >= card.currentPrice && !card.cooldownEnd) {
          setCoins(prev => prev - card.currentPrice);
          
          const expGained = card.expBonus * 1000;
          setExperience(prev => prev + expGained);
          
          toast({
            description: `${card.name} upgraded to level ${card.level + 1}! +${expGained.toLocaleString()} EXP`,
            variant: "default",
          });
          
          const newPrice = Math.floor(card.currentPrice * 1.5);
          const cooldownEnd = Date.now() + card.upgradeTime;
          
          return {
            ...card,
            level: card.level + 1,
            currentPrice: newPrice,
            expBonus: card.expBonus + Math.floor(card.expBonus * 0.2),
            cooldownEnd
          };
        }
        return card;
      })
    );
  };

  const getRemainingTime = (cooldownEnd?: number) => {
    if (!cooldownEnd) return 0;
    const remaining = cooldownEnd - Date.now();
    return Math.max(0, remaining);
  };

  const formatTime = (ms: number) => {
    const seconds = Math.ceil(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return minutes > 0 ? `${minutes}m ${remainingSeconds}s` : `${remainingSeconds}s`;
  };

  const filteredCards = cards.filter(card => card.category === activeCategory);

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-20">
      <div className="text-center">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Robot Arsenal
        </h2>
        <p className="text-white text-sm mt-1">Upgrade your robotic companions</p>
      </div>

      {/* Robot Category Navigation */}
      <div className="flex space-x-1 bg-gray-900/80 p-1 rounded-xl backdrop-blur-sm border border-gray-600 overflow-x-auto">
        {categories.map((category) => {
          const CategoryIcon = category.icon;
          return (
            <Button
              key={category.id}
              onClick={() => setActiveCategory(category.id as any)}
              variant="ghost"
              size="sm"
              className={`flex-shrink-0 flex items-center justify-center gap-1 rounded-lg transition-all duration-200 text-xs px-2 py-1 ${
                activeCategory === category.id
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <CategoryIcon className="w-3 h-3" />
              <span className="hidden sm:inline font-medium">{category.name}</span>
            </Button>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {filteredCards.map((card) => {
          const Icon = card.icon;
          const remainingTime = getRemainingTime(card.cooldownEnd);
          const isOnCooldown = remainingTime > 0;
          const canAfford = coins >= card.currentPrice;
          
          return (
            <Card key={card.id} className="bg-gradient-to-br from-purple-800/50 to-blue-800/50 border-purple-500/30 p-4 rounded-2xl backdrop-blur-sm">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-cyan-500/30 shadow-lg">
                    <Icon className="w-5 h-5 text-cyan-200 drop-shadow-lg" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-cyan-300 text-sm truncate drop-shadow-md">{card.name}</h3>
                    <p className="text-gray-200 text-xs line-clamp-2 drop-shadow-sm">{card.description}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <div>
                    <p className="text-gray-300 font-medium">Price</p>
                    <div className="flex items-center gap-1 text-yellow-300 font-bold drop-shadow-md">
                      <Coins className="w-3 h-3 drop-shadow-lg" />
                      <span>{card.currentPrice.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-300 font-medium">Level {card.level}</p>
                    <p className="text-green-300 font-bold text-xs drop-shadow-md">{card.tradingPerHour}</p>
                  </div>
                </div>
                
                {isOnCooldown ? (
                  <div className="space-y-2">
                    <div className="text-center">
                      <Clock className="w-4 h-4 mx-auto text-orange-300 mb-1 drop-shadow-lg" />
                      <p className="text-xs text-orange-300 font-medium drop-shadow-md">{formatTime(remainingTime)}</p>
                    </div>
                    <Progress 
                      value={((card.upgradeTime - remainingTime) / card.upgradeTime) * 100} 
                      className="h-1 bg-gray-700"
                    />
                  </div>
                ) : (
                  <Button
                    onClick={() => upgradeCard(card.id)}
                    disabled={!canAfford}
                    size="sm"
                    className={`w-full ${
                      canAfford 
                        ? 'bg-cyan-600 hover:bg-cyan-700 text-white shadow-lg' 
                        : 'bg-gray-600 cursor-not-allowed text-gray-400'
                    } rounded-lg px-3 py-2 font-medium flex items-center justify-center gap-1 text-xs transition-all duration-200`}
                  >
                    <TrendingUp className="w-3 h-3" />
                    Upgrade
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default CardsTab;
