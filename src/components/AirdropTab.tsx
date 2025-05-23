
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Plane, Calendar, Users, Trophy, Coins, CheckCircle, Clock } from 'lucide-react';

const AirdropTab = () => {
  const airdropData = {
    name: "TapCoin Airdrop",
    totalPool: "10,000,000 TAPCOIN",
    startDate: "15 Diciembre 2024",
    endDate: "15 Enero 2025",
    participants: 125847,
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
        <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Airdrop TapCoin
        </h2>
        <p className="text-gray-300 text-sm mt-1">Participa y gana tokens gratis</p>
      </div>

      {/* Airdrop Info */}
      <Card className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-cyan-500/30 p-6">
        <div className="text-center mb-4">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
            <Plane className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-white">{airdropData.name}</h3>
          <p className="text-cyan-300">Pool Total: {airdropData.totalPool}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <Calendar className="w-5 h-5 mx-auto text-cyan-400 mb-1" />
            <p className="text-xs text-gray-300">Inicio</p>
            <p className="text-sm font-bold text-white">{airdropData.startDate}</p>
          </div>
          <div className="text-center">
            <Clock className="w-5 h-5 mx-auto text-cyan-400 mb-1" />
            <p className="text-xs text-gray-300">Fin</p>
            <p className="text-sm font-bold text-white">{airdropData.endDate}</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-300">Participantes</span>
            <span className="text-white font-bold">
              {airdropData.participants.toLocaleString()} / {airdropData.maxParticipants.toLocaleString()}
            </span>
          </div>
          <Progress value={participationPercentage} className="h-2 bg-cyan-900/50" />
        </div>
      </Card>

      {/* User Status */}
      <Card className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/30 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-white">Tu Progreso</h3>
          <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
            Elegible
          </Badge>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-300">Tareas Completadas</span>
            <span className="text-white font-bold">
              {airdropData.completedTasks} / {airdropData.totalTasks}
            </span>
          </div>
          <Progress value={taskProgress} className="h-2 bg-green-900/50" />
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-300 mb-2">Tokens Estimados</p>
          <p className="text-2xl font-bold text-green-400">8,800 TAPCOIN</p>
        </div>
      </Card>

      {/* Tasks */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-400" />
          Tareas del Airdrop
        </h3>

        {tasks.map((task) => {
          const Icon = task.icon;
          return (
            <Card 
              key={task.id}
              className={`p-4 ${
                task.completed 
                  ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/30' 
                  : 'bg-gradient-to-r from-gray-500/20 to-gray-600/20 border-gray-500/30'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    task.completed ? 'bg-green-500/20' : 'bg-gray-500/20'
                  }`}>
                    <Icon className={`w-5 h-5 ${
                      task.completed ? 'text-green-400' : 'text-gray-400'
                    }`} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">{task.title}</h4>
                    <p className="text-xs text-gray-300">{task.description}</p>
                    <p className="text-xs text-yellow-400 font-medium">{task.reward}</p>
                  </div>
                </div>
                
                {task.completed ? (
                  <CheckCircle className="w-6 h-6 text-green-400" />
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
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
      <Card className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30 p-4">
        <h3 className="text-lg font-bold text-white mb-3">Próximos Pasos</h3>
        <div className="space-y-2 text-sm text-gray-300">
          <p>• Completa todas las tareas para maximizar tu recompensa</p>
          <p>• Conecta tu wallet antes del final del airdrop</p>
          <p>• Los tokens se distribuirán 30 días después del cierre</p>
          <p>• Mantente activo para futuras oportunidades</p>
        </div>
      </Card>
    </div>
  );
};

export default AirdropTab;
