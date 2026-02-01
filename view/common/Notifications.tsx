
import React, { useState } from 'react';
import { Bell, CheckCircle, Info, AlertTriangle, ArrowLeft, Trash2 } from 'lucide-react';
import { Notification } from '../../types';

interface NotificationsPageProps {
  onBack: () => void;
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({ onBack }) => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'success',
      title: 'Donasi Berhasil',
      message: 'Makanan "Nasi Kotak" telah berhasil diklaim oleh penerima.',
      date: '5 Menit lalu',
      isRead: false
    },
    {
      id: '2',
      type: 'warning',
      title: 'Pengingat Kedaluwarsa',
      message: 'Item "Roti Tawar" akan kedaluwarsa dalam 1 jam.',
      date: '30 Menit lalu',
      isRead: false
    },
    {
      id: '3',
      type: 'info',
      title: 'Misi Baru Tersedia',
      message: 'Ada misi pengantaran baru di sekitar area Anda.',
      date: '2 Jam lalu',
      isRead: true
    }
  ]);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const clearAll = () => {
    if(confirm("Hapus semua notifikasi?")) setNotifications([]);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto min-h-screen pb-24 animate-in slide-in-from-right">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-900 dark:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-stone-900 dark:text-white">Notifikasi</h1>
        </div>
        <div className="flex gap-2">
           <button onClick={markAllRead} className="text-xs font-medium text-orange-500 hover:text-orange-600">Baca Semua</button>
           <button onClick={clearAll} className="p-2 text-stone-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
        </div>
      </div>

      <div className="space-y-3">
        {notifications.length === 0 && (
            <div className="text-center py-12 text-stone-500 dark:text-stone-400">
                <Bell className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>Tidak ada notifikasi saat ini.</p>
            </div>
        )}
        
        {notifications.map(notif => (
          <div 
            key={notif.id} 
            className={`p-4 rounded-xl border transition-all flex gap-4 ${notif.isRead ? 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 opacity-70' : 'bg-orange-50 dark:bg-orange-900/10 border-orange-200 dark:border-orange-800 shadow-sm'}`}
          >
            <div className="mt-1">{getIcon(notif.type)}</div>
            <div className="flex-1">
              <h4 className="font-bold text-stone-900 dark:text-white text-sm">{notif.title}</h4>
              <p className="text-sm text-stone-600 dark:text-stone-300 mt-1">{notif.message}</p>
              <p className="text-xs text-stone-400 mt-2">{notif.date}</p>
            </div>
            {!notif.isRead && <div className="w-2 h-2 rounded-full bg-orange-500 mt-2"></div>}
          </div>
        ))}
      </div>
    </div>
  );
};
