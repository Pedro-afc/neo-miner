
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Coins, Clock, TrendingUp, Zap, Shield, Gem, Heart, Rocket, Bolt, Sword, Target, Bot, Cpu, Wrench, Crown, Microscope } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { formatNumber, calculateAutoClickIncrement, saveGameData, loadGameData } from '@/utils/gameUtils';

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
  
  const [cards, setCards] = useState<CardData[]>(() => {
    const savedCards = loadGameData('gameCards', null);
    if (savedCards) return savedCards;
    
    return [
      // Combat Bots (10 cards)
      {
        id: 'assault_bot',
        name: 'Assault Bot X1',
        description: 'Basic combat android',
        icon: Zap,
        level: 1,
        basePrice: 1000,
        currentPrice: 1000,
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
        basePrice: 2500,
        currentPrice: 2500,
        expBonus: 8,
        upgradeTime: 45000,
        category: 'combat',
        tradingPerHour: '+2.1K'
      },
      {
        id: 'blaster_android',
        name: 'Blaster Android',
        description: 'Energy weapon specialist',
        icon: Target,
        level: 1,
        basePrice: 5000,
        currentPrice: 5000,
        expBonus: 12,
        upgradeTime: 60000,
        category: 'combat',
        tradingPerHour: '+3.5K'
      },
      {
        id: 'warrior_cyborg',
        name: 'Warrior Cyborg',
        description: 'Enhanced combat unit',
        icon: Sword,
        level: 1,
        basePrice: 8000,
        currentPrice: 8000,
        expBonus: 18,
        upgradeTime: 90000,
        category: 'combat',
        tradingPerHour: '+4.8K'
      },
      {
        id: 'battle_droid',
        name: 'Battle Droid',
        description: 'Armored combat machine',
        icon: Bot,
        level: 1,
        basePrice: 12000,
        currentPrice: 12000,
        expBonus: 25,
        upgradeTime: 120000,
        category: 'combat',
        tradingPerHour: '+6.2K'
      },
      {
        id: 'destroyer_mech',
        name: 'Destroyer Mech',
        description: 'Heavy assault robot',
        icon: Rocket,
        level: 1,
        basePrice: 18000,
        currentPrice: 18000,
        expBonus: 35,
        upgradeTime: 150000,
        category: 'combat',
        tradingPerHour: '+8.5K'
      },
      {
        id: 'terminator_bot',
        name: 'Terminator Bot',
        description: 'Advanced killing machine',
        icon: Zap,
        level: 1,
        basePrice: 25000,
        currentPrice: 25000,
        expBonus: 45,
        upgradeTime: 180000,
        category: 'combat',
        tradingPerHour: '+11.2K'
      },
      {
        id: 'plasma_warrior',
        name: 'Plasma Warrior',
        description: 'Plasma cannon equipped',
        icon: Bolt,
        level: 1,
        basePrice: 35000,
        currentPrice: 35000,
        expBonus: 60,
        upgradeTime: 210000,
        category: 'combat',
        tradingPerHour: '+15.3K'
      },
      {
        id: 'titan_combat',
        name: 'Combat Titan',
        description: 'Massive war machine',
        icon: Target,
        level: 1,
        basePrice: 50000,
        currentPrice: 50000,
        expBonus: 80,
        upgradeTime: 240000,
        category: 'combat',
        tradingPerHour: '+20.1K'
      },
      {
        id: 'apex_fighter',
        name: 'Apex Fighter',
        description: 'Ultimate combat robot',
        icon: Sword,
        level: 1,
        basePrice: 75000,
        currentPrice: 75000,
        expBonus: 100,
        upgradeTime: 300000,
        category: 'combat',
        tradingPerHour: '+28.5K'
      },

      // Defense Drones (10 cards)
      {
        id: 'guardian_drone',
        name: 'Guardian Drone',
        description: 'Basic shield generator',
        icon: Shield,
        level: 1,
        basePrice: 1500,
        currentPrice: 1500,
        expBonus: 6,
        upgradeTime: 35000,
        category: 'defense',
        tradingPerHour: '+1.8K'
      },
      {
        id: 'barrier_bot',
        name: 'Barrier Bot',
        description: 'Energy barrier creator',
        icon: Heart,
        level: 1,
        basePrice: 3000,
        currentPrice: 3000,
        expBonus: 10,
        upgradeTime: 50000,
        category: 'defense',
        tradingPerHour: '+2.5K'
      },
      {
        id: 'protector_unit',
        name: 'Protector Unit',
        description: 'Advanced defense system',
        icon: Shield,
        level: 1,
        basePrice: 6000,
        currentPrice: 6000,
        expBonus: 15,
        upgradeTime: 75000,
        category: 'defense',
        tradingPerHour: '+4.2K'
      },
      {
        id: 'fortress_drone',
        name: 'Fortress Drone',
        description: 'Mobile defense platform',
        icon: Bot,
        level: 1,
        basePrice: 10000,
        currentPrice: 10000,
        expBonus: 22,
        upgradeTime: 100000,
        category: 'defense',
        tradingPerHour: '+5.8K'
      },
      {
        id: 'aegis_system',
        name: 'Aegis System',
        description: 'Multi-layer protection',
        icon: Crown,
        level: 1,
        basePrice: 15000,
        currentPrice: 15000,
        expBonus: 30,
        upgradeTime: 130000,
        category: 'defense',
        tradingPerHour: '+7.5K'
      },
      {
        id: 'sentinel_mech',
        name: 'Sentinel Mech',
        description: 'Watchful guardian robot',
        icon: Target,
        level: 1,
        basePrice: 22000,
        currentPrice: 22000,
        expBonus: 40,
        upgradeTime: 160000,
        category: 'defense',
        tradingPerHour: '+9.8K'
      },
      {
        id: 'bastion_unit',
        name: 'Bastion Unit',
        description: 'Immovable defense core',
        icon: Shield,
        level: 1,
        basePrice: 32000,
        currentPrice: 32000,
        expBonus: 55,
        upgradeTime: 190000,
        category: 'defense',
        tradingPerHour: '+13.2K'
      },
      {
        id: 'citadel_drone',
        name: 'Citadel Drone',
        description: 'Fortress-class defender',
        icon: Heart,
        level: 1,
        basePrice: 45000,
        currentPrice: 45000,
        expBonus: 70,
        upgradeTime: 220000,
        category: 'defense',
        tradingPerHour: '+17.8K'
      },
      {
        id: 'rampart_bot',
        name: 'Rampart Bot',
        description: 'Impenetrable wall system',
        icon: Bot,
        level: 1,
        basePrice: 65000,
        currentPrice: 65000,
        expBonus: 90,
        upgradeTime: 250000,
        category: 'defense',
        tradingPerHour: '+24.1K'
      },
      {
        id: 'ultimate_shield',
        name: 'Ultimate Shield',
        description: 'Perfect defense matrix',
        icon: Crown,
        level: 1,
        basePrice: 90000,
        currentPrice: 90000,
        expBonus: 120,
        upgradeTime: 300000,
        category: 'defense',
        tradingPerHour: '+32.5K'
      },

      // Utility Mechs (10 cards)
      {
        id: 'mining_bot',
        name: 'Mining Bot',
        description: 'Resource extraction unit',
        icon: Gem,
        level: 1,
        basePrice: 2000,
        currentPrice: 2000,
        expBonus: 7,
        upgradeTime: 40000,
        category: 'utility',
        tradingPerHour: '+2.1K'
      },
      {
        id: 'engineer_droid',
        name: 'Engineer Droid',
        description: 'Construction specialist',
        icon: Wrench,
        level: 1,
        basePrice: 4000,
        currentPrice: 4000,
        expBonus: 12,
        upgradeTime: 55000,
        category: 'utility',
        tradingPerHour: '+3.2K'
      },
      {
        id: 'repair_unit',
        name: 'Repair Unit',
        description: 'Maintenance robot',
        icon: Heart,
        level: 1,
        basePrice: 7000,
        currentPrice: 7000,
        expBonus: 18,
        upgradeTime: 80000,
        category: 'utility',
        tradingPerHour: '+4.8K'
      },
      {
        id: 'harvester_mech',
        name: 'Harvester Mech',
        description: 'Advanced resource gatherer',
        icon: Gem,
        level: 1,
        basePrice: 11000,
        currentPrice: 11000,
        expBonus: 25,
        upgradeTime: 110000,
        category: 'utility',
        tradingPerHour: '+6.5K'
      },
      {
        id: 'builder_bot',
        name: 'Builder Bot',
        description: 'Automated constructor',
        icon: Rocket,
        level: 1,
        basePrice: 16000,
        currentPrice: 16000,
        expBonus: 35,
        upgradeTime: 140000,
        category: 'utility',
        tradingPerHour: '+8.8K'
      },
      {
        id: 'processor_unit',
        name: 'Processor Unit',
        description: 'Data processing specialist',
        icon: Cpu,
        level: 1,
        basePrice: 24000,
        currentPrice: 24000,
        expBonus: 45,
        upgradeTime: 170000,
        category: 'utility',
        tradingPerHour: '+11.5K'
      },
      {
        id: 'optimizer_droid',
        name: 'Optimizer Droid',
        description: 'Efficiency enhancement bot',
        icon: TrendingUp,
        level: 1,
        basePrice: 35000,
        currentPrice: 35000,
        expBonus: 60,
        upgradeTime: 200000,
        category: 'utility',
        tradingPerHour: '+15.8K'
      },
      {
        id: 'mega_miner',
        name: 'Mega Miner',
        description: 'Industrial mining machine',
        icon: Gem,
        level: 1,
        basePrice: 50000,
        currentPrice: 50000,
        expBonus: 80,
        upgradeTime: 230000,
        category: 'utility',
        tradingPerHour: '+21.2K'
      },
      {
        id: 'factory_bot',
        name: 'Factory Bot',
        description: 'Automated production unit',
        icon: Wrench,
        level: 1,
        basePrice: 72000,
        currentPrice: 72000,
        expBonus: 100,
        upgradeTime: 260000,
        category: 'utility',
        tradingPerHour: '+28.5K'
      },
      {
        id: 'nexus_core',
        name: 'Nexus Core',
        description: 'Central utility hub',
        icon: Cpu,
        level: 1,
        basePrice: 100000,
        currentPrice: 100000,
        expBonus: 130,
        upgradeTime: 320000,
        category: 'utility',
        tradingPerHour: '+38.8K'
      },

      // Legendary Cyborgs (10 cards)
      {
        id: 'cyber_knight',
        name: 'Cyber Knight',
        description: 'Noble warrior cyborg',
        icon: Sword,
        level: 1,
        basePrice: 20000,
        currentPrice: 20000,
        expBonus: 50,
        upgradeTime: 200000,
        category: 'legendary',
        tradingPerHour: '+12.5K'
      },
      {
        id: 'mech_emperor',
        name: 'Mech Emperor',
        description: 'Royal combat cyborg',
        icon: Crown,
        level: 1,
        basePrice: 35000,
        currentPrice: 35000,
        expBonus: 70,
        upgradeTime: 240000,
        category: 'legendary',
        tradingPerHour: '+18.2K'
      },
      {
        id: 'quantum_warrior',
        name: 'Quantum Warrior',
        description: 'Reality-bending fighter',
        icon: Zap,
        level: 1,
        basePrice: 55000,
        currentPrice: 55000,
        expBonus: 95,
        upgradeTime: 280000,
        category: 'legendary',
        tradingPerHour: '+25.8K'
      },
      {
        id: 'cosmic_guardian',
        name: 'Cosmic Guardian',
        description: 'Interdimensional protector',
        icon: Shield,
        level: 1,
        basePrice: 80000,
        currentPrice: 80000,
        expBonus: 120,
        upgradeTime: 320000,
        category: 'legendary',
        tradingPerHour: '+35.2K'
      },
      {
        id: 'void_hunter',
        name: 'Void Hunter',
        description: 'Dark space assassin',
        icon: Target,
        level: 1,
        basePrice: 120000,
        currentPrice: 120000,
        expBonus: 150,
        upgradeTime: 360000,
        category: 'legendary',
        tradingPerHour: '+48.5K'
      },
      {
        id: 'stellar_commander',
        name: 'Stellar Commander',
        description: 'Galactic fleet leader',
        icon: Rocket,
        level: 1,
        basePrice: 170000,
        currentPrice: 170000,
        expBonus: 185,
        upgradeTime: 400000,
        category: 'legendary',
        tradingPerHour: '+65.8K'
      },
      {
        id: 'omega_cyborg',
        name: 'Omega Cyborg',
        description: 'Ultimate evolution form',
        icon: Bot,
        level: 1,
        basePrice: 250000,
        currentPrice: 250000,
        expBonus: 225,
        upgradeTime: 450000,
        category: 'legendary',
        tradingPerHour: '+88.2K'
      },
      {
        id: 'apex_legend',
        name: 'Apex Legend',
        description: 'Mythical warrior machine',
        icon: Crown,
        level: 1,
        basePrice: 350000,
        currentPrice: 350000,
        expBonus: 275,
        upgradeTime: 500000,
        category: 'legendary',
        tradingPerHour: '+125.5K'
      },
      {
        id: 'titan_overlord',
        name: 'Titan Overlord',
        description: 'Supreme mech ruler',
        icon: Sword,
        level: 1,
        basePrice: 500000,
        currentPrice: 500000,
        expBonus: 330,
        upgradeTime: 600000,
        category: 'legendary',
        tradingPerHour: '+175.8K'
      },
      {
        id: 'infinity_prime',
        name: 'Infinity Prime',
        description: 'Beyond legendary power',
        icon: Zap,
        level: 1,
        basePrice: 1000000,
        currentPrice: 1000000,
        expBonus: 500,
        upgradeTime: 900000,
        category: 'legendary',
        tradingPerHour: '+350.2K'
      },

      // Nano Swarms (10 cards)
      {
        id: 'micro_swarm',
        name: 'Micro Swarm',
        description: 'Basic nano collective',
        icon: Target,
        level: 1,
        basePrice: 15000,
        currentPrice: 15000,
        expBonus: 40,
        upgradeTime: 150000,
        category: 'nano',
        tradingPerHour: '+9.3K'
      },
      {
        id: 'hive_cluster',
        name: 'Hive Cluster',
        description: 'Coordinated nano group',
        icon: Microscope,
        level: 1,
        basePrice: 25000,
        currentPrice: 25000,
        expBonus: 55,
        upgradeTime: 180000,
        category: 'nano',
        tradingPerHour: '+13.8K'
      },
      {
        id: 'quantum_dots',
        name: 'Quantum Dots',
        description: 'Quantum-enabled nanobots',
        icon: Gem,
        level: 1,
        basePrice: 40000,
        currentPrice: 40000,
        expBonus: 75,
        upgradeTime: 210000,
        category: 'nano',
        tradingPerHour: '+19.5K'
      },
      {
        id: 'neural_mesh',
        name: 'Neural Mesh',
        description: 'Brain-connected nano network',
        icon: Cpu,
        level: 1,
        basePrice: 65000,
        currentPrice: 65000,
        expBonus: 100,
        upgradeTime: 250000,
        category: 'nano',
        tradingPerHour: '+28.2K'
      },
      {
        id: 'smart_dust',
        name: 'Smart Dust',
        description: 'Intelligent particle cloud',
        icon: Target,
        level: 1,
        basePrice: 95000,
        currentPrice: 95000,
        expBonus: 130,
        upgradeTime: 290000,
        category: 'nano',
        tradingPerHour: '+38.8K'
      },
      {
        id: 'plasma_mites',
        name: 'Plasma Mites',
        description: 'Energy-based nano swarm',
        icon: Zap,
        level: 1,
        basePrice: 140000,
        currentPrice: 140000,
        expBonus: 165,
        upgradeTime: 330000,
        category: 'nano',
        tradingPerHour: '+52.5K'
      },
      {
        id: 'void_spores',
        name: 'Void Spores',
        description: 'Dark matter nanobots',
        icon: Microscope,
        level: 1,
        basePrice: 200000,
        currentPrice: 200000,
        expBonus: 205,
        upgradeTime: 380000,
        category: 'nano',
        tradingPerHour: '+71.8K'
      },
      {
        id: 'cosmic_mist',
        name: 'Cosmic Mist',
        description: 'Interdimensional nano cloud',
        icon: Gem,
        level: 1,
        basePrice: 300000,
        currentPrice: 300000,
        expBonus: 250,
        upgradeTime: 450000,
        category: 'nano',
        tradingPerHour: '+98.5K'
      },
      {
        id: 'omega_swarm',
        name: 'Omega Swarm',
        description: 'Ultimate nano collective',
        icon: Crown,
        level: 1,
        basePrice: 450000,
        currentPrice: 450000,
        expBonus: 300,
        upgradeTime: 520000,
        category: 'nano',
        tradingPerHour: '+135.2K'
      },
      {
        id: 'infinity_cloud',
        name: 'Infinity Cloud',
        description: 'Limitless nano matrix',
        icon: Target,
        level: 1,
        basePrice: 750000,
        currentPrice: 750000,
        expBonus: 400,
        upgradeTime: 720000,
        category: 'nano',
        tradingPerHour: '+225.8K'
      }
    ];
  });

  const categories = [
    { id: 'combat', name: 'Combat', icon: Zap },
    { id: 'defense', name: 'Defense', icon: Shield },
    { id: 'utility', name: 'Utility', icon: Gem },
    { id: 'legendary', name: 'Legendary', icon: Sword },
    { id: 'nano', name: 'Nano', icon: Target }
  ];

  // Save cards data whenever it changes
  useEffect(() => {
    saveGameData('gameCards', cards);
  }, [cards]);

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
          
          // Calculate auto-click increment and save it
          const autoClickIncrement = calculateAutoClickIncrement(card.currentPrice);
          const currentAutoClick = loadGameData('autoClickPower', 0);
          const newAutoClick = currentAutoClick + autoClickIncrement;
          saveGameData('autoClickPower', newAutoClick);
          
          // Track upgrades in localStorage
          const currentUpgrades = parseInt(localStorage.getItem('cardUpgrades') || '0');
          localStorage.setItem('cardUpgrades', (currentUpgrades + 1).toString());
          
          toast({
            description: `${card.name} upgraded! +${expGained.toLocaleString()} EXP, +${autoClickIncrement} auto-click`,
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

      {/* Fixed width navbar with equal button distribution */}
      <div className="w-full">
        <div className="flex bg-gray-900/80 p-2 rounded-xl backdrop-blur-sm border border-gray-600">
          {categories.map((category) => {
            const CategoryIcon = category.icon;
            return (
              <Button
                key={category.id}
                onClick={() => setActiveCategory(category.id as any)}
                variant="ghost"
                size="sm"
                className={`flex-1 flex flex-col items-center justify-center gap-1 rounded-lg transition-all duration-200 text-xs px-2 py-3 min-h-[60px] ${
                  activeCategory === category.id
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <CategoryIcon className="w-4 h-4 flex-shrink-0" />
                <span className="font-medium whitespace-nowrap text-[10px] sm:text-xs leading-tight">{category.name}</span>
              </Button>
            );
          })}
        </div>
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
                      <span>{formatNumber(card.currentPrice)}</span>
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
