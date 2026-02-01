
import React, { useState } from 'react';
import { Trophy, TrendingUp, Flame, Gift, CheckCircle, Award, MapPin, Clock, Info, X } from 'lucide-react';
import { RankLevel, DailyQuest } from '../../../types';

interface StatsDashboardProps {
    stats: {
        points: number;
        missionsCompleted: number;
        totalDistance: number;
        hoursContributed: number;
        currentRank: string;
        nextRank: string;
        progressToNext: number;
        weeklyActivity: number[];
    };
    ranks: RankLevel[];
    quests: DailyQuest[];
}

// Helper Chart Component
const ActivityChart = ({ data }: { data: number[] }) => {
  const max = Math.max(...data, 1);
  const days = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
  
  return (
    <div className="flex items-end gap-2 h-32 mt-4 pt-4 border-t border-stone-100 dark:border-stone-800">
      {data.map((val, idx) => (
        <div key={idx} className="flex-1 flex flex-col justify-end group relative h-full">
           <div className="relative w-full flex-1 flex items-end">
              <div 
                className="w-full bg-orange-500 rounded-t-sm transition-all duration-500 hover:bg-orange-400" 
                style={{ height: `${(val / max) * 100}%`, minHeight: '4px' }}
              ></div>
           </div>
           <p className="text-[10px] text-center text-stone-400 mt-1">{days[idx]}</p>
           <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-stone-800 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
             {val} Misi
           </div>
        </div>
      ))}
    </div>
  );
};

