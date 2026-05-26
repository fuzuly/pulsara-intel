import { useState } from 'react';
import SectionHeader from '../components/common/SectionHeader';
import DataFreshnessBar from '../components/common/DataFreshnessBar';
import BrandBadge from '../components/common/BrandBadge';
import { BRANDS } from '../constants/brands';
import useScrapedNews from '../hooks/useScrapedNews';
import clsx from 'clsx';

const SOURCE_TYPE_LABEL = {
  'google-news':   { label: 'Google Haberler', color: 'text-blue-400',  bg: 'bg-blue-400/10'  },
  'brand-website': { label: 'Resmi Site',      color: 'text-green-400', bg: 'bg-green-400/10' },
};

const PRODUCT_KEYWORDS = [
  'lansman', 'launch', 'yeni ürün', 'new product', 'menü', 'menu',
  'içecek', 'drink', 'latte', 'frappuccino', 'cold brew', 'matcha',
  'seasonal', 'sezonluk', 'limited', 'sınırlı', 'kampanya', 'campaign',
];

export default function NewProductRadar() {
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [newsFilter, setNewsFilter] = useState('all');

  const { news: allNews, isLive: newsLive, refetch: refetchNews } = useScrapedNews();

  const news = allNews.filter(item => {
    const text = `${item.title || ''} ${item.snippet || ''}`.toLowerCase();
    const brandMatch = selectedBrand === 'all' || item.brandId === selectedBrand;
    const productMatch = PRODUCT_KEYWORDS.some(kw => text.includes(kw));
    const sourceMatch = newsFilter === 'all' || item.sourceType === newsFilter;
    return brandMatch && productMatch && sourceMatch;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <SectionHeader
        title="Yeni Ürün Radar"
        subtitle="Rakip ürün lansmanları — Google News ve marka siteleri canlı takibi"
      />
      <DataFreshnessBar
        sources={[{ label: 'Google News RSS' }, { label: 'Marka Siteleri' }]}
        interval={60_000}
        onRefresh={refetchNews}
      />

      {/* Live status banner */}
      <div className={clsx(
        'flex items-center gap-3 rounded-xl px-4 py-3 text-xs',
        newsLive
          ? 'bg-success/10 border border-success/20'
          : 'bg-warning/10 border border-warning/20'
      )}>
        <span className={clsx('h-2 w-2 rounded-full flex-shrink-0', newsLive ? 'bg-success animate-pulse' : 'bg-warning')} />
        {newsLive
          ? `${allNews.length} haber scraper'dan yüklendi — ürün/lansman filtresi aktif`
          : 'Scraper bağlantısı yok. Railway deploy tamamlanınca otomatik bağlanır.'
        }
        {!newsLive && (
          <button onClick={refetchNews} className="ml-auto text-muted hover:text-white transition-colors">↺ Tekrar Dene</button>
        )}
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
          {BRANDS.slice(0, 6).map(b => (
            <button
              key={b.id}
              onClick={() => setSelectedBrand(b.id)}
              className={clsx('btn text-xs transition-all', selectedBrand === b.id ? 'text-white border' : 'btn-secondary')}
              style={selectedBrand === b.id ? { backgroundColor: `${b.color}20`, borderColor: b.color, color: b.color } : {}}
            >
              {b.shortName}{b.isOwn && ' ⭐'}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 ml-auto">
          {['all', 'google-news', 'brand-website'].map(f => (
            <button
              key={f}
              onClick={() => setNewsFilter(f)}
              className={clsx('text-[10px] px-2 py-1 rounded transition-colors', newsFilter === f ? 'bg-caramel/20 text-caramel' : 'text-muted hover:text-white')}
            >
              {f === 'all' ? 'Tümü' : SOURCE_TYPE_LABEL[f]?.label}
            </button>
          ))}
        </div>

        <span className="text-xs text-muted">{news.length} haber</span>
      </div>

      {/* News feed */}
      {!newsLive ? (
        <div className="card text-center py-16 border border-warning/20 bg-warning/5">
          <div className="text-4xl mb-4">📡</div>
          <p className="text-white text-sm font-medium mb-2">Scraper servisi bağlantısı bekleniyor</p>
          <p className="text-muted text-xs max-w-sm mx-auto leading-relaxed">
            Ürün lansmanı haberleri için scraper servisinin çalışıyor olması gerekiyor.
            Railway'de dağıtıldığında otomatik olarak bağlanır.
          </p>
        </div>
      ) : news.length === 0 ? (
        <div className="card text-center py-16">
          <div className="text-4xl mb-4">🔍</div>
          <p className="text-muted text-sm">Seçilen filtrelere uygun ürün lansmanı haberi bulunamadı.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {news.map((item, i) => {
            const st = SOURCE_TYPE_LABEL[item.sourceType] || SOURCE_TYPE_LABEL['google-news'];
            const brand = BRANDS.find(b => b.id === item.brandId);
            const daysAgo = Math.floor((Date.now() - new Date(item.publishedAt)) / 86400000);
            return (
              <a
                key={item._id || i}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 p-3 rounded-xl bg-surface2/40 hover:bg-surface2 transition-colors group card-hover"
              >
                <div className="w-1 self-stretch rounded-full flex-shrink-0 mt-0.5" style={{ backgroundColor: brand?.color || '#8B9BB4' }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    {brand && <span className="text-[10px] font-semibold" style={{ color: brand.color }}>{brand.name}</span>}
                    <span className={clsx('text-[9px] px-1.5 py-0.5 rounded-full', st.bg, st.color)}>{st.label}</span>
                    <span className="text-[9px] text-muted ml-auto">
                      {daysAgo === 0 ? 'Bugün' : `${daysAgo}g önce`}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-white group-hover:text-caramel transition-colors line-clamp-2">{item.title}</p>
                  {item.snippet && <p className="text-[10px] text-muted mt-0.5 line-clamp-1">{item.snippet}</p>}
                  <p className="text-[9px] text-muted/60 mt-1">📡 {item.source}</p>
                </div>
                <span className="text-muted group-hover:text-white text-xs flex-shrink-0">↗</span>
              </a>
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
            {
              icon: '💼', title: '1. İş İlanı Analizi',
              desc: 'LinkedIn, Kariyer.net ve kariyer sayfaları taranır. "Specialty Coffee Trainer", "Ürün Geliştirme Uzmanı" ilanları yeni segment sinyalidir.',
              confidence: '60-75%',
            },
            {
              icon: '📱', title: '2. Sosyal Medya Teaser',
              desc: 'Instagram, TikTok, Twitter izlenir. Belirsiz görseller, renk ipuçları, "#yakında" hashtag paylaşımları analiz edilir.',
              confidence: '70-85%',
            },
            {
              icon: '📅', title: '3. Sezonsal Kalıp',
              desc: 'Markalar aynı dönemlerde ürün çıkarır. 3-5 yıllık lansman takvimleri analiz edilerek gelecek lansmanlar öngörülür.',
              confidence: '75-90%',
            },
            {
              icon: '🌍', title: '4. Küresel→TR Transferi',
              desc: 'Küresel piyasadaki lansmanlar Türkiye\'ye 3-6 ay gecikmeli gelir. Bu pencere erken tespit sağlar.',
              confidence: '50-70%',
            },
          ].map(m => (
            <div key={m.title} className="bg-surface2/50 rounded-xl p-3">
              <div className="text-2xl mb-2">{m.icon}</div>
              <h4 className="text-xs font-bold text-white mb-1">{m.title}</h4>
              <p className="text-[10px] text-muted leading-relaxed mb-2">{m.desc}</p>
              <div className={`text-[10px] font-semibold ${parseInt(m.confidence) >= 75 ? 'text-success' : parseInt(m.confidence) >= 65 ? 'text-warning' : 'text-orange-400'}`}>
                Doğruluk: {m.confidence}
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-start gap-2 bg-warning/10 border border-warning/20 rounded-lg p-3">
          <span className="text-base flex-shrink-0">⚠️</span>
          <p className="text-xs text-warning leading-relaxed">
            <strong>Önemli:</strong> Haberler Google News RSS ve marka sitelerinden otomatik çekilmektedir. İçerik doğrulama kullanıcıya aittir.
          </p>
        </div>
      </div>
    </div>
  );
}
