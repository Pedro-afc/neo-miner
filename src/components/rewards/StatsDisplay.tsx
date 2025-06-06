
import { Card } from "@/components/ui/card";
import { TrendingUp, Star, Calendar } from 'lucide-react';
import { UserProgress } from '@/hooks/useUserProgress';

interface StatsDisplayProps {
  currentUpgrades: number;
  level: number;
  progress: UserProgress | null;
}

const StatsDisplay = ({ currentUpgrades, level, progress }: StatsDisplayProps) => {
  return (
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
  );
};

export default StatsDisplay;
