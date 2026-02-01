
import React, { useState } from 'react';
import { Settings, Lock, Smartphone, Database } from 'lucide-react';
import { Button } from '../../components/Button';

export const SystemConfig: React.FC = () => {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [disableNewSignups, setDisableNewSignups] = useState(false);
  const [aiThreshold, setAiThreshold] = useState(85);

  const handleSaveConfig = () => alert('Konfigurasi sistem berhasil disimpan!');
  const handleRotateKey = () => alert('API Key berhasil dirotasi. Service mungkin restart.');
  const handleForceBackup = () => alert('Backup database dimulai...');

  return (
      <div className="space-y-6 animate-in fade-in">
          <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-stone-900 dark:text-white flex items-center gap-2">
                  <Settings className="w-6 h-6 text-orange-500" /> System Configuration
              </h2>
              <Button onClick={handleSaveConfig} className="w-auto h-9 text-xs">Save Changes</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-stone-900 dark:text-white"><Lock className="w-5 h-5 text-red-500" /> Emergency Controls</h3>
                  <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/30">
                          <div>
                              <p className="font-bold text-red-700 dark:text-red-400">Maintenance Mode</p>
                              <p className="text-xs text-red-500">Shutdown all user access immediately.</p>
                          </div>
                          <button onClick={() => setMaintenanceMode(!maintenanceMode)} className={`w-12 h-6 rounded-full p-1 transition-colors ${maintenanceMode ? 'bg-red-500' : 'bg-stone-300 dark:bg-stone-700'}`}>
                              <div className={`w-4 h-4 bg-white rounded-full transition-transform ${maintenanceMode ? 'translate-x-6' : ''}`}></div>
                          </button>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-stone-50 dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800">
                          <div>
                              <p className="font-bold text-stone-700 dark:text-stone-300">Disable New Signups</p>
                              <p className="text-xs text-stone-500">Prevent new users from registering.</p>
                          </div>
                          <button onClick={() => setDisableNewSignups(!disableNewSignups)} className={`w-12 h-6 rounded-full p-1 transition-colors ${disableNewSignups ? 'bg-orange-500' : 'bg-stone-300 dark:bg-stone-700'}`}>
                              <div className={`w-4 h-4 bg-white rounded-full transition-transform ${disableNewSignups ? 'translate-x-6' : ''}`}></div>
                          </button>
                      </div>
                  </div>
              </div>

              <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm">
                   <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-stone-900 dark:text-white"><Smartphone className="w-5 h-5 text-blue-500" /> AI Parameters</h3>
                   <div className="space-y-4">
                       <div>
                           <div className="flex justify-between mb-2">
                               <label className="text-sm font-bold text-stone-600 dark:text-stone-400">Edible Threshold</label>
                               <span className="text-sm font-bold text-orange-500">{aiThreshold}%</span>
                           </div>
                           <input type="range" min="50" max="99" value={aiThreshold} onChange={(e) => setAiThreshold(parseInt(e.target.value))} className="w-full accent-orange-500" />
                           <p className="text-xs text-stone-400 mt-1">Minimum confidence score for auto-approval.</p>
                       </div>
                   </div>
              </div>

              <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm md:col-span-2">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-stone-900 dark:text-white"><Database className="w-5 h-5 text-purple-500" /> Database & API</h3>
                  <div className="flex gap-4">
                      <Button variant="outline" onClick={handleRotateKey} className="border-red-200 text-red-500 hover:bg-red-50 dark:border-red-900/30 dark:hover:bg-red-900/20">Rotate API Keys</Button>
                      <Button variant="outline" onClick={handleForceBackup}>Force Backup Now</Button>
                      <Button variant="outline">Clear Cache</Button>
                  </div>
              </div>
          </div>
      </div>
  );
};
