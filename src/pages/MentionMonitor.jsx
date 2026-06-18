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
  news:      { label: 'Google Haber', icon: '📰' },
  tr_news:   { label: 'TR Haber',    icon: '📰' },
  reddit:    { label: 'Reddit',      icon: '💬' },
  complaint: { label: 'Şikayetvar',  icon: '⚠️' },
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

// Boolean sorgu motoru — AND / OR / NOT / "tırnaklı ifade"
// Örnek: starbucks AND şikayet NOT reklam | "yeni şube" OR açılış
function matchesBooleanQuery(query, text) {
  if (!query.trim()) return true;
  const t = (text || '').toLowerCase().normalize('NFC');
  const q = query.trim();

  if (!/\b(AND|OR|NOT)\b/i.test(q) && !q.includes('"')) {
    return t.includes(q.toLowerCase().normalize('NFC'));
  }

  const tokens = q.split(/\b(AND|OR|NOT)\b/i).map(s => s.trim()).filter(Boolean);
  let result = null;
  let op     = 'AND';
  let negate = false;

  for (const token of tokens) {
    const upper = token.toUpperCase();
    if (upper === 'AND') { op = 'AND'; continue; }
    if (upper === 'OR')  { op = 'OR';  continue; }
    if (upper === 'NOT') { negate = true; continue; }

    const term = token.replace(/^["']|["']$/g, '').toLowerCase().normalize('NFC');
    if (!term) continue;
    const val  = negate ? !t.includes(term) : t.includes(term);
    negate = false;

    if (result === null)   result = val;
    else if (op === 'AND') result = result && val;
    else                   result = result || val;
    op = 'AND';
  }
  return result ?? true;
}

function hasBooleanOps(q) {
  return /\b(AND|OR|NOT)\b/i.test(q) || q.includes('"');
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
      <div className="flex items-center gap-3 p-5 rounded-xl border border-purple-500/30 bg-purple-500/5">
        <RefreshCw size={16} className="animate-spin text-purple-400 flex-shrink-0" />
        <div>
          <div className="text-sm font-medium text-white">Claude AI analiz yapıyor…</div>
          <div className="text-xs text-muted mt-0.5">Keyword'ler iş kategorilerine gruplandırılıyor</div>
        </div>
      </div>
    );
  }

  if (!clusters) {
    return (
      <div className="rounded-xl border border-purple-500/25 bg-purple-500/5 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Brain size={16} className="text-purple-400" />
              <span className="text-sm font-semibold text-white">AI Konu Kümeleme</span>
            </div>
          </div>
          <button onClick={onFetch}
            className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all"
            style={{ background: 'rgba(168,85,247,0.2)', border: '1px solid rgba(168,85,247,0.5)', color: '#c084fc' }}>
            <Brain size={14} /> AI Analizi Yap
          </button>
        </div>
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

  const [sov,        setSov]        = useState(null);
  const [sovLoading, setSovLoading] = useState(false);

  const [sentHidden, setSentHidden] = useState({});
  const handleSentLegend = (e) => setSentHidden(prev => ({ ...prev, [e.dataKey]: !prev[e.dataKey] }));

  // Custom keyword tracking — session only, intentionally not persisted
  const [customKeywords, setCustomKeywords] = useState(() => {
    localStorage.removeItem('pulsara_custom_kw'); // eski kayıtları temizle
    return [];
  });
  const [kwInput,    setKwInput]    = useState('');
  const [kwResults,  setKwResults]  = useState({}); // { keyword: [mentions] }
  const [kwLoading,  setKwLoading]  = useState({});  // { keyword: bool }

  // Word cloud click state
  const [clickedWord, setClickedWord] = useState(null);

  // Şikayetvar tab filters
  const [svBrand, setSvBrand] = useState('all');
  const [svSort,  setSvSort]  = useState('newest');

  // AI clusters
  const [aiClusters,       setAiClusters]      = useState(null);
  const [clustersLoading,  setClustersLoading] = useState(false);

  /* ── Şikayetvar filtrelenmiş şikayetler ─── */
  const complaintMentions = useMemo(() => {
    const svCutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
    let items = mentions.filter(m =>
      m.sourceType === 'complaint' &&
      new Date(m.publishedAt || m.scrapedAt).getTime() >= svCutoff
    );
    if (svBrand !== 'all') items = items.filter(m => m.brandId === svBrand);
    return [...items].sort((a, b) => {
      const ta = new Date(a.publishedAt || a.scrapedAt).getTime();
      const tb = new Date(b.publishedAt || b.scrapedAt).getTime();
      return svSort === 'oldest' ? ta - tb : tb - ta;
    });
  }, [mentions, svBrand, svSort]);

  const complaintByBrand = useMemo(() => {
    const svCutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const all = mentions.filter(m =>
      m.sourceType === 'complaint' &&
      new Date(m.publishedAt || m.scrapedAt).getTime() >= svCutoff
    );
    const map = {};
    for (const m of all) map[m.brandId] = (map[m.brandId] || 0) + 1;
    return map;
  }, [mentions]);

  /* ── filtered (Akış tab) ─── */
  const filtered = useMemo(() => {
    let items = mentions.filter(m => m.sourceType !== 'complaint'); // şikayetler ayrı sekmede
    if (datePreset !== 'all') {
      const days = datePreset === '7d' ? 7 : datePreset === '30d' ? 30 : 90;
      const from = Date.now() - days * 86_400_000;
      items = items.filter(m => new Date(m.publishedAt || m.scrapedAt).getTime() >= from);
    }
    if (filterBrand     !== 'all') items = items.filter(m => m.brandId    === filterBrand);
    if (filterSentiment !== 'all') items = items.filter(m => m.sentiment  === filterSentiment);
    if (filterSource    !== 'all') items = items.filter(m => m.sourceType === filterSource);
    if (searchText) {
      items = items.filter(m =>
        matchesBooleanQuery(searchText, `${m.title || ''} ${m.snippet || ''}`)
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

  /* ── fetch Share of Voice ─── */
  const fetchSov = useCallback(async () => {
    setSovLoading(true);
    try {
      const days = analyticsDate === 'all' ? 365 : analyticsDate === '7d' ? 7 : analyticsDate === '30d' ? 30 : analyticsDate === '90d' ? 90 : 365;
      const res  = await fetch(`${SCRAPER_BASE}/mentions/sov?days=${days}`);
      const json = await res.json();
      if (json.status === 'ok') setSov(json);
    } catch (err) {
      console.error('[sov]', err);
    } finally {
      setSovLoading(false);
    }
  }, [analyticsDate]);

  useEffect(() => {
    if (activeTab === 'analitik') {
      fetchAnalytics();
      fetchSov();
    }
  }, [activeTab, fetchAnalytics, fetchSov]);

  /* ── Custom keyword helpers ─── */
  async function fetchKwResults(kw) {
    setKwLoading(prev => ({ ...prev, [kw]: true }));
    try {
      // Depolanmış veriler + canlı Google News araması paralel çalışır
      const [storedRes, liveRes] = await Promise.allSettled([
        fetch(`${SCRAPER_BASE}/mentions?keyword=${encodeURIComponent(kw)}&limit=500`).then(r => r.json()),
        fetch(`${SCRAPER_BASE}/mentions/live-search?keyword=${encodeURIComponent(kw)}`).then(r => r.json()),
      ]);

      const stored = storedRes.status === 'fulfilled' && storedRes.value.status === 'ok'
        ? storedRes.value.data : [];
      const live   = liveRes.status === 'fulfilled' && liveRes.value.status === 'ok'
        ? liveRes.value.data : [];

      // URL'e göre deduplicate, en yeni üstte
      const seen = new Set(stored.map(m => m.url));
      const merged = [
        ...stored,
        ...live.filter(m => !seen.has(m.url)),
      ].sort((a, b) =>
        new Date(b.publishedAt || b.scrapedAt) - new Date(a.publishedAt || a.scrapedAt)
      );

      setKwResults(prev => ({ ...prev, [kw]: merged }));
    } catch { /* ignore */ }
    finally { setKwLoading(prev => ({ ...prev, [kw]: false })); }
  }

  function addCustomKeyword() {
    const kw = kwInput.trim().toLowerCase();
    if (!kw || customKeywords.includes(kw)) { setKwInput(''); return; }
    setCustomKeywords(prev => [...prev, kw]);
    setKwInput('');
    fetchKwResults(kw);
  }

  function removeCustomKeyword(kw) {
    setCustomKeywords(prev => prev.filter(k => k !== kw));
    setKwResults(prev => { const n = { ...prev }; delete n[kw]; return n; });
  }

  const customKwStats = useMemo(() => {
    return customKeywords.map(kw => {
      const hits = (kwResults[kw] || []);
      const pos  = hits.filter(m => m.sentiment === 'positive').length;
      const neg  = hits.filter(m => m.sentiment === 'negative').length;
      const neu  = hits.filter(m => m.sentiment === 'neutral').length;
      return { kw, total: hits.length, pos, neg, neu, hits: hits.slice(0, 5), loading: !!kwLoading[kw] };
    }).sort((a, b) => b.total - a.total);
  }, [customKeywords, kwResults, kwLoading]);

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

  function exportToPDF() {
    const data = analytics;
    if (!data) {
      alert('Önce Analitik sekmesini açıp "Yenile" butonuna tıklayın, ardından tekrar deneyin.');
      return;
    }
    const { total, bySentiment, byBrand, topKeywords, topSources } = data;
    const posRate = total > 0 ? Math.round((bySentiment.positive / total) * 100) : 0;
    const now     = new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });

    const brandRows = Object.entries(byBrand || {})
      .sort((a, b) => b[1] - a[1]).slice(0, 15)
      .map(([id, count], i) => {
        const brand = BRANDS.find(b => b.id === id);
        return `<tr style="border-bottom:1px solid #eee">
          <td style="padding:6px 10px;color:#888">${i + 1}</td>
          <td style="padding:6px 10px;font-weight:600">${brand?.name || id}</td>
          <td style="padding:6px 10px;text-align:center;font-weight:bold">${count}</td>
        </tr>`;
      }).join('');

    const kwBadges = (topKeywords || []).slice(0, 20).map(({ word, count }) =>
      `<span style="display:inline-block;background:#fff3e0;color:#c4922a;border:1px solid #f3c96b;
        border-radius:12px;padding:3px 10px;font-size:12px;margin:3px">${word} (${count})</span>`
    ).join('');

    const srcRows = (topSources || []).slice(0, 8).map(s =>
      `<tr style="border-bottom:1px solid #eee">
        <td style="padding:6px 10px;font-size:13px">${s.label || s.domain}</td>
        <td style="padding:6px 10px;text-align:center;font-weight:bold">${s.count}</td>
      </tr>`
    ).join('');

    const html = `<!DOCTYPE html><html lang="tr"><head><meta charset="UTF-8">
      <title>Pulsara Intel — Rapor ${now}</title>
      <style>
        body{margin:0;padding:24px;font-family:Arial,sans-serif;color:#1a1a1a;background:#fff}
        h1{color:#C4922A;font-size:22px;letter-spacing:1px;margin:0}
        .kpi{display:flex;gap:24px;margin:20px 0;flex-wrap:wrap}
        .kpi-box{text-align:center;padding:16px 24px;border:1px solid #eee;border-radius:8px;min-width:100px}
        .kpi-val{font-size:28px;font-weight:700}
        .kpi-lbl{font-size:11px;color:#888;margin-top:4px}
        table{width:100%;border-collapse:collapse;margin-top:8px}
        th{padding:6px 10px;font-size:11px;text-align:left;background:#f5f5f5;color:#666}
        h3{font-size:14px;margin:24px 0 8px;color:#333}
        @media print{body{padding:0}}
      </style></head><body>
      <div style="border-bottom:3px solid #C4922A;padding-bottom:12px;margin-bottom:16px">
        <h1>PULSARA INTEL</h1>
        <p style="margin:4px 0 0;font-size:12px;color:#888">Mention Raporu — ${now}</p>
      </div>
      <div class="kpi">
        <div class="kpi-box"><div class="kpi-val" style="color:#C4922A">${total}</div><div class="kpi-lbl">Toplam Mention</div></div>
        <div class="kpi-box"><div class="kpi-val" style="color:#22c55e">${bySentiment.positive} <span style="font-size:14px">(${posRate}%)</span></div><div class="kpi-lbl">Olumlu</div></div>
        <div class="kpi-box"><div class="kpi-val" style="color:#ef4444">${bySentiment.negative}</div><div class="kpi-lbl">Olumsuz</div></div>
        <div class="kpi-box"><div class="kpi-val" style="color:#64748b">${bySentiment.neutral}</div><div class="kpi-lbl">Nötr</div></div>
      </div>
      <h3>Marka Sıralaması</h3>
      <table><thead><tr><th>#</th><th>Marka</th><th style="text-align:center">Mention</th></tr></thead>
      <tbody>${brandRows}</tbody></table>
      ${srcRows ? `<h3>En Aktif Kaynaklar</h3>
      <table><thead><tr><th>Kaynak</th><th style="text-align:center">Mention</th></tr></thead>
      <tbody>${srcRows}</tbody></table>` : ''}
      ${kwBadges ? `<h3>Öne Çıkan Konular</h3><div style="margin-top:8px">${kwBadges}</div>` : ''}
      <p style="margin-top:32px;font-size:10px;color:#aaa;border-top:1px solid #eee;padding-top:8px">
        Pulsara Intel — intel.pulsaraai.com — ${now}
      </p>
    </body></html>`;

    // iframe ile yaz — popup blocker atlatılır
    const iframe = document.createElement('iframe');
    iframe.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;border:none;z-index:9999;background:#fff';
    document.body.appendChild(iframe);
    iframe.contentDocument.write(html);
    iframe.contentDocument.close();

    // Kapat butonu
    const closeBtn = document.createElement('button');
    closeBtn.textContent = '✕ Kapat';
    closeBtn.style.cssText = 'position:fixed;top:12px;right:16px;z-index:10000;padding:6px 14px;background:#ef4444;color:#fff;border:none;border-radius:6px;font-size:13px;cursor:pointer;font-family:Arial';
    closeBtn.onclick = () => { document.body.removeChild(iframe); document.body.removeChild(closeBtn); };
    document.body.appendChild(closeBtn);

    iframe.contentWindow.focus();
    setTimeout(() => iframe.contentWindow.print(), 400);
  }

  /* ─────────────────────────────────────────────────────────────────────── */

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-white">Canlı Mention Takibi</h1>
          <p className="text-xs text-muted mt-0.5">
            Google Haberler + TR Haber + Reddit — 21 marka, saatte bir güncellenir
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
          { key: 'kelime',      label: '🔍 Kelime Takibi'  },
          { key: 'sikayetvar',  label: '⚠️ Şikayetvar'    },
          { key: 'rapor',       label: '📤 Rapor & Export'  },
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
            <div className="relative">
              <input type="text" value={searchText}
                onChange={e => { setSearchText(e.target.value); if (!e.target.value) setClickedWord(null); }}
                placeholder='Ara… veya AND/OR/NOT kullan'
                className="input text-xs py-1.5 w-56"
                title='Boolean: starbucks AND şikayet NOT reklam | "yeni şube" OR açılış' />
              {hasBooleanOps(searchText) && (
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] font-bold px-1.5 py-0.5 rounded"
                  style={{ background: 'rgba(168,85,247,0.25)', color: '#c084fc', border: '1px solid rgba(168,85,247,0.4)' }}>
                  BOOL
                </span>
              )}
            </div>
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

              {/* Share of Voice */}
              {(sov?.data?.length > 0 || sovLoading) && (
                <div className="card">
                  <h3 className="text-sm font-semibold text-white mb-1 flex items-center gap-2">
                    Share of Voice
                    {sov && (
                      <span className="text-[10px] font-normal text-muted">
                        Son {sov.days} gün — {sov.total} toplam mention
                      </span>
                    )}
                    {sovLoading && <span className="text-[10px] text-muted animate-pulse">yükleniyor…</span>}
                  </h3>
                  <p className="text-[11px] text-muted mb-4">
                    Tüm markalardaki konuşmaların yüzdesel payı — marka filtresi uygulanmaz
                  </p>
                  {sov?.data && (
                    <div className="space-y-2">
                      {sov.data.filter(d => BRANDS.find(x => x.id === d.brandId))
                        .slice(0, 15).map(({ brandId, count, share }) => {
                        const brand = BRANDS.find(b => b.id === brandId);
                        return (
                          <div key={brandId} className="flex items-center gap-2.5">
                            <span className="text-[11px] w-28 truncate text-right flex-shrink-0 text-slate-300">
                              {brand.shortName || brand.name}
                            </span>
                            <div className="flex-1 h-2 rounded-full bg-surface2 overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{ width: `${share}%`, backgroundColor: 'rgba(148,163,184,0.5)' }}
                              />
                            </div>
                            <span className="text-[11px] font-bold w-9 text-right flex-shrink-0 text-slate-400">
                              {share}%
                            </span>
                            <span className="text-[10px] text-muted w-6 text-right flex-shrink-0">{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

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
                        <Legend iconSize={8} wrapperStyle={{ fontSize: 10, cursor: 'pointer' }}
                          onClick={handleSentLegend} />
                        <Area type="monotone" dataKey="positive"
                          stroke="#22c55e" fill="#22c55e" fillOpacity={0.3} name="Olumlu"
                          hide={!!sentHidden['positive']} />
                        <Area type="monotone" dataKey="neutral"
                          stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.2} name="Nötr"
                          hide={!!sentHidden['neutral']} />
                        <Area type="monotone" dataKey="negative"
                          stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} name="Olumsuz"
                          hide={!!sentHidden['negative']} />
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

      {/* ═══ KELİME TAKİBİ ══════════════════════════════════════════════════ */}
      {activeTab === 'kelime' && (
        <div className="space-y-5">
          <div>
            <h2 className="text-sm font-semibold text-white mb-1">Özel Kelime Takibi</h2>
            <p className="text-xs text-muted">
              İstediğin kelimeyi ekle — sistem yüklü mentionlarda o kelimeyi arar, mention sayısını ve duygu dağılımını gösterir
            </p>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={kwInput}
              onChange={e => setKwInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addCustomKeyword()}
              placeholder="Kelime gir (ör: reklam, kampanya, boykot) → Enter"
              className="input text-sm py-2.5 flex-1"
            />
            <button onClick={addCustomKeyword}
              className="px-5 py-2.5 rounded-lg font-medium text-sm transition-all flex-shrink-0"
              style={{ background: 'rgba(96,165,250,0.2)', border: '1px solid rgba(96,165,250,0.4)', color: '#60a5fa' }}>
              + Ekle
            </button>
          </div>

          {customKeywords.length === 0 ? (
            <div className="card text-center py-14">
              <div className="text-3xl mb-3">🔍</div>
              <p className="text-sm font-medium text-white mb-1">Henüz kelime eklenmedi</p>
              <p className="text-xs text-muted">Yukarıya bir kelime yaz ve Enter'a bas</p>
              <div className="flex flex-wrap gap-2 justify-center mt-4">
                {['reklam', 'kampanya', 'boykot', 'şikayet', 'yeni şube', 'indirim'].map(s => (
                  <button key={s} onClick={() => { setKwInput(s); }}
                    className="text-xs px-3 py-1 rounded-full border border-navy-border text-muted hover:text-white hover:border-caramel/40 transition-all">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {customKwStats.map(({ kw, total, pos, neg, neu, hits, loading }) => {
                const sentTotal = pos + neg + neu;
                return (
                  <div key={kw} className="card">
                    <div className="flex items-center gap-3 mb-3">
                      <button onClick={() => removeCustomKeyword(kw)}
                        className="text-muted hover:text-danger transition-colors flex-shrink-0" title="Kaldır">
                        <X size={13} />
                      </button>
                      <span className="text-sm font-semibold text-white">"{kw}"</span>
                      <span className="ml-auto text-xs font-bold text-white">{total}</span>
                      <span className="text-xs text-muted">mention</span>
                      {total > 0 && (
                        <button onClick={() => { setSearchText(kw); setActiveTab('akis'); }}
                          className="text-xs text-caramel hover:underline flex-shrink-0">
                          Canlı Akış'ta Göster →
                        </button>
                      )}
                    </div>

                    {loading ? (
                      <div className="flex items-center gap-2 py-2">
                        <RefreshCw size={12} className="animate-spin text-muted" />
                        <span className="text-xs text-muted">Aranıyor…</span>
                      </div>
                    ) : total > 0 ? (
                      <>
                        <div className="flex h-2 rounded-full overflow-hidden gap-px mb-2">
                          {pos > 0 && <div className="bg-success/70" style={{ width: `${(pos / sentTotal) * 100}%` }} title={`Olumlu: ${pos}`} />}
                          {neu > 0 && <div className="bg-warning/50" style={{ width: `${(neu / sentTotal) * 100}%` }} title={`Nötr: ${neu}`} />}
                          {neg > 0 && <div className="bg-danger/70" style={{ width: `${(neg / sentTotal) * 100}%` }} title={`Olumsuz: ${neg}`} />}
                        </div>
                        <div className="flex gap-4 text-[11px] mb-3">
                          <span className="text-success">😊 Olumlu: {pos}</span>
                          <span className="text-warning">😐 Nötr: {neu}</span>
                          <span className="text-danger">😟 Olumsuz: {neg}</span>
                        </div>
                        <div className="space-y-1.5 border-t border-navy-border pt-3">
                          <p className="text-[10px] text-muted uppercase tracking-wider mb-2">Son mentionlar (en yeni)</p>
                          {hits.map((m, i) => {
                            const dt = new Date(m.publishedAt || m.scrapedAt);
                            const absDate = dt.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' });
                            const isOld = dt < new Date('2026-01-01');
                            return (
                              <a key={i} href={m.url} target="_blank" rel="noopener noreferrer"
                                className="flex items-start gap-2 group">
                                <span className={`text-[10px] mt-0.5 flex-shrink-0 font-medium ${isOld ? 'text-danger' : 'text-muted'}`}
                                  title={isOld ? 'Eski içerik — Google News yeniden indekslemiş olabilir' : ''}>
                                  {absDate}{isOld ? ' ⚠️' : ''}
                                </span>
                                <span className="text-[12px] text-slate-300 group-hover:text-white transition-colors leading-snug line-clamp-1">
                                  {m.title}
                                </span>
                              </a>
                            );
                          })}
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center gap-3">
                        <p className="text-xs text-muted">Bu kelimeyi içeren mention bulunamadı.</p>
                        <button onClick={() => fetchKwResults(kw)}
                          className="text-[11px] text-caramel hover:underline flex items-center gap-1">
                          <RefreshCw size={10} /> Yenile
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ═══ ŞİKAYETVAR ═════════════════════════════════════════════════════ */}
      {activeTab === 'sikayetvar' && (
        <div className="space-y-5">

          {/* Özet kartları */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="card text-center py-4">
              <div className="text-2xl font-bold text-white">
                {mentions.filter(m => m.sourceType === 'complaint').length}
              </div>
              <div className="text-[11px] text-muted mt-1">Toplam Şikayet</div>
            </div>
            <div className="card text-center py-4">
              <div className="text-2xl font-bold text-white">
                {Object.keys(complaintByBrand).length}
              </div>
              <div className="text-[11px] text-muted mt-1">Marka</div>
            </div>
            <div className="card text-center py-4 col-span-2">
              <div className="text-sm font-bold text-white truncate">
                {(() => {
                  const top = Object.entries(complaintByBrand).sort((a,b) => b[1]-a[1])[0];
                  if (!top) return '—';
                  const br = BRANDS.find(b => b.id === top[0]);
                  return `${br?.name || top[0]} (${top[1]} şikayet)`;
                })()}
              </div>
              <div className="text-[11px] text-muted mt-1">En Çok Şikayet Alan</div>
            </div>
          </div>

          {/* Filtreler */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Marka filtresi */}
            <select
              value={svBrand}
              onChange={e => setSvBrand(e.target.value)}
              className="text-xs bg-surface2 border border-navy-border rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-caramel">
              <option value="all">Tüm Markalar</option>
              {BRANDS.filter(b => complaintByBrand[b.id]).sort((a,b) => (complaintByBrand[b.id]||0)-(complaintByBrand[a.id]||0)).map(b => (
                <option key={b.id} value={b.id}>{b.name} ({complaintByBrand[b.id]})</option>
              ))}
            </select>

            {/* Sıralama */}
            {[
              { key: 'newest', label: 'Yeniden Eskiye' },
              { key: 'oldest', label: 'Eskiden Yeniye' },
            ].map(s => (
              <button key={s.key} onClick={() => setSvSort(s.key)}
                className={clsx('px-3 py-1.5 rounded-lg text-[11px] font-medium border transition-all',
                  svSort === s.key
                    ? 'bg-caramel/20 border-caramel/40 text-caramel'
                    : 'border-navy-border text-muted hover:text-white')}>
                {s.label}
              </button>
            ))}

            <span className="ml-auto text-[11px] text-muted">{complaintMentions.length} şikayet gösteriliyor</span>
          </div>

          {/* Marka bazlı dağılım çubuğu */}
          {Object.keys(complaintByBrand).length > 0 && (
            <div className="card space-y-2">
              <h3 className="text-xs font-semibold text-white mb-3">Marka Bazlı Şikayet Dağılımı</h3>
              {Object.entries(complaintByBrand)
                .sort((a,b) => b[1]-a[1])
                .slice(0, 10)
                .map(([brandId, count]) => {
                  const br    = BRANDS.find(b => b.id === brandId);
                  const total = mentions.filter(m => m.sourceType === 'complaint').length;
                  const pct   = total > 0 ? ((count / total) * 100).toFixed(1) : 0;
                  return (
                    <div key={brandId} className="flex items-center gap-2.5 cursor-pointer"
                      onClick={() => setSvBrand(brandId === svBrand ? 'all' : brandId)}>
                      <span className="text-[11px] w-32 truncate text-right flex-shrink-0 text-slate-300">
                        {br?.shortName || br?.name || brandId}
                      </span>
                      <div className="flex-1 h-2 rounded-full bg-surface2 overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${pct}%`, backgroundColor: br?.color || '#f97316' }} />
                      </div>
                      <span className="text-[11px] font-bold w-6 text-right text-slate-400">{count}</span>
                    </div>
                  );
                })}
            </div>
          )}

          {/* Şikayet listesi */}
          {complaintMentions.length === 0 ? (
            <div className="card text-center py-14">
              <p className="text-sm text-muted">
                {mentions.filter(m => m.sourceType === 'complaint').length === 0
                  ? 'Şikayetvar verisi henüz çekilmedi. Sonraki poll döngüsünde (15 dk) gelecek.'
                  : 'Seçili marka için şikayet bulunamadı.'}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {complaintMentions.map(m => (
                <MentionCard key={m.id || m.url} mention={m} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ═══ RAPOR ═══════════════════════════════════════════════════════════ */}
      {activeTab === 'rapor' && (
        <div className="space-y-5">

          {/* Export */}
          <div className="card">
            <h3 className="text-sm font-semibold text-white mb-1">Dışa Aktar</h3>
            <p className="text-xs text-muted mb-4">
              {mentions.length} mention yüklü — Excel tüm mention'ları, PDF analitik özetini içerir
            </p>
            <div className="flex gap-3 flex-wrap">
              <button onClick={exportToExcel}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-success/20 border border-success/30 text-success text-sm font-medium hover:bg-success/30 transition-all">
                <Download size={14} /> Excel İndir (.xlsx)
              </button>
              <button onClick={exportToPDF}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-500/20 border border-blue-500/30 text-blue-400 text-sm font-medium hover:bg-blue-500/30 transition-all">
                <Printer size={14} /> PDF Raporu
              </button>
            </div>
            {!analytics && (
              <p className="text-[11px] text-warning mt-3">
                ⚠️ PDF için önce Analitik sekmesini aç ve Yenile'ye bas, ardından buraya dön.
              </p>
            )}
          </div>

          {/* Boolean sorgu yardımı */}
          <div className="card">
            <h3 className="text-sm font-semibold text-white mb-2">🔎 Gelişmiş Boolean Sorgu</h3>
            <p className="text-xs text-muted mb-3">
              Canlı Akış sekmesindeki arama kutusunda AND / OR / NOT operatörlerini ve tırnaklı ifadeleri kullanabilirsin.
            </p>
            <div className="space-y-2">
              {[
                { q: 'starbucks AND şikayet', desc: 'Starbucks + şikayet kelimesi birlikte geçen haberler' },
                { q: '"yeni şube" OR açılış',  desc: '"Yeni şube" tam ifadesi veya açılış geçen haberler' },
                { q: 'kahvedunyasi NOT reklam', desc: 'Kahve Dünyası haberleri, reklam içerikler hariç' },
                { q: 'fiyat OR zam OR indirim', desc: 'Fiyat, zam veya indirim geçen tüm haberler' },
              ].map(({ q, desc }) => (
                <div key={q} className="flex items-center gap-3 p-2.5 rounded-lg bg-surface2 border border-navy-border">
                  <code className="text-[11px] text-caramel font-mono flex-shrink-0">{q}</code>
                  <span className="text-[11px] text-muted">{desc}</span>
                  <button className="ml-auto text-[10px] text-muted hover:text-caramel transition-colors flex-shrink-0"
                    onClick={() => { setSearchText(q); setActiveTab('akis'); }}>
                    Uygula →
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
