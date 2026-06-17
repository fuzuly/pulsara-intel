import { useState, useEffect, useMemo, useCallback } from 'react';
import * as XLSX from 'xlsx';
import {
  LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  Download, Printer, RefreshCw, AlertTriangle,
  Star, TrendingUp, Zap, Newspaper, Brain, X,
} from 'lucide-react';
import clsx from 'clsx';
import { BRANDS } from '../constants/brands';
import useMentionStream from '../hooks/useMentionStream';

const SCRAPER_BASE = (import.meta.env.VITE_SCRAPER_URL || 'http://localhost:3600') + '/api';

const SENTIMENT_META = {
  positive: { label: 'Olumlu', icon: '😊', color: 'text-success', bg: 'bg-success/10 border-success/20' },
  negative: { label: 'Olumsuz', icon: '😟', color: 'text-danger',  bg: 'bg-danger/10 border-danger/20'  },
  neutral:  { label: 'Nötr',   icon: '😐', color: 'text-warning', bg: 'bg-warning/10 border-warning/20' },
};

const SOURCE_META = {
  news:    { label: 'Google Haber', icon: '📰' },
  tr_news: { label: 'TR Haber',    icon: '📰' },
  reddit:  { label: 'Reddit',      icon: '💬' },
};

const EMOTION_META = {
  joy:     { label: 'Mutluluk', emoji: '😊', color: '#22c55e', bg: 'rgba(34,197,94,0.12)'  },
  anger:   { label: 'Öfke',     emoji: '😠', color: '#ef4444', bg: 'rgba(239,68,68,0.12)'  },
  fear:    { label: 'Endişe',   emoji: '😰', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  sadness: { label: 'Üzüntü',  emoji: '😢', color: '#60a5fa', bg: 'rgba(96,165,250,0.12)' },
  neutral: { label: 'Nötr',    emoji: '😐', color: '#64748b', bg: 'rgba(100,116,139,0.12)'},
};

const TOPIC_COLORS = ['#C4922A','#60a5fa','#a78bfa','#34d399','#f472b6','#fb923c'];

const DOMAIN_REACH = {
  'hurriyet.com.tr': 3000000, 'sabah.com.tr': 2500000, 'cnnturk.com': 2000000,
  'sozcu.com.tr': 1800000, 'ntv.com.tr': 1500000, 'haberturk.com': 1200000,
  'milliyet.com.tr': 1200000, 'cumhuriyet.com.tr': 800000, 'haberler.com': 500000,
  'mynet.com': 300000, 'timeturk.com': 200000,
};

const DATE_PRESETS = [
  { k: '7d',  l: '7 Gün'  },
  { k: '30d', l: '30 Gün' },
  { k: '90d', l: '90 Gün' },
  { k: 'all', l: 'Tümü'   },
];

function getReachClient(url) {
  try {
    const d = new URL(url).hostname.replace('www.', '');
    return DOMAIN_REACH[d] || (url?.includes('reddit') ? 5000 : 50000);
  } catch { return 0; }
}

function formatReach(n) {
  if (!n) return '0';
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${Math.round(n / 1_000)}K`;
  return String(n);
}

function formatDate(d) {
  if (!d) return '';
  const months = ['Oca','Şub','Mar','Nis','May','Haz','Tem','Ağu','Eyl','Eki','Kas','Ara'];
  const dt = new Date(d + 'T00:00:00');
  return `${dt.getDate()} ${months[dt.getMonth()]}`;
}

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60)    return `${diff}sn önce`;
  if (diff < 3600)  return `${Math.floor(diff / 60)}dk önce`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}sa önce`;
  return `${Math.floor(diff / 86400)}g önce`;
}

/* ─── Sub-components ─────────────────────────────────────────────────────── */

function StatCard({ label, value, sub, color = 'text-white' }) {
  return (
    <div className="card text-center py-4">
      <div className={clsx('text-2xl font-bold', color)}>{value ?? '—'}</div>
      <div className="text-xs text-muted mt-1">{label}</div>
      {sub && <div className="text-[10px] text-muted/60 mt-0.5">{sub}</div>}
    </div>
  );
}

function StormAlert({ storm }) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-xl border border-orange-500/40 bg-orange-500/10">
      <AlertTriangle size={18} className="text-orange-400 flex-shrink-0 mt-0.5" />
      <div>
        <div className="text-sm font-semibold text-orange-400">Storm Uyarısı — Anormal Mention Artışı</div>
        <div className="text-xs text-muted mt-1">
          Son 1 saatte <strong className="text-white">{storm.currentHourCount}</strong> mention —
          saatlik ortalamanın <strong className="text-orange-400">{storm.ratio}× üzeri</strong>.
          Bir kriz veya viral içerik olabilir.
        </div>
      </div>
    </div>
  );
}

