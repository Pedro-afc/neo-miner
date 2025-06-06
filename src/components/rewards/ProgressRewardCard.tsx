
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gift, Coins, Diamond, Star } from 'lucide-react';
import { UpgradeReward } from './types';

interface ProgressRewardCardProps {
  reward: UpgradeReward;
  currentUpgrades: number;
  level: number;
  onClaimReward: (rewardId: string) => void;
  canClaimUpgradeReward: (reward: UpgradeReward) => boolean;
  getUpgradeRewardCooldownTime: (reward: UpgradeReward) => number;
  formatTime: (ms: number) => string;
}

const ProgressRewardCard = ({
  reward,
  currentUpgrades,
  level,
  onClaimReward,
  canClaimUpgradeReward,
  getUpgradeRewardCooldownTime,
  formatTime
}: ProgressRewardCardProps) => {
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

  const levelRequirementMet = !reward.triggerLevel || level >= reward.triggerLevel;
  const upgradeRequirementMet = !reward.triggerUpgrades || currentUpgrades >= reward.triggerUpgrades;
  const requirementsMet = levelRequirementMet && upgradeRequirementMet;
  const canClaim = requirementsMet && canClaimUpgradeReward(reward);
  const onCooldown = reward.claimedAt && !canClaimUpgradeReward(reward);
  const cooldownTime = getUpgradeRewardCooldownTime(reward);

  return (
    <Card className="bg-gray-900/80 backdrop-blur-sm border-2 border-gray-600 p-3 md:p-4">
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
              onClick={() => onClaimReward(reward.id)}
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
};

export default ProgressRewardCard;
