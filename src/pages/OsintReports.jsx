import { useState, useMemo } from 'react';
import SectionHeader from '../components/common/SectionHeader';
import DataFreshnessBar from '../components/common/DataFreshnessBar';
import BrandBadge from '../components/common/BrandBadge';
import { BRANDS } from '../constants/brands';
import { TRENDING_KEYWORDS, MENTION_SOURCES } from '../data/osintData';
import useScrapedNews from '../hooks/useScrapedNews';
import clsx from 'clsx';

const SOURCE_TYPE_MAP = {
  'google-news':   'news',
  'brand-website': 'blog',
};

export default function OsintReports() {
  const [selectedBrand, setSelectedBrand]       = useState('all');
  const [selectedSentiment, setSelectedSentiment] = useState('all');
  const [selectedSource, setSelectedSource]     = useState('all');

  // Gerçek haber akışı — scraper API
  const { news, loading, isLive, refetch } = useScrapedNews();

  // Scraper haberlerini mention formatına dönüştür
  const liveMentions = useMemo(() => news.map((item, i) => ({
    id: `live-${i}`,
    brand:     item.brandId,
    source:    item.source || 'Google News',
    type:      SOURCE_TYPE_MAP[item.sourceType] || 'news',
    title:     item.title,
    url:       item.url,
    date:      item.publishedAt ? new Date(item.publishedAt).toISOString().slice(0, 10) : '',
    sentiment: 'neutral',   // NLP entegrasyonu olmadan varsayılan: nötr
    score:     50,
    summary:   item.snippet || '',
    keywords:  [],
    reach:     0,
  })), [news]);

  const filtered = useMemo(() => liveMentions.filter(m => {
    const brandMatch = selectedBrand === 'all' || m.brand === selectedBrand;
    const sentMatch  = selectedSentiment === 'all' || m.sentiment === selectedSentiment;
    const srcMatch   = selectedSource === 'all' || m.type === selectedSource;
    return brandMatch && sentMatch && srcMatch;
  }), [liveMentions, selectedBrand, selectedSentiment, selectedSource]);


  return (
    <div className="space-y-6 animate-fade-in">
      <SectionHeader
        title="OSINT Raporları"
        subtitle="Açık kaynak istihbaratı — Web mentions, duygu analizi ve trend takibi"
      />
      <DataFreshnessBar
        sources={[{ label: 'Google News RSS' }, { label: 'Marka Siteleri' }, { label: 'Haber' }]}
        interval={60_000}
      />

      {/* Veri kaynağı notu */}
      <div className="flex items-start gap-3 bg-info/10 border border-info/20 rounded-xl p-4">
        <div className="text-xl">🛰️</div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-white mb-1">Veri Kaynakları</p>
          <p className="text-xs text-muted leading-relaxed">
            <strong className="text-white">Haber akışı:</strong> Scraper → Google News RSS + marka web siteleri (her 6 saatte güncellenir).<br />
            <strong className="text-white">Trend kelimeler:</strong> Resmi web siteleri ve basın bültenlerinden doğrulanmıştır.
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className={clsx('text-xs font-medium px-2 py-0.5 rounded-full', isLive ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning')}>
              {isLive ? `● Canlı — ${news.length} haber` : '○ Scraper bağlantısı yok'}
            </span>
            <button onClick={refetch} className="text-xs text-muted hover:text-white transition-colors">
              ↺ Yenile
            </button>
          </div>
        </div>
      </div>

      {/* Trending Keywords */}
      <div className="card">
        <h3 className="text-sm font-semibold text-white mb-1">Trend Kelimeler — Marka Bazlı</h3>
        <p className="text-xs text-muted mb-4">Resmi web siteleri, basın bültenleri ve doğrulanmış haber kaynaklarından derlenmiştir.</p>
        <div className="space-y-4">
          {Object.entries(TRENDING_KEYWORDS).map(([brandId, keywords]) => {
            const brand = BRANDS.find(b => b.id === brandId);
            if (!brand) return null;
            return (
              <div key={brandId} className="flex items-center gap-3 flex-wrap">
                <BrandBadge brandId={brandId} size="sm" />
                <div className="flex flex-wrap gap-1.5">
                  {keywords.map((kw, i) => (
                    <span
                      key={kw}
                      className="text-xs px-2.5 py-1 rounded-full font-medium"
                      style={{
                        backgroundColor: `${brand.color}${Math.max(15, 40 - i * 5).toString(16)}`,
                        color: brand.textColor || brand.color,
                        fontSize: `${Math.max(10, 13 - i)}px`,
                      }}
                    >
                      #{kw}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Haber Akışı Filtreleri */}
      <div className="card">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted">Marka:</span>
            <select value={selectedBrand} onChange={e => setSelectedBrand(e.target.value)} className="input text-xs py-1.5">
              <option value="all">Tümü</option>
              {BRANDS.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted">Kaynak:</span>
            <select value={selectedSource} onChange={e => setSelectedSource(e.target.value)} className="input text-xs py-1.5">
              <option value="all">Tümü</option>
              {MENTION_SOURCES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
          </div>
          <span className="text-xs text-muted ml-auto">{filtered.length} haber</span>
        </div>
      </div>

      {/* Haber Akışı */}
      {loading ? (
        <div className="card text-center py-12">
          <div className="text-3xl mb-3 animate-pulse">📡</div>
          <p className="text-muted text-sm">Scraper'dan haberler yükleniyor...</p>
        </div>
      ) : !isLive ? (
        <div className="card text-center py-12 border border-warning/20 bg-warning/5">
          <div className="text-3xl mb-3">⚠️</div>
          <p className="text-white text-sm font-medium mb-1">Scraper bağlantısı kurulamadı</p>
          <p className="text-muted text-xs mb-4">
            Haber akışı için scraper servisinin çalışıyor olması gerekiyor.<br />
            Railway'de dağıtıldığında otomatik olarak bağlanır.
          </p>
          <button onClick={refetch} className="btn btn-secondary text-xs">↺ Tekrar Dene</button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-3xl mb-3">🔍</div>
          <p className="text-muted text-sm">Seçilen filtrelere uygun haber bulunamadı.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(mention => {
            const srcInfo = MENTION_SOURCES.find(s => s.id === mention.type);
            const brand   = BRANDS.find(b => b.id === mention.brand);
            const daysAgo = mention.date
              ? Math.floor((Date.now() - new Date(mention.date)) / 86400000)
              : null;
            return (
              <div key={mention.id} className="card-hover">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 text-2xl">{srcInfo?.icon || '📄'}</div>
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
                    <h4 className="text-sm font-semibold text-white mb-1 leading-snug">
                      {mention.url && mention.url !== '#' ? (
                        <a href={mention.url} target="_blank" rel="noopener noreferrer"
                          className="hover:text-caramel transition-colors">
                          {mention.title}
                        </a>
                      ) : mention.title}
                    </h4>
                    {mention.summary && (
                      <p className="text-xs text-muted leading-relaxed line-clamp-2">{mention.summary}</p>
                    )}
                    {mention.url && mention.url !== '#' && (
                      <a href={mention.url} target="_blank" rel="noopener noreferrer"
                        className="text-[10px] text-caramel/70 hover:text-caramel mt-1 inline-block transition-colors">
                        → Habere git
                      </a>
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
