
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GameScreen from '@/components/GameScreen';
import CardsTab from '@/components/CardsTab';
import RewardsTab from '@/components/RewardsTab';
import ShopTab from '@/components/ShopTab';
import AirdropTab from '@/components/AirdropTab';
import Navbar from '@/components/Navbar';
import { Home, CreditCard, Gift, ShoppingBag, Plane } from 'lucide-react';

const Index = () => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(120,119,198,0.3),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,119,198,0.3),transparent_50%)]" />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full min-h-screen pb-20">
        <div className="container mx-auto px-4 pt-6">
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
