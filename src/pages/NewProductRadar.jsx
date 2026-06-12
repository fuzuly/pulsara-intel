import { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SectionHeader from '../components/common/SectionHeader';
import BrandBadge from '../components/common/BrandBadge';
import { BRANDS } from '../constants/brands';
import { NEW_PRODUCTS, PRODUCT_CATEGORIES, LAYER_CONFIG } from '../data/newProductData';
import clsx from 'clsx';

const TODAY = new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });

export default function NewProductRadar() {
  const location = useLocation();
  const [selectedBrand,    setSelectedBrand]    = useState('all');
  const [selectedStatus,   setSelectedStatus]   = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('Tümü');
  const [selectedLayer,    setSelectedLayer]    = useState(0);
  const [highlightId,      setHighlightId]      = useState(null);

  useEffect(() => {
    const id = location.hash.replace('#', '');
    if (!id) return;
    // Reset all filters so the product is guaranteed to be visible
    setSelectedBrand('all');
    setSelectedStatus('all');
    setSelectedCategory('Tümü');
    setSelectedLayer(0);
    setHighlightId(id);
    const scrollTimer = setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 200);
    const clearTimer = setTimeout(() => setHighlightId(null), 2500);
    return () => { clearTimeout(scrollTimer); clearTimeout(clearTimer); };
  }, [location.hash]);

  const filtered = useMemo(() => NEW_PRODUCTS.filter(p => {
    const brandMatch    = selectedBrand    === 'all'  || p.brand    === selectedBrand;
    const statusMatch   = selectedStatus   === 'all'  || p.status   === selectedStatus;
    const categoryMatch = selectedCategory === 'Tümü' || p.category === selectedCategory;
    const layerMatch    = selectedLayer    === 0      || p.layer    === selectedLayer;
    return brandMatch && statusMatch && categoryMatch && layerMatch;
  }), [selectedBrand, selectedStatus, selectedCategory, selectedLayer]);

  const totalCount    = NEW_PRODUCTS.length;
  const activeCount   = NEW_PRODUCTS.filter(p => p.status === 'active').length;
  const upcomingCount = NEW_PRODUCTS.filter(p => p.status === 'upcoming').length;

  const brandOptions = useMemo(() => {
    const ids = [...new Set(NEW_PRODUCTS.map(p => p.brand))];
    return BRANDS.filter(b => ids.includes(b.id));
  }, []);

  const usedCategories = useMemo(() => {
    const cats = [...new Set(NEW_PRODUCTS.map(p => p.category))];
    return ['Tümü', ...cats];
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <SectionHeader
        title="Yeni Ürün Radar"
        subtitle="Rakip ürün lansmanları — 2026 doğrulanmış veri"
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
          {Object.values(LAYER_CONFIG).map(l => (
            <span key={l.label} className="bg-navy-border text-muted px-1.5 py-0.5 rounded text-[10px] font-medium">
              {l.icon} {l.label}
            </span>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card text-center">
          <div className="text-2xl font-bold text-white">{totalCount}</div>
          <div className="text-xs text-muted mt-1">İzlenen Ürün</div>
        </div>
        <div className="card text-center border-success/20">
          <div className="text-2xl font-bold text-success">{activeCount}</div>
          <div className="text-xs text-muted mt-1">Aktif Lansman</div>
        </div>
        <div className="card text-center border-warning/20">
          <div className="text-2xl font-bold text-warning">{upcomingCount}</div>
          <div className="text-xs text-muted mt-1">Yakında</div>
        </div>
      </div>

      {/* Filters */}
      <div className="card space-y-3">
        {/* Brand + Status row */}
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-muted font-medium">Marka:</span>
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

          <div className="flex items-center gap-1 ml-auto">
            {[
              { id: 'all',      label: 'Tümü'    },
              { id: 'active',   label: 'Aktif'   },
              { id: 'upcoming', label: 'Yakında' },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setSelectedStatus(f.id)}
                className={clsx('text-[10px] px-2 py-1 rounded transition-colors', selectedStatus === f.id ? 'bg-caramel/20 text-caramel' : 'text-muted hover:text-white')}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category + Layer row */}
        <div className="flex flex-wrap gap-4 items-center border-t border-navy-border pt-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-muted font-medium">Kategori:</span>
            {usedCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={clsx('text-[10px] px-2 py-1 rounded transition-colors', selectedCategory === cat ? 'bg-caramel/20 text-caramel' : 'text-muted hover:text-white')}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 flex-wrap ml-auto">
            <span className="text-xs text-muted font-medium">Kaynak:</span>
            <button
              onClick={() => setSelectedLayer(0)}
              className={clsx('text-[10px] px-2 py-1 rounded transition-colors', selectedLayer === 0 ? 'bg-caramel/20 text-caramel' : 'text-muted hover:text-white')}
            >
              Tümü
            </button>
            {Object.entries(LAYER_CONFIG).map(([key, l]) => (
              <button
                key={key}
                onClick={() => setSelectedLayer(Number(key))}
                className={clsx('text-[10px] px-2 py-1 rounded transition-colors border',
                  selectedLayer === Number(key) ? `${l.bg} ${l.color}` : 'border-transparent text-muted hover:text-white'
                )}
              >
                {l.icon} {l.label}
              </button>
            ))}
          </div>
        </div>

        <p className="text-xs text-muted">{filtered.length} ürün</p>
      </div>

      {/* Product cards */}
      {filtered.length === 0 ? (
        <div className="card text-center py-16">
          <div className="text-4xl mb-4">🔍</div>
          <p className="text-muted text-sm">Seçilen filtrelere uygun ürün bulunamadı.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(product => {
            const brand      = BRANDS.find(b => b.id === product.brand);
            const layerCfg   = LAYER_CONFIG[product.layer];
            const launchDate = new Date(product.launchDate).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
            const detectedDate = new Date(product.detectedAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
            const isUnverified = product.layer === 3;

            return (
              <div
                key={product.id}
                id={product.id}
                className={clsx('card-hover transition-colors', isUnverified && 'border-warning/20')}
                style={product.id === highlightId ? { backgroundColor: '#C4922A10', borderColor: '#C4922A60' } : {}}
              >
                <div className="flex items-start gap-4">
                  {/* Brand color bar */}
                  <div
                    className="w-1 self-stretch rounded-full flex-shrink-0"
                    style={{ backgroundColor: brand?.color || '#8B9BB4' }}
                  />

                  <div className="flex-1 min-w-0">
                    {/* Top row */}
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <BrandBadge brandId={product.brand} size="xs" />
                      <span className={clsx(
                        'text-[9px] font-bold px-2 py-0.5 rounded-full',
                        product.status === 'active'
                          ? 'bg-success/15 text-success'
                          : 'bg-warning/15 text-warning'
                      )}>
                        {product.status === 'active' ? 'Aktif' : 'Yakında'}
                      </span>
                      {/* Layer badge */}
                      <span className={clsx('text-[9px] font-semibold px-2 py-0.5 rounded-full border', layerCfg.bg, layerCfg.color)}>
                        {layerCfg.icon} {layerCfg.label}
                      </span>
                      {product.tags?.slice(0, 3).map(tag => (
                        <span key={tag} className="text-[9px] bg-surface2 text-muted px-1.5 py-0.5 rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Name */}
                    <h3 className="text-sm font-bold text-white mb-1">{product.name}</h3>

                    {/* Description */}
                    <p className="text-xs text-muted leading-relaxed mb-3">{product.description}</p>

                    {/* Meta row */}
                    <div className="flex flex-wrap gap-4 text-xs text-muted mb-3">
                      <span>🚀 Lansman: {launchDate}</span>
                      <span>📡 Tespit: {detectedDate}</span>
                      {product.price && (
                        <span className="text-white font-semibold">₺{product.price}</span>
                      )}
                      <span className="truncate max-w-xs" title={product.source}>
                        🔗 {product.source}
                      </span>
                    </div>

                    {/* OSINT confidence */}
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-muted w-28 flex-shrink-0">OSINT Güven Skoru</span>
                      <div className="flex-1 h-1.5 bg-surface2 rounded-full overflow-hidden">
                        <div
                          className={clsx('h-full rounded-full transition-all',
                            product.osintConfidence >= 90 ? 'bg-success'
                            : product.osintConfidence >= 75 ? 'bg-info'
                            : product.osintConfidence >= 65 ? 'bg-warning'
                            : 'bg-orange-400'
                          )}
                          style={{ width: `${product.osintConfidence}%` }}
                        />
                      </div>
                      <span className={clsx('text-[10px] font-semibold w-8 text-right',
                        product.osintConfidence >= 90 ? 'text-success'
                        : product.osintConfidence >= 75 ? 'text-info'
                        : product.osintConfidence >= 65 ? 'text-warning'
                        : 'text-orange-400'
                      )}>
                        %{product.osintConfidence}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* OSINT Methodology */}
      <div className="card border-info/20 space-y-4">
        <div className="flex items-center gap-2">
          <div className="text-2xl">🛰️</div>
          <div>
            <h3 className="text-base font-semibold text-white">OSINT Metodolojisi — Güvenilirlik Katmanları</h3>
            <p className="text-xs text-muted">Her ürün hangi kaynaktan tespit edildi ve ne kadar güvenilir?</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            {
              layer: 1,
              title: 'Katman 1 — Resmi Kaynak',
              desc: 'Marka\'nın kendi web sitesi veya resmi basın bülteni. Ürün menüde varsa kesin doğrulanmış.',
              examples: 'starbucks.com.tr, cariboucoffee.com, resmi PR',
              confidence: 95,
            },
            {
              layer: 2,
              title: 'Katman 2 — Sosyal / Blog',
              desc: 'Güvenilir gıda blogları, haber siteleri, markanın Instagram paylaşımları.',
              examples: 'gastrofill.com, horecatrend.com, marketingturkiye.com.tr',
              confidence: 80,
            },
            {
              layer: 3,
              title: 'Katman 3 — Erken Sinyal',
              desc: 'İç kaynak, teaser, iş ilanı analizi veya küresel→TR transfer tahmini. Doğrulama gerektirir.',
              examples: 'İç kaynak, LinkedIn ilanı, global lansman takvimi',
              confidence: 65,
            },
          ].map(m => {
            const layerCfg = LAYER_CONFIG[m.layer];
            return (
              <div key={m.layer} className={clsx('rounded-xl p-3 border', layerCfg.bg)}>
                <div className={clsx('text-xs font-bold mb-1', layerCfg.color)}>{layerCfg.icon} {m.title}</div>
                <p className="text-[10px] text-muted leading-relaxed mb-2">{m.desc}</p>
                <p className="text-[10px] text-white/60 mb-2 italic">{m.examples}</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1 bg-surface2 rounded-full overflow-hidden">
                    <div
                      className={clsx('h-full rounded-full', layerCfg.color.replace('text-', 'bg-'))}
                      style={{ width: `${m.confidence}%` }}
                    />
                  </div>
                  <span className={clsx('text-[10px] font-semibold', layerCfg.color)}>~%{m.confidence}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 pt-2 border-t border-navy-border">
          {[
            { icon: '💼', title: '1. İş İlanı Analizi',     desc: 'LinkedIn, Kariyer.net taranır. "Ürün Geliştirme Uzmanı" ilanları yeni segment sinyalidir.',           confidence: 65 },
            { icon: '📱', title: '2. Sosyal Medya Teaser',  desc: 'Instagram, TikTok izlenir. Belirsiz görseller, renk ipuçları, "#yakında" etiketleri analiz edilir.',    confidence: 75 },
            { icon: '📅', title: '3. Sezonsal Kalıp',       desc: 'Markalar aynı dönemlerde ürün çıkarır. 3-5 yıllık lansman takvimleri analiz edilerek öngörü yapılır.',  confidence: 82 },
            { icon: '🌍', title: '4. Küresel→TR Transferi', desc: 'Küresel lansmanlar TR\'ye 3-6 ay gecikmeli gelir. Bu pencere erken tespit sağlar.',                     confidence: 60 },
          ].map(m => (
            <div key={m.title} className="bg-surface2/50 rounded-xl p-3">
              <div className="text-2xl mb-2">{m.icon}</div>
              <h4 className="text-xs font-bold text-white mb-1">{m.title}</h4>
              <p className="text-[10px] text-muted leading-relaxed mb-2">{m.desc}</p>
              <div className={clsx('text-[10px] font-semibold',
                m.confidence >= 80 ? 'text-success' : m.confidence >= 70 ? 'text-warning' : 'text-orange-400'
              )}>
                Doğruluk: ~%{m.confidence}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
