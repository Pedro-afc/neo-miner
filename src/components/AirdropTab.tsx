
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Plane, Calendar, Users, Trophy, Coins, CheckCircle, Clock } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const AirdropTab = () => {
  // Fetch real user count from profiles table
  const { data: userCount = 0 } = useQuery({
    queryKey: ['user-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.error('Error fetching user count:', error);
        return 0;
      }
      
      return count || 0;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const airdropData = {
    name: "TapCoin Airdrop",
    totalPool: "21M TAPCOIN",
    startDate: "1 Julio 2025",
    endDate: "Pendiente",
    participants: userCount,
    maxParticipants: 1000000,
    userEligible: true,
    completedTasks: 3,
    totalTasks: 6
  };

  const tasks = [
    {
      id: 1,
      title: "Únete al canal de Telegram",
      description: "Síguenos en nuestro canal oficial",
      reward: "500 TAPCOIN",
      completed: true,
      icon: Users
    },
    {
      id: 2,
      title: "Alcanza Nivel 5",
      description: "Llega al nivel 5 en el juego",
      reward: "1,000 TAPCOIN",
      completed: true,
      icon: Trophy
    },
    {
      id: 3,
      title: "Invita 3 amigos",
      description: "Refiere a 3 amigos al juego",
      reward: "2,000 TAPCOIN",
      completed: true,
      icon: Users
    },
    {
      id: 4,
      title: "Acumula 100,000 monedas",
      description: "Gana un total de 100,000 monedas",
      reward: "1,500 TAPCOIN",
      completed: false,
      icon: Coins
    },
    {
      id: 5,
      title: "Mejora 10 cartas",
      description: "Realiza 10 mejoras de cartas",
      reward: "800 TAPCOIN",
      completed: false,
      icon: Trophy
    },
    {
      id: 6,
      title: "Conecta tu wallet",
      description: "Conecta tu wallet para recibir tokens",
      reward: "3,000 TAPCOIN",
      completed: false,
      icon: CheckCircle
    }
  ];

  const participationPercentage = (airdropData.participants / airdropData.maxParticipants) * 100;
  const taskProgress = (airdropData.completedTasks / airdropData.totalTasks) * 100;

  return (
    <div className="space-y-6 max-w-md mx-auto">
      <div className="text-center">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent drop-shadow-lg">
          Airdrop TapCoin
        </h2>
        <p className="text-cyan-100 text-sm mt-1 font-semibold drop-shadow-md">Participa y gana tokens gratis</p>
      </div>

      {/* Airdrop Info */}
      <Card className="bg-gradient-to-r from-cyan-500/30 to-blue-500/30 border-cyan-500/50 p-6 backdrop-blur-md">
        <div className="text-center mb-4">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
            <Plane className="w-8 h-8 text-white drop-shadow-lg" />
          </div>
          <h3 className="text-xl font-bold text-white drop-shadow-md">{airdropData.name}</h3>
          <p className="text-cyan-100 font-semibold drop-shadow-md">Pool Total: {airdropData.totalPool}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center bg-black/20 rounded-lg p-3 backdrop-blur-sm">
            <Calendar className="w-5 h-5 mx-auto text-cyan-300 mb-1 drop-shadow-lg" />
            <p className="text-xs text-cyan-100 font-medium">Inicio</p>
            <p className="text-sm font-bold text-white drop-shadow-md">{airdropData.startDate}</p>
          </div>
          <div className="text-center bg-black/20 rounded-lg p-3 backdrop-blur-sm">
            <Clock className="w-5 h-5 mx-auto text-cyan-300 mb-1 drop-shadow-lg" />
            <p className="text-xs text-cyan-100 font-medium">Fin</p>
            <p className="text-sm font-bold text-white drop-shadow-md">{airdropData.endDate}</p>
          </div>
        </div>

        <div className="space-y-2 bg-black/20 rounded-lg p-3 backdrop-blur-sm">
          <div className="flex justify-between text-sm">
            <span className="text-cyan-100 font-medium drop-shadow-sm">Participantes</span>
            <span className="text-white font-bold drop-shadow-md">
              {airdropData.participants.toLocaleString()} / {airdropData.maxParticipants.toLocaleString()}
            </span>
          </div>
          <Progress value={participationPercentage} className="h-2 bg-cyan-900/50" />
        </div>
      </Card>

      {/* User Status */}
      <Card className="bg-gradient-to-r from-green-500/30 to-emerald-500/30 border-green-500/50 p-4 backdrop-blur-md">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-white drop-shadow-md">Tu Progreso</h3>
          <Badge className="bg-green-500/30 text-green-100 border-green-400/50 font-semibold">
            Elegible
          </Badge>
        </div>
        
        <div className="space-y-2 mb-4 bg-black/20 rounded-lg p-3 backdrop-blur-sm">
          <div className="flex justify-between text-sm">
            <span className="text-green-100 font-medium drop-shadow-sm">Tareas Completadas</span>
            <span className="text-white font-bold drop-shadow-md">
              {airdropData.completedTasks} / {airdropData.totalTasks}
            </span>
          </div>
          <Progress value={taskProgress} className="h-2 bg-green-900/50" />
        </div>

        <div className="text-center bg-black/20 rounded-lg p-3 backdrop-blur-sm">
          <p className="text-sm text-green-100 mb-2 font-medium drop-shadow-sm">Tokens Estimados</p>
          <p className="text-2xl font-bold text-yellow-300 drop-shadow-lg">Pendiente</p>
        </div>
      </Card>

      {/* Tasks */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2 drop-shadow-md">
          <Trophy className="w-5 h-5 text-yellow-400 drop-shadow-lg" />
          Tareas del Airdrop
        </h3>

        {tasks.map((task) => {
          const Icon = task.icon;
          return (
            <Card 
              key={task.id}
              className={`p-4 backdrop-blur-md ${
                task.completed 
                  ? 'bg-gradient-to-r from-green-500/30 to-emerald-500/30 border-green-500/50' 
                  : 'bg-gradient-to-r from-gray-500/30 to-gray-600/30 border-gray-500/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg backdrop-blur-sm ${
                    task.completed ? 'bg-green-500/30' : 'bg-gray-500/30'
                  }`}>
                    <Icon className={`w-5 h-5 drop-shadow-lg ${
                      task.completed ? 'text-green-300' : 'text-gray-300'
                    }`} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm drop-shadow-md">{task.title}</h4>
                    <p className="text-xs text-gray-100 drop-shadow-sm">{task.description}</p>
                    <p className="text-xs text-yellow-300 font-medium drop-shadow-sm">{task.reward}</p>
                  </div>
                </div>
                
                {task.completed ? (
                  <CheckCircle className="w-6 h-6 text-green-300 drop-shadow-lg" />
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-cyan-500/50 text-cyan-200 hover:bg-cyan-500/20 backdrop-blur-sm bg-black/20 font-semibold"
                  >
                    Completar
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Next Steps */}
      <Card className="bg-gradient-to-r from-purple-500/30 to-pink-500/30 border-purple-500/50 p-4 backdrop-blur-md">
        <h3 className="text-lg font-bold text-white mb-3 drop-shadow-md">Próximos Pasos</h3>
        <div className="space-y-2 text-sm text-gray-100 bg-black/20 rounded-lg p-3 backdrop-blur-sm">
          <p className="drop-shadow-sm">• Completa todas las tareas para maximizar tu recompensa</p>
          <p className="drop-shadow-sm">• Conecta tu wallet antes del final del airdrop</p>
          <p className="drop-shadow-sm">• Los tokens se distribuirán 30 días después del cierre</p>
          <p className="drop-shadow-sm">• Mantente activo para futuras oportunidades</p>
        </div>
      </Card>
    </div>
  );
};

export default AirdropTab;
