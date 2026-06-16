import { useState, useCallback } from 'react';
import { SOCIAL_MEDIA } from '../data/socialMediaData';
import { BRAND_MAP } from '../constants/brands';

const SCRAPER_BASE = (import.meta.env.VITE_SCRAPER_URL || 'http://localhost:3600') + '/api';

export default function useBrandComparison() {
  const [mentionData, setMentionData] = useState(null);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState(null);

  const compare = useCallback(async (brandIds, keyword = '') => {
    if (brandIds.length < 2) return;
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ brands: brandIds.join(',') });
      if (keyword.trim()) params.set('keyword', keyword.trim());
      const res  = await fetch(`${SCRAPER_BASE}/mentions/compare?${params}`);
      const json = await res.json();
      if (json.status !== 'ok') throw new Error(json.message);
      setMentionData(json);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Seçili markalar için statik sosyal medya verisini döner
  const getSocialData = (brandIds) =>
    brandIds.map(id => ({
      id,
      brand: BRAND_MAP[id],
      social: SOCIAL_MEDIA[id] || null,
    }));

  // Seçili markalar için operasyonel veriyi döner
  const getOperationalData = (brandIds) =>
    brandIds.map(id => BRAND_MAP[id]).filter(Boolean);

  return { compare, mentionData, loading, error, getSocialData, getOperationalData };
}
