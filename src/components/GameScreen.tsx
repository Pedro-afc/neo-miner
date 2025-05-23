
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Coins, Diamond, Zap } from 'lucide-react';

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
}

const GameScreen = ({ gameState }: GameScreenProps) => {
  const { coins, setCoins, diamonds, level, experience, setExperience, experienceRequired } = gameState;
  const [clickPower, setClickPower] = useState(1);
  const [clickEffects, setClickEffects] = useState<Array<{ id: number; x: number; y: number }>>([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Add coins and experience
    setCoins(prev => prev + clickPower);
    setExperience(prev => prev + clickPower * 100);
    
    // Add click effect
    const effectId = Date.now();
    setClickEffects(prev => [...prev, { id: effectId, x, y }]);
    
    // Remove effect after animation
    setTimeout(() => {
      setClickEffects(prev => prev.filter(effect => effect.id !== effectId));
    }, 600);
  };

  const experiencePercentage = (experience / experienceRequired) * 100;

  return (
    <div className="space-y-6 max-w-md mx-auto">
      {/* Stats Header */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30 p-4">
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-yellow-400" />
            <div>
              <p className="text-xs text-yellow-300">Monedas</p>
              <p className="text-lg font-bold text-yellow-100">{coins.toLocaleString()}</p>
            </div>
          </div>
        </Card>
        
        <Card className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-blue-500/30 p-4">
          <div className="flex items-center gap-2">
            <Diamond className="w-5 h-5 text-blue-400" />
            <div>
              <p className="text-xs text-blue-300">Diamantes</p>
              <p className="text-lg font-bold text-blue-100">{diamonds.toLocaleString()}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Level Progress */}
      <Card className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30 p-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-purple-300">Nivel {level}</span>
            <span className="text-xs text-purple-400">{experience.toLocaleString()} / {experienceRequired.toLocaleString()}</span>
          </div>
          <Progress value={experiencePercentage} className="h-2 bg-purple-900/50" />
        </div>
      </Card>

      {/* Main Clicker */}
      <div className="flex flex-col items-center space-y-4">
        <Button
          onClick={handleClick}
          className="relative w-48 h-48 rounded-full bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 hover:from-yellow-300 hover:via-orange-400 hover:to-red-400 transform transition-all duration-150 hover:scale-105 active:scale-95 shadow-2xl border-4 border-yellow-300/50"
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent" />
          <Zap className="w-16 h-16 text-white drop-shadow-lg" />
          
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
              <span className="text-yellow-300 font-bold text-xl drop-shadow-lg animate-fade-in">
                +{clickPower}
              </span>
            </div>
          ))}
        </Button>
        
        <div className="text-center">
          <p className="text-lg font-bold text-yellow-300">Poder de Click: {clickPower}</p>
          <p className="text-sm text-gray-300">¡Toca para ganar monedas!</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-2 text-center text-sm">
        <div className="bg-white/5 rounded-lg p-2">
          <p className="text-gray-400">Clicks/Min</p>
          <p className="font-bold">0</p>
        </div>
        <div className="bg-white/5 rounded-lg p-2">
          <p className="text-gray-400">Total Clicks</p>
          <p className="font-bold">0</p>
        </div>
        <div className="bg-white/5 rounded-lg p-2">
          <p className="text-gray-400">Auto-Click</p>
          <p className="font-bold">0/seg</p>
        </div>
      </div>
    </div>
  );
};

export default GameScreen;
