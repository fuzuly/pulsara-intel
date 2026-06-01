import { useState, useEffect } from 'react';

const API_BASE  = import.meta.env.VITE_SCRAPER_URL || 'https://espressolab-scraper-production.up.railway.app';
const CACHE_KEY = 'gj-reviews-v1';
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 saat

export default function useGJReviews() {
  const [branches,    setBranches]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);
  const [scrapedAt,   setScrapedAt]   = useState(null);
  const [pending,     setPending]     = useState(false);

  const load = async (forceRefresh = false) => {
    setLoading(true);
    setError(null);

    if (!forceRefresh) {
      try {
        const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
        if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
          setBranches(cached.data);
          setScrapedAt(new Date(cached.scrapedAt));
          setLoading(false);
          return;
        }
      } catch {}
    }

    try {
      const res = await fetch(`${API_BASE}/api/branches/reviews/gloriajeans`, {
        signal: AbortSignal.timeout(15000),
      });

      if (res.status === 404) {
        // Henüz tarama yapılmamış
        setPending(true);
        setLoading(false);
        return;
      }

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const json = await res.json();

      if (json.status === 'pending') {
        setPending(true);
        setLoading(false);
        return;
      }

      const data = json.data || [];
      setBranches(data);
      setScrapedAt(json.scrapedAt ? new Date(json.scrapedAt) : null);
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        data,
        scrapedAt: json.scrapedAt,
        timestamp: Date.now(),
      }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return { branches, loading, error, scrapedAt, pending, refresh: () => load(true) };
}
