
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Gift, Calendar, CheckCircle } from 'lucide-react';
import { UserProgress } from '@/hooks/useUserProgress';

interface DailyRewardCardProps {
  progress: UserProgress | null;
  onClaimDailyReward: () => void;
}

const DailyRewardCard = ({ progress, onClaimDailyReward }: DailyRewardCardProps) => {
  const canClaimDaily = () => {
    if (!progress?.last_daily_reward) return true;
    const today = new Date().toISOString().split('T')[0];
    return progress.last_daily_reward !== today;
  };

  return (
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
              onClick={onClaimDailyReward}
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
  );
};

export default DailyRewardCard;
