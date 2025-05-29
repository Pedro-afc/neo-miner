
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gift, Calendar, Coins, Diamond, Star, Clock, CheckCircle, TrendingUp } from 'lucide-react';
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

interface DailyReward {
  day: number;
  type: 'coins' | 'diamonds' | 'experience';
  amount: number;
  claimed: boolean;
}

interface UpgradeReward {
  id: string;
  name: string;
  description: string;
  type: 'coins' | 'diamonds';
  amount: number;
  triggerLevel?: number;
  triggerUpgrades?: number;
  claimed: boolean;
}

const RewardsTab = ({ gameState }: { gameState: GameState }) => {
  const { coins, setCoins, diamonds, setDiamonds, level, setExperience } = gameState;
  
  // Load persistent data from localStorage
  const [dailyRewards, setDailyRewards] = useState<DailyReward[]>(() => {
    const saved = localStorage.getItem('dailyRewards');
    return saved ? JSON.parse(saved) : [
      { day: 1, type: 'coins', amount: 1000, claimed: false },
      { day: 2, type: 'coins', amount: 2000, claimed: false },
      { day: 3, type: 'diamonds', amount: 5, claimed: false },
      { day: 4, type: 'coins', amount: 5000, claimed: false },
      { day: 5, type: 'experience', amount: 50000, claimed: false },
      { day: 6, type: 'diamonds', amount: 10, claimed: false },
      { day: 7, type: 'coins', amount: 10000, claimed: false }
    ];
  });

  const [currentDay, setCurrentDay] = useState(() => {
    return parseInt(localStorage.getItem('currentDay') || '1');
  });

  const [lastClaimDate, setLastClaimDate] = useState<string | null>(() => {
    return localStorage.getItem('lastClaimDate');
  });

  const [claimedUpgradeRewards, setClaimedUpgradeRewards] = useState<string[]>(() => {
    const saved = localStorage.getItem('claimedUpgradeRewards');
    return saved ? JSON.parse(saved) : [];
  });

  // Get current upgrade count
  const currentUpgrades = parseInt(localStorage.getItem('cardUpgrades') || '0');

  const upgradeRewards: UpgradeReward[] = [
    // Level-based rewards
    {
      id: 'level_2',
      name: 'Primer Nivel!',
      description: 'Alcanzaste el nivel 2',
      type: 'coins',
      amount: 5000,
      triggerLevel: 2,
      claimed: claimedUpgradeRewards.includes('level_2')
    },
    {
      id: 'level_5',
      name: 'Subiendo Rápido',
      description: 'Alcanzaste el nivel 5',
      type: 'diamonds',
      amount: 25,
      triggerLevel: 5,
      claimed: claimedUpgradeRewards.includes('level_5')
    },
    {
      id: 'level_10',
      name: 'Maestro del Juego',
      description: 'Alcanzaste el nivel 10',
      type: 'coins',
      amount: 50000,
      triggerLevel: 10,
      claimed: claimedUpgradeRewards.includes('level_10')
    },
    {
      id: 'level_15',
      name: 'Experto Avanzado',
      description: 'Alcanzaste el nivel 15',
      type: 'diamonds',
      amount: 50,
      triggerLevel: 15,
      claimed: claimedUpgradeRewards.includes('level_15')
    },
    // Upgrade-based rewards
    {
      id: 'upgrades_5',
      name: 'Primeras Mejoras',
      description: 'Realizaste 5 mejoras de cartas',
      type: 'coins',
      amount: 10000,
      triggerUpgrades: 5,
      claimed: claimedUpgradeRewards.includes('upgrades_5')
    },
    {
      id: 'upgrades_10',
      name: 'Mejorador Novato',
      description: 'Realizaste 10 mejoras de cartas',
      type: 'diamonds',
      amount: 15,
      triggerUpgrades: 10,
      claimed: claimedUpgradeRewards.includes('upgrades_10')
    },
    {
      id: 'upgrades_25',
      name: 'Mejorador Experto',
      description: 'Realizaste 25 mejoras de cartas',
      type: 'coins',
      amount: 50000,
      triggerUpgrades: 25,
      claimed: claimedUpgradeRewards.includes('upgrades_25')
    },
    {
      id: 'upgrades_50',
      name: 'Maestro de Mejoras',
      description: 'Realizaste 50 mejoras de cartas',
      type: 'diamonds',
      amount: 75,
      triggerUpgrades: 50,
      claimed: claimedUpgradeRewards.includes('upgrades_50')
    },
    {
      id: 'upgrades_100',
      name: 'Leyenda de Mejoras',
      description: 'Realizaste 100 mejoras de cartas',
      type: 'coins',
      amount: 200000,
      triggerUpgrades: 100,
      claimed: claimedUpgradeRewards.includes('upgrades_100')
    },
    {
      id: 'upgrades_250',
      name: 'Dios de las Mejoras',
      description: 'Realizaste 250 mejoras de cartas',
      type: 'diamonds',
      amount: 200,
      triggerUpgrades: 250,
      claimed: claimedUpgradeRewards.includes('upgrades_250')
    }
  ];

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('dailyRewards', JSON.stringify(dailyRewards));
  }, [dailyRewards]);

  useEffect(() => {
    localStorage.setItem('currentDay', currentDay.toString());
  }, [currentDay]);

  useEffect(() => {
    if (lastClaimDate) {
      localStorage.setItem('lastClaimDate', lastClaimDate);
    }
  }, [lastClaimDate]);

  useEffect(() => {
    localStorage.setItem('claimedUpgradeRewards', JSON.stringify(claimedUpgradeRewards));
  }, [claimedUpgradeRewards]);

  // Check if daily reward can be claimed
  const canClaimDaily = () => {
    const today = new Date().toDateString();
    return lastClaimDate !== today;
  };

  const claimDailyReward = (day: number) => {
    if (!canClaimDaily()) return;

    const reward = dailyRewards.find(r => r.day === day && !r.claimed);
    if (!reward) return;

    // Give reward
    switch (reward.type) {
      case 'coins':
        setCoins(prev => prev + reward.amount);
        toast({
          description: `¡+${reward.amount.toLocaleString()} monedas reclamadas!`,
          variant: "default",
        });
        break;
      case 'diamonds':
        setDiamonds(prev => prev + reward.amount);
        toast({
          description: `¡+${reward.amount} diamantes reclamados!`,
          variant: "default",
        });
        break;
      case 'experience':
        setExperience(prev => prev + reward.amount);
        toast({
          description: `¡+${reward.amount.toLocaleString()} experiencia reclamada!`,
          variant: "default",
        });
        break;
    }

    // Mark as claimed and save
    setDailyRewards(prev =>
      prev.map(r => r.day === day ? { ...r, claimed: true } : r)
    );

    // Update claim date and advance day
    const today = new Date().toDateString();
    setLastClaimDate(today);
    setCurrentDay(prev => (prev % 7) + 1);
  };

  const claimUpgradeReward = (rewardId: string) => {
    const reward = upgradeRewards.find(r => r.id === rewardId);
    if (!reward || reward.claimed) return;

    // Check if requirements are met
    const levelRequirementMet = !reward.triggerLevel || level >= reward.triggerLevel;
    const upgradeRequirementMet = !reward.triggerUpgrades || currentUpgrades >= reward.triggerUpgrades;
    
    if (!levelRequirementMet || !upgradeRequirementMet) return;

    // Give reward
    if (reward.type === 'coins') {
      setCoins(prev => prev + reward.amount);
      toast({
        description: `¡${reward.name}! +${reward.amount.toLocaleString()} monedas`,
        variant: "default",
      });
    } else {
      setDiamonds(prev => prev + reward.amount);
      toast({
        description: `¡${reward.name}! +${reward.amount} diamantes`,
        variant: "default",
      });
    }

    // Mark as claimed
    setClaimedUpgradeRewards(prev => [...prev, rewardId]);
  };

  const getRewardIcon = (type: string) => {
    switch (type) {
      case 'coins':
        return <Coins className="w-6 h-6 text-yellow-400 drop-shadow-lg" />;
      case 'diamonds':
        return <Diamond className="w-6 h-6 text-blue-400 drop-shadow-lg" />;
      case 'experience':
        return <Star className="w-6 h-6 text-purple-400 drop-shadow-lg" />;
      default:
        return <Gift className="w-6 h-6 text-white" />;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-20">
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent drop-shadow-lg">
          Recompensas
        </h2>
        <p className="text-white text-base mt-2 font-semibold drop-shadow-md">Recoge tus recompensas diarias y de progreso</p>
      </div>

      {/* Stats Display */}
      <Card className="bg-gray-900/80 backdrop-blur-sm border-2 border-gray-600 p-4">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <TrendingUp className="w-6 h-6 mx-auto text-cyan-400 mb-2" />
            <p className="text-sm text-gray-300">Mejoras Realizadas</p>
            <p className="text-2xl font-bold text-cyan-400">{currentUpgrades}</p>
          </div>
          <div>
            <Star className="w-6 h-6 mx-auto text-purple-400 mb-2" />
            <p className="text-sm text-gray-300">Nivel Actual</p>
            <p className="text-2xl font-bold text-purple-400">{level}</p>
          </div>
        </div>
      </Card>

      {/* Daily Login Rewards */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 justify-center">
          <Calendar className="w-6 h-6 text-green-400 drop-shadow-lg" />
          <h3 className="text-xl font-bold text-white drop-shadow-lg">Recompensas Diarias</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {dailyRewards.map((reward) => {
            const isToday = reward.day === currentDay;
            const canClaim = isToday && canClaimDaily() && !reward.claimed;
            
            return (
              <Card 
                key={reward.day}
                className={`bg-gray-900/80 backdrop-blur-sm border-2 p-4 relative overflow-hidden ${
                  isToday ? 'border-green-400 ring-2 ring-green-400/50' : 'border-gray-600'
                } ${reward.claimed ? 'opacity-75' : ''}`}
              >
                <div className="text-center space-y-3">
                  <div className="flex justify-center">
                    <div className={`p-3 rounded-full ${
                      reward.type === 'coins' ? 'bg-yellow-500/20' :
                      reward.type === 'diamonds' ? 'bg-blue-500/20' : 'bg-purple-500/20'
                    }`}>
                      {getRewardIcon(reward.type)}
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <h4 className="font-bold text-white text-lg drop-shadow-md">Día {reward.day}</h4>
                      {isToday && (
                        <Badge className="bg-green-500 text-white border-0 text-xs font-bold">
                          HOY
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-200 font-semibold drop-shadow-sm">
                      {reward.amount.toLocaleString()} {reward.type === 'coins' ? 'monedas' : 
                       reward.type === 'diamonds' ? 'diamantes' : 'exp'}
                    </p>
                  </div>
                  
                  {reward.claimed ? (
                    <div className="flex items-center justify-center gap-1">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-xs text-green-400 font-bold">RECLAMADO</span>
                    </div>
                  ) : canClaim ? (
                    <Button
                      onClick={() => claimDailyReward(reward.day)}
                      size="sm"
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white font-bold border-0"
                    >
                      <Gift className="w-4 h-4 mr-1" />
                      RECLAMAR
                    </Button>
                  ) : (
                    <div className="text-center">
                      <Clock className="w-5 h-5 mx-auto text-gray-400 mb-1" />
                      <p className="text-xs text-gray-400 font-medium">Esperar</p>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Upgrade Rewards */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 justify-center">
          <Star className="w-6 h-6 text-purple-400 drop-shadow-lg" />
          <h3 className="text-xl font-bold text-white drop-shadow-lg">Recompensas de Progreso</h3>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {upgradeRewards.map((reward) => {
            const levelRequirementMet = !reward.triggerLevel || level >= reward.triggerLevel;
            const upgradeRequirementMet = !reward.triggerUpgrades || currentUpgrades >= reward.triggerUpgrades;
            const canClaim = levelRequirementMet && upgradeRequirementMet && !reward.claimed;
            const isLocked = !levelRequirementMet && !upgradeRequirementMet;
            
            return (
              <Card 
                key={reward.id}
                className={`bg-gray-900/80 backdrop-blur-sm border-2 border-gray-600 p-4 ${
                  isLocked ? 'opacity-60' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${
                      reward.type === 'coins' ? 'bg-yellow-500/20' : 'bg-blue-500/20'
                    }`}>
                      {getRewardIcon(reward.type)}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-lg drop-shadow-md">{reward.name}</h4>
                      <p className="text-sm text-gray-300 drop-shadow-sm">{reward.description}</p>
                      <p className="text-base text-gray-200 font-semibold drop-shadow-sm">
                        {reward.amount.toLocaleString()} {reward.type === 'coins' ? 'monedas' : 'diamantes'}
                      </p>
                      {reward.triggerUpgrades && (
                        <p className="text-xs text-cyan-300 mt-1">
                          Progreso: {Math.min(currentUpgrades, reward.triggerUpgrades)}/{reward.triggerUpgrades} mejoras
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {reward.claimed ? (
                    <Badge className="bg-gray-600 text-gray-300 border-0">
                      Reclamado
                    </Badge>
                  ) : canClaim ? (
                    <Button
                      onClick={() => claimUpgradeReward(reward.id)}
                      size="sm"
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white font-bold border-0"
                    >
                      <Gift className="w-4 h-4 mr-1" />
                      Reclamar
                    </Button>
                  ) : (
                    <Badge variant="outline" className="border-gray-500 text-gray-400 bg-gray-800/50">
                      {reward.triggerLevel ? `Nivel ${reward.triggerLevel}` : `${reward.triggerUpgrades} mejoras`}
                    </Badge>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RewardsTab;
