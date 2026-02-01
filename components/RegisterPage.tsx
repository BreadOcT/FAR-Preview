
import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, UserCircle, Truck, Utensils, ArrowRight, User, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';
import { UserRole } from '../types';

interface RegisterPageProps {
  onNavigate: (view: 'login' | 'register' | 'forgot-password') => void;
  onRegister: (role: UserRole) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigate, onRegister }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('receiver');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Password tidak cocok!");
      return;
    }
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    onRegister(selectedRole);
  };

  const LEFT_IMAGE_URL = "https://images.unsplash.com/photo-1488459716781-31db52582fe9?q=80&w=2070&auto=format&fit=crop";

  return (
    <div className="flex w-full min-h-screen bg-black font-sans text-stone-100 overflow-hidden">
      
      {/* LEFT SIDE: Image & Quote */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden">
        <div className="absolute inset-0 z-0">
            <img src={LEFT_IMAGE_URL} alt="Register Background" className="w-full h-full object-cover opacity-50" />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-[#2c1810]/90 to-[#5d3a1a]/40 mix-blend-multiply"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
        </div>

        <div className="relative z-10 animate-in slide-in-from-top-8 duration-700">
            <button onClick={() => onNavigate('login')} className="flex items-center gap-2 text-stone-300 hover:text-white transition-colors group">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 backdrop-blur-sm transition-all">
                    <ArrowLeft className="w-5 h-5" />
                </div>
                <span className="font-medium">Kembali ke Login</span>
            </button>
        </div>

        <div className="relative z-10 space-y-4 max-w-lg mt-auto mb-12 animate-in slide-in-from-left-8 duration-1000">
            <h1 className="text-5xl font-black leading-tight tracking-tight">
                <span className="text-white">GABUNG DALAM</span><br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-orange-600">GERAKAN KEBAIKAN.</span>
            </h1>
            <p className="text-lg text-stone-300 font-medium leading-relaxed">
                Setiap pendaftaran adalah langkah awal untuk menyelamatkan ribuan porsi makanan dan membantu sesama.
            </p>
        </div>
      </div>

      {/* RIGHT SIDE: Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative bg-[#050505] overflow-y-auto">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-[#1a0f05] to-[#2c1810] opacity-80"></div>
          
          {/* Decorative Orbs */}
          <div className="absolute top-[-100px] right-[-100px] w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[120px] pointer-events-none"></div>

          <div className="w-full max-w-md relative z-10 py-10">
             
             <div className="mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Buat Akun Baru</h2>
                <p className="text-stone-400 text-sm">Lengkapi data diri untuk mulai berkontribusi.</p>
             </div>

             {/* ROLE SELECTION BADGES */}
             <div className="mb-8">
                <label className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-3 block">Saya ingin mendaftar sebagai</label>
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { id: 'provider', label: 'Donatur', icon: Utensils, desc: 'Pemilik Resto/Usaha' },
                        { id: 'receiver', label: 'Penerima', icon: UserCircle, desc: 'Individu/Yayasan' },
                        { id: 'volunteer', label: 'Relawan', icon: Truck, desc: 'Pengantar Makanan' },
                    ].map((role) => (
                        <button
                            key={role.id}
                            type="button"
                            onClick={() => setSelectedRole(role.id as UserRole)}
                            className={`
                                relative flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-300 border text-center h-28
                                ${selectedRole === role.id 
                                    ? 'bg-[#2c1810] border-orange-500 text-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.2)]' 
                                    : 'bg-[#121212] border-stone-800 text-stone-500 hover:bg-[#1a1a1a] hover:text-stone-300 hover:border-stone-700'
                                }
                            `}
                        >
                            {selectedRole === role.id && (
                                <div className="absolute top-2 right-2 text-orange-500">
                                    <CheckCircle className="w-4 h-4" />
                                </div>
                            )}
                            <role.icon className={`w-6 h-6 mb-2 ${selectedRole === role.id ? 'stroke-orange-400' : 'stroke-current'}`} />
                            <span className="text-xs font-bold uppercase tracking-wide block">{role.label}</span>
                            <span className="text-[10px] text-stone-500 mt-1 leading-tight block opacity-80">{role.desc}</span>
                        </button>
                    ))}
                </div>
             </div>

             <form onSubmit={handleRegister} className="space-y-4">
                <Input 
                    label="Nama Lengkap / Nama Usaha"
                    placeholder="Contoh: Budi Santoso"
                    icon={<User className="w-5 h-5" />}
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="bg-[#0a0a0a] border-stone-800 text-stone-200 focus:border-orange-500 rounded-xl py-3 pl-12"
                />
                <Input 
                    label="Email Address"
                    type="email"
                    placeholder="nama@email.com"
                    icon={<Mail className="w-5 h-5" />}
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="bg-[#0a0a0a] border-stone-800 text-stone-200 focus:border-orange-500 rounded-xl py-3 pl-12"
                />
                
                <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                        <Input 
                            label="Password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••"
                            icon={<Lock className="w-5 h-5" />}
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            className="bg-[#0a0a0a] border-stone-800 text-stone-200 focus:border-orange-500 rounded-xl py-3 pl-12"
                        />
                    </div>
                    <div className="relative">
                        <Input 
                            label="Konfirmasi"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••"
                            icon={<Lock className="w-5 h-5" />}
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                            className="bg-[#0a0a0a] border-stone-800 text-stone-200 focus:border-orange-500 rounded-xl py-3 pl-12"
                        />
                    </div>
                </div>
                
                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-xs text-stone-500 hover:text-orange-400 flex items-center gap-1 transition-colors"
                    >
                        {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        {showPassword ? 'Sembunyikan Password' : 'Lihat Password'}
                    </button>
                </div>

                <div className="pt-4">
                    <Button 
                        type="submit" 
                        variant="primary" 
                        isLoading={isLoading}
                        className="w-full h-12 text-base font-bold bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-500 hover:from-orange-500 hover:via-amber-500 hover:to-yellow-400 text-white shadow-xl shadow-orange-900/30 border-0 rounded-xl tracking-wide transition-all"
                    >
                        DAFTAR SEKARANG <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                </div>
             </form>

             <p className="mt-8 text-center text-stone-500 text-sm">
                Sudah punya akun? <button onClick={() => onNavigate('login')} className="font-bold text-stone-300 hover:text-orange-400 transition-colors underline decoration-stone-700 underline-offset-4 decoration-2">Masuk disini</button>
             </p>
          </div>
      </div>
    </div>
  );
};
