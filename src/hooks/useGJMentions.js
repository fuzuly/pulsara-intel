import { useState, useEffect, useCallback } from 'react';

const SCRAPER_BASE  = (import.meta.env.VITE_SCRAPER_URL || 'http://localhost:3600') + '/api';
const POLL_INTERVAL = 5 * 60 * 1000; // 5 dakika

export default function useGJMentions() {
  const [mentions, setMentions]   = useState([]);
  const [stats, setStats]         = useState(null);
  const [loading, setLoading]     = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [error, setError]         = useState(null);

  const fetchMentions = useCallback(async () => {
    try {
      const [mentRes, statRes] = await Promise.all([
        fetch(`${SCRAPER_BASE}/mentions?brand=gloriajeans&limit=100`),
        fetch(`${SCRAPER_BASE}/mentions/stats`),
      ]);

      if (mentRes.ok) {
        const d = await mentRes.json();
        setMentions(d.data || []);
      }
      if (statRes.ok) {
        const d = await statRes.json();
        setStats(d);
      }

      setLastUpdate(new Date());
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMentions();
    const timer = setInterval(fetchMentions, POLL_INTERVAL);
    return () => clearInterval(timer);
  }, [fetchMentions]);

  return { mentions, stats, loading, lastUpdate, error, refresh: fetchMentions };
}
