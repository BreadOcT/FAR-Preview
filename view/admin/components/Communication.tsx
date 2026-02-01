
import React, { useState } from 'react';
import { Megaphone, Send, Inbox } from 'lucide-react';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { EmptyState } from '../../common/EmptyState';
import { BroadcastMessage } from '../../../types';

export const Communication: React.FC = () => {
  const [broadcastTab, setBroadcastTab] = useState<'compose' | 'history'>('compose');
  const [messages, setMessages] = useState<BroadcastMessage[]>([
    { id: '1', title: 'Update Sistem v2.0', content: 'Kami telah memperbarui sistem poin...', target: 'all', status: 'sent', sentAt: '20 Feb 2025', readCount: 850 },
  ]);

  const handleSendBroadcast = () => {
      const newMsg: BroadcastMessage = {
          id: Date.now().toString(),
          title: 'Broadcast Baru',
          content: 'Konten pesan...',
          target: 'all',
          status: 'sent',
          sentAt: 'Baru saja',
          readCount: 0
      };
      setMessages([newMsg, ...messages]);
      setBroadcastTab('history');
      alert('Pesan broadcast telah dikirim!');
  };

  return (
      <div className="space-y-6 animate-in fade-in">
          <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-stone-900 dark:text-white flex items-center gap-2">
                  <Megaphone className="w-6 h-6 text-orange-500" /> Komunikasi Broadcast
              </h2>
          </div>

          <div className="flex gap-2 mb-4 bg-stone-100 dark:bg-stone-900 p-1 rounded-xl w-fit">
              <button onClick={() => setBroadcastTab('compose')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${broadcastTab === 'compose' ? 'bg-white dark:bg-stone-800 shadow-sm text-stone-900 dark:text-white' : 'text-stone-500'}`}>Tulis Pesan</button>
              <button onClick={() => setBroadcastTab('history')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${broadcastTab === 'history' ? 'bg-white dark:bg-stone-800 shadow-sm text-stone-900 dark:text-white' : 'text-stone-500'}`}>Riwayat</button>
          </div>

          {broadcastTab === 'compose' && (
              <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm max-w-2xl">
                  <div className="space-y-4">
                      <Input label="Judul Broadcast" placeholder="Contoh: Info Pemeliharaan Sistem" />
                      <div className="space-y-2">
                          <label className="text-sm font-bold text-stone-600 dark:text-stone-400">Target Penerima</label>
                          <select className="w-full p-3 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl text-stone-900 dark:text-stone-200">
                              <option value="all">Semua User</option>
                              <option value="provider">Hanya Provider</option>
                              <option value="volunteer">Hanya Relawan</option>
                          </select>
                      </div>
                      <div className="space-y-2">
                          <label className="text-sm font-bold text-stone-600 dark:text-stone-400">Isi Pesan</label>
                          <textarea className="w-full h-32 p-3 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl focus:outline-none focus:border-orange-500 text-stone-900 dark:text-stone-200" placeholder="Tulis pesan anda disini..."></textarea>
                      </div>
                      <div className="flex justify-end pt-4">
                          <Button className="w-auto" onClick={handleSendBroadcast}><Send className="w-4 h-4 mr-2" /> Kirim Broadcast</Button>
                      </div>
                  </div>
              </div>
          )}

          {broadcastTab === 'history' && (
              <div className="space-y-4">
                  {messages.length === 0 && (
                      <EmptyState 
                        icon={Inbox}
                        title="Belum Ada Pesan"
                        description="Riwayat pesan broadcast yang dikirim akan muncul di sini."
                      />
                  )}
                  {messages.map(msg => (
                      <div key={msg.id} className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm">
                          <div className="flex justify-between items-start mb-2">
                              <h4 className="font-bold text-lg text-stone-900 dark:text-white">{msg.title}</h4>
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-bold uppercase">{msg.status}</span>
                          </div>
                          <p className="text-stone-600 dark:text-stone-300 mb-3">{msg.content}</p>
                          <div className="flex justify-between text-xs text-stone-500">
                              <span>Target: {msg.target}</span>
                              <span>Dibaca: {msg.readCount} users</span>
                              <span>{msg.sentAt}</span>
                          </div>
                      </div>
                  ))}
              </div>
          )}
      </div>
  );
};
