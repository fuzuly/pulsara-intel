import { useState, useMemo } from 'react';
import SectionHeader from '../components/common/SectionHeader';
import DataFreshnessBar from '../components/common/DataFreshnessBar';
import { BRANDS, BRAND_MAP } from '../constants/brands';
import { NEWS_CATEGORIES } from '../data/newsData';
import useNewsData from '../hooks/useNewsData';
import clsx from 'clsx';

const SENTIMENT_STYLE = {
  positive: { badge: 'bg-success/20 text-success border-success/30', dot: 'bg-success', label: '📈 Olumlu' },
  neutral:  { badge: 'bg-muted/20 text-muted border-muted/30',       dot: 'bg-muted',   label: '➡️ Nötr' },
  negative: { badge: 'bg-danger/20 text-danger border-danger/30',    dot: 'bg-danger',  label: '📉 Olumsuz' },
};

const CATEGORY_COLORS = {
  expansion:   'bg-blue-500/20 text-blue-300',
  controversy: 'bg-red-500/20 text-red-300',
  financial:   'bg-green-500/20 text-green-300',
  milestone:   'bg-yellow-500/20 text-yellow-300',
  sector:      'bg-purple-500/20 text-purple-300',
  corporate:   'bg-orange-500/20 text-orange-300',
  product:     'bg-pink-500/20 text-pink-300',
};

