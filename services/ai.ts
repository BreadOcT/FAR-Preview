import { GoogleGenAI, Type } from "@google/genai";
import { SocialImpactData } from "../types";

export interface DetectedItem {
  name: string;
  category: 'Buah' | 'Sayur' | 'Protein' | 'Karbohidrat' | 'Olahan' | 'Roti' | 'Bumbu' | 'Lainnya';
}

export interface QualityAnalysisResult {
  isSafe: boolean;
  isHalal: boolean;
  halalScore: number; // 0-100
  halalReasoning: string;
  reasoning: string;
  allergens: string[];
  shelfLifePrediction: string; 
  hygieneScore: number;
  qualityPercentage: number;
  detectedItems: DetectedItem[];
  detectedCategory: 'Daging Sapi' | 'Nasi' | 'Sayuran' | 'Buah' | 'Campuran' | 'Lainnya';
  storageTips: string[];
  socialImpact: SocialImpactData;
}

export interface RecipeSuggestion {
  id: string;
  title: string;
  ingredientsUsed: string[];
  instructions: string[];
  difficulty: 'Mudah' | 'Sedang' | 'Sulit';
  sourceUrl?: string;
}

export interface LocationInfo {
  address: string;
  placeName: string;
  mapUrl?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  rt?: string;
  rw?: string;
}

export interface AnalysisContext {
  foodName: string; 
  ingredients: string; 
  madeTime: string; 
  storageLocation: string;
  weightGram: number;
  packagingType: 'no-plastic' | 'plastic' | 'recycled';
}

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- SOCIAL IMPACT CALCULATION LOGIC ---
const calculateSocialImpact = (
  category: string, 
  weightGram: number, 
  packagingType: string
): SocialImpactData => {
  
  // 1. EIS (Environmental Impact Score) per 500g
  let eis = 65; // Default Mixed
  let co2Factor = 3.0; // kg per 500g
  let waterFactor = 650; // liter per 500g
  let landFactor = 1.3; // m2 per 500g

  switch (category) {
    case 'Daging Sapi': 
      eis = 100; co2Factor = 20.0; waterFactor = 800; landFactor = 1.5; break;
    case 'Nasi': 
      eis = 70; co2Factor = 3.5; waterFactor = 700; landFactor = 1.2; break;
    case 'Sayuran': 
      eis = 50; co2Factor = 1.5; waterFactor = 500; landFactor = 1.0; break;
    case 'Buah': 
      eis = 60; co2Factor = 2.0; waterFactor = 600; landFactor = 1.1; break;
    case 'Campuran': 
    default:
      eis = 65; co2Factor = 3.0; waterFactor = 650; landFactor = 1.3; break;
  }

  // 2. QW (Quantity Weight)
  // Formula: (Berat_dalam_gram / 500) * Faktor_Kemasan
  let packagingFactor = 1.0;
  if (packagingType === 'no-plastic') packagingFactor = 1.2;
  else if (packagingType === 'recycled') packagingFactor = 1.1;
  else if (packagingType === 'plastic') packagingFactor = 0.9;

  const quantityRatio = weightGram / 500;
  const qw = quantityRatio * packagingFactor;

  // 3. RMB (Rescue Method Bonus) - Food Rescue is always 1.0 (100% bonus)
  const rmb = 1.0;

  // Final Point Calculation
  const totalPoints = Math.round((eis * qw) * rmb);

  // Calculate Specific Impacts (Proportional to weight)
  const co2Saved = parseFloat((co2Factor * quantityRatio).toFixed(1));
  const waterSaved = Math.round(waterFactor * quantityRatio);
  const landSaved = parseFloat((landFactor * quantityRatio).toFixed(1));

  // Determine Level
  let level = "Pemula";
  if (totalPoints > 5000) level = "Legend";
  else if (totalPoints > 2000) level = "Master";
  else if (totalPoints > 500) level = "Expert";
  else if (totalPoints > 100) level = "Aktif";

  return {
    totalPoints,
    co2Saved,
    waterSaved,
    landSaved,
    wasteReduction: weightGram / 1000, // kg
    level
  };
};

// ... (Existing location functions: parseRawAddress, searchLocationByCoords, searchLocationByQuery remain unchanged) ...
/**
 * Langkah 2: Mengurai string alamat mentah menjadi objek JSON terstruktur
 */
