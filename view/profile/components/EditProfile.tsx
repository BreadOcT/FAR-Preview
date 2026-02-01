
import React, { useState } from 'react';
import { User, Mail, Camera } from 'lucide-react';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';

interface EditProfileProps {
    userData: { name: string; email: string; phone: string; avatar: string; };
    onSave: (data: any) => void;
}

export const EditProfile: React.FC<EditProfileProps> = ({ userData, onSave }) => {
    const [form, setForm] = useState(userData);
    const [phoneError, setPhoneError] = useState('');
    const [emailError, setEmailError] = useState('');

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value.replace(/\D/g, '');
        if (val.startsWith('62')) val = val.substring(2);
        if (val.startsWith('0')) val = val.substring(1);
        val = val.substring(0, 13);
        
        let formatted = val;
        if (val.length > 3) formatted = val.substring(0, 3) + '-' + val.substring(3);
        if (val.length > 7) formatted = formatted.substring(0, 8) + '-' + val.substring(7);

        setPhoneError(val.length < 9 ? 'Nomor terlalu pendek' : '');
        setForm({ ...form, phone: formatted });
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setForm({...form, email: val});
        setEmailError(!val.includes('@') ? 'Format email salah' : '');
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setForm({ ...form, avatar: reader.result as string });
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white dark:bg-stone-900 rounded-2xl p-8 border border-stone-200 dark:border-stone-800 shadow-sm space-y-8 animate-in fade-in">
            <div className="flex flex-col items-center">
                <div className="w-28 h-28 rounded-full bg-stone-800 relative mb-4 ring-4 ring-orange-50 dark:ring-stone-800 group">
                    <img src={form.avatar} className="w-full h-full rounded-full object-cover" alt="avatar" />
                    <label className="absolute bottom-1 right-1 bg-orange-500 hover:bg-orange-600 p-2 rounded-full text-white transition-colors shadow-lg cursor-pointer">
                        <Camera className="w-5 h-5" />
                        <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                    </label>
                </div>
                <p className="text-sm text-stone-500">Ketuk ikon kamera untuk ubah foto</p>
            </div>
            <div className="space-y-5">
                <Input label="Nama Lengkap" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} icon={<User className="w-4 h-4" />} />
                <Input label="Email Address" type="email" value={form.email} onChange={handleEmailChange} icon={<Mail className="w-4 h-4" />} error={emailError} />
                <Input label="Nomor Telepon" type="tel" value={form.phone} onChange={handlePhoneChange} leftAddon={<span className="text-stone-600 dark:text-stone-400">+62</span>} placeholder="8xx-xxxx-xxxx" error={phoneError} />
            </div>
            <div className="pt-4">
                <Button onClick={() => onSave(form)} disabled={!!phoneError || !!emailError}>Simpan Perubahan</Button>
            </div>
        </div>
    );
};
