
import React, { useState } from 'react';
import { Truck, ArrowRight } from 'lucide-react';
import { Button } from '../../components/Button';
import { DistributionTask } from '../../../types';

export const Distribution: React.FC = () => {
  const [distributions, setDistributions] = useState<DistributionTask[]>([
      { id: 'TX-001', volunteer: 'Budi Santoso', from: 'Restoran Berkah', to: 'Panti Asuhan A', status: 'delivering', startTime: '10:00', priority: 'normal', distance: '1.2 km' },
      { id: 'TX-002', volunteer: 'Siti Aminah', from: 'Bakery Lezat', to: 'Posyandu Melati', status: 'picking_up', startTime: '10:15', priority: 'urgent', distance: '0.8 km' },
      { id: 'TX-003', volunteer: 'Belum Ditugaskan', from: 'Hotel Grand', to: 'Komunitas C', status: 'pending', startTime: '-', priority: 'normal', distance: '5.5 km' },
  ]);
  const [showAssignVolunteerModal, setShowAssignVolunteerModal] = useState<string | null>(null);

  const handleAssignVolunteer = (taskId: string, volunteerName: string) => {
      setDistributions(distributions.map(d => d.id === taskId ? { ...d, volunteer: volunteerName, status: 'picking_up', startTime: 'Sekarang' } : d));
      setShowAssignVolunteerModal(null);
      alert(`Tugas berhasil diberikan kepada ${volunteerName}`);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-stone-900 dark:text-white flex items-center gap-2">
                <Truck className="w-6 h-6 text-orange-500" /> Distribusi & Logistik
            </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white dark:bg-stone-900 p-4 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm">
                <h4 className="text-sm font-bold text-stone-500 uppercase">Total Pengiriman</h4>
                <p className="text-2xl font-bold text-stone-900 dark:text-white">1,240</p>
            </div>
            <div className="bg-white dark:bg-stone-900 p-4 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm">
                <h4 className="text-sm font-bold text-stone-500 uppercase">Sedang Berjalan</h4>
                <p className="text-2xl font-bold text-orange-500">24</p>
            </div>
            <div className="bg-white dark:bg-stone-900 p-4 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm">
                <h4 className="text-sm font-bold text-stone-500 uppercase">Butuh Relawan</h4>
                <p className="text-2xl font-bold text-red-500">{distributions.filter(d => d.status === 'pending').length}</p>
            </div>
        </div>

        <div className="space-y-4">
            {distributions.map(task => (
                <div key={task.id} className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-mono bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded text-stone-500">{task.id}</span>
                            {task.priority === 'urgent' && <span className="text-xs font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded">URGENT</span>}
                            <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase ${task.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}`}>
                                {task.status.replace('_', ' ')}
                            </span>
                        </div>
                        <div className="flex items-center gap-4 mt-2">
                            <div>
                                <p className="text-xs text-stone-500">Dari</p>
                                <p className="font-bold text-sm text-stone-800 dark:text-stone-200">{task.from}</p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-stone-400" />
                            <div>
                                <p className="text-xs text-stone-500">Ke</p>
                                <p className="font-bold text-sm text-stone-800 dark:text-stone-200">{task.to}</p>
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-medium mb-2 text-stone-800 dark:text-stone-300">{task.volunteer !== 'Belum Ditugaskan' ? task.volunteer : <span className="text-red-500 italic">Belum ada relawan</span>}</p>
                        {task.status === 'pending' ? (
                            <Button className="h-9 text-xs" onClick={() => setShowAssignVolunteerModal(task.id)}>Tugaskan</Button>
                        ) : (
                            <Button variant="outline" className="h-9 text-xs">Lacak</Button>
                        )}
                    </div>
                </div>
            ))}
        </div>

        {showAssignVolunteerModal && (
            <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl w-full max-w-sm border border-stone-200 dark:border-stone-800">
                    <h3 className="font-bold text-lg mb-4 text-stone-900 dark:text-white">Pilih Relawan</h3>
                    <div className="space-y-2">
                        <button onClick={() => handleAssignVolunteer(showAssignVolunteerModal, 'Budi Santoso')} className="w-full p-3 text-left hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl text-stone-700 dark:text-stone-300">Budi Santoso (0.5km)</button>
                        <button onClick={() => handleAssignVolunteer(showAssignVolunteerModal, 'Siti Aminah')} className="w-full p-3 text-left hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl text-stone-700 dark:text-stone-300">Siti Aminah (1.2km)</button>
                    </div>
                    <Button variant="ghost" className="mt-4" onClick={() => setShowAssignVolunteerModal(null)}>Batal</Button>
                </div>
            </div>
        )}
    </div>
  );
};
