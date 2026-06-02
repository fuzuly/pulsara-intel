import { useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, ScatterChart, Scatter,
} from 'recharts';
import {
  Star, RefreshCw, ExternalLink, ChevronUp, ChevronDown,
  AlertTriangle, Trophy, TrendingDown, ArrowUp, ArrowDown,
  MapPin, ChevronRight,
} from 'lucide-react';
import SectionHeader from '../components/common/SectionHeader';
import DataFreshnessBar from '../components/common/DataFreshnessBar';
import { BRANDS } from '../constants/brands';
import useBranchData from '../hooks/useBranchData';
import clsx from 'clsx';

const RATING_BUCKETS = [
  { label: '1–2',   min: 1.0, max: 2.0  },
  { label: '2–3',   min: 2.0, max: 3.0  },
  { label: '3–3.5', min: 3.0, max: 3.5  },
  { label: '3.5–4', min: 3.5, max: 4.0  },
  { label: '4–4.5', min: 4.0, max: 4.5  },
  { label: '4.5–5', min: 4.5, max: 5.01 },
];

const wScore = (rating, reviewCount) =>
  reviewCount >= 1 ? Math.round(rating * Math.log10(reviewCount + 1) * 100) / 100 : 0;

function ratingColor(r) {
  if (r >= 4.5) return '#22C55E';
  if (r >= 4.0) return '#86EFAC';
  if (r >= 3.5) return '#FCD34D';
  if (r >= 3.0) return '#FB923C';
  return '#EF4444';
}

function Stars({ rating }) {
  const full  = Math.floor(rating);
  const half  = rating - full >= 0.3 ? 1 : 0;
  const empty = 5 - full - half;
  return (
    <span className="flex items-center gap-0.5">
      {Array(full).fill(0).map((_, i) => <Star key={`f${i}`} size={11} className="text-warning fill-warning" />)}
      {half === 1 && <Star size={11} className="text-warning fill-warning opacity-50" />}
      {Array(empty).fill(0).map((_, i) => <Star key={`e${i}`} size={11} className="text-muted" />)}
    </span>
  );
}

function TrendBadge({ current, previous }) {
  if (previous == null) return <span className="text-muted text-xs">—</span>;
  const diff = Math.round((current - previous) * 10) / 10;
  if (diff > 0) return (
    <span className="flex items-center justify-center gap-0.5 text-[#22C55E] text-xs font-medium">
      <ArrowUp size={10} />+{diff}
    </span>
  );
  if (diff < 0) return (
    <span className="flex items-center justify-center gap-0.5 text-danger text-xs font-medium">
      <ArrowDown size={10} />{diff}
    </span>
  );
  return <span className="text-muted text-xs">=</span>;
}

function NoDataPanel({ error }) {
  return (
    <div className="card text-center py-14 space-y-4">
      <div className="text-5xl">🗺️</div>
      <h3 className="text-lg font-semibold text-white">Şube Verisi Henüz Toplanmadı</h3>
      {error ? (
        <p className="text-xs text-danger max-w-md mx-auto">
          Scraper API&apos;sine bağlanılamadı: <code className="text-warning">{error}</code>
          <br />Scraper sunucusunun çalıştığından emin olun.
        </p>
      ) : (
        <p className="text-xs text-muted max-w-md mx-auto leading-relaxed">
          Google Maps şube verisi henüz çekilmemiş.
        </p>
      )}
      <div className="bg-surface2 border border-navy-border rounded-xl p-5 text-left max-w-lg mx-auto space-y-3 text-xs text-muted">
        <p className="text-white font-semibold text-sm">Veriyi Almak İçin:</p>
        <ol className="space-y-2 list-decimal list-inside">
          <li>
            <a href="https://console.cloud.google.com/apis/library/places-backend.googleapis.com"
              target="_blank" rel="noopener noreferrer" className="text-caramel hover:underline">
              Google Cloud Console
            </a>{' '}→ Places API&apos;yi etkinleştir (ücretsiz $200 kredi içinde)
          </li>
          <li>
            API anahtarını{' '}
            <code className="text-white bg-navy px-1 rounded">espressolab-scraper/.env</code>
            {' '}dosyasındaki{' '}
            <code className="text-white bg-navy px-1 rounded">GOOGLE_MAPS_API_KEY=</code>
            {' '}satırına ekle
          </li>
          <li>
            Scraper sunucusu çalışıyorken tarayıcıda şu adresi aç:{' '}
            <code className="text-white bg-navy px-1 rounded">http://localhost:3001/api/branches/scrape/run</code>
            <br /><span className="text-warning">⚠️ Tarama 10–15 dakika sürer, sayfayı kapatma</span>
          </li>
          <li>Tarama bitince bu sayfayı yenile → gerçek şube verileri görünür</li>
        </ol>
      </div>
    </div>
  );
}

