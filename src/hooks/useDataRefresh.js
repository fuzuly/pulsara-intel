// ═══════════════════════════════════════════════════════════════════════════════
// useDataRefresh — Canlı Veri Güncelleme Hook'u
//
// Bu hook, dashboardun 7/24 canlı izleme sistemini simüle eder.
// Üretim ortamında aşağıdaki API'lere bağlanmalıdır:
//   • Şube verileri: Marka resmi API'leri / web scraper servisi
//   • Fiyat verileri: Menü takip servisi
//   • Sosyal medya: Instagram Graph API, TikTok API, Twitter API v2
//   • Haberler: Google News API, RSS feed aggregator
//
// Mevcut durum: Gerçekçi delta simülasyonu (production API hazır mimari)
// ═══════════════════════════════════════════════════════════════════════════════

import { useState, useEffect, useCallback, useRef } from 'react';

const DEFAULT_INTERVALS = {
  fast:   30_000,   // 30 saniye — sosyal medya metrikleri
  medium: 120_000,  // 2 dakika  — fiyat/kampanya değişimleri
  slow:   300_000,  // 5 dakika  — şube/pazar payı verileri
};

// Veri tazelik durumu
export const DATA_FRESHNESS = {
  LIVE:    { label: 'CANLI',    color: 'text-success',  dot: 'bg-success',  maxAgeMs: 60_000   },
  FRESH:   { label: 'GÜNCEL',   color: 'text-info',     dot: 'bg-info',     maxAgeMs: 300_000  },
  STALE:   { label: 'ESKİ',     color: 'text-warning',  dot: 'bg-warning',  maxAgeMs: 900_000  },
  EXPIRED: { label: 'GÜNCELLENİYOR', color: 'text-danger', dot: 'bg-danger', maxAgeMs: Infinity },
};

export function getFreshness(lastUpdatedMs) {
  const ageMs = Date.now() - lastUpdatedMs;
  if (ageMs < DATA_FRESHNESS.LIVE.maxAgeMs)    return DATA_FRESHNESS.LIVE;
  if (ageMs < DATA_FRESHNESS.FRESH.maxAgeMs)   return DATA_FRESHNESS.FRESH;
  if (ageMs < DATA_FRESHNESS.STALE.maxAgeMs)   return DATA_FRESHNESS.STALE;
  return DATA_FRESHNESS.EXPIRED;
}

// Küçük gerçekçi varyasyon üretici (+/- delta)
function nudge(value, pct = 0.005) {
  const delta = value * pct * (Math.random() * 2 - 1);
  return Math.round(value + delta);
}

// ─── Ana hook ─────────────────────────────────────────────────────────────────
export default function useDataRefresh(interval = DEFAULT_INTERVALS.medium) {
  const [lastUpdated, setLastUpdated]     = useState(Date.now());
  const [updateCount, setUpdateCount]     = useState(0);
  const [isRefreshing, setIsRefreshing]   = useState(false);
  const [freshness, setFreshness]         = useState(DATA_FRESHNESS.LIVE);
  const timerRef = useRef(null);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);

    // Üretim ortamında burada API çağrısı yapılır:
    // const data = await fetch('/api/live-metrics').then(r => r.json());

    // Simülasyon: 300-800ms gecikme (network latency)
    await new Promise(r => setTimeout(r, 300 + Math.random() * 500));

    setLastUpdated(Date.now());
    setUpdateCount(c => c + 1);
    setIsRefreshing(false);
  }, []);

  // Tazelik durumunu saniyede bir güncelle
  useEffect(() => {
    const id = setInterval(() => {
      setFreshness(getFreshness(lastUpdated));
    }, 60_000);
    return () => clearInterval(id);
  }, [lastUpdated]);

  // Periyodik otomatik yenileme
  useEffect(() => {
    timerRef.current = setInterval(refresh, interval);
    return () => clearInterval(timerRef.current);
  }, [refresh, interval]);

  const timeAgo = () => {
    const secs = Math.floor((Date.now() - lastUpdated) / 1000);
    if (secs < 10)  return 'Az önce';
    if (secs < 60)  return `${secs}s önce`;
    const mins = Math.floor(secs / 60);
    if (mins < 60)  return `${mins}d önce`;
    return `${Math.floor(mins / 60)}sa önce`;
  };

  return { lastUpdated, updateCount, isRefreshing, freshness, refresh, timeAgo };
}

// ─── Sosyal medya gerçek zamanlı simülasyonu ─────────────────────────────────
export function useLiveMetrics(baseMetrics, interval = DEFAULT_INTERVALS.fast) {
  const [metrics, setMetrics] = useState(baseMetrics);
  const { lastUpdated, isRefreshing, freshness, refresh, timeAgo } = useDataRefresh(interval);

  useEffect(() => {
    setMetrics(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(brand => {
        if (!updated[brand]) return;
        const b = { ...updated[brand] };
        // Her tick'te Instagram/TikTok takipçi + beğeni küçük artışlar
        if (b.instagram) b.instagram = { ...b.instagram, followers: nudge(b.instagram.followers, 0.001) };
        if (b.tiktok)    b.tiktok    = { ...b.tiktok,    followers: nudge(b.tiktok.followers,    0.002) };
        updated[brand] = b;
      });
      return updated;
    });
  }, [lastUpdated]);

  return { metrics, isRefreshing, freshness, refresh, timeAgo };
}
