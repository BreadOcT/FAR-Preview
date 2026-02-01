
import React, { useState } from 'react';
import { Users, Gift, UserPlus, X, PlusCircle, Smile } from 'lucide-react';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { UserData, Badge } from '../../../types';

export const Community: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([
    { id: '1', name: 'Restoran Berkah', role: 'Provider', email: 'resto@berkah.com', status: 'active', points: 1250, joinDate: 'Jan 2025' },
    { id: '2', name: 'Budi Santoso', role: 'Volunteer', email: 'budi@gmail.com', status: 'active', points: 3850, joinDate: 'Feb 2025' },
  ]);
  const [badges, setBadges] = useState<Badge[]>([
    { id: '1', name: 'Climate Hero', icon: '🌍', description: 'Menyelamatkan 100kg+ CO2', awardedTo: 15 },
  ]);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [badgeForm, setBadgeForm] = useState<Badge>({ id: '', name: '', icon: '', description: '', awardedTo: 0 });

  const handleUserAction = (action: 'suspend' | 'activate' | 'save') => {
      if (!selectedUser) return;
      if (action === 'save') {
          if (selectedUser.id === 'new') {
              setUsers([...users, { ...selectedUser, id: Date.now().toString() }]);
          } else {
              setUsers(users.map(u => u.id === selectedUser.id ? selectedUser : u));
          }
      }
      setSelectedUser(null);
  };

  const handleSaveBadge = () => {
      setBadges([...badges, { ...badgeForm, id: Date.now().toString() }]);
      setShowBadgeModal(false);
  };

  return (
    <div className="animate-in fade-in space-y-6">
       <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-stone-900 dark:text-white flex items-center gap-2">
              <Users className="w-6 h-6 text-orange-500" /> Manajemen User & Reward
          </h2>
          <Button className="w-auto text-xs h-9" onClick={() => setSelectedUser({id:'new', name:'', email:'', role:'volunteer', status:'active', points:0, joinDate:''})}><UserPlus className="w-4 h-4 mr-2" /> Tambah Manual</Button>
       </div>
       
       <div className="bg-gradient-to-r from-purple-900 to-indigo-900 rounded-2xl p-6 text-white mb-6">
          <div className="flex justify-between items-center mb-4">
             <h3 className="font-bold flex items-center gap-2"><Gift className="w-5 h-5" /> Badge & Gamification</h3>
             <Button onClick={() => setShowBadgeModal(true)} className="w-auto px-4 h-8 bg-white/20 hover:bg-white/30 border-0 text-xs">Manage Badges</Button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2">
             {badges.map(badge => (
                 <div key={badge.id} className="bg-white/10 p-3 rounded-xl min-w-[200px] border border-white/10">
                    <div className="text-2xl mb-2">{badge.icon}</div>
                    <p className="font-bold text-sm">{badge.name}</p>
                    <p className="text-xs text-purple-200">{badge.description}</p>
                 </div>
             ))}
          </div>
       </div>

       <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
             <thead className="bg-stone-50 dark:bg-stone-950 text-stone-500 text-xs uppercase font-bold">
                <tr><th className="p-4">User</th><th className="p-4">Role</th><th className="p-4">Points</th><th className="p-4">Status</th><th className="p-4 text-right">Aksi</th></tr>
             </thead>
             <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                {users.map(user => (
                   <tr key={user.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/50">
                      <td className="p-4">
                          <div className="font-bold text-sm text-stone-900 dark:text-white">{user.name}</div>
                          <div className="text-xs text-stone-500">{user.email}</div>
                      </td>
                      <td className="p-4 text-sm font-medium text-stone-600 dark:text-stone-300">{user.role}</td>
                      <td className="p-4 text-sm font-medium text-stone-900 dark:text-white">{user.points}</td>
                      <td className="p-4"><span className={`px-2 py-1 rounded text-xs uppercase font-bold ${user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{user.status}</span></td>
                      <td className="p-4 text-right"><Button variant="outline" className="h-8 text-xs px-3" onClick={() => setSelectedUser(user)}>Edit</Button></td>
                   </tr>
                ))}
             </tbody>
          </table>
       </div>

       {/* Edit User Modal */}
       {selectedUser && (
           <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
               <div className="bg-white dark:bg-stone-900 w-full max-w-md rounded-2xl shadow-2xl p-6">
                   <div className="flex justify-between mb-4">
                       <h3 className="font-bold text-lg text-stone-900 dark:text-white">{selectedUser.id === 'new' ? 'Tambah User' : 'Edit User'}</h3>
                       <button onClick={() => setSelectedUser(null)}><X className="w-5 h-5 text-stone-400" /></button>
                   </div>
                   <div className="space-y-4">
                       <Input label="Nama" value={selectedUser.name} onChange={e => setSelectedUser({...selectedUser, name: e.target.value})} />
                       <Input label="Email" value={selectedUser.email} onChange={e => setSelectedUser({...selectedUser, email: e.target.value})} />
                       <div className="flex justify-end gap-2 mt-4">
                           <Button variant="ghost" onClick={() => setSelectedUser(null)}>Batal</Button>
                           <Button onClick={() => handleUserAction('save')}>Simpan</Button>
                       </div>
                   </div>
               </div>
           </div>
       )}

       {/* Add Badge Modal */}
       {showBadgeModal && (
           <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
               <div className="bg-white dark:bg-stone-900 w-full max-w-sm rounded-2xl shadow-2xl p-6">
                   <h3 className="font-bold text-lg mb-4 text-stone-900 dark:text-white">Tambah Badge</h3>
                   <div className="space-y-4">
                       <Input label="Nama Badge" value={badgeForm.name} onChange={e => setBadgeForm({...badgeForm, name: e.target.value})} />
                       <Input label="Icon (Emoji)" value={badgeForm.icon} onChange={e => setBadgeForm({...badgeForm, icon: e.target.value})} />
                       <Input label="Deskripsi" value={badgeForm.description} onChange={e => setBadgeForm({...badgeForm, description: e.target.value})} />
                       <div className="flex justify-end gap-2">
                           <Button variant="ghost" onClick={() => setShowBadgeModal(false)}>Batal</Button>
                           <Button onClick={handleSaveBadge}>Simpan Badge</Button>
                       </div>
                   </div>
               </div>
           </div>
       )}
    </div>
  );
};
