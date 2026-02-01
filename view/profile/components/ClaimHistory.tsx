
import React, { useState } from 'react';
import { QrCode, MessageSquare, AlertTriangle, X } from 'lucide-react';
import { Button } from '../../components/Button';
import { ClaimHistoryItem } from '../../../types';

export const ClaimHistory: React.FC<{ history: ClaimHistoryItem[] }> = ({ history }) => {
    const [showQr, setShowQr] = useState<string | null>(null);

    return (
        <div className="p-6 bg-[#FDFBF7] dark:bg-stone-950 min-h-screen animate-in fade-in">
            <div className="space-y-4">
                {history.map(item => (
                    <div key={item.id} className="bg-white dark:bg-stone-900 p-4 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col md:flex-row gap-4">
                        <div className="flex gap-4 flex-1">
                            <img src={item.imageUrl} alt={item.foodName} className="w-20 h-20 rounded-lg object-cover bg-stone-100" />
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h4 className="font-bold text-stone-900 dark:text-white">{item.foodName}</h4>
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${item.status === 'completed' ? 'bg-green-100 text-green-600' : item.status === 'active' ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'}`}>{item.status}</span>
                                </div>
                                <p className="text-sm text-stone-500 mt-1">{item.providerName}</p>
                                <p className="text-xs text-stone-400 mt-2">{item.date}</p>
                            </div>
                        </div>
                        <div className="flex md:flex-col justify-end items-end gap-2 border-t md:border-t-0 md:border-l border-stone-100 dark:border-stone-800 pt-3 md:pt-0 md:pl-4">
                            {item.status === 'active' && <Button className="w-full md:w-auto text-xs px-4 h-9" onClick={() => setShowQr(item.uniqueCode || 'ERR')}> <QrCode className="w-3 h-3 mr-1" /> Kode </Button>}
                            {item.status === 'completed' && <div className="flex gap-2 w-full md:w-auto"><Button variant="outline" className="text-xs px-4 h-9"><MessageSquare className="w-3 h-3 mr-1" /> Ulas</Button><Button variant="ghost" className="text-xs px-4 h-9 text-red-500"><AlertTriangle className="w-3 h-3 mr-1" /> Lapor</Button></div>}
                        </div>
                    </div>
                ))}
            </div>
            {showQr && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl max-w-sm w-full relative text-center">
                        <button onClick={() => setShowQr(null)} className="absolute top-4 right-4 text-stone-400"><X className="w-6 h-6" /></button>
                        <h3 className="text-xl font-bold dark:text-white mb-4">Kode Penukaran</h3>
                        <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${showQr}`} alt="QR" className="w-48 h-48 mx-auto mb-4 border p-2 rounded-xl" />
                        <p className="text-2xl font-mono font-bold tracking-widest text-stone-900 dark:text-white bg-stone-100 dark:bg-stone-800 py-2 rounded-lg">{showQr}</p>
                    </div>
                </div>
            )}
        </div>
    );
};
