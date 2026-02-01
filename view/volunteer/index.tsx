
import React, { useState } from 'react';
import { MapPin, Navigation, History, Trophy, Bell, ChevronDown } from 'lucide-react';
import { Button } from '../components/Button';
import { StatsDashboard } from './components/StatsDashboard';
import { MissionList } from './components/MissionList';
import { Leaderboard } from './components/Leaderboard';
import { HistoryList } from './components/HistoryList';
import { VolunteerTask, RankLevel, DailyQuest, LeaderboardItem } from '../../types';

interface VolunteerIndexProps {
  onOpenNotifications: () => void;
  isSubNavOpen: boolean;
  onToggleSubNav: () => void;
}

export const VolunteerIndex: React.FC<VolunteerIndexProps> = ({ onOpenNotifications, isSubNavOpen, onToggleSubNav }) => {
  const [activeTab, setActiveTab] = useState<'available' | 'active' | 'history' | 'leaderboard'>('available');
  const [showScanner, setShowScanner] = useState(false);
  const [scanningForTaskId, setScanningForTaskId] = useState<number | null>(null);

  // --- Mock Data ---
  const stats = {
    points: 3850,
    missionsCompleted: 42,
    totalDistance: 128.5,
    hoursContributed: 34,
    currentRank: "Penjaga Logistik",
    nextRank: "Ksatria Donasi",
    progressToNext: 77,
    weeklyActivity: [2, 4, 1, 5, 3, 8, 4]
  };

  const RANK_SYSTEM: RankLevel[] = [
    { id: 1, name: "Relawan Pemula", minPoints: 0, description: "Langkah awal kebaikan." },
    { id: 2, name: "Perintis Kebaikan", minPoints: 500, description: "Mulai konsisten membantu." },
    { id: 3, name: "Pengantar Harapan", minPoints: 1000, description: "Menyebarkan harapan nyata." },
    { id: 4, name: "Pahlawan Pangan", minPoints: 2000, description: "Dedikasi yang teruji." },
    { id: 5, name: "Penjaga Logistik", minPoints: 3500, description: "Andalan dalam distribusi." },
    { id: 6, name: "Ksatria Donasi", minPoints: 5000, description: "Keberanian untuk berbagi." },
    { id: 7, name: "Kapten Penyelamat", minPoints: 7500, description: "Memimpin dengan teladan." },
    { id: 8, name: "Komandan Aksi", minPoints: 10000, description: "Penggerak utama komunitas." },
    { id: 9, name: "Veteran Sosial", minPoints: 15000, description: "Pengalaman tak ternilai." },
    { id: 10, name: "Master Distribusi", minPoints: 22000, description: "Ahli efisiensi bantuan." },
    { id: 11, name: "Grandmaster Amal", minPoints: 30000, description: "Level tinggi kedermawanan." },
    { id: 12, name: "Legenda Penyelamat", minPoints: 40000, description: "Namanya dikenal semua." },
    { id: 13, name: "Avatar Kebaikan", minPoints: 55000, description: "Wujud nyata kepedulian." },
    { id: 14, name: "Dewa Penolong", minPoints: 75000, description: "Dedikasi melampaui batas." },
    { id: 15, name: "Immortal Volunteer", minPoints: 100000, description: "Puncak pengabdian abadi." }
  ];

  const [dailyQuests, setDailyQuests] = useState<DailyQuest[]>([
    { id: 1, title: "Login Harian", target: 1, current: 1, reward: 10, completed: true },
    { id: 2, title: "Selesaikan 2 Misi", target: 2, current: 1, reward: 100, completed: false },
    { id: 3, title: "Antar Jarak > 5km", target: 1, current: 0, reward: 150, completed: false },
  ]);

  const leaderboardData: LeaderboardItem[] = [
      { id: 1, name: 'Siti Aminah', points: 4500, rank: 1, avatar: 'SA' },
      { id: 2, name: 'Budi Santoso', points: 3850, rank: 2, avatar: 'BS' },
      { id: 3, name: 'Joko Anwar', points: 3200, rank: 3, avatar: 'JA' },
      { id: 4, name: 'Rina Nose', points: 2900, rank: 4, avatar: 'RN' },
      { id: 5, name: 'Dedi Corb', points: 2500, rank: 5, avatar: 'DC' },
  ];

  const [tasks, setTasks] = useState<VolunteerTask[]>([
    { id: 1, from: 'Bakery Lestari', to: 'Panti Asuhan Al-Hikmah', distance: 1.2, distanceStr: '1.2 km', items: 'Roti Manis (10 Pcs)', status: 'available', stage: 'pickup' },
    { id: 2, from: 'Resto Padang Murah', to: 'Ibu Ani (Warga)', distance: 0.8, distanceStr: '0.8 km', items: 'Nasi Rendang (3 Bks)', status: 'active', stage: 'pickup' },
    { id: 3, from: 'Hotel Grand', to: 'Yayasan Yatim', distance: 5.5, distanceStr: '5.5 km', items: 'Nasi Box (20 Pcs)', status: 'available', stage: 'pickup' }
  ]);

  const [history, setHistory] = useState([
    { id: 101, date: '20 Feb 2025', from: 'Dunkin KW', to: 'Pak RT 05', items: 'Donat (1 Lusin)', points: 50 },
    { id: 102, date: '19 Feb 2025', from: 'Warung Tegal', to: 'Posyandu Mawar', items: 'Nasi Kuning (10 Box)', points: 100 },
  ]);

  // --- Handlers ---

  const handleStartScan = (taskId: number) => {
      setScanningForTaskId(taskId);
      setShowScanner(true);
  };

  const handleScanSuccess = () => {
    if (scanningForTaskId === null) return;
    
    if (navigator.vibrate) navigator.vibrate(200);

    const taskIndex = tasks.findIndex(t => t.id === scanningForTaskId);
    if (taskIndex === -1) return;
    
    const task = tasks[taskIndex];
    const newTasks = [...tasks];

    setTimeout(() => {
        if (task.stage === 'pickup') {
            newTasks[taskIndex] = { ...task, stage: 'dropoff' };
            setTasks(newTasks);
            alert("QR Code Penyedia Terverifikasi! Makanan berhasil diambil.");
        } else {
            const newHistoryItem = {
                id: Date.now(),
                date: 'Baru Saja',
                from: task.from,
                to: task.to,
                items: task.items,
                points: 150
            };
            setHistory([newHistoryItem, ...history]);
            setTasks(tasks.filter(t => t.id !== task.id)); 
            
            setDailyQuests(prev => prev.map(q => {
                if (q.title === "Selesaikan 2 Misi" && !q.completed) {
                    const newCurrent = q.current + 1;
                    return { ...q, current: newCurrent, completed: newCurrent >= q.target };
                }
                return q;
            }));

            setActiveTab('history');
            alert("QR Code Penerima Terverifikasi! Misi Selesai. +150 Poin!");
        }
        setShowScanner(false);
        setScanningForTaskId(null);
    }, 500);
  };

  const acceptTask = (id: number) => {
      setTasks(tasks.map(t => t.id === id ? { ...t, status: 'active' } : t));
      setActiveTab('active');
  };

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto pb-32">
       <div onClick={onToggleSubNav} className="sticky top-16 z-30 bg-[#FDFBF7]/95 dark:bg-stone-950/95 backdrop-blur-sm -mx-6 px-6 pt-4 pb-2 mb-6 border-b border-stone-200 dark:border-stone-800 transition-all cursor-pointer">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-stone-900 dark:text-white">Misi Relawan</h1>
                <ChevronDown className={`w-4 h-4 text-orange-500 transition-transform ${isSubNavOpen ? 'rotate-180' : ''}`} />
            </div>
            <button onClick={(e) => {e.stopPropagation(); onOpenNotifications();}} className="p-2 bg-white dark:bg-stone-900 rounded-full border shadow-sm"><Bell className="w-4 h-4" /></button>
          </div>
          <div onClick={(e) => e.stopPropagation()} className={`flex gap-2 overflow-x-auto transition-all duration-500 ${isSubNavOpen ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                {['available', 'active', 'history', 'leaderboard'].map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab as any)} className={`px-3 py-2 rounded-lg text-sm font-medium capitalize ${activeTab === tab ? 'bg-orange-500 text-white' : 'bg-stone-100 text-stone-500'}`}>{tab}</button>
                ))}
          </div>
       </div>

       <StatsDashboard stats={stats} ranks={RANK_SYSTEM} quests={dailyQuests} />

       {(activeTab === 'available' || activeTab === 'active') && (
           <MissionList 
              tasks={tasks} 
              activeTab={activeTab} 
              onAcceptTask={acceptTask} 
              onScanQr={handleStartScan} 
           />
       )}

       {activeTab === 'leaderboard' && <Leaderboard data={leaderboardData} />}
       {activeTab === 'history' && <HistoryList history={history} />}

       {/* Mobile Bottom Nav */}
       <div 
        className={`md:hidden fixed bottom-[64px] left-0 right-0 bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 z-40 px-4 transition-all duration-500 ease-in-out transform overflow-hidden ${isSubNavOpen ? 'max-h-20 translate-y-0 h-14' : 'max-h-0 translate-y-full h-0 border-none'}`}
       >
         <div className="grid grid-cols-4 h-full items-center">
            <button onClick={() => setActiveTab('available')} className={`flex flex-col items-center justify-center gap-1 transition-colors ${activeTab === 'available' ? 'text-orange-600 dark:text-orange-500' : 'text-stone-400'}`}>
               <MapPin className="w-5 h-5" />
               <span className="text-[10px] font-bold">Misi</span>
            </button>
            <button onClick={() => setActiveTab('active')} className={`flex flex-col items-center justify-center gap-1 transition-colors ${activeTab === 'active' ? 'text-orange-600 dark:text-orange-500' : 'text-stone-400'}`}>
               <Navigation className="w-5 h-5" />
               <span className="text-[10px] font-bold">Aktif</span>
            </button>
            <button onClick={() => setActiveTab('history')} className={`flex flex-col items-center justify-center gap-1 transition-colors ${activeTab === 'history' ? 'text-orange-600 dark:text-orange-500' : 'text-stone-400'}`}>
               <History className="w-5 h-5" />
               <span className="text-[10px] font-bold">Riwayat</span>
            </button>
            <button onClick={() => setActiveTab('leaderboard')} className={`flex flex-col items-center justify-center gap-1 transition-colors ${activeTab === 'leaderboard' ? 'text-orange-600 dark:text-orange-500' : 'text-stone-400'}`}>
               <Trophy className="w-5 h-5" />
               <span className="text-[10px] font-bold">Ranking</span>
            </button>
         </div>
      </div>

       {showScanner && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center p-4">
           <div className="w-64 h-64 border-2 border-orange-500 rounded-3xl relative mb-8 overflow-hidden bg-black/50">
            <div className="absolute top-4 left-4 w-8 h-8 border-t-4 border-l-4 border-orange-500 rounded-tl-xl z-20"></div>
            <div className="absolute top-4 right-4 w-8 h-8 border-t-4 border-r-4 border-orange-500 rounded-tr-xl z-20"></div>
            <div className="absolute bottom-4 left-4 w-8 h-8 border-b-4 border-l-4 border-orange-500 rounded-bl-xl z-20"></div>
            <div className="absolute bottom-4 right-4 w-8 h-8 border-b-4 border-r-4 border-orange-500 rounded-br-xl z-20"></div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-400 to-transparent animate-pulse shadow-[0_0_20px_rgba(249,115,22,0.8)] z-10" style={{animation: 'scan 1.5s infinite linear'}} />
            <div className="absolute inset-0 z-30 cursor-pointer" onClick={handleScanSuccess}></div>
          </div>
          <p className="text-white font-bold text-lg mb-1">Scan QR Code</p>
          <p className="text-stone-400 text-sm mb-8 text-center px-8">Arahkan kamera ke kode QR di aplikasi Penyedia atau Penerima</p>
          <Button variant="outline" onClick={() => setShowScanner(false)} className="border-white/20 text-white hover:bg-white hover:text-black">Tutup Scanner</Button>
          <style>{`@keyframes scan { 0% { top: 0; opacity: 0; } 20% { opacity: 1; } 80% { opacity: 1; } 100% { top: 100%; opacity: 0; } }`}</style>
        </div>
      )}
    </div>
  );
};
