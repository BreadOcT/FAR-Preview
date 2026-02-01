import React, { useState } from 'react';
import { MapPin, Clock, Navigation, Filter, Bell, ArrowLeft, Star, Info, CheckCircle, ShieldCheck } from 'lucide-react';
import { Button } from './Button';
import { FoodItem } from '../types';

interface ReceiverDashboardProps {
  onOpenNotifications: () => void;
  onNavigateToHistory: () => void;
}

export const ReceiverDashboard: React.FC<ReceiverDashboardProps> = ({ onOpenNotifications, onNavigateToHistory }) => {
  // Mock Data
  const nearbyFood: FoodItem[] = [
    {
      id: '1',
      name: 'Roti Manis Assorted',
      description: 'Sisa produksi hari ini, masih sangat layak. Berbagai rasa coklat dan keju.',
      quantity: '10 Pcs',
      expiryTime: '21:00',
      imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=2072&auto=format&fit=crop',
      providerName: 'Bakery Lestari',
      location: { lat: -6.914744, lng: 107.609810, address: 'Jl. Lengkong Besar No. 45' },
      status: 'available',
      deliveryMethod: 'pickup',
      aiVerification: { 
        isEdible: true, 
        reason: 'Tekstur terlihat lembut, tidak ada jamur, kemasan utuh.', 
        halalScore: 98,
        ingredients: ['Tepung Terigu', 'Telur', 'Gula', 'Ragi', 'Coklat']
      }
    },
    {
      id: '2',
      name: 'Nasi Box Ayam Bakar',
      description: 'Kelebihan pesanan catering rapat. Ayam bakar madu dengan lalapan.',
      quantity: '5 Box',
      expiryTime: '19:00',
      imageUrl: 'https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?q=80&w=2080&auto=format&fit=crop',
      providerName: 'Catering Bu Hajjah',
      location: { lat: -6.920000, lng: 107.610000, address: 'Jl. Burangrang No. 10' },
      status: 'available',
      deliveryMethod: 'delivery',
      aiVerification: { 
        isEdible: true, 
        reason: 'Dikemas rapi, baru dimasak 2 jam lalu.', 
        halalScore: 100,
        ingredients: ['Ayam', 'Nasi', 'Kecap Manis', 'Sambal', 'Timun']
      }
    }
  ];

  const [selectedItem, setSelectedItem] = useState<FoodItem | null>(null);
  const [filterMethod, setFilterMethod] = useState<'all' | 'pickup' | 'delivery'>('all');
  const [isClaiming, setIsClaiming] = useState(false);

  const handleClaim = () => {
    setIsClaiming(true);
    // Simulate API Call
    setTimeout(() => {
        setIsClaiming(false);
        // Navigate to History page
        onNavigateToHistory();
    }, 1500);
  };

  const openExternalMap = (lat: number, lng: number) => {
     window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, '_blank');
  };

  if (selectedItem) {
    // --- DETAIL VIEW ---
    return (
      <div className="bg-[#FDFBF7] dark:bg-stone-950 min-h-screen animate-in slide-in-from-right relative z-50">
        {/* Header Image */}
        <div className="relative h-72 md:h-80 w-full">
            <img src={selectedItem.imageUrl} alt={selectedItem.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            <button 
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 left-4 p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-colors"
            >
                <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="absolute bottom-6 left-6 flex flex-wrap gap-2">
                <span className="bg-green-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1 backdrop-blur-sm">
                    <ShieldCheck className="w-3 h-3" /> AI Score {selectedItem.aiVerification?.halalScore}
                </span>
                <span className="bg-white/90 dark:bg-stone-900/90 text-stone-900 dark:text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                    Sisa {selectedItem.quantity}
                </span>
            </div>
        </div>

        <div className="p-6 space-y-8 max-w-3xl mx-auto -mt-6 bg-[#FDFBF7] dark:bg-stone-950 rounded-t-3xl relative">
            {/* Title & Provider */}
            <div>
                <h1 className="text-3xl font-bold text-stone-900 dark:text-white leading-tight mb-2">{selectedItem.name}</h1>
                <div className="flex flex-wrap items-center gap-3 text-stone-600 dark:text-stone-400">
                    <div className="flex items-center gap-1.5 bg-stone-100 dark:bg-stone-900 px-2 py-1 rounded-md">
                        <StoreIcon className="w-4 h-4 text-orange-500" />
                        <span className="font-bold text-sm">{selectedItem.providerName}</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-md text-red-600 dark:text-red-400">
                        <Clock className="w-4 h-4" />
                        <span className="font-bold text-sm">Exp: {selectedItem.expiryTime}</span>
                    </div>
                </div>
            </div>

            {/* AI Analysis Section */}
            <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm">
                <h3 className="font-bold text-lg text-stone-900 dark:text-white mb-4 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png" className="w-4 h-4" alt="AI" />
                    </div>
                    Analisis Kualitas AI
                </h3>
                <div className="space-y-4">
                    <div className="flex items-start gap-4">
                        <CheckCircle className="w-6 h-6 text-green-500 mt-0.5 shrink-0" />
                        <div>
                            <p className="text-base font-bold text-stone-900 dark:text-white mb-1">Layak Konsumsi</p>
                            <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed">{selectedItem.aiVerification?.reason}</p>
                        </div>
                    </div>
                    <div className="p-4 bg-stone-50 dark:bg-stone-950/50 rounded-2xl border border-stone-100 dark:border-stone-800">
                        <p className="text-xs font-bold text-stone-500 dark:text-stone-400 mb-3 uppercase tracking-wide">Prediksi Bahan Utama</p>
                        <div className="flex flex-wrap gap-2">
                            {selectedItem.aiVerification?.ingredients?.map((ing, i) => (
                                <span key={i} className="text-sm px-3 py-1.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-700 dark:text-stone-300 font-medium">
                                    {ing}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Location & Map Embed */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-bold text-xl text-stone-900 dark:text-white">Lokasi Pengambilan</h3>
                </div>
                <p className="text-sm text-stone-600 dark:text-stone-400 flex items-start gap-2 bg-stone-100 dark:bg-stone-900 p-3 rounded-xl">
                    <MapPin className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" /> {selectedItem.location.address}
                </p>
                
                <div className="rounded-3xl overflow-hidden border border-stone-200 dark:border-stone-800 relative h-56 group cursor-pointer shadow-sm" onClick={() => openExternalMap(selectedItem.location.lat, selectedItem.location.lng)}>
                    <iframe 
                        width="100%" 
                        height="100%" 
                        frameBorder="0" 
                        scrolling="no" 
                        marginHeight={0} 
                        marginWidth={0} 
                        src={`https://maps.google.com/maps?q=${selectedItem.location.lat},${selectedItem.location.lng}&z=15&output=embed`}
                        className="filter grayscale group-hover:grayscale-0 transition-all duration-500"
                    ></iframe>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none"></div>
                    <button className="absolute bottom-4 right-4 bg-white text-stone-900 px-5 py-2.5 rounded-full text-sm font-bold shadow-xl flex items-center gap-2 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                        <Navigation className="w-4 h-4" /> Buka Google Maps
                    </button>
                </div>
            </div>

            {/* Spacer for Sticky Bottom */}
            <div className="h-24"></div>
        </div>

        {/* Sticky Bottom Action */}
        <div className="fixed bottom-0 left-0 right-0 p-4 md:p-6 bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 z-50 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] md:max-w-3xl md:mx-auto md:bottom-6 md:rounded-3xl md:border md:shadow-2xl">
            <div className="flex items-center justify-between gap-6">
                <div className="hidden sm:block">
                    <p className="text-xs text-stone-500 dark:text-stone-400 font-medium uppercase tracking-wide">Metode</p>
                    <p className="text-lg font-bold text-stone-900 dark:text-white capitalize">{selectedItem.deliveryMethod}</p>
                </div>
                <Button onClick={handleClaim} isLoading={isClaiming} className="h-14 text-lg rounded-2xl shadow-xl shadow-orange-500/20">
                    Klaim Makanan Ini
                </Button>
            </div>
        </div>
      </div>
    );
  }

  // --- LIST VIEW (Default) ---

  const filteredFood = nearbyFood.filter(item => filterMethod === 'all' || item.deliveryMethod === filterMethod);

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto">
      <header className="mb-8 flex justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold text-stone-900 dark:text-white">Makanan di Sekitarmu</h1>
          <p className="text-stone-500 dark:text-stone-400 mt-1">Temukan surplus makanan halal terdekat.</p>
        </div>
        <button onClick={onOpenNotifications} className="p-3 text-stone-500 hover:text-orange-500 transition-colors bg-white dark:bg-stone-900 rounded-full shadow-sm border border-stone-100 dark:border-stone-800">
            <Bell className="w-6 h-6" />
        </button>
      </header>

      {/* Filter Bar (Scrollable on Mobile) */}
      <div className="mb-8 flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0">
         <button 
           onClick={() => setFilterMethod('all')}
           className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${filterMethod === 'all' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-800'}`}
         >
           Semua
         </button>
         <button 
           onClick={() => setFilterMethod('pickup')}
           className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${filterMethod === 'pickup' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-800'}`}
         >
           Ambil Sendiri
         </button>
         <button 
           onClick={() => setFilterMethod('delivery')}
           className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${filterMethod === 'delivery' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-800'}`}
         >
           Diantar Relawan
         </button>
      </div>

      <div className="space-y-6">
        {filteredFood.length === 0 && (
           <div className="text-center py-16 text-stone-400">
               <Info className="w-12 h-12 mx-auto mb-3 opacity-50" />
               Tidak ada makanan yang sesuai filter.
           </div>
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
                <Button onClick={() => setSelectedItem(item)} className="rounded-xl shadow-lg shadow-orange-500/20">
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

const StoreIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7"/></svg>
);