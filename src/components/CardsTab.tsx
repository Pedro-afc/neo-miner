
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Coins, Diamond, Zap, Clock, Star, Crown, Rocket, Bot, TrendingUp } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { useUserCards } from '@/hooks/useUserCards';
import { useUserProgress } from '@/hooks/useUserProgress';
import { formatNumber, calculateAutoClickIncrement } from '@/utils/gameUtils';

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
  basePrice: number;
  baseExpBonus: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';
  category: string;
}

const CardsTab = ({ gameState }: { gameState: GameState }) => {
  const { coins, setCoins, diamonds, setDiamonds } = gameState;
  const { cards, loading, getCard, upgradeCard } = useUserCards();
  const { progress } = useUserProgress();
  const [selectedCategory, setSelectedCategory] = useState('mining');

  const cardData: CardData[] = [
    // Mining Cards
    {
      id: 'basic_miner',
      name: 'Basic Miner',
      description: 'Your first automated mining bot',
      icon: Bot,
      basePrice: 100,
      baseExpBonus: 10,
      rarity: 'common',
      category: 'mining'
    },
    {
      id: 'advanced_drill',
      name: 'Advanced Drill',
      description: 'High-tech drilling equipment',
      icon: Zap,
      basePrice: 500,
      baseExpBonus: 25,
      rarity: 'rare',
      category: 'mining'
    },
    {
      id: 'quantum_extractor',
      name: 'Quantum Extractor',
      description: 'Extracts resources from quantum dimensions',
      icon: Star,
      basePrice: 2500,
      baseExpBonus: 75,
      rarity: 'epic',
      category: 'mining'
    },
    {
      id: 'cosmic_harvester',
      name: 'Cosmic Harvester',
      description: 'Harvests energy from distant stars',
      icon: Crown,
      basePrice: 15000,
      baseExpBonus: 200,
      rarity: 'legendary',
      category: 'mining'
    },
    {
      id: 'universal_core',
      name: 'Universal Core',
      description: 'The ultimate mining technology',
      icon: Rocket,
      basePrice: 100000,
      baseExpBonus: 1000,
      rarity: 'mythic',
      category: 'mining'
    },

    // Business Cards
    {
      id: 'coffee_shop',
      name: 'Coffee Shop',
      description: 'Small local business venture',
      icon: Bot,
      basePrice: 200,
      baseExpBonus: 15,
      rarity: 'common',
      category: 'business'
    },
    {
      id: 'tech_startup',
      name: 'Tech Startup',
      description: 'Innovative technology company',
      icon: Zap,
      basePrice: 1000,
      baseExpBonus: 40,
      rarity: 'rare',
      category: 'business'
    },
    {
      id: 'global_corporation',
      name: 'Global Corporation',
      description: 'Multinational business empire',
      icon: Crown,
      basePrice: 25000,
      baseExpBonus: 300,
      rarity: 'legendary',
      category: 'business'
    },

    // Investment Cards
    {
      id: 'stock_portfolio',
      name: 'Stock Portfolio',
      description: 'Diversified investment collection',
      icon: TrendingUp,
      basePrice: 800,
      baseExpBonus: 30,
      rarity: 'rare',
      category: 'investment'
    },
    {
      id: 'real_estate',
      name: 'Real Estate Empire',
      description: 'Property investment portfolio',
      icon: Crown,
      basePrice: 5000,
      baseExpBonus: 120,
      rarity: 'epic',
      category: 'investment'
    },
    {
      id: 'crypto_fund',
      name: 'Crypto Investment Fund',
      description: 'Digital asset management',
      icon: Diamond,
      basePrice: 50000,
      baseExpBonus: 500,
      rarity: 'mythic',
      category: 'investment'
    }
  ];

  const categories = [
    { id: 'mining', name: 'Mining', icon: Bot },
    { id: 'business', name: 'Business', icon: Crown },
    { id: 'investment', name: 'Investment', icon: TrendingUp }
  ];

  const getCardStats = (cardId: string) => {
    const card = getCard(cardId);
    const baseCard = cardData.find(c => c.id === cardId);
    
    if (!baseCard) return null;

    const level = card?.level || 0;
    const currentPrice = card?.current_price || baseCard.basePrice;
    const expBonus = card?.exp_bonus || baseCard.baseExpBonus;
    const nextPrice = Math.floor(currentPrice * 1.5);
    const nextExpBonus = Math.floor(expBonus * 1.2);
    const cooldownEnd = card?.cooldown_end;
    
    return {
      level,
      currentPrice,
      expBonus,
      nextPrice,
      nextExpBonus,
      cooldownEnd,
      autoClickBonus: calculateAutoClickIncrement(currentPrice)
    };
  };

  const canUpgradeCard = (cardId: string) => {
    const stats = getCardStats(cardId);
    if (!stats) return false;

    const hasEnoughCoins = coins >= stats.nextPrice;
    const isNotOnCooldown = !stats.cooldownEnd || new Date(stats.cooldownEnd) <= new Date();
    
    return hasEnoughCoins && isNotOnCooldown;
  };

  const handleUpgradeCard = async (cardId: string) => {
    const stats = getCardStats(cardId);
    if (!stats || !canUpgradeCard(cardId)) return;

    // Deduct coins first
    setCoins(prev => prev - stats.nextPrice);

    // Perform the upgrade - this will automatically recalculate mining power
    const success = await upgradeCard(
      cardId,
      stats.level + 1,
      stats.nextPrice,
      stats.nextExpBonus
    );

    if (!success) {
      // Refund coins if upgrade failed
      setCoins(prev => prev + stats.nextPrice);
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

  const getCooldownTimeLeft = (cooldownEnd: string | null) => {
    if (!cooldownEnd) return null;
    
    const endTime = new Date(cooldownEnd).getTime();
    const now = Date.now();
    const timeLeft = Math.max(0, endTime - now);
    
    if (timeLeft === 0) return null;
    
    const seconds = Math.floor(timeLeft / 1000);
    return `${seconds}s`;
  };

  const filteredCards = cardData.filter(card => card.category === selectedCategory);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white text-lg">Loading cards...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-20">
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent drop-shadow-lg">
          Card Collection
        </h2>
        <p className="text-white text-base mt-2 font-semibold drop-shadow-md">
          Upgrade your cards to boost mining power
        </p>
        {progress && (
          <p className="text-green-300 text-sm mt-1">
            Current Auto-Mining: +{progress.auto_click_power}/sec
          </p>
        )}
      </div>

      {/* Category Navigation */}
      <div className="flex space-x-1 bg-gray-900/80 p-1 rounded-xl backdrop-blur-sm border border-gray-600">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <Button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              variant="ghost"
              className={`flex-1 flex items-center justify-center gap-2 rounded-lg transition-all duration-200 ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-bold">{category.name.toUpperCase()}</span>
            </Button>
          );
        })}
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredCards.map((cardInfo) => {
          const stats = getCardStats(cardInfo.id);
          const canUpgrade = canUpgradeCard(cardInfo.id);
          const cooldownTime = getCooldownTimeLeft(stats?.cooldownEnd || null);
          const Icon = cardInfo.icon;
          
          return (
            <Card
              key={cardInfo.id}
              className={`bg-gradient-to-r ${getRarityColor(cardInfo.rarity)} p-4 border-2 backdrop-blur-sm`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="p-3 rounded-lg bg-white/20 backdrop-blur-sm">
                    <Icon className="w-8 h-8 text-white drop-shadow-lg" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-white text-lg drop-shadow-md">
                        {cardInfo.name}
                      </h3>
                      <Badge className={getRarityBadgeColor(cardInfo.rarity)}>
                        {cardInfo.rarity.toUpperCase()}
                      </Badge>
                      {stats && stats.level > 0 && (
                        <Badge className="bg-green-600 text-white border-0">
                          LVL {stats.level}
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-sm text-white/90 mb-3 drop-shadow-sm">
                      {cardInfo.description}
                    </p>
                    
                    {stats && (
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-300">Mining Power</p>
                          <p className="font-bold text-green-300">
                            +{stats.autoClickBonus}/sec
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-300">EXP Bonus</p>
                          <p className="font-bold text-purple-300">
                            +{formatNumber(stats.expBonus)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="text-right flex flex-col items-end gap-3">
                  {stats && (
                    <>
                      <div className="flex items-center gap-2 text-yellow-300">
                        <Coins className="w-5 h-5 drop-shadow-lg" />
                        <span className="font-bold text-lg drop-shadow-md">
                          {formatNumber(stats.nextPrice)}
                        </span>
                      </div>
                      
                      {cooldownTime ? (
                        <div className="flex items-center gap-2 text-orange-300">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm font-bold">{cooldownTime}</span>
                        </div>
                      ) : (
                        <Button
                          onClick={() => handleUpgradeCard(cardInfo.id)}
                          disabled={!canUpgrade}
                          size="sm"
                          className={`${
                            canUpgrade
                              ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 border-0 text-white'
                              : 'bg-gray-700 cursor-not-allowed border-0 text-gray-400'
                          } font-bold px-4 py-2`}
                        >
                          <TrendingUp className="w-4 h-4 mr-2" />
                          {stats.level === 0 ? 'BUY' : 'UPGRADE'}
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Stats Summary */}
      <Card className="bg-gray-900/80 backdrop-blur-sm border-2 border-gray-600 p-6">
        <h3 className="text-xl font-bold text-white mb-4 drop-shadow-md">Your Resources</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-yellow-500/20">
              <Coins className="w-6 h-6 text-yellow-400 drop-shadow-lg" />
            </div>
            <div>
              <p className="text-sm text-gray-300 font-medium">Coins</p>
              <p className="text-xl font-bold text-yellow-400 drop-shadow-md">
                {formatNumber(coins)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-blue-500/20">
              <Diamond className="w-6 h-6 text-blue-400 drop-shadow-lg" />
            </div>
            <div>
              <p className="text-sm text-gray-300 font-medium">Diamonds</p>
              <p className="text-xl font-bold text-blue-400 drop-shadow-md">
                {formatNumber(diamonds)}
              </p>
            </div>
          </div>
          
          {progress && (
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-green-500/20">
                <Bot className="w-6 h-6 text-green-400 drop-shadow-lg" />
              </div>
              <div>
                <p className="text-sm text-gray-300 font-medium">Auto-Mining</p>
                <p className="text-xl font-bold text-green-400 drop-shadow-md">
                  +{progress.auto_click_power}/sec
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default CardsTab;
