
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Coins, Diamond, Zap } from 'lucide-react';
import { loadGameData, saveGameData } from '@/utils/gameUtils';
import { calculateOfflineEarnings, updateLastActiveTime } from '@/utils/backgroundMining';
import { useOptimisticProgress } from '@/hooks/useOptimisticProgress';
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
  const { level, experienceRequired } = gameState;
  const [clickPower, setClickPower] = useState(1);
  const [clickEffects, setClickEffects] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [totalClicks, setTotalClicks] = useState(() => loadGameData('totalClicks', 0));
  const [clicksPerMinute, setClicksPerMinute] = useState(0);
  const [clickTimes, setClickTimes] = useState<number[]>([]);
  const [showOfflineModal, setShowOfflineModal] = useState(false);
  const [offlineEarnings, setOfflineEarnings] = useState({ coins: 0, experience: 0, timeOffline: 0 });

  // Use optimistic updates for immediate UI feedback
  const { addOptimisticUpdate, getOptimisticValue, hasPendingUpdates } = useOptimisticProgress(
    { 
      coins: gameState.coins, 
      diamonds: gameState.diamonds, 
      experience: gameState.experience,
      level,
      experienceRequired
    } as any,
    async (updates) => {
      if (updates.coins !== undefined) {
        gameState.setCoins(gameState.coins + updates.coins);
      }
      if (updates.diamonds !== undefined) {
        gameState.setDiamonds(gameState.diamonds + updates.diamonds);
      }
      if (updates.experience !== undefined) {
        gameState.setExperience(gameState.experience + updates.experience);
      }
    }
  );

  // Get optimistic values for display
  const coins = getOptimisticValue('coins');
  const diamonds = getOptimisticValue('diamonds');
  const experience = getOptimisticValue('experience');

  // Check for offline earnings on component mount
  useEffect(() => {
    const currentUpgrades = parseInt(localStorage.getItem('cardUpgrades') || '0');
    if (currentUpgrades > 0) {
      const earnings = calculateOfflineEarnings();
      if (earnings.coins > 0 || earnings.experience > 0) {
        setOfflineEarnings(earnings);
        setShowOfflineModal(true);
      }
    }
    updateLastActiveTime();
  }, []);

  // Update last active time when user interacts or leaves
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        updateLastActiveTime();
      } else {
        const currentUpgrades = parseInt(localStorage.getItem('cardUpgrades') || '0');
        if (currentUpgrades > 0) {
          const earnings = calculateOfflineEarnings();
          if (earnings.coins > 0 || earnings.experience > 0) {
            setOfflineEarnings(earnings);
            setShowOfflineModal(true);
          }
        }
      }
    };

    const handleBeforeUnload = () => {
      updateLastActiveTime();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);
    
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

  // Enhanced auto-click functionality with optimistic updates
  useEffect(() => {
    if (autoClickPower <= 0) return;

    const interval = setInterval(() => {
      addOptimisticUpdate('coins', autoClickPower);
      addOptimisticUpdate('experience', autoClickPower);
      updateLastActiveTime();
      
      console.log(`Passive mining: +${autoClickPower} coins, +${autoClickPower} experience`);
    }, 1000);

    return () => clearInterval(interval);
  }, [autoClickPower, addOptimisticUpdate]);

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
    
    // Use optimistic updates for immediate feedback
    addOptimisticUpdate('coins', clickPower);
    addOptimisticUpdate('experience', 1);
    
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
    addOptimisticUpdate('coins', offlineEarnings.coins);
    addOptimisticUpdate('experience', offlineEarnings.experience);
    updateLastActiveTime();
  };

  const experiencePercentage = (experience / experienceRequired) * 100;

  return (
    <div className="w-full min-h-screen flex flex-col px-2 sm:px-4 py-2 sm:py-4 space-y-2 sm:space-y-3">
      <OfflineEarningsModal
        isOpen={showOfflineModal}
        onClose={() => setShowOfflineModal(false)}
        earnings={offlineEarnings}
        onClaim={claimOfflineEarnings}
      />

      {/* Stats Header - Full width responsive grid */}
      <div className="grid grid-cols-2 gap-2 w-full">
        <Card className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30 p-2 sm:p-3">
          <div className="flex items-center gap-1 sm:gap-2">
            <Coins className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-black font-medium">Coins</p>
              <p className={`text-sm sm:text-base font-bold text-black truncate ${hasPendingUpdates ? 'text-green-600' : ''}`}>
                {coins.toLocaleString()}
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-blue-500/30 p-2 sm:p-3">
          <div className="flex items-center gap-1 sm:gap-2">
            <Diamond className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-black font-medium">Diamonds</p>
              <p className="text-sm sm:text-base font-bold text-black truncate">{diamonds.toLocaleString()}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Level Progress - Full width */}
      <Card className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30 p-2 sm:p-3 w-full">
        <div className="space-y-1 sm:space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs sm:text-sm text-black font-medium">Level {level}</span>
            <span className="text-xs sm:text-sm text-black font-medium">{experience.toLocaleString()} / {experienceRequired.toLocaleString()}</span>
          </div>
          <Progress value={experiencePercentage} className="h-2 sm:h-3 bg-purple-900/50" />
        </div>
      </Card>

      {/* Main Clicker - Takes remaining space, fully responsive */}
      <div className="flex-1 flex flex-col items-center justify-center space-y-2 sm:space-y-4 min-h-0">
        <Button
          onClick={handleClick}
          className="relative w-24 h-24 xs:w-28 xs:h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 xl:w-56 xl:h-56 rounded-full bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 hover:from-yellow-300 hover:via-orange-400 hover:to-red-400 transform transition-all duration-150 hover:scale-105 active:scale-95 shadow-2xl border-2 sm:border-4 border-yellow-300/50 max-w-[min(80vw,80vh)]"
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent" />
          <Zap className="w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 text-white drop-shadow-lg" />
          
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
              <span className="text-yellow-300 font-bold text-sm sm:text-lg md:text-xl drop-shadow-lg animate-fade-in">
                +{clickPower}
              </span>
            </div>
          ))}
        </Button>
        
        <div className="text-center space-y-1">
          <p className="text-sm sm:text-base md:text-lg font-bold text-yellow-300">Click Power: {clickPower}</p>
          <p className="text-xs sm:text-sm text-gray-300">Tap to earn coins!</p>
          {autoClickPower > 0 && (
            <p className="text-xs sm:text-sm text-green-300">Auto-Mining: +{autoClickPower}/sec</p>
          )}
        </div>
      </div>

      {/* Quick Stats - Full width at bottom */}
      <div className="grid grid-cols-3 gap-1 sm:gap-2 text-center text-xs sm:text-sm w-full">
        <div className="bg-white/10 rounded-lg p-2">
          <p className="text-gray-400">Clicks/Min</p>
          <p className="font-bold text-white">{clicksPerMinute}</p>
        </div>
        <div className="bg-white/10 rounded-lg p-2">
          <p className="text-gray-400">Total Clicks</p>
          <p className="font-bold text-white">{totalClicks.toLocaleString()}</p>
        </div>
        <div className="bg-white/10 rounded-lg p-2">
          <p className="text-gray-400">Auto-Click</p>
          <p className="font-bold text-white">{autoClickPower}/sec</p>
        </div>
      </div>
    </div>
  );
};

export default GameScreen;
