
import React, { useState } from 'react';
import { ArrowLeft, ShieldCheck, Clock, CheckCircle, MapPin, Navigation } from 'lucide-react';
import { Button } from '../../components/Button';
import { FoodItem } from '../../../types';
import { StoreIcon } from './StoreIcon';

interface FoodDetailProps {
  item: FoodItem;
  onBack: () => void;
  onClaim: () => void;
}

export const FoodDetail: React.FC<FoodDetailProps> = ({ item, onBack, onClaim }) => {
  const [isClaiming, setIsClaiming] = useState(false);

  const handleClaimClick = () => {
    setIsClaiming(true);
    setTimeout(() => {
      setIsClaiming(false);
      onClaim();
    }, 1500);
  };

  const openExternalMap = () => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${item.location.lat},${item.location.lng}`, '_blank');
  };

  return (
    <div className="bg-[#FDFBF7] dark:bg-stone-950 min-h-screen animate-in slide-in-from-right relative z-50">
        <div className="relative h-72 md:h-80 w-full">
            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            <button 
                onClick={onBack}
                className="absolute top-4 left-4 p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-colors"
            >
                <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="absolute bottom-6 left-6 flex flex-wrap gap-2">
                <span className="bg-green-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1 backdrop-blur-sm">
                    <ShieldCheck className="w-3 h-3" /> AI Score {item.aiVerification?.halalScore}
                </span>
                <span className="bg-white/90 dark:bg-stone-900/90 text-stone-900 dark:text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                    Sisa {item.quantity}
                </span>
            </div>
        </div>

        <div className="p-6 space-y-8 max-w-3xl mx-auto -mt-6 bg-[#FDFBF7] dark:bg-stone-950 rounded-t-3xl relative">
            <div>
                <h1 className="text-3xl font-bold text-stone-900 dark:text-white leading-tight mb-2">{item.name}</h1>
                <div className="flex flex-wrap items-center gap-3 text-stone-600 dark:text-stone-400">
                    <div className="flex items-center gap-1.5 bg-stone-100 dark:bg-stone-900 px-2 py-1 rounded-md">
                        <StoreIcon className="w-4 h-4 text-orange-500" />
                        <span className="font-bold text-sm">{item.providerName}</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-md text-red-600 dark:text-red-400">
                        <Clock className="w-4 h-4" />
                        <span className="font-bold text-sm">Exp: {item.expiryTime}</span>
                    </div>
                </div>
            </div>

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
                            <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed">{item.aiVerification?.reason}</p>
                        </div>
                    </div>
                    <div className="p-4 bg-stone-50 dark:bg-stone-950/50 rounded-2xl border border-stone-100 dark:border-stone-800">
                        <p className="text-xs font-bold text-stone-500 dark:text-stone-400 mb-3 uppercase tracking-wide">Prediksi Bahan Utama</p>
                        <div className="flex flex-wrap gap-2">
                            {item.aiVerification?.ingredients?.map((ing, i) => (
                                <span key={i} className="text-sm px-3 py-1.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-700 dark:text-stone-300 font-medium">
                                    {ing}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-bold text-xl text-stone-900 dark:text-white">Lokasi Pengambilan</h3>
                </div>
                <p className="text-sm text-stone-600 dark:text-stone-400 flex items-start gap-2 bg-stone-100 dark:bg-stone-900 p-3 rounded-xl">
                    <MapPin className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" /> {item.location.address}
                </p>
                
                <div className="rounded-3xl overflow-hidden border border-stone-200 dark:border-stone-800 relative h-56 group cursor-pointer shadow-sm" onClick={openExternalMap}>
                    <iframe 
                        width="100%" 
                        height="100%" 
                        frameBorder="0" 
                        scrolling="no" 
                        marginHeight={0} 
                        marginWidth={0} 
                        src={`https://maps.google.com/maps?q=${item.location.lat},${item.location.lng}&z=15&output=embed`}
                        className="filter grayscale group-hover:grayscale-0 transition-all duration-500"
                    ></iframe>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none"></div>
                    <button className="absolute bottom-4 right-4 bg-white text-stone-900 px-5 py-2.5 rounded-full text-sm font-bold shadow-xl flex items-center gap-2 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                        <Navigation className="w-4 h-4" /> Buka Google Maps
                    </button>
                </div>
            </div>

            <div className="h-24"></div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-4 md:p-6 bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 z-50 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] md:max-w-3xl md:mx-auto md:bottom-6 md:rounded-3xl md:border md:shadow-2xl">
            <div className="flex items-center justify-between gap-6">
                <div className="hidden sm:block">
                    <p className="text-xs text-stone-500 dark:text-stone-400 font-medium uppercase tracking-wide">Metode</p>
                    <p className="text-lg font-bold text-stone-900 dark:text-white capitalize">{item.deliveryMethod}</p>
                </div>
                <Button onClick={handleClaimClick} isLoading={isClaiming} className="h-14 text-lg rounded-2xl shadow-xl shadow-orange-500/20">
                    Klaim Makanan Ini
                </Button>
            </div>
        </div>
    </div>
  );
};
