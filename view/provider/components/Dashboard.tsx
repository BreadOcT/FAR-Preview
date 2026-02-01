
import React, { useState } from 'react';
import { Trophy, TrendingUp, Leaf, Info, AlertTriangle, Star, X } from 'lucide-react';

interface ProviderRank {
    id: number;
    name: string;
    minPoints: number;
    description: string;
}

// Helper Chart Component
const SimpleBarChart = ({ data, colorClass }: { data: number[], colorClass: string }) => {
  const max = Math.max(...data, 10);
  return (
    <div className="flex items-end gap-2 h-24 mt-4">
      {data.map((val, idx) => (
        <div key={idx} className="flex-1 flex flex-col justify-end group relative">
          <div 
            className={`w-full rounded-t-md transition-all duration-500 ${colorClass}`} 
            style={{ height: `${(val / max) * 100}%`, minHeight: '4px' }}
          ></div>
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-stone-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
            {val}
          </div>
        </div>
      ))}
    </div>
  );
};

export const DashboardStats: React.FC<{setActiveTab: (t: any) => void}> = ({setActiveTab}) => {
  const [showRankDetails, setShowRankDetails] = useState(false);

  const PROVIDER_RANKS: ProviderRank[] = [
      { id: 1, name: "Donatur Pemula", minPoints: 0, description: "Langkah awal berbagi kebaikan." },
      { id: 2, name: "Sahabat Pangan", minPoints: 500, description: "Konsisten menyelamatkan makanan." },
      { id: 3, name: "Pahlawan Lingkungan", minPoints: 1500, description: "Dampak nyata pada pengurangan limbah." },
      { id: 4, name: "Juragan Berkah", minPoints: 3000, description: "Penyedia utama bagi komunitas." },
      { id: 5, name: "Sultan Donasi", minPoints: 5000, description: "Kontribusi luar biasa dan inspiratif." },
      { id: 6, name: "The Food Savior", minPoints: 10000, description: "Legenda penyelamat pangan." }
  ];

  const currentStats = {
      points: 2450,
      currentRank: "Pahlawan Lingkungan",
      nextRank: "Juragan Berkah",
      progress: 63,
      weeklyMeals: [25, 30, 45, 32, 28, 40, 38],
      co2Reduced: 156.4
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="bg-gradient-to-br from-orange-500 to-amber-600 rounded-3xl p-6 md:p-8 text-white shadow-xl shadow-orange-500/20 relative overflow-hidden group">
         <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl transform translate-x-10 -translate-y-10"></div>
         
         <div className="flex justify-between items-start mb-6 relative z-10">
            <div className="flex items-center gap-4">
               <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30 shadow-inner">
                  <Trophy className="w-8 h-8 text-white" />
               </div>
               <div>
                  <p className="text-orange-100 text-xs font-bold uppercase tracking-widest mb-1">
                      Level {PROVIDER_RANKS.find(r => r.name === currentStats.currentRank)?.id}
                  </p>
                  <h2 className="text-2xl md:text-3xl font-bold leading-tight">{currentStats.currentRank}</h2>
               </div>
            </div>
            <button 
                onClick={() => setShowRankDetails(true)}
                className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors text-white backdrop-blur-md"
            >
                <Info className="w-5 h-5" />
            </button>
         </div>

         <div className="relative z-10 mt-4">
            <div className="flex justify-between text-sm mb-2 text-orange-50 font-medium">
               <span>Menuju: {currentStats.nextRank}</span>
               <span>{currentStats.progress}%</span>
            </div>
            <div className="w-full bg-black/20 rounded-full h-3 overflow-hidden backdrop-blur-sm border border-white/10">
               <div className="bg-white h-full rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]" style={{width: `${currentStats.progress}%`}}></div>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <button onClick={() => setActiveTab('reports')} className="p-5 bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-100 dark:border-red-900/30 flex items-center gap-4 hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-800 flex items-center justify-center text-red-600 dark:text-red-200"><AlertTriangle className="w-6 h-6" /></div>
            <div className="text-left"><p className="text-sm font-medium text-stone-500">Laporan Masuk</p><p className="text-xl font-bold text-stone-900 dark:text-white">2 Masalah</p></div>
         </button>
         <button onClick={() => setActiveTab('reviews')} className="p-5 bg-yellow-50 dark:bg-yellow-900/10 rounded-2xl border border-yellow-100 dark:border-yellow-900/30 flex items-center gap-4 hover:bg-yellow-100 dark:hover:bg-yellow-900/20 transition-colors">
            <div className="w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-800 flex items-center justify-center text-yellow-600 dark:text-yellow-200"><Star className="w-6 h-6" /></div>
            <div className="text-left"><p className="text-sm font-medium text-stone-500">Rating Toko</p><p className="text-xl font-bold text-stone-900 dark:text-white">4.8/5.0</p></div>
         </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col justify-between">
             <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400"><TrendingUp className="w-5 h-5" /></div><span className="text-base font-bold text-stone-600 dark:text-stone-400">Total Poin</span></div>
             </div>
             <div>
                <p className="text-5xl font-extrabold text-stone-900 dark:text-white mb-2">{currentStats.points.toLocaleString()}</p>
                <p className="text-sm text-stone-500">Poin akumulatif</p>
                <div className="mt-4">
                    <p className="text-xs font-bold text-stone-500 uppercase">Aktivitas Mingguan</p>
                    <SimpleBarChart data={currentStats.weeklyMeals} colorClass="bg-indigo-500" />
                </div>
             </div>
        </div>
        <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col justify-between">
             <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400"><Leaf className="w-5 h-5" /></div><span className="text-base font-bold text-stone-600 dark:text-stone-400">Dampak</span></div>
             </div>
             <div>
                <div className="flex items-baseline gap-2"><p className="text-5xl font-extrabold text-stone-900 dark:text-white mb-2">{currentStats.co2Reduced}</p><span className="text-lg font-bold text-stone-400">kg</span></div>
                <p className="text-sm text-stone-500">Jejak Karbon (CO2)</p>
                <div className="mt-4 p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
                    <p className="text-emerald-800 dark:text-emerald-300 text-sm font-medium text-center">Setara menanam 12 pohon 🌳</p>
                </div>
             </div>
        </div>
      </div>

      {showRankDetails && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
           <div className="bg-white dark:bg-stone-900 rounded-3xl w-full max-w-md max-h-[80vh] flex flex-col relative shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-stone-100 dark:border-stone-800 flex justify-between items-center bg-stone-50/50 dark:bg-stone-900/50 backdrop-blur-sm z-10">
                <div>
                    <h3 className="text-lg font-bold text-stone-900 dark:text-white">Level Donatur</h3>
                    <p className="text-xs text-stone-500 dark:text-stone-400">Tingkatkan dampak sosial anda</p>
                </div>
                <button onClick={() => setShowRankDetails(false)} className="p-2 bg-stone-100 dark:bg-stone-800 rounded-full text-stone-500 hover:text-stone-900 dark:hover:text-white transition-colors">
                <X className="w-5 h-5" />
                </button>
            </div>
            <div className="overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-stone-300 dark:scrollbar-thumb-stone-700">
              {PROVIDER_RANKS.map((rank) => {
                  const isCurrent = rank.name === currentStats.currentRank;
                  return (
                    <div key={rank.id} className={`flex items-center gap-4 p-4 rounded-2xl border transition-colors ${isCurrent ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-500 dark:border-orange-500' : 'bg-white dark:bg-stone-900 border-stone-100 dark:border-stone-800'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${isCurrent ? 'bg-orange-500 text-white' : 'bg-stone-100 dark:bg-stone-800 text-stone-500'}`}>
                            {rank.id}
                        </div>
                        <div className="flex-1">
                            <span className={`text-sm font-bold block ${isCurrent ? 'text-orange-700 dark:text-orange-400' : 'text-stone-900 dark:text-white'}`}>{rank.name}</span>
                            <span className="text-xs text-stone-500 dark:text-stone-400">{rank.description}</span>
                        </div>
                        <div className="text-right">
                            <span className="text-xs font-bold text-stone-900 dark:text-white">{rank.minPoints.toLocaleString()}</span>
                            <span className="text-[10px] block text-stone-400">pts</span>
                        </div>
                    </div>
                  )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
