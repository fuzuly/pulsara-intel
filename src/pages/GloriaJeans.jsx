import { useMemo, useState } from 'react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts';
import SectionHeader from '../components/common/SectionHeader';
import { COMPETITOR_SCORES } from '../data/competitorData';
import { NEW_PRODUCTS, LAYER_CONFIG } from '../data/newProductData';
import instagramProfiles from '../data/instagramProfiles.json';
import instagramPosts from '../data/instagramPosts.json';
import clsx from 'clsx';
import { formatLargeNumber } from '../utils/formatters';
import { Trophy, TrendingDown, MapPin, ExternalLink, AlertTriangle, RefreshCw, Star, MessageSquare } from 'lucide-react';
import useBranchData from '../hooks/useBranchData';
import useGJReviews from '../hooks/useGJReviews';

// ─── Sabit veri ───────────────────────────────────────────────────────────────
const GJ_COLOR  = '#F46621';
const GJ_LIGHT  = '#FF8A50';

const gjRatingColor = (r) => {
  if (r >= 4.5) return '#22C55E';
  if (r >= 4.0) return '#86EFAC';
  if (r >= 3.5) return '#FCD34D';
  if (r >= 3.0) return '#FB923C';
  return '#EF4444';
};

const gj  = COMPETITOR_SCORES.gloriajeans;
const gjProducts = NEW_PRODUCTS.filter(p => p.brand === 'gloriajeans');

const igProfile = instagramProfiles.find(p => p.username === 'gjcsturkey') || {};
const igPost    = instagramPosts.find(p => p.username === 'gjcsturkey')    || {};

// Benchmark (sektör lideri vs GJ)
const ESL_IG = instagramPosts.find(p => p.username === 'espressolabtr') || {};

const SCORE_LABELS = {
  qualityScore:    'Kalite',
  brandAwareness:  'Marka Bilinirliği',
  customerLoyalty: 'Müşteri Sadakati',
  socialScore:     'Sosyal Medya',
  innovationScore: 'İnovasyon',
  digitalPresence: 'Dijital Varlık',
  menuVariety:     'Menü Çeşitliliği',
  sustainability:  'Sürdürülebilirlik',
};

const radarData = Object.entries(SCORE_LABELS).map(([key, label]) => ({
  subject: label,
  GJ: gj[key] || 0,
  full: 100,
}));

const competitorBenchmark = [
  { name: 'ESL',  rating: 4.53, engagement: 1.28, color: '#C4922A' },
  { name: 'GJ',   rating: 4.13, engagement: 0.11, color: GJ_COLOR  },
  { name: 'CN',   rating: 4.50, engagement: 0.22, color: '#1D4ED8' },
  { name: 'SBX',  rating: 3.76, engagement: 0.42, color: '#00704A' },
  { name: 'KD',   rating: 3.64, engagement: 0.19, color: '#8B1A1A' },
];

const sentimentData = [
  { name: 'Olumlu', value: 62, fill: '#22c55e' },
  { name: 'Nötr',   value: 23, fill: '#475569' },
  { name: 'Olumsuz',value: 15, fill: '#ef4444' },
];

const swot = {
  strengths: [
    'Sektör ort. üzerinde Google puanı (4.13 vs Starbucks 3.76)',
    'Avustralya kökenli uluslararası marka güvencesi',
    'Dinçerler Group finansal güç ve operasyonel deneyim',
    '214 şube — 43+ ilde erişim',
    'Orta-premium fiyat konumlandırması (Americano 160₺, Latte 185₺ — ort. 190₺)',
    'Yeni fırın tatlı serisi (Nisan 2026) — ürün çeşitliliği artışı',
  ],
  weaknesses: [
    'Kritik düşük Instagram etkileşimi: %0.11 (sektör ort. %0.51)',
    'İşletme hesabı doğrulaması yok (isBusinessAccount: false)',
    'Düşük NPS (50) — müşteri bağlılığı zayıf',
    'İnovasyon skoru düşük (60/100)',
    'Müşteri sadakat programı eksik / bilinmiyor',
    'Dijital varlık sınırlı — uygulama yok',
  ],
  opportunities: [
    'Kahve Dünyası\'nın 3.64 rating\'i → memnuniyetsiz müşteri tabanı',
    'Yaz Co Lemonade lansmanı — genç kitle fırsatı',
    'Fırın kategorisi ile kahve deneyimini zenginleştirme',
    'İstanbul + büyük şehirlerde şube yoğunlaştırma',
    'Sosyal medya stratejisi revizyonu — düşük engagement kritik risk',
    'Dinçerler Group sinerji fırsatları (TeknoPark, A101, vb.)',
  ],
  threats: [
    'Espressolab\'ın hızlı büyümesi (+%4.8) ve yüksek kalite algısı',
    'Coffy\'nin uygun fiyat avantajı (ort. 155₺) — benzer fiyat bandında doğrudan rekabet',
    'Starbucks loyalty app gücü — dijital müşteri bağlılığı',
    'Yeni girişlerin (LUUQ, GUA) Instagram\'da organik büyümesi',
    'Genel enflasyon baskısı altında orta segment sıkışması',
  ],
};

