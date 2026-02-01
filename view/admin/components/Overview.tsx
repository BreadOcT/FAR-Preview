
import React from 'react';
import { Leaf, Users, Globe, AlertTriangle } from 'lucide-react';
import { Button } from '../../components/Button';

export const Overview: React.FC = () => {
  const stats = [
    { label: "Total Penyelamatan", value: "12,450 kg", subValue: "+120kg hari ini", icon: Leaf, color: "bg-green-500" },
    { label: "Komunitas Aktif", value: "845", subValue: "45 relawan baru", icon: Users, color: "bg-blue-500" },
    { label: "Jejak Karbon (C02)", value: "-24.5 Ton", subValue: "Setara 400 pohon", icon: Globe, color: "bg-teal-500" },
    { label: "Laporan Masuk", value: "12", subValue: "3 Butuh tindakan", icon: AlertTriangle, color: "bg-red-500" }
  ];

  return (
    <div className="space-y-6 animate-in fade-in">
       <div className="bg-gradient-to-r from-orange-700 via-amber-600 to-orange-500 rounded-3xl p-8 text-white shadow-xl shadow-orange-500/10 relative overflow-hidden">
          <div className="relative z-10">
             <h2 className="text-3xl font-black mb-2">Halo, Admin!</h2>
             <p className="text-orange-100 max-w-xl font-medium">Sistem berjalan optimal. Hari ini ada <strong className="text-white bg-white/20 px-2 py-0.5 rounded">124kg</strong> makanan yang perlu diselamatkan.</p>
             <div className="flex gap-3 mt-6">
                <Button className="w-auto bg-white text-orange-600 border-0 h-10 text-sm hover:bg-stone-100 transition-colors">Lihat Laporan</Button>
             </div>
          </div>
       </div>
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
             <div key={idx} className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col justify-between">
                <div className="flex justify-between items-start mb-4">
                   <div className={`p-3 rounded-xl text-white shadow-md ${stat.color}`}><stat.icon className="w-5 h-5" /></div>
                </div>
                <div>
                   <h3 className="text-stone-500 dark:text-stone-400 text-xs font-bold uppercase tracking-wider mb-1">{stat.label}</h3>
                   <p className="text-2xl font-black text-stone-900 dark:text-white mb-1">{stat.value}</p>
                   <p className="text-xs font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-lg inline-block">{stat.subValue}</p>
                </div>
             </div>
          ))}
       </div>
    </div>
  );
};
