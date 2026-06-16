import { useState } from 'react';
import clsx from 'clsx';
import { BRANDS } from '../../constants/brands';
import useSocialMonitor from '../../hooks/useSocialMonitor';
import { SENTIMENT_SUMMARY } from '../../data/socialMonitorData';
import { formatLargeNumber } from '../../utils/formatters';

const PLATFORM_META = {
  instagram: { label: 'Instagram', icon: '📸', color: '#E1306C' },
  tiktok:    { label: 'TikTok',    icon: '🎵', color: '#69C9D0' },
  twitter:   { label: 'Twitter/X', icon: '🐦', color: '#1DA1F2' },
  facebook:  { label: 'Facebook',  icon: '📘', color: '#1877F2' },
};
const TYPE_META = {
  reel:  { label: 'Reel',  icon: '🎬' },
  video: { label: 'Video', icon: '▶️' },
  post:  { label: 'Gönderi', icon: '🖼️' },
  story: { label: 'Hikaye', icon: '⭕' },
};
const SENTIMENT_COLOR = { positive: 'text-success', neutral: 'text-warning', negative: 'text-danger' };
const SENTIMENT_ICON  = { positive: '😊', neutral: '😐', negative: '😟' };

function timeAgo(dateStr) {
  const diff = Math.floor((new Date() - new Date(dateStr)) / 1000);
  if (diff < 60) return `${diff}s önce`;
  if (diff < 3600) return `${Math.floor(diff / 60)}dk önce`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}sa önce`;
  return `${Math.floor(diff / 86400)}g önce`;
}

function SentimentBar({ brand }) {
  const s = SENTIMENT_SUMMARY[brand];
  if (!s) return null;
  return (
    <div className="flex items-center gap-1.5 w-full h-2 rounded-full overflow-hidden">
      <div className="h-full bg-success rounded-l-full" style={{ width: `${s.positive}%` }} />
      <div className="h-full bg-warning" style={{ width: `${s.neutral}%` }} />
      <div className="h-full bg-danger rounded-r-full" style={{ width: `${s.negative}%` }} />
    </div>
  );
}

export default function LiveMonitor() {
  const { posts, comments, teasers, liveMetrics, lastUpdate, newCommentFlash } = useSocialMonitor(7000);
  const [filterPlatform, setFilterPlatform] = useState('all');
  const [filterBrand, setFilterBrand] = useState('all');
  const [tab, setTab] = useState('feed'); // feed | comments | teasers | sentiment

  const filteredPosts = posts.filter(p =>
    (filterPlatform === 'all' || p.platform === filterPlatform) &&
    (filterBrand === 'all' || p.brand === filterBrand)
  );

  const filteredComments = comments.filter(c =>
    filterBrand === 'all' || c.brand === filterBrand
  );

  return (
    <div className="space-y-4">
      {/* Header bar */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-success" />
          </span>
          <span className="text-sm font-semibold text-white">Canlı İzleme</span>
          <span className="text-xs text-muted">Son güncelleme: {lastUpdate.toLocaleTimeString('tr-TR')}</span>
        </div>
        <div className="flex items-center gap-1.5 bg-blue-900/20 border border-blue-500/20 rounded-lg px-3 py-1.5">
          <span className="text-blue-400 text-xs">🔌</span>
          <span className="text-[11px] text-blue-300">Üretim: Instagram Graph API + TikTok API + Twitter API v2 bağlanmalı</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-surface2 rounded-xl p-1 w-fit">
        {[
          { key: 'feed',      label: 'İçerik Akışı',  icon: '📡' },
          { key: 'comments',  label: 'Yorumlar',       icon: '💬' },
          { key: 'teasers',   label: 'Teaser\'lar',    icon: '🔮' },
          { key: 'sentiment', label: 'Duygu Analizi',  icon: '🧠' },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={clsx(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
              tab === t.key ? 'bg-caramel text-espresso' : 'text-muted hover:text-white'
            )}
          >
            <span>{t.icon}</span>{t.label}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        {/* Platform filter */}
        <div className="flex gap-1">
          {['all', 'instagram', 'tiktok', 'twitter', 'facebook'].map(p => (
            <button
              key={p}
              onClick={() => setFilterPlatform(p)}
              className={clsx(
                'px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all',
                filterPlatform === p
                  ? 'bg-caramel/20 border-caramel/40 text-caramel'
                  : 'border-navy-border text-muted hover:text-white'
              )}
            >
              {p === 'all' ? 'Tüm Platformlar' : `${PLATFORM_META[p]?.icon} ${PLATFORM_META[p]?.label}`}
            </button>
          ))}
        </div>
        {/* Brand filter */}
        <select
          value={filterBrand}
          onChange={e => setFilterBrand(e.target.value)}
          className="input text-xs py-1.5 pr-6"
        >
          <option value="all">Tüm Markalar</option>
          {BRANDS.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
      </div>

      {/* ── FEED TAB ─────────────────────────────────────────────────────────── */}
      {tab === 'feed' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredPosts.map(post => {
            const brand = BRANDS.find(b => b.id === post.brand);
            const m = liveMetrics[post.id] || {};
            const pm = PLATFORM_META[post.platform];
            const tm = TYPE_META[post.type] || { label: post.type, icon: '📄' };
            return (
              <div
                key={post.id}
                className={clsx(
                  'card-hover relative overflow-hidden',
                  post.isOwn && 'border-caramel/40',
                  post.trending && 'border-success/30'
                )}
              >
                {post.isOwn && <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-caramel to-transparent" />}
                {/* Header */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="h-2.5 w-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: brand?.color }} />
                  <span className={clsx('text-xs font-bold', post.isOwn ? 'text-caramel' : 'text-white')}>{brand?.name}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ backgroundColor: `${pm?.color}20`, color: pm?.color }}>
                    {pm?.icon} {pm?.label}
                  </span>
                  <span className="text-[10px] bg-surface2 text-muted px-1.5 py-0.5 rounded">{tm.icon} {tm.label}</span>
                  {post.trending && <span className="text-[10px] bg-success/20 text-success px-1.5 py-0.5 rounded animate-pulse-slow">🔥 Trend</span>}
                  <span className="ml-auto text-[10px] text-muted">{timeAgo(post.postedAt)}</span>
                </div>
                {/* Content */}
                <p className="text-xs text-muted leading-relaxed mb-3 line-clamp-3">{post.content}</p>
                {/* Live metrics */}
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { icon: '❤️', val: m.likes || post.likes, label: 'Beğeni' },
                    { icon: '💬', val: m.comments || post.comments, label: 'Yorum' },
                    { icon: '↗️', val: m.shares || post.shares, label: 'Paylaşım' },
                    { icon: '👁', val: m.views || post.views, label: 'İzlenme' },
                  ].map(({ icon, val, label }) => val != null ? (
                    <div key={label} className="text-center bg-surface2/50 rounded-lg py-1.5">
                      <div className="text-sm">{icon}</div>
                      <div className="text-xs font-bold text-white">{formatLargeNumber(val)}</div>
                      <div className="text-[9px] text-muted">{label}</div>
                    </div>
                  ) : null)}
                </div>
              </div>
            );
          })}
          {filteredPosts.length === 0 && (
            <div className="col-span-2 card text-center py-12">
              <p className="text-muted text-sm">Seçilen filtreler için içerik bulunamadı.</p>
            </div>
          )}
        </div>
      )}

      {/* ── COMMENTS TAB ─────────────────────────────────────────────────────── */}
      {tab === 'comments' && (
        <div className="space-y-2">
          {filteredComments.slice(0, 25).map(comment => {
            const brand = BRANDS.find(b => b.id === comment.brand);
            const pm = PLATFORM_META[comment.platform];
            const isFlashing = comment.id === newCommentFlash;
            return (
              <div
                key={comment.id}
                className={clsx(
                  'flex items-start gap-3 p-3 rounded-xl border transition-all',
                  isFlashing ? 'border-success/60 bg-success/5 shadow-glow' : 'border-navy-border bg-surface',
                  comment.isLive && 'border-l-2 border-l-success'
                )}
              >
                {/* Brand dot + platform */}
                <div className="flex flex-col items-center gap-1 flex-shrink-0 pt-0.5">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: brand?.color }} />
                  <span className="text-xs">{pm?.icon}</span>
                </div>
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[11px] font-semibold text-muted">{comment.user}</span>
                    <span className={clsx('text-[10px] font-medium', SENTIMENT_COLOR[comment.sentiment])}>
                      {SENTIMENT_ICON[comment.sentiment]} {comment.sentiment === 'positive' ? 'Olumlu' : comment.sentiment === 'neutral' ? 'Nötr' : 'Olumsuz'}
                    </span>
                    <span className="ml-auto text-[10px] text-muted">{timeAgo(comment.postedAt)}</span>
                  </div>
                  <p className="text-xs text-white leading-relaxed">{comment.text}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] text-muted">❤️ {comment.likes}</span>
                    <span className="text-[10px] text-muted">{brand?.name}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── TEASERS TAB ──────────────────────────────────────────────────────── */}
      {tab === 'teasers' && (
        <div className="space-y-3">
          <div className="flex items-start gap-2 bg-warning/10 border border-warning/20 rounded-xl p-3">
            <span className="text-base">🔮</span>
            <p className="text-xs text-warning leading-relaxed">
              Bu bölüm rakip sosyal medya hesaplarında tespit edilen <strong>teaser paylaşımları</strong>nı gösterir.
              OSINT metodolojisiyle yaklaşan ürün sinyalleri değerlendirilir. Doğruluk garantisi verilmez.
            </p>
          </div>
          {teasers.map(teaser => {
            const brand = BRANDS.find(b => b.id === teaser.brand);
            const pm = PLATFORM_META[teaser.platform];
            return (
              <div key={teaser.id} className="card-hover border-warning/30">
                <div className="flex items-center gap-2 mb-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: brand?.color }} />
                  <span className="text-xs font-bold text-white">{brand?.name}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ backgroundColor: `${pm?.color}20`, color: pm?.color }}>
                    {pm?.icon} {pm?.label}
                  </span>
                  <span className="ml-auto text-[10px] text-muted">{timeAgo(teaser.postedAt)}</span>
                </div>
                <p className="text-xs text-muted italic mb-2">"{teaser.content}"</p>
                <div className="flex items-center justify-between bg-warning/10 rounded-lg px-3 py-2">
                  <div>
                    <span className="text-[10px] text-muted">Ürün Sinyali: </span>
                    <span className="text-xs font-semibold text-warning">{teaser.productHint}</span>
                  </div>
                  <span className={clsx(
                    'text-xs font-bold',
                    teaser.osintConfidence >= 80 ? 'text-success' :
                    teaser.osintConfidence >= 60 ? 'text-warning' : 'text-danger'
                  )}>
                    %{teaser.osintConfidence} güven
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── SENTIMENT TAB ────────────────────────────────────────────────────── */}
      {tab === 'sentiment' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {BRANDS.map(brand => {
            const s = SENTIMENT_SUMMARY[brand.id];
            if (!s) return null;
            return (
              <div key={brand.id} className={clsx('card', brand.isOwn && 'border-caramel/40')}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: brand.color }} />
                  <span className={clsx('text-sm font-bold', brand.isOwn ? 'text-caramel' : 'text-white')}>
                    {brand.name}
                  </span>
                  <span className={clsx(
                    'ml-auto text-sm font-bold',
                    s.score >= 80 ? 'text-success' : s.score >= 65 ? 'text-warning' : 'text-danger'
                  )}>
                    {s.score}/100
                  </span>
                </div>
                <SentimentBar brand={brand.id} />
                <div className="flex justify-between mt-2 text-[10px]">
                  <span className="text-success">😊 {s.positive}%</span>
                  <span className="text-warning">😐 {s.neutral}%</span>
                  <span className="text-danger">😟 {s.negative}%</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
