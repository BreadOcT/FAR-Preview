
import React, { useState, useEffect } from 'react';
import { Package, Search, ArrowLeft, Upload, Loader2, ArrowRight, ShieldCheck, Zap, CheckCircle2, AlertCircle, Clock, Thermometer, List, Info, ChevronRight, Sparkles, MessageSquareQuote, FileSearch, Calendar } from 'lucide-react';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { EmptyState } from '../../common/EmptyState';
import { FoodItem } from '../../../types';
import { analyzeFoodQuality } from '../../../services/ai';

export const InventoryManager: React.FC = () => {
  const [items, setItems] = useState<FoodItem[]>([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [uploadStep, setUploadStep] = useState<'initial-details' | 'upload' | 'analyzing' | 'result'>('initial-details');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [verificationResult, setVerificationResult] = useState<any | null>(null);
  
  const getCurrentDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  const getDefaultDistributionTimes = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    return {
      start: `${dateStr}T18:30`,
      end: `${dateStr}T21:00`
    };
  };

  const defaultTimes = getDefaultDistributionTimes();

  const [form, setForm] = useState({ 
    name: '', 
    ingredients: '',
    madeDateTime: getCurrentDateTime(),
    distributionStart: defaultTimes.start,
    distributionEnd: defaultTimes.end,
    quantity: '', 
    quantityUnit: 'Porsi' as 'Porsi' | 'Gram' | 'Box',
    storageLocation: 'Suhu Ruang',
    packaging: 'plastic' as 'no-plastic' | 'plastic' | 'recycled'
  });

  useEffect(() => {
    setItems(Array.from({ length: 5 }, (_, i) => ({
        id: `item-${i}`,
        name: `Nasi Kotak Berkah #${i+1}`,
        description: 'Makanan surplus layak konsumsi.',
        quantity: `${(i % 5) + 2} Porsi`,
        expiryTime: '23:00', 
        imageUrl: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?q=80&w=1000',
        providerName: 'Donatur Berkah',
        location: {lat:0, lng:0, address:''},
        status: 'available',
        deliveryMethod: 'pickup'
    })));
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setUploadStep('analyzing');
        processVerification(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const processVerification = async (img: string) => {
    await new Promise(resolve => setTimeout(resolve, 2500));
    const result = await analyzeFoodQuality(["Makanan"], img, {
        foodName: form.name,
        ingredients: form.ingredients || "Tidak diketahui",
        madeTime: form.madeDateTime,
        storageLocation: form.storageLocation,
        weightGram: form.quantityUnit === 'Gram' ? parseFloat(form.quantity) : 500,
        packagingType: form.packaging
    });
    setVerificationResult(result);
    setUploadStep('result');
  };

  const handleFinalPublish = () => {
      const newItem: FoodItem = {
          id: Date.now().toString(),
          name: form.name,
          description: verificationResult?.reason || 'Verified by AI',
          quantity: `${form.quantity} ${form.quantityUnit}`,
          expiryTime: form.distributionEnd ? form.distributionEnd.split('T')[1] : '23:59',
          imageUrl: imagePreview!,
          providerName: "Donatur Berkah",
          location: { lat: -6.914744, lng: 107.60981, address: "Jl. Asia Afrika No. 1" },
          status: 'available',
          deliveryMethod: 'pickup',
          aiVerification: { 
              isEdible: verificationResult?.qualityPercentage > 70.01,
              halalScore: verificationResult?.halalScore || 0,
              reason: verificationResult?.reason || '',
              ingredients: verificationResult?.detectedItems?.map((i:any) => i.name) || []
          },
          socialImpact: verificationResult?.socialImpact
      };
      setItems([newItem, ...items]);
      setIsAddingNew(false);
      setUploadStep('initial-details');
      setImagePreview(null);
      setVerificationResult(null);
  };

  if (isAddingNew) {
      return (
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm min-h-[80vh] flex flex-col relative overflow-hidden">
            <div className="p-6 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between sticky top-0 bg-white dark:bg-stone-900 z-10">
                <div className="flex items-center gap-3">
                    <button onClick={() => {
                        if (uploadStep === 'initial-details') setIsAddingNew(false);
                        else if (uploadStep === 'upload') setUploadStep('initial-details');
                        else if (uploadStep === 'result') setUploadStep('upload');
                    }} className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors">
                        <ArrowLeft className="w-6 h-6 text-stone-900 dark:text-white" />
                    </button>
                    <h2 className="text-xl font-bold text-stone-900 dark:text-white">
                        {uploadStep === 'initial-details' ? 'Informasi Produk' : uploadStep === 'upload' ? 'Ambil Foto Produk' : uploadStep === 'analyzing' ? 'Memverifikasi...' : 'Hasil Analisis AI'}
                    </h2>
                </div>
            </div>
            
            <div className="flex-1 flex flex-col items-center p-4 md:p-8 w-full max-w-4xl mx-auto overflow-y-auto pb-24">
                {uploadStep === 'initial-details' && (
                    <div className="w-full max-w-2xl space-y-6 animate-in fade-in slide-in-from-bottom-4">
                        <Input label="Nama Makanan" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Contoh: Nasi Goreng Spesial" required />
                        
                        <div className="grid grid-cols-2 gap-4">
                            <Input label="Jumlah" type="number" value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})} />
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-stone-600 dark:text-stone-400">Satuan</label>
                                <select className="w-full p-3 rounded-xl border border-stone-300 dark:border-stone-800 bg-white dark:bg-stone-950 text-stone-900 dark:text-white" value={form.quantityUnit} onChange={e => setForm({...form, quantityUnit: e.target.value as any})}>
                                    <option value="Porsi">Porsi</option>
                                    <option value="Box">Box</option>
                                    <option value="Gram">Gram</option>
                                </select>
                            </div>
                        </div>

                        <Input label="Bahan Utama (Pisahkan koma)" value={form.ingredients} onChange={e => setForm({...form, ingredients: e.target.value})} placeholder="Ayam, Nasi, Telur..." />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input label="Waktu Pembuatan" type="datetime-local" value={form.madeDateTime} onChange={e => setForm({...form, madeDateTime: e.target.value})} />
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-stone-600 dark:text-stone-400">Penyimpanan</label>
                                <select className="w-full p-3 rounded-xl border border-stone-300 dark:border-stone-800 bg-white dark:bg-stone-950 text-stone-900 dark:text-white" value={form.storageLocation} onChange={e => setForm({...form, storageLocation: e.target.value})}>
                                    <option>Suhu Ruang</option>
                                    <option>Kulkas (Chiller)</option>
                                    <option>Freezer</option>
                                    <option>Dipanaskan terus</option>
                                </select>
                            </div>
                        </div>

                        {/* WAKTU DISTRIBUSI SURPLUS */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-stone-700 dark:text-stone-300 flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-orange-500" /> Waktu Distribusi Surplus
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                                <Input 
                                    label="Mulai (Buka)" 
                                    type="datetime-local" 
                                    value={form.distributionStart} 
                                    onChange={e => setForm({...form, distributionStart: e.target.value})} 
                                />
                                <Input 
                                    label="Selesai (Tutup)" 
                                    type="datetime-local" 
                                    value={form.distributionEnd} 
                                    onChange={e => setForm({...form, distributionEnd: e.target.value})} 
                                />
                            </div>
                            <p className="text-[10px] text-stone-400 italic">Default disetel ke jam 18:30 - 21:00 hari ini.</p>
                        </div>

                        <div className="pt-6">
                            <Button onClick={() => setUploadStep('upload')} disabled={!form.name || !form.quantity}>
                                LANJUT KE PENGAMBILAN FOTO <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        </div>
                    </div>
                )}
                
                {uploadStep === 'upload' && (
                    <div className="w-full max-w-lg text-center animate-in zoom-in-95 py-12">
                        <div className="relative group cursor-pointer w-full max-w-xs aspect-square mx-auto border-4 border-dashed border-orange-200 dark:border-stone-700 rounded-[2.5rem] flex flex-col items-center justify-center hover:border-orange-500 hover:bg-orange-50/30 dark:hover:bg-stone-800/30 transition-all duration-500">
                            <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer z-20" onChange={handleImageUpload} />
                            <div className="w-20 h-20 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Upload className="w-10 h-10 text-orange-600" />
                            </div>
                            <span className="font-bold text-xl text-stone-800 dark:text-stone-200">Upload Foto</span>
                            <span className="text-sm text-stone-400 mt-2 px-6">Ambil foto makanan yang jelas untuk dianalisis AI</span>
                        </div>
                    </div>
                )}
                
                {uploadStep === 'analyzing' && (
                    <div className="text-center animate-in fade-in py-24">
                        <div className="relative inline-block mb-8">
                             <div className="w-24 h-24 rounded-full border-4 border-orange-100 border-t-orange-500 animate-spin"></div>
                             <div className="absolute inset-0 flex items-center justify-center">
                                <Sparkles className="w-8 h-8 text-orange-400" />
                             </div>
                        </div>
                        <h3 className="text-3xl font-black text-stone-900 dark:text-white tracking-tight">AI Menganalisis...</h3>
                        <p className="text-stone-500 mt-3 max-w-sm mx-auto">Sistem sedang memeriksa kesegaran, kehalalan, dan standar higienis produk Anda.</p>
                    </div>
                )}
                
                {uploadStep === 'result' && verificationResult && (
                    <div className="w-full max-w-4xl animate-in slide-in-from-bottom-12 duration-700 space-y-8">
                        {/* MAIN SUMMARY CARD (GELAP) */}
                        <div className="bg-[#1A1D27] dark:bg-[#0F1117] rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 rounded-full blur-[80px] -mr-32 -mt-32"></div>
                            
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
                                <div>
                                    <p className="text-stone-500 text-xs font-bold uppercase tracking-[0.2em] mb-4">QUALITY PERCENTAGE</p>
                                    <div className="text-8xl md:text-9xl font-black text-[#00E676] tracking-tighter leading-none">
                                        {verificationResult.qualityPercentage}%
                                    </div>
                                </div>
                                <div className="mt-6 md:mt-0">
                                    <div className={`w-20 h-20 rounded-3xl flex items-center justify-center border ${verificationResult.qualityPercentage > 70 ? 'bg-[#00E676]/10 border-[#00E676]/30' : 'bg-red-500/10 border-red-500/30'}`}>
                                        {verificationResult.qualityPercentage > 70 ? (
                                            <CheckCircle2 className="w-12 h-12 text-[#00E676]" />
                                        ) : (
                                            <AlertCircle className="w-12 h-12 text-red-500" />
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-sm">
                                    <p className="text-stone-500 text-[10px] font-bold uppercase tracking-widest mb-2">HYGIENE SCORE</p>
                                    <div className="flex items-center gap-2">
                                        <Zap className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                                        <span className="text-2xl font-bold text-white">{verificationResult.hygieneScore}/100</span>
                                    </div>
                                </div>
                                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-sm">
                                    <p className="text-stone-500 text-[10px] font-bold uppercase tracking-widest mb-2">STATUS HALAL</p>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-[#00E676]" />
                                        <span className="text-2xl font-bold text-white">{verificationResult.halalScore > 80 ? 'Halal' : 'Butuh Cek'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* ENHANCED AI NARRATIVE SECTION */}
                            <div className="pt-8 border-t border-white/10">
                                <div className="flex items-center gap-2 mb-4">
                                    <FileSearch className="w-4 h-4 text-orange-400" />
                                    <span className="text-[10px] font-bold text-orange-400 uppercase tracking-[0.2em]">Deskripsi Hasil Analisis</span>
                                </div>
                                <div className="bg-white/[0.03] rounded-2xl p-6 border border-white/[0.05]">
                                    <p className="text-stone-300 text-sm md:text-base italic leading-relaxed font-medium">
                                        "{verificationResult.reason}"
                                    </p>
                                    {verificationResult.halalReasoning && (
                                        <p className="text-stone-500 text-xs mt-4 border-t border-white/5 pt-4">
                                            <span className="font-bold text-white/40 uppercase mr-2">Catatan Halal:</span>
                                            {verificationResult.halalReasoning}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* VERIFIED BANNER */}
                        {verificationResult.qualityPercentage >= 70 && (
                            <div className="bg-[#E8F5E9] dark:bg-green-900/20 border border-[#A5D6A7] dark:border-green-800 rounded-2xl p-4 flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-[#00C853] flex items-center justify-center text-white shrink-0">
                                    <Sparkles className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-[#1B5E20] dark:text-green-400 text-sm">Kualitas Terverifikasi</h4>
                                    <p className="text-[#2E7D32] dark:text-green-500 text-xs">Produk memenuhi standar (Skor ≥ 70%).</p>
                                </div>
                            </div>
                        )}

                        {/* ACTION BUTTON */}
                        {verificationResult.qualityPercentage > 70.01 ? (
                            <Button onClick={handleFinalPublish} className="h-16 text-lg bg-[#00897B] hover:bg-[#00796B] rounded-2xl border-0 shadow-lg shadow-teal-900/20 uppercase font-black tracking-widest">
                                <PlusCircle className="w-5 h-5 mr-2" /> LANJUT KE PUBLIKASIKAN PRODUK
                            </Button>
                        ) : (
                            <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-[2rem] p-8 text-center space-y-4">
                                <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
                                <div>
                                    <h4 className="text-red-700 dark:text-red-400 font-black text-xl">Kualitas di Bawah Standar</h4>
                                    <p className="text-red-600 dark:text-red-500 text-sm font-medium mt-1">Dibutuhkan minimal 70.01% untuk publikasi ke publik.</p>
                                </div>
                                <Button variant="outline" className="w-full border-red-200 text-red-600 hover:bg-red-50 max-w-xs mx-auto" onClick={() => setUploadStep('upload')}>Coba Foto Lain</Button>
                            </div>
                        )}

                        {/* DETECTED ITEMS */}
                        <div className="space-y-4">
                            <h4 className="font-black text-stone-900 dark:text-white text-lg flex items-center gap-2">
                                <List className="w-5 h-5 text-orange-500" /> Item Terdeteksi
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {verificationResult.detectedItems?.map((item: any, i: number) => (
                                    <div key={i} className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 px-4 py-2 rounded-lg flex items-center gap-2">
                                        <span className="text-xs font-black text-blue-800 dark:text-blue-400 uppercase tracking-tighter">
                                            {item.name} • {item.category}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ALLERGENS */}
                        <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-100 dark:border-stone-800 shadow-sm space-y-4">
                            <h4 className="font-black text-stone-900 dark:text-white text-base flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 text-red-500" /> PERINGATAN ALERGEN
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {verificationResult.allergens?.length > 0 ? (
                                    verificationResult.allergens.map((alg: string, i: number) => (
                                        <span key={i} className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider">
                                            {alg}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-stone-400 text-sm">Tidak ada alergen kritis terdeteksi.</span>
                                )}
                            </div>
                        </div>

                        {/* SHELF LIFE */}
                        <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-100 dark:border-stone-800 shadow-sm flex items-center gap-5">
                            <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                                <Clock className="w-8 h-8 text-blue-500" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">PREDIKSI MASA SIMPAN</p>
                                <h4 className="font-black text-stone-900 dark:text-white text-lg leading-tight">
                                    {verificationResult.shelfLifePrediction}
                                </h4>
                                <p className="text-xs text-stone-500 mt-1">Dihitung dari waktu & lokasi penyimpanan.</p>
                            </div>
                        </div>

                        {/* STORAGE TIPS */}
                        <div className="bg-white dark:bg-stone-900 rounded-3xl p-8 border border-stone-100 dark:border-stone-800 shadow-sm space-y-6">
                            <h4 className="font-black text-[#F4511E] dark:text-orange-400 text-base flex items-center gap-2 uppercase tracking-widest">
                                <Thermometer className="w-5 h-5" /> TIPS PENYIMPANAN
                            </h4>
                            <div className="space-y-4">
                                {verificationResult.storageTips?.map((tip: string, i: number) => (
                                    <div key={i} className="flex items-start gap-4">
                                        <span className="w-6 h-6 rounded-full bg-orange-50 dark:bg-orange-900/20 text-[#F4511E] dark:text-orange-400 flex items-center justify-center text-xs font-black shrink-0">
                                            {i + 1}
                                        </span>
                                        <p className="text-stone-700 dark:text-stone-300 text-sm font-medium leading-relaxed">
                                            {tip}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
      );
  }

  return (
    <div className="space-y-6 animate-in fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-2xl font-bold text-stone-900 dark:text-white">Inventory Donasi</h2>
            <Button className="w-full md:w-auto px-6" onClick={() => setIsAddingNew(true)}>+ Tambah Donasi Baru</Button>
        </div>
        
        <div className="flex gap-3">
            <Input label="" placeholder="Cari makanan..." icon={<Search className="w-5 h-5" />} containerClassName="flex-1" />
        </div>
        
        {items.length === 0 ? (
            <EmptyState 
                icon={Package} 
                title="Belum Ada Donasi" 
                description="Mulai donasi pertamamu hari ini dan bantu mereka yang membutuhkan."
                actionLabel="Tambah Donasi"
                onAction={() => setIsAddingNew(true)}
            />
        ) : (
            <div className="grid grid-cols-1 gap-4">
                {items.map(item => (
                    <div key={item.id} className="bg-white dark:bg-stone-900 p-4 rounded-2xl border border-stone-200 dark:border-stone-800 flex gap-4 shadow-sm group hover:border-orange-500 transition-colors">
                        <div className="w-24 h-24 rounded-xl overflow-hidden bg-stone-100 shrink-0">
                            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <h3 className="font-bold text-lg text-stone-900 dark:text-white line-clamp-1">{item.name}</h3>
                                <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded">{item.status}</span>
                            </div>
                            <p className="text-stone-500 text-sm mt-1">{item.quantity} • Exp: {item.expiryTime}</p>
                            <p className="text-stone-400 text-xs mt-2 line-clamp-1">{item.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        )}
    </div>
  );
};

const PlusCircle = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>
);
