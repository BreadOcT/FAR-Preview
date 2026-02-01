
import React, { useState } from 'react';
import { Filter, Navigation, ScanLine, Search } from 'lucide-react';
import { Button } from '../../components/Button';
import { EmptyState } from '../../common/EmptyState';
import { VolunteerTask } from '../../../types';

interface MissionListProps {
  tasks: VolunteerTask[];
  activeTab: 'available' | 'active';
  onAcceptTask: (id: number) => void;
  onScanQr: (taskId: number) => void;
}

export const MissionList: React.FC<MissionListProps> = ({ tasks, activeTab, onAcceptTask, onScanQr }) => {
  const [filterDistance, setFilterDistance] = useState<'all' | 'near'>('all');

  const filteredTasks = tasks.filter(t => {
      if (t.status !== activeTab) return false;
      if (filterDistance === 'near' && t.distance > 2) return false;
      return true;
  });

  return (
    <div className="space-y-4 animate-in fade-in">
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

        {filteredTasks.length === 0 && (
            <EmptyState 
                icon={Search}
                title="Tidak Ada Misi"
                description={activeTab === 'available' ? "Saat ini belum ada misi pengantaran yang tersedia di area Anda." : "Anda belum mengambil misi apapun."}
            />
        )}

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
                  <Button onClick={() => onAcceptTask(task.id)}>Ambil Misi</Button>
                ) : (
                  <>
                    <Button variant="outline"><Navigation className="w-4 h-4 mr-2" /> Rute</Button>
                    <Button onClick={() => onScanQr(task.id)} className={task.stage === 'dropoff' ? 'bg-green-600 hover:bg-green-500' : ''}>
                        <ScanLine className="w-4 h-4 mr-2" /> 
                        {task.stage === 'pickup' ? 'Scan QR Penyedia' : 'Scan QR Penerima'}
                    </Button>
                  </>
                )}
              </div>
            </div>
        ))}
    </div>
  );
};
