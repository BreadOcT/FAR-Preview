
import React, { useState, useEffect } from 'react';
import { UserRole, ClaimHistoryItem, SavedItem, Address, FAQItem } from '../types';
import { 
  User, MapPin, Mail, Phone, Award, Settings, 
  ChevronRight, LogOut, Shield, Star, Heart, Store, Truck,
  ArrowLeft, Bell, Moon, Sun, Save, AlertTriangle, MessageSquare, Trash2, Plus, CheckSquare, Square, HelpCircle, ChevronDown, ChevronUp, Camera, Filter, CheckCircle, QrCode, X, Zap, Package, Clock, BookOpen, Key, Edit, Eye, EyeOff
} from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';

interface ProfilePageProps {
  role: UserRole;
  onLogout: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  initialView?: 'main' | 'history';
}

type ProfileView = 'main' | 'edit' | 'address' | 'security' | 'settings' | 'history' | 'saved' | 'faq';

interface FAQCategory {
  category: string;
  items: FAQItem[];
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ role, onLogout, isDarkMode, toggleTheme, initialView = 'main' }) => {
  const [currentView, setCurrentView] = useState<ProfileView>(initialView);

  useEffect(() => {
    setCurrentView(initialView);
  }, [initialView]);

  // --- Mock Data ---
  const [userData, setUserData] = useState({
    name: role === 'provider' ? "Restoran Berkah" : role === 'volunteer' ? "Budi Santoso" : "Ibu Siti Aminah",
    email: "user@foodairescue.com",
    phone: "812-3456-7890", // Default format
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${role === 'provider' ? "Restoran Berkah" : role === 'volunteer' ? "Budi Santoso" : "Ibu Siti Aminah"}`
  });

  // Phone Validation State
  const [phoneError, setPhoneError] = useState('');
  
  // Email Validation & Change State
  const [emailError, setEmailError] = useState('');
  const [initialEmail] = useState(userData.email);
  const [showEmailVerifyModal, setShowEmailVerifyModal] = useState(false);
  const [verifyPassword, setVerifyPassword] = useState('');

  const [bannerImage, setBannerImage] = useState<string | null>(null);
  const [showBannerEdit, setShowBannerEdit] = useState(false);
  const [tempBannerUrl, setTempBannerUrl] = useState('');

  const [addresses, setAddresses] = useState<Address[]>([
    { id: '1', label: 'Rumah', fullAddress: 'Jl. Asia Afrika No. 1, Bandung', receiverName: 'Siti Aminah', phone: '081234567890', isPrimary: true },
    { id: '2', label: 'Kantor', fullAddress: 'Jl. Soekarno Hatta No. 200, Bandung', receiverName: 'Siti Aminah', phone: '081234567890', isPrimary: false }
  ]);

  const [savedItems, setSavedItems] = useState<SavedItem[]>([
    { id: '101', name: 'Paket Sayur Segar', provider: 'Pasar Modern', image: 'https://images.unsplash.com/photo-1573246123716-6b1782bfc499?q=80&w=1965&auto=format&fit=crop', status: 'available' },
    { id: '102', name: 'Donat Kentang', provider: 'Dunkin KW', image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=2157&auto=format&fit=crop', status: 'claimed' },
    { id: '103', name: 'Nasi Kuning Box', provider: 'Warung Tegal', image: 'https://images.unsplash.com/photo-1562967960-f6556b6271c6?q=80&w=2000&auto=format&fit=crop', status: 'available' }
  ]);

  const [history, setHistory] = useState<ClaimHistoryItem[]>([
    {
      id: '0', foodName: 'Roti Manis Assorted (Baru)', providerName: 'Bakery Lestari', date: 'Baru Saja', 
      status: 'active', imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=2072&auto=format&fit=crop', uniqueCode: 'CLAIM-12345'
    },
    {
      id: '1', foodName: 'Roti Manis Assorted', providerName: 'Bakery Lestari', date: '20 Feb 2025', 
      status: 'completed', imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=2072&auto=format&fit=crop'
    },
    {
      id: '2', foodName: 'Nasi Goreng Spesial', providerName: 'Resto Padang', date: '18 Feb 2025', 
      status: 'completed', imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f10842f88?q=80&w=1000'
    },
    {
      id: '3', foodName: 'Bubur Ayam', providerName: 'Bubur Mang Oleh', date: '15 Feb 2025', 
      status: 'cancelled', imageUrl: 'https://images.unsplash.com/photo-1511690656952-34342d5c2899?q=80&w=1000'
    }
  ]);

  // Scores for Donatur (Provider)
  const donaturScores = {
    totalDonations: 1250,
    rating: 4.8,
    responseRate: '98%'
  };

  // Scores for Volunteer
  const volunteerScores = {
    missions: 42,
    hours: 34,
    points: 3850
  };

  // --- SOP & FAQ Data ---
  const faqCategories: FAQCategory[] = [
    {
      category: "Umum & Keamanan",
      items: [
        { question: "Apa itu Food AI Rescue?", answer: "Platform berbasis AI yang menghubungkan penyedia makanan surplus dengan penerima manfaat dan relawan untuk mengurangi limbah pangan." },
        { question: "Apakah ada biaya layanan?", answer: "Tidak. Aplikasi ini 100% gratis untuk tujuan sosial. Tidak ada biaya pendaftaran atau transaksi bagi penerima manfaat." },
        { question: "Bagaimana privasi data saya?", answer: "Kami menggunakan enkripsi data standar industri. Alamat lengkap hanya ditampilkan kepada pihak yang berkepentingan saat transaksi aktif (misal: Relawan yang menjemput)." }
      ]
    },
    {
      category: "SOP Donatur (Penyedia)",
      items: [
        { question: "Standar Makanan Layak Donasi", answer: "1. Makanan tidak basi/berjamur.\n2. Kemasan tertutup rapat dan higienis.\n3. Sisa durasi aman konsumsi minimal 3 jam untuk makanan basah.\n4. Bukan makanan sisa gigitan/bekas orang lain." },
        { question: "Prosedur Upload Makanan", answer: "1. Foto makanan dengan pencahayaan jelas untuk analisis AI.\n2. Isi detail waktu pembuatan dengan jujur.\n3. Pilih metode pengiriman (Pickup/Delivery).\n4. Tunggu verifikasi AI (1-5 detik)." },
        { question: "SOP Serah Terima", answer: "Pastikan penerima/relawan menunjukkan QR Code yang valid sebelum menyerahkan makanan. Jangan serahkan jika kode tidak cocok." }
      ]
    },
    {
      category: "SOP Penerima Manfaat",
      items: [
        { question: "Tata Cara Klaim Makanan", answer: "1. Pilih makanan di menu Beranda.\n2. Klik 'Klaim' dan dapatkan Kode Unik/QR.\n3. Datang ke lokasi atau tunggu relawan sesuai metode pengiriman.\n4. Tunjukkan Kode Unik saat menerima makanan." },
        { question: "Etika Pengambilan", answer: "Datang tepat waktu sesuai estimasi. Jika berhalangan, segera batalkan pesanan agar makanan bisa dialihkan ke orang lain yang membutuhkan." },
        { question: "Pelaporan Masalah", answer: "Jika makanan diterima dalam kondisi tidak layak, Lapor via riwayat pesanan maksimal 1 jam setelah diterima dengan menyertakan foto bukti." }
      ]
    },
    {
      category: "SOP Relawan (Volunteer)",
      items: [
        { question: "Tugas Utama Relawan", answer: "Mengantarkan makanan dari Penyedia ke Penerima Manfaat dengan aman dan tepat waktu." },
        { question: "Prosedur Pengantaran", answer: "1. Terima misi di dashboard.\n2. Scan QR di tempat Penyedia saat ambil barang.\n3. Jaga kebersihan makanan selama perjalanan.\n4. Scan QR Penerima saat barang sampai." },
        { question: "Kode Etik Relawan", answer: "Dilarang meminta imbalan uang, dilarang membuka kemasan makanan, dan wajib bersikap sopan kepada kedua belah pihak." }
      ]
    }
  ];

  // --- States for Features ---
  
  // Saved Items Selection & Filter
  const [selectedSavedIds, setSelectedSavedIds] = useState<Set<string>>(new Set());
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [savedFilter, setSavedFilter] = useState<'all' | 'available' | 'claimed'>('all');

  // Add Address Form
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({ label: '', fullAddress: '', receiverName: '', phone: '' });

  // FAQ Accordion
  const [openCategoryIndex, setOpenCategoryIndex] = useState<number | null>(0); // Default open first category
  const [openFaqIndex, setOpenFaqIndex] = useState<string | null>(null);

  // QR Modal
  const [showQrModal, setShowQrModal] = useState<string | null>(null); // Stores the unique code

  // Security Form
  const [securityForm, setSecurityForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  // --- Handlers ---

  const handleContactCS = () => {
    const roleLabel = role === 'provider' ? 'Penyedia (Donatur)' : role === 'volunteer' ? 'Relawan' : 'Penerima Manfaat';
    const message = `Halo CS Food AI Rescue, saya ${userData.name} (${roleLabel}). Saya butuh bantuan terkait: \n\n[Tulis kendala anda disini]`;
    
    // Redirect to WhatsApp
    const waNumber = '6285215376975';
    const url = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const toggleSelection = (id: string) => {
    const newSet = new Set(selectedSavedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedSavedIds(newSet);
  };

  const selectAll = () => {
    if (selectedSavedIds.size === savedItems.length) setSelectedSavedIds(new Set());
    else setSelectedSavedIds(new Set(savedItems.map(i => i.id)));
  };

  const deleteSelectedItems = () => {
    if (confirm(`Hapus ${selectedSavedIds.size} item tersimpan?`)) {
      setSavedItems(prev => prev.filter(item => !selectedSavedIds.has(item.id)));
      setSelectedSavedIds(new Set());
      setIsSelectionMode(false);
    }
  };

  const handleSaveAddress = () => {
    if (!newAddress.label || !newAddress.fullAddress) return alert("Mohon lengkapi alamat");
    const addr: Address = {
      id: Date.now().toString(),
      ...newAddress,
      isPrimary: addresses.length === 0
    };
    setAddresses([...addresses, addr]);
    setIsAddingAddress(false);
    setNewAddress({ label: '', fullAddress: '', receiverName: '', phone: '' });
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setUserData({...userData, email: val});
      
      // Realtime validation
      if (!val.includes('@')) {
          setEmailError('Anda belum menuntaskan pengisian email');
      } else {
          setEmailError('');
      }
  };

  const handleSaveProfile = () => {
      // Validasi Dasar
      if (!userData.name.trim() || !userData.email.trim() || !userData.phone.trim()) {
          alert("Nama, Email, dan Nomor Telepon tidak boleh kosong!");
          return;
      }
      
      if (emailError) {
          alert("Mohon perbaiki format email anda.");
          return;
      }

      if (phoneError) {
          alert("Mohon perbaiki format nomor telepon anda.");
          return;
      }

      // Check Email Change
      if (userData.email !== initialEmail) {
          setShowEmailVerifyModal(true);
          return;
      }

      alert("Profil berhasil diperbarui!");
      setCurrentView('main');
  };

  const confirmEmailChange = () => {
      if (!verifyPassword) {
          alert("Masukkan password untuk verifikasi.");
          return;
      }
      // Simulate verification
      setTimeout(() => {
          alert("Verifikasi berhasil! Email telah diubah.");
          setShowEmailVerifyModal(false);
          setVerifyPassword('');
          setCurrentView('main');
      }, 500);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, ''); // Hapus non-digit
    
    // Hapus awalan 0 atau 62 jika user copas/ketik manual
    if (val.startsWith('62')) val = val.substring(2);
    if (val.startsWith('0')) val = val.substring(1);

    // Limit panjang maksimal (misal 13 digit tanpa +62)
    val = val.substring(0, 13);

    let formattedVal = val;
    // Format: 3 digit - 4 digit - 4 digit (sisanya)
    if (val.length > 3) {
        formattedVal = val.substring(0, 3) + '-' + val.substring(3);
    }
    if (val.length > 7) {
        formattedVal = formattedVal.substring(0, 8) + '-' + val.substring(7);
    }

    // Validasi Realtime
    if (val.length < 9) {
        setPhoneError('Nomor terlalu pendek (min 9 digit)');
    } else {
        setPhoneError('');
    }

    setUserData({...userData, phone: formattedVal});
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              setUserData({ ...userData, avatar: reader.result as string });
          };
          reader.readAsDataURL(file);
      }
  };

  const handleBannerChange = () => {
      if (tempBannerUrl) {
          setBannerImage(tempBannerUrl);
          setShowBannerEdit(false);
          setTempBannerUrl('');
      } else {
          // Trigger file input click if url empty (simulated)
          document.getElementById('banner-upload')?.click();
      }
  };

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              setBannerImage(reader.result as string);
              setShowBannerEdit(false);
          };
          reader.readAsDataURL(file);
      }
  };

  const handleSaveSecurity = () => {
      if (!securityForm.oldPassword || !securityForm.newPassword || !securityForm.confirmPassword) {
          alert("Mohon lengkapi semua kolom password.");
          return;
      }
      if (securityForm.newPassword !== securityForm.confirmPassword) {
          alert("Konfirmasi password tidak cocok.");
          return;
      }
      alert("Pengaturan keamanan berhasil disimpan.");
      setSecurityForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setCurrentView('main');
  };

  // --- Render Sub-Views ---

  const renderHeader = (title: string, rightAction?: React.ReactNode) => (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <button onClick={() => setCurrentView('main')} className="p-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-900 dark:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold text-stone-900 dark:text-white">{title}</h2>
      </div>
      {rightAction}
    </div>
  );

  // ... (Other views logic included for file integrity) ...
  
  if (currentView === 'history') {
    return (
       <div className="p-6 bg-[#FDFBF7] dark:bg-stone-950 min-h-screen">
          {renderHeader("Riwayat Klaim")}
          <div className="space-y-4">
             {history.map(item => (
                <div key={item.id} className="bg-white dark:bg-stone-900 p-4 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col md:flex-row gap-4">
                   <div className="flex gap-4 flex-1">
                       <img src={item.imageUrl} alt={item.foodName} className="w-20 h-20 rounded-lg object-cover bg-stone-100" />
                       <div className="flex-1">
                          <div className="flex justify-between items-start">
                             <h4 className="font-bold text-stone-900 dark:text-white">{item.foodName}</h4>
                             <span className={`text-xs px-2 py-1 rounded-full capitalize font-medium ${item.status === 'completed' ? 'bg-green-100 text-green-600' : item.status === 'active' ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'}`}>
                               {item.status === 'completed' ? 'Selesai' : item.status === 'active' ? 'Aktif' : 'Batal'}
                             </span>
                          </div>
                          <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">{item.providerName}</p>
                          <p className="text-xs text-stone-400 mt-2">{item.date}</p>
                       </div>
                   </div>
                   
                   <div className="flex md:flex-col justify-end items-end gap-2 border-t md:border-t-0 md:border-l border-stone-100 dark:border-stone-800 pt-3 md:pt-0 md:pl-4">
                        {item.status === 'active' && (
                             <Button 
                                className="w-full md:w-auto text-xs px-4 h-9" 
                                onClick={() => setShowQrModal(item.uniqueCode || 'CODE-ERR')}
                             >
                                <QrCode className="w-3 h-3 mr-1" /> Tampilkan Kode
                             </Button>
                        )}
                        {item.status === 'completed' && (
                            <div className="flex gap-2 w-full md:w-auto">
                                <Button variant="outline" className="w-full md:w-auto text-xs px-4 h-9">
                                    <MessageSquare className="w-3 h-3 mr-1" /> Ulas
                                </Button>
                                <Button variant="ghost" className="w-full md:w-auto text-xs px-4 h-9 text-red-500 hover:text-red-600">
                                    <AlertTriangle className="w-3 h-3 mr-1" /> Lapor
                                </Button>
                            </div>
                        )}
                   </div>
                </div>
             ))}
          </div>

          {showQrModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
                  <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl max-w-sm w-full relative">
                      <button onClick={() => setShowQrModal(null)} className="absolute top-4 right-4 text-stone-400 hover:text-stone-900 dark:hover:text-white">
                          <X className="w-6 h-6" />
                      </button>
                      <div className="text-center space-y-4">
                          <h3 className="text-xl font-bold text-stone-900 dark:text-white">Kode Unik Penukaran</h3>
                          <p className="text-sm text-stone-500">Tunjukkan kode ini kepada penyedia atau relawan.</p>
                          <div className="bg-white p-4 rounded-xl border-2 border-dashed border-stone-200 inline-block">
                             <img 
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${showQrModal}`} 
                                alt="QR Code"
                                className="w-48 h-48" 
                             />
                          </div>
                          <div className="bg-stone-100 dark:bg-stone-800 p-3 rounded-lg">
                              <p className="text-xs text-stone-500 dark:text-stone-400 mb-1">Kode Teks</p>
                              <p className="text-2xl font-mono font-bold tracking-widest text-stone-900 dark:text-white">{showQrModal}</p>
                          </div>
                      </div>
                  </div>
              </div>
          )}
       </div>
    );
  }

  if (currentView === 'saved') {
    const filteredSaved = savedItems.filter(item => savedFilter === 'all' || item.status === savedFilter);
    return (
      <div className="p-6 bg-[#FDFBF7] dark:bg-stone-950 min-h-screen">
        {renderHeader("Makanan Tersimpan", 
           <button 
             onClick={() => { setIsSelectionMode(!isSelectionMode); setSelectedSavedIds(new Set()); }}
             className="text-orange-500 font-medium text-sm"
           >
             {isSelectionMode ? "Batal" : "Pilih"}
           </button>
        )}
        <div className="mb-4 flex gap-2">
            {['all', 'available', 'claimed'].map(filter => (
                <button
                   key={filter}
                   onClick={() => setSavedFilter(filter as any)}
                   className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${savedFilter === filter ? 'bg-orange-500 text-white' : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-800'}`}
                >
                   {filter === 'all' ? 'Semua' : filter === 'available' ? 'Tersedia' : 'Sudah Diklaim'}
                </button>
            ))}
        </div>
        {isSelectionMode && (
          <div className="flex items-center justify-between mb-4 bg-white dark:bg-stone-900 p-3 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm">
            <button onClick={selectAll} className="flex items-center gap-2 text-stone-600 dark:text-stone-300 text-sm font-medium">
              {selectedSavedIds.size === savedItems.length && savedItems.length > 0 ? <CheckSquare className="w-5 h-5 text-orange-500" /> : <Square className="w-5 h-5" />}
              Pilih Semua
            </button>
            {selectedSavedIds.size > 0 && (
              <button onClick={deleteSelectedItems} className="text-red-500 text-sm font-bold flex items-center gap-1">
                <Trash2 className="w-4 h-4" /> Hapus ({selectedSavedIds.size})
              </button>
            )}
          </div>
        )}
        <div className="space-y-4">
          {filteredSaved.length === 0 && <p className="text-center text-stone-500 py-10">Tidak ada item tersimpan yang sesuai filter.</p>}
          {filteredSaved.map(item => (
            <div 
              key={item.id} 
              className={`flex gap-4 p-4 bg-white dark:bg-stone-900 rounded-xl border transition-all relative overflow-hidden ${selectedSavedIds.has(item.id) ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/10' : 'border-stone-200 dark:border-stone-800'}`}
              onClick={() => isSelectionMode && toggleSelection(item.id)}
            >
               {item.status === 'claimed' && (
                  <div className="absolute inset-0 bg-stone-100/50 dark:bg-stone-900/70 z-10 flex items-center justify-center backdrop-blur-[1px]">
                     <span className="bg-stone-800 text-white px-3 py-1 rounded-lg text-xs font-bold transform -rotate-12">Sudah Diklaim Orang Lain</span>
                  </div>
               )}
               {isSelectionMode && (
                 <div className="flex items-center z-20">
                    {selectedSavedIds.has(item.id) ? <CheckSquare className="w-5 h-5 text-orange-500" /> : <Square className="w-5 h-5 text-stone-400" />}
                 </div>
               )}
               <img src={item.image} alt={item.name} className="w-20 h-20 rounded-lg object-cover bg-stone-200 dark:bg-stone-800" />
               <div className="flex-1">
                 <h4 className="font-bold text-stone-900 dark:text-white">{item.name}</h4>
                 <p className="text-sm text-stone-500 dark:text-stone-400">{item.provider}</p>
                 {!isSelectionMode && item.status === 'available' && (
                   <div className="mt-2 flex gap-2">
                     <button className="text-xs bg-orange-500 text-white dark:text-stone-950 px-3 py-1 rounded-full font-bold shadow-md shadow-orange-500/20">Klaim</button>
                   </div>
                 )}
               </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // --- Edit Profile View ---
  if (currentView === 'edit') {
    return (
      <div className="p-6 bg-[#FDFBF7] dark:bg-stone-950 min-h-screen">
        {renderHeader("Edit Profil")}
        <div className="max-w-md mx-auto bg-white dark:bg-stone-900 rounded-2xl p-8 border border-stone-200 dark:border-stone-800 shadow-sm space-y-8">
          <div className="flex flex-col items-center">
             <div className="w-28 h-28 rounded-full bg-stone-800 relative mb-4 ring-4 ring-orange-50 dark:ring-stone-800 group">
               <img src={userData.avatar} className="w-full h-full rounded-full object-cover" alt="avatar" />
               <label className="absolute bottom-1 right-1 bg-orange-500 hover:bg-orange-600 p-2 rounded-full text-white transition-colors shadow-lg cursor-pointer">
                 <Camera className="w-5 h-5" />
                 <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
               </label>
             </div>
             <p className="text-sm text-stone-500">Ketuk ikon kamera untuk ubah foto</p>
          </div>
          <div className="space-y-5">
            <Input label="Nama Lengkap" value={userData.name} onChange={(e) => setUserData({...userData, name: e.target.value})} icon={<User className="w-4 h-4" />} />
            
            {/* Validasi Email Realtime */}
            <Input 
                label="Email Address" 
                type="email" 
                value={userData.email} 
                onChange={handleEmailChange} 
                icon={<Mail className="w-4 h-4" />} 
                error={emailError}
            />
            
            {/* Custom Phone Input with +62 Box and Formatting */}
            <Input 
                label="Nomor Telepon" 
                type="tel" 
                value={userData.phone} 
                onChange={handlePhoneChange} 
                leftAddon={<span className="text-stone-600 dark:text-stone-400">+62</span>}
                placeholder="8xx-xxxx-xxxx"
                error={phoneError}
            />
          </div>
          <div className="pt-4">
            <Button onClick={handleSaveProfile}>Simpan Perubahan</Button>
          </div>
        </div>

        {/* Email Verification Modal */}
        {showEmailVerifyModal && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
                <div className="bg-white dark:bg-stone-900 w-full max-w-sm rounded-2xl p-6 shadow-2xl relative">
                    <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-2">Verifikasi Ubah Email</h3>
                    <p className="text-sm text-stone-500 mb-4">Anda mengubah email dari <strong>{initialEmail}</strong> ke <strong>{userData.email}</strong>. Mohon masukkan password untuk konfirmasi.</p>
                    
                    <div className="space-y-4">
                        <Input 
                            label="Password" 
                            type="password" 
                            value={verifyPassword} 
                            onChange={(e) => setVerifyPassword(e.target.value)} 
                            placeholder="Masukkan password akun"
                        />
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <Button variant="ghost" onClick={() => setShowEmailVerifyModal(false)}>Batal</Button>
                        <Button onClick={confirmEmailChange} className="bg-orange-500 hover:bg-orange-600">Verifikasi</Button>
                    </div>
                </div>
            </div>
        )}
      </div>
    );
  }

  // --- Security View ---
  if (currentView === 'security') {
      return (
          <div className="p-6 bg-[#FDFBF7] dark:bg-stone-950 min-h-screen">
              {renderHeader("Keamanan & Privasi")}
              <div className="max-w-md mx-auto space-y-6">
                  <div className="bg-white dark:bg-stone-900 rounded-2xl p-6 border border-stone-200 dark:border-stone-800 shadow-sm">
                      <h3 className="font-bold text-lg text-stone-900 dark:text-white mb-4 flex items-center gap-2">
                          <Key className="w-5 h-5 text-orange-500" /> Ganti Password
                      </h3>
                      <div className="space-y-4">
                          <Input 
                            label="Password Lama" 
                            type={showOldPass ? "text" : "password"} 
                            value={securityForm.oldPassword} 
                            onChange={e => setSecurityForm({...securityForm, oldPassword: e.target.value})} 
                            rightElement={
                                <button type="button" onClick={() => setShowOldPass(!showOldPass)} className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition-colors bg-transparent">
                                    {showOldPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            }
                          />
                          <Input 
                            label="Password Baru" 
                            type={showNewPass ? "text" : "password"} 
                            value={securityForm.newPassword} 
                            onChange={e => setSecurityForm({...securityForm, newPassword: e.target.value})} 
                            rightElement={
                                <button type="button" onClick={() => setShowNewPass(!showNewPass)} className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition-colors bg-transparent">
                                    {showNewPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            }
                          />
                          <Input 
                            label="Konfirmasi Password Baru" 
                            type={showConfirmPass ? "text" : "password"} 
                            value={securityForm.confirmPassword} 
                            onChange={e => setSecurityForm({...securityForm, confirmPassword: e.target.value})} 
                            rightElement={
                                <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)} className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition-colors bg-transparent">
                                    {showConfirmPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            }
                          />
                      </div>
                  </div>

                  <div className="bg-white dark:bg-stone-900 rounded-2xl p-6 border border-stone-200 dark:border-stone-800 shadow-sm">
                      <h3 className="font-bold text-lg text-stone-900 dark:text-white mb-4 flex items-center gap-2">
                          <Shield className="w-5 h-5 text-green-500" /> Autentikasi 2 Faktor
                      </h3>
                      <div className="flex items-center justify-between">
                          <div>
                              <p className="text-sm font-medium text-stone-900 dark:text-white">Aktifkan 2FA</p>
                              <p className="text-xs text-stone-500 mt-1">Verifikasi tambahan via SMS/Email</p>
                          </div>
                          <button 
                             onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                             className={`w-12 h-6 rounded-full p-1 transition-colors ${twoFactorEnabled ? 'bg-orange-500' : 'bg-stone-300 dark:bg-stone-700'}`}
                          >
                             <div className={`w-4 h-4 bg-white rounded-full transition-transform ${twoFactorEnabled ? 'translate-x-6' : ''}`}></div>
                          </button>
                      </div>
                  </div>

                  <div className="pt-2">
                      <Button onClick={handleSaveSecurity}>Simpan Pengaturan</Button>
                  </div>
              </div>
          </div>
      );
  }

  // ... (Address View, FAQ View and Main View) ...
  
  if (currentView === 'address') {
      return (
        <div className="p-6 bg-[#FDFBF7] dark:bg-stone-950 min-h-screen">
          {renderHeader("Alamat Tersimpan")}
          {isAddingAddress ? (
            <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-4 shadow-sm animate-in fade-in slide-in-from-bottom-4">
               <h3 className="font-bold text-stone-900 dark:text-white mb-2">Tambah Alamat Baru</h3>
               <Input label="Label Alamat (Rumah/Kantor)" value={newAddress.label} onChange={e => setNewAddress({...newAddress, label: e.target.value})} placeholder="Contoh: Rumah" />
               <Input label="Nama Penerima" value={newAddress.receiverName} onChange={e => setNewAddress({...newAddress, receiverName: e.target.value})} />
               <Input label="Nomor HP" value={newAddress.phone} onChange={e => setNewAddress({...newAddress, phone: e.target.value})} />
               <div className="space-y-2">
                 <label className="text-sm font-medium text-stone-600 dark:text-stone-400">Alamat Lengkap</label>
                 <textarea className="w-full bg-stone-50 dark:bg-stone-900/50 border border-stone-300 dark:border-stone-800 text-stone-900 dark:text-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors" rows={3} value={newAddress.fullAddress} onChange={e => setNewAddress({...newAddress, fullAddress: e.target.value})} />
               </div>
               <div className="flex gap-3 pt-2">
                 <Button variant="ghost" onClick={() => setIsAddingAddress(false)}>Batal</Button>
                 <Button onClick={handleSaveAddress}>Simpan Alamat</Button>
               </div>
            </div>
          ) : (
            <div className="space-y-4">
              {addresses.map(addr => (
                <div key={addr.id} className={`bg-white dark:bg-stone-900 p-4 rounded-xl border ${addr.isPrimary ? 'border-orange-500 ring-1 ring-orange-500/20' : 'border-stone-200 dark:border-stone-800'} relative shadow-sm`}>
                  {addr.isPrimary && <div className="absolute top-4 right-4 text-orange-600 dark:text-orange-500 text-xs bg-orange-100 dark:bg-orange-900/20 px-2 py-1 rounded font-bold">Utama</div>}
                  <h4 className="font-bold text-stone-900 dark:text-white mb-1 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-stone-400" /> {addr.label}
                  </h4>
                  <p className="text-stone-600 dark:text-stone-300 text-sm mt-2">{addr.fullAddress}</p>
                  <p className="text-stone-500 dark:text-stone-400 text-xs mt-1">{addr.receiverName} • {addr.phone}</p>
                </div>
              ))}
              <Button variant="outline" className="mt-4 border-dashed" onClick={() => setIsAddingAddress(true)}>
                <Plus className="w-4 h-4 mr-2" /> Tambah Alamat Baru
              </Button>
            </div>
          )}
        </div>
      );
  }

  if (currentView === 'faq') {
      return (
        <div className="p-6 bg-[#FDFBF7] dark:bg-stone-950 min-h-screen">
          {renderHeader("Bantuan & Dokumentasi SOP")}
          <div className="space-y-6">
            <div className="text-sm text-stone-500 dark:text-stone-400 bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30 flex items-start gap-3">
               <BookOpen className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
               <div>
                  <h4 className="font-bold text-blue-700 dark:text-blue-400 mb-1">Panduan Lengkap (SOP)</h4>
                  <p>Berikut adalah standar operasional dan pertanyaan umum untuk setiap peran di aplikasi Food AI Rescue.</p>
               </div>
            </div>

            {faqCategories.map((cat, catIdx) => (
              <div key={catIdx} className="space-y-3">
                 <button 
                   onClick={() => setOpenCategoryIndex(openCategoryIndex === catIdx ? null : catIdx)}
                   className="w-full flex items-center justify-between text-left font-bold text-stone-800 dark:text-stone-200 py-2 border-b-2 border-orange-100 dark:border-stone-800"
                 >
                    <span className="flex items-center gap-2">
                       {catIdx === 0 ? <Shield className="w-4 h-4 text-orange-500" /> : 
                        catIdx === 1 ? <Store className="w-4 h-4 text-orange-500" /> :
                        catIdx === 2 ? <User className="w-4 h-4 text-orange-500" /> :
                        <Truck className="w-4 h-4 text-orange-500" />
                       }
                       {cat.category}
                    </span>
                    {openCategoryIndex === catIdx ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                 </button>

                 {openCategoryIndex === catIdx && (
                    <div className="space-y-3 pl-2 animate-in slide-in-from-top-2">
                        {cat.items.map((item, idx) => {
                            const uniqueId = `${catIdx}-${idx}`;
                            return (
                                <div key={uniqueId} className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl overflow-hidden shadow-sm">
                                    <button onClick={() => setOpenFaqIndex(openFaqIndex === uniqueId ? null : uniqueId)} className="w-full flex justify-between items-start gap-4 p-4 text-left font-medium text-stone-900 dark:text-white hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors">
                                    {item.question}
                                    {openFaqIndex === uniqueId ? <ChevronUp className="w-4 h-4 text-orange-500 shrink-0" /> : <ChevronDown className="w-4 h-4 text-stone-400 shrink-0" />}
                                    </button>
                                    {openFaqIndex === uniqueId && (
                                        <div className="p-4 pt-0 text-sm text-stone-600 dark:text-stone-300 bg-stone-50/50 dark:bg-stone-900/30 border-t border-stone-100 dark:border-stone-800 whitespace-pre-line">
                                            {item.answer}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                 )}
              </div>
            ))}

            <div className="mt-8 p-6 bg-orange-50 dark:bg-orange-900/10 rounded-2xl border border-orange-100 dark:border-orange-900/30 text-center">
               <h4 className="font-bold text-orange-700 dark:text-orange-400 mb-2">Masih mengalami kendala?</h4>
               <p className="text-sm text-stone-600 dark:text-stone-400 mb-4">Tim support kami siap membantu anda via WhatsApp</p>
               <Button onClick={handleContactCS} variant="primary" className="w-auto px-6 bg-[#25D366] hover:bg-[#128C7E] border-0">
                  <MessageSquare className="w-4 h-4 mr-2" /> Hubungi CS (WhatsApp)
               </Button>
            </div>
          </div>
        </div>
      );
  }

  // --- Main Profile View ---
  return (
    <div className="pb-24 bg-[#FDFBF7] dark:bg-stone-950 min-h-screen transition-colors duration-300">
      {/* Header Banner - BRIGHTER GRADIENT FOR LIGHT MODE */}
      <div className="p-4">
          <div className="h-48 relative rounded-3xl shadow-xl shadow-orange-500/20 overflow-hidden group">
            {/* Banner Background */}
            <div className={`absolute inset-0 ${!bannerImage ? 'bg-gradient-to-br from-orange-400 to-amber-500 dark:from-orange-500 dark:to-stone-900' : ''}`}>
                {bannerImage && <img src={bannerImage} alt="Banner" className="w-full h-full object-cover" />}
            </div>
            
            {/* Edit Cover Button */}
            <button 
                onClick={() => setShowBannerEdit(true)}
                className="absolute top-4 right-4 bg-black/30 hover:bg-black/50 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all opacity-0 group-hover:opacity-100"
            >
                <Edit className="w-3 h-3" /> Edit Cover
            </button>

            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
              <div className="w-24 h-24 rounded-full bg-white dark:bg-stone-900 border-4 border-stone-50 dark:border-stone-950 p-1 shadow-lg">
                <div className="w-full h-full rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-400 overflow-hidden relative">
                  <img 
                    src={userData.avatar} 
                    alt="Avatar" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="absolute bottom-0 right-0 bg-orange-500 rounded-full p-1.5 border-2 border-white dark:border-stone-950 shadow-md">
                {role === 'provider' && <Store className="w-3 h-3 text-white" />}
                {role === 'volunteer' && <Truck className="w-3 h-3 text-white" />}
                {role === 'receiver' && <User className="w-3 h-3 text-white" />}
              </div>
            </div>
          </div>
      </div>

      {/* Profile Info */}
      <div className="mt-16 text-center px-4">
        <h1 className="text-xl font-bold text-stone-900 dark:text-white">{userData.name}</h1>
        <p className="text-stone-500 dark:text-stone-400 text-sm font-medium">
          {role === 'provider' ? 'Donatur Terverifikasi' : role === 'volunteer' ? 'Relawan' : 'Penerima Manfaat'}
        </p>
        
        <div className="flex justify-center gap-4 mt-4 text-sm text-stone-500 dark:text-stone-400">
          <div className="flex items-center gap-1">
            <Mail className="w-3 h-3" /> {userData.email}
          </div>
        </div>
        <div className="flex justify-center gap-4 mt-1 text-sm text-stone-500 dark:text-stone-400">
           <div className="flex items-center gap-1">
            <Phone className="w-3 h-3" /> {userData.phone}
          </div>
        </div>

        {/* Donatur Scores */}
        {role === 'provider' && (
           <div className="grid grid-cols-3 gap-3 px-4 mt-6 max-w-md mx-auto">
              <div className="bg-white dark:bg-stone-900 p-3 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col items-center">
                 <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-full text-orange-600 dark:text-orange-400 mb-1">
                    <Package className="w-4 h-4" />
                 </div>
                 <p className="text-lg font-bold text-stone-900 dark:text-white">{donaturScores.totalDonations}</p>
                 <p className="text-[10px] text-stone-500 uppercase font-bold tracking-wide">Donasi</p>
              </div>
              <div className="bg-white dark:bg-stone-900 p-3 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col items-center">
                 <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-full text-yellow-600 dark:text-yellow-400 mb-1">
                    <Star className="w-4 h-4" />
                 </div>
                 <p className="text-lg font-bold text-stone-900 dark:text-white">{donaturScores.rating}</p>
                 <p className="text-[10px] text-stone-500 uppercase font-bold tracking-wide">Rating</p>
              </div>
              <div className="bg-white dark:bg-stone-900 p-3 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col items-center">
                 <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400 mb-1">
                    <Zap className="w-4 h-4" />
                 </div>
                 <p className="text-lg font-bold text-stone-900 dark:text-white">{donaturScores.responseRate}</p>
                 <p className="text-[10px] text-stone-500 uppercase font-bold tracking-wide">Respon</p>
              </div>
           </div>
        )}

        {/* Volunteer Scores */}
        {role === 'volunteer' && (
           <div className="grid grid-cols-3 gap-3 px-4 mt-6 max-w-md mx-auto">
              <div className="bg-white dark:bg-stone-900 p-3 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col items-center">
                 <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400 mb-1">
                    <CheckCircle className="w-4 h-4" />
                 </div>
                 <p className="text-lg font-bold text-stone-900 dark:text-white">{volunteerScores.missions}</p>
                 <p className="text-[10px] text-stone-500 uppercase font-bold tracking-wide">Misi</p>
              </div>
              <div className="bg-white dark:bg-stone-900 p-3 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col items-center">
                 <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-full text-purple-600 dark:text-purple-400 mb-1">
                    <Clock className="w-4 h-4" />
                 </div>
                 <p className="text-lg font-bold text-stone-900 dark:text-white">{volunteerScores.hours}</p>
                 <p className="text-[10px] text-stone-500 uppercase font-bold tracking-wide">Jam</p>
              </div>
              <div className="bg-white dark:bg-stone-900 p-3 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col items-center">
                 <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-full text-orange-600 dark:text-orange-400 mb-1">
                    <Award className="w-4 h-4" />
                 </div>
                 <p className="text-lg font-bold text-stone-900 dark:text-white">{volunteerScores.points}</p>
                 <p className="text-[10px] text-stone-500 uppercase font-bold tracking-wide">Poin</p>
              </div>
           </div>
        )}
      </div>

      {/* Menu List */}
      <div className="mt-8 px-4 space-y-3 max-w-lg mx-auto">
        {/* ... (Existing Menu List) ... */}
        {role === 'receiver' && (
           <>
            <h3 className="text-sm font-semibold text-stone-500 dark:text-stone-500 uppercase tracking-wider mb-2 ml-2">Aktivitas</h3>
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden shadow-sm">
               <MenuButton icon={Store} label="Riwayat Klaim" onClick={() => setCurrentView('history')} />
               <MenuButton icon={Heart} label="Makanan Tersimpan" onClick={() => setCurrentView('saved')} last />
            </div>
           </>
        )}
        <h3 className="text-sm font-semibold text-stone-500 dark:text-stone-500 uppercase tracking-wider mb-2 mt-6 ml-2">Akun</h3>
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden shadow-sm">
          <MenuButton icon={User} label="Edit Profil" onClick={() => setCurrentView('edit')} />
          <MenuButton icon={MapPin} label="Alamat Tersimpan" onClick={() => setCurrentView('address')} />
          <MenuButton icon={Shield} label="Keamanan & Privasi" onClick={() => setCurrentView('security')} />
          <button onClick={toggleTheme} className="w-full flex items-center justify-between p-4 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors border-b border-stone-100 dark:border-stone-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-950 flex items-center justify-center text-stone-500 dark:text-stone-400">
                {isDarkMode ? <Moon className="w-4 h-4 text-orange-400" /> : <Sun className="w-4 h-4 text-orange-500" />}
              </div>
              <span className="text-stone-900 dark:text-stone-200 text-sm font-medium">Tema Aplikasi</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-500">{isDarkMode ? 'Mode Gelap' : 'Mode Terang'}</span>
              <div className={`w-10 h-6 rounded-full relative transition-colors ${isDarkMode ? 'bg-orange-500' : 'bg-stone-300'}`}>
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isDarkMode ? 'right-1' : 'left-1'}`}></div>
              </div>
            </div>
          </button>
          <MenuButton icon={HelpCircle} label="Bantuan & FAQ" onClick={() => setCurrentView('faq')} last />
        </div>
        <h3 className="text-sm font-semibold text-stone-500 dark:text-stone-500 uppercase tracking-wider mb-2 mt-6 ml-2">Lainnya</h3>
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden p-2 shadow-sm">
          <Button variant="danger" onClick={onLogout} className="flex items-center justify-center gap-2">
            <LogOut className="w-4 h-4" /> Keluar Akun
          </Button>
        </div>
      </div>
      
      <div className="mt-8 text-center text-xs text-stone-500 dark:text-stone-600 pb-8">
        Food AI Rescue v1.3.0
      </div>

      {/* Banner Edit Modal */}
      {showBannerEdit && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
              <div className="bg-white dark:bg-stone-900 w-full max-w-sm rounded-2xl p-6 shadow-2xl relative">
                  <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-4">Ganti Foto Sampul</h3>
                  
                  <div className="space-y-4">
                      <div>
                          <label className="block text-sm font-bold text-stone-600 dark:text-stone-400 mb-2">Upload Gambar</label>
                          <input 
                              id="banner-upload"
                              type="file" 
                              accept="image/*" 
                              onChange={handleBannerUpload}
                              className="block w-full text-sm text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                          />
                      </div>
                      
                      <div className="relative flex py-2 items-center">
                          <div className="flex-grow border-t border-stone-200 dark:border-stone-700"></div>
                          <span className="flex-shrink-0 mx-4 text-stone-400 text-xs">ATAU URL</span>
                          <div className="flex-grow border-t border-stone-200 dark:border-stone-700"></div>
                      </div>

                      <Input 
                          label="URL Gambar" 
                          placeholder="https://example.com/image.jpg" 
                          value={tempBannerUrl} 
                          onChange={(e) => setTempBannerUrl(e.target.value)} 
                      />
                  </div>

                  <div className="flex justify-end gap-3 mt-6">
                      <Button variant="ghost" onClick={() => setShowBannerEdit(false)}>Batal</Button>
                      <Button onClick={handleBannerChange}>Simpan</Button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

// Helper Component for Menu Items
const MenuButton = ({ icon: Icon, label, onClick, last }: { icon: any, label: string, onClick: () => void, last?: boolean }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center justify-between p-4 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors ${!last ? 'border-b border-stone-100 dark:border-stone-800' : ''}`}
  >
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-950 flex items-center justify-center text-stone-500 dark:text-stone-400">
        <Icon className="w-4 h-4 text-orange-500 dark:text-stone-400" />
      </div>
      <span className="text-stone-900 dark:text-stone-200 text-sm font-medium">{label}</span>
    </div>
    <ChevronRight className="w-4 h-4 text-stone-400 dark:text-stone-600" />
  </button>
);
