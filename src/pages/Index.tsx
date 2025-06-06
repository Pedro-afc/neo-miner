
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GameScreen from '@/components/GameScreen';
import CardsTab from '@/components/CardsTab';
import RewardsTab from '@/components/RewardsTab';
import ShopTab from '@/components/ShopTab';
import AirdropTab from '@/components/AirdropTab';
import Navbar from '@/components/Navbar';
import UserProfile from '@/components/UserProfile';
import TelegramLogin from '@/components/TelegramLogin';
import { useTelegramAuth } from '@/hooks/useTelegramAuth';
import { useUserProgress } from '@/hooks/useUserProgress';

const Index = () => {
  const { user, isLoading, isAuthenticated, logout } = useTelegramAuth();
  const { progress, loading: progressLoading, addCoins, addDiamonds, addExperience } = useUserProgress();
  const [activeTab, setActiveTab] = useState('home');

  const handleLogin = () => {
    window.location.reload();
  };

  if (isLoading || progressLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center px-4">
        <div className="text-white text-base md:text-lg lg:text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated || !user || !progress) {
    return <TelegramLogin onLogin={handleLogin} />;
  }

  const gameState = {
    coins: progress.coins,
    setCoins: (value: number | ((prev: number) => number)) => {
      const newValue = typeof value === 'function' ? value(progress.coins) : value;
      addCoins(newValue - progress.coins);
    },
    diamonds: progress.diamonds,
    setDiamonds: (value: number | ((prev: number) => number)) => {
      const newValue = typeof value === 'function' ? value(progress.diamonds) : value;
      addDiamonds(newValue - progress.diamonds);
    },
    level: progress.level,
    experience: progress.experience,
    setExperience: (value: number | ((prev: number) => number)) => {
      const newValue = typeof value === 'function' ? value(progress.experience) : value;
      addExperience(newValue - progress.experience);
    },
    experienceRequired: progress.experience_required
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(120,119,198,0.3),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,119,198,0.3),transparent_50%)]" />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full min-h-screen pb-16 md:pb-20">
        <div className="container mx-auto px-3 md:px-6 lg:px-8 pt-4 md:pt-6 max-w-sm md:max-w-4xl lg:max-w-6xl">
          <UserProfile user={user} onLogout={logout} />
          
          <TabsContent value="home" className="mt-0">
            <GameScreen gameState={gameState} autoClickPower={progress.auto_click_power} />
          </TabsContent>
          
          <TabsContent value="cards" className="mt-0">
            <CardsTab gameState={gameState} />
          </TabsContent>
          
          <TabsContent value="rewards" className="mt-0">
            <RewardsTab gameState={gameState} />
          </TabsContent>
          
          <TabsContent value="shop" className="mt-0">
            <ShopTab gameState={gameState} telegramStars={progress.telegram_stars} />
          </TabsContent>
          
          <TabsContent value="airdrop" className="mt-0">
            <AirdropTab />
          </TabsContent>
        </div>

        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      </Tabs>
    </div>
  );
};

export default Index;
