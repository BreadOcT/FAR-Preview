
import React from 'react';
import { History, Clock } from 'lucide-react';

interface HistoryItem {
    id: number;
    date: string;
    from: string;
    to: string;
    items: string;
    points: number;
}

interface HistoryListProps {
    history: HistoryItem[];
}

export const HistoryList: React.FC<HistoryListProps> = ({ history }) => {
    return (
        <div className="space-y-4 animate-in fade-in">
            <h2 className="text-lg font-bold text-stone-900 dark:text-white flex items-center gap-2 mb-4">
                <History className="w-5 h-5 text-orange-500" /> Riwayat Pengantaran
            </h2>
            {history.map(item => (
                <div key={item.id} className="bg-white dark:bg-stone-900 p-4 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col gap-2">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-bold text-stone-900 dark:text-white">{item.items}</h3>
                        <p className="text-xs text-stone-500 flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3" /> {item.date}
                        </p>
                    </div>
                    <span className="text-xs font-bold text-orange-500 bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded-full">
                    +{item.points} Poin
                    </span>
                </div>
                
                <div className="mt-2 pt-2 border-t border-stone-100 dark:border-stone-800 flex flex-col gap-2 text-sm text-stone-600 dark:text-stone-400">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                        <span className="font-medium text-stone-900 dark:text-stone-300">Dari:</span> {item.from}
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span className="font-medium text-stone-900 dark:text-stone-300">Ke:</span> {item.to}
                    </div>
                </div>
                </div>
            ))}
        </div>
    );
};