// ─── Tooltip bileşenleri ──────────────────────────────────────────────────────
const RadarTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface border border-navy-border rounded-lg px-3 py-2 text-xs shadow-xl">
      <p className="font-semibold text-white mb-1">{label}</p>
      <p style={{ color: GJ_LIGHT }}>GJ Skoru: <strong>{payload[0]?.value}</strong>/100</p>
    </div>
  );
};

const BenchmarkTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface border border-navy-border rounded-lg px-3 py-2 text-xs shadow-xl">
      <p className="font-semibold text-white mb-1">{label}</p>
      {payload.map(p => (
        <p key={p.dataKey} style={{ color: p.fill }}>
          {p.name}: <strong>{p.value}{p.dataKey === 'engagement' ? '%' : ' ⭐'}</strong>
        </p>
      ))}
    </div>
  );
};

export default function GloriaJeans() {
  const activeProducts   = gjProducts.filter(p => p.status === 'active');
  const upcomingProducts = gjProducts.filter(p => p.status === 'upcoming');

  const { branches: reviewBranches, loading: reviewLoading, error: reviewError, scrapedAt: reviewDate, pending: reviewPending, refresh: refreshReviews } = useGJReviews();

  const [triggerStatus, setTriggerStatus] = useState(null); // null | 'loading' | 'started' | 'error'

  const triggerReviewScrape = async () => {
    setTriggerStatus('loading');
    try {
      const API = import.meta.env.VITE_SCRAPER_URL || 'https://espressolab-scraper-production.up.railway.app';
      const res = await fetch(`${API}/api/branches/reviews/gloriajeans/run`);
      if (res.ok) {
        setTriggerStatus('started');
        setTimeout(() => setTriggerStatus(null), 8000);
      } else {
        setTriggerStatus('error');
        setTimeout(() => setTriggerStatus(null), 5000);
      }
    } catch {
      setTriggerStatus('error');
      setTimeout(() => setTriggerStatus(null), 5000);
    }
  };

  const { branches } = useBranchData();

  const gjBranches = useMemo(() =>
    branches.filter(b => b.brandId === 'gloriajeans'),
    [branches]
  );

  const gjWithScore = useMemo(() =>
    gjBranches.map(b => ({
      ...b,
      wScore: b.reviewCount >= 1
        ? Math.round(b.rating * Math.log10(b.reviewCount + 1) * 100) / 100
        : 0,
    })),
    [gjBranches]
  );

  const gjTop5 = useMemo(() =>
    [...gjWithScore].filter(b => b.reviewCount >= 10)
      .sort((a, b) => b.wScore - a.wScore).slice(0, 5),
    [gjWithScore]
  );

  const gjBottom5 = useMemo(() =>
    [...gjWithScore].filter(b => b.reviewCount >= 10)
      .sort((a, b) => a.wScore - b.wScore).slice(0, 5),
    [gjWithScore]
  );

  const gjCityStats = useMemo(() => {
    const cityMap = {};
    gjBranches.forEach(b => {
      if (!b.city) return;
      if (!cityMap[b.city]) cityMap[b.city] = { city: b.city, count: 0, total: 0 };
      cityMap[b.city].count++;
      cityMap[b.city].total += b.rating;
    });
    return Object.values(cityMap)
      .map(c => ({ ...c, avg: Math.round(c.total / c.count * 10) / 10 }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 12);
  }, [gjBranches]);

  return (
    <div className="space-y-8 animate-fade-in">

      {/* ── Başlık ──────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-4">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black text-white shadow-lg flex-shrink-0"
          style={{ background: `linear-gradient(135deg, ${GJ_COLOR}, ${GJ_LIGHT})` }}
        >
          GJ
        </div>
        <div>
          <SectionHeader
            title="Gloria Jean's Coffees Türkiye"
            subtitle="Marka istihbaratı · Avustralya kökenli · Dinçerler Group operatörü · 214 şube · 43+ il"
          />
        </div>
      </div>

      {/* ── KPI Kartları ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Türkiye Şube Sayısı',  value: '214',                                              sub: '43+ ilde aktif',                        color: '#ffffff'  },
          { label: 'Pazar Payı',           value: `%${gj.marketShare}`,                               sub: 'TR kahve sektörü',                       color: GJ_LIGHT   },
          { label: 'Ort. Ürün Fiyatı',     value: `₺${gj.avgPrice}`,                                 sub: 'Menü ortalaması',                        color: '#22c55e'  },
          { label: 'Google Maps Puanı',    value: String(gj.googleRating),                            sub: '108 şube · Haziran 2026',                color: '#f59e0b'  },
          { label: 'Instagram Takipçi',    value: formatLargeNumber(igProfile.followers || 61749),    sub: '@gjcsturkey',                            color: GJ_LIGHT   },
          { label: 'Instagram Etkileşim',  value: `%${igPost.engagementRate || 0.11}`,                sub: 'Sektör ort. %0.51 — ⚠️ Düşük',           color: '#ef4444'  },
          { label: 'NPS Skoru',            value: String(gj.nps),                                     sub: 'Müşteri tavsiye oranı',                  color: '#8B9BB4'  },
          { label: 'Çalışan (Tahmini)',    value: formatLargeNumber(gj.employees),                    sub: `${gj.annualRevenue} tahmini ciro`,        color: '#8B9BB4'  },
        ].map(k => (
          <div key={k.label} className="card">
            <div className="text-2xl font-bold mb-0.5" style={{ color: k.color }}>{k.value}</div>
            <div className="text-xs font-semibold text-white">{k.label}</div>
            <div className="text-[10px] text-muted mt-0.5">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* ── Uyarı Bandı ─────────────────────────────────────────────────── */}
      <div className="flex items-start gap-3 bg-warning/10 border border-warning/30 rounded-xl px-4 py-3">
        <span className="text-warning text-xl flex-shrink-0">⚠️</span>
        <div>
          <p className="text-sm font-semibold text-warning mb-0.5">Instagram Etkileşim Krizi</p>
          <p className="text-xs text-white/80">
            Gloria Jean's <strong className="text-warning">%0.11</strong> etkileşim oranıyla sektörün en düşük performanslı hesabı.
            61.749 takipçiye karşın ortalama sadece <strong>65 beğeni</strong> — içerik stratejisi kitleye ulaşmıyor.
            Espressolab'ın <strong className="text-success">%1.28</strong> oranıyla karşılaştırıldığında 12 kat fark bulunmakta.
          </p>
        </div>
      </div>

      {/* ── Performans Radar + Benchmark ────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* Radar */}
        <div className="card">
          <h3 className="text-sm font-semibold text-white mb-1">Performans Skoru Radar (8 Boyut)</h3>
          <p className="text-[10px] text-muted mb-3">Kalite %20 · Marka Bilinirliği %15 · Sadakat %15 · Sosyal %15 · Diğer %35</p>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={radarData} margin={{ top: 10, right: 20, left: 20, bottom: 10 }}>
              <PolarGrid stroke="#2A3A55" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#8B9BB4', fontSize: 9 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#475569', fontSize: 8 }} />
              <Radar name="Gloria Jean's" dataKey="GJ" stroke={GJ_COLOR} fill={GJ_COLOR} fillOpacity={0.35} />
              <Tooltip content={<RadarTooltip />} />
            </RadarChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-4 gap-1 mt-2">
            {Object.entries(SCORE_LABELS).map(([key, label]) => (
              <div key={key} className="text-center">
                <div className="text-xs font-bold" style={{ color: gj[key] >= 75 ? '#22c55e' : gj[key] >= 65 ? '#f59e0b' : '#ef4444' }}>
                  {gj[key]}
                </div>
                <div className="text-[9px] text-muted leading-tight">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Benchmark */}
        <div className="card space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-white mb-1">Rakip Karşılaştırması</h3>
            <p className="text-[10px] text-muted mb-3">Google Maps Puanı vs Instagram Etkileşim</p>
          </div>

          {/* Rating bar */}
          <div>
            <p className="text-[10px] text-muted uppercase tracking-wider mb-2">Google Maps Puanı</p>
            <div className="space-y-1.5">
              {[...competitorBenchmark].sort((a, b) => b.rating - a.rating).map(c => (
                <div key={c.name} className="flex items-center gap-2">
                  <span className="text-[10px] w-8 text-muted text-right flex-shrink-0">{c.name}</span>
                  <div className="flex-1 h-2.5 bg-surface2 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${(c.rating / 5) * 100}%`, backgroundColor: c.color }}
                    />
                  </div>
                  <span className={clsx('text-[10px] font-bold w-8 flex-shrink-0', c.name === 'GJ' ? 'text-purple-400' : 'text-muted')}>
                    {c.rating}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Engagement bar */}
          <div>
            <p className="text-[10px] text-muted uppercase tracking-wider mb-2">Instagram Etkileşim Oranı (%)</p>
            <div className="space-y-1.5">
              {[...competitorBenchmark].sort((a, b) => b.engagement - a.engagement).map(c => (
                <div key={c.name} className="flex items-center gap-2">
                  <span className="text-[10px] w-8 text-muted text-right flex-shrink-0">{c.name}</span>
                  <div className="flex-1 h-2.5 bg-surface2 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${(c.engagement / 1.5) * 100}%`, backgroundColor: c.color, maxWidth: '100%' }}
                    />
                  </div>
                  <span className={clsx('text-[10px] font-bold w-10 flex-shrink-0', c.name === 'GJ' ? 'text-danger' : 'text-muted')}>
                    %{c.engagement}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── GJ Şube Google Puanları ─────────────────────────────────────── */}
      {gjBranches.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-base font-bold text-white border-b border-navy-border pb-2 flex items-center gap-2">
            <span>📍</span> GJ Şube Google Puanları — Canlı Veri
            <span className="text-xs font-normal text-muted ml-1">({gjBranches.length} şube)</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="card">
              <div className="flex items-center gap-2 mb-3">
                <Trophy size={14} className="text-warning" />
                <h3 className="text-sm font-semibold text-white">En İyi 5 GJ Şubesi</h3>
                <span className="text-[10px] text-muted ml-auto">Ağırlıklı skor</span>
              </div>
              <div className="space-y-1.5">
                {gjTop5.map((b, i) => (
                  <div key={b.placeId} className="flex items-center gap-2 py-1">
                    <span className="text-[11px] text-muted w-4 text-right flex-shrink-0">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-white truncate">{b.name}</p>
                      <p className="text-[10px] text-muted">{b.city || '—'} · {b.reviewCount?.toLocaleString('tr-TR')} yorum</p>
                    </div>
                    <span className="text-sm font-bold flex-shrink-0" style={{ color: gjRatingColor(b.rating) }}>
                      {b.rating?.toFixed(1)}
                    </span>
                    {b.mapsUrl && (
                      <a href={b.mapsUrl} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-purple-400 flex-shrink-0">
                        <ExternalLink size={11} />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="card border border-danger/20">
              <div className="flex items-center gap-2 mb-3">
                <TrendingDown size={14} className="text-danger" />
                <h3 className="text-sm font-semibold text-white">En Düşük 5 GJ Şubesi</h3>
                <span className="text-[10px] text-muted ml-auto">min 10 yorum</span>
              </div>
              <div className="space-y-1.5">
                {gjBottom5.map((b, i) => (
                  <div key={b.placeId} className="flex items-center gap-2 py-1">
                    <span className="text-[11px] text-muted w-4 text-right flex-shrink-0">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-white truncate">{b.name}</p>
                      <p className="text-[10px] text-muted">{b.city || '—'} · {b.reviewCount?.toLocaleString('tr-TR')} yorum</p>
                    </div>
                    <span className="text-sm font-bold flex-shrink-0" style={{ color: gjRatingColor(b.rating) }}>
                      {b.rating?.toFixed(1)}
                    </span>
                    {b.mapsUrl && (
                      <a href={b.mapsUrl} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-purple-400 flex-shrink-0">
                        <ExternalLink size={11} />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {gjCityStats.length > 0 && (
            <div className="card">
              <div className="flex items-center gap-2 mb-3">
                <MapPin size={14} className="text-purple-400" />
                <h3 className="text-sm font-semibold text-white">Şehir Bazında GJ Şubeleri</h3>
                <span className="text-[10px] text-muted ml-auto">Ort. puan · şube sayısı</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2">
                {gjCityStats.map(c => (
                  <div key={c.city} className="flex items-center justify-between px-3 py-2 rounded-lg bg-surface2 gap-2">
                    <span className="text-xs text-white truncate">{c.city}</span>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <span className="text-xs font-bold" style={{ color: gjRatingColor(c.avg) }}>{c.avg.toFixed(1)}</span>
                      <span className="text-[10px] text-muted">({c.count})</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* ── Instagram Detay ─────────────────────────────────────────────── */}
      <section className="space-y-4">
        <h2 className="text-base font-bold text-white border-b border-navy-border pb-2 flex items-center gap-2">
          <span>📸</span> Instagram Analizi — @gjcsturkey
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { label: 'Takipçi',        value: formatLargeNumber(igProfile.followers || 61749), color: 'text-white'   },
            { label: 'Gönderi',        value: (igProfile.posts || 1718).toLocaleString('tr-TR'), color: 'text-muted' },
            { label: 'Takip Edilen',   value: igProfile.following ?? 1,   color: 'text-muted'   },
            { label: 'Ort. Beğeni',    value: formatLargeNumber(igPost.avgLikes || 65),   color: 'text-warning' },
            { label: 'Max Beğeni',     value: formatLargeNumber(igPost.maxLikes || 2093), color: 'text-white'   },
            { label: 'Ort. Yorum',     value: igPost.avgComments ?? 4,    color: 'text-muted'   },
            { label: 'Etkileşim',      value: `%${igPost.engagementRate || 0.11}`, color: 'text-danger' },
            { label: 'Doğrulandı',     value: igProfile.verified ? 'Evet ✓' : 'Hayır',  color: igProfile.verified ? 'text-success' : 'text-muted' },
            { label: 'Hesap Türü',     value: igProfile.isBusinessAccount ? 'İşletme' : 'Kişisel', color: igProfile.isBusinessAccount ? 'text-success' : 'text-warning' },
            { label: 'Veri Tarihi',    value: igProfile.collectedAt || '29 May 2026', color: 'text-muted' },
          ].map(k => (
            <div key={k.label} className="card text-center py-3">
              <div className={clsx('text-lg font-bold', k.color)}>{k.value}</div>
              <div className="text-[10px] text-muted mt-0.5">{k.label}</div>
            </div>
          ))}
        </div>
        <div className="flex items-start gap-3 bg-danger/5 border border-danger/20 rounded-xl px-4 py-3 text-xs">
          <span className="text-danger mt-0.5">🔴</span>
          <p className="text-muted">
            <strong className="text-white">Kritik Bulgu:</strong> 61.749 takipçiyle sadece %0.11 etkileşim.
            Hesap <strong className="text-warning">İşletme hesabı olarak doğrulanmamış</strong> — bu durum Instagram'ın organik erişim algoritmalarında dezavantaj yaratıyor.
            İçerik stratejisi acil revizyon gerektiriyor.
          </p>
        </div>
      </section>

      {/* ── Duygu Analizi ───────────────────────────────────────────────── */}
      <section className="space-y-4">
        <h2 className="text-base font-bold text-white border-b border-navy-border pb-2 flex items-center gap-2">
          <span>🧠</span> Duygu Analizi & Müşteri Görüşleri
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Sentiment bars */}
          <div className="card space-y-3">
            <h3 className="text-xs font-semibold text-white">Yorum Dağılımı</h3>
            {sentimentData.map(s => (
              <div key={s.name} className="flex items-center gap-3">
                <span className="text-xs text-muted w-16 flex-shrink-0">{s.name}</span>
                <div className="flex-1 h-4 bg-surface2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all flex items-center justify-end pr-2"
                    style={{ width: `${s.value}%`, backgroundColor: s.fill }}
                  >
                    <span className="text-[9px] text-white font-bold">%{s.value}</span>
                  </div>
                </div>
              </div>
            ))}
            <div className="text-[10px] text-muted pt-1 border-t border-navy-border">
              Kaynak: Google Maps yorumları + sosyal medya NLP analizi
            </div>
          </div>

          {/* Praise / Complaint */}
          <div className="card space-y-3">
            <div>
              <p className="text-[10px] text-muted uppercase tracking-wider mb-2">Öne Çıkan Olumlu</p>
              <div className="flex flex-wrap gap-1.5">
                {['kahve kalitesi', 'rahat ortam', 'temizlik', 'barista güleryüzlülüğü'].map(p => (
                  <span key={p} className="text-[10px] bg-success/10 text-success border border-success/20 rounded-full px-2.5 py-1 font-medium">
                    ✓ {p}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10px] text-muted uppercase tracking-wider mb-2">Başlıca Şikayetler</p>
              <div className="flex flex-wrap gap-1.5">
                {['sınırlı menü', 'küçük mekan', 'yavaş servis', 'uygulama eksikliği'].map(c => (
                  <span key={c} className="text-[10px] bg-danger/10 text-danger border border-danger/20 rounded-full px-2.5 py-1 font-medium">
                    ✗ {c}
                  </span>
                ))}
              </div>
            </div>
            <div className="pt-2 border-t border-navy-border">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-lg font-bold text-success">%62</div>
                  <div className="text-[9px] text-muted">Olumlu</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-muted">%23</div>
                  <div className="text-[9px] text-muted">Nötr</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-danger">%15</div>
                  <div className="text-[9px] text-muted">Olumsuz</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2026 Yeni Ürünler ────────────────────────────────────────────── */}
      <section className="space-y-4">
        <h2 className="text-base font-bold text-white border-b border-navy-border pb-2 flex items-center gap-2">
          <span>🆕</span> 2026 Yeni Ürünler & Lansmanlar
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {gjProducts.map(p => {
            const layerCfg = LAYER_CONFIG[p.layer];
            const launchDate = new Date(p.launchDate).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
            return (
              <div key={p.id} className={clsx('card border', p.status === 'upcoming' ? 'border-warning/20' : 'border-purple-500/20')}>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={clsx(
                      'text-[9px] font-bold px-2 py-0.5 rounded-full',
                      p.status === 'active' ? 'bg-success/15 text-success' : 'bg-warning/15 text-warning'
                    )}>
                      {p.status === 'active' ? 'Aktif' : 'Yakında'}
                    </span>
                    <span className={clsx('text-[9px] font-semibold px-2 py-0.5 rounded-full border', layerCfg.bg, layerCfg.color)}>
                      {layerCfg.icon} {layerCfg.label}
                    </span>
                    <span className="text-[9px] bg-surface2 text-muted px-1.5 py-0.5 rounded-full">{p.category}</span>
                  </div>
                  <span className="text-[10px] text-muted flex-shrink-0">{launchDate}</span>
                </div>
                <h4 className="text-sm font-bold text-white mb-1">{p.name}</h4>
                <p className="text-xs text-muted leading-relaxed mb-3">{p.description}</p>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-muted w-24 flex-shrink-0">OSINT Güven</span>
                  <div className="flex-1 h-1.5 bg-surface2 rounded-full overflow-hidden">
                    <div
                      className={clsx('h-full rounded-full', p.osintConfidence >= 88 ? 'bg-success' : p.osintConfidence >= 75 ? 'bg-info' : 'bg-warning')}
                      style={{ width: `${p.osintConfidence}%` }}
                    />
                  </div>
                  <span className={clsx('text-[10px] font-semibold w-8 text-right', p.osintConfidence >= 88 ? 'text-success' : p.osintConfidence >= 75 ? 'text-info' : 'text-warning')}>
                    %{p.osintConfidence}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── SWOT Analizi ────────────────────────────────────────────────── */}
      <section className="space-y-4">
        <h2 className="text-base font-bold text-white border-b border-navy-border pb-2 flex items-center gap-2">
          <span>🎯</span> SWOT Analizi
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: 'Güçlü Yönler',    key: 'strengths',    icon: '💪', color: 'text-success', border: 'border-success/20', bg: 'bg-success/5'  },
            { title: 'Zayıf Yönler',    key: 'weaknesses',   icon: '⚠️', color: 'text-danger',  border: 'border-danger/20',  bg: 'bg-danger/5'   },
            { title: 'Fırsatlar',       key: 'opportunities',icon: '🚀', color: 'text-info',    border: 'border-info/20',    bg: 'bg-info/5'     },
            { title: 'Tehditler',       key: 'threats',      icon: '🛡️', color: 'text-warning', border: 'border-warning/20', bg: 'bg-warning/5'  },
          ].map(s => (
            <div key={s.key} className={clsx('card border', s.border, s.bg)}>
              <h4 className={clsx('text-xs font-bold mb-3 flex items-center gap-1.5', s.color)}>
                <span>{s.icon}</span> {s.title}
              </h4>
              <ul className="space-y-1.5">
                {swot[s.key].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-muted">
                    <span className={clsx('flex-shrink-0 mt-0.5 font-bold', s.color)}>•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ── GJ Şube Şikayet Analizi ─────────────────────────────────────── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="text-base font-bold text-white border-b border-navy-border pb-2 flex items-center gap-2 flex-1">
            <span>🔍</span> Şube Şikayet Analizi — Google Maps Yorumları
          </h2>
          {!reviewLoading && !reviewPending && reviewBranches.length > 0 && (
            <button onClick={refreshReviews} className="btn-secondary text-xs flex items-center gap-1.5">
              <RefreshCw size={12} /> Yenile
            </button>
          )}
        </div>

        {reviewLoading ? (
          <div className="card flex items-center justify-center gap-3 py-10">
            <RefreshCw size={18} className="animate-spin" style={{ color: GJ_COLOR }} />
            <span className="text-sm text-muted">Yorum verileri yükleniyor...</span>
          </div>
        ) : reviewPending ? (
          <div className="card text-center py-10 space-y-3">
            <div className="text-4xl">📋</div>
            <p className="text-sm font-semibold text-white">İlk Analiz Henüz Çalışmadı</p>
            <p className="text-xs text-muted max-w-md mx-auto">
              GJ şube yorum analizi her <strong className="text-white">Pazartesi 03:00</strong>'te otomatik çalışır.
              İlk veri bir sonraki Pazartesi hazır olacak.
            </p>
            <button
              onClick={triggerReviewScrape}
              disabled={triggerStatus === 'loading' || triggerStatus === 'started'}
              className="inline-flex items-center gap-2 text-xs px-4 py-2 rounded-lg font-semibold text-white mt-2 disabled:opacity-60"
              style={{ backgroundColor: GJ_COLOR }}
            >
              {triggerStatus === 'loading' ? (
                <><RefreshCw size={13} className="animate-spin" /> Başlatılıyor...</>
              ) : triggerStatus === 'started' ? (
                <><span>✓</span> Başlatıldı — 15-20 dk içinde hazır</>
              ) : triggerStatus === 'error' ? (
                <><span>✕</span> Bağlantı hatası, tekrar dene</>
              ) : (
                <><RefreshCw size={13} /> Analizi Başlat (~15-20 dk)</>
              )}
            </button>
          </div>
        ) : reviewError ? (
          <div className="card text-center py-8">
            <p className="text-xs text-danger">Bağlantı hatası: {reviewError}</p>
          </div>
        ) : reviewBranches.length > 0 ? (
          <>
            {/* Özet başlık */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'Analiz Edilen Şube', value: reviewBranches.length, color: 'text-white' },
                { label: 'En Yaygın Şikayet', value: (() => { const all = {}; reviewBranches.forEach(b => b.complaints?.forEach(c => { all[c.category] = (all[c.category]||0)+c.count; })); return Object.entries(all).sort(([,a],[,b])=>b-a)[0]?.[0] || '—'; })(), color: 'text-danger' },
                { label: 'Toplam Yorum', value: reviewBranches.reduce((s,b) => s+(b.totalScraped||0), 0).toLocaleString('tr-TR'), color: 'text-white' },
                { label: 'Son Analiz', value: reviewDate ? reviewDate.toLocaleDateString('tr-TR') : '—', color: 'text-muted' },
              ].map(k => (
                <div key={k.label} className="card text-center py-3">
                  <div className={`text-xl font-bold ${k.color}`}>{k.value}</div>
                  <div className="text-[10px] text-muted mt-0.5">{k.label}</div>
                </div>
              ))}
            </div>

            {/* Şube kartları */}
            <div className="space-y-3">
              {reviewBranches.map(branch => (
                <div key={branch.placeId} className="card border border-danger/15">
                  {/* Üst satır */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                        style={{ backgroundColor: GJ_COLOR }}
                      >GJ</div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{branch.name}</p>
                        <p className="text-[10px] text-muted">{branch.city || '—'} · {branch.reviewCount?.toLocaleString('tr-TR')} yorum · {branch.totalScraped} analiz edildi</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-lg font-bold" style={{ color: branch.rating >= 4 ? '#86EFAC' : branch.rating >= 3.5 ? '#FCD34D' : '#EF4444' }}>
                        {branch.rating?.toFixed(1)}
                      </span>
                      {branch.mapsUrl && (
                        <a href={branch.mapsUrl} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-orange-400">
                          <ExternalLink size={13} />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Şikayet kategorileri */}
                  {branch.complaints?.length > 0 && (
                    <div className="mb-3">
                      <p className="text-[10px] text-muted uppercase tracking-wider mb-1.5">Şikayet Kategorileri</p>
                      <div className="flex flex-wrap gap-1.5">
                        {branch.complaints.map(c => (
                          <span
                            key={c.category}
                            className="text-[10px] px-2 py-0.5 rounded-full border font-medium"
                            style={{
                              backgroundColor: '#EF444415',
                              borderColor: '#EF444430',
                              color: '#FCA5A5',
                            }}
                          >
                            {c.category} ({c.count})
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Örnek olumsuz yorumlar */}
                  {branch.sampleReviews?.length > 0 && (
                    <div className="space-y-1.5">
                      <p className="text-[10px] text-muted uppercase tracking-wider">Örnek Olumsuz Yorumlar</p>
                      {branch.sampleReviews.map((r, i) => (
                        <div key={i} className="bg-surface2 rounded-lg px-3 py-2">
                          <div className="flex items-center gap-1.5 mb-1">
                            {Array(r.rating || 1).fill(0).map((_, s) => (
                              <Star key={s} size={9} className="text-warning fill-warning" />
                            ))}
                            {r.date && <span className="text-[9px] text-muted ml-1">{r.date}</span>}
                          </div>
                          <p className="text-[11px] text-muted leading-relaxed">"{r.text}"</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {branch.complaints?.length === 0 && branch.totalScraped > 0 && (
                    <p className="text-xs text-muted italic">Anahtar kelime eşleşmesi bulunamadı — yorumlar genel memnuniyetsizlik içeriyor olabilir.</p>
                  )}
                </div>
              ))}
            </div>
          </>
        ) : null}
      </section>

      {/* ── Stratejik Değerlendirme ─────────────────────────────────────── */}
      <section className="space-y-4">
        <h2 className="text-base font-bold text-white border-b border-navy-border pb-2 flex items-center gap-2">
          <span>💡</span> Stratejik Değerlendirme
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card border-danger/20">
            <div className="text-2xl mb-2">📱</div>
            <h4 className="text-sm font-semibold text-white mb-2">Instagram Krizi — Acil Önlem</h4>
            <p className="text-xs text-muted leading-relaxed">
              %0.11 etkileşim oranı sektörün en düşüğü — 61.749 takipçiye karşın
              ortalama 65 beğeni. Hesabın işletme hesabı olarak doğrulanmaması
              organik erişimi kısıtlıyor. <strong className="text-danger">İçerik stratejisi acil revizyon gerektiriyor.</strong>
            </p>
          </div>
          <div className="card border-success/20">
            <div className="text-2xl mb-2">🍰</div>
            <h4 className="text-sm font-semibold text-white mb-2">Fırın Kategorisi Fırsatı</h4>
            <p className="text-xs text-muted leading-relaxed">
              Nisan 2026'da başlatılan fırın tatlı serisi (Red Velvet, Triple Chocolate Cookie vb.)
              doğru bir adım. Mağaza fırını deneyimi müşteri bağlılığını artırabilir ve
              <strong className="text-success"> ortalama sepet değerini yükseltebilir.</strong>
            </p>
          </div>
          <div className="card border-info/20">
            <div className="text-2xl mb-2">💰</div>
            <h4 className="text-sm font-semibold text-white mb-2">Fiyat & Dijital Dönüşüm</h4>
            <p className="text-xs text-muted leading-relaxed">
              Americano 160₺, Latte 185₺ ile orta-premium segment. Ancak dijital
              sipariş kanalı ve sadakat programı eksik.
              <strong className="text-info"> Uygulama yatırımı</strong> müşteri bağlılığını doğrudan artırır.
            </p>
          </div>
        </div>
      </section>

      {/* ── Kaynak Notu ─────────────────────────────────────────────────── */}
      <div className="flex items-start gap-3 bg-blue-900/20 border border-blue-500/20 rounded-xl p-3 text-xs">
        <span className="text-blue-400 text-base mt-0.5">🔍</span>
        <p className="text-muted">
          <strong className="text-blue-300">Kaynaklar: </strong>
          Şube ve pazar verileri gloriajeans.com.tr + Emlakkulisi.com (Haziran 2026) |
          Instagram metrikleri 100 post analizi (29 Haziran 2026) |
          Yeni ürünler mallreport.com.tr (8 Nisan 2026) |
          Google Maps puanı 108 şube ortalaması (Haziran 2026) |
          Finansal veriler tahminidir (⚠️).
        </p>
      </div>
    </div>
  );
}