export const StatsDashboard: React.FC<StatsDashboardProps> = ({ stats, ranks, quests }) => {
  const [showRankDetails, setShowRankDetails] = useState(false);

  return (
    <div className="space-y-4 mb-8 animate-in slide-in-from-top-4">
       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Rank Card */}
          <div className="bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl p-5 text-white shadow-lg shadow-orange-500/20 relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-10 -translate-y-10"></div>
             
             <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="flex items-center gap-3">
                   <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30 shadow-inner">
                      <Trophy className="w-6 h-6 text-white" />
                   </div>
                   <div>
                      <p className="text-orange-100 text-[10px] font-bold uppercase tracking-widest">Level {ranks.find(r => r.name === stats.currentRank)?.id}</p>
                      <h2 className="text-xl font-bold leading-tight">{stats.currentRank}</h2>
                   </div>
                </div>
                <button 
                  onClick={() => setShowRankDetails(true)}
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors text-white backdrop-blur-md"
                >
                  <Info className="w-4 h-4" />
                </button>
             </div>

             <div className="relative z-10 mt-6">
                <div className="flex justify-between text-xs mb-1.5 text-orange-50 font-medium">
                   <span>Menuju: {stats.nextRank}</span>
                   <span>{stats.progressToNext}%</span>
                </div>
                <div className="w-full bg-black/20 rounded-full h-2.5 overflow-hidden backdrop-blur-sm border border-white/10">
                   <div className="bg-white h-full rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]" style={{width: `${stats.progressToNext}%`}}></div>
                </div>
             </div>
          </div>

          {/* Activity Chart */}
          <div className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm md:col-span-2">
             <div className="flex justify-between items-start mb-2">
                <div>
                   <h3 className="font-bold text-stone-900 dark:text-white flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-orange-500" /> Aktivitas Mingguan
                   </h3>
                   <p className="text-xs text-stone-500 dark:text-stone-400">Jumlah pengantaran 7 hari terakhir</p>
                </div>
                <span className="text-2xl font-bold text-stone-900 dark:text-white">{stats.weeklyActivity.reduce((a, b) => a + b, 0)} <span className="text-xs font-normal text-stone-500">Total</span></span>
             </div>
             <ActivityChart data={stats.weeklyActivity} />
          </div>
       </div>

       {/* Daily Quests Section */}
       <div className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
             <h3 className="font-bold text-stone-900 dark:text-white flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-500" /> Misi Harian
             </h3>
             <span className="text-xs text-stone-500 dark:text-stone-400 bg-stone-100 dark:bg-stone-800 px-2 py-1 rounded-lg">Reset dalam 08:32:10</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             {quests.map(quest => (
                <div key={quest.id} className={`border rounded-xl p-4 relative overflow-hidden transition-all duration-300 ${quest.completed ? 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 border-green-200 dark:border-green-800' : 'bg-stone-50 dark:bg-stone-800/50 border-stone-200 dark:border-stone-800 hover:border-orange-300 dark:hover:border-stone-700'}`}>
                   <div className="flex justify-between items-start mb-3 relative z-10">
                      <div>
                         <h4 className="font-bold text-sm text-stone-900 dark:text-white mb-0.5">{quest.title}</h4>
                         <span className="text-xs font-medium text-stone-500 dark:text-stone-400">{quest.current}/{quest.target} Selesai</span>
                      </div>
                      <div className={`px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm ${quest.completed ? 'bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-300' : 'bg-orange-100 text-orange-600 dark:bg-orange-900/40 dark:text-orange-400'}`}>
                         <Gift className="w-3 h-3" /> +{quest.reward}
                      </div>
                   </div>
                   {/* Progress Bar */}
                   <div className="w-full bg-stone-200 dark:bg-stone-700 h-2 rounded-full overflow-hidden relative z-10">
                      <div 
                         className={`h-full rounded-full transition-all duration-1000 ease-out ${quest.completed ? 'bg-green-500' : 'bg-orange-500'}`} 
                         style={{ width: `${Math.min((quest.current / quest.target) * 100, 100)}%` }}
                      ></div>
                   </div>
                   {quest.completed && <CheckCircle className="absolute -bottom-3 -right-3 w-20 h-20 text-green-500/10 rotate-12" />}
                </div>
             ))}
          </div>
       </div>

       {/* Metrics Grid */}
       <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white dark:bg-stone-900 p-4 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col items-center text-center hover:shadow-md transition-shadow">
             <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400 mb-2">
                <Award className="w-5 h-5" />
             </div>
             <span className="text-2xl font-bold text-stone-900 dark:text-white">{stats.points}</span>
             <span className="text-xs text-stone-500">Total Poin</span>
          </div>
          
          <div className="bg-white dark:bg-stone-900 p-4 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col items-center text-center hover:shadow-md transition-shadow">
             <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-2">
                <CheckCircle className="w-5 h-5" />
             </div>
             <span className="text-2xl font-bold text-stone-900 dark:text-white">{stats.missionsCompleted}</span>
             <span className="text-xs text-stone-500">Misi Selesai</span>
          </div>

          <div className="bg-white dark:bg-stone-900 p-4 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col items-center text-center hover:shadow-md transition-shadow">
             <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 mb-2">
                <MapPin className="w-5 h-5" />
             </div>
             <span className="text-2xl font-bold text-stone-900 dark:text-white">{stats.totalDistance}</span>
             <span className="text-xs text-stone-500">KM Jarak</span>
          </div>

          <div className="bg-white dark:bg-stone-900 p-4 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col items-center text-center hover:shadow-md transition-shadow">
             <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-2">
                <Clock className="w-5 h-5" />
             </div>
             <span className="text-2xl font-bold text-stone-900 dark:text-white">{stats.hoursContributed}</span>
             <span className="text-xs text-stone-500">Jam Kontribusi</span>
          </div>
       </div>

       {showRankDetails && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
           <div className="bg-white dark:bg-stone-900 rounded-3xl w-full max-w-md max-h-[85vh] flex flex-col relative shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-stone-100 dark:border-stone-800 flex justify-between items-center bg-stone-50/50 dark:bg-stone-900/50 backdrop-blur-sm z-10">
                <div>
                    <h3 className="text-lg font-bold text-stone-900 dark:text-white">Jenjang Karir Relawan</h3>
                    <p className="text-xs text-stone-500 dark:text-stone-400">Total 15 Level Kehormatan</p>
                </div>
                <button 
                onClick={() => setShowRankDetails(false)} 
                className="p-2 bg-stone-100 dark:bg-stone-800 rounded-full text-stone-500 hover:text-stone-900 dark:hover:text-white transition-colors"
                >
                <X className="w-5 h-5" />
                </button>
            </div>

            <div className="overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-stone-300 dark:scrollbar-thumb-stone-700">
              {ranks.map((rank) => {
                const isCurrent = rank.name === stats.currentRank;
                const isPassed = stats.points >= rank.minPoints;
                
                return (
                  <div key={rank.id} className={`flex items-center gap-4 p-3 rounded-2xl border transition-all duration-300 ${
                      isCurrent 
                        ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-500 dark:border-orange-500 shadow-sm ring-1 ring-orange-200 dark:ring-orange-800' 
                        : isPassed
                            ? 'bg-stone-50/50 dark:bg-stone-800/30 border-stone-200 dark:border-stone-800 opacity-70'
                            : 'bg-white dark:bg-stone-900 border-stone-100 dark:border-stone-800 opacity-50'
                    }`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-sm ${
                        isCurrent 
                            ? 'bg-gradient-to-br from-orange-500 to-amber-500 text-white' 
                            : isPassed 
                                ? 'bg-stone-200 dark:bg-stone-700 text-stone-500 dark:text-stone-400'
                                : 'bg-stone-100 dark:bg-stone-800 text-stone-300 dark:text-stone-600'
                    }`}>
                       {rank.id}
                    </div>
                    <div className="flex-1">
                      <h4 className={`text-sm font-bold flex items-center gap-2 ${isCurrent ? 'text-orange-700 dark:text-orange-400' : 'text-stone-800 dark:text-stone-200'}`}>
                          {rank.name}
                          {isCurrent && <span className="text-[10px] bg-orange-200 dark:bg-orange-800 text-orange-800 dark:text-orange-200 px-2 py-0.5 rounded-full">Saat Ini</span>}
                      </h4>
                      <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">{rank.description}</p>
                    </div>
                    <div className="text-right min-w-[60px]">
                       <span className={`text-xs font-bold ${isCurrent ? 'text-orange-600 dark:text-orange-400' : 'text-stone-900 dark:text-stone-400'}`}>{rank.minPoints.toLocaleString()}</span>
                       <span className="text-[10px] block text-stone-400">pts</span>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="p-4 border-t border-stone-100 dark:border-stone-800 bg-stone-50 dark:bg-stone-900">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-stone-500">Poin Anda:</span>
                    <span className="font-bold text-orange-600 dark:text-orange-500 text-lg">{stats.points.toLocaleString()}</span>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
