
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Coins, Clock, TrendingUp, Zap, Shield, Gem, Heart, Rocket, Bolt, Sword, Target } from 'lucide-react';
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
}

const CardsTab = ({ gameState }: { gameState: GameState }) => {
  const { coins, setCoins, setExperience } = gameState;
  
  const [cards, setCards] = useState<CardData[]>([
    {
      id: 'power',
      name: 'Poder de Click',
      description: 'Aumenta el daño por click',
      icon: Zap,
      level: 1,
      basePrice: 100,
      currentPrice: 100,
      expBonus: 5,
      upgradeTime: 30000, // 30 seconds
      type: 'attack'
    },
    {
      id: 'shield',
      name: 'Escudo Protector',
      description: 'Incrementa la experiencia ganada',
      icon: Shield,
      level: 1,
      basePrice: 250,
      currentPrice: 250,
      expBonus: 10,
      upgradeTime: 60000, // 1 minute
      type: 'defense'
    },
    {
      id: 'gem',
      name: 'Multiplicador de Gemas',
      description: 'Boost de experiencia temporal',
      icon: Gem,
      level: 1,
      basePrice: 500,
      currentPrice: 500,
      expBonus: 15,
      upgradeTime: 120000, // 2 minutes
      type: 'utility'
    },
    // Nuevas tarjetas agregadas
    {
      id: 'heart',
      name: 'Corazón Vital',
      description: 'Regenera puntos de experiencia',
      icon: Heart,
      level: 1,
      basePrice: 800,
      currentPrice: 800,
      expBonus: 20,
      upgradeTime: 90000, // 1.5 minutes
      type: 'defense'
    },
    {
      id: 'rocket',
      name: 'Propulsión Cósmica',
      description: 'Aumenta todas las ganancias un 5%',
      icon: Rocket,
      level: 1,
      basePrice: 1200,
      currentPrice: 1200,
      expBonus: 25,
      upgradeTime: 150000, // 2.5 minutes
      type: 'utility'
    },
    {
      id: 'lightning',
      name: 'Tormenta Eléctrica',
      description: 'Causa daño por área',
      icon: Bolt,
      level: 1,
      basePrice: 1500,
      currentPrice: 1500,
      expBonus: 30,
      upgradeTime: 180000, // 3 minutes
      type: 'attack'
    },
    {
      id: 'sword',
      name: 'Espada Legendaria',
      description: 'Multiplicador de daño crítico',
      icon: Sword,
      level: 1,
      basePrice: 5000,
      currentPrice: 5000,
      expBonus: 50,
      upgradeTime: 300000, // 5 minutes
      type: 'legendary'
    },
    {
      id: 'target',
      name: 'Ojo de Halcón',
      description: 'Aumenta la precisión y exp x2',
      icon: Target,
      level: 1,
      basePrice: 3000,
      currentPrice: 3000,
      expBonus: 40,
      upgradeTime: 240000, // 4 minutes
      type: 'rare'
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
          // Deduct coins
          setCoins(prev => prev - card.currentPrice);
          
          // Add experience bonus
          const expGained = card.expBonus * 1000;
          setExperience(prev => prev + expGained);
          
          toast({
            description: `¡${card.name} mejorada a nivel ${card.level + 1}! +${expGained.toLocaleString()} EXP`,
            variant: "default",
          });
          
          // Calculate new price (150% increase)
          const newPrice = Math.floor(card.currentPrice * 1.5);
          
          // Set cooldown
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

  const getCardGradient = (type: string) => {
    switch (type) {
      case 'attack':
        return 'from-red-500/20 to-orange-500/20 border-red-500/30';
      case 'defense':
        return 'from-blue-500/20 to-cyan-500/20 border-blue-500/30';
      case 'utility':
        return 'from-purple-500/20 to-pink-500/20 border-purple-500/30';
      case 'legendary':
        return 'from-yellow-500/20 to-amber-500/20 border-yellow-500/30';
      case 'rare':
        return 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30';
      default:
        return 'from-gray-500/20 to-gray-600/20 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-6 max-w-md mx-auto">
      <div className="text-center">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
          Cartas de Mejora
        </h2>
        <p className="text-gray-300 text-sm mt-1">Mejora tus cartas para aumentar tu progreso</p>
      </div>

      <div className="space-y-4">
        {cards.map((card) => {
          const Icon = card.icon;
          const remainingTime = getRemainingTime(card.cooldownEnd);
          const isOnCooldown = remainingTime > 0;
          const canAfford = coins >= card.currentPrice;
          
          return (
            <Card key={card.id} className={`bg-gradient-to-r ${getCardGradient(card.type)} p-4`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white/10">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-white">{card.name}</h3>
                    <p className="text-xs text-white">{card.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs bg-white/20 px-2 py-1 rounded text-white">
                        Nivel {card.level}
                      </span>
                      <span className="text-xs text-green-300">
                        +{card.expBonus}% EXP
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center gap-1 text-yellow-400 mb-2">
                    <Coins className="w-4 h-4" />
                    <span className="font-bold">{card.currentPrice.toLocaleString()}</span>
                  </div>
                  
                  {isOnCooldown ? (
                    <div className="text-center">
                      <Clock className="w-4 h-4 mx-auto text-orange-400 mb-1" />
                      <p className="text-xs text-orange-300">{formatTime(remainingTime)}</p>
                    </div>
                  ) : (
                    <Button
                      onClick={() => upgradeCard(card.id)}
                      disabled={!canAfford}
                      size="sm"
                      className={`${
                        canAfford 
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400' 
                          : 'bg-gray-600 cursor-not-allowed'
                      } text-white font-bold`}
                    >
                      <TrendingUp className="w-4 h-4 mr-1" />
                      Mejorar
                    </Button>
                  )}
                </div>
              </div>
              
              {isOnCooldown && (
                <div className="mt-3">
                  <Progress 
                    value={((card.upgradeTime - remainingTime) / card.upgradeTime) * 100} 
                    className="h-1 bg-gray-700"
                  />
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default CardsTab;
