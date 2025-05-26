
import { useState, useEffect } from 'react';
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

const Index = () => {
  const { user, isLoading, isAuthenticated, logout } = useTelegramAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [coins, setCoins] = useState(0);
  const [diamonds, setDiamonds] = useState(10);
  const [level, setLevel] = useState(1);
  const [experience, setExperience] = useState(0);
  const [experienceRequired, setExperienceRequired] = useState(300000);

  // Calculate level progression
  useEffect(() => {
    if (experience >= experienceRequired) {
      setLevel(prev => prev + 1);
      setExperience(0);
      setExperienceRequired(prev => prev * 2);
    }
  }, [experience, experienceRequired]);

  const gameState = {
    coins,
    setCoins,
    diamonds,
    setDiamonds,
    level,
    experience,
    setExperience,
    experienceRequired
  };

  const handleLogin = () => {
    // The useTelegramAuth hook handles the login automatically
    // This function exists for cases where manual login might be needed
    window.location.reload();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Cargando...</div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <TelegramLogin onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(120,119,198,0.3),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,119,198,0.3),transparent_50%)]" />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full min-h-screen pb-20">
        <div className="container mx-auto px-4 pt-6">
          <UserProfile user={user} onLogout={logout} />
          
          <TabsContent value="home" className="mt-0">
            <GameScreen gameState={gameState} />
          </TabsContent>
          
          <TabsContent value="cards" className="mt-0">
            <CardsTab gameState={gameState} />
          </TabsContent>
          
          <TabsContent value="rewards" className="mt-0">
            <RewardsTab gameState={gameState} />
          </TabsContent>
          
          <TabsContent value="shop" className="mt-0">
            <ShopTab gameState={gameState} />
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
