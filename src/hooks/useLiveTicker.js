import { useState, useEffect, useCallback } from 'react';
import { ALERTS } from '../data/alertsData';

const SCRAPER_URL = import.meta.env.VITE_SCRAPER_URL || 'http://localhost:3001';

// Scraper haber öğesini → ticker formatına çevirir
function newsToTicker(item, index) {
  const sourceIcon = item.sourceType === 'google-news' ? '📰' : '🌐';
  return {
    id:        `news-${index}`,
    brand:     item.brandId || null,
    message:   item.title?.slice(0, 100) || '',
    timestamp: item.publishedAt || new Date().toISOString(),
    severity:  'info',
    icon:      sourceIcon,
  };
}

export function useLiveTicker(intervalMs = 8000) {
  const [items, setItems]     = useState(ALERTS);   // başlangıçta statik alerts
  const [isLive, setIsLive]   = useState(false);
  const [pointer, setPointer] = useState(0);        // görünen dilim başlangıcı

  // Scraper'dan canlı haber çek
  const fetchLive = useCallback(async () => {
    try {
      const res = await fetch(`${SCRAPER_URL}/api/news?limit=50`, {
        signal: AbortSignal.timeout(4000),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const news = (json.data || []).map(newsToTicker);
      if (news.length > 0) {
        setItems(news);
        setIsLive(true);
        return;
      }
    } catch {
      // scraper erişilemez
    }
    // fallback: statik alerts
    setItems(ALERTS);
    setIsLive(false);
  }, []);

  // İlk yükleme + 6 saatlik yenileme
  useEffect(() => {
    fetchLive();
    const refresh = setInterval(fetchLive, 6 * 60 * 60 * 1000);
    return () => clearInterval(refresh);
  }, [fetchLive]);

  // Ticker scroll: pointer'ı ilerlet
  useEffect(() => {
    if (items.length === 0) return;
    const tick = setInterval(() => {
      setPointer(p => (p + 1) % items.length);
    }, intervalMs);
    return () => clearInterval(tick);
  }, [items.length, intervalMs]);

  // Görüntülenen öğeler: pointer'dan itibaren tüm liste (döngüsel)
  const visibleAlerts = items.length > 0
    ? [...items.slice(pointer), ...items.slice(0, pointer)]
    : ALERTS;

  return { alerts: visibleAlerts, isLive };
}