function SentimentBar({ byBrand }) {
  if (!byBrand) return null;
  const total = Object.values(byBrand).reduce((a, b) => a + b, 0);
  if (!total) return null;
  return (
    <div className="flex h-2 rounded-full overflow-hidden gap-0.5">
      {Object.entries(byBrand).map(([brand, count]) => {
        const b = BRANDS.find(x => x.id === brand);
        return (
          <div key={brand}
            style={{ width: `${(count / total) * 100}%`, backgroundColor: b?.color || '#666' }}
            title={`${b?.shortName || brand}: ${count}`} />
        );
      })}
    </div>
  );
}

function WordCloud({ keywords, onClickWord, activeWord }) {
  const max = keywords[0]?.count || 1;
  return (
    <div className="flex flex-wrap gap-2 p-1">
      {keywords.slice(0, 35).map(({ word, count }, i) => {
        const ratio    = count / max;
        const tier     = i < 5 ? 'lg' : i < 15 ? 'md' : 'sm';
        const isActive = activeWord === word;
        return (
          <button key={word} title={`"${word}" için mentionları filtrele`}
            onClick={() => onClickWord(word)}
            className="inline-flex items-center gap-1 rounded-full transition-all hover:scale-105 active:scale-95"
            style={{
              fontSize:    tier === 'lg' ? 14 : tier === 'md' ? 12 : 11,
              fontWeight:  tier === 'lg' ? 600 : tier === 'md' ? 500 : 400,
              padding:     tier === 'lg' ? '5px 14px' : tier === 'md' ? '4px 11px' : '3px 9px',
              background:  isActive ? 'rgba(196,146,42,0.35)' : `rgba(196,146,42,${0.08 + ratio * 0.12})`,
              border:      `1px solid rgba(196,146,42,${isActive ? 0.7 : 0.15 + ratio * 0.2})`,
              color:       isActive ? '#f3c96b' : ratio > 0.7 ? '#f3c96b' : ratio > 0.4 ? '#C4922A' : '#8a6520',
              boxShadow:   isActive ? '0 0 0 2px rgba(196,146,42,0.25)' : 'none',
            }}>
            {word}
            <span style={{ fontSize: 9, opacity: 0.6, color: '#888' }}>{count}</span>
          </button>
        );
      })}
    </div>
  );
}

function EmotionChart({ byEmotion, total }) {
  if (!byEmotion || !total) return null;
  const emotions = ['joy', 'anger', 'fear', 'sadness', 'neutral'];
  return (
    <div className="space-y-2.5">
      {emotions.map(key => {
        const meta  = EMOTION_META[key];
        const count = byEmotion[key] || 0;
        const pct   = total > 0 ? Math.round((count / total) * 100) : 0;
        return (
          <div key={key} className="flex items-center gap-3">
            <span className="text-base w-6 text-center">{meta.emoji}</span>
            <span className="text-xs text-muted w-16">{meta.label}</span>
            <div className="flex-1 h-2 rounded-full bg-surface2 overflow-hidden">
              <div className="h-full rounded-full transition-all"
                style={{ width: `${pct}%`, backgroundColor: meta.color }} />
            </div>
            <span className="text-[11px] font-semibold w-8 text-right" style={{ color: meta.color }}>
              {pct}%
            </span>
            <span className="text-[10px] text-muted w-5 text-right">{count}</span>
          </div>
        );
      })}
    </div>
  );
}

function AIClusters({ clusters, loading, onFetch }) {
  if (loading) {
    return (
      <div className="flex items-center gap-3 p-4 rounded-xl border border-navy-border bg-surface">
        <RefreshCw size={16} className="animate-spin text-caramel" />
        <span className="text-sm text-muted">Claude AI konu analizi yapıyor…</span>
      </div>
    );
  }

  if (!clusters) {
    return (
      <div className="flex items-center justify-between p-4 rounded-xl border border-dashed border-navy-border">
        <div>
          <div className="text-sm font-medium text-white flex items-center gap-2">
            <Brain size={14} className="text-purple-400" /> AI Konu Kümeleme
          </div>
          <div className="text-xs text-muted mt-0.5">
            Keyword'leri Claude AI ile anlamlı iş kategorilerine grupla
          </div>
        </div>
        <button onClick={onFetch}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-400 text-xs font-medium hover:bg-purple-500/25 transition-all">
          <Brain size={12} /> AI Analizi Yap
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <Brain size={14} className="text-purple-400" /> AI Konu Kümeleme
        </h3>
        <button onClick={onFetch}
          className="text-[10px] text-muted hover:text-white flex items-center gap-1 transition-colors">
          <RefreshCw size={10} /> Yenile
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {clusters.map((cluster, i) => (
          <div key={i} className="rounded-xl border border-navy-border bg-surface p-3"
            style={{ borderColor: `${TOPIC_COLORS[i % TOPIC_COLORS.length]}33` }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{cluster.emoji}</span>
              <span className="text-xs font-semibold text-white">{cluster.name}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(cluster.keywords || []).map(kw => (
                <span key={kw} className="text-[10px] px-2 py-0.5 rounded-full"
                  style={{
                    background: `${TOPIC_COLORS[i % TOPIC_COLORS.length]}18`,
                    border:     `1px solid ${TOPIC_COLORS[i % TOPIC_COLORS.length]}40`,
                    color:      TOPIC_COLORS[i % TOPIC_COLORS.length],
                  }}>
                  {kw}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MentionCard({ mention, isNew }) {
  const brand   = BRANDS.find(b => b.id === mention.brandId);
  const sm      = SENTIMENT_META[mention.sentiment] || SENTIMENT_META.neutral;
  const srcMeta = SOURCE_META[mention.sourceType] || { label: mention.sourceType, icon: '📄' };
  const reach   = getReachClient(mention.url);
  const isInfl  = reach >= 500000;

  return (
    <div className={clsx(
      'flex items-start gap-3 p-3 rounded-xl border transition-all duration-300',
      isNew ? 'border-success/60 bg-success/5 shadow-glow'
            : 'border-navy-border bg-surface hover:border-navy-border/80'
    )}>
      <div className="flex-shrink-0 pt-1">
        <span className="block w-2.5 h-2.5 rounded-full"
          style={{ backgroundColor: brand?.color || '#888' }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-0.5">
          <span className="text-[11px] font-semibold text-white">{brand?.name || mention.brandId}</span>
          <span className={clsx('text-[10px] font-medium px-1.5 py-0.5 rounded border', sm.bg, sm.color)}>
            {sm.icon} {sm.label}
          </span>
          <span className="text-[10px] text-muted bg-surface2 px-1.5 py-0.5 rounded">
            {srcMeta.icon} {srcMeta.label}
          </span>
          {mention.source && <span className="text-[10px] text-muted">{mention.source}</span>}
          {isInfl && (
            <span className="flex items-center gap-0.5 text-[10px] text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 px-1.5 py-0.5 rounded">
              <Star size={8} /> {formatReach(reach)}
            </span>
          )}
          <span className="ml-auto text-[10px] text-muted">{timeAgo(mention.publishedAt || mention.scrapedAt)}</span>
        </div>
        <a href={mention.url} target="_blank" rel="noopener noreferrer"
          className="text-xs font-medium text-white hover:text-caramel transition-colors leading-snug line-clamp-2">
          {mention.title}
        </a>
        {mention.snippet && (
          <p className="text-[11px] text-muted mt-1 leading-relaxed line-clamp-2">{mention.snippet}</p>
        )}
      </div>
    </div>
  );
}

/* ─── Main ───────────────────────────────────────────────────────────────── */

export default function MentionMonitor() {
  const { mentions, stats, connected, lastPoll, newFlash } = useMentionStream();

  const [activeTab,       setActiveTab]      = useState('akis');
  const [filterBrand,     setFilterBrand]    = useState('all');
  const [filterSentiment, setFilterSentiment]= useState('all');
  const [filterSource,    setFilterSource]   = useState('all');
  const [searchText,      setSearchText]     = useState('');
  const [datePreset,      setDatePreset]     = useState('all');

  const [analytics,        setAnalytics]       = useState(null);
  const [analyticsLoading, setAnalyticsLoading]= useState(false);
  const [analyticsBrand,   setAnalyticsBrand]  = useState('all');
  const [analyticsDate,    setAnalyticsDate]   = useState('30d');

  // Word cloud click state
  const [clickedWord, setClickedWord] = useState(null);

  // AI clusters
  const [aiClusters,       setAiClusters]      = useState(null);
  const [clustersLoading,  setClustersLoading] = useState(false);

  /* ── filtered (Akış tab) ─── */
  const filtered = useMemo(() => {
    let items = mentions;
    if (datePreset !== 'all') {
      const days = datePreset === '7d' ? 7 : datePreset === '30d' ? 30 : 90;
      const from = Date.now() - days * 86_400_000;
      items = items.filter(m => new Date(m.publishedAt || m.scrapedAt).getTime() >= from);
    }
    if (filterBrand     !== 'all') items = items.filter(m => m.brandId    === filterBrand);
    if (filterSentiment !== 'all') items = items.filter(m => m.sentiment  === filterSentiment);
    if (filterSource    !== 'all') items = items.filter(m => m.sourceType === filterSource);
    if (searchText) {
      const kw = searchText.toLowerCase();
      items = items.filter(m =>
        m.title?.toLowerCase().includes(kw) || m.snippet?.toLowerCase().includes(kw)
      );
    }
    return items;
  }, [mentions, datePreset, filterBrand, filterSentiment, filterSource, searchText]);

  const topBrands = useMemo(() => {
    if (!stats?.byBrand) return [];
    return Object.entries(stats.byBrand)
      .sort((a, b) => b[1] - a[1]).slice(0, 5)
      .map(([id, count]) => ({ id, count, brand: BRANDS.find(b => b.id === id) }));
  }, [stats]);

  /* ── fetch analytics ─── */
  const fetchAnalytics = useCallback(async () => {
    setAnalyticsLoading(true);
    try {
      const p = new URLSearchParams();
      if (analyticsDate !== 'all') {
        const days = analyticsDate === '7d' ? 7 : analyticsDate === '30d' ? 30 : 90;
        p.set('from', new Date(Date.now() - days * 86_400_000).toISOString());
      }
      if (analyticsBrand !== 'all') p.set('brand', analyticsBrand);
      const res  = await fetch(`${SCRAPER_BASE}/mentions/analytics?${p}`);
      const json = await res.json();
      if (json.status === 'ok') { setAnalytics(json); setAiClusters(null); }
    } catch (err) {
      console.error('[analytics]', err);
    } finally {
      setAnalyticsLoading(false);
    }
  }, [analyticsDate, analyticsBrand]);

  useEffect(() => {
    if (activeTab === 'analitik') fetchAnalytics();
  }, [activeTab, fetchAnalytics]);

  /* ── AI clusters ─── */
  const fetchAIClusters = useCallback(async () => {
    setClustersLoading(true);
    try {
      const p = new URLSearchParams();
      if (analyticsDate !== 'all') {
        const days = analyticsDate === '7d' ? 7 : analyticsDate === '30d' ? 30 : 90;
        p.set('from', new Date(Date.now() - days * 86_400_000).toISOString());
      }
      if (analyticsBrand !== 'all') p.set('brand', analyticsBrand);
      const res  = await fetch(`${SCRAPER_BASE}/mentions/clusters?${p}`);
      const json = await res.json();
      if (json.status === 'ok') setAiClusters(json.clusters);
      else throw new Error(json.message);
    } catch (err) {
      console.error('[clusters]', err);
    } finally {
      setClustersLoading(false);
    }
  }, [analyticsDate, analyticsBrand]);

  /* ── Word cloud click → Akış tab filter ─── */
  function handleWordClick(word) {
    setClickedWord(word);
    setSearchText(word);
    setActiveTab('akis');
  }

  function clearWordFilter() {
    setClickedWord(null);
    setSearchText('');
  }

  /* ── export ─── */
  async function exportToExcel() {
    let data = filtered;
    if (mentions.length <= 50) {
      try {
        const res  = await fetch(`${SCRAPER_BASE}/mentions?limit=2000`);
        const json = await res.json();
        if (json.status === 'ok') data = json.data;
      } catch { /* use what we have */ }
    }
    const rows = data.map(m => ({
      Tarih:           m.publishedAt ? new Date(m.publishedAt).toLocaleString('tr-TR') : '',
      Marka:           m.brandId    || '',
      Başlık:          m.title      || '',
      Kaynak:          m.source     || '',
      'Kaynak Tipi':   m.sourceType || '',
      Duygu:           m.sentiment  || '',
      'Tahmini Reach': getReachClient(m.url),
      URL:             m.url        || '',
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Mentions');
    XLSX.writeFile(wb, `pulsara-mentions-${new Date().toISOString().slice(0, 10)}.xlsx`);
  }

  /* ─────────────────────────────────────────────────────────────────────── */

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-white">Canlı Mention Takibi</h1>
          <p className="text-xs text-muted mt-0.5">
            Google Haberler + TR Haber + Reddit — 21 marka, 15 dakikada bir güncellenir
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className={clsx(
            'flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium',
            connected ? 'bg-success/10 border-success/20 text-success'
                      : 'bg-danger/10 border-danger/20 text-danger'
          )}>
            <span className="relative flex h-2 w-2">
              {connected && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />}
              <span className={clsx('relative inline-flex rounded-full h-2 w-2',
                connected ? 'bg-success' : 'bg-danger')} />
            </span>
            {connected ? 'Canlı' : 'Bağlantı kesildi'}
          </div>
          {lastPoll && (
            <span className="text-[11px] text-muted">Son: {lastPoll.toLocaleTimeString('tr-TR')}</span>
          )}
        </div>
      </div>

      {analytics?.storm?.isStorm && <StormAlert storm={analytics.storm} />}

      {/* Tabs */}
      <div className="flex gap-0 border-b border-navy-border">
        {[
          { key: 'akis',     label: '📡 Canlı Akış'    },
          { key: 'analitik', label: '📊 Analitik'       },
          { key: 'rapor',    label: '📤 Rapor & Export'  },
        ].map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={clsx(
              'px-5 py-2.5 text-sm font-medium border-b-2 transition-all -mb-px',
              activeTab === tab.key
                ? 'border-caramel text-caramel'
                : 'border-transparent text-muted hover:text-white'
            )}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ═══ AKIŞ ═══════════════════════════════════════════════════════════ */}
      {activeTab === 'akis' && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard label="Toplam Mention" value={stats?.total ?? mentions.length} color="text-caramel" />
            <StatCard label="Olumlu"  value={stats?.bySentiment?.positive ?? '—'} color="text-success" />
            <StatCard label="Olumsuz" value={stats?.bySentiment?.negative ?? '—'} color="text-danger"  />
            <StatCard label="Nötr"    value={stats?.bySentiment?.neutral  ?? '—'} color="text-warning" />
          </div>

          {topBrands.length > 0 && (
            <div className="card">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-white">En Çok Bahsedilen Markalar</h2>
                <span className="text-[10px] text-muted">ilk 5</span>
              </div>
              <div className="space-y-2">
                {topBrands.map(({ id, count, brand }) => {
                  const max = topBrands[0]?.count || 1;
                  return (
                    <div key={id} className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: brand?.color || '#888' }} />
                      <span className="text-xs text-muted w-28 truncate">{brand?.name || id}</span>
                      <div className="flex-1 h-1.5 rounded-full bg-surface2">
                        <div className="h-full rounded-full transition-all"
                          style={{ width: `${(count / max) * 100}%`, backgroundColor: brand?.color || '#C4922A' }} />
                      </div>
                      <span className="text-xs font-bold text-white w-8 text-right">{count}</span>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4">
                <SentimentBar byBrand={stats?.byBrand} />
                <p className="text-[10px] text-muted mt-1">Marka dağılımı</p>
              </div>
            </div>
          )}

          {/* Aktif konu filtresi */}
          {clickedWord && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-caramel/10 border border-caramel/30 text-xs">
              <Zap size={12} className="text-caramel" />
              <span className="text-muted">Konu filtresi:</span>
              <span className="text-caramel font-semibold">"{clickedWord}"</span>
              <button onClick={clearWordFilter} className="ml-auto text-muted hover:text-white transition-colors">
                <X size={12} />
              </button>
            </div>
          )}

          {/* Filters */}
          <div className="flex flex-wrap gap-2 items-center">
            {DATE_PRESETS.map(p => (
              <button key={p.k} onClick={() => setDatePreset(p.k)}
                className={clsx('px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all',
                  datePreset === p.k
                    ? 'bg-caramel/20 border-caramel/40 text-caramel'
                    : 'border-navy-border text-muted hover:text-white')}>
                {p.l}
              </button>
            ))}
            <div className="w-px h-4 bg-navy-border mx-1" />
            <select value={filterBrand} onChange={e => setFilterBrand(e.target.value)}
              className="input text-xs py-1.5 pr-7">
              <option value="all">Tüm Markalar</option>
              {BRANDS.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
            {['all','positive','negative','neutral'].map(s => (
              <button key={s} onClick={() => setFilterSentiment(s)}
                className={clsx('px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all',
                  filterSentiment === s
                    ? 'bg-caramel/20 border-caramel/40 text-caramel'
                    : 'border-navy-border text-muted hover:text-white')}>
                {s === 'all' ? 'Tüm Duygular' : `${SENTIMENT_META[s].icon} ${SENTIMENT_META[s].label}`}
              </button>
            ))}
            {['all','news','tr_news','reddit'].map(src => (
              <button key={src} onClick={() => setFilterSource(src)}
                className={clsx('px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all',
                  filterSource === src
                    ? 'bg-caramel/20 border-caramel/40 text-caramel'
                    : 'border-navy-border text-muted hover:text-white')}>
                {src === 'all' ? '📡 Tüm Kaynaklar'
                  : `${SOURCE_META[src]?.icon} ${SOURCE_META[src]?.label}`}
              </button>
            ))}
            <input type="text" value={searchText} onChange={e => { setSearchText(e.target.value); if (!e.target.value) setClickedWord(null); }}
              placeholder="Anahtar kelime ara…" className="input text-xs py-1.5 w-44" />
            {filtered.length !== mentions.length && (
              <span className="text-[11px] text-muted">{filtered.length}/{mentions.length} gösteriliyor</span>
            )}
          </div>

          {filtered.length === 0 ? (
            <div className="card text-center py-16">
              {mentions.length === 0 ? (
                <>
                  <div className="text-3xl mb-3">📡</div>
                  <p className="text-sm font-medium text-white mb-1">Veri bekleniyor…</p>
                  <p className="text-xs text-muted">
                    {connected ? 'İlk polling tamamlandığında mentionlar görünecek.'
                               : 'Backend sunucusuna bağlanılamıyor.'}
                  </p>
                </>
              ) : (
                <>
                  <div className="text-3xl mb-3">🔍</div>
                  <p className="text-sm text-muted">Seçilen filtreler için sonuç bulunamadı.</p>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map(m => (
                <MentionCard key={m.id} mention={m} isNew={m.id === newFlash} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ═══ ANALİTİK ════════════════════════════════════════════════════════ */}
      {activeTab === 'analitik' && (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            {DATE_PRESETS.map(p => (
              <button key={p.k} onClick={() => setAnalyticsDate(p.k)}
                className={clsx('px-3 py-1.5 rounded-lg text-xs font-medium border transition-all',
                  analyticsDate === p.k
                    ? 'bg-caramel/20 border-caramel/40 text-caramel'
                    : 'border-navy-border text-muted hover:text-white')}>
                {p.l}
              </button>
            ))}
            <select value={analyticsBrand} onChange={e => setAnalyticsBrand(e.target.value)}
              className="input text-xs py-1.5 pr-7">
              <option value="all">Tüm Markalar</option>
              {BRANDS.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
            <button onClick={fetchAnalytics} disabled={analyticsLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-navy-border text-xs text-muted hover:text-white transition-all">
              <RefreshCw size={12} className={analyticsLoading ? 'animate-spin' : ''} />
              Yenile
            </button>
          </div>

          {analyticsLoading && !analytics ? (
            <div className="card text-center py-14">
              <RefreshCw size={20} className="animate-spin mx-auto mb-3 text-caramel" />
              <p className="text-sm text-muted">Analitik hesaplanıyor…</p>
            </div>
          ) : !analytics ? (
            <div className="card text-center py-14 text-muted text-sm">
              Yüklemek için Yenile butonuna tıklayın.
            </div>
          ) : (
            <>
              {analytics.storm?.isStorm && <StormAlert storm={analytics.storm} />}

              {/* KPIs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <StatCard label="Toplam Mention" value={analytics.total} color="text-caramel" />
                <StatCard label="Tahmini Reach" value={formatReach(analytics.totalReach)}
                  sub="toplam erişim" color="text-blue-400" />
                <StatCard label="Etkili Kaynak" value={analytics.influencerCount}
                  sub="500K+ okuyucu" color="text-purple-400" />
                <StatCard
                  label="Olumlu Oran"
                  value={analytics.total > 0
                    ? `${Math.round((analytics.bySentiment.positive / analytics.total) * 100)}%`
                    : '—'}
                  sub={`${analytics.bySentiment.negative} olumsuz`}
                  color="text-success"
                />
              </div>

              {/* Volume trend */}
              {analytics.timeline?.length > 1 ? (
                <div className="card">
                  <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                    <TrendingUp size={14} className="text-caramel" /> Mention Hacim Trendi
                  </h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={analytics.timeline} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#19263A" />
                      <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748b' }}
                        tickFormatter={formatDate} interval="preserveStartEnd" />
                      <YAxis tick={{ fontSize: 10, fill: '#64748b' }} allowDecimals={false} />
                      <Tooltip
                        contentStyle={{ background: '#0C1420', border: '1px solid #19263A', borderRadius: 8, fontSize: 11 }}
                        labelStyle={{ color: '#fff' }} labelFormatter={formatDate}
                      />
                      <Line type="monotone" dataKey="total" stroke="#C4922A" strokeWidth={2}
                        dot={false} name="Toplam" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="card py-8 text-center text-muted text-sm">
                  Trend grafiği için en az 2 günlük veri gerekli.
                </div>
              )}

              {/* Sentiment trend + Duygu analizi */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {analytics.timeline?.length > 1 && (
                  <div className="card">
                    <h3 className="text-sm font-semibold text-white mb-4">Sentiment Trendi</h3>
                    <ResponsiveContainer width="100%" height={190}>
                      <AreaChart data={analytics.timeline} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#19263A" />
                        <XAxis dataKey="date" tick={{ fontSize: 9, fill: '#64748b' }}
                          tickFormatter={formatDate} interval="preserveStartEnd" />
                        <YAxis tick={{ fontSize: 9, fill: '#64748b' }} allowDecimals={false} />
                        <Tooltip
                          contentStyle={{ background: '#0C1420', border: '1px solid #19263A', borderRadius: 8, fontSize: 10 }}
                          labelFormatter={formatDate}
                        />
                        <Legend iconSize={8} wrapperStyle={{ fontSize: 10 }} />
                        <Area type="monotone" dataKey="positive" stackId="1"
                          stroke="#22c55e" fill="#22c55e" fillOpacity={0.3} name="Olumlu" />
                        <Area type="monotone" dataKey="neutral" stackId="1"
                          stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.25} name="Nötr" />
                        <Area type="monotone" dataKey="negative" stackId="1"
                          stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} name="Olumsuz" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {/* Duygu analizi */}
                {analytics.byEmotion && (
                  <div className="card">
                    <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                      Duygu Analizi
                      <span className="text-[10px] text-muted font-normal">keyword heuristic</span>
                    </h3>
                    <EmotionChart byEmotion={analytics.byEmotion} total={analytics.total} />
                  </div>
                )}
              </div>

              {/* Top sources + Konu trendi */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {analytics.topSources?.length > 0 && (
                  <div className="card">
                    <h3 className="text-sm font-semibold text-white mb-4">En Aktif Kaynaklar</h3>
                    <div className="space-y-2">
                      {analytics.topSources.slice(0, 8).map((src, i) => {
                        const max = analytics.topSources[0]?.count || 1;
                        return (
                          <div key={src.domain} className="flex items-center gap-2">
                            <span className="text-[10px] text-muted w-4 text-right">{i + 1}</span>
                            {src.isInfluencer
                              ? <Star size={10} className="text-yellow-400 flex-shrink-0" />
                              : <Newspaper size={10} className="text-muted flex-shrink-0" />}
                            <span className="text-[11px] text-muted truncate" style={{ maxWidth: 130 }}>
                              {src.label || src.domain}
                            </span>
                            <div className="flex-1 h-1.5 rounded-full bg-surface2">
                              <div className="h-full rounded-full"
                                style={{
                                  width: `${(src.count / max) * 100}%`,
                                  background: src.isInfluencer ? '#a78bfa' : '#C4922A',
                                }} />
                            </div>
                            <span className="text-[10px] text-muted w-10">{formatReach(src.totalReach)}</span>
                            <span className="text-xs font-bold text-white w-5 text-right">{src.count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Konu trendi (top 5 keyword) */}
                {analytics.topicTrends?.length > 1 && analytics.topKeywords?.length > 0 && (
                  <div className="card">
                    <h3 className="text-sm font-semibold text-white mb-4">Konu Trendi — Top 5</h3>
                    <ResponsiveContainer width="100%" height={190}>
                      <LineChart data={analytics.topicTrends} margin={{ top: 5, right: 10, bottom: 5, left: -25 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#19263A" />
                        <XAxis dataKey="date" tick={{ fontSize: 9, fill: '#64748b' }}
                          tickFormatter={formatDate} interval="preserveStartEnd" />
                        <YAxis tick={{ fontSize: 9, fill: '#64748b' }} allowDecimals={false} />
                        <Tooltip
                          contentStyle={{ background: '#0C1420', border: '1px solid #19263A', borderRadius: 8, fontSize: 10 }}
                          labelFormatter={formatDate}
                        />
                        <Legend iconSize={8} wrapperStyle={{ fontSize: 10 }} />
                        {analytics.topKeywords.slice(0, 5).map((kw, i) => (
                          <Line key={kw.word} type="monotone" dataKey={kw.word}
                            stroke={TOPIC_COLORS[i]} strokeWidth={1.5} dot={false} name={kw.word} />
                        ))}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>

              {/* AI Konu Kümeleme */}
              <div className="card">
                <AIClusters
                  clusters={aiClusters}
                  loading={clustersLoading}
                  onFetch={fetchAIClusters}
                />
              </div>

              {/* Word cloud */}
              {analytics.topKeywords?.length > 0 && (
                <div className="card">
                  <h3 className="text-sm font-semibold text-white mb-1 flex items-center gap-2">
                    <Zap size={14} className="text-caramel" /> Word Cloud — Öne Çıkan Konular
                  </h3>
                  <p className="text-[11px] text-muted mb-4">
                    Kelimeye tıkla → Canlı Akış sekmesinde o konunun mentionları listelenir
                  </p>
                  <WordCloud
                    keywords={analytics.topKeywords}
                    onClickWord={handleWordClick}
                    activeWord={clickedWord}
                  />
                </div>
              )}

              {/* Konu analizi tablosu */}
              {analytics.topKeywords?.length > 0 && (
                <div className="card">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h3 className="text-sm font-semibold text-white">Konu Analizi</h3>
                      <p className="text-[11px] text-muted mt-0.5">
                        Mention içeriklerinde en sık geçen konular, erişim ve duygu dağılımı
                      </p>
                    </div>
                    <span className="text-[10px] text-muted bg-surface2 px-2.5 py-1 rounded-full border border-navy-border">
                      Top {Math.min(analytics.topKeywords.length, 15)}
                    </span>
                  </div>

                  <div className="grid gap-x-4 mb-2 px-1" style={{ gridTemplateColumns: '28px 1fr 80px 52px 52px' }}>
                    <span className="text-[10px] text-muted uppercase tracking-wider">#</span>
                    <span className="text-[10px] text-muted uppercase tracking-wider">Konu</span>
                    <span className="text-[10px] text-muted uppercase tracking-wider">Yoğunluk</span>
                    <span className="text-[10px] text-muted uppercase tracking-wider text-right">Oran</span>
                    <span className="text-[10px] text-muted uppercase tracking-wider text-right">Mention</span>
                  </div>
                  <div className="border-t border-navy-border mb-1" />

                  <div className="divide-y divide-navy-border/40">
                    {analytics.topKeywords.slice(0, 15).map(({ word, count, sentiment }, i) => {
                      const max   = analytics.topKeywords[0]?.count || 1;
                      const total = analytics.total || 1;
                      const pct   = Math.round((count / total) * 100);
                      const ratio = count / max;
                      const isTop = i < 3;
                      const sentTotal = sentiment ? (sentiment.positive + sentiment.negative + sentiment.neutral) : 0;

                      return (
                        <div key={word}>
                          <div
                            className="grid items-center gap-x-4 py-2.5 px-1 hover:bg-white/[0.02] transition-colors cursor-pointer"
                            style={{ gridTemplateColumns: '28px 1fr 80px 52px 52px' }}
                            onClick={() => handleWordClick(word)}
                            title={`"${word}" mentionlarını göster`}>

                            <div className="flex justify-center">
                              {isTop ? (
                                <span className="inline-flex items-center justify-center w-5 h-5 rounded text-[10px] font-bold"
                                  style={{
                                    background: i === 0 ? 'rgba(196,146,42,0.25)' : i === 1 ? 'rgba(148,163,184,0.15)' : 'rgba(180,120,60,0.12)',
                                    color:      i === 0 ? '#f3c96b' : i === 1 ? '#94a3b8' : '#b47c3c',
                                    border:     `1px solid ${i === 0 ? 'rgba(243,201,107,0.3)' : 'rgba(148,163,184,0.15)'}`,
                                  }}>
                                  {i + 1}
                                </span>
                              ) : (
                                <span className="text-[11px] text-muted/50 font-medium">{i + 1}</span>
                              )}
                            </div>

                            <span className={clsx('text-[13px] truncate', isTop ? 'text-white font-medium' : 'text-slate-300')}>
                              {word}
                            </span>

                            <div className="h-1.5 rounded-full bg-surface2 overflow-hidden">
                              <div className="h-full rounded-full transition-all"
                                style={{
                                  width: `${ratio * 100}%`,
                                  background: ratio > 0.7
                                    ? 'linear-gradient(90deg,#C4922A,#f3c96b)'
                                    : ratio > 0.4 ? '#C4922A' : '#5a4010',
                                }} />
                            </div>

                            <span className="text-[11px] text-muted text-right">{pct}%</span>

                            <div className="flex justify-end">
                              <span className="inline-flex items-center justify-center min-w-[28px] h-5 px-1.5 rounded text-[10px] font-semibold bg-surface2 border border-navy-border text-slate-300">
                                {count}
                              </span>
                            </div>
                          </div>

                          {/* Konu başına mini sentiment bar */}
                          {sentiment && sentTotal > 0 && (
                            <div className="flex h-1 mx-9 mb-1 rounded-full overflow-hidden gap-px">
                              {sentiment.positive > 0 && (
                                <div className="bg-success/60 rounded-full"
                                  style={{ width: `${(sentiment.positive / sentTotal) * 100}%` }}
                                  title={`Olumlu: ${sentiment.positive}`} />
                              )}
                              {sentiment.neutral > 0 && (
                                <div className="bg-warning/40 rounded-full"
                                  style={{ width: `${(sentiment.neutral / sentTotal) * 100}%` }}
                                  title={`Nötr: ${sentiment.neutral}`} />
                              )}
                              {sentiment.negative > 0 && (
                                <div className="bg-danger/60 rounded-full"
                                  style={{ width: `${(sentiment.negative / sentTotal) * 100}%` }}
                                  title={`Olumsuz: ${sentiment.negative}`} />
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* ═══ RAPOR ═══════════════════════════════════════════════════════════ */}
      {activeTab === 'rapor' && (
        <div className="space-y-5">
          <div className="card">
            <h3 className="text-sm font-semibold text-white mb-1">Dışa Aktar</h3>
            <p className="text-xs text-muted mb-4">
              Mevcut mention verilerini indir ({mentions.length} kayıt yüklü)
            </p>
            <div className="flex gap-3 flex-wrap">
              <button onClick={exportToExcel}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-success/20 border border-success/30 text-success text-sm font-medium hover:bg-success/30 transition-all">
                <Download size={14} /> Excel İndir (.xlsx)
              </button>
              <button onClick={() => window.print()}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-500/20 border border-blue-500/30 text-blue-400 text-sm font-medium hover:bg-blue-500/30 transition-all">
                <Printer size={14} /> Yazdır / PDF Olarak Kaydet
              </button>
            </div>
          </div>

          <div className="card" style={{ borderStyle: 'dashed' }}>
            <h3 className="text-sm font-semibold text-white mb-1">PowerPoint Raporu</h3>
            <p className="text-xs text-muted">
              pptxgenjs kütüphanesi projeye yüklenmiş durumda. Otomatik PPTX rapor özelliği yakında eklenecek.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
