import { useState, useMemo } from 'react';
import clsx from 'clsx';
import { BRANDS } from '../constants/brands';
import useMentionStream from '../hooks/useMentionStream';

const SENTIMENT_META = {
  positive: { label: 'Olumlu', icon: '😊', color: 'text-success', bg: 'bg-success/10 border-success/20' },
  negative: { label: 'Olumsuz', icon: '😟', color: 'text-danger',  bg: 'bg-danger/10 border-danger/20'  },
  neutral:  { label: 'Nötr',   icon: '😐', color: 'text-warning', bg: 'bg-warning/10 border-warning/20' },
};

const SOURCE_META = {
  news:  { label: 'Google Haber', icon: '📰' },
  gdelt: { label: 'GDELT',        icon: '🌐' },
};

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60)    return `${diff}sn önce`;
  if (diff < 3600)  return `${Math.floor(diff / 60)}dk önce`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}sa önce`;
  return `${Math.floor(diff / 86400)}g önce`;
}

function StatCard({ label, value, sub, color = 'text-white' }) {
  return (
    <div className="card text-center py-4">
      <div className={clsx('text-2xl font-bold', color)}>{value ?? '—'}</div>
      <div className="text-xs text-muted mt-1">{label}</div>
      {sub && <div className="text-[10px] text-muted/60 mt-0.5">{sub}</div>}
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
          <div
            key={brand}
            style={{ width: `${(count / total) * 100}%`, backgroundColor: b?.color || '#666' }}
            title={`${b?.shortName || brand}: ${count}`}
          />
        );
      })}
    </div>
  );
}

export default function MentionMonitor() {
  const { mentions, stats, connected, lastPoll, newFlash } = useMentionStream();

  const [filterBrand, setFilterBrand]         = useState('all');
  const [filterSentiment, setFilterSentiment] = useState('all');
  const [filterSource, setFilterSource]       = useState('all');
  const [searchText, setSearchText]           = useState('');

  const filtered = useMemo(() => {
    return mentions.filter(m => {
      if (filterBrand     !== 'all' && m.brandId    !== filterBrand)     return false;
      if (filterSentiment !== 'all' && m.sentiment  !== filterSentiment) return false;
      if (filterSource    !== 'all' && m.sourceType !== filterSource)     return false;
      if (searchText) {
        const kw = searchText.toLowerCase();
        if (!m.title?.toLowerCase().includes(kw) && !m.snippet?.toLowerCase().includes(kw)) return false;
      }
      return true;
    });
  }, [mentions, filterBrand, filterSentiment, filterSource, searchText]);

  const topBrands = useMemo(() => {
    if (!stats?.byBrand) return [];
    return Object.entries(stats.byBrand)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([id, count]) => ({ id, count, brand: BRANDS.find(b => b.id === id) }));
  }, [stats]);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-white">Canlı Mention Takibi</h1>
          <p className="text-xs text-muted mt-0.5">
            Google Haberler + GDELT — 21 marka, 15 dakikada bir güncellenir
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Bağlantı durumu */}
          <div className={clsx(
            'flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium',
            connected
              ? 'bg-success/10 border-success/20 text-success'
              : 'bg-danger/10  border-danger/20  text-danger'
          )}>
            <span className={clsx(
              'relative flex h-2 w-2',
            )}>
              {connected && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
              )}
              <span className={clsx(
                'relative inline-flex rounded-full h-2 w-2',
                connected ? 'bg-success' : 'bg-danger'
              )} />
            </span>
            {connected ? 'Canlı' : 'Bağlantı kesildi'}
          </div>

          {lastPoll && (
            <span className="text-[11px] text-muted">
              Son tarama: {lastPoll.toLocaleTimeString('tr-TR')}
            </span>
          )}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          label="Toplam Mention"
          value={stats?.total ?? mentions.length}
          color="text-caramel"
        />
        <StatCard
          label="Olumlu"
          value={stats?.bySentiment?.positive ?? '—'}
          color="text-success"
        />
        <StatCard
          label="Olumsuz"
          value={stats?.bySentiment?.negative ?? '—'}
          color="text-danger"
        />
        <StatCard
          label="Nötr"
          value={stats?.bySentiment?.neutral ?? '—'}
          color="text-warning"
        />
      </div>

      {/* Brand breakdown */}
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
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: brand?.color || '#888' }}
                  />
                  <span className="text-xs text-muted w-28 truncate">
                    {brand?.name || id}
                  </span>
                  <div className="flex-1 h-1.5 rounded-full bg-surface2">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${(count / max) * 100}%`,
                        backgroundColor: brand?.color || '#C4922A',
                      }}
                    />
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

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        {/* Brand */}
        <select
          value={filterBrand}
          onChange={e => setFilterBrand(e.target.value)}
          className="input text-xs py-1.5 pr-7"
        >
          <option value="all">Tüm Markalar</option>
          {BRANDS.map(b => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>

        {/* Sentiment */}
        {['all', 'positive', 'negative', 'neutral'].map(s => (
          <button
            key={s}
            onClick={() => setFilterSentiment(s)}
            className={clsx(
              'px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all',
              filterSentiment === s
                ? 'bg-caramel/20 border-caramel/40 text-caramel'
                : 'border-navy-border text-muted hover:text-white'
            )}
          >
            {s === 'all'
              ? 'Tüm Duygular'
              : `${SENTIMENT_META[s].icon} ${SENTIMENT_META[s].label}`}
          </button>
        ))}

        {/* Source */}
        {['all', 'news', 'gdelt'].map(src => (
          <button
            key={src}
            onClick={() => setFilterSource(src)}
            className={clsx(
              'px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all',
              filterSource === src
                ? 'bg-caramel/20 border-caramel/40 text-caramel'
                : 'border-navy-border text-muted hover:text-white'
            )}
          >
            {src === 'all' ? '📡 Tüm Kaynaklar' : `${SOURCE_META[src]?.icon} ${SOURCE_META[src]?.label}`}
          </button>
        ))}

        {/* Keyword search */}
        <input
          type="text"
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          placeholder="Anahtar kelime ara..."
          className="input text-xs py-1.5 w-44"
        />

        {filtered.length !== mentions.length && (
          <span className="text-[11px] text-muted">
            {filtered.length}/{mentions.length} gösteriliyor
          </span>
        )}
      </div>

      {/* Mention feed */}
      {filtered.length === 0 ? (
        <div className="card text-center py-16">
          {mentions.length === 0 ? (
            <>
              <div className="text-3xl mb-3">📡</div>
              <p className="text-sm font-medium text-white mb-1">Veri bekleniyor…</p>
              <p className="text-xs text-muted">
                {connected
                  ? 'Backend bağlantısı kuruldu. İlk polling tamamlandığında mention\'lar görünecek.'
                  : 'Backend sunucusuna bağlanılamıyor. Lütfen espressolab-scraper\'ı başlatın.'}
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
          {filtered.map(mention => {
            const brand   = BRANDS.find(b => b.id === mention.brandId);
            const sm      = SENTIMENT_META[mention.sentiment] || SENTIMENT_META.neutral;
            const srcMeta = SOURCE_META[mention.sourceType] || { label: mention.sourceType, icon: '📄' };
            const isNew   = mention.id === newFlash;

            return (
              <div
                key={mention.id}
                className={clsx(
                  'flex items-start gap-3 p-3 rounded-xl border transition-all duration-300',
                  isNew
                    ? 'border-success/60 bg-success/5 shadow-glow'
                    : 'border-navy-border bg-surface hover:border-navy-border/80'
                )}
              >
                {/* Brand color dot */}
                <div className="flex-shrink-0 pt-1">
                  <span
                    className="block w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: brand?.color || '#888' }}
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <span className="text-[11px] font-semibold text-white">
                      {brand?.name || mention.brandId}
                    </span>
                    <span className={clsx('text-[10px] font-medium px-1.5 py-0.5 rounded border', sm.bg, sm.color)}>
                      {sm.icon} {sm.label}
                    </span>
                    <span className="text-[10px] text-muted bg-surface2 px-1.5 py-0.5 rounded">
                      {srcMeta.icon} {srcMeta.label}
                    </span>
                    {mention.source && (
                      <span className="text-[10px] text-muted">{mention.source}</span>
                    )}
                    <span className="ml-auto text-[10px] text-muted">
                      {timeAgo(mention.publishedAt || mention.scrapedAt)}
                    </span>
                  </div>

                  {/* Title — clickable */}
                  <a
                    href={mention.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium text-white hover:text-caramel transition-colors leading-snug line-clamp-2"
                  >
                    {mention.title}
                  </a>

                  {mention.snippet && (
                    <p className="text-[11px] text-muted mt-1 leading-relaxed line-clamp-2">
                      {mention.snippet}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
