
import React, { useState } from 'react';
import { Bell, ShieldCheck, Clock, Navigation, Search, Info } from 'lucide-react';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { EmptyState } from '../../common/EmptyState';
import { FoodItem } from '../../../types';
import { StoreIcon } from './StoreIcon';

interface FoodListProps {
  onOpenNotifications: () => void;
  onSelectItem: (item: FoodItem) => void;
  foodItems: FoodItem[];
}

export const FoodList: React.FC<FoodListProps> = ({ onOpenNotifications, onSelectItem, foodItems }) => {
  const [filterMethod, setFilterMethod] = useState<'all' | 'pickup' | 'delivery'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFood = foodItems.filter(item => {
      const matchesMethod = filterMethod === 'all' || item.deliveryMethod === filterMethod;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.providerName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesMethod && matchesSearch;
  });

  const openExternalMap = (lat: number, lng: number) => {
     window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, '_blank');
  };

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto pb-32">
      <header className="mb-6 flex justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold text-stone-900 dark:text-white">Makanan di Sekitarmu</h1>
          <p className="text-stone-500 dark:text-stone-400 mt-1">Temukan surplus makanan halal terdekat.</p>
        </div>
        <button onClick={onOpenNotifications} className="p-3 text-stone-500 hover:text-orange-500 transition-colors bg-white dark:bg-stone-900 rounded-full shadow-sm border border-stone-100 dark:border-stone-800">
            <Bell className="w-6 h-6" />
        </button>
      </header>

      {/* Search Bar */}
      <div className="mb-6">
        <Input 
            label="" 
            placeholder="Cari makanan atau nama toko..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search className="w-5 h-5 text-stone-400" />}
            className="bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800"
        />
      </div>

      <div className="mb-8 flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0">
         {['all', 'pickup', 'delivery'].map(method => (
             <button 
                key={method}
                onClick={() => setFilterMethod(method as any)}
                className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap capitalize ${filterMethod === method ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-800'}`}
             >
                {method === 'all' ? 'Semua' : method === 'pickup' ? 'Ambil Sendiri' : 'Diantar Relawan'}
             </button>
         ))}
      </div>

      <div className="space-y-6">
        {filteredFood.length === 0 && (
           <EmptyState 
             icon={Info} 
             title="Tidak Ada Makanan" 
             description={searchQuery ? `Tidak ditemukan makanan dengan kata kunci "${searchQuery}".` : "Belum ada donasi makanan yang tersedia sesuai filter ini."}
           />
        )}
        {filteredFood.map((item) => (
          <div key={item.id} className="bg-white dark:bg-stone-900 rounded-3xl overflow-hidden border border-stone-200 dark:border-stone-800 hover:border-orange-500/50 transition-all shadow-sm group">
            <div className="relative h-56 md:h-64">
              <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
              
              <div className="absolute top-4 right-4 bg-white/95 dark:bg-stone-950/90 px-3 py-1.5 rounded-full text-xs font-bold text-orange-600 dark:text-orange-500 border border-orange-500/20 backdrop-blur-md shadow-sm">
                Sisa {item.quantity}
              </div>
              
              <div className="absolute bottom-4 left-4 bg-green-500/90 px-3 py-1.5 rounded-full text-xs font-bold text-white dark:text-stone-950 flex items-center gap-1.5 backdrop-blur-md shadow-lg">
                 <ShieldCheck className="w-3.5 h-3.5" /> AI Score {item.aiVerification?.halalScore}
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-3 gap-4">
                <div>
                  <h3 className="text-xl font-bold text-stone-900 dark:text-white leading-tight mb-1">{item.name}</h3>
                  <p className="text-stone-500 dark:text-stone-400 text-sm font-medium flex items-center gap-1">
                      <StoreIcon className="w-3.5 h-3.5" /> {item.providerName}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <div className={`text-xs px-2.5 py-1 rounded-lg font-bold uppercase tracking-wide inline-block ${item.deliveryMethod === 'delivery' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20' : 'bg-amber-50 text-amber-600 dark:bg-amber-900/20'}`}>
                    {item.deliveryMethod}
                  </div>
                  <div className="flex items-center text-stone-400 text-xs gap-1 justify-end mt-1.5 font-medium">
                    <Clock className="w-3 h-3" /> {item.expiryTime}
                  </div>
                </div>
              </div>
              
              <p className="text-stone-600 dark:text-stone-400 text-sm mb-6 line-clamp-2 leading-relaxed">{item.description}</p>
              
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="rounded-xl border-stone-200 dark:border-stone-800" onClick={() => openExternalMap(item.location.lat, item.location.lng)}>
                  <Navigation className="w-4 h-4 mr-2" /> Peta
                </Button>
                <Button onClick={() => onSelectItem(item)} className="rounded-xl shadow-lg shadow-orange-500/20">
                   Detail
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
