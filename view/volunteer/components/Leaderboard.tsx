
import React from 'react';
import { Crown } from 'lucide-react';
import { LeaderboardItem } from '../../../types';

interface LeaderboardProps {
    data: LeaderboardItem[];
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ data }) => {
    const top3 = data.slice(0, 3);
    const others = data.slice(3);

    return (
        <div className="space-y-6 animate-in fade-in">
             <div className="bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl p-6 text-white text-center shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl transform translate-x-10 -translate-y-10"></div>
                <h2 className="text-xl font-bold relative z-10 flex items-center justify-center gap-2">
                    <Crown className="w-5 h-5 text-yellow-300" /> Papan Peringkat
                </h2>
                <p className="text-orange-100 text-sm relative z-10 mb-6">Relawan terbaik minggu ini</p>
                
                <div className="flex justify-center items-end gap-4 relative z-10">
                    <div className="flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full border-2 border-slate-300 bg-white/20 flex items-center justify-center font-bold text-sm mb-2 shadow-sm">
                            {top3[1]?.avatar}
                        </div>
                        <div className="w-16 h-20 bg-white/20 rounded-t-lg flex flex-col justify-end items-center pb-2 border-t border-l border-r border-white/30 backdrop-blur-sm">
                            <span className="text-2xl font-bold">2</span>
                        </div>
                        <p className="text-xs font-medium mt-1 w-16 truncate">{top3[1]?.name}</p>
                        <p className="text-[10px] text-orange-200">{top3[1]?.points}</p>
                    </div>

                    <div className="flex flex-col items-center">
                         <div className="relative">
                            <Crown className="w-6 h-6 text-yellow-300 absolute -top-5 left-1/2 -translate-x-1/2" />
                            <div className="w-16 h-16 rounded-full border-2 border-yellow-300 bg-white/20 flex items-center justify-center font-bold text-lg mb-2 shadow-lg">
                                {top3[0]?.avatar}
                            </div>
                         </div>
                        <div className="w-20 h-28 bg-gradient-to-t from-yellow-400/30 to-white/30 rounded-t-lg flex flex-col justify-end items-center pb-2 border-t border-l border-r border-white/30 backdrop-blur-sm">
                            <span className="text-3xl font-bold text-yellow-100">1</span>
                        </div>
                        <p className="text-xs font-bold mt-1 w-20 truncate">{top3[0]?.name}</p>
                        <p className="text-[10px] text-orange-200 font-bold">{top3[0]?.points}</p>
                    </div>

                    <div className="flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full border-2 border-orange-200 bg-white/20 flex items-center justify-center font-bold text-sm mb-2 shadow-sm">
                            {top3[2]?.avatar}
                        </div>
                        <div className="w-16 h-16 bg-white/20 rounded-t-lg flex flex-col justify-end items-center pb-2 border-t border-l border-r border-white/30 backdrop-blur-sm">
                            <span className="text-2xl font-bold">3</span>
                        </div>
                        <p className="text-xs font-medium mt-1 w-16 truncate">{top3[2]?.name}</p>
                        <p className="text-[10px] text-orange-200">{top3[2]?.points}</p>
                    </div>
                </div>
             </div>

             <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm overflow-hidden">
                 {others.map((user) => (
                     <div key={user.id} className="flex items-center p-4 border-b border-stone-100 dark:border-stone-800 last:border-0 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors">
                         <span className="w-8 font-bold text-stone-400 text-sm">{user.rank}</span>
                         <div className="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center font-bold text-xs text-stone-600 dark:text-stone-300 mr-3">
                             {user.avatar}
                         </div>
                         <div className="flex-1">
                             <p className="text-sm font-bold text-stone-900 dark:text-white">{user.name}</p>
                         </div>
                         <span className="text-sm font-bold text-orange-500">{user.points} <span className="text-xs font-normal text-stone-400">pts</span></span>
                     </div>
                 ))}
             </div>
        </div>
    );
};
