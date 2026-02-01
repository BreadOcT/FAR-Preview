
import React, { useState, useEffect } from 'react';
import { Camera, Upload, AlertTriangle, CheckCircle, Leaf, XCircle, Store, Package, Truck, Hand, List, Star, FileText, ArrowLeft, Filter, Bell, Search, Calendar, ChevronDown, Flag, Clock, ArrowUpDown, Droplets, Globe, ShieldCheck, Loader2, AlertCircle, Thermometer, Zap, AlignLeft, Hash, ArrowRight, Trophy, Info, X, Crown, TrendingUp, ShoppingBag, Award, MessageSquare, AlertOctagon, ChevronUp } from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';
import { FoodItem, DeliveryMethod, Report, Review, SocialImpactData } from '../types';
import { analyzeFoodQuality } from '../services/ai';

// Simple CSS Bar Chart Component
const SimpleBarChart = ({ data, colorClass }: { data: number[], colorClass: string }) => {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-2 h-24 mt-4">
      {data.map((val, idx) => (
        <div key={idx} className="flex-1 flex flex-col justify-end group relative">
          <div 
            className={`w-full rounded-t-md transition-all duration-500 ${colorClass}`} 
            style={{ height: `${(val / max) * 100}%`, minHeight: '4px' }}
          ></div>
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-stone-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
            {val}
          </div>
        </div>
      ))}
    </div>
  );
};

interface ProviderDashboardProps {
  onOpenNotifications: () => void;
  isSubNavOpen: boolean;
  onToggleSubNav: () => void;
}

interface ProviderRank {
    id: number;
    name: string;
    minPoints: number;
    description: string;
}

