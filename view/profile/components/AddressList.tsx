
import React, { useState } from 'react';
import { MapPin, Plus } from 'lucide-react';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Address } from '../../../types';

interface AddressListProps {
    addresses: Address[];
    onAddAddress: (addr: Address) => void;
}

export const AddressList: React.FC<AddressListProps> = ({ addresses, onAddAddress }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [newAddress, setNewAddress] = useState({ label: '', fullAddress: '', receiverName: '', phone: '' });

    const handleSave = () => {
        if (!newAddress.label || !newAddress.fullAddress) return alert("Lengkapi data");
        onAddAddress({ id: Date.now().toString(), ...newAddress, isPrimary: addresses.length === 0 });
        setIsAdding(false);
        setNewAddress({ label: '', fullAddress: '', receiverName: '', phone: '' });
    };

    return (
        <div className="p-6 bg-[#FDFBF7] dark:bg-stone-950 min-h-screen animate-in fade-in">
            {isAdding ? (
                <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-4 shadow-sm">
                    <h3 className="font-bold text-stone-900 dark:text-white mb-2">Tambah Alamat Baru</h3>
                    <Input label="Label Alamat" value={newAddress.label} onChange={e => setNewAddress({...newAddress, label: e.target.value})} placeholder="Rumah / Kantor" />
                    <Input label="Nama Penerima" value={newAddress.receiverName} onChange={e => setNewAddress({...newAddress, receiverName: e.target.value})} />
                    <Input label="Nomor HP" value={newAddress.phone} onChange={e => setNewAddress({...newAddress, phone: e.target.value})} />
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-stone-600 dark:text-stone-400">Alamat Lengkap</label>
                        <textarea className="w-full bg-stone-50 dark:bg-stone-900/50 border border-stone-300 dark:border-stone-800 text-stone-900 dark:text-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500" rows={3} value={newAddress.fullAddress} onChange={e => setNewAddress({...newAddress, fullAddress: e.target.value})} />
                    </div>
                    <div className="flex gap-3 pt-2">
                        <Button variant="ghost" onClick={() => setIsAdding(false)}>Batal</Button>
                        <Button onClick={handleSave}>Simpan Alamat</Button>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    {addresses.map(addr => (
                        <div key={addr.id} className={`bg-white dark:bg-stone-900 p-4 rounded-xl border ${addr.isPrimary ? 'border-orange-500 ring-1 ring-orange-500/20' : 'border-stone-200 dark:border-stone-800'} relative shadow-sm`}>
                            {addr.isPrimary && <div className="absolute top-4 right-4 text-orange-600 dark:text-orange-500 text-xs bg-orange-100 dark:bg-orange-900/20 px-2 py-1 rounded font-bold">Utama</div>}
                            <h4 className="font-bold text-stone-900 dark:text-white mb-1 flex items-center gap-2"><MapPin className="w-4 h-4 text-stone-400" /> {addr.label}</h4>
                            <p className="text-stone-600 dark:text-stone-300 text-sm mt-2">{addr.fullAddress}</p>
                            <p className="text-stone-500 dark:text-stone-400 text-xs mt-1">{addr.receiverName} • {addr.phone}</p>
                        </div>
                    ))}
                    <Button variant="outline" className="mt-4 border-dashed" onClick={() => setIsAdding(true)}>
                        <Plus className="w-4 h-4 mr-2" /> Tambah Alamat Baru
                    </Button>
                </div>
            )}
        </div>
    );
};
