
import React, { useState } from 'react';
import { FoodItem } from '../../types';
import { FoodList } from './components/FoodList';
import { FoodDetail } from './components/FoodDetail';

interface ReceiverIndexProps {
  onOpenNotifications: () => void;
  onNavigateToHistory: () => void;
}

export const ReceiverIndex: React.FC<ReceiverIndexProps> = ({ onOpenNotifications, onNavigateToHistory }) => {
  const [selectedItem, setSelectedItem] = useState<FoodItem | null>(null);

  // Mock Data (Ideally moved to a service or context)
  const foodItems: FoodItem[] = [
    {
      id: '1', name: 'Roti Manis Assorted', description: 'Sisa produksi hari ini, masih sangat layak. Berbagai rasa coklat dan keju.', quantity: '10 Pcs', expiryTime: '21:00',
      imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=2072&auto=format&fit=crop', providerName: 'Bakery Lestari',
      location: { lat: -6.914744, lng: 107.609810, address: 'Jl. Lengkong Besar No. 45' }, status: 'available', deliveryMethod: 'pickup',
      aiVerification: { 
        isEdible: true, 
        reason: 'Tekstur terlihat lembut, tidak ada jamur, kemasan utuh.', 
        halalScore: 98,
        ingredients: ['Tepung Terigu', 'Telur', 'Gula', 'Ragi', 'Coklat']
      }
    },
    {
      id: '2', name: 'Nasi Box Ayam Bakar', description: 'Kelebihan pesanan catering rapat. Ayam bakar madu dengan lalapan.',
      quantity: '5 Box',
      expiryTime: '19:00',
      imageUrl: 'https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?q=80&w=2080&auto=format&fit=crop', providerName: 'Catering Bu Hajjah',
      location: { lat: -6.920000, lng: 107.610000, address: 'Jl. Burangrang No. 10' }, status: 'available', deliveryMethod: 'delivery',
      aiVerification: { 
        isEdible: true, 
        reason: 'Dikemas rapi, baru dimasak 2 jam lalu.', 
        halalScore: 100,
        ingredients: ['Ayam', 'Nasi', 'Kecap Manis', 'Sambal', 'Timun']
      }
    }
  ];

  if (selectedItem) {
      return (
        <FoodDetail 
            item={selectedItem} 
            onBack={() => setSelectedItem(null)} 
            onClaim={onNavigateToHistory} 
        />
      );
  }

  return (
    <FoodList 
        onOpenNotifications={onOpenNotifications} 
        onSelectItem={setSelectedItem} 
        foodItems={foodItems} 
    />
  );
};
