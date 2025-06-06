
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Coins, Diamond, Zap } from 'lucide-react';
import { loadGameData, saveGameData } from '@/utils/gameUtils';
import { calculateOfflineEarnings, updateLastActiveTime } from '@/utils/backgroundMining';
import OfflineEarningsModal from './OfflineEarningsModal';

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

interface GameScreenProps {
  gameState: GameState;
  autoClickPower: number;
}

const GameScreen = ({ gameState, autoClickPower }: GameScreenProps) => {
  const { coins, setCoins, diamonds, level, experience, setExperience, experienceRequired } = gameState;
  const [clickPower, setClickPower] = useState(1);
  const [clickEffects, setClickEffects] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [totalClicks, setTotalClicks] = useState(() => loadGameData('totalClicks', 0));
  const [clicksPerMinute, setClicksPerMinute] = useState(0);
  const [clickTimes, setClickTimes] = useState<number[]>([]);
  const [showOfflineModal, setShowOfflineModal] = useState(false);
  const [offlineEarnings, setOfflineEarnings] = useState({ coins: 0, experience: 0, timeOffline: 0 });

  // Check for offline earnings on component mount
  useEffect(() => {
    const earnings = calculateOfflineEarnings();
    if (earnings.coins > 0 || earnings.experience > 0) {
      setOfflineEarnings(earnings);
      setShowOfflineModal(true);
    }
    updateLastActiveTime();
  }, []);

  // Update last active time when user interacts or leaves
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        updateLastActiveTime();
      } else {
        const earnings = calculateOfflineEarnings();
        if (earnings.coins > 0 || earnings.experience > 0) {
          setOfflineEarnings(earnings);
          setShowOfflineModal(true);
        }
      }
    };

    const handleBeforeUnload = () => {
      updateLastActiveTime();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // Update every 10 seconds when active
    const interval = setInterval(() => {
      if (!document.hidden) {
        updateLastActiveTime();
      }
    }, 10000);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      clearInterval(interval);
    };
  }, []);

  // Enhanced auto-click functionality with experience generation
  useEffect(() => {
    if (autoClickPower <= 0) return;

    const interval = setInterval(() => {
      setCoins(prev => prev + autoClickPower);
      // Generate experience from passive mining (1 exp per coin from auto-click)
      setExperience(prev => prev + autoClickPower);
      updateLastActiveTime();
      
      console.log(`Passive mining: +${autoClickPower} coins, +${autoClickPower} experience`);
    }, 1000);

    return () => clearInterval(interval);
  }, [autoClickPower, setCoins, setExperience]);

  // Calculate clicks per minute
  useEffect(() => {
    const now = Date.now();
    const recentClicks = clickTimes.filter(time => now - time < 60000);
    setClicksPerMinute(recentClicks.length);
  }, [clickTimes]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Add coins and experience
    setCoins(prev => prev + clickPower);
    setExperience(prev => prev + 1);
    
    // Update click tracking
    const newTotalClicks = totalClicks + 1;
    setTotalClicks(newTotalClicks);
    saveGameData('totalClicks', newTotalClicks);
    
    const now = Date.now();
    setClickTimes(prev => [...prev.slice(-59), now]);
    
    // Update last active time
    updateLastActiveTime();
    
    // Add click effect
    const effectId = Date.now();
    setClickEffects(prev => [...prev, { id: effectId, x, y }]);
    
    // Remove effect after animation
    setTimeout(() => {
      setClickEffects(prev => prev.filter(effect => effect.id !== effectId));
    }, 600);
  };

  const claimOfflineEarnings = () => {
    setCoins(prev => prev + offlineEarnings.coins);
    setExperience(prev => prev + offlineEarnings.experience);
    updateLastActiveTime();
  };

  const experiencePercentage = (experience / experienceRequired) * 100;

  return (
    <div className="space-y-3 md:space-y-4 lg:space-y-6 max-w-sm md:max-w-2xl lg:max-w-4xl mx-auto px-2 md:px-4">
      <OfflineEarningsModal
        isOpen={showOfflineModal}
        onClose={() => setShowOfflineModal(false)}
        earnings={offlineEarnings}
        onClaim={claimOfflineEarnings}
      />

      {/* Stats Header - Responsive Grid */}
      <div className="grid grid-cols-2 gap-2 md:gap-3 lg:gap-4">
        <Card className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30 p-2 md:p-3 lg:p-4">
          <div className="flex items-center gap-1 md:gap-2 lg:gap-3">
            <Coins className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 text-yellow-400 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-xs md:text-sm text-black font-medium">Coins</p>
              <p className="text-xs md:text-sm lg:text-base font-bold text-black truncate">{coins.toLocaleString()}</p>
            </div>
          </div>
        </Card>
        
        <Card className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-blue-500/30 p-2 md:p-3 lg:p-4">
          <div className="flex items-center gap-1 md:gap-2 lg:gap-3">
            <Diamond className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 text-blue-400 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-xs md:text-sm text-black font-medium">Diamonds</p>
              <p className="text-xs md:text-sm lg:text-base font-bold text-black truncate">{diamonds.toLocaleString()}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Level Progress - Responsive */}
      <Card className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30 p-2 md:p-3 lg:p-4">
        <div className="space-y-1 md:space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs md:text-sm text-black font-medium">Level {level}</span>
            <span className="text-xs md:text-sm text-black font-medium">{experience.toLocaleString()} / {experienceRequired.toLocaleString()}</span>
          </div>
          <Progress value={experiencePercentage} className="h-1 md:h-2 lg:h-3 bg-purple-900/50" />
        </div>
      </Card>

      {/* Main Clicker - Responsive */}
      <div className="flex flex-col items-center space-y-2 md:space-y-3 lg:space-y-4">
        <Button
          onClick={handleClick}
          className="relative w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 xl:w-48 xl:h-48 rounded-full bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 hover:from-yellow-300 hover:via-orange-400 hover:to-red-400 transform transition-all duration-150 hover:scale-105 active:scale-95 shadow-2xl border-1 md:border-2 lg:border-4 border-yellow-300/50"
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent" />
          <Zap className="w-8 h-8 md:w-12 md:h-12 lg:w-16 lg:h-16 xl:w-20 xl:h-20 text-white drop-shadow-lg" />
          
          {/* Click Effects */}
          {clickEffects.map((effect) => (
            <div
              key={effect.id}
              className="absolute pointer-events-none animate-bounce"
              style={{
                left: effect.x,
                top: effect.y,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <span className="text-yellow-300 font-bold text-sm md:text-lg lg:text-xl drop-shadow-lg animate-fade-in">
                +{clickPower}
              </span>
            </div>
          ))}
        </Button>
        
        <div className="text-center space-y-1">
          <p className="text-sm md:text-base lg:text-lg font-bold text-yellow-300">Click Power: {clickPower}</p>
          <p className="text-xs md:text-sm text-gray-300">Tap to earn coins!</p>
          {autoClickPower > 0 && (
            <p className="text-xs md:text-sm text-green-300">Auto-Mining: +{autoClickPower}/sec</p>
          )}
        </div>
      </div>

      {/* Quick Stats - Responsive Grid */}
      <div className="grid grid-cols-3 gap-1 md:gap-2 lg:gap-3 text-center text-xs md:text-sm">
        <div className="bg-white/10 rounded-lg p-1 md:p-2 lg:p-3">
          <p className="text-gray-400">Clicks/Min</p>
          <p className="font-bold text-white">{clicksPerMinute}</p>
        </div>
        <div className="bg-white/10 rounded-lg p-1 md:p-2 lg:p-3">
          <p className="text-gray-400">Total Clicks</p>
          <p className="font-bold text-white">{totalClicks.toLocaleString()}</p>
        </div>
        <div className="bg-white/10 rounded-lg p-1 md:p-2 lg:p-3">
          <p className="text-gray-400">Auto-Click</p>
          <p className="font-bold text-white">{autoClickPower}/sec</p>
        </div>
      </div>
    </div>
  );
};

export default GameScreen;
