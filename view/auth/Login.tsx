
import React, { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, UserCircle, Truck, Utensils, ArrowRight, Quote as QuoteIcon, ShieldCheck, Crown } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { LOGIN_QUOTES } from '../../constants';
import { UserRole } from '../../types';

interface LoginViewProps {
  onLogin: (role: UserRole) => void;
  onNavigate: (view: 'login' | 'register' | 'forgot-password') => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin, onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [selectedRole, setSelectedRole] = useState<UserRole>('receiver');

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % LOGIN_QUOTES.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); 
    setIsLoading(false);
    onLogin(selectedRole);
  };

  const currentQuote = LOGIN_QUOTES[quoteIndex];
  // Darker, moodier coffee/food background
  const LEFT_IMAGE_URL = "https://images.unsplash.com/photo-1514326640560-7d063ef2aed5?q=80&w=2080&auto=format&fit=crop";

  return (
    <div className="flex w-full min-h-screen bg-[#050505] font-sans text-stone-100 overflow-hidden">
      {/* LEFT SIDE: Image & Typography */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden border-r border-[#3E2723]">
        <div className="absolute inset-0 z-0">
            <img src={LEFT_IMAGE_URL} alt="Background" className="w-full h-full object-cover opacity-60" />
            {/* Gradient Overlay: Black to Chocolate */}
            <div className="absolute inset-0 bg-gradient-to-br from-black via-[#3E2723]/80 to-[#D84315]/40 mix-blend-multiply"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>
        </div>
        
        {/* Brand */}
        <div className="relative z-10 flex items-center gap-3 animate-in slide-in-from-top-8 duration-700">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center shadow-[0_0_25px_rgba(255,167,38,0.4)] border border-orange-400/30 backdrop-blur-md">
                <Truck className="w-6 h-6 text-white" />
            </div>
            <div>
                <span className="text-2xl font-black tracking-wide text-white drop-shadow-lg block leading-none font-sans">FOOD AI</span>
                <span className="text-xs font-bold text-yellow-500 tracking-[0.35em] block mt-1">RESCUE</span>
            </div>
        </div>

        {/* Quote */}
        <div className="relative z-10 space-y-8 max-w-lg mt-auto mb-12 animate-in slide-in-from-left-8 duration-1000">
            <h1 className="text-6xl font-black leading-none tracking-tight drop-shadow-2xl">
                <span className="text-stone-100">DARI HATI,</span><br />
                {/* Yellow to Orange Gradient Text */}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-orange-600 filter drop-shadow-lg">UNTUK BUMI.</span>
            </h1>
            <div className="relative pl-6 border-l-4 border-orange-600 py-3 backdrop-blur-sm bg-[#3E2723]/30 rounded-r-2xl pr-6 border-t border-r border-b border-white/5">
                 <QuoteIcon className="absolute -top-4 -left-3 w-8 h-8 text-orange-500 fill-orange-500 opacity-80" />
                 <p className="text-xl text-stone-200 font-serif italic leading-relaxed text-shadow-sm">"{currentQuote.text}"</p>
                 <p className="mt-4 text-xs font-bold text-orange-400 uppercase tracking-widest">— {currentQuote.author}</p>
            </div>
        </div>
      </div>

      {/* RIGHT SIDE: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative bg-[#0a0a0a]">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#3E2723] via-[#0a0a0a] to-black opacity-60"></div>
          
          {/* Floating Orbs - Chocolate & Orange */}
          <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-orange-600/10 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="absolute bottom-[-10%] left-[-5%] w-[300px] h-[300px] bg-[#3E2723]/30 rounded-full blur-[80px] pointer-events-none"></div>

          <div className="w-full max-w-md relative z-10">
             
             {/* Mobile Logo */}
             <div className="lg:hidden flex flex-col items-center mb-10">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center shadow-lg shadow-orange-900/50 mb-4">
                    <Truck className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-3xl font-black text-white tracking-tight">Food AI Rescue</h2>
                <p className="text-orange-500 text-[10px] font-bold tracking-[0.3em] mt-2 uppercase">Save Food Share Love</p>
             </div>

             <div className="mb-8 text-center lg:text-left">
                <h2 className="text-4xl font-bold text-white mb-2 tracking-tight">Selamat Datang</h2>
                <p className="text-stone-400 text-base">Masuk untuk memulai aksi nyata hari ini.</p>
             </div>

             {/* Role Selector - Chocolate Theme */}
             <div className="space-y-3 mb-8">
                <p className="text-xs font-bold text-[#8D6E63] uppercase tracking-widest mb-2 ml-1">Pilih Peran Anda</p>
                <div className="grid grid-cols-3 gap-3">
                    {[{ id: 'provider', label: 'Donatur', icon: Utensils }, { id: 'receiver', label: 'Penerima', icon: UserCircle }, { id: 'volunteer', label: 'Relawan', icon: Truck }].map((role) => (
                        <button 
                            key={role.id} 
                            type="button" 
                            onClick={() => setSelectedRole(role.id as UserRole)} 
                            className={`
                                flex flex-col items-center justify-center py-4 rounded-2xl transition-all duration-300 border relative overflow-hidden group 
                                ${selectedRole === role.id 
                                    ? 'bg-gradient-to-b from-[#3E2723] to-[#1a0f0a] border-orange-500/80 text-orange-400 shadow-[0_0_20px_rgba(234,88,12,0.15)] transform scale-[1.02]' 
                                    : 'bg-[#141414] border-stone-800 text-stone-500 hover:bg-[#1f1f1f] hover:text-stone-300 hover:border-stone-700'
                                }
                            `}
                        >
                            {selectedRole === role.id && <div className="absolute inset-0 bg-gradient-to-b from-orange-500/5 to-transparent pointer-events-none"></div>}
                            <role.icon className={`w-6 h-6 mb-2 relative z-10 transition-colors ${selectedRole === role.id ? 'stroke-orange-400 drop-shadow-[0_0_8px_rgba(251,146,60,0.5)]' : 'stroke-current'}`} />
                            <span className="text-[10px] font-bold tracking-wide uppercase relative z-10">{role.label}</span>
                        </button>
                    ))}
                </div>
                 <div className="grid grid-cols-2 gap-3 mt-3">
                    {[{ id: 'admin_manager', label: 'Admin Pengelola', icon: ShieldCheck }, { id: 'super_admin', label: 'Super Admin', icon: Crown }].map((role) => (
                        <button 
                            key={role.id} 
                            type="button" 
                            onClick={() => setSelectedRole(role.id as UserRole)} 
                            className={`
                                flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all duration-300 border text-xs font-bold 
                                ${selectedRole === role.id 
                                    ? 'bg-[#2c1810] border-yellow-600 text-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.1)]' 
                                    : 'bg-[#141414] border-stone-800 text-stone-600 hover:text-stone-400 hover:border-stone-700 hover:bg-[#1f1f1f]'
                                }
                            `}
                        >
                            <role.icon className="w-3.5 h-3.5" /> {role.label}
                        </button>
                    ))}
                </div>
             </div>

             <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-[#8D6E63] uppercase tracking-wider ml-1">Email Address</label>
                    <Input 
                        label="" 
                        type="email" 
                        placeholder="nama@email.com" 
                        icon={<Mail className="w-5 h-5" />} 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        className="bg-[#121212] border-stone-800 text-stone-200 placeholder-stone-700 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 rounded-xl py-4 pl-12 transition-all hover:border-stone-700 hover:bg-[#1a1a1a] shadow-inner" 
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-[#8D6E63] uppercase tracking-wider ml-1">Password</label>
                    <div className="relative">
                        <Input 
                            label="" 
                            type={showPassword ? "text" : "password"} 
                            placeholder="••••••••" 
                            icon={<Lock className="w-5 h-5" />} 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            className="bg-[#121212] border-stone-800 text-stone-200 placeholder-stone-700 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 rounded-xl py-4 pl-12 transition-all hover:border-stone-700 hover:bg-[#1a1a1a] shadow-inner" 
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-[16px] text-stone-500 hover:text-orange-400 transition-colors">
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
                <div className="flex items-center justify-between text-sm mt-3 px-1">
                    <label className="flex items-center gap-2 cursor-pointer group">
                        <input type="checkbox" className="w-4 h-4 rounded border-stone-700 bg-[#1a1a1a] text-orange-500 focus:ring-orange-500/50 transition-all checked:bg-orange-500 checked:border-orange-500" />
                        <span className="text-stone-500 group-hover:text-stone-300 transition-colors font-medium text-xs">Ingat saya</span>
                    </label>
                    <button type="button" onClick={() => onNavigate('forgot-password')} className="text-orange-500 hover:text-yellow-400 font-bold transition-colors text-xs uppercase tracking-wide">Lupa Password?</button>
                </div>
                
                <Button 
                    type="submit" 
                    variant="primary" 
                    isLoading={isLoading} 
                    className="w-full h-14 text-lg font-black bg-gradient-to-r from-yellow-500 via-orange-500 to-orange-600 hover:from-yellow-400 hover:via-orange-400 hover:to-orange-500 text-[#2c1810] shadow-lg shadow-orange-500/20 border-0 rounded-xl mt-8 tracking-wide transition-all duration-300 hover:scale-[1.02] hover:shadow-orange-500/40"
                >
                    MASUK SEKARANG <ArrowRight className="w-6 h-6 ml-2" />
                </Button>
             </form>
             
             <p className="mt-8 text-center text-stone-600 text-sm font-medium">
                Belum punya akun? <button onClick={() => onNavigate('register')} className="font-bold text-stone-300 hover:text-orange-400 transition-colors underline decoration-stone-800 underline-offset-4 decoration-2 hover:decoration-orange-500/50">Daftar sekarang</button>
             </p>
          </div>
      </div>
    </div>
  );
};