export default function BranchRatings() {
  const { branches, loading, error, lastUpdated, refresh } = useBranchData();

  const [selectedBrand,  setSelectedBrand]  = useState('all');
  const [selectedCity,   setSelectedCity]   = useState('all');
  const [sortKey,        setSortKey]        = useState('wScore');
  const [sortDir,        setSortDir]        = useState('desc');
  const [page,           setPage]           = useState(1);
  const [showLowPerf,    setShowLowPerf]    = useState(true);
  const [pivotOpen,      setPivotOpen]      = useState(false);
  const [gapBrand,       setGapBrand]       = useState('espressolab');
  const [selectedBucket, setSelectedBucket] = useState(null);
  const PAGE_SIZE = 50;

  const brandsWithData = useMemo(() => {
    const ids = new Set(branches.map(b => b.brandId));
    return BRANDS.filter(b => ids.has(b.id));
  }, [branches]);

  const cities = useMemo(() =>
    [...new Set(branches.map(b => b.city).filter(Boolean))].sort(),
    [branches]);

  // Düşük performans: puan < 3.5 VE yorum > 100
  const lowPerformers = useMemo(() =>
    branches
      .filter(b => b.rating < 3.5 && b.reviewCount > 100)
      .sort((a, b) => a.rating - b.rating),
    [branches]);

  // Ağırlıklı skor eklenmiş tüm şubeler
  const withWScore = useMemo(() =>
    branches.map(b => ({ ...b, wScore: wScore(b.rating, b.reviewCount) })),
    [branches]);

  // En iyi / en kötü 10 (min 10 yorum şartı)
  const ranked   = useMemo(() =>
    withWScore.filter(b => b.reviewCount >= 10).sort((a, b) => b.wScore - a.wScore),
    [withWScore]);
  const top10    = ranked.slice(0, 10);
  const bottom10 = [...ranked].sort((a, b) => a.wScore - b.wScore).slice(0, 10);

  // Marka özet istatistikleri
  const brandStats = useMemo(() =>
    BRANDS.map(brand => {
      const bs = branches.filter(b => b.brandId === brand.id);
      if (!bs.length) return null;
      const avg   = bs.reduce((s, b) => s + b.rating, 0) / bs.length;
      const avgWs = bs.map(b => wScore(b.rating, b.reviewCount)).reduce((s, v) => s + v, 0) / bs.length;
      return {
        ...brand,
        count:        bs.length,
        avg:          Math.round(avg * 10) / 10,
        min:          Math.min(...bs.map(b => b.rating)),
        max:          Math.max(...bs.map(b => b.rating)),
        avgWScore:    Math.round(avgWs * 100) / 100,
        totalReviews: bs.reduce((s, b) => s + (b.reviewCount || 0), 0),
      };
    }).filter(Boolean).sort((a, b) => {
      if (a.id === 'gloriajeans') return -1;
      if (b.id === 'gloriajeans') return 1;
      return b.avg - a.avg;
    }),
    [branches]);

  // Filtrelenmiş şubeler
  const filtered = useMemo(() => {
    let list = withWScore;
    if (selectedBrand  !== 'all') list = list.filter(b => b.brandId === selectedBrand);
    if (selectedCity   !== 'all') list = list.filter(b => b.city === selectedCity);
    if (selectedBucket !== null) {
      const { min, max } = RATING_BUCKETS[selectedBucket];
      list = list.filter(b => b.rating >= min && b.rating < max);
    }
    return list;
  }, [withWScore, selectedBrand, selectedCity, selectedBucket]);

  const sorted = useMemo(() =>
    [...filtered].sort((a, b) => {
      const va = a[sortKey] ?? 0;
      const vb = b[sortKey] ?? 0;
      if (typeof va === 'string') return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
      return sortDir === 'asc' ? va - vb : vb - va;
    }),
    [filtered, sortKey, sortDir]);

  const paginated  = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);

  // Puan dağılımı
  const distributionData = useMemo(() => {
    const source = selectedBrand === 'all' ? branches : branches.filter(b => b.brandId === selectedBrand);
    return RATING_BUCKETS.map(bucket => ({
      label: bucket.label,
      count: source.filter(b => b.rating >= bucket.min && b.rating < bucket.max).length,
    }));
  }, [branches, selectedBrand]);

  // Scatter verisi
  const scatterData = useMemo(() => {
    const source = selectedBrand === 'all'
      ? branches.filter((_, i) => i % 3 === 0)
      : branches.filter(b => b.brandId === selectedBrand);
    return source.map(b => ({
      x: b.reviewCount || 0,
      y: b.rating || 0,
      brandId: b.brandId,
      name: b.name,
      city: b.city,
    }));
  }, [branches, selectedBrand]);

  // Pivot — en yoğun 15 şehir × markalar
  const pivotData = useMemo(() => {
    const cityCount = {};
    branches.forEach(b => { if (b.city) cityCount[b.city] = (cityCount[b.city] || 0) + 1; });
    const topCities = Object.entries(cityCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 15)
      .map(([city]) => city);
    return topCities.map(city => {
      const row = { city };
      brandsWithData.forEach(brand => {
        const bs = branches.filter(b => b.city === city && b.brandId === brand.id);
        row[brand.id] = bs.length > 0
          ? { avg: Math.round(bs.reduce((s, b) => s + b.rating, 0) / bs.length * 10) / 10, count: bs.length }
          : null;
      });
      return row;
    });
  }, [branches, brandsWithData]);

  // Boşluk analizi
  const gapAnalysis = useMemo(() => {
    const brandCities = new Set(branches.filter(b => b.brandId === gapBrand).map(b => b.city).filter(Boolean));
    const allCities   = [...new Set(branches.map(b => b.city).filter(Boolean))];

    const missing = allCities
      .filter(c => !brandCities.has(c))
      .map(c => {
        const bids = [...new Set(branches.filter(b => b.city === c && b.brandId !== gapBrand).map(b => b.brandId))];
        return { city: c, competitorCount: bids.length, brands: bids };
      })
      .filter(c => c.competitorCount >= 2)
      .sort((a, b) => b.competitorCount - a.competitorCount);

    const exclusive = [...brandCities]
      .map(c => {
        const competitors = [...new Set(branches.filter(b => b.city === c && b.brandId !== gapBrand).map(b => b.brandId))];
        return { city: c, competitorCount: competitors.length };
      })
      .filter(c => c.competitorCount <= 1)
      .sort((a, b) => a.competitorCount - b.competitorCount);

    return { missing, exclusive };
  }, [branches, gapBrand]);

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
    setPage(1);
  };

  const SortIcon = ({ col }) => {
    if (sortKey !== col) return null;
    return sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 gap-3 text-muted">
        <RefreshCw size={20} className="animate-spin text-caramel" />
        <span className="text-sm">Şube verileri yükleniyor...</span>
      </div>
    );
  }

  const hasData = branches.length > 0;
  const gapBrandName = brandsWithData.find(b => b.id === gapBrand)?.name || gapBrand;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Başlık */}
      <div className="flex items-start justify-between gap-4">
        <SectionHeader
          title="Şube Google Puanları"
          subtitle={hasData
            ? `${branches.length} şube — ${brandsWithData.length} marka — Türkiye geneli gerçek veriler`
            : 'Google Maps şube bazlı puan analizi'}
        />
        {hasData && (
          <button onClick={refresh} className="btn-secondary text-xs flex-shrink-0 flex items-center gap-1.5">
            <RefreshCw size={13} /> Yenile
          </button>
        )}
      </div>

      {lastUpdated && (
        <DataFreshnessBar sources={[{ label: 'Google Maps Places API' }]} interval={3600_000} />
      )}

      {!hasData ? (
        <NoDataPanel error={error} />
      ) : (
        <>
          {/* ── Düşük Performans Alarmı ── */}
          {lowPerformers.length > 0 && (
            <div className="card border border-danger/30 bg-danger/5">
              <button
                className="flex items-center justify-between w-full"
                onClick={() => setShowLowPerf(v => !v)}
              >
                <div className="flex items-center gap-2">
                  <AlertTriangle size={15} className="text-danger" />
                  <span className="text-sm font-semibold text-white">Düşük Performans Alarmı</span>
                  <span className="bg-danger/20 text-danger text-xs px-2 py-0.5 rounded-full font-semibold">
                    {lowPerformers.length} şube
                  </span>
                </div>
                {showLowPerf ? <ChevronUp size={15} className="text-muted" /> : <ChevronDown size={15} className="text-muted" />}
              </button>
              <p className="text-[11px] text-muted mt-1">
                Puan &lt; 3.5 <strong>ve</strong> yorum sayısı &gt; 100 — gerçek müşteri şikayeti riski taşıyan şubeler
              </p>
              {showLowPerf && (
                <div className="mt-3 space-y-1 max-h-52 overflow-y-auto pr-1">
                  {lowPerformers.map(b => {
                    const brand = BRANDS.find(br => br.id === b.brandId);
                    return (
                      <div key={b.placeId} className="flex items-center gap-3 py-1.5 px-2 rounded bg-surface2">
                        <div
                          className="w-5 h-5 rounded text-[8px] font-bold text-white flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: brand?.color || '#8B9BB4' }}
                        >
                          {(brand?.shortName || '?').slice(0, 2)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-white truncate">{b.name}</p>
                          <p className="text-[10px] text-muted">{b.city}</p>
                        </div>
                        <span className="text-sm font-bold flex-shrink-0" style={{ color: ratingColor(b.rating) }}>
                          {b.rating?.toFixed(1)}
                        </span>
                        <span className="text-xs text-muted flex-shrink-0">
                          {b.reviewCount?.toLocaleString('tr-TR')} yorum
                        </span>
                        {b.mapsUrl && (
                          <a href={b.mapsUrl} target="_blank" rel="noopener noreferrer" className="text-caramel hover:opacity-80 flex-shrink-0">
                            <ExternalLink size={12} />
                          </a>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ── Marka Özet Kartları ── */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
            {brandStats.slice(0, 10).map(b => (
              <button
                key={b.id}
                onClick={() => { setSelectedBrand(b.id === selectedBrand ? 'all' : b.id); setPage(1); }}
                className={clsx('card-hover text-left p-3 transition-all', selectedBrand === b.id && 'ring-1 ring-caramel')}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-6 h-6 rounded flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0"
                    style={{ backgroundColor: b.color }}
                  >
                    {b.shortName.slice(0, 2)}
                  </div>
                  <span className="text-xs font-semibold text-white truncate">{b.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-lg font-bold" style={{ color: ratingColor(b.avg) }}>{b.avg.toFixed(1)}</span>
                  <Stars rating={b.avg} />
                </div>
                <p className="text-[10px] text-muted mt-0.5">{b.count} şube · min {b.min} / max {b.max}</p>
                <p className="text-[10px] text-muted mt-0.5">
                  Ağ. skor: <span className="text-caramel font-medium">{b.avgWScore.toFixed(2)}</span>
                </p>
              </button>
            ))}
          </div>

          {/* ── Filtreler ── */}
          <div className="card flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-muted font-medium">Marka:</span>
              <button
                onClick={() => { setSelectedBrand('all'); setPage(1); }}
                className={clsx('btn text-xs', selectedBrand === 'all' ? 'btn-primary' : 'btn-secondary')}
              >
                Tümü ({branches.length})
              </button>
              {brandsWithData.map(b => (
                <button
                  key={b.id}
                  onClick={() => { setSelectedBrand(b.id); setPage(1); }}
                  className={clsx('btn text-xs transition-all', selectedBrand === b.id ? 'text-white border' : 'btn-secondary')}
                  style={selectedBrand === b.id ? { backgroundColor: `${b.color}20`, borderColor: b.color, color: b.color } : {}}
                >
                  {b.shortName}
                </button>
              ))}
            </div>
            {cities.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted font-medium">Şehir:</span>
                <select
                  value={selectedCity}
                  onChange={e => { setSelectedCity(e.target.value); setPage(1); }}
                  className="bg-surface2 border border-navy-border text-white text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-caramel"
                >
                  <option value="all">Tüm Şehirler</option>
                  {cities.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            )}
            <div className="ml-auto text-xs text-muted flex items-center gap-2">
              {selectedBucket !== null && (
                <span className="text-caramel font-medium">
                  {RATING_BUCKETS[selectedBucket].label} puan ·
                </span>
              )}
              <span><span className="text-white font-semibold">{filtered.length}</span> şube</span>
            </div>
          </div>

          {/* ── En İyi / En Kötü 10 ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="card">
              <div className="flex items-center gap-2 mb-3">
                <Trophy size={15} className="text-warning" />
                <h3 className="text-sm font-semibold text-white">En İyi 10 Şube</h3>
                <span className="text-[10px] text-muted ml-auto">Puan × log(Yorum)</span>
              </div>
              <div className="space-y-1">
                {top10.map((b, i) => {
                  const brand = BRANDS.find(br => br.id === b.brandId);
                  return (
                    <div key={b.placeId} className="flex items-center gap-2 py-1">
                      <span className="text-[11px] text-muted w-4 text-right flex-shrink-0">{i + 1}</span>
                      <div
                        className="w-4 h-4 rounded text-[7px] font-bold text-white flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: brand?.color || '#8B9BB4' }}
                      >
                        {(brand?.shortName || '?').slice(0, 2)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-white truncate">{b.name}</p>
                        <p className="text-[10px] text-muted">{b.city} · {b.reviewCount?.toLocaleString('tr-TR')} yorum</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-xs font-bold" style={{ color: ratingColor(b.rating) }}>{b.rating?.toFixed(1)}</p>
                        <p className="text-[10px] text-caramel">{b.wScore.toFixed(2)}</p>
                      </div>
                      {b.mapsUrl && (
                        <a href={b.mapsUrl} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-caramel flex-shrink-0">
                          <ExternalLink size={11} />
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="card border border-danger/20">
              <div className="flex items-center gap-2 mb-3">
                <TrendingDown size={15} className="text-danger" />
                <h3 className="text-sm font-semibold text-white">En Düşük 10 Şube</h3>
                <span className="text-[10px] text-muted ml-auto">min 10 yorum filtreli</span>
              </div>
              <div className="space-y-1">
                {bottom10.map((b, i) => {
                  const brand = BRANDS.find(br => br.id === b.brandId);
                  return (
                    <div key={b.placeId} className="flex items-center gap-2 py-1">
                      <span className="text-[11px] text-muted w-4 text-right flex-shrink-0">{i + 1}</span>
                      <div
                        className="w-4 h-4 rounded text-[7px] font-bold text-white flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: brand?.color || '#8B9BB4' }}
                      >
                        {(brand?.shortName || '?').slice(0, 2)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-white truncate">{b.name}</p>
                        <p className="text-[10px] text-muted">{b.city} · {b.reviewCount?.toLocaleString('tr-TR')} yorum</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-xs font-bold" style={{ color: ratingColor(b.rating) }}>{b.rating?.toFixed(1)}</p>
                        <p className="text-[10px] text-danger">{b.wScore.toFixed(2)}</p>
                      </div>
                      {b.mapsUrl && (
                        <a href={b.mapsUrl} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-caramel flex-shrink-0">
                          <ExternalLink size={11} />
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── Puan Dağılımı + Scatter ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="card">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-semibold text-white">Puan Dağılımı</h3>
                {selectedBucket !== null && (
                  <button
                    onClick={() => { setSelectedBucket(null); setPage(1); }}
                    className="text-[10px] text-caramel hover:underline flex items-center gap-1"
                  >
                    ✕ {RATING_BUCKETS[selectedBucket].label} filtresi kaldır
                  </button>
                )}
              </div>
              <p className="text-xs text-muted mb-4">
                Bar&apos;a tıkla → o puan aralığındaki şubeleri aşağıda görüntüle
              </p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart
                  data={distributionData}
                  margin={{ left: 0, right: 10 }}
                  style={{ cursor: 'pointer' }}
                  onClick={(chartData) => {
                    if (!chartData || typeof chartData.activeTooltipIndex !== 'number') return;
                    const idx = chartData.activeTooltipIndex;
                    setSelectedBucket(prev => prev === idx ? null : idx);
                    setPage(1);
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#2A3A55" />
                  <XAxis dataKey="label" tick={{ fill: '#8B9BB4', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#8B9BB4', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      return (
                        <div className="bg-surface border border-navy-border rounded-lg px-3 py-2 shadow-xl">
                          <p className="text-xs text-white font-semibold">{payload[0].payload.label} puan</p>
                          <p className="text-xs text-caramel">{payload[0].value} şube</p>
                          <p className="text-[10px] text-muted mt-0.5">Tıkla → listele</p>
                        </div>
                      );
                    }}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {distributionData.map((_, i) => {
                      const mid      = (RATING_BUCKETS[i].min + RATING_BUCKETS[i].max) / 2;
                      const isActive = selectedBucket === null || selectedBucket === i;
                      return (
                        <Cell
                          key={i}
                          fill={ratingColor(mid)}
                          fillOpacity={isActive ? 1 : 0.25}
                          stroke={selectedBucket === i ? '#fff' : 'none'}
                          strokeWidth={selectedBucket === i ? 1.5 : 0}
                        />
                      );
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="card">
              <h3 className="text-sm font-semibold text-white mb-1">Yorum Sayısı vs Puan</h3>
              <p className="text-xs text-muted mb-4">
                Her nokta bir şube — popülerlik / kalite ilişkisi
                {selectedBrand === 'all' && <span className="ml-1">(örneklenmiş, marka seçerek tam ver)</span>}
              </p>
              <ResponsiveContainer width="100%" height={200}>
                <ScatterChart margin={{ left: -10, right: 10, top: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2A3A55" />
                  <XAxis
                    type="number" dataKey="x" name="Yorumlar"
                    tick={{ fill: '#8B9BB4', fontSize: 10 }} axisLine={false} tickLine={false}
                    tickFormatter={v => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}
                  />
                  <YAxis
                    type="number" dataKey="y" name="Puan" domain={[1, 5]}
                    tick={{ fill: '#8B9BB4', fontSize: 10 }} axisLine={false} tickLine={false}
                  />
                  <Tooltip
                    cursor={{ strokeDasharray: '3 3', stroke: '#2A3A55' }}
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const d = payload[0]?.payload;
                      const brand = BRANDS.find(b => b.id === d?.brandId);
                      return (
                        <div className="bg-surface border border-navy-border rounded-lg px-3 py-2 shadow-xl max-w-[180px]">
                          <p className="text-xs text-white font-semibold truncate">{d?.name}</p>
                          <p className="text-[10px] text-muted">{brand?.name} · {d?.city}</p>
                          <p className="text-xs text-caramel">{d?.y?.toFixed(1)} ⭐ · {d?.x?.toLocaleString('tr-TR')} yorum</p>
                        </div>
                      );
                    }}
                  />
                  <Scatter
                    data={scatterData}
                    shape={(props) => {
                      const { cx, cy, payload } = props;
                      const brand = BRANDS.find(b => b.id === payload.brandId);
                      return (
                        <circle cx={cx} cy={cy} r={3.5}
                          fill={brand?.color || '#8B9BB4'} fillOpacity={0.65} stroke="none" />
                      );
                    }}
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ── Boşluk Analizi ── */}
          <div className="card">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <div>
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <MapPin size={14} className="text-caramel" />
                  Boşluk Analizi
                </h3>
                <p className="text-xs text-muted mt-0.5">Hangi şehirde kim var, kim yok?</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted">Referans marka:</span>
                <select
                  value={gapBrand} onChange={e => setGapBrand(e.target.value)}
                  className="bg-surface2 border border-navy-border text-white text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-caramel"
                >
                  {brandsWithData.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold text-danger mb-2 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-danger inline-block flex-shrink-0" />
                  Rakipler var, {gapBrandName} yok
                  <span className="text-muted font-normal">({gapAnalysis.missing.length} şehir)</span>
                </p>
                <div className="space-y-1 max-h-52 overflow-y-auto pr-1">
                  {gapAnalysis.missing.slice(0, 25).map(({ city, competitorCount, brands: bids }) => (
                    <div key={city} className="flex items-center justify-between py-1.5 px-2 rounded bg-surface2 gap-2">
                      <span className="text-xs text-white flex-shrink-0">{city}</span>
                      <div className="flex items-center gap-1.5 flex-wrap justify-end">
                        <div className="flex gap-0.5">
                          {bids.slice(0, 6).map(bid => {
                            const br = BRANDS.find(b => b.id === bid);
                            return (
                              <div key={bid}
                                className="w-4 h-4 rounded text-[7px] font-bold text-white flex items-center justify-center"
                                style={{ backgroundColor: br?.color || '#8B9BB4' }} title={br?.name || bid}
                              >
                                {(br?.shortName || bid).slice(0, 2)}
                              </div>
                            );
                          })}
                          {bids.length > 6 && <span className="text-[10px] text-muted">+{bids.length - 6}</span>}
                        </div>
                        <span className="text-[10px] text-muted">{competitorCount} rakip</span>
                      </div>
                    </div>
                  ))}
                  {gapAnalysis.missing.length === 0 && (
                    <p className="text-xs text-muted py-2">Rakiplerin bulunduğu tüm şehirlerde mevcut.</p>
                  )}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#22C55E] mb-2 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#22C55E] inline-block flex-shrink-0" />
                  {gapBrandName} var, rakip az
                  <span className="text-muted font-normal">({gapAnalysis.exclusive.length} şehir)</span>
                </p>
                <div className="space-y-1 max-h-52 overflow-y-auto pr-1">
                  {gapAnalysis.exclusive.slice(0, 25).map(({ city, competitorCount }) => (
                    <div key={city} className="flex items-center justify-between py-1.5 px-2 rounded bg-surface2">
                      <span className="text-xs text-white">{city}</span>
                      <span className="text-[10px] text-muted">
                        {competitorCount === 0 ? 'Rakip yok' : `${competitorCount} rakip`}
                      </span>
                    </div>
                  ))}
                  {gapAnalysis.exclusive.length === 0 && (
                    <p className="text-xs text-muted py-2">Rakipsiz şehir bulunmuyor.</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ── Pivot Tablosu ── */}
          <div className="card">
            <button
              className="flex items-center justify-between w-full text-left"
              onClick={() => setPivotOpen(v => !v)}
            >
              <div>
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <ChevronRight size={14} className={clsx('text-caramel transition-transform duration-200', pivotOpen && 'rotate-90')} />
                  Şehir × Marka Pivot Tablosu
                </h3>
                <p className="text-xs text-muted mt-0.5 ml-5">En yoğun 15 şehir — marka başına ortalama puan ve şube sayısı</p>
              </div>
            </button>
            {pivotOpen && (
              <div className="mt-4 overflow-x-auto">
                <table className="text-xs whitespace-nowrap min-w-full">
                  <thead>
                    <tr className="border-b border-navy-border">
                      <th className="table-header py-2 px-3 text-left min-w-[100px]">Şehir</th>
                      {brandsWithData.map(b => (
                        <th key={b.id} className="table-header py-2 px-2 text-center">
                          <div
                            className="w-5 h-5 rounded text-[7px] font-bold text-white flex items-center justify-center mx-auto"
                            style={{ backgroundColor: b.color }} title={b.name}
                          >
                            {b.shortName.slice(0, 2)}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {pivotData.map(row => (
                      <tr key={row.city} className="table-row">
                        <td className="table-cell py-1.5 px-3 font-medium text-white">{row.city}</td>
                        {brandsWithData.map(b => {
                          const cell = row[b.id];
                          return (
                            <td key={b.id} className="table-cell py-1.5 px-2 text-center">
                              {cell ? (
                                <span>
                                  <span className="font-bold" style={{ color: ratingColor(cell.avg) }}>{cell.avg.toFixed(1)}</span>
                                  <span className="text-muted text-[10px] ml-0.5">({cell.count})</span>
                                </span>
                              ) : (
                                <span className="text-muted opacity-25">—</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* ── Şube Listesi ── */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">
                Şube Listesi
                <span className="text-muted font-normal ml-2">(sayfa {page}/{totalPages || 1})</span>
              </h3>
              <p className="text-[10px] text-muted">Her satırdaki Google Maps bağlantısı gerçek şubeye açılır</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-navy-border">
                    <th className="table-header py-2 px-3 text-left">Marka</th>
                    <th className="table-header py-2 px-3 text-left cursor-pointer hover:text-white select-none" onClick={() => handleSort('name')}>
                      <span className="flex items-center gap-1">Şube Adı <SortIcon col="name" /></span>
                    </th>
                    <th className="table-header py-2 px-3 text-left cursor-pointer hover:text-white select-none" onClick={() => handleSort('city')}>
                      <span className="flex items-center gap-1">Şehir <SortIcon col="city" /></span>
                    </th>
                    <th className="table-header py-2 px-3 text-center cursor-pointer hover:text-white select-none" onClick={() => handleSort('rating')}>
                      <span className="flex items-center justify-center gap-1">Puan <SortIcon col="rating" /></span>
                    </th>
                    <th className="table-header py-2 px-3 text-right cursor-pointer hover:text-white select-none" onClick={() => handleSort('reviewCount')}>
                      <span className="flex items-center justify-end gap-1">Yorumlar <SortIcon col="reviewCount" /></span>
                    </th>
                    <th className="table-header py-2 px-3 text-right cursor-pointer hover:text-white select-none" onClick={() => handleSort('wScore')}>
                      <span className="flex items-center justify-end gap-1">Ağ. Skor <SortIcon col="wScore" /></span>
                    </th>
                    <th className="table-header py-2 px-3 text-center">Trend</th>
                    <th className="table-header py-2 px-3 text-center">Maps</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map(branch => {
                    const brand     = BRANDS.find(b => b.id === branch.brandId);
                    const isLowPerf = branch.rating < 3.5 && branch.reviewCount > 100;
                    return (
                      <tr key={branch.placeId} className={clsx('table-row', isLowPerf && 'bg-danger/5')}>
                        <td className="table-cell py-2 px-3">
                          <div className="flex items-center gap-1.5">
                            <div
                              className="w-5 h-5 rounded flex items-center justify-center text-[8px] font-bold text-white flex-shrink-0"
                              style={{ backgroundColor: brand?.color || '#8B9BB4' }}
                            >
                              {(brand?.shortName || '?').slice(0, 2)}
                            </div>
                            <span className="text-xs text-muted">{brand?.name || branch.brandId}</span>
                          </div>
                        </td>
                        <td className="table-cell py-2 px-3">
                          <span className="text-xs text-white">{branch.name}</span>
                          {branch.address && (
                            <p className="text-[10px] text-muted truncate max-w-[200px]">{branch.address}</p>
                          )}
                          {isLowPerf && (
                            <span className="inline-flex items-center gap-0.5 text-[9px] text-danger mt-0.5">
                              <AlertTriangle size={9} /> Düşük performans
                            </span>
                          )}
                        </td>
                        <td className="table-cell py-2 px-3">
                          <span className="text-xs text-muted">{branch.city || '—'}</span>
                        </td>
                        <td className="table-cell py-2 px-3 text-center">
                          <div className="flex flex-col items-center gap-0.5">
                            <span className="text-sm font-bold" style={{ color: ratingColor(branch.rating) }}>
                              {branch.rating?.toFixed(1) ?? '—'}
                            </span>
                            <Stars rating={branch.rating || 0} />
                          </div>
                        </td>
                        <td className="table-cell py-2 px-3 text-right">
                          <span className="text-xs text-muted">{branch.reviewCount?.toLocaleString('tr-TR') ?? '—'}</span>
                        </td>
                        <td className="table-cell py-2 px-3 text-right">
                          <span className="text-xs font-medium text-caramel">{branch.wScore?.toFixed(2) ?? '—'}</span>
                        </td>
                        <td className="table-cell py-2 px-3 text-center">
                          <TrendBadge current={branch.rating} previous={branch.previousRating} />
                        </td>
                        <td className="table-cell py-2 px-3 text-center">
                          {branch.mapsUrl ? (
                            <a href={branch.mapsUrl} target="_blank" rel="noopener noreferrer"
                              className="inline-flex items-center text-caramel hover:opacity-80">
                              <ExternalLink size={12} />
                            </a>
                          ) : '—'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-navy-border">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="btn-secondary text-xs disabled:opacity-40">← Önceki</button>
                <span className="text-xs text-muted">{page} / {totalPages}</span>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  className="btn-secondary text-xs disabled:opacity-40">Sonraki →</button>
              </div>
            )}
          </div>

          <p className="text-[11px] text-muted text-center">
            Veriler Google Maps Places API&apos;sinden çekilmektedir. Son güncelleme:{' '}
            {lastUpdated?.toLocaleString('tr-TR') ?? '—'}
          </p>
        </>
      )}
    </div>
  );
}