function timeAgo(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now - d) / 86400000);
  if (diffDays === 0) return 'Bugün';
  if (diffDays === 1) return 'Dün';
  if (diffDays < 7)  return `${diffDays} gün önce`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} hafta önce`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} ay önce`;
  return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function BreakingNews() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedSentiment, setSelectedSentiment] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { articles: liveArticles, loading: liveLoading, error: liveError, lastFetched, refetch: refetchNews } = useNewsData();

  const allNews = useMemo(() => liveArticles, [liveArticles]);

  const filtered = useMemo(() => {
    return allNews.filter(n => {
      if (selectedCategory === 'breaking') return n.isBreaking;
      if (selectedCategory !== 'all' && n.category !== selectedCategory) return false;
      if (selectedBrand !== 'all' && n.brand !== selectedBrand) return false;
      if (selectedSentiment !== 'all' && n.sentiment !== selectedSentiment) return false;
      if (searchQuery && !n.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !n.summary.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    }).sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [allNews, selectedCategory, selectedBrand, selectedSentiment, searchQuery]);

  const breakingCount = allNews.filter(n => n.isBreaking).length;
  const liveCount    = liveArticles.length;
  const positiveCount = allNews.filter(n => n.sentiment === 'positive').length;
  const negativeCount = allNews.filter(n => n.sentiment === 'negative').length;

  return (
    <div className="space-y-6 animate-fade-in">
      <SectionHeader
        title="Haber Akışı"
        subtitle="NewsData.io üzerinden canlı haber akışı — yalnızca doğrulanmış kaynaklar"
      />
      <DataFreshnessBar
        sources={[{ label: 'NewsData.io' }, { label: 'WCP' }, { label: 'Horeca Trend' }]}
        interval={300_000}
        onRefresh={refetchNews}
      />

      {/* Canlı API durumu */}
      {liveLoading && (
        <div className="flex items-center gap-2 text-xs text-muted bg-surface2 border border-navy-border rounded-lg px-4 py-2">
          <span className="animate-spin text-caramel">⟳</span>
          NewsData.io'dan canlı haberler yükleniyor...
        </div>
      )}
      {liveError && (
        <div className="flex items-center gap-2 text-xs text-warning bg-warning/10 border border-warning/20 rounded-lg px-4 py-2">
          ⚠️ Canlı haber API hatası: {liveError} — Statik haberler gösteriliyor.
        </div>
      )}
      {!liveLoading && !liveError && liveCount > 0 && (
        <div className="flex items-center gap-2 text-xs text-success bg-success/10 border border-success/20 rounded-lg px-4 py-2">
          <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
          {liveCount} gerçek zamanlı haber yüklendi — {lastFetched?.toLocaleTimeString('tr-TR')}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Toplam Haber', value: allNews.length,  color: 'text-info',    bg: 'border-info/20',    icon: '📰' },
          { label: 'Canlı Haber',  value: liveCount,       color: 'text-success', bg: 'border-success/20', icon: '🟢' },
          { label: 'Olumlu Haber', value: positiveCount,   color: 'text-success', bg: 'border-success/20', icon: '📈' },
          { label: 'Olumsuz Haber',value: negativeCount,   color: 'text-danger',  bg: 'border-danger/20',  icon: '📉' },
        ].map(s => (
          <div key={s.label} className={`card border ${s.bg}`}>
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-muted">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card space-y-3">
        {/* Search */}
        <input
          type="text"
          placeholder="🔍 Haber ara..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="input w-full"
        />

        {/* Category tabs */}
        <div className="flex flex-wrap gap-1.5">
          {NEWS_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={clsx(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all',
                selectedCategory === cat.id
                  ? 'bg-caramel/20 border-caramel/50 text-caramel'
                  : 'border-navy-border text-muted hover:text-white hover:border-navy-border/80'
              )}
            >
              <span>{cat.icon}</span>{cat.label}
              {cat.id === 'breaking' && (
                <span className="ml-1 bg-danger text-white rounded-full px-1.5 py-0.5 text-[9px] font-bold">{breakingCount}</span>
              )}
            </button>
          ))}
        </div>

        {/* Brand + sentiment row */}
        <div className="flex flex-wrap gap-3 items-center">
          <select value={selectedBrand} onChange={e => setSelectedBrand(e.target.value)} className="input text-xs py-1.5">
            <option value="all">Tüm Markalar</option>
            <option value="">Sektörel Haberler</option>
            {BRANDS.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>

          <div className="flex gap-1">
            {['all', 'positive', 'neutral', 'negative'].map(s => (
              <button
                key={s}
                onClick={() => setSelectedSentiment(s)}
                className={clsx(
                  'px-2.5 py-1 rounded-lg text-xs border transition-all',
                  selectedSentiment === s
                    ? s === 'positive' ? 'bg-success/20 border-success/40 text-success'
                    : s === 'negative' ? 'bg-danger/20 border-danger/40 text-danger'
                    : s === 'neutral' ? 'bg-muted/20 border-muted/40 text-muted'
                    : 'bg-caramel/20 border-caramel/40 text-caramel'
                    : 'border-navy-border text-muted hover:text-white'
                )}
              >
                {s === 'all' ? '🔀 Tümü' : s === 'positive' ? '📈 Olumlu' : s === 'negative' ? '📉 Olumsuz' : '➡️ Nötr'}
              </button>
            ))}
          </div>

          <span className="ml-auto text-xs text-muted">{filtered.length} haber gösteriliyor</span>
        </div>
      </div>

      {/* News Feed */}
      <div className="space-y-3">
        {filtered.map(news => {
          const brand = news.brand ? BRAND_MAP[news.brand] : null;
          const ss = SENTIMENT_STYLE[news.sentiment];
          const catColor = CATEGORY_COLORS[news.category] || 'bg-surface2 text-muted';

          return (
            <div
              key={news.id}
              className={clsx(
                'card-hover relative',
                news.isBreaking && 'border-danger/40',
                brand?.isOwn && 'border-caramel/30'
              )}
            >
              {news.isBreaking && (
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-danger via-warning to-danger animate-pulse" />
              )}
              <div className="flex items-start gap-4">
                {/* Left: brand dot + date */}
                <div className="flex flex-col items-center gap-1 flex-shrink-0 pt-1">
                  <div className={clsx('h-3 w-3 rounded-full', ss.dot)} />
                  {brand && <div className="h-4 w-0.5 bg-navy-border" />}
                  {brand && (
                    <span
                      className="text-[9px] font-bold uppercase"
                      style={{ color: brand.color, writingMode: 'vertical-rl', transform: 'rotate(180deg)', letterSpacing: '0.05em' }}
                    >
                      {brand.shortName}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2 mb-1 flex-wrap">
                    {news.isLive && (
                      <span className="badge bg-success/20 text-success border border-success/30 text-[10px]">
                        🟢 CANLI
                      </span>
                    )}
                    {news.isBreaking && (
                      <span className="badge bg-danger/20 text-danger border border-danger/30 animate-pulse-slow text-[10px]">
                        🔴 SON DAKİKA
                      </span>
                    )}
                    {brand && (
                      <span className="badge text-[10px] font-semibold" style={{ backgroundColor: `${brand.color}20`, color: brand.color }}>
                        {brand.name}
                      </span>
                    )}
                    {!brand && (
                      <span className="badge bg-purple-500/20 text-purple-300 text-[10px]">☕ Sektörel</span>
                    )}
                    <span className={`badge text-[10px] ${catColor}`}>
                      {NEWS_CATEGORIES.find(c => c.id === news.category)?.icon} {NEWS_CATEGORIES.find(c => c.id === news.category)?.label}
                    </span>
                    <span className={`badge text-[10px] border ${ss.badge}`}>{ss.label}</span>
                  </div>

                  <h3 className={clsx(
                    'text-sm font-semibold mb-1 leading-snug',
                    brand?.isOwn ? 'text-caramel' : 'text-white'
                  )}>
                    {news.title}
                  </h3>
                  <p className="text-xs text-muted leading-relaxed mb-2">{news.summary}</p>

                  <div className="flex items-center gap-4 text-[10px]">
                    <span className="text-muted">📅 {new Date(news.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    <span className="text-muted">({timeAgo(news.date)})</span>
                    <span className="text-info">📡 {news.source}</span>
                    {news.url && (
                      <a
                        href={news.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-caramel hover:underline ml-auto flex items-center gap-1"
                      >
                        Kaynağa Git →
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="card text-center py-16">
            <div className="text-4xl mb-4">📭</div>
            <p className="text-muted text-sm">Seçilen filtrelere uygun haber bulunamadı.</p>
          </div>
        )}
      </div>

      {/* Source disclaimer */}
      <div className="flex items-start gap-3 bg-blue-900/20 border border-blue-500/20 rounded-xl p-3 text-xs">
        <span className="text-blue-400 text-base mt-0.5">🔍</span>
        <p className="text-muted">
          <strong className="text-blue-300">Kaynaklar: </strong>
          Tüm haberler doğrulanmış medya kaynaklarından alınmıştır:
          World Coffee Portal, Perfect Daily Grind, Hospitality & Catering News, Greek City Times,
          Horeca Trend, Turkish Minute, Food Navigator, CBS News, Dünya Gazetesi, Ticaret Gazetesi.
          Canlı haberler NewsData.io API ile gerçek zamanlı olarak alınmaktadır (5 dakikada bir güncellenir). Statik haberler WCP, Horeca Trend ve doğrulanmış medya kaynaklarından alınmıştır.
        </p>
      </div>
    </div>
  );
}
