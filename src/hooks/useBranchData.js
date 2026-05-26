import { useState, useEffect } from 'react';

const API_BASE = import.meta.env.VITE_SCRAPER_URL || 'http://localhost:3001';
const CACHE_KEY = 'branch-data-v1';
const CACHE_TTL = 60 * 60 * 1000; // 1 saat

export default function useBranchData() {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const load = async (forceRefresh = false) => {
    setLoading(true);
    setError(null);

    if (!forceRefresh) {
      try {
        const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
        if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
          setBranches(cached.data);
          setLastUpdated(new Date(cached.timestamp));
          setLoading(false);
          return;
        }
      } catch {}
    }

    try {
      const res = await fetch(`${API_BASE}/api/branches`, { signal: AbortSignal.timeout(15000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const data = json.data || [];
      setBranches(data);
      const ts = new Date();
      setLastUpdated(ts);
      localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: ts.getTime() }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return { branches, loading, error, lastUpdated, refresh: () => load(true) };
}
