
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Star, Zap, Sparkles } from 'lucide-react';
import { toast } from "@/hooks/use-toast";

interface StarAccelerationButtonProps {
  cardId: string;
  cardName: string;
  telegramStars: number;
  onAccelerate: (cardId: string, costInStars: number) => void;
  isOnCooldown: boolean;
}

const StarAccelerationButton = ({ 
  cardId, 
  cardName, 
  telegramStars, 
  onAccelerate, 
  isOnCooldown 
}: StarAccelerationButtonProps) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const starCost = 1; // Cost 1 star to reduce cooldown by 50%
  
  const canAccelerate = telegramStars >= starCost && isOnCooldown;

  const handleAccelerate = () => {
    if (!canAccelerate) return;
    
    setIsAnimating(true);
    onAccelerate(cardId, starCost);
    
    toast({
      description: `${cardName} accelerated with star! -50% cooldown time`,
      variant: "default",
    });

    // Reset animation after 1 second
    setTimeout(() => {
      setIsAnimating(false);
    }, 1000);
  };

  if (!isOnCooldown) return null;

  return (
    <Button
      onClick={handleAccelerate}
      disabled={!canAccelerate}
      size="sm"
      className={`relative overflow-hidden transition-all duration-300 min-h-[36px] md:min-h-[40px] text-xs md:text-sm ${
        canAccelerate 
          ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-white shadow-lg' 
          : 'bg-gray-600 cursor-not-allowed text-gray-400'
      } ${isAnimating ? 'animate-pulse scale-110' : ''}`}
    >
      {/* Star particles animation */}
      {isAnimating && (
        <>
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <Sparkles
                key={i}
                className={`absolute w-2 h-2 md:w-3 md:h-3 text-yellow-300 animate-ping opacity-75`}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${i * 100}ms`,
                }}
              />
            ))}
          </div>
        </>
      )}
      
      <Star className="w-2 h-2 md:w-3 md:h-3 mr-1" />
      <Zap className="w-2 h-2 md:w-3 md:h-3 mr-1" />
      <span className="text-xs font-bold">
        {starCost} ⭐
      </span>
    </Button>
  );
};

export default StarAccelerationButton;
