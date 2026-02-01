
import React, { useState } from 'react';
import { Shield, Store, User, Truck, BookOpen, ChevronUp, ChevronDown, MessageSquare } from 'lucide-react';
import { Button } from '../../components/Button';
import { FAQItem } from '../../../types';

export const FaqSection: React.FC = () => {
    const [openCategory, setOpenCategory] = useState<number | null>(0);
    const [openFaq, setOpenFaq] = useState<string | null>(null);

    const categories = [
        { category: "Umum", items: [{ question: "Apa itu Food AI Rescue?", answer: "Platform penyelamatan makanan berbasis AI." }] },
        { category: "SOP Donatur", items: [{ question: "Standar Makanan?", answer: "Tidak basi, kemasan rapi, aman." }] },
        { category: "SOP Penerima", items: [{ question: "Cara Klaim?", answer: "Pilih makanan, klik klaim, datang ke lokasi." }] }
    ];

    const handleContactCS = () => {
        window.open(`https://wa.me/6285215376975`, '_blank');
    };

    return (
        <div className="p-6 bg-[#FDFBF7] dark:bg-stone-950 min-h-screen animate-in fade-in">
            <div className="space-y-6">
                <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30 flex items-start gap-3 text-sm text-stone-500 dark:text-stone-400">
                    <BookOpen className="w-5 h-5 text-blue-500 shrink-0" />
                    <div><h4 className="font-bold text-blue-700 dark:text-blue-400 mb-1">Panduan Lengkap (SOP)</h4><p>Standar operasional untuk semua peran.</p></div>
                </div>

                {categories.map((cat, idx) => (
                    <div key={idx} className="space-y-3">
                        <button onClick={() => setOpenCategory(openCategory === idx ? null : idx)} className="w-full flex justify-between font-bold py-2 border-b-2 border-orange-100 dark:border-stone-800">
                            <span className="flex gap-2 items-center text-stone-800 dark:text-stone-200">
                                {idx === 0 ? <Shield className="w-4 h-4 text-orange-500" /> : <User className="w-4 h-4 text-orange-500" />} {cat.category}
                            </span>
                            {openCategory === idx ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                        {openCategory === idx && (
                            <div className="space-y-3 pl-2">
                                {cat.items.map((item, i) => (
                                    <div key={i} className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl overflow-hidden shadow-sm">
                                        <button onClick={() => setOpenFaq(openFaq === `${idx}-${i}` ? null : `${idx}-${i}`)} className="w-full flex justify-between p-4 text-left font-medium hover:bg-stone-50 dark:hover:bg-stone-800/50">
                                            {item.question} <ChevronDown className="w-4 h-4 text-stone-400" />
                                        </button>
                                        {openFaq === `${idx}-${i}` && <div className="p-4 pt-0 text-sm text-stone-600 bg-stone-50/50 dark:bg-stone-900/30">{item.answer}</div>}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}

                <div className="mt-8 p-6 bg-orange-50 dark:bg-orange-900/10 rounded-2xl border border-orange-100 dark:border-orange-900/30 text-center">
                    <h4 className="font-bold text-orange-700 dark:text-orange-400 mb-2">Butuh Bantuan?</h4>
                    <Button onClick={handleContactCS} className="w-auto bg-[#25D366] hover:bg-[#128C7E] border-0"><MessageSquare className="w-4 h-4 mr-2" /> Hubungi WhatsApp</Button>
                </div>
            </div>
        </div>
    );
};
