
import React, { useState } from 'react';
import { Mail, ArrowLeft, Send, CheckCircle } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';

interface ForgotPasswordViewProps {
  onNavigate: (view: 'login' | 'register' | 'forgot-password') => void;
}

export const ForgotPasswordView: React.FC<ForgotPasswordViewProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    setIsSent(true);
  };

  const LEFT_IMAGE_URL = "https://images.unsplash.com/photo-1599059813005-11265ba4b4ce?q=80&w=2070&auto=format&fit=crop";

  return (
    <div className="flex w-full min-h-screen bg-[#050505] font-sans text-stone-100 overflow-hidden">
      {/* LEFT SIDE */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden border-r border-[#3E2723]">
        <div className="absolute inset-0 z-0">
            <img src={LEFT_IMAGE_URL} alt="Background" className="w-full h-full object-cover opacity-50" />
            <div className="absolute inset-0 bg-gradient-to-br from-black via-[#3E2723]/90 to-orange-900/40 mix-blend-multiply"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
        </div>
        
        <div className="relative z-10 animate-in slide-in-from-top-8 duration-700">
            <button onClick={() => onNavigate('login')} className="flex items-center gap-2 text-stone-300 hover:text-white transition-colors group">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 backdrop-blur-sm transition-all border border-white/5">
                    <ArrowLeft className="w-5 h-5" />
                </div>
                <span className="font-medium">Kembali ke Login</span>
            </button>
        </div>

        <div className="relative z-10 max-w-lg mt-auto mb-12">
            <h1 className="text-4xl font-black leading-tight mb-4 drop-shadow-lg">
                KEMBALIKAN AKSES<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-500">AKUN ANDA.</span>
            </h1>
            <p className="text-stone-300 font-medium pl-6 border-l-4 border-orange-600">Kami akan membantu Anda mereset kata sandi agar bisa kembali berkontribusi.</p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative bg-[#0a0a0a]">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-[#1a0f05] to-[#2c1810] opacity-60"></div>
          
          <div className="w-full max-w-md relative z-10">
             <div className="lg:hidden mb-8">
                <button onClick={() => onNavigate('login')} className="flex items-center gap-2 text-stone-400 hover:text-white transition-colors"><ArrowLeft className="w-5 h-5" /> Kembali</button>
             </div>
             
             <div className="mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Lupa Password?</h2>
                <p className="text-stone-400 text-sm">Masukkan email yang terdaftar untuk menerima instruksi reset password.</p>
             </div>

             {isSent ? (
                 <div className="bg-[#141414] border border-green-900/50 rounded-2xl p-8 text-center animate-in zoom-in-95 duration-300 shadow-2xl">
                     <div className="w-16 h-16 bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4 text-green-500 border border-green-900/30">
                         <CheckCircle className="w-8 h-8" />
                     </div>
                     <h3 className="text-xl font-bold text-white mb-2">Email Terkirim!</h3>
                     <p className="text-stone-400 text-sm mb-6 leading-relaxed">Silakan cek inbox (atau folder spam) email <strong className="text-stone-200">{email}</strong> untuk instruksi selanjutnya.</p>
                     <Button variant="outline" onClick={() => onNavigate('login')} className="border-stone-700 text-stone-300 hover:bg-[#1f1f1f] hover:text-white h-12 rounded-xl">
                         Kembali ke Halaman Login
                     </Button>
                 </div>
             ) : (
                 <form onSubmit={handleSubmit} className="space-y-6">
                    <Input 
                        label="Email Address" 
                        type="email" 
                        placeholder="nama@email.com" 
                        icon={<Mail className="w-5 h-5" />} 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        className="bg-[#121212] border-stone-800 text-stone-200 focus:border-orange-500 rounded-xl py-4 pl-12 transition-all hover:border-stone-700" 
                        required 
                    />
                    
                    <Button 
                        type="submit" 
                        variant="primary" 
                        isLoading={isLoading} 
                        className="w-full h-14 text-base font-black bg-gradient-to-r from-yellow-500 via-orange-500 to-orange-600 hover:from-yellow-400 hover:via-orange-400 hover:to-orange-500 text-[#2c1810] shadow-xl shadow-orange-900/30 border-0 rounded-xl tracking-wide transition-all duration-300 hover:scale-[1.02]"
                    >
                        KIRIM LINK RESET <Send className="w-4 h-4 ml-2" />
                    </Button>
                 </form>
             )}
          </div>
      </div>
    </div>
  );
};
