
import React, { useState } from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { Report } from '../../../types';
import { EmptyState } from '../../common/EmptyState';

export const ReportsView: React.FC = () => {
  const [reports] = useState<Report[]>([
    { id: '1', title: 'Kemasan Rusak', description: 'Penerima melaporkan kemasan penyok saat diterima.', date: '20 Feb 2025', status: 'new', reporter: 'User #123', isUrgent: true },
    { id: '2', title: 'Makanan Dingin', description: 'Makanan sudah dingin saat sampai.', date: '19 Feb 2025', status: 'handled', reporter: 'User #456', isUrgent: false },
  ]);

  return (
    <div className="space-y-6 animate-in fade-in">
       <div className="flex justify-between items-center">
         <h2 className="text-2xl font-bold text-stone-900 dark:text-white">Laporan Masuk ({reports.length})</h2>
       </div>
       <div className="space-y-4">
          {reports.length === 0 && (
              <EmptyState 
                icon={CheckCircle}
                title="Bebas Laporan"
                description="Luar biasa! Tidak ada laporan masalah pada donasi Anda."
              />
          )}
          {reports.map(report => (
            <div key={report.id} className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm">
               <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                      <AlertTriangle className={`w-5 h-5 ${report.isUrgent ? 'text-red-500' : 'text-orange-500'}`} />
                      <h3 className="font-bold text-lg text-stone-900 dark:text-white">{report.title}</h3>
                      {report.isUrgent && <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded font-bold uppercase">Urgent</span>}
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${report.status === 'handled' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>{report.status}</span>
               </div>
               <p className="text-sm text-stone-600 dark:text-stone-300 mb-3">{report.description}</p>
               <div className="flex justify-between items-center text-xs text-stone-500">
                  <span>Pelapor: {report.reporter}</span>
                  <span>{report.date}</span>
               </div>
            </div>
          ))}
       </div>
    </div>
  );
};