export const parseRawAddress = async (rawAddress: string): Promise<Partial<LocationInfo>> => {
    try {
      const ai = getAI();
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Uraikan alamat berikut ke dalam komponen terpisah: "${rawAddress}"`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              city: { type: Type.STRING },
              province: { type: Type.STRING },
              postalCode: { type: Type.STRING },
              rt: { type: Type.STRING },
              rw: { type: Type.STRING },
              streetName: { type: Type.STRING }
            },
            required: ["city", "province"]
          }
        }
      });
      return JSON.parse(response.text || "{}");
    } catch (error) {
      console.error("Parser Error:", error);
      return {};
    }
  };
  
  export const searchLocationByCoords = async (lat: number, lng: number): Promise<LocationInfo> => {
    try {
      const ai = getAI();
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `What place is at latitude ${lat} and longitude ${lng}? Provide the full address and place name.`,
        config: {
          tools: [{ googleMaps: {} }],
          toolConfig: {
            retrievalConfig: {
              latLng: { latitude: lat, longitude: lng }
            }
          }
        },
      });
  
      const text = response.text || "";
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const mapChunk = groundingChunks.find(c => c.maps);
      const parsed = await parseRawAddress(text);
  
      return {
        placeName: mapChunk?.maps?.title || "Lokasi Terdeteksi",
        address: text || mapChunk?.maps?.title || `Koordinat: ${lat}, ${lng}`,
        city: parsed.city || "",
        province: parsed.province || "",
        postalCode: parsed.postalCode || "",
        rt: parsed.rt || "",
        rw: parsed.rw || "",
        mapUrl: mapChunk?.maps?.uri
      };
    } catch (error) {
      console.error("Critical Location Extraction Error:", error);
      return { address: `Koordinat: ${lat.toFixed(6)}, ${lng.toFixed(6)}`, placeName: "Titik Lokasi" };
    }
  };

  export const searchLocationByQuery = async (query: string, userLat?: number, userLng?: number): Promise<LocationInfo[]> => {
    try {
      const ai = getAI();
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Find places matching: "${query}". Return a list of places.`,
        config: {
          tools: [{ googleMaps: {} }],
          toolConfig: userLat && userLng ? {
            retrievalConfig: {
              latLng: { latitude: userLat, longitude: userLng }
            }
          } : undefined
        },
      });
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      return chunks.filter((c: any) => c.maps).map((c: any) => ({
          address: c.maps.title,
          placeName: c.maps.title,
          mapUrl: c.maps.uri
      }));
    } catch (error) {
      console.error("Maps Search Error:", error);
      return [];
    }
  };

export const analyzeFoodQuality = async (
  inputLabels: string[], 
  imageBase64?: string,
  context?: AnalysisContext
): Promise<QualityAnalysisResult> => {
  try {
    const ai = getAI();
    const parts: any[] = [];
    if (imageBase64) {
      const base64Data = imageBase64.split(',')[1] || imageBase64;
      parts.push({
        inlineData: { mimeType: 'image/jpeg', data: base64Data }
      });
    }

    // Prepare advanced prompt
    const currentTime = new Date().toLocaleString('id-ID');
    let prompt = `Analisis kualitas bahan surplus ini. Bahan: ${inputLabels.join(', ')}.`;

    if (context) {
      prompt = `
      Anda adalah auditor kualitas makanan (Food Rescue AI).
      Waktu Sekarang: ${currentTime}

      DATA MAKANAN DARI PENYEDIA:
      - Nama: ${context.foodName}
      - Bahan Utama: ${context.ingredients}
      - Waktu Dibuat: ${context.madeTime}
      - Lokasi Simpan: ${context.storageLocation}
      
      TUGAS:
      1. Validasi Keamanan: Bandingkan Waktu Dibuat dengan Waktu Sekarang. Jika selisih > 4 jam (suhu ruang) atau > 24 jam (kulkas), beri peringatan risiko.
      2. Validasi Visual: Apakah gambar cocok dengan nama/bahan?
      3. Kategori Lingkungan: Tentukan apakah ini 'Daging Sapi', 'Nasi', 'Sayuran', 'Buah', atau 'Campuran' untuk perhitungan jejak karbon.
      4. Cek Halal: Analisis bahan dan visual untuk menentukan skor halal (0-100).

      Output JSON sesuai schema.
      `;
    }

    const schema = {
      type: Type.OBJECT,
      properties: {
        isSafe: { type: Type.BOOLEAN },
        isHalal: { type: Type.BOOLEAN },
        halalScore: { type: Type.INTEGER, description: "0-100 probability" },
        halalReasoning: { type: Type.STRING },
        reasoning: { type: Type.STRING },
        allergens: { type: Type.ARRAY, items: { type: Type.STRING } },
        shelfLifePrediction: { type: Type.STRING },
        hygieneScore: { type: Type.INTEGER },
        qualityPercentage: { type: Type.INTEGER },
        detectedItems: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              category: { type: Type.STRING }
            },
            required: ["name", "category"]
          }
        },
        detectedCategory: { 
            type: Type.STRING, 
            enum: ['Daging Sapi', 'Nasi', 'Sayuran', 'Buah', 'Campuran', 'Lainnya'],
            description: "Kategori utama untuk perhitungan jejak karbon" 
        },
        storageTips: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ["isSafe", "isHalal", "halalScore", "halalReasoning", "reasoning", "detectedCategory", "hygieneScore", "qualityPercentage", "detectedItems"]
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts: [...parts, { text: prompt }] },
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      }
    });

    const aiResult = JSON.parse(response.text || '{}');

    // POST-PROCESSING: Calculate Social Points using Deterministic Math
    const socialImpact = calculateSocialImpact(
        aiResult.detectedCategory, 
        context?.weightGram || 500, // fallback 500g
        context?.packagingType || 'plastic'
    );

    return {
        ...aiResult,
        socialImpact
    } as QualityAnalysisResult;

  } catch (error: any) {
    console.error("Quality Analysis Error:", error);
    // Return safe fallback
    return {
        isSafe: false,
        isHalal: false,
        halalScore: 0,
        halalReasoning: "Gagal analisis",
        reasoning: "Terjadi kesalahan sistem AI: " + error.message,
        allergens: [],
        shelfLifePrediction: "Tidak diketahui",
        hygieneScore: 0,
        qualityPercentage: 0,
        detectedItems: [],
        detectedCategory: 'Campuran',
        storageTips: [],
        socialImpact: { totalPoints: 0, co2Saved: 0, waterSaved: 0, landSaved: 0, wasteReduction: 0, level: 'Pemula' }
    };
  }
};

