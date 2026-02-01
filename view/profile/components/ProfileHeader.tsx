
import React from 'react';
import { Store, Truck, User, Edit, Mail, Phone, Package, Star, Zap, CheckCircle, Clock, Award } from 'lucide-react';
import { UserRole } from '../../../types';

interface ProfileHeaderProps {
  userData: {
    name: string;
    email: string;
    phone: string;
    avatar: string;
  };
  role: UserRole;
  bannerImage: string | null;
  onEditBanner: () => void;
  onEditAvatar: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ userData, role, bannerImage, onEditBanner, onEditAvatar }) => {
  
  // Mock scores based on role
  const donaturScores = { totalDonations: 1250, rating: 4.8, responseRate: '98%' };
  const volunteerScores = { missions: 42, hours: 34, points: 3850 };

  return (
    <div className="mb-8">
        <div className="h-48 relative rounded-3xl shadow-xl shadow-orange-500/20 overflow-hidden group mx-4 mt-4">
            <div className={`absolute inset-0 ${!bannerImage ? 'bg-gradient-to-br from-orange-400 to-amber-500 dark:from-orange-500 dark:to-stone-900' : ''}`}>
                {bannerImage && <img src={bannerImage} alt="Banner" className="w-full h-full object-cover" />}
            </div>
            
            <button onClick={onEditBanner} className="absolute top-4 right-4 bg-black/30 hover:bg-black/50 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all opacity-0 group-hover:opacity-100">
                <Edit className="w-3 h-3" /> Edit Cover
            </button>

            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
                <div className="w-24 h-24 rounded-full bg-white dark:bg-stone-900 border-4 border-stone-50 dark:border-stone-950 p-1 shadow-lg relative group/avatar">
                    <div className="w-full h-full rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-400 overflow-hidden relative">
                        <img src={userData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                        <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 cursor-pointer transition-opacity">
                            <Edit className="w-6 h-6 text-white" />
                            <input type="file" accept="image/*" className="hidden" onChange={onEditAvatar} />
                        </label>
                    </div>
                </div>
                <div className="absolute bottom-0 right-0 bg-orange-500 rounded-full p-1.5 border-2 border-white dark:border-stone-950 shadow-md">
                    {role === 'provider' && <Store className="w-3 h-3 text-white" />}
                    {role === 'volunteer' && <Truck className="w-3 h-3 text-white" />}
                    {role === 'receiver' && <User className="w-3 h-3 text-white" />}
                </div>
            </div>
        </div>

        <div className="mt-14 text-center px-4">
            <h1 className="text-xl font-bold text-stone-900 dark:text-white">{userData.name}</h1>
            <p className="text-stone-500 dark:text-stone-400 text-sm font-medium">
                {role === 'provider' ? 'Donatur Terverifikasi' : role === 'volunteer' ? 'Relawan' : 'Penerima Manfaat'}
            </p>
            
            <div className="flex justify-center gap-4 mt-4 text-sm text-stone-500 dark:text-stone-400">
                <div className="flex items-center gap-1"><Mail className="w-3 h-3" /> {userData.email}</div>
            </div>
            <div className="flex justify-center gap-4 mt-1 text-sm text-stone-500 dark:text-stone-400">
                <div className="flex items-center gap-1"><Phone className="w-3 h-3" /> {userData.phone}</div>
            </div>

            {/* Score Cards */}
            {role === 'provider' && (
                <div className="grid grid-cols-3 gap-3 px-4 mt-6 max-w-md mx-auto">
                    <ScoreCard icon={Package} value={donaturScores.totalDonations} label="Donasi" color="orange" />
                    <ScoreCard icon={Star} value={donaturScores.rating} label="Rating" color="yellow" />
                    <ScoreCard icon={Zap} value={donaturScores.responseRate} label="Respon" color="blue" />
                </div>
            )}
            {role === 'volunteer' && (
                <div className="grid grid-cols-3 gap-3 px-4 mt-6 max-w-md mx-auto">
                    <ScoreCard icon={CheckCircle} value={volunteerScores.missions} label="Misi" color="blue" />
                    <ScoreCard icon={Clock} value={volunteerScores.hours} label="Jam" color="purple" />
                    <ScoreCard icon={Award} value={volunteerScores.points} label="Poin" color="orange" />
                </div>
            )}
        </div>
    </div>
  );
};

const ScoreCard = ({ icon: Icon, value, label, color }: any) => {
    const colors: any = {
        orange: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
        yellow: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
        blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
        purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
    };
    return (
        <div className="bg-white dark:bg-stone-900 p-3 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col items-center">
            <div className={`p-2 rounded-full mb-1 ${colors[color]}`}><Icon className="w-4 h-4" /></div>
            <p className="text-lg font-bold text-stone-900 dark:text-white">{value}</p>
            <p className="text-[10px] text-stone-500 uppercase font-bold tracking-wide">{label}</p>
        </div>
    );
};
