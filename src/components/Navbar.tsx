
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, CreditCard, Gift, ShoppingBag, Plane } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Navbar = ({ activeTab, setActiveTab }: NavbarProps) => {
  const tabs = [
    { id: 'home', icon: Home, label: 'Inicio' },
    { id: 'cards', icon: CreditCard, label: 'Cartas' },
    { id: 'rewards', icon: Gift, label: 'Recompensas' },
    { id: 'shop', icon: ShoppingBag, label: 'Tienda' },
    { id: 'airdrop', icon: Plane, label: 'Airdrop' },
  ];

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/50 backdrop-blur-lg border-t border-white/10 z-50">
      <TabsList className="grid w-full grid-cols-5 bg-transparent h-16 p-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex flex-col items-center justify-center gap-1 h-full text-xs font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'text-yellow-400 bg-yellow-400/10 shadow-lg scale-105'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px]">{tab.label}</span>
            </TabsTrigger>
          );
        })}
      </TabsList>
    </div>
  );
};

export default Navbar;
