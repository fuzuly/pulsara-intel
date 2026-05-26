// API Konfigürasyonu
// NewsData.io — Gerçek zamanlı haber akışı (CORS destekli, tarayıcıdan çalışır)
export const NEWSDATA_API_KEY  = import.meta.env.VITE_NEWSDATA_API_KEY;
export const NEWSDATA_BASE_URL = 'https://newsdata.io/api/1/news';

// Yalnızca kahve sektörü — Türkiye odaklı
// NewsData.io free tier: kısa, basit sorgu — marka filtresi client-side yapılıyor (useNewsData.js)
export const COFFEE_NEWS_QUERY = 'kahve OR coffee';
