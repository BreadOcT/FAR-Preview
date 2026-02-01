
import React, { useState } from 'react';
import { Shield, Key, Eye, EyeOff } from 'lucide-react';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';

export const SecuritySettings: React.FC = () => {
    const [form, setForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
    const [twoFactor, setTwoFactor] = useState(false);
    const [showPass, setShowPass] = useState({ old: false, new: false, confirm: false });

    const handleSave = () => {
        if (!form.oldPassword || !form.newPassword || !form.confirmPassword) return alert("Lengkapi data");
        if (form.newPassword !== form.confirmPassword) return alert("Password tidak cocok");
        alert("Keamanan diperbarui");
        setForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    };

    return (
        <div className="p-6 bg-[#FDFBF7] dark:bg-stone-950 min-h-screen animate-in fade-in">
            <div className="max-w-md mx-auto space-y-6">
                <div className="bg-white dark:bg-stone-900 rounded-2xl p-6 border border-stone-200 dark:border-stone-800 shadow-sm">
                    <h3 className="font-bold text-lg text-stone-900 dark:text-white mb-4 flex items-center gap-2"><Key className="w-5 h-5 text-orange-500" /> Ganti Password</h3>
                    <div className="space-y-4">
                        <Input label="Password Lama" type={showPass.old ? "text" : "password"} value={form.oldPassword} onChange={e => setForm({...form, oldPassword: e.target.value})} 
                            rightElement={<button onClick={() => setShowPass({...showPass, old: !showPass.old})} className="text-stone-400">{showPass.old ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>}</button>} />
                        <Input label="Password Baru" type={showPass.new ? "text" : "password"} value={form.newPassword} onChange={e => setForm({...form, newPassword: e.target.value})} 
                            rightElement={<button onClick={() => setShowPass({...showPass, new: !showPass.new})} className="text-stone-400">{showPass.new ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>}</button>} />
                        <Input label="Konfirmasi Password" type={showPass.confirm ? "text" : "password"} value={form.confirmPassword} onChange={e => setForm({...form, confirmPassword: e.target.value})} 
                            rightElement={<button onClick={() => setShowPass({...showPass, confirm: !showPass.confirm})} className="text-stone-400">{showPass.confirm ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>}</button>} />
                    </div>
                </div>

                <div className="bg-white dark:bg-stone-900 rounded-2xl p-6 border border-stone-200 dark:border-stone-800 shadow-sm">
                    <h3 className="font-bold text-lg text-stone-900 dark:text-white mb-4 flex items-center gap-2"><Shield className="w-5 h-5 text-green-500" /> Autentikasi 2 Faktor</h3>
                    <div className="flex items-center justify-between">
                        <div><p className="text-sm font-medium text-stone-900 dark:text-white">Aktifkan 2FA</p><p className="text-xs text-stone-500 mt-1">Verifikasi tambahan via SMS/Email</p></div>
                        <button onClick={() => setTwoFactor(!twoFactor)} className={`w-12 h-6 rounded-full p-1 transition-colors ${twoFactor ? 'bg-orange-500' : 'bg-stone-300 dark:bg-stone-700'}`}>
                            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${twoFactor ? 'translate-x-6' : ''}`}></div>
                        </button>
                    </div>
                </div>
                <Button onClick={handleSave}>Simpan Pengaturan</Button>
            </div>
        </div>
    );
};
