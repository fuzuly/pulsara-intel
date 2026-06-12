import { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import SectionHeader from '../components/common/SectionHeader';
import BrandBadge from '../components/common/BrandBadge';
import { BRANDS } from '../constants/brands';
import { TRENDING_KEYWORDS, SENTIMENT_SCORES } from '../data/osintData';
import { NEW_PRODUCTS } from '../data/newProductData';
import clsx from 'clsx';
import { Search, X } from 'lucide-react';

const TODAY = new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });

// NEW_PRODUCTS → mention formatına dönüştür
const STATIC_MENTIONS = NEW_PRODUCTS.map((item, i) => ({
  id:        i,
  brand:     item.brand,
  title:     `${item.name} — ${item.description}`,
  date:      item.launchDate,
  source:    item.source,
  type:      'blog',
  sentiment: 'neutral',
  summary:   item.description,
  url:       null,
}));

// Recharts tooltip
function SentimentTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-navy border border-navy-border rounded-lg px-3 py-2 text-xs shadow-xl">
      <p className="font-semibold text-white mb-1">{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color }}>{p.name}: {p.value}%</p>
      ))}
    </div>
  );
}

export default function OsintReports() {
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [query, setQuery] = useState('');

  const q = query.toLowerCase().trim();

  const filtered = useMemo(() => STATIC_MENTIONS.filter(m => {
    const matchBrand = selectedBrand === 'all' || m.brand === selectedBrand;
    const matchQuery = !q ||
      m.title.toLowerCase().includes(q) ||
      (m.summary || '').toLowerCase().includes(q) ||
      m.brand.toLowerCase().includes(q);
    return matchBrand && matchQuery;
  }), [selectedBrand, q]);

  const matchingKeywordBrands = useMemo(() => {
    if (!q) return null;
    const matches = new Set();
    Object.entries(TRENDING_KEYWORDS).forEach(([brandId, kws]) => {
      if (kws.some(kw => kw.toLowerCase().includes(q)) || brandId.includes(q)) {
        matches.add(brandId);
      }
    });
    return matches;
  }, [q]);

  // Sentiment chart verisi — tüm markalar
  const sentimentData = useMemo(() =>
    Object.entries(SENTIMENT_SCORES).map(([id, s]) => {
      const brand = BRANDS.find(b => b.id === id);
      return {
        name:     brand?.shortName || id,
        Pozitif:  s.positive,
        Nötr:     s.neutral,
        Negatif:  s.negative,
        color:    brand?.color || '#8B9BB4',
      };
    }).sort((a, b) => b.Pozitif - a.Pozitif)
  , []);

  const brandOptions = useMemo(() => {
    const ids = [...new Set(NEW_PRODUCTS.map(p => p.brand))];
    return BRANDS.filter(b => ids.includes(b.id));
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <SectionHeader
        title="OSINT Raporları"
        subtitle="Açık kaynak istihbaratı — Web mentions, duygu analizi ve trend takibi"
      />

      {/* Freshness bar */}
      <div className="flex flex-wrap items-center gap-3 px-4 py-2 rounded-lg border text-xs bg-surface2 border-navy-border">
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
          </span>
          <span className="font-semibold tracking-wide text-success">Statik Veri</span>
        </div>
        <span className="text-muted">Son güncelleme: <span className="text-white font-medium">{TODAY}</span></span>
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-muted">Kaynaklar:</span>
          <span className="bg-navy-border text-muted px-1.5 py-0.5 rounded text-[10px] font-medium">Marka Siteleri</span>
          <span className="bg-navy-border text-muted px-1.5 py-0.5 rounded text-[10px] font-medium">Basın Bültenleri</span>
          <span className="bg-navy-border text-muted px-1.5 py-0.5 rounded text-[10px] font-medium">Google Maps</span>
        </div>
      </div>

      {/* Source note */}
      <div className="flex items-center gap-3 rounded-xl px-4 py-3 text-xs bg-success/5 border border-success/20">
        <span className="h-2 w-2 rounded-full flex-shrink-0 bg-success" />
        <span className="text-success/90">Veriler doğrulanmış kaynaklardan derlendi: Anadolu Ajansı, Gastrofill, Food in Life, Mall Report, Marketing Türkiye, Dünya Gazetesi — Haziran 2026</span>
      </div>

      {/* Arama Kutusu */}
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Kelime, marka veya etiket ara..."
          className="w-full bg-surface2 border border-navy-border rounded-xl pl-9 pr-9 py-2.5 text-sm text-white placeholder-muted focus:outline-none focus:border-purple-500 transition-colors"
        />
        {query && (
          <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-white transition-colors">
            <X size={14} />
          </button>
        )}
      </div>

      {/* Trending Keywords */}
      <div className="card">
        <h3 className="text-sm font-semibold text-white mb-1">Trend Kelimeler — Marka Bazlı</h3>
        <p className="text-xs text-muted mb-4">Resmi web siteleri, basın bültenleri ve doğrulanmış haber kaynaklarından derlenmiştir.</p>
        <div className="space-y-4">
          {Object.entries(TRENDING_KEYWORDS).map(([brandId, keywords]) => {
            const brand = BRANDS.find(b => b.id === brandId);
            if (!brand) return null;
            const dimmed = matchingKeywordBrands && !matchingKeywordBrands.has(brandId);
            return (
              <div key={brandId} className={clsx('flex items-center gap-3 flex-wrap transition-opacity', dimmed && 'opacity-25')}>
                <BrandBadge brandId={brandId} size="sm" />
                <div className="flex flex-wrap gap-1.5">
                  {keywords.map((kw, i) => {
                    const highlight = q && kw.toLowerCase().includes(q);
                    return (
                      <span
                        key={kw}
                        className={clsx('text-xs px-2.5 py-1 rounded-full font-medium transition-all', highlight && 'ring-2 ring-white/40')}
                        style={{
                          backgroundColor: `${brand.color}${Math.max(15, 40 - i * 5).toString(16)}`,
                          color: brand.textColor || brand.color,
                          fontSize: `${Math.max(10, 13 - i)}px`,
                        }}
                      >
                        #{kw}
                      </span>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sentiment Scores */}
      <div className="card">
        <h3 className="text-sm font-semibold text-white mb-1">Marka Sentiment Skorları</h3>
        <p className="text-xs text-muted mb-4">Google Maps ortalama puanından türetilmiştir. Pozitif / Nötr / Negatif dağılımı.</p>
        <div className="space-y-2">
          {sentimentData.map(d => (
            <div key={d.name} className="flex items-center gap-3">
              <span className="text-[10px] text-muted w-20 flex-shrink-0 text-right">{d.name}</span>
              <div className="flex-1 h-3 rounded-full overflow-hidden flex">
                <div
                  className="h-full bg-success/70 transition-all"
                  style={{ width: `${d.Pozitif}%` }}
                  title={`Pozitif: ${d.Pozitif}%`}
                />
                <div
                  className="h-full bg-surface2 transition-all"
                  style={{ width: `${d.Nötr}%` }}
                  title={`Nötr: ${d.Nötr}%`}
                />
                <div
                  className="h-full bg-danger/60 transition-all"
                  style={{ width: `${d.Negatif}%` }}
                  title={`Negatif: ${d.Negatif}%`}
                />
              </div>
              <span className="text-[10px] text-success w-8 text-right flex-shrink-0">{d.Pozitif}%</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4 mt-4 text-[10px] text-muted">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-success/70 inline-block" />Pozitif</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-surface2 border border-navy-border inline-block" />Nötr</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-danger/60 inline-block" />Negatif</span>
        </div>
      </div>

      {/* Haber filtresi */}
      <div className="card flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-muted">Marka:</span>
          <button
            onClick={() => setSelectedBrand('all')}
            className={clsx('btn text-xs', selectedBrand === 'all' ? 'btn-primary' : 'btn-secondary')}
          >
            Tümü
          </button>
          {brandOptions.map(b => (
            <button
              key={b.id}
              onClick={() => setSelectedBrand(b.id)}
              className={clsx('btn text-xs transition-all', selectedBrand === b.id ? 'text-white border' : 'btn-secondary')}
              style={selectedBrand === b.id ? { backgroundColor: `${b.color}20`, borderColor: b.color, color: b.color } : {}}
            >
              {b.shortName}
            </button>
          ))}
        </div>
        <span className="text-xs text-muted ml-auto">
          {filtered.length} kayıt{q ? ` · "${query}" için` : ''}
        </span>
      </div>

      {/* Haber akışı */}
      {filtered.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-3xl mb-3">🔍</div>
          <p className="text-muted text-sm">Seçilen filtrelere uygun kayıt bulunamadı.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(mention => {
            const daysAgo = mention.date
              ? Math.floor((Date.now() - new Date(mention.date)) / 86400000)
              : null;
            return (
              <div key={mention.id} className="card-hover">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 text-2xl">✍️</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <BrandBadge brandId={mention.brand} size="xs" />
                      <span className="text-[10px] bg-surface2 text-muted px-2 py-0.5 rounded-full">{mention.source}</span>
                      {daysAgo !== null && (
                        <span className="text-[10px] text-muted ml-auto">
                          {daysAgo === 0 ? 'Bugün' : daysAgo === 1 ? 'Dün' : `${daysAgo} gün önce`}
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-semibold text-white mb-1 leading-snug line-clamp-2">
                      {mention.title}
                    </h4>
                    {mention.summary && (
                      <p className="text-xs text-muted leading-relaxed line-clamp-2">{mention.summary}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
