
import React, { useState, useEffect } from 'react';
import { UserRole, ClaimHistoryItem, SavedItem, Address } from '../../types';
import { User, MapPin, Shield, HelpCircle, Moon, Sun, LogOut, ChevronRight, ArrowLeft, Heart, Store } from 'lucide-react';
import { Button } from '../components/Button';
import { ProfileHeader } from './components/ProfileHeader';
import { EditProfile } from './components/EditProfile';
import { AddressList } from './components/AddressList';
import { SecuritySettings } from './components/SecuritySettings';
import { FaqSection } from './components/FaqSection';
import { SavedItems } from './components/SavedItems';
import { ClaimHistory } from './components/ClaimHistory';

interface ProfileIndexProps {
  role: UserRole;
  onLogout: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  initialView?: 'main' | 'history';
}

type ProfileView = 'main' | 'edit' | 'address' | 'security' | 'faq' | 'saved' | 'history';

export const ProfileIndex: React.FC<ProfileIndexProps> = ({ role, onLogout, isDarkMode, toggleTheme, initialView = 'main' }) => {
  const [currentView, setCurrentView] = useState<ProfileView>(initialView);
  
  // State Management (Lifted from components)
  const [userData, setUserData] = useState({
    name: role === 'provider' ? "Restoran Berkah" : role === 'volunteer' ? "Budi Santoso" : "Ibu Siti Aminah",
    email: "user@foodairescue.com",
    phone: "812-3456-7890",
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${role}`
  });
  const [bannerImage, setBannerImage] = useState<string | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([
    { id: '1', label: 'Rumah', fullAddress: 'Jl. Asia Afrika No. 1, Bandung', receiverName: 'Siti Aminah', phone: '081234567890', isPrimary: true }
  ]);
  const [savedItems, setSavedItems] = useState<SavedItem[]>([
    { id: '101', name: 'Paket Sayur', provider: 'Pasar Modern', image: 'https://images.unsplash.com/photo-1573246123716-6b1782bfc499', status: 'available' }
  ]);
  const [history] = useState<ClaimHistoryItem[]>([
    { id: '1', foodName: 'Roti Manis', providerName: 'Bakery Lestari', date: 'Baru Saja', status: 'active', imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff', uniqueCode: 'CLAIM-123' }
  ]);

  useEffect(() => { setCurrentView(initialView) }, [initialView]);

  const renderHeader = (title: string, action?: React.ReactNode) => (
    <div className="flex items-center justify-between mb-6 px-6 pt-6">
      <div className="flex items-center gap-4">
        <button onClick={() => setCurrentView('main')} className="p-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors">
          <ArrowLeft className="w-5 h-5 dark:text-white" />
        </button>
        <h2 className="text-xl font-bold text-stone-900 dark:text-white">{title}</h2>
      </div>
      {action}
    </div>
  );

  const MenuButton = ({ icon: Icon, label, onClick, last }: any) => (
    <button onClick={onClick} className={`w-full flex items-center justify-between p-4 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors ${!last ? 'border-b border-stone-100 dark:border-stone-800' : ''}`}>
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-950 flex items-center justify-center text-stone-500 dark:text-stone-400"><Icon className="w-4 h-4 text-orange-500 dark:text-stone-400" /></div>
            <span className="text-stone-900 dark:text-stone-200 text-sm font-medium">{label}</span>
        </div>
        <ChevronRight className="w-4 h-4 text-stone-400" />
    </button>
  );

  // Sub-Views
  if (currentView === 'edit') return <div className="min-h-screen bg-[#FDFBF7] dark:bg-stone-950">{renderHeader("Edit Profil")}<EditProfile userData={userData} onSave={(data) => {setUserData(data); setCurrentView('main');}} /></div>;
  if (currentView === 'address') return <div className="min-h-screen bg-[#FDFBF7] dark:bg-stone-950">{renderHeader("Alamat Tersimpan")}<AddressList addresses={addresses} onAddAddress={(addr) => setAddresses([...addresses, addr])} /></div>;
  if (currentView === 'security') return <div className="min-h-screen bg-[#FDFBF7] dark:bg-stone-950">{renderHeader("Keamanan")}<SecuritySettings /></div>;
  if (currentView === 'faq') return <div className="min-h-screen bg-[#FDFBF7] dark:bg-stone-950">{renderHeader("Bantuan")}<FaqSection /></div>;
  if (currentView === 'saved') return <div className="min-h-screen bg-[#FDFBF7] dark:bg-stone-950">{renderHeader("Disimpan")}<SavedItems items={savedItems} onDelete={(ids) => setSavedItems(savedItems.filter(i => !ids.has(i.id)))} /></div>;
  if (currentView === 'history') return <div className="min-h-screen bg-[#FDFBF7] dark:bg-stone-950">{renderHeader("Riwayat Klaim")}<ClaimHistory history={history} /></div>;

  // Main View
  return (
    <div className="pb-24 bg-[#FDFBF7] dark:bg-stone-950 min-h-screen transition-colors duration-300">
        <ProfileHeader 
            userData={userData} 
            role={role} 
            bannerImage={bannerImage} 
            onEditBanner={() => { 
                const url = prompt("Masukkan URL Gambar Banner:");
                if(url) setBannerImage(url); 
            }}
            onEditAvatar={(e) => {
                if(e.target.files?.[0]) {
                    const reader = new FileReader();
                    reader.onloadend = () => setUserData({...userData, avatar: reader.result as string});
                    reader.readAsDataURL(e.target.files[0]);
                }
            }}
        />

        <div className="mt-8 px-4 space-y-3 max-w-lg mx-auto">
            {role === 'receiver' && (
                <>
                    <h3 className="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-2 ml-2">Aktivitas</h3>
                    <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden shadow-sm">
                        <MenuButton icon={Store} label="Riwayat Klaim" onClick={() => setCurrentView('history')} />
                        <MenuButton icon={Heart} label="Makanan Tersimpan" onClick={() => setCurrentView('saved')} last />
                    </div>
                </>
            )}
            <h3 className="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-2 mt-6 ml-2">Akun</h3>
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden shadow-sm">
                <MenuButton icon={User} label="Edit Profil" onClick={() => setCurrentView('edit')} />
                <MenuButton icon={MapPin} label="Alamat Tersimpan" onClick={() => setCurrentView('address')} />
                <MenuButton icon={Shield} label="Keamanan & Privasi" onClick={() => setCurrentView('security')} />
                <button onClick={toggleTheme} className="w-full flex items-center justify-between p-4 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors border-b border-stone-100 dark:border-stone-800">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-950 flex items-center justify-center text-stone-500 dark:text-stone-400">{isDarkMode ? <Moon className="w-4 h-4 text-orange-400" /> : <Sun className="w-4 h-4 text-orange-500" />}</div>
                        <span className="text-stone-900 dark:text-stone-200 text-sm font-medium">Tema Aplikasi</span>
                    </div>
                    <span className="text-xs text-stone-500 mr-2">{isDarkMode ? 'Gelap' : 'Terang'}</span>
                </button>
                <MenuButton icon={HelpCircle} label="Bantuan & FAQ" onClick={() => setCurrentView('faq')} last />
            </div>
            
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden p-2 shadow-sm mt-6">
                <Button variant="danger" onClick={onLogout} className="flex items-center justify-center gap-2"><LogOut className="w-4 h-4" /> Keluar Akun</Button>
            </div>
        </div>
        <div className="mt-8 text-center text-xs text-stone-500 pb-8">Food AI Rescue v1.3.0</div>
    </div>
  );
};
