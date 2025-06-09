
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, CreditCard, Gift, ShoppingBag, Plane } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Navbar = ({ activeTab, setActiveTab }: NavbarProps) => {
  const tabs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'cards', icon: CreditCard, label: 'Cards' },
    { id: 'rewards', icon: Gift, label: 'Rewards' },
    { id: 'shop', icon: ShoppingBag, label: 'Shop' },
    { id: 'airdrop', icon: Plane, label: 'Airdrop' },
  ];

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/70 backdrop-blur-lg border-t border-white/10 z-50">
      <TabsList className="grid w-full grid-cols-5 bg-transparent h-12 sm:h-14 md:h-16 p-0.5 sm:p-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex flex-col items-center justify-center gap-0.5 sm:gap-1 h-full text-xs font-medium transition-all duration-200 min-h-[44px] px-1 ${
                activeTab === tab.id
                  ? 'text-yellow-400 bg-yellow-400/10 shadow-lg scale-105'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 flex-shrink-0" />
              <span className="text-[9px] sm:text-[10px] md:text-xs leading-none truncate max-w-full">{tab.label}</span>
            </TabsTrigger>
          );
        })}
      </TabsList>
    </div>
  );
};

export default Navbar;
