import { useState, useRef, useEffect } from 'react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { X, Plus, Search, RefreshCw, Newspaper, Share2, Building2 } from 'lucide-react';
import { BRANDS, BRAND_MAP } from '../constants/brands';
import useBrandComparison from '../hooks/useBrandComparison';

const SOURCE_LABELS = { news: 'Google Haber', tr_news: 'TR Haber', reddit: 'Reddit', gdelt: 'GDELT' };
const SOURCE_COLORS = { news: '#4ade80', tr_news: '#60a5fa', reddit: '#fb923c', gdelt: '#a78bfa' };
const TABS = [
  { id: 'mentions',    label: 'Medya Bahsi',   icon: Newspaper },
  { id: 'social',      label: 'Sosyal Medya',  icon: Share2 },
  { id: 'operations',  label: 'Operasyonel',   icon: Building2 },
];

function timeAgo(dateStr) {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const d = Math.floor(diff / 86400000);
  const h = Math.floor(diff / 3600000);
  const m = Math.floor(diff / 60000);
  if (d > 0) return `${d}g önce`;
  if (h > 0) return `${h}s önce`;
  return `${m}d önce`;
}

const SENTIMENT_COLOR = { positive: '#4ade80', negative: '#f87171', neutral: '#94a3b8' };

/* ── Marka seçici chip ──────────────────────────────────────────────────── */
function BrandChip({ brand, onRemove }) {
  return (
    <span
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium"
      style={{ background: brand.color + '22', color: brand.color, border: `1px solid ${brand.color}55` }}
    >
      {brand.shortName} — {brand.name}
      <button onClick={() => onRemove(brand.id)} className="hover:opacity-70 ml-0.5">
        <X size={13} />
      </button>
    </span>
  );
}

/* ── Share of Voice pasta grafik ────────────────────────────────────────── */
function ShareOfVoiceChart({ brandIds, shareOfVoice }) {
  const data = brandIds
    .filter(id => BRAND_MAP[id])
    .map(id => ({ name: BRAND_MAP[id].shortName, value: shareOfVoice[id] || 0, color: BRAND_MAP[id].color }));

  if (data.every(d => d.value === 0)) {
    return <div className="flex items-center justify-center h-48 text-muted text-sm">Veri yok</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} label={({ name, value }) => `${name} ${value}%`} labelLine={false}>
          {data.map((d, i) => <Cell key={i} fill={d.color} />)}
        </Pie>
        <Tooltip formatter={(v) => `${v}%`} />
      </PieChart>
    </ResponsiveContainer>
  );
}

