import React, { useState } from 'react';
import { Package, MapPin, CheckCircle, Navigation, ScanLine, Clock, History, Bell, Filter, Award, TrendingUp, Zap, Trophy, ChevronRight, Crown, Info, X, Flame, Gift, ArrowRight, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from './Button';

interface VolunteerDashboardProps {
  onOpenNotifications: () => void;
  isSubNavOpen: boolean;
  onToggleSubNav: () => void;
}

interface VolunteerTask {
  id: number;
  from: string;
  to: string;
  distance: number;
  distanceStr: string;
  items: string;
  status: 'available' | 'active' | 'history';
  stage: 'pickup' | 'dropoff';
}

interface RankLevel {
  id: number;
  name: string;
  minPoints: number;
  description: string;
  icon?: string;
}

interface DailyQuest {
  id: number;
  title: string;
  target: number;
  current: number;
  reward: number;
  completed: boolean;
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
           {/* Tooltip */}
           <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-stone-800 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
             {val} Misi
           </div>
        </div>
      ))}
    </div>
  );
};

export const VolunteerDashboard: React.FC<VolunteerDashboardProps> = ({ onOpenNotifications, isSubNavOpen, onToggleSubNav }) => {
  const [activeTab, setActiveTab] = useState<'available' | 'active' | 'history' | 'leaderboard'>('available');
  const [showScanner, setShowScanner] = useState(false);
  const [filterDistance, setFilterDistance] = useState<'all' | 'near'>('all');
  const [scanningForTaskId, setScanningForTaskId] = useState<number | null>(null);
  
  // New State for Rank Details Modal
  const [showRankDetails, setShowRankDetails] = useState(false);

  // Stats Data
  const stats = {
    points: 3850,
    missionsCompleted: 42,
    totalDistance: 128.5, // km
    hoursContributed: 34,
    currentRank: "Penjaga Logistik",
    nextRank: "Ksatria Donasi",
    progressToNext: 77, // percentage
    weeklyActivity: [2, 4, 1, 5, 3, 8, 4] // Missions per day
  };

  // Rank System Data - 15 Levels
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

  // Daily Quests Data
  const [dailyQuests, setDailyQuests] = useState<DailyQuest[]>([
    { id: 1, title: "Login Harian", target: 1, current: 1, reward: 10, completed: true },
    { id: 2, title: "Selesaikan 2 Misi", target: 2, current: 1, reward: 100, completed: false },
    { id: 3, title: "Antar Jarak > 5km", target: 1, current: 0, reward: 150, completed: false },
  ]);

  const leaderboardData = [
      { id: 1, name: 'Siti Aminah', points: 4500, rank: 1, avatar: 'SA' },
      { id: 2, name: 'Budi Santoso', points: 3850, rank: 2, avatar: 'BS' }, // Current User
      { id: 3, name: 'Joko Anwar', points: 3200, rank: 3, avatar: 'JA' },
      { id: 4, name: 'Rina Nose', points: 2900, rank: 4, avatar: 'RN' },
      { id: 5, name: 'Dedi Corb', points: 2500, rank: 5, avatar: 'DC' },
  ];

  // Mock Active/Available Tasks
  const [tasks, setTasks] = useState<VolunteerTask[]>([
    { id: 1, from: 'Bakery Lestari', to: 'Panti Asuhan Al-Hikmah', distance: 1.2, distanceStr: '1.2 km', items: 'Roti Manis (10 Pcs)', status: 'available', stage: 'pickup' },
    { id: 2, from: 'Resto Padang Murah', to: 'Ibu Ani (Warga)', distance: 0.8, distanceStr: '0.8 km', items: 'Nasi Rendang (3 Bks)', status: 'active', stage: 'pickup' },
    { id: 3, from: 'Hotel Grand', to: 'Yayasan Yatim', distance: 5.5, distanceStr: '5.5 km', items: 'Nasi Box (20 Pcs)', status: 'available', stage: 'pickup' }
  ]);

  // Mock History
  const [history, setHistory] = useState([
    { id: 101, date: '20 Feb 2025', from: 'Dunkin KW', to: 'Pak RT 05', items: 'Donat (1 Lusin)', points: 50 },
    { id: 102, date: '19 Feb 2025', from: 'Warung Tegal', to: 'Posyandu Mawar', items: 'Nasi Kuning (10 Box)', points: 100 },
  ]);

  const handleStartScan = (taskId: number) => {
      setScanningForTaskId(taskId);
      setShowScanner(true);
  };

  const handleScanSuccess = () => {
    if (scanningForTaskId === null) return;
    
    // Haptic feedback
    if (navigator.vibrate) navigator.vibrate(200);

    // Find the task
    const taskIndex = tasks.findIndex(t => t.id === scanningForTaskId);
    if (taskIndex === -1) return;
    
    const task = tasks[taskIndex];
    const newTasks = [...tasks];

    setTimeout(() => {
        if (task.stage === 'pickup') {
            newTasks[taskIndex] = { ...task, stage: 'dropoff' };
            setTasks(newTasks);
            alert("QR Code Penyedia Terverifikasi! Makanan berhasil diambil. Silakan antar ke tujuan.");
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
            
            // Update Quest Progress (Mock)
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

  // --- Render Functions ---

  const renderLeaderboard = () => {
    // ... (Same as before)
     const top3 = leaderboardData.slice(0, 3);
    const others = leaderboardData.slice(3);

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
                            {top3[1].avatar}
                        </div>
                        <div className="w-16 h-20 bg-white/20 rounded-t-lg flex flex-col justify-end items-center pb-2 border-t border-l border-r border-white/30 backdrop-blur-sm">
                            <span className="text-2xl font-bold">2</span>
                        </div>
                        <p className="text-xs font-medium mt-1 w-16 truncate">{top3[1].name}</p>
                        <p className="text-[10px] text-orange-200">{top3[1].points}</p>
                    </div>

                    <div className="flex flex-col items-center">
                         <div className="relative">
                            <Crown className="w-6 h-6 text-yellow-300 absolute -top-5 left-1/2 -translate-x-1/2" />
                            <div className="w-16 h-16 rounded-full border-2 border-yellow-300 bg-white/20 flex items-center justify-center font-bold text-lg mb-2 shadow-lg">
                                {top3[0].avatar}
                            </div>
                         </div>
                        <div className="w-20 h-28 bg-gradient-to-t from-yellow-400/30 to-white/30 rounded-t-lg flex flex-col justify-end items-center pb-2 border-t border-l border-r border-white/30 backdrop-blur-sm">
                            <span className="text-3xl font-bold text-yellow-100">1</span>
                        </div>
                        <p className="text-xs font-bold mt-1 w-20 truncate">{top3[0].name}</p>
                        <p className="text-[10px] text-orange-200 font-bold">{top3[0].points}</p>
                    </div>

                    <div className="flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full border-2 border-orange-200 bg-white/20 flex items-center justify-center font-bold text-sm mb-2 shadow-sm">
                            {top3[2].avatar}
                        </div>
                        <div className="w-16 h-16 bg-white/20 rounded-t-lg flex flex-col justify-end items-center pb-2 border-t border-l border-r border-white/30 backdrop-blur-sm">
                            <span className="text-2xl font-bold">3</span>
                        </div>
                        <p className="text-xs font-medium mt-1 w-16 truncate">{top3[2].name}</p>
                        <p className="text-[10px] text-orange-200">{top3[2].points}</p>
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

  const renderStatsDashboard = () => (
    <div className="space-y-4 mb-8 animate-in slide-in-from-top-4">
       {/* ... (Stats Dashboard same as before) ... */}
       {/* Top Row: Rank & Chart */}
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
                      <p className="text-orange-100 text-[10px] font-bold uppercase tracking-widest">Level {RANK_SYSTEM.find(r => r.name === stats.currentRank)?.id}</p>
                      <h2 className="text-xl font-bold leading-tight">{stats.currentRank}</h2>
                   </div>
                </div>
                {/* Info Icon Button */}
                <button 
                  onClick={() => setShowRankDetails(true)}
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors text-white backdrop-blur-md"
                  aria-label="Detail Ranking"
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
             {dailyQuests.map(quest => (
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
    </div>
  );

  const renderHistory = () => (
    <div className="space-y-4 animate-in fade-in">
       {/* ... (History content same as before) ... */}
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

  const filteredTasks = tasks.filter(t => {
      if (t.status !== activeTab) return false;
      if (filterDistance === 'near' && t.distance > 2) return false;
      return true;
  });

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto pb-32">
      {/* PARENT NAVBAR: Sticky Header (Clickable) */}
      <div 
        onClick={onToggleSubNav}
        className="sticky top-16 z-30 bg-[#FDFBF7]/95 dark:bg-stone-950/95 backdrop-blur-sm -mx-6 px-6 pt-4 pb-2 mb-6 border-b border-stone-200 dark:border-stone-800 transition-all cursor-pointer group select-none hover:bg-stone-50/50 dark:hover:bg-stone-900/50"
      >
          <div className="flex items-center justify-between mb-4 pointer-events-none">
            <div className="pointer-events-auto">
               <div className="flex items-center gap-2">
                  <h1 className="text-lg font-bold text-stone-900 dark:text-white leading-tight">Misi Relawan</h1>
                  {/* Toggle Indicator */}
                  <div className={`transform transition-transform duration-300 ${isSubNavOpen ? 'rotate-180' : 'rotate-0'}`}>
                      <ChevronDown className="w-4 h-4 text-orange-500" />
                  </div>
               </div>
              <p className="text-xs text-stone-500 font-medium">Antar kebaikan hari ini.</p>
            </div>
            <div className="flex items-center gap-3 pointer-events-auto" onClick={(e) => e.stopPropagation()}>
                <button onClick={onOpenNotifications} className="p-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-full text-stone-500 hover:text-orange-500 transition-colors shadow-sm">
                    <Bell className="w-4 h-4" />
                </button>
            </div>
          </div>
          
           {/* SUB NAVBAR (Desktop Tabs) - Collapsible */}
           <div 
            onClick={(e) => e.stopPropagation()}
            className={`hidden md:flex gap-2 mb-0 p-1 bg-stone-100 dark:bg-stone-900 rounded-xl overflow-x-auto transition-all duration-500 ease-in-out ${isSubNavOpen ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}
           >
                <button 
                onClick={() => setActiveTab('available')}
                className={`flex-1 min-w-[80px] py-2 px-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'available' ? 'bg-white dark:bg-orange-500 text-stone-900 dark:text-stone-950 shadow-sm' : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'}`}
                >
                Tersedia
                </button>
                <button 
                onClick={() => setActiveTab('active')}
                className={`flex-1 min-w-[80px] py-2 px-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'active' ? 'bg-white dark:bg-orange-500 text-stone-900 dark:text-stone-950 shadow-sm' : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'}`}
                >
                Aktif
                </button>
                <button 
                onClick={() => setActiveTab('history')}
                className={`flex-1 min-w-[80px] py-2 px-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'history' ? 'bg-white dark:bg-orange-500 text-stone-900 dark:text-stone-950 shadow-sm' : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'}`}
                >
                Riwayat
                </button>
                <button 
                onClick={() => setActiveTab('leaderboard')}
                className={`flex-1 min-w-[100px] py-2 px-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1 ${activeTab === 'leaderboard' ? 'bg-white dark:bg-orange-500 text-stone-900 dark:text-stone-950 shadow-sm' : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'}`}
                >
                <Trophy className="w-3 h-3" /> Ranking
                </button>
           </div>
      </div>

      {/* NEW STATS DASHBOARD */}
      {renderStatsDashboard()}

      {activeTab === 'available' && (
          <div className="flex items-center justify-end mb-4">
               <div className="flex items-center gap-2 bg-white dark:bg-stone-900 px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-800">
                  <Filter className="w-4 h-4 text-stone-400" />
                  <select 
                    value={filterDistance} 
                    onChange={(e) => setFilterDistance(e.target.value as any)}
                    className="bg-transparent text-sm font-medium text-stone-600 dark:text-stone-300 focus:outline-none"
                  >
                      <option value="all">Semua Jarak</option>
                      <option value="near">Terdekat (&lt; 2km)</option>
                  </select>
               </div>
          </div>
      )}

      {activeTab === 'leaderboard' && renderLeaderboard()}

      {activeTab === 'history' && renderHistory()} 
      
      {(activeTab === 'active' || activeTab === 'available') && (
        <div className="space-y-4 animate-in fade-in">
           {/* ... (Task list same as before) ... */}
          {filteredTasks.map(task => (
            <div key={task.id} className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-orange-100 dark:border-stone-800 relative overflow-hidden shadow-sm">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-orange-500 to-amber-500" />
              
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-stone-900 dark:text-white text-lg">{task.items}</h3>
                  <span className="text-xs text-stone-500 bg-stone-50 dark:bg-stone-950 px-2 py-1 rounded border border-stone-100 dark:border-stone-800 mt-1 inline-block">
                    Jarak Total: {task.distanceStr}
                  </span>
                </div>
                {activeTab === 'active' && (
                  <div className={`px-3 py-1 rounded-full text-xs font-bold border ${task.stage === 'pickup' ? 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300' : 'bg-green-50 text-green-600 border-green-200 dark:bg-green-900/30 dark:text-green-300'}`}>
                      {task.stage === 'pickup' ? 'Menjemput' : 'Mengantar'}
                  </div>
                )}
              </div>

              <div className="space-y-3 relative">
                <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-stone-200 dark:bg-stone-800" />
                
                <div className={`flex items-center gap-3 relative z-10 ${task.stage === 'pickup' ? 'opacity-100' : 'opacity-50'}`}>
                  <div className="w-4 h-4 rounded-full bg-orange-500 border-2 border-white dark:border-stone-900" />
                  <div>
                    <p className="text-xs text-stone-500 dark:text-stone-500">Ambil dari</p>
                    <p className="text-sm font-medium text-stone-700 dark:text-stone-200">{task.from}</p>
                  </div>
                </div>

                <div className={`flex items-center gap-3 relative z-10 ${task.stage === 'dropoff' ? 'opacity-100' : 'opacity-50'}`}>
                  <div className="w-4 h-4 rounded-full bg-amber-400 border-2 border-white dark:border-stone-900" />
                  <div>
                    <p className="text-xs text-stone-500 dark:text-stone-500">Antar ke</p>
                    <p className="text-sm font-medium text-stone-700 dark:text-stone-200">{task.to}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                {activeTab === 'available' ? (
                  <Button onClick={() => acceptTask(task.id)}>Ambil Misi</Button>
                ) : (
                  <>
                    <Button variant="outline"><Navigation className="w-4 h-4 mr-2" /> Rute</Button>
                    <Button onClick={() => handleStartScan(task.id)} className={task.stage === 'dropoff' ? 'bg-green-600 hover:bg-green-500' : ''}>
                        <ScanLine className="w-4 h-4 mr-2" /> 
                        {task.stage === 'pickup' ? 'Scan QR Penyedia' : 'Scan QR Penerima'}
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
          
          {filteredTasks.length === 0 && (
            <div className="text-center py-12 text-stone-500">Tidak ada misi saat ini yang sesuai filter.</div>
          )}
        </div>
      )}

      {/* SUB NAVBAR (Mobile Bottom Nav) - Collapsible - Controlled by Parent Prop now */}
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

      {/* Rank Details Modal (Scrollable for 15 levels) */}
      {showRankDetails && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
           {/* ... (Modal content same as before) ... */}
           <div className="bg-white dark:bg-stone-900 rounded-3xl w-full max-w-md max-h-[85vh] flex flex-col relative shadow-2xl overflow-hidden">
            
            {/* Header */}
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

            {/* Scrollable Content */}
            <div className="overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-stone-300 dark:scrollbar-thumb-stone-700">
              {RANK_SYSTEM.map((rank) => {
                const isCurrent = rank.name === stats.currentRank;
                const isPassed = stats.points >= rank.minPoints;
                const isNext = !isPassed && stats.points < rank.minPoints && stats.points >= (RANK_SYSTEM[rank.id - 2]?.minPoints || 0);
                
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
            
            {/* Footer */}
            <div className="p-4 border-t border-stone-100 dark:border-stone-800 bg-stone-50 dark:bg-stone-900">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-stone-500">Poin Anda:</span>
                    <span className="font-bold text-orange-600 dark:text-orange-500 text-lg">{stats.points.toLocaleString()}</span>
                </div>
            </div>
          </div>
        </div>
      )}

      {showScanner && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center p-4">
           {/* ... (Scanner content same as before) ... */}
           <div className="w-64 h-64 border-2 border-orange-500 rounded-3xl relative mb-8 overflow-hidden bg-black/50">
            {/* Corner Indicators */}
            <div className="absolute top-4 left-4 w-8 h-8 border-t-4 border-l-4 border-orange-500 rounded-tl-xl z-20"></div>
            <div className="absolute top-4 right-4 w-8 h-8 border-t-4 border-r-4 border-orange-500 rounded-tr-xl z-20"></div>
            <div className="absolute bottom-4 left-4 w-8 h-8 border-b-4 border-l-4 border-orange-500 rounded-bl-xl z-20"></div>
            <div className="absolute bottom-4 right-4 w-8 h-8 border-b-4 border-r-4 border-orange-500 rounded-br-xl z-20"></div>

            {/* Scanning Animation */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-400 to-transparent animate-pulse shadow-[0_0_20px_rgba(249,115,22,0.8)] z-10" style={{animation: 'scan 1.5s infinite linear'}} />
            
            {/* Simulate Scan Success Area */}
            <div className="absolute inset-0 z-30 cursor-pointer" onClick={handleScanSuccess}></div>
          </div>
          <p className="text-white font-bold text-lg mb-1">Scan QR Code</p>
          <p className="text-stone-400 text-sm mb-8 text-center px-8">Arahkan kamera ke kode QR di aplikasi Penyedia atau Penerima</p>
          <Button variant="outline" onClick={() => setShowScanner(false)} className="border-white/20 text-white hover:bg-white hover:text-black">Tutup Scanner</Button>
          <style>{`
            @keyframes scan {
              0% { top: 0; opacity: 0; }
              20% { opacity: 1; }
              80% { opacity: 1; }
              100% { top: 100%; opacity: 0; }
            }
          `}</style>
        </div>
      )}
    </div>
  );
};