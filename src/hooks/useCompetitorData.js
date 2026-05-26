// Scraper API'sinden canlı rakip verisi çeken hook
// Scraper kurulmadan önce statik veriye fallback yapar
import { useState, useEffect, useCallback } from 'react';
import { COMPETITOR_SCORES as COMPETITOR_DATA } from '../data/competitorData';

const SCRAPER_URL = import.meta.env.VITE_SCRAPER_URL || 'http://localhost:3001';

export default function useCompetitorData() {
  const [data, setData]         = useState(null);   // canlı veri
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [isLive, setIsLive]     = useState(false);  // API bağlı mı?

  const fetchLiveData = useCallback(async () => {
    try {
      const res = await fetch(`${SCRAPER_URL}/api/competitors`, {
        signal: AbortSignal.timeout(5000), // 5 saniye timeout
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();

      // API verisi ile statik veriyi birleştir
      // (API'de olmayan alanlar statik veriden alınır)
      const merged = json.data.map(live => ({
        ...COMPETITOR_DATA[live.brandId],  // statik temel veri
        ...live,                           // canlı veri üzerine yazar
        // MongoDB'den gelen 'rating' → dashboard'un beklediği 'googleRating'
        ...(live.rating != null && { googleRating: live.rating }),
      }));

      setData(merged);
      setIsLive(true);
      setError(null);
    } catch (err) {
      // Scraper çalışmıyorsa statik veriye düş
      setIsLive(false);
      setError(null); // kullanıcıya hata gösterme, sessizce fallback yap
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLiveData();
    // 5 dakikada bir güncelle
    const id = setInterval(fetchLiveData, 300_000);
    return () => clearInterval(id);
  }, [fetchLiveData]);

  return {
    data:      data,           // canlı veri (null ise statik kullan)
    loading,
    error,
    isLive,                   // true = scraper bağlı, false = statik veri
    refetch:   fetchLiveData,
  };
}
