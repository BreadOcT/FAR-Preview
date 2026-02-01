
import React, { useState } from 'react';
import { Star, MessageSquare } from 'lucide-react';
import { Review } from '../../../types';
import { EmptyState } from '../../common/EmptyState';

export const ReviewsView: React.FC = () => {
  const [reviews] = useState<Review[]>([
    { id: '1', user: 'Penerima A', rating: 5, comment: 'Sangat membantu, terima kasih!', date: '20 Feb 2025' },
    { id: '2', user: 'Penerima B', rating: 4, comment: 'Makanan enak, tapi agak sedikit.', date: '18 Feb 2025' },
  ]);

  return (
    <div className="space-y-6 animate-in fade-in">
       <div className="flex justify-between items-center">
         <h2 className="text-2xl font-bold text-stone-900 dark:text-white">Ulasan Penerima ({reviews.length})</h2>
       </div>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.length === 0 && (
             <div className="col-span-full">
                <EmptyState 
                    icon={MessageSquare}
                    title="Belum Ada Ulasan"
                    description="Bagikan lebih banyak donasi untuk mendapatkan ulasan dari penerima manfaat."
                />
             </div>
          )}
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
};
