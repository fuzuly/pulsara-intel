import { useState, useMemo } from 'react';
import SectionHeader from '../components/common/SectionHeader';
import BrandBadge from '../components/common/BrandBadge';
import { BRANDS } from '../constants/brands';
import { NEW_PRODUCTS } from '../data/newProductData';
import clsx from 'clsx';

const TODAY = '27 Mayıs 2026';

export default function NewProductRadar() {
  const [selectedBrand, setSelectedBrand]   = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const filtered = useMemo(() => NEW_PRODUCTS.filter(p => {
    const brandMatch  = selectedBrand  === 'all' || p.brand === selectedBrand;
    const statusMatch = selectedStatus === 'all' || p.status === selectedStatus;
    return brandMatch && statusMatch;
  }), [selectedBrand, selectedStatus]);

  const totalCount    = NEW_PRODUCTS.length;
  const activeCount   = NEW_PRODUCTS.filter(p => p.status === 'active').length;
  const upcomingCount = NEW_PRODUCTS.filter(p => p.status === 'upcoming').length;

  const brandOptions = useMemo(() => {
    const ids = [...new Set(NEW_PRODUCTS.map(p => p.brand))];
    return BRANDS.filter(b => ids.includes(b.id));
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
            <span className="relative inline-flex rounded-full h-2 w-2 bg-info" />
          </span>
          <span className="font-semibold tracking-wide text-info">Demo Modu</span>
        </div>
        <span className="text-muted">Son güncelleme: <span className="text-white font-medium">{TODAY}</span></span>
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-muted">Kaynaklar:</span>
          <span className="bg-navy-border text-muted px-1.5 py-0.5 rounded text-[10px] font-medium">Marka Siteleri</span>
          <span className="bg-navy-border text-muted px-1.5 py-0.5 rounded text-[10px] font-medium">Basın Bültenleri</span>
        </div>
      </div>

      {/* Demo banner */}
      <div className="flex items-center gap-3 rounded-xl px-4 py-3 text-xs bg-info/10 border border-info/20">
        <span className="h-2 w-2 rounded-full flex-shrink-0 bg-info" />
        <span className="text-info">Demo verisi — Gerçek zamanlı izleme aktif değil</span>
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
      <div className="card flex flex-wrap gap-4 items-center">
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
            { id: 'all',      label: 'Tümü'   },
            { id: 'active',   label: 'Aktif'  },
            { id: 'upcoming', label: 'Yakında'},
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

        <span className="text-xs text-muted">{filtered.length} ürün</span>
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
            const brand = BRANDS.find(b => b.id === product.brand);
            const launchDate = new Date(product.launchDate);
            const formattedDate = launchDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });

            return (
              <div key={product.id} className="card-hover">
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
                      <span>📅 {formattedDate}</span>
                      {product.price && (
                        <span className="text-white font-semibold">₺{product.price}</span>
                      )}
                      <span className="truncate max-w-xs" title={product.source}>
                        🔗 {product.source}
                      </span>
                    </div>

                    {/* OSINT confidence */}
                    {product.osintConfidence && (
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-muted w-28 flex-shrink-0">OSINT Güven Skoru</span>
                        <div className="flex-1 h-1.5 bg-surface2 rounded-full overflow-hidden">
                          <div
                            className={clsx('h-full rounded-full transition-all', product.osintConfidence >= 75 ? 'bg-success' : product.osintConfidence >= 65 ? 'bg-warning' : 'bg-orange-400')}
                            style={{ width: `${product.osintConfidence}%` }}
                          />
                        </div>
                        <span className={clsx('text-[10px] font-semibold w-8 text-right', product.osintConfidence >= 75 ? 'text-success' : product.osintConfidence >= 65 ? 'text-warning' : 'text-orange-400')}>
                          {product.osintConfidence}%
                        </span>
                      </div>
                    )}
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
            <h3 className="text-base font-semibold text-white">OSINT Metodolojisi — Ürün Tespiti</h3>
            <p className="text-xs text-muted">Sistem hangi sinyalleri kullanarak yeni ürünleri tespit ediyor?</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
          {[
            { icon: '💼', title: '1. İş İlanı Analizi',      desc: 'LinkedIn, Kariyer.net ve kariyer sayfaları taranır. "Specialty Coffee Trainer", "Ürün Geliştirme Uzmanı" ilanları yeni segment sinyalidir.', confidence: '60-75%' },
            { icon: '📱', title: '2. Sosyal Medya Teaser',   desc: 'Instagram, TikTok, Twitter izlenir. Belirsiz görseller, renk ipuçları, "#yakında" hashtag paylaşımları analiz edilir.', confidence: '70-85%' },
            { icon: '📅', title: '3. Sezonsal Kalıp',        desc: 'Markalar aynı dönemlerde ürün çıkarır. 3-5 yıllık lansman takvimleri analiz edilerek gelecek lansmanlar öngörülür.', confidence: '75-90%' },
            { icon: '🌍', title: '4. Küresel→TR Transferi',  desc: 'Küresel piyasadaki lansmanlar Türkiye\'ye 3-6 ay gecikmeli gelir. Bu pencere erken tespit sağlar.', confidence: '50-70%' },
          ].map(m => (
            <div key={m.title} className="bg-surface2/50 rounded-xl p-3">
              <div className="text-2xl mb-2">{m.icon}</div>
              <h4 className="text-xs font-bold text-white mb-1">{m.title}</h4>
              <p className="text-[10px] text-muted leading-relaxed mb-2">{m.desc}</p>
              <div className={clsx('text-[10px] font-semibold', parseInt(m.confidence) >= 75 ? 'text-success' : parseInt(m.confidence) >= 65 ? 'text-warning' : 'text-orange-400')}>
                Doğruluk: {m.confidence}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
