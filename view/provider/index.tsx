
import React, { useState } from 'react';
import { Store, List, AlertTriangle, Star, Bell, ChevronDown, X, Info } from 'lucide-react';
import { DashboardStats } from './components/Dashboard';
import { InventoryManager } from './components/Inventory';
import { ReportsView } from './components/Reports';
import { ReviewsView } from './components/Reviews';

interface ProviderIndexProps {
  onOpenNotifications: () => void;
  isSubNavOpen: boolean;
  onToggleSubNav: () => void;
}

export const ProviderIndex: React.FC<ProviderIndexProps> = ({ onOpenNotifications, isSubNavOpen, onToggleSubNav }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'inventory' | 'reports' | 'reviews'>('dashboard');
  const [shopOpen, setShopOpen] = useState(true);

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto pb-32">
      <div 
         onClick={onToggleSubNav}
         className="sticky top-16 z-30 bg-[#FDFBF7]/95 dark:bg-stone-950/95 backdrop-blur-sm -mx-6 px-6 pt-4 pb-2 mb-6 border-b border-stone-200 dark:border-stone-800 transition-all cursor-pointer group select-none hover:bg-stone-50/50 dark:hover:bg-stone-900/50"
      >
          <div className="flex items-center justify-between mb-4 pointer-events-none">
              <div className="pointer-events-auto">
                  <div className="flex items-center gap-2">
                     <h1 className="text-lg font-bold text-stone-900 dark:text-white leading-tight">Dashboard Donatur</h1>
                     <div className={`transform transition-transform duration-300 ${isSubNavOpen ? 'rotate-180' : 'rotate-0'}`}>
                         <ChevronDown className="w-4 h-4 text-orange-500" />
                     </div>
                  </div>
                  <p className="text-xs text-stone-500 font-medium">Mitra: Restoran Berkah</p>
              </div>
              <div className="flex items-center gap-2 pointer-events-auto" onClick={(e) => e.stopPropagation()}>
                  <button onClick={() => setShopOpen(!shopOpen)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${shopOpen ? 'bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-500' : 'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-500'}`}>
                    <Store className="w-3.5 h-3.5" /> {shopOpen ? 'Buka' : 'Tutup'}
                  </button>
              </div>
          </div>
          
          <div onClick={(e) => e.stopPropagation()} className={`hidden md:flex gap-2 overflow-x-auto scrollbar-hide transition-all duration-500 ease-in-out ${isSubNavOpen ? 'max-h-20 opacity-100 pb-2' : 'max-h-0 opacity-0 overflow-hidden'}`}>
            <button onClick={() => setActiveTab('dashboard')} className={`pb-2 px-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'dashboard' ? 'border-orange-500 text-orange-500' : 'border-transparent text-stone-500'}`}><Store className="w-4 h-4" /> Dashboard</button>
            <button onClick={() => setActiveTab('inventory')} className={`pb-2 px-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'inventory' ? 'border-orange-500 text-orange-500' : 'border-transparent text-stone-500'}`}><List className="w-4 h-4" /> Inventory</button>
            <button onClick={() => setActiveTab('reports')} className={`pb-2 px-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'reports' ? 'border-orange-500 text-orange-500' : 'border-transparent text-stone-500'}`}><AlertTriangle className="w-4 h-4" /> Laporan</button>
            <button onClick={() => setActiveTab('reviews')} className={`pb-2 px-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'reviews' ? 'border-orange-500 text-orange-500' : 'border-transparent text-stone-500'}`}><Star className="w-4 h-4" /> Ulasan</button>
          </div>
      </div>

      {activeTab === 'dashboard' && <DashboardStats setActiveTab={setActiveTab} />}
      {activeTab === 'inventory' && <InventoryManager />}
      {activeTab === 'reports' && <ReportsView />}
      {activeTab === 'reviews' && <ReviewsView />}

      <div className={`md:hidden fixed bottom-[64px] left-0 right-0 bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 z-40 px-4 transition-all duration-500 ease-in-out transform overflow-hidden ${isSubNavOpen ? 'max-h-20 translate-y-0 h-14' : 'max-h-0 translate-y-full h-0 border-none'}`}>
         <div className="grid grid-cols-4 h-full items-center">
            <button onClick={() => setActiveTab('dashboard')} className={`flex flex-col items-center justify-center gap-1 transition-colors ${activeTab === 'dashboard' ? 'text-orange-600 dark:text-orange-500' : 'text-stone-400'}`}><Store className="w-5 h-5" /><span className="text-[10px] font-bold">Dash</span></button>
            <button onClick={() => setActiveTab('inventory')} className={`flex flex-col items-center justify-center gap-1 transition-colors ${activeTab === 'inventory' ? 'text-orange-600 dark:text-orange-500' : 'text-stone-400'}`}><List className="w-5 h-5" /><span className="text-[10px] font-bold">Stok</span></button>
            <button onClick={() => setActiveTab('reports')} className={`flex flex-col items-center justify-center gap-1 transition-colors ${activeTab === 'reports' ? 'text-orange-600 dark:text-orange-500' : 'text-stone-400'}`}><AlertTriangle className="w-5 h-5" /><span className="text-[10px] font-bold">Lapor</span></button>
            <button onClick={() => setActiveTab('reviews')} className={`flex flex-col items-center justify-center gap-1 transition-colors ${activeTab === 'reviews' ? 'text-orange-600 dark:text-orange-500' : 'text-stone-400'}`}><Star className="w-5 h-5" /><span className="text-[10px] font-bold">Ulas</span></button>
         </div>
      </div>
    </div>
  );
};