/* ── Mention sayısı yatay bar ───────────────────────────────────────────── */
function MentionCountChart({ brandIds, brands }) {
  const data = brandIds.filter(id => BRAND_MAP[id]).map(id => ({
    name: BRAND_MAP[id].shortName,
    count: brands[id]?.count || 0,
    fill: BRAND_MAP[id].color,
  }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} layout="vertical" margin={{ left: 10, right: 30 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e2a3a" horizontal={false} />
        <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 11 }} />
        <YAxis type="category" dataKey="name" tick={{ fill: '#cbd5e1', fontSize: 12 }} width={36} />
        <Tooltip contentStyle={{ background: '#0f1923', border: '1px solid #1e2a3a', borderRadius: 8 }} />
        <Bar dataKey="count" name="Mention" radius={[0, 4, 4, 0]}>
          {data.map((d, i) => <Cell key={i} fill={d.fill} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

/* ── Sentiment grouped bar ──────────────────────────────────────────────── */
function SentimentChart({ brandIds, brands }) {
  const data = brandIds.filter(id => BRAND_MAP[id]).map(id => ({
    name: BRAND_MAP[id].shortName,
    Olumlu:  brands[id]?.sentiment?.positive || 0,
    Olumsuz: brands[id]?.sentiment?.negative || 0,
    Nötr:    brands[id]?.sentiment?.neutral  || 0,
  }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ left: 0, right: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e2a3a" />
        <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
        <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} allowDecimals={false} />
        <Tooltip contentStyle={{ background: '#0f1923', border: '1px solid #1e2a3a', borderRadius: 8 }} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="Olumlu"  fill="#4ade80" radius={[3, 3, 0, 0]} />
        <Bar dataKey="Olumsuz" fill="#f87171" radius={[3, 3, 0, 0]} />
        <Bar dataKey="Nötr"    fill="#64748b" radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

/* ── Sosyal medya takipçi karşılaştırma ────────────────────────────────── */
function SocialChart({ socialRows, platform, dataKey, label }) {
  const data = socialRows
    .filter(r => r.social?.[platform])
    .map(r => ({
      name: r.brand?.shortName || r.id,
      value: r.social[platform][dataKey] || 0,
      fill: r.brand?.color || '#64748b',
    }));

  if (!data.length) return <div className="text-muted text-sm text-center py-4">Veri yok</div>;

  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={data} layout="vertical" margin={{ left: 10, right: 40 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e2a3a" horizontal={false} />
        <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 10 }}
          tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}K` : v} />
        <YAxis type="category" dataKey="name" tick={{ fill: '#cbd5e1', fontSize: 11 }} width={36} />
        <Tooltip
          formatter={v => [v >= 1000 ? `${(v/1000).toFixed(1)}K` : v, label]}
          contentStyle={{ background: '#0f1923', border: '1px solid #1e2a3a', borderRadius: 8 }}
        />
        <Bar dataKey="value" radius={[0, 4, 4, 0]}>
          {data.map((d, i) => <Cell key={i} fill={d.fill} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

/* ── Operasyonel bar ────────────────────────────────────────────────────── */
function OpChart({ brands, dataKey, label, formatter }) {
  const data = brands.map(b => ({ name: b.shortName, value: b[dataKey] || 0, fill: b.color }));
  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={data} layout="vertical" margin={{ left: 10, right: 50 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e2a3a" horizontal={false} />
        <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 10 }} tickFormatter={formatter} />
        <YAxis type="category" dataKey="name" tick={{ fill: '#cbd5e1', fontSize: 11 }} width={36} />
        <Tooltip formatter={v => [formatter(v), label]}
          contentStyle={{ background: '#0f1923', border: '1px solid #1e2a3a', borderRadius: 8 }} />
        <Bar dataKey="value" radius={[0, 4, 4, 0]}>
          {data.map((d, i) => <Cell key={i} fill={d.fill} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

/* ── Ana sayfa ──────────────────────────────────────────────────────────── */
export default function BrandComparison() {
  const [selectedIds, setSelectedIds] = useState([]);
  const [keyword, setKeyword]         = useState('');
  const [pickerOpen, setPickerOpen]   = useState(false);
  const [search, setSearch]           = useState('');
  const [activeTab, setActiveTab]     = useState('mentions');
  const { compare, mentionData, loading, error, getSocialData, getOperationalData } = useBrandComparison();
  const pickerRef = useRef(null);
  useEffect(() => {
    function handleClick(e) { if (pickerRef.current && !pickerRef.current.contains(e.target)) setPickerOpen(false); }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const availableBrands = BRANDS.filter(b => !selectedIds.includes(b.id));
  const filtered = availableBrands.filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.shortName.toLowerCase().includes(search.toLowerCase())
  );

  const addBrand = (id) => {
    if (selectedIds.length >= 4) return;
    setSelectedIds(prev => [...prev, id]);
    setPickerOpen(false);
    setSearch('');
  };
  const removeBrand = (id) => setSelectedIds(prev => prev.filter(x => x !== id));

  const handleCompare = () => compare(selectedIds, keyword);

  const socialRows = getSocialData(selectedIds);
  const opBrands   = getOperationalData(selectedIds);

  const brandData   = mentionData?.brands || {};
  const sov         = mentionData?.shareOfVoice || {};

  return (
    <div className="space-y-5">
      {/* Başlık */}
      <div>
        <h1 className="text-2xl font-bold text-white">Marka Karşılaştırma</h1>
        <p className="text-muted text-sm mt-1">Brand24 tarzı — markalar arası medya, sosyal medya ve operasyonel kıyaslama</p>
      </div>

      {/* Seçici panel */}
      <div className="card p-4 space-y-3">
        {/* Seçili markalar */}
        <div className="flex flex-wrap gap-2 items-center">
          {selectedIds.map(id => BRAND_MAP[id] && (
            <BrandChip key={id} brand={BRAND_MAP[id]} onRemove={removeBrand} />
          ))}
          {selectedIds.length < 4 && (
            <div className="relative" ref={pickerRef}>
              <button
                onClick={() => setPickerOpen(p => !p)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-dashed border-navy-border text-muted hover:text-white hover:border-brand-gold transition-colors text-sm"
              >
                <Plus size={14} /> Marka Ekle
              </button>
              {pickerOpen && (
                <div className="absolute top-9 left-0 z-[9999] w-72 rounded-xl shadow-2xl p-2 border border-navy-border" style={{ background: "#0d1b2a" }}>
                  <div className="flex items-center gap-2 px-2 py-1.5 mb-1 rounded-lg" style={{ background: "#162032", border: "1px solid #19263a" }}>
                    <Search size={13} className="text-muted" />
                    <input
                      autoFocus
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      placeholder="Marka ara..."
                      className="bg-transparent text-sm text-white outline-none w-full placeholder-muted"
                    />
                  </div>
                  <div className="max-h-52 overflow-y-auto space-y-0.5">
                    {filtered.map(b => (
                      <button
                        key={b.id}
                        onClick={() => addBrand(b.id)}
                        className="w-full text-left flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-[#1a2640] transition-colors"
                      >
                        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: b.color }} />
                        <span className="text-sm text-white">{b.name}</span>
                        <span className="text-xs text-muted ml-auto">{b.shortName}</span>
                      </button>
                    ))}
                    {!filtered.length && <p className="text-muted text-xs text-center py-3">Bulunamadı</p>}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Keyword + Kıyasla */}
        <div className="flex gap-2 items-center">
          <div className="flex items-center gap-2 flex-1 bg-[#111c2e] border border-navy-border rounded-lg px-3 py-2">
            <Search size={14} className="text-muted" />
            <input
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCompare()}
              placeholder="Kelime filtresi — örn: fiyat, kampanya, şikayet (boş bırakırsan tüm mentionlar)"
              className="bg-transparent text-sm text-white outline-none w-full placeholder-muted"
            />
            {keyword && (
              <button onClick={() => setKeyword('')} className="text-muted hover:text-white">
                <X size={13} />
              </button>
            )}
          </div>
          <button
            onClick={handleCompare}
            disabled={selectedIds.length < 2 || loading}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-brand-gold text-black font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-40"
          >
            {loading ? <RefreshCw size={14} className="animate-spin" /> : <RefreshCw size={14} />}
            Kıyasla
          </button>
        </div>

        {selectedIds.length < 2 && (
          <p className="text-xs text-amber-400">En az 2 marka seçin</p>
        )}
      </div>

      {/* Tab navigasyon */}
      <div className="flex gap-1 border-b border-navy-border">
        {TABS.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-brand-gold text-brand-gold'
                  : 'border-transparent text-muted hover:text-white'
              }`}
            >
              <Icon size={14} /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── TAB: Medya Bahsi ─────────────────────────────────────────────── */}
      {activeTab === 'mentions' && (
        <div className="space-y-5">
          {error && (
            <div className="card p-4 border border-red-500/30 text-red-400 text-sm">{error}</div>
          )}

          {!mentionData && !loading && !error && (
            <div className="card p-12 text-center text-muted">
              <p className="text-4xl mb-3">📊</p>
              <p className="font-medium text-white mb-1">Karşılaştırma başlatılmadı</p>
              <p className="text-sm">Markaları seçip "Kıyasla" butonuna basın</p>
            </div>
          )}

          {loading && (
            <div className="card p-12 text-center text-muted">
              <RefreshCw size={28} className="animate-spin mx-auto mb-3 text-brand-gold" />
              <p className="text-sm">Veriler yükleniyor...</p>
            </div>
          )}

          {mentionData && !loading && (
            <>
              {/* Üst metrikler: SOV + Mention + Sentiment */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="card p-4">
                  <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">
                    Share of Voice
                  </h3>
                  <ShareOfVoiceChart brandIds={selectedIds} shareOfVoice={sov} />
                  {/* Legend */}
                  <div className="flex flex-wrap gap-2 mt-2 justify-center">
                    {selectedIds.filter(id => BRAND_MAP[id]).map(id => (
                      <span key={id} className="flex items-center gap-1 text-xs text-muted">
                        <span className="w-2 h-2 rounded-full" style={{ background: BRAND_MAP[id].color }} />
                        {BRAND_MAP[id].shortName}: <span className="text-white font-medium">{sov[id] ?? 0}%</span>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="card p-4">
                  <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">
                    Mention Sayısı {keyword && <span className="text-brand-gold">· "{keyword}"</span>}
                  </h3>
                  <MentionCountChart brandIds={selectedIds} brands={brandData} />
                  <p className="text-center text-xs text-muted mt-2">
                    Toplam: <span className="text-white font-medium">{mentionData.total}</span> mention
                  </p>
                </div>

                <div className="card p-4">
                  <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">
                    Sentiment Dağılımı
                  </h3>
                  <SentimentChart brandIds={selectedIds} brands={brandData} />
                </div>
              </div>

              {/* Kaynak dağılımı */}
              <div className="card p-4">
                <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-4">
                  Kaynak Dağılımı
                </h3>
                <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${selectedIds.length}, 1fr)` }}>
                  {selectedIds.filter(id => BRAND_MAP[id]).map(id => {
                    const b = BRAND_MAP[id];
                    const bySrc = brandData[id]?.bySource || {};
                    const total = brandData[id]?.count || 0;
                    return (
                      <div key={id}>
                        <p className="text-sm font-semibold mb-2" style={{ color: b.color }}>{b.name}</p>
                        {Object.keys(SOURCE_LABELS).map(src => {
                          const cnt = bySrc[src] || 0;
                          const pct = total > 0 ? Math.round((cnt / total) * 100) : 0;
                          return (
                            <div key={src} className="mb-1.5">
                              <div className="flex justify-between text-xs mb-0.5">
                                <span className="text-muted">{SOURCE_LABELS[src]}</span>
                                <span className="text-white">{cnt}</span>
                              </div>
                              <div className="h-1.5 bg-navy-hover rounded-full overflow-hidden">
                                <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: SOURCE_COLORS[src] }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Yan yana son haberler */}
              <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${Math.min(selectedIds.length, 2)}, 1fr)` }}>
                {selectedIds.filter(id => BRAND_MAP[id]).map(id => {
                  const b    = BRAND_MAP[id];
                  const ments = brandData[id]?.recentMentions || [];
                  return (
                    <div key={id} className="card p-4">
                      <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: b.color }} />
                        {b.name}
                        <span className="text-xs text-muted font-normal ml-auto">{ments.length} haber</span>
                      </h3>
                      {ments.length === 0 ? (
                        <p className="text-muted text-xs text-center py-6">
                          {keyword ? `"${keyword}" için haber bulunamadı` : 'Henüz mention yok'}
                        </p>
                      ) : (
                        <div className="space-y-2 max-h-80 overflow-y-auto">
                          {ments.map((m, i) => (
                            <a
                              key={i}
                              href={m.url}
                              target="_blank"
                              rel="noreferrer"
                              className="block p-2.5 rounded-lg bg-navy-hover hover:bg-navy-border transition-colors"
                            >
                              <div className="flex items-center gap-1.5 mb-1">
                                <span
                                  className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                                  style={{ background: SENTIMENT_COLOR[m.sentiment] + '22', color: SENTIMENT_COLOR[m.sentiment] }}
                                >
                                  {m.sentiment === 'positive' ? '😊' : m.sentiment === 'negative' ? '😟' : '😐'}
                                </span>
                                <span className="text-[10px] text-muted">{SOURCE_LABELS[m.sourceType] || m.sourceType}</span>
                                <span className="text-[10px] text-muted ml-auto">{timeAgo(m.publishedAt)}</span>
                              </div>
                              <p className="text-xs text-white leading-snug line-clamp-2">{m.title}</p>
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}

      {/* ── TAB: Sosyal Medya ────────────────────────────────────────────── */}
      {activeTab === 'social' && (
        <div className="space-y-4">
          {/* Özet tablo */}
          <div className="card p-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-navy-border">
                  <th className="text-left text-muted text-xs font-semibold py-2 pr-4">Platform</th>
                  {socialRows.map(r => (
                    <th key={r.id} className="text-right text-xs font-semibold py-2 px-3" style={{ color: r.brand?.color }}>
                      {r.brand?.shortName}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-border/50">
                {[
                  { key: 'instagram', label: '📸 Instagram', field: 'followers' },
                  { key: 'instagram', label: '  ↳ Etkileşim', field: 'engagement', suffix: '%' },
                  { key: 'tiktok',    label: '🎵 TikTok',    field: 'followers' },
                  { key: 'tiktok',    label: '  ↳ Etkileşim', field: 'engagement', suffix: '%' },
                  { key: 'twitter',   label: '✖ Twitter/X',  field: 'followers' },
                  { key: 'facebook',  label: '👤 Facebook',  field: 'followers' },
                  { key: 'youtube',   label: '▶ YouTube',    field: 'subscribers' },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-navy-hover/30">
                    <td className="py-2 pr-4 text-muted text-xs whitespace-nowrap">{row.label}</td>
                    {socialRows.map(r => {
                      const val = r.social?.[row.key]?.[row.field];
                      const fmt = val == null ? '—'
                        : row.suffix ? `${val}${row.suffix}`
                        : val >= 1000 ? `${(val / 1000).toFixed(1)}K`
                        : val;
                      return (
                        <td key={r.id} className="py-2 px-3 text-right text-white font-medium text-xs">{fmt}</td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Grafikler */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { platform: 'instagram', dataKey: 'followers',   label: 'IG Takipçi',    title: 'Instagram Takipçi' },
              { platform: 'tiktok',    dataKey: 'followers',   label: 'TikTok Takipçi', title: 'TikTok Takipçi' },
              { platform: 'instagram', dataKey: 'engagement',  label: 'IG Etkileşim %', title: 'Instagram Etkileşim %' },
              { platform: 'tiktok',    dataKey: 'engagement',  label: 'TikTok Etkileşim %', title: 'TikTok Etkileşim %' },
            ].map((cfg, i) => (
              <div key={i} className="card p-4">
                <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">{cfg.title}</h3>
                <SocialChart socialRows={socialRows} {...cfg} />
              </div>
            ))}
          </div>

          <p className="text-[11px] text-muted text-center">
            IG takipçi verileri BoomSocial (Mar 2026) ile doğrulanmış. Diğer platformlar tahmini.
          </p>
        </div>
      )}

      {/* ── TAB: Operasyonel ─────────────────────────────────────────────── */}
      {activeTab === 'operations' && (
        <div className="space-y-4">
          {/* Özet kartlar */}
          <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${selectedIds.length}, 1fr)` }}>
            {opBrands.map(b => (
              <div key={b.id} className="card p-4 border-t-2" style={{ borderColor: b.color }}>
                <p className="text-sm font-bold text-white mb-3" style={{ color: b.color }}>{b.name}</p>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted">Şube (TR)</span>
                    <span className="text-white font-semibold">{b.branches}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Ort. Fiyat</span>
                    <span className="text-white font-semibold">₺{b.avgPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Pazar Payı</span>
                    <span className="text-white font-semibold">%{b.marketShare}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Maps Puanı</span>
                    <span className="text-white font-semibold">⭐ {b.rating}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Kaynak</span>
                    <span className="text-white font-semibold capitalize">{b.country}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Grafikler */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="card p-4">
              <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Şube Sayısı (TR)</h3>
              <OpChart brands={opBrands} dataKey="branches" label="Şube" formatter={v => v} />
            </div>
            <div className="card p-4">
              <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Ortalama Ürün Fiyatı</h3>
              <OpChart brands={opBrands} dataKey="avgPrice" label="Fiyat" formatter={v => `₺${v}`} />
            </div>
            <div className="card p-4">
              <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Pazar Payı (%)</h3>
              <OpChart brands={opBrands} dataKey="marketShare" label="Pazar Payı" formatter={v => `%${v}`} />
            </div>
            <div className="card p-4">
              <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Google Maps Puanı</h3>
              <OpChart brands={opBrands} dataKey="rating" label="Puan" formatter={v => `⭐ ${v}`} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
