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
  type: 'attack' | 'defense' | 'utility' | 'legendary' | 'rare';
  tradingPerHour?: string;
}

const CardsTab = ({ gameState }: { gameState: GameState }) => {
  const { coins, setCoins, setExperience } = gameState;
  
  const [cards, setCards] = useState<CardData[]>([
    {
      id: 'power',
      name: 'Click Power',
      description: 'Increases click damage',
      icon: Zap,
      level: 1,
      basePrice: 100,
      currentPrice: 100,
      expBonus: 5,
      upgradeTime: 30000,
      type: 'attack',
      tradingPerHour: '+1.2K'
    },
    {
      id: 'shield',
      name: 'Protective Shield',
      description: 'Increases experience gained',
      icon: Shield,
      level: 1,
      basePrice: 250,
      currentPrice: 250,
      expBonus: 10,
      upgradeTime: 60000,
      type: 'defense',
      tradingPerHour: '+2.1K'
    },
    {
      id: 'gem',
      name: 'Gem Multiplier',
      description: 'Temporary experience boost',
      icon: Gem,
      level: 1,
      basePrice: 500,
      currentPrice: 500,
      expBonus: 15,
      upgradeTime: 120000,
      type: 'utility',
      tradingPerHour: '+3.5K'
    },
    {
      id: 'heart',
      name: 'Vital Heart',
      description: 'Regenerates experience points',
      icon: Heart,
      level: 1,
      basePrice: 800,
      currentPrice: 800,
      expBonus: 20,
      upgradeTime: 90000,
      type: 'defense',
      tradingPerHour: '+4.2K'
    },
    {
      id: 'rocket',
      name: 'Cosmic Propulsion',
      description: 'Increases all gains by 5%',
      icon: Rocket,
      level: 1,
      basePrice: 1200,
      currentPrice: 1200,
      expBonus: 25,
      upgradeTime: 150000,
      type: 'utility',
      tradingPerHour: '+5.8K'
    },
    {
      id: 'lightning',
      name: 'Electric Storm',
      description: 'Causes area damage',
      icon: Bolt,
      level: 1,
      basePrice: 1500,
      currentPrice: 1500,
      expBonus: 30,
      upgradeTime: 180000,
      type: 'attack',
      tradingPerHour: '+7.1K'
    },
    {
      id: 'sword',
      name: 'Legendary Sword',
      description: 'Critical damage multiplier',
      icon: Sword,
      level: 1,
      basePrice: 5000,
      currentPrice: 5000,
      expBonus: 50,
      upgradeTime: 300000,
      type: 'legendary',
      tradingPerHour: '+12.5K'
    },
    {
      id: 'target',
      name: 'Eagle Eye',
      description: 'Increases accuracy and exp x2',
      icon: Target,
      level: 1,
      basePrice: 3000,
      currentPrice: 3000,
      expBonus: 40,
      upgradeTime: 240000,
      type: 'rare',
      tradingPerHour: '+9.3K'
    }
  ]);

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

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-20">
      <div className="text-center">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
          Upgrade Cards
        </h2>
        <p className="text-white text-sm mt-1">Upgrade your cards to increase your progress</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          const remainingTime = getRemainingTime(card.cooldownEnd);
          const isOnCooldown = remainingTime > 0;
          const canAfford = coins >= card.currentPrice;
          
          return (
            <Card key={card.id} className="bg-gradient-to-br from-purple-800/50 to-blue-800/50 border-purple-500/30 p-4 rounded-2xl backdrop-blur-sm">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-orange-500/20">
                    <Icon className="w-5 h-5 text-orange-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white text-sm truncate">{card.name}</h3>
                    <p className="text-gray-400 text-xs line-clamp-2">{card.description}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <div>
                    <p className="text-gray-400">Price</p>
                    <div className="flex items-center gap-1 text-yellow-400 font-bold">
                      <Coins className="w-3 h-3" />
                      <span>{card.currentPrice.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400">Level {card.level}</p>
                    <p className="text-white font-bold text-xs">{card.tradingPerHour}</p>
                  </div>
                </div>
                
                {isOnCooldown ? (
                  <div className="space-y-2">
                    <div className="text-center">
                      <Clock className="w-4 h-4 mx-auto text-orange-400 mb-1" />
                      <p className="text-xs text-orange-400 font-medium">{formatTime(remainingTime)}</p>
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
                        ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                        : 'bg-gray-600 cursor-not-allowed text-gray-400'
                    } rounded-lg px-3 py-2 font-medium flex items-center justify-center gap-1 text-xs`}
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
