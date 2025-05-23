
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gift, Calendar, Coins, Diamond, Star, Clock } from 'lucide-react';

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
  triggerLevel: number;
  claimed: boolean;
}

const RewardsTab = ({ gameState }: { gameState: GameState }) => {
  const { coins, setCoins, diamonds, setDiamonds, level, setExperience } = gameState;
  const [currentDay, setCurrentDay] = useState(1);
  const [lastClaimDate, setLastClaimDate] = useState<string | null>(null);
  
  const [dailyRewards, setDailyRewards] = useState<DailyReward[]>([
    { day: 1, type: 'coins', amount: 1000, claimed: false },
    { day: 2, type: 'coins', amount: 2000, claimed: false },
    { day: 3, type: 'diamonds', amount: 5, claimed: false },
    { day: 4, type: 'coins', amount: 5000, claimed: false },
    { day: 5, type: 'experience', amount: 50000, claimed: false },
    { day: 6, type: 'diamonds', amount: 10, claimed: false },
    { day: 7, type: 'coins', amount: 10000, claimed: false }
  ]);

  const [upgradeRewards] = useState<UpgradeReward[]>([
    {
      id: 'level_2',
      name: 'Primer Nivel!',
      description: 'Alcanzaste el nivel 2',
      type: 'coins',
      amount: 5000,
      triggerLevel: 2,
      claimed: false
    },
    {
      id: 'level_5',
      name: 'Subiendo Rápido',
      description: 'Alcanzaste el nivel 5',
      type: 'diamonds',
      amount: 25,
      triggerLevel: 5,
      claimed: false
    },
    {
      id: 'level_10',
      name: 'Maestro del Juego',
      description: 'Alcanzaste el nivel 10',
      type: 'coins',
      amount: 50000,
      triggerLevel: 10,
      claimed: false
    }
  ]);

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
        break;
      case 'diamonds':
        setDiamonds(prev => prev + reward.amount);
        break;
      case 'experience':
        setExperience(prev => prev + reward.amount);
        break;
    }

    // Mark as claimed
    setDailyRewards(prev =>
      prev.map(r => r.day === day ? { ...r, claimed: true } : r)
    );

    // Update claim date and advance day
    const today = new Date().toDateString();
    setLastClaimDate(today);
    setCurrentDay(prev => (prev % 7) + 1);
  };

  const getRewardIcon = (type: string) => {
    switch (type) {
      case 'coins':
        return <Coins className="w-5 h-5 text-yellow-400" />;
      case 'diamonds':
        return <Diamond className="w-5 h-5 text-blue-400" />;
      case 'experience':
        return <Star className="w-5 h-5 text-purple-400" />;
      default:
        return <Gift className="w-5 h-5" />;
    }
  };

  const getRewardColor = (type: string) => {
    switch (type) {
      case 'coins':
        return 'from-yellow-500/20 to-orange-500/20 border-yellow-500/30';
      case 'diamonds':
        return 'from-blue-500/20 to-cyan-500/20 border-blue-500/30';
      case 'experience':
        return 'from-purple-500/20 to-pink-500/20 border-purple-500/30';
      default:
        return 'from-gray-500/20 to-gray-600/20 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-6 max-w-md mx-auto">
      <div className="text-center">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
          Recompensas
        </h2>
        <p className="text-gray-300 text-sm mt-1">Recoge tus recompensas diarias y de progreso</p>
      </div>

      {/* Daily Login Rewards */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-green-400" />
          <h3 className="text-lg font-bold text-white">Recompensas Diarias</h3>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {dailyRewards.map((reward) => {
            const isToday = reward.day === currentDay;
            const canClaim = isToday && canClaimDaily() && !reward.claimed;
            
            return (
              <Card 
                key={reward.day}
                className={`bg-gradient-to-r ${getRewardColor(reward.type)} p-4 ${
                  isToday ? 'ring-2 ring-green-400 ring-opacity-50' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white/10">
                      {getRewardIcon(reward.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-white">Día {reward.day}</h4>
                        {isToday && (
                          <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
                            Hoy
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-300">
                        {reward.amount.toLocaleString()} {reward.type === 'coins' ? 'monedas' : 
                         reward.type === 'diamonds' ? 'diamantes' : 'experiencia'}
                      </p>
                    </div>
                  </div>
                  
                  {reward.claimed ? (
                    <Badge variant="secondary" className="bg-gray-500/20 text-gray-400">
                      Reclamado
                    </Badge>
                  ) : canClaim ? (
                    <Button
                      onClick={() => claimDailyReward(reward.day)}
                      size="sm"
                      className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400"
                    >
                      <Gift className="w-4 h-4 mr-1" />
                      Reclamar
                    </Button>
                  ) : (
                    <div className="text-center">
                      <Clock className="w-4 h-4 mx-auto text-gray-400 mb-1" />
                      <p className="text-xs text-gray-400">Esperar</p>
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
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-bold text-white">Recompensas de Progreso</h3>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {upgradeRewards.map((reward) => {
            const canClaim = level >= reward.triggerLevel && !reward.claimed;
            const isLocked = level < reward.triggerLevel;
            
            return (
              <Card 
                key={reward.id}
                className={`bg-gradient-to-r ${getRewardColor(reward.type)} p-4 ${
                  isLocked ? 'opacity-50' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white/10">
                      {getRewardIcon(reward.type)}
                    </div>
                    <div>
                      <h4 className="font-bold text-white">{reward.name}</h4>
                      <p className="text-xs text-gray-300">{reward.description}</p>
                      <p className="text-sm text-gray-300">
                        {reward.amount.toLocaleString()} {reward.type === 'coins' ? 'monedas' : 'diamantes'}
                      </p>
                    </div>
                  </div>
                  
                  {reward.claimed ? (
                    <Badge variant="secondary" className="bg-gray-500/20 text-gray-400">
                      Reclamado
                    </Badge>
                  ) : canClaim ? (
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400"
                    >
                      <Gift className="w-4 h-4 mr-1" />
                      Reclamar
                    </Button>
                  ) : (
                    <Badge variant="outline" className="border-gray-500/30 text-gray-400">
                      Nivel {reward.triggerLevel}
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