export const ProviderDashboard: React.FC<ProviderDashboardProps> = ({ onOpenNotifications, isSubNavOpen, onToggleSubNav }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'inventory' | 'reports' | 'reviews'>('dashboard');
  const [isAddingNew, setIsAddingNew] = useState(false);
  
  // Updated Wizard State
  const [uploadStep, setUploadStep] = useState<'initial-details' | 'upload' | 'analyzing' | 'result'>('initial-details');
  const [showRankDetails, setShowRankDetails] = useState(false);

  // --- Data Generation (Mock) ---
  const generateItems = (): FoodItem[] => Array.from({ length: 20 }, (_, i) => ({
    id: `item-${i}`,
    name: i % 2 === 0 ? `Nasi Kotak Berkah #${i+1}` : `Roti Bakery #${i+1}`,
    description: 'Makanan surplus layak konsumsi, higienis.',
    quantity: `${(i % 5) + 2} Porsi`,
    expiryTime: `${Math.floor(Math.random() * 12 + 10)}:00`, 
    imageUrl: i % 2 === 0 
      ? 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?q=80&w=1000' 
      : 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1000',
    providerName: 'Donatur Berkah',
    location: {lat:0, lng:0, address:''},
    status: i < 5 ? 'claimed' : 'available',
    deliveryMethod: i % 3 === 0 ? 'delivery' : 'pickup',
    aiVerification: {isEdible: true, halalScore: 90 + (i%10), reason: 'Verified by AI'},
    socialImpact: { 
        totalPoints: (i % 5 + 1) * 20,
        co2Saved: 0.5,
        waterSaved: 10,
        landSaved: 0.1,
        wasteReduction: 0.5,
        level: 'Pemula'
    }
  }));

  const generateReports = (): Report[] => Array.from({ length: 20 }, (_, i) => ({
    id: `rep-${i}`,
    title: i % 3 === 0 ? 'Kemasan Rusak' : 'Makanan Dingin',
    description: 'Penerima melaporkan kondisi makanan saat diterima kurang optimal.',
    date: `2025-02-${String((i % 28) + 1).padStart(2, '0')}`,
    status: i % 2 === 0 ? 'handled' : 'new',
    reporter: `Penerima User #${i+100}`,
    isUrgent: i % 5 === 0 
  }));

  const generateReviews = (): Review[] => Array.from({ length: 20 }, (_, i) => ({
    id: `rev-${i}`,
    user: `Penerima Manfaat #${i}`,
    rating: 3 + (Math.floor(Math.random() * 3)), 
    comment: i % 2 === 0 ? 'Terima kasih banyak, sangat membantu!' : 'Makanannya enak, terima kasih donatur.',
    date: `2025-02-${String((i % 28) + 1).padStart(2, '0')}`
  }));

  const [items, setItems] = useState<FoodItem[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    setItems(generateItems());
    setReports(generateReports());
    setReviews(generateReviews());
  }, []);
  
  // Filter States
  const [filterMethod, setFilterMethod] = useState<'all' | 'pickup' | 'delivery'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortByExpiry, setSortByExpiry] = useState(false);
  const [filterAvailableOnly, setFilterAvailableOnly] = useState(false);
  const [filterReportStatus, setFilterReportStatus] = useState<'all' | 'new' | 'handled'>('all');
  const [filterReportDate, setFilterReportDate] = useState('');

  // Upload & Form Logic
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [verificationResult, setVerificationResult] = useState<any | null>(null);

  const getCurrentDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  const [form, setForm] = useState({ 
    name: '', 
    ingredients: '', 
    madeDateTime: getCurrentDateTime(), 
    distributionStart: '',
    distributionEnd: '',
    quantity: '', 
    quantityUnit: 'Porsi' as 'Porsi' | 'Gram' | 'Box',
    storageLocation: 'Suhu Ruang',
    packaging: 'plastic' as 'no-plastic' | 'plastic' | 'recycled',
  });
  
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('pickup');
  const [shopOpen, setShopOpen] = useState(true);

  // --- Provider Rank System ---
  const PROVIDER_RANKS: ProviderRank[] = [
      { id: 1, name: "Donatur Pemula", minPoints: 0, description: "Langkah awal berbagi kebaikan." },
      { id: 2, name: "Sahabat Pangan", minPoints: 500, description: "Konsisten menyelamatkan makanan." },
      { id: 3, name: "Pahlawan Lingkungan", minPoints: 1500, description: "Dampak nyata pada pengurangan limbah." },
      { id: 4, name: "Juragan Berkah", minPoints: 3000, description: "Penyedia utama bagi komunitas." },
      { id: 5, name: "Sultan Donasi", minPoints: 5000, description: "Kontribusi luar biasa dan inspiratif." },
      { id: 6, name: "The Food Savior", minPoints: 10000, description: "Legenda penyelamat pangan." }
  ];

  const stats = {
    mealsSaved: 342,
    co2Reduced: 156.4, 
    peopleHelped: 210,
    totalPoints: 2450, 
    currentRank: "Pahlawan Lingkungan",
    nextRank: "Juragan Berkah",
    progressToNext: 63, 
    weeklyMeals: [25, 30, 45, 32, 28, 40, 38],
    weeklyCo2: [10, 12, 18, 14, 11, 15, 16]
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setUploadStep('analyzing'); 
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (uploadStep === 'analyzing' && imagePreview) {
       processVerification();
    }
  }, [uploadStep, imagePreview]);

  const processVerification = async () => {
    await new Promise(resolve => setTimeout(resolve, 2500));
    const result = await analyzeFoodQuality(["Makanan"], imagePreview, {
        foodName: form.name || "Makanan",
        ingredients: form.ingredients || "Tidak diketahui",
        madeTime: form.madeDateTime,
        storageLocation: form.storageLocation,
        weightGram: form.quantityUnit === 'Gram' ? parseFloat(form.quantity) : 500,
        packagingType: form.packaging
    });
    
    setVerificationResult({
        isEdible: result.isSafe,
        reason: result.reasoning,
        halalScore: result.halalScore,
        ingredients: result.detectedItems.map(i => i.name),
        socialImpact: result.socialImpact,
        detectedCategory: result.detectedCategory,
        hygieneScore: result.hygieneScore,
        qualityPercentage: result.qualityPercentage,
        shelfLifePrediction: result.shelfLifePrediction,
        allergens: result.allergens
    });
    setUploadStep('result');
  };

  const handleInitialFormSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if(!form.name || !form.quantity) {
          alert("Mohon lengkapi Nama Makanan dan Jumlah.");
          return;
      }
      setUploadStep('upload');
  };

  const handleRetry = () => {
    setImagePreview(null);
    setVerificationResult(null);
    setUploadStep('initial-details');
  };

  const handleFinalPublish = () => {
    if (!verificationResult?.isEdible) return;
    const newItem: FoodItem = {
      id: Date.now().toString(),
      name: form.name,
      description: verificationResult.reason,
      quantity: `${form.quantity} ${form.quantityUnit}`,
      expiryTime: form.distributionEnd || '23:59',
      imageUrl: imagePreview!,
      providerName: "Donatur Berkah",
      location: { lat: -6.914744, lng: 107.609810, address: "Jl. Asia Afrika No. 1" },
      status: 'available',
      deliveryMethod: deliveryMethod,
      aiVerification: { 
          isEdible: verificationResult.isEdible,
          reason: verificationResult.reason,
          halalScore: verificationResult.halalScore,
          ingredients: verificationResult.ingredients,
          madeTime: form.madeDateTime,
          storageLocation: form.storageLocation
      },
      socialImpact: verificationResult.socialImpact
    };
    setItems([newItem, ...items]);
    setImagePreview(null);
    setVerificationResult(null);
    setForm({ 
        name: '', ingredients: '', madeDateTime: getCurrentDateTime(), distributionStart: '', 
        distributionEnd: '', quantity: '', quantityUnit: 'Porsi', 
        storageLocation: 'Suhu Ruang', packaging: 'plastic' 
    });
    setIsAddingNew(false);
    setUploadStep('initial-details'); 
    setActiveTab('inventory');
    alert("Makanan berhasil ditambahkan! Poin sosial anda bertambah.");
  };

  const toggleUrgent = (reportId: string) => {
    setReports(reports.map(r => r.id === reportId ? { ...r, isUrgent: !r.isUrgent } : r));
  };

  // --- Render Functions ---

  const renderAddFoodWizard = () => {
     const isInitialStep = uploadStep === 'initial-details';
    return (
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm min-h-[80vh] flex flex-col relative overflow-hidden">
            <div className="p-6 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between sticky top-0 bg-white dark:bg-stone-900 z-10">
                 <div className="flex items-center gap-3">
                    <button 
                        onClick={() => {
                            if (uploadStep === 'initial-details') setIsAddingNew(false);
                            else if (uploadStep === 'upload') setUploadStep('initial-details');
                            else if (uploadStep === 'result') setUploadStep('upload');
                        }} 
                        className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6 text-stone-900 dark:text-white" />
                    </button>
                    <h2 className="text-xl font-bold text-stone-900 dark:text-white">
                        {uploadStep === 'initial-details' ? 'Info Produk' : 
                         uploadStep === 'upload' ? 'Ambil Foto' : 
                         uploadStep === 'analyzing' ? 'Memverifikasi...' : 'Hasil Analisis'}
                    </h2>
                 </div>
            </div>
            
            <div className="flex-1 flex flex-col items-center p-4 md:p-8 w-full max-w-2xl mx-auto overflow-y-auto">
               {uploadStep === 'initial-details' && (
                    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
                             <form onSubmit={handleInitialFormSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-stone-700 dark:text-stone-300">Nama Makanan</label>
                                    <Input 
                                        label=""
                                        value={form.name}
                                        onChange={e => setForm({...form, name: e.target.value})}
                                        placeholder="Contoh: Nasi Goreng Spesial"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-stone-700 dark:text-stone-300">Jumlah</label>
                                    <div className="flex gap-4">
                                        <div className="relative flex-1">
                                            <input type="number" value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})} placeholder="Porsi" className="w-full pl-4 pr-4 py-4 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-950 outline-none text-base" required />
                                        </div>
                                        <div className="relative w-1/3">
                                            <select value={form.quantityUnit} onChange={e => setForm({...form, quantityUnit: e.target.value as any})} className="w-full pl-4 pr-8 py-4 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-950 outline-none appearance-none text-base">
                                                <option value="Porsi">Porsi</option>
                                                <option value="Gram">Gram</option>
                                                <option value="Box">Box</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-6">
                                    <Button type="submit" variant="primary" className="w-full h-14 text-lg">
                                        LANJUT KE FOTO <ArrowRight className="w-5 h-5 ml-2" />
                                    </Button>
                                </div>
                             </form>
                    </div>
                )}
                {uploadStep === 'upload' && (
                    <div className="w-full max-w-lg text-center animate-in zoom-in-95 duration-300 flex flex-col justify-center h-full">
                        <div className="relative group cursor-pointer w-full max-w-xs aspect-square mx-auto border-4 border-dashed border-stone-300 dark:border-stone-700 rounded-3xl flex flex-col items-center justify-center hover:border-orange-500 transition-all duration-300">
                             <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer z-20" onChange={handleImageUpload} />
                             <Upload className="w-10 h-10 text-stone-400 mb-4" />
                             <span className="font-bold text-lg text-stone-600">Ambil Foto</span>
                        </div>
                    </div>
                )}
                {uploadStep === 'analyzing' && (
                    <div className="text-center animate-in fade-in flex flex-col justify-center h-full">
                        <Loader2 className="w-16 h-16 text-orange-500 animate-spin mx-auto mb-4" />
                        <h3 className="text-2xl font-bold">Memverifikasi Produk...</h3>
                    </div>
                )}
                {uploadStep === 'result' && verificationResult && (
                    <div className="w-full max-w-3xl animate-in slide-in-from-bottom-8 duration-500 pb-20">
                        <div className="bg-[#1a1b26] rounded-3xl p-6 text-white mb-6">
                             <div className="text-6xl font-black">{verificationResult.qualityPercentage}%</div>
                             <p>{verificationResult.reason}</p>
                        </div>
                        <Button onClick={handleFinalPublish} variant="primary" className="h-14">Publikasikan Donasi</Button>
                    </div>
                )}
            </div>
        </div>
    );
  };

  const renderInventory = () => {
    const filteredItems = items.filter(item => {
      const matchesMethod = filterMethod === 'all' || item.deliveryMethod === filterMethod;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = !filterAvailableOnly || item.status === 'available';
      return matchesMethod && matchesSearch && matchesStatus;
    });

    return (
      <div className="space-y-6 animate-in fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-stone-900 dark:text-white">Inventory Donasi</h2>
          <Button className="w-full md:w-auto px-6 h-12 text-sm" onClick={() => setIsAddingNew(true)}>
            + Tambah Donasi
          </Button>
        </div>
        
        <div className="flex flex-col gap-4">
             <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                    <Input label="" placeholder="Cari makanan..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} icon={<Search className="w-5 h-5" />} className="py-3 text-base" />
                </div>
            </div>
        </div>

        {filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800">
            <Package className="w-16 h-16 text-stone-300 mx-auto mb-4" />
            <p className="text-stone-500 text-lg">Tidak ada item yang sesuai filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
             {filteredItems.map(item => (
                <div key={item.id} className="bg-white dark:bg-stone-900 p-5 rounded-2xl border flex flex-col md:flex-row gap-5 shadow-sm">
                  <img src={item.imageUrl} alt={item.name} className="w-full md:w-32 h-40 md:h-32 rounded-xl object-cover bg-stone-100" />
                  <div className="flex-1">
                    <h3 className="font-bold text-stone-900 dark:text-white text-xl mb-2">{item.name}</h3>
                    <p>Qty: {item.quantity}</p>
                    <p className="text-sm text-stone-500">{item.description}</p>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    );
  };

  const renderReports = () => (
    <div className="space-y-6 animate-in fade-in">
       <div className="flex justify-between items-center">
         <h2 className="text-2xl font-bold text-stone-900 dark:text-white">Laporan Masuk ({reports.length})</h2>
       </div>
       <div className="space-y-4">
          {reports.map(report => (
            <div key={report.id} className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm">
               <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                      <AlertTriangle className={`w-5 h-5 ${report.isUrgent ? 'text-red-500' : 'text-orange-500'}`} />
                      <h3 className="font-bold text-lg text-stone-900 dark:text-white">{report.title}</h3>
                      {report.isUrgent && <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded font-bold uppercase">Urgent</span>}
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${report.status === 'handled' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>{report.status}</span>
               </div>
               <p className="text-sm text-stone-600 dark:text-stone-300 mb-3">{report.description}</p>
               <div className="flex justify-between items-center text-xs text-stone-500">
                  <span>Pelapor: {report.reporter}</span>
                  <span>{report.date}</span>
               </div>
            </div>
          ))}
       </div>
    </div>
  );

  const renderReviews = () => (
    <div className="space-y-6 animate-in fade-in">
       <div className="flex justify-between items-center">
         <h2 className="text-2xl font-bold text-stone-900 dark:text-white">Ulasan Penerima ({reviews.length})</h2>
       </div>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map(review => (
             <div key={review.id} className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                   <div className="flex items-center gap-2">
                       <div className="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center font-bold text-xs">
                          {review.user.charAt(0)}
                       </div>
                       <div>
                          <p className="text-sm font-bold text-stone-900 dark:text-white">{review.user}</p>
                          <p className="text-xs text-stone-500">{review.date}</p>
                       </div>
                   </div>
                   <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded-lg">
                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                      <span className="text-xs font-bold text-yellow-700 dark:text-yellow-400">{review.rating}</span>
                   </div>
                </div>
                <p className="text-sm text-stone-600 dark:text-stone-300 italic">"{review.comment}"</p>
             </div>
          ))}
       </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="space-y-6 animate-in fade-in">
       {/* Rank Card */}
      <div className="bg-gradient-to-br from-orange-500 to-amber-600 rounded-3xl p-6 md:p-8 text-white shadow-xl shadow-orange-500/20 relative overflow-hidden group">
         <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl transform translate-x-10 -translate-y-10"></div>
         <div className="flex justify-between items-start mb-6 relative z-10">
            <div className="flex items-center gap-4">
               <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30 shadow-inner">
                  <Trophy className="w-8 h-8 text-white" />
               </div>
               <div>
                  <p className="text-orange-100 text-xs font-bold uppercase tracking-widest mb-1">
                      Level {PROVIDER_RANKS.find(r => r.name === stats.currentRank)?.id}
                  </p>
                  <h2 className="text-2xl md:text-3xl font-bold leading-tight">{stats.currentRank}</h2>
               </div>
            </div>
            <button onClick={() => setShowRankDetails(true)} className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors text-white backdrop-blur-md">
              <Info className="w-5 h-5" />
            </button>
         </div>
         <div className="relative z-10 mt-4">
            <div className="flex justify-between text-sm mb-2 text-orange-50 font-medium">
               <span>Menuju: {stats.nextRank}</span>
               <span>{stats.progressToNext}%</span>
            </div>
            <div className="w-full bg-black/20 rounded-full h-3 overflow-hidden backdrop-blur-sm border border-white/10">
               <div className="bg-white h-full rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]" style={{width: `${stats.progressToNext}%`}}></div>
            </div>
         </div>
      </div>

      {/* Quick Access Header */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <button onClick={() => setActiveTab('reports')} className="p-5 bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-100 dark:border-red-900/30 flex items-center gap-4 hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-800 flex items-center justify-center text-red-600 dark:text-red-200">
               <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-left">
               <p className="text-sm font-medium text-stone-500 dark:text-stone-400">Laporan Masuk</p>
               <p className="text-xl font-bold text-stone-900 dark:text-white">{reports.filter(r => r.status === 'new').length} Masalah</p>
            </div>
         </button>
         <button onClick={() => setActiveTab('reviews')} className="p-5 bg-yellow-50 dark:bg-yellow-900/10 rounded-2xl border border-yellow-100 dark:border-yellow-900/30 flex items-center gap-4 hover:bg-yellow-100 dark:hover:bg-yellow-900/20 transition-colors">
            <div className="w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-800 flex items-center justify-center text-yellow-600 dark:text-yellow-200">
               <Star className="w-6 h-6" />
            </div>
            <div className="text-left">
               <p className="text-sm font-medium text-stone-500 dark:text-stone-400">Rating Toko</p>
               <p className="text-xl font-bold text-stone-900 dark:text-white">4.8/5.0</p>
            </div>
         </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Total Points Card */}
        <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col justify-between">
             <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                        <TrendingUp className="w-5 h-5" />
                    </div>
                    <span className="text-base font-bold text-stone-600 dark:text-stone-400">Total Poin Sosial</span>
                </div>
                <span className="text-xs text-green-500 font-bold bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full">+125 minggu ini</span>
             </div>
             <div>
                <p className="text-5xl font-extrabold text-stone-900 dark:text-white mb-2">{stats.totalPoints.toLocaleString()}</p>
                <p className="text-sm text-stone-500">Poin akumulatif dari donasi</p>
             </div>
        </div>

        {/* NEW CARD: Environmental Impact (CO2) */}
        <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col justify-between">
             <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                        <Leaf className="w-5 h-5" />
                    </div>
                    <span className="text-base font-bold text-stone-600 dark:text-stone-400">Dampak Lingkungan</span>
                </div>
                <span className="text-xs text-stone-500 font-bold bg-stone-100 dark:bg-stone-800 px-3 py-1 rounded-full">
                    -12% Limbah
                </span>
             </div>
             <div>
                <div className="flex items-baseline gap-2">
                    <p className="text-5xl font-extrabold text-stone-900 dark:text-white mb-2">{stats.co2Reduced}</p>
                    <span className="text-lg font-bold text-stone-400">kg</span>
                </div>
                <p className="text-sm text-stone-500">Jejak Karbon (CO2) Dikurangi</p>
             </div>
        </div>
      </div>
    </div>
  );

  if (isAddingNew) {
    return <div className="p-0 md:p-4">{renderAddFoodWizard()}</div>;
  }

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto pb-32">
      {/* PARENT NAVBAR: Sticky Header (Clickable) */}
      <div 
         onClick={onToggleSubNav}
         className="sticky top-16 z-30 bg-[#FDFBF7]/95 dark:bg-stone-950/95 backdrop-blur-sm -mx-6 px-6 pt-4 pb-2 mb-6 border-b border-stone-200 dark:border-stone-800 transition-all cursor-pointer group select-none hover:bg-stone-50/50 dark:hover:bg-stone-900/50"
      >
          <div className="flex items-center justify-between mb-4 pointer-events-none">
              <div className="pointer-events-auto">
                  <div className="flex items-center gap-2">
                     <h1 className="text-lg font-bold text-stone-900 dark:text-white leading-tight">Dashboard Donatur</h1>
                     {/* Toggle Indicator */}
                     <div className={`transform transition-transform duration-300 ${isSubNavOpen ? 'rotate-180' : 'rotate-0'}`}>
                         <ChevronDown className="w-4 h-4 text-orange-500" />
                     </div>
                  </div>
                  <p className="text-xs text-stone-500 font-medium">Mitra: Restoran Berkah</p>
              </div>
              <div className="flex items-center gap-2 pointer-events-auto" onClick={(e) => e.stopPropagation()}>
                  <button 
                    onClick={() => setShopOpen(!shopOpen)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${shopOpen ? 'bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-500' : 'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-500'}`}
                  >
                    <Store className="w-3.5 h-3.5" />
                    {shopOpen ? 'Buka' : 'Tutup'}
                  </button>
                  <button onClick={onOpenNotifications} className="p-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-full text-stone-500 hover:text-orange-500 transition-colors shadow-sm">
                      <Bell className="w-4 h-4" />
                  </button>
              </div>
          </div>
          
          {/* SUB NAVBAR (Desktop Tabs) - Collapsible */}
          <div 
             onClick={(e) => e.stopPropagation()} 
             className={`hidden md:flex gap-2 overflow-x-auto scrollbar-hide transition-all duration-500 ease-in-out ${isSubNavOpen ? 'max-h-20 opacity-100 pb-2' : 'max-h-0 opacity-0 overflow-hidden'}`}
          >
            <button onClick={() => setActiveTab('dashboard')} className={`pb-2 px-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'dashboard' ? 'border-orange-500 text-orange-500' : 'border-transparent text-stone-500'}`}><Store className="w-4 h-4" /> Dashboard</button>
            <button onClick={() => setActiveTab('inventory')} className={`pb-2 px-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'inventory' ? 'border-orange-500 text-orange-500' : 'border-transparent text-stone-500'}`}><List className="w-4 h-4" /> Inventory</button>
            <button onClick={() => setActiveTab('reports')} className={`pb-2 px-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'reports' ? 'border-orange-500 text-orange-500' : 'border-transparent text-stone-500'}`}><AlertTriangle className="w-4 h-4" /> Laporan</button>
            <button onClick={() => setActiveTab('reviews')} className={`pb-2 px-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'reviews' ? 'border-orange-500 text-orange-500' : 'border-transparent text-stone-500'}`}><Star className="w-4 h-4" /> Ulasan</button>
          </div>
      </div>

      {activeTab === 'dashboard' && renderDashboard()}
      {activeTab === 'inventory' && renderInventory()}
      {activeTab === 'reports' && renderReports()}
      {activeTab === 'reviews' && renderReviews()}

      {/* SUB NAVBAR (Mobile Bottom Bar) - Collapsible - Controlled by Parent Prop now */}
      <div 
        className={`md:hidden fixed bottom-[64px] left-0 right-0 bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 z-40 px-4 transition-all duration-500 ease-in-out transform overflow-hidden ${isSubNavOpen ? 'max-h-20 translate-y-0 h-14' : 'max-h-0 translate-y-full h-0 border-none'}`}
      >
         <div className="grid grid-cols-4 h-full items-center">
            <button onClick={() => setActiveTab('dashboard')} className={`flex flex-col items-center justify-center gap-1 transition-colors ${activeTab === 'dashboard' ? 'text-orange-600 dark:text-orange-500' : 'text-stone-400'}`}>
               <Store className="w-5 h-5" />
               <span className="text-[10px] font-bold">Dash</span>
            </button>
            <button onClick={() => setActiveTab('inventory')} className={`flex flex-col items-center justify-center gap-1 transition-colors ${activeTab === 'inventory' ? 'text-orange-600 dark:text-orange-500' : 'text-stone-400'}`}>
               <List className="w-5 h-5" />
               <span className="text-[10px] font-bold">Stok</span>
            </button>
            <button onClick={() => setActiveTab('reports')} className={`flex flex-col items-center justify-center gap-1 transition-colors ${activeTab === 'reports' ? 'text-orange-600 dark:text-orange-500' : 'text-stone-400'}`}>
               <AlertTriangle className="w-5 h-5" />
               <span className="text-[10px] font-bold">Lapor</span>
            </button>
            <button onClick={() => setActiveTab('reviews')} className={`flex flex-col items-center justify-center gap-1 transition-colors ${activeTab === 'reviews' ? 'text-orange-600 dark:text-orange-500' : 'text-stone-400'}`}>
               <Star className="w-5 h-5" />
               <span className="text-[10px] font-bold">Ulas</span>
            </button>
         </div>
      </div>

      {/* Rank Details Modal */}
      {showRankDetails && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
           <div className="bg-white dark:bg-stone-900 rounded-3xl w-full max-w-md max-h-[80vh] flex flex-col relative shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-stone-100 dark:border-stone-800 flex justify-between items-center bg-stone-50/50 dark:bg-stone-900/50 backdrop-blur-sm z-10">
                <div>
                    <h3 className="text-lg font-bold text-stone-900 dark:text-white">Level Donatur</h3>
                    <p className="text-xs text-stone-500 dark:text-stone-400">Tingkatkan dampak sosial anda</p>
                </div>
                <button onClick={() => setShowRankDetails(false)} className="p-2 bg-stone-100 dark:bg-stone-800 rounded-full text-stone-500 hover:text-stone-900 dark:hover:text-white transition-colors">
                <X className="w-5 h-5" />
                </button>
            </div>
            <div className="overflow-y-auto p-4 space-y-3">
              {PROVIDER_RANKS.map((rank) => {
                  const isCurrent = rank.name === stats.currentRank;
                  return (
                    <div key={rank.id} className={`flex items-center gap-4 p-4 rounded-2xl border ${isCurrent ? 'bg-orange-50 border-orange-500' : 'bg-white border-stone-100'}`}>
                        <span className="text-sm font-bold">{rank.name}</span>
                    </div>
                  )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