// ... (Rest of recipe/metadata functions remain the same) ...
export const extractFoodMetadata = async (promptText: string, imageBase64: string): Promise<{ category: string, tags: string[] }> => {
    try {
      const ai = getAI();
      const base64Data = imageBase64.split(',')[1] || imageBase64;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: {
          parts: [
            { inlineData: { mimeType: 'image/jpeg', data: base64Data } },
            { text: `${promptText}. Ekstrak kategori (Makanan Berat, Minuman, Roti & Kue, Buah & Sayur) dan bahan-bahan utama sebagai tags.` }
          ]
        },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              category: { type: Type.STRING },
              tags: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["category", "tags"]
          }
        }
      });
  
      return JSON.parse(response.text || '{"category": "Makanan Berat", "tags": []}');
    } catch (error) {
      console.error("Extract Metadata Error:", error);
      return { category: "Makanan Berat", tags: [] };
    }
  };
  
  export const generateRecipesFromSurplus = async (
    items: DetectedItem[], 
    excludeTitles: string[] = [],
    iteration: number = 1
  ): Promise<RecipeSuggestion[]> => {
    try {
      const ai = getAI();
      const itemNames = items.map(i => i.name).join(', ');
  
      const prompt = `Temukan resep unik di Cookpad Indonesia menggunakan Google Search.
  Bahan tersedia: ${itemNames}. Berikan daftar resep dalam format JSON terstruktur.`;
  
      const schema = {
        type: Type.OBJECT,
        properties: {
          recipes: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                title: { type: Type.STRING },
                ingredientsUsed: { type: Type.ARRAY, items: { type: Type.STRING } },
                instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
                difficulty: { type: Type.STRING, enum: ['Mudah', 'Sedang', 'Sulit'] },
                sourceUrl: { type: Type.STRING }
              },
              required: ["id", "title", "ingredientsUsed", "instructions", "difficulty", "sourceUrl"]
            }
          }
        },
        required: ["recipes"]
      };
  
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json",
          responseSchema: schema
        }
      });
  
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const data = JSON.parse(response.text || '{"recipes":[]}');
      
      if (data.recipes && data.recipes.length > 0 && groundingChunks.length > 0) {
        data.recipes = data.recipes.map((r: any, idx: number) => ({
          ...r,
          sourceUrl: r.sourceUrl || groundingChunks[idx]?.web?.uri || groundingChunks[0]?.web?.uri
        }));
      }
  
      return data.recipes;
    } catch (error) {
      console.error("Recipe Search Error:", error);
      return [];
    }
  };
  
  export const detectIngredientsFromImage = async (imageBase64: string): Promise<string> => {
    try {
      const ai = getAI();
      const base64Data = imageBase64.split(',')[1] || imageBase64;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: {
          parts: [
            { inlineData: { mimeType: 'image/jpeg', data: base64Data } },
            { text: "Identifikasi bahan-bahan makanan utama yang terlihat dalam gambar ini. Berikan jawaban hanya berupa daftar bahan yang dipisahkan dengan koma dalam Bahasa Indonesia. Contoh: 'Ayam, Nasi, Selada, Timun'." }
          ]
        }
      });
  
      return response.text || "";
    } catch (error) {
      console.error("Ingredient Detection Error:", error);
      return "";
    }
  };