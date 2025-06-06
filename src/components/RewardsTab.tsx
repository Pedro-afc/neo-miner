
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gift, Calendar, Coins, Diamond, Star, Clock, CheckCircle, TrendingUp } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { saveGameData, loadGameData } from '@/utils/gameUtils';
import { useUserProgress } from '@/hooks/useUserProgress';

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

interface UpgradeReward {
  id: string;
  name: string;
  description: string;
  type: 'coins' | 'diamonds';
  amount: number;
  triggerLevel?: number;
  triggerUpgrades?: number;
  claimed: boolean;
  claimedAt?: number;
}

const RewardsTab = ({ gameState }: { gameState: GameState }) => {
  const { coins, setCoins, diamonds, setDiamonds, level, setExperience } = gameState;
  const { progress, claimDailyReward } = useUserProgress();
  
  const [claimedUpgradeRewards, setClaimedUpgradeRewards] = useState<string[]>(() => {
    return loadGameData('claimedUpgradeRewards', []);
  });

  const [upgradeRewardCooldowns, setUpgradeRewardCooldowns] = useState<Record<string, number>>(() => {
    return loadGameData('upgradeRewardCooldowns', {});
  });

  // Get current upgrade count
  const currentUpgrades = parseInt(localStorage.getItem('cardUpgrades') || '0');

  const upgradeRewards: UpgradeReward[] = [
    // Level-based rewards
    {
      id: 'level_2',
      name: 'First Level!',
      description: 'Reached level 2',
      type: 'coins',
      amount: 10000,
      triggerLevel: 2,
      claimed: claimedUpgradeRewards.includes('level_2'),
      claimedAt: upgradeRewardCooldowns['level_2']
    },
    {
      id: 'level_5',
      name: 'Rising Fast',
      description: 'Reached level 5',
      type: 'diamonds',
      amount: 50,
      triggerLevel: 5,
      claimed: claimedUpgradeRewards.includes('level_5'),
      claimedAt: upgradeRewardCooldowns['level_5']
    },
    {
      id: 'level_10',
      name: 'Game Master',
      description: 'Reached level 10',
      type: 'coins',
      amount: 100000,
      triggerLevel: 10,
      claimed: claimedUpgradeRewards.includes('level_10'),
      claimedAt: upgradeRewardCooldowns['level_10']
    },
    {
      id: 'level_15',
      name: 'Advanced Expert',
      description: 'Reached level 15',
      type: 'diamonds',
      amount: 100,
      triggerLevel: 15,
      claimed: claimedUpgradeRewards.includes('level_15'),
      claimedAt: upgradeRewardCooldowns['level_15']
    },
    // Upgrade-based rewards
    {
      id: 'upgrades_5',
      name: 'First Upgrades',
      description: 'Completed 10 card upgrades',
      type: 'coins',
      amount: 20000,
      triggerUpgrades: 10,
      claimed: claimedUpgradeRewards.includes('upgrades_5'),
      claimedAt: upgradeRewardCooldowns['upgrades_5']
    },
    {
      id: 'upgrades_10',
      name: 'Rookie Upgrader',
      description: 'Completed 20 card upgrades',
      type: 'diamonds',
      amount: 30,
      triggerUpgrades: 20,
      claimed: claimedUpgradeRewards.includes('upgrades_10'),
      claimedAt: upgradeRewardCooldowns['upgrades_10']
    },
    {
      id: 'upgrades_25',
      name: 'Expert Upgrader',
      description: 'Completed 50 card upgrades',
      type: 'coins',
      amount: 100000,
      triggerUpgrades: 50,
      claimed: claimedUpgradeRewards.includes('upgrades_25'),
      claimedAt: upgradeRewardCooldowns['upgrades_25']
    },
    {
      id: 'upgrades_50',
      name: 'Upgrade Master',
      description: 'Completed 100 card upgrades',
      type: 'diamonds',
      amount: 150,
      triggerUpgrades: 100,
      claimed: claimedUpgradeRewards.includes('upgrades_50'),
      claimedAt: upgradeRewardCooldowns['upgrades_50']
    },
    {
      id: 'upgrades_100',
      name: 'Upgrade Legend',
      description: 'Completed 200 card upgrades',
      type: 'coins',
      amount: 400000,
      triggerUpgrades: 200,
      claimed: claimedUpgradeRewards.includes('upgrades_100'),
      claimedAt: upgradeRewardCooldowns['upgrades_100']
    },
    {
      id: 'upgrades_250',
      name: 'Upgrade God',
      description: 'Completed 500 card upgrades',
      type: 'diamonds',
      amount: 400,
      triggerUpgrades: 500,
      claimed: claimedUpgradeRewards.includes('upgrades_250'),
      claimedAt: upgradeRewardCooldowns['upgrades_250']
    }
  ];

  // Save data to localStorage whenever it changes
  useEffect(() => {
    saveGameData('claimedUpgradeRewards', claimedUpgradeRewards);
  }, [claimedUpgradeRewards]);

  useEffect(() => {
    saveGameData('upgradeRewardCooldowns', upgradeRewardCooldowns);
  }, [upgradeRewardCooldowns]);

  // Check if upgrade reward can be claimed (12 hour cooldown)
  const canClaimUpgradeReward = (reward: UpgradeReward) => {
    if (!reward.claimedAt) return true;
    const twelveHours = 12 * 60 * 60 * 1000; // 12 hours in milliseconds
    return Date.now() - reward.claimedAt >= twelveHours;
  };

  const getUpgradeRewardCooldownTime = (reward: UpgradeReward) => {
    if (!reward.claimedAt) return 0;
    const twelveHours = 12 * 60 * 60 * 1000;
    const elapsed = Date.now() - reward.claimedAt;
    return Math.max(0, twelveHours - elapsed);
  };

  const handleClaimDailyReward = async () => {
    const result = await claimDailyReward();
    
    if (result.success && result.coins && result.diamonds) {
      // Update local state to reflect the reward
      setCoins(prev => prev + result.coins!);
      setDiamonds(prev => prev + result.diamonds!);
    } else if (result.alreadyClaimed) {
      toast({
        description: "Daily reward already claimed today!",
        variant: "destructive",
      });
    }
  };

  const claimUpgradeReward = (rewardId: string) => {
    const reward = upgradeRewards.find(r => r.id === rewardId);
    if (!reward || !canClaimUpgradeReward(reward)) return;

    // Check if requirements are met
    const levelRequirementMet = !reward.triggerLevel || level >= reward.triggerLevel;
    const upgradeRequirementMet = !reward.triggerUpgrades || currentUpgrades >= reward.triggerUpgrades;
    
    if (!levelRequirementMet || !upgradeRequirementMet) return;

    // Give reward
    if (reward.type === 'coins') {
      setCoins(prev => prev + reward.amount);
      toast({
        description: `${reward.name}! +${reward.amount.toLocaleString()} coins`,
        variant: "default",
      });
    } else {
      setDiamonds(prev => prev + reward.amount);
      toast({
        description: `${reward.name}! +${reward.amount} diamonds`,
        variant: "default",
      });
    }

    // Mark as claimed and set cooldown
    setClaimedUpgradeRewards(prev => [...prev, rewardId]);
    setUpgradeRewardCooldowns(prev => ({
      ...prev,
      [rewardId]: Date.now()
    }));
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

  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  // Check if daily reward can be claimed
  const canClaimDaily = () => {
    if (!progress?.last_daily_reward) return true;
    const today = new Date().toISOString().split('T')[0];
    return progress.last_daily_reward !== today;
  };

  return (
    <div className="space-y-4 md:space-y-6 max-w-4xl mx-auto pb-16 md:pb-20 px-3 md:px-4">
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent drop-shadow-lg">
          Rewards
        </h2>
        <p className="text-white text-sm md:text-base mt-2 font-semibold drop-shadow-md">
          Collect your daily and progress rewards
        </p>
      </div>

      {/* Stats Display */}
      <Card className="bg-gray-900/80 backdrop-blur-sm border-2 border-gray-600 p-3 md:p-4">
        <div className="grid grid-cols-3 gap-2 md:gap-4 text-center">
          <div>
            <TrendingUp className="w-5 h-5 md:w-6 md:h-6 mx-auto text-cyan-400 mb-1 md:mb-2" />
            <p className="text-xs md:text-sm text-gray-300">Upgrades Made</p>
            <p className="text-lg md:text-2xl font-bold text-cyan-400">{currentUpgrades}</p>
          </div>
          <div>
            <Star className="w-5 h-5 md:w-6 md:h-6 mx-auto text-purple-400 mb-1 md:mb-2" />
            <p className="text-xs md:text-sm text-gray-300">Current Level</p>
            <p className="text-lg md:text-2xl font-bold text-purple-400">{level}</p>
          </div>
          <div>
            <Calendar className="w-5 h-5 md:w-6 md:h-6 mx-auto text-green-400 mb-1 md:mb-2" />
            <p className="text-xs md:text-sm text-gray-300">Daily Streak</p>
            <p className="text-lg md:text-2xl font-bold text-green-400">
              {progress?.last_daily_reward ? 1 : 0}
            </p>
          </div>
        </div>
      </Card>

      {/* Daily Login Rewards */}
      <div className="space-y-3 md:space-y-4">
        <div className="flex items-center gap-2 md:gap-3 justify-center">
          <Calendar className="w-5 h-5 md:w-6 md:h-6 text-green-400 drop-shadow-lg" />
          <h3 className="text-lg md:text-xl font-bold text-white drop-shadow-lg">Daily Rewards</h3>
        </div>

        <Card className="bg-gray-900/80 backdrop-blur-sm border-2 border-gray-600 p-4 md:p-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-4 md:p-6 rounded-full bg-gradient-to-r from-green-500/20 to-blue-500/20">
                <Gift className="w-8 h-8 md:w-12 md:h-12 text-green-400 drop-shadow-lg" />
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-white text-xl md:text-2xl drop-shadow-md mb-2">
                Daily Bonus
              </h4>
              <p className="text-sm md:text-base text-gray-200 font-semibold drop-shadow-sm mb-1">
                {progress ? `${(1000 * progress.level).toLocaleString()} coins` : '1,000 coins'}
              </p>
              <p className="text-sm md:text-base text-gray-200 font-semibold drop-shadow-sm">
                {progress ? `${Math.floor(progress.level / 5) + 1} diamonds` : '1 diamond'}
              </p>
            </div>
            
            {canClaimDaily() ? (
              <Button
                onClick={handleClaimDailyReward}
                size="lg"
                className="w-full max-w-xs bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white font-bold border-0 text-base md:text-lg py-3 md:py-4"
              >
                <Gift className="w-5 h-5 md:w-6 md:h-6 mr-2" />
                CLAIM DAILY REWARD
              </Button>
            ) : (
              <div className="text-center">
                <CheckCircle className="w-6 h-6 md:w-8 md:h-8 mx-auto text-green-400 mb-2" />
                <p className="text-sm md:text-base text-green-400 font-bold">CLAIMED TODAY</p>
                <p className="text-xs md:text-sm text-gray-400 mt-1">Come back tomorrow!</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Upgrade Rewards */}
      <div className="space-y-3 md:space-y-4">
        <div className="flex items-center gap-2 md:gap-3 justify-center">
          <Star className="w-5 h-5 md:w-6 md:h-6 text-purple-400 drop-shadow-lg" />
          <h3 className="text-lg md:text-xl font-bold text-white drop-shadow-lg">Progress Rewards</h3>
        </div>

        <div className="grid grid-cols-1 gap-3 md:gap-4">
          {upgradeRewards.map((reward) => {
            const levelRequirementMet = !reward.triggerLevel || level >= reward.triggerLevel;
            const upgradeRequirementMet = !reward.triggerUpgrades || currentUpgrades >= reward.triggerUpgrades;
            const requirementsMet = levelRequirementMet && upgradeRequirementMet;
            const canClaim = requirementsMet && canClaimUpgradeReward(reward);
            const onCooldown = reward.claimedAt && !canClaimUpgradeReward(reward);
            const cooldownTime = getUpgradeRewardCooldownTime(reward);
            
            return (
              <Card 
                key={reward.id}
                className="bg-gray-900/80 backdrop-blur-sm border-2 border-gray-600 p-3 md:p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                    <div className={`p-2 md:p-3 rounded-lg flex-shrink-0 ${
                      reward.type === 'coins' ? 'bg-yellow-500/20' : 'bg-blue-500/20'
                    }`}>
                      {getRewardIcon(reward.type)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-white text-sm md:text-lg drop-shadow-md truncate">
                        {reward.name}
                      </h4>
                      <p className="text-xs md:text-sm text-gray-300 drop-shadow-sm">
                        {reward.description}
                      </p>
                      <p className="text-sm md:text-base text-gray-200 font-semibold drop-shadow-sm">
                        {reward.amount.toLocaleString()} {reward.type === 'coins' ? 'coins' : 'diamonds'}
                      </p>
                      {reward.triggerUpgrades && (
                        <p className="text-xs text-cyan-300 mt-1">
                          Progress: {Math.min(currentUpgrades, reward.triggerUpgrades)}/{reward.triggerUpgrades} upgrades
                        </p>
                      )}
                      {onCooldown && (
                        <p className="text-xs text-orange-300 mt-1">
                          Cooldown: {formatTime(cooldownTime)}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0">
                    {onCooldown ? (
                      <Badge className="bg-orange-600 text-orange-100 border-0 text-xs">
                        Waiting
                      </Badge>
                    ) : canClaim ? (
                      <Button
                        onClick={() => claimUpgradeReward(reward.id)}
                        size="sm"
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white font-bold border-0 text-xs md:text-sm"
                      >
                        <Gift className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                        Claim
                      </Button>
                    ) : (
                      <Badge variant="outline" className="border-gray-500 text-gray-400 bg-gray-800/50 text-xs">
                        {reward.triggerLevel ? `Level ${reward.triggerLevel}` : `${reward.triggerUpgrades} upgrades`}
                      </Badge>
                    )}
                  </div>
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
