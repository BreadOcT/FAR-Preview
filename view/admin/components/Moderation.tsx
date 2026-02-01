
import React, { useState } from 'react';
import { Shield, X } from 'lucide-react';
import { Button } from '../../components/Button';
import { Report } from '../../../types';

export const Moderation: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([
    { id: '101', type: 'quality', reporter: 'Penerima A', target: 'Warung B', description: 'Makanan basi.', status: 'new', date: '10:30 AM', priority: 'high', title: 'Makanan Basi' },
  ]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  const handleAction = (status: 'resolved' | 'dismissed') => {
      if(selectedReport) {
          setReports(reports.map(r => r.id === selectedReport.id ? { ...r, status } : r));
          setSelectedReport(null);
      }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
       <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-stone-900 dark:text-white flex items-center gap-2">
              <Shield className="w-6 h-6 text-orange-500" /> Moderasi Laporan
          </h2>
       </div>
       <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm overflow-hidden">
           <table className="w-full text-left">
               <thead className="bg-stone-50 dark:bg-stone-950 text-stone-500 text-xs uppercase font-bold">
                   <tr><th className="p-4">Prioritas</th><th className="p-4">Masalah</th><th className="p-4">Status</th><th className="p-4 text-right">Aksi</th></tr>
               </thead>
               <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                   {reports.map(report => (
                       <tr key={report.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/50">
                           <td className="p-4"><span className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-bold uppercase">{report.priority}</span></td>
                           <td className="p-4 text-sm font-medium text-stone-700 dark:text-stone-300">{report.description}</td>
                           <td className="p-4 uppercase text-xs font-bold text-stone-600 dark:text-stone-400">{report.status}</td>
                           <td className="p-4 text-right"><Button variant="outline" className="h-8 text-xs px-3" onClick={() => setSelectedReport(report)}>Detail</Button></td>
                       </tr>
                   ))}
               </tbody>
           </table>
       </div>
       
       {selectedReport && (
            <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-white dark:bg-stone-900 w-full max-w-lg rounded-2xl shadow-2xl p-6 relative">
                    <button onClick={() => setSelectedReport(null)} className="absolute top-4 right-4 text-stone-400 hover:text-stone-900 dark:hover:text-white"><X className="w-5 h-5" /></button>
                    <h3 className="text-xl font-bold mb-4 text-stone-900 dark:text-white">Detail Laporan</h3>
                    <p className="mb-4 text-stone-600 dark:text-stone-300">{selectedReport.description}</p>
                    <div className="grid grid-cols-2 gap-3">
                         <Button variant="ghost" onClick={() => handleAction('dismissed')}>Tolak</Button>
                         <Button onClick={() => handleAction('resolved')}>Selesaikan</Button>
                    </div>
                </div>
            </div>
       )}
    </div>
  );
};
