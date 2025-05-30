
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Coins, Clock, Star, Zap } from 'lucide-react';
import { OfflineEarnings, formatOfflineTime } from '@/utils/backgroundMining';

interface OfflineEarningsModalProps {
  isOpen: boolean;
  onClose: () => void;
  earnings: OfflineEarnings;
  onClaim: () => void;
}

const OfflineEarningsModal = ({ isOpen, onClose, earnings, onClaim }: OfflineEarningsModalProps) => {
  const handleClaim = () => {
    onClaim();
    onClose();
  };

  if (earnings.coins === 0 && earnings.experience === 0) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gradient-to-br from-purple-900/95 to-blue-900/95 border-purple-500/50 text-white">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            ¡Ganancias Offline!
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 p-4">
          <div className="text-center">
            <Clock className="w-12 h-12 mx-auto text-cyan-400 mb-2" />
            <p className="text-lg text-cyan-300">
              Estuviste ausente por {formatOfflineTime(earnings.timeOffline)}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30 p-4">
              <div className="flex items-center gap-3">
                <Coins className="w-8 h-8 text-yellow-400" />
                <div>
                  <p className="text-sm text-yellow-300">Monedas</p>
                  <p className="text-xl font-bold text-yellow-400">
                    +{earnings.coins.toLocaleString()}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30 p-4">
              <div className="flex items-center gap-3">
                <Star className="w-8 h-8 text-purple-400" />
                <div>
                  <p className="text-sm text-purple-300">Experiencia</p>
                  <p className="text-xl font-bold text-purple-400">
                    +{earnings.experience.toLocaleString()}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <div className="text-center">
            <Button
              onClick={handleClaim}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold px-8 py-3 text-lg"
            >
              <Zap className="w-5 h-5 mr-2" />
              Reclamar Ganancias
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OfflineEarningsModal;
