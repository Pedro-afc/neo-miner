
import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { saveGameData, loadGameData } from '@/utils/gameUtils';
import { UpgradeReward, GameState } from './types';
import ProgressRewardCard from './ProgressRewardCard';

interface ProgressRewardsListProps {
  gameState: GameState;
  currentUpgrades: number;
}

const ProgressRewardsList = ({ gameState, currentUpgrades }: ProgressRewardsListProps) => {
  const { coins, setCoins, diamonds, setDiamonds, level } = gameState;
  
  const [claimedUpgradeRewards, setClaimedUpgradeRewards] = useState<string[]>(() => {
    return loadGameData('claimedUpgradeRewards', []);
  });

  const [upgradeRewardCooldowns, setUpgradeRewardCooldowns] = useState<Record<string, number>>(() => {
    return loadGameData('upgradeRewardCooldowns', {});
  });

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

  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
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

  return (
    <div className="space-y-3 md:space-y-4">
      <div className="flex items-center gap-2 md:gap-3 justify-center">
        <Star className="w-5 h-5 md:w-6 md:h-6 text-purple-400 drop-shadow-lg" />
        <h3 className="text-lg md:text-xl font-bold text-white drop-shadow-lg">Progress Rewards</h3>
      </div>

      <div className="grid grid-cols-1 gap-3 md:gap-4">
        {upgradeRewards.map((reward) => (
          <ProgressRewardCard
            key={reward.id}
            reward={reward}
            currentUpgrades={currentUpgrades}
            level={level}
            onClaimReward={claimUpgradeReward}
            canClaimUpgradeReward={canClaimUpgradeReward}
            getUpgradeRewardCooldownTime={getUpgradeRewardCooldownTime}
            formatTime={formatTime}
          />
        ))}
      </div>
    </div>
  );
};

export default ProgressRewardsList;
