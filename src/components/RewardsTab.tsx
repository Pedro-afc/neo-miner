
import { useUserProgress } from '@/hooks/useUserProgress';
import { GameState } from './rewards/types';
import StatsDisplay from './rewards/StatsDisplay';
import DailyRewardCard from './rewards/DailyRewardCard';
import ProgressRewardsList from './rewards/ProgressRewardsList';

const RewardsTab = ({ gameState }: { gameState: GameState }) => {
  const { progress, claimDailyReward } = useUserProgress();
  
  // Get current upgrade count
  const currentUpgrades = parseInt(localStorage.getItem('cardUpgrades') || '0');

  const handleClaimDailyReward = async () => {
    await claimDailyReward();
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
      <StatsDisplay 
        currentUpgrades={currentUpgrades}
        level={gameState.level}
        progress={progress}
      />

      {/* Daily Login Rewards */}
      <DailyRewardCard 
        progress={progress}
        onClaimDailyReward={handleClaimDailyReward}
      />

      {/* Progress Rewards */}
      <ProgressRewardsList 
        gameState={gameState}
        currentUpgrades={currentUpgrades}
      />
    </div>
  );
};

export default RewardsTab;
