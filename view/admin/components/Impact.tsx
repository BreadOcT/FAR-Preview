
import React from 'react';
import { TrendingUp, Leaf } from 'lucide-react';
import { Button } from '../../components/Button';

// Helper Chart
const AdminBarChart = ({ data, labels, colorClass }: { data: number[], labels: string[], colorClass: string }) => {
    const max = Math.max(...data, 10);
    return (
      <div className="flex items-end gap-3 h-48 mt-6 w-full">
        {data.map((val, idx) => (
          <div key={idx} className="flex-1 flex flex-col justify-end group relative h-full">
            <div className="relative w-full flex-1 flex items-end">
                <div 
                  className={`w-full rounded-t-sm transition-all duration-500 ${colorClass} opacity-80 hover:opacity-100`} 
                  style={{ height: `${(val / max) * 100}%`, minHeight: '4px' }}
                ></div>
            </div>
            <p className="text-[10px] text-center text-stone-500 dark:text-stone-400 mt-2 truncate">{labels[idx]}</p>
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-stone-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10">
              {val}
            </div>
          </div>
        ))}
      </div>
    );
};

export const Impact: React.FC = () => {
  const handleExportImpactCSV = () => alert('Mengunduh Impact Data (CSV)...');
  const handleGenerateReport = () => alert('Membuat Laporan CSR & ESG (PDF)...');

  return (
      <div className="space-y-6 animate-in fade-in">
          <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-stone-900 dark:text-white flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-orange-500" /> Laporan Dampak Sosial
              </h2>
              <div className="flex gap-2">
                  <Button variant="outline" className="text-xs h-9" onClick={handleExportImpactCSV}>Export Data</Button>
                  <Button className="text-xs h-9" onClick={handleGenerateReport}>Buat Laporan PDF</Button>
              </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm w-full overflow-hidden">
                  <h3 className="font-bold mb-4 text-stone-900 dark:text-white">Pengurangan Limbah Pangan (Kg)</h3>
                  <AdminBarChart data={[300, 450, 320, 500, 480, 600, 550]} labels={['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min']} colorClass="bg-green-500" />
              </div>
              <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm w-full overflow-hidden">
                  <h3 className="font-bold mb-4 text-stone-900 dark:text-white">Penerima Manfaat Terbantu</h3>
                  <AdminBarChart data={[50, 65, 45, 80, 70, 90, 85]} labels={['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min']} colorClass="bg-blue-500" />
              </div>
          </div>

          <div className="bg-gradient-to-br from-teal-900 to-emerald-900 rounded-2xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-lg relative overflow-hidden">
               <div className="relative z-10">
                   <h3 className="text-2xl font-bold mb-2">Target Zero Waste 2030</h3>
                   <p className="text-emerald-100 max-w-lg">Kita telah mencapai 24% dari target pengurangan limbah tahunan hanya dalam 3 bulan pertama. Teruskan momentum ini!</p>
               </div>
               <div className="w-32 h-32 relative flex-shrink-0 z-10">
                   <svg className="w-full h-full transform -rotate-90" viewBox="0 0 128 128">
                       <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-emerald-800" />
                       <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray="351.86" strokeDashoffset="267.4" className="text-emerald-400" />
                   </svg>
                   <div className="absolute inset-0 flex items-center justify-center font-black text-2xl">24%</div>
               </div>
               <div className="absolute right-0 bottom-0 opacity-10">
                   <Leaf className="w-64 h-64" />
               </div>
          </div>
      </div>
  );
};
