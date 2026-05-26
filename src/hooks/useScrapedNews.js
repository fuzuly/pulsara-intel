// Railway scraper'ından Google News RSS + marka sitesi haberlerini çeker
import { useState, useEffect, useCallback } from 'react';

const SCRAPER_URL = import.meta.env.VITE_SCRAPER_URL || 'http://localhost:3001';

export default function useScrapedNews(brandId = null) {
  const [news, setNews]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive]   = useState(false);

  const fetchNews = useCallback(async () => {
    try {
      const params = new URLSearchParams({ limit: 100 });
      if (brandId) params.set('brand', brandId);

      const res = await fetch(`${SCRAPER_URL}/api/news?${params}`, {
        signal: AbortSignal.timeout(5000),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();

      setNews(json.data || []);
      setIsLive(true);
    } catch {
      setIsLive(false);
    } finally {
      setLoading(false);
    }
  }, [brandId]);

  useEffect(() => {
    fetchNews();
    const id = setInterval(fetchNews, 6 * 60 * 60 * 1000); // 6 saatte bir
    return () => clearInterval(id);
  }, [fetchNews]);

  return { news, loading, isLive, refetch: fetchNews };
}
