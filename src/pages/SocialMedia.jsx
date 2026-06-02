import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, ScatterChart, Scatter, ZAxis,
} from 'recharts';
import SectionHeader from '../components/common/SectionHeader';
import DataFreshnessBar from '../components/common/DataFreshnessBar';
import { BRAND_MAP } from '../constants/brands';
import { formatLargeNumber } from '../utils/formatters';
import instagramProfiles from '../data/instagramProfiles.json';
import instagramPosts from '../data/instagramPosts.json';
import googleMapsRatings from '../data/googleMapsRatings.json';
import sentimentData from '../data/sentimentData.json';
import clsx from 'clsx';

const USERNAME_TO_BRAND = {
  espressolabtr:       'espressolab',
  coffy_tr:            'coffy',
  starbucks_tr:        'starbucks',
  kahvedunyasi:        'kahvedunyasi',
  gjcsturkey:          'gloriajeans',
  caffeneroturkiye:    'caffenero',
  guacoffeecompany:    'gua',
  luuqcoffee:          'luuq',
  mikelcoffee_tr:      'mikel',
  'nevadacoffee.tr':   'nevada',
  'laos.coffee':       'laos',
};

const igData = instagramProfiles.map(p => {
  const post = instagramPosts.find(x => x.username === p.username) || {};
  const brandId = USERNAME_TO_BRAND[p.username];
  const brand = BRAND_MAP[brandId] || {};
  return {
    username: p.username,
    brandId,
    brandName: brand.name || p.username,
    color: brand.color || '#8B9BB4',
    isOwn: brand.isOwn || false,
    shortName: brand.shortName || p.username.slice(0, 5),
    followers: p.followers,
    posts: p.posts,
    avgLikes: post.avgLikes || 0,
    avgComments: post.avgComments || 0,
    engagementRate: post.engagementRate || 0,
    maxLikes: post.maxLikes || 0,
    maxViews: post.maxViews || null,
    verified: p.verified ?? false,
    isBusinessAccount: p.isBusinessAccount ?? false,
    following: p.following ?? 0,
  };
}).sort((a, b) => b.engagementRate - a.engagementRate);

const mapsData = googleMapsRatings.map(d => {
  const brand = BRAND_MAP[d.brand] || {};
  return {
    ...d,
    brandName: brand.name || d.brand,
    color: brand.color || '#8B9BB4',
    isOwn: brand.isOwn || false,
    shortName: brand.shortName || d.brand,
  };
}).sort((a, b) => b.rating - a.rating);

const sentChartData = sentimentData.map(d => {
  const brand = BRAND_MAP[d.brand] || {};
  return {
    name: brand.shortName || d.brand,
    fullName: brand.name || d.brand,
    color: brand.color || '#8B9BB4',
    isOwn: brand.isOwn || false,
    positive: d.positive,
    neutral: d.neutral,
    negative: d.negative,
    topComplaints: d.topComplaints,
    topPraises: d.topPraises,
  };
}).sort((a, b) => b.positive - a.positive);

const own = igData.find(d => d.isOwn);
const ownRank = igData.findIndex(d => d.isOwn) + 1;
const ownMaps = mapsData.find(d => d.isOwn);
const ownSent = sentChartData.find(d => d.isOwn);

const TREND_ICON = { up: '↑', down: '↓', stable: '→' };
const TREND_COLOR = { up: 'text-success', down: 'text-danger', stable: 'text-muted' };

function StarRating({ rating }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <span className="text-yellow-400 text-sm">
      {'★'.repeat(full)}{half ? '½' : ''}{'☆'.repeat(5 - full - (half ? 1 : 0))}
    </span>
  );
}

function RiskLight({ rating, trend }) {
  const red = rating < 4.0 || (rating < 4.2 && trend === 'down');
  const yellow = !red && (rating < 4.3 || trend === 'down');
  return (
    <span className={clsx(
      'inline-block h-3 w-3 rounded-full',
      red ? 'bg-danger' : yellow ? 'bg-warning' : 'bg-success'
    )} />
  );
}

const IgTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-surface border border-navy-border rounded-lg px-3 py-2 shadow-xl text-xs">
      <p className="font-semibold text-white mb-1">@{d.username}</p>
      <p style={{ color: d.color }}>Takipçi: {formatLargeNumber(d.followers)}</p>
      <p className="text-success font-bold">Etkileşim: %{d.engagementRate}</p>
      <p className="text-muted">Gönderi: {d.posts}</p>
    </div>
  );
};

const EngTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-surface border border-navy-border rounded-lg px-3 py-2 shadow-xl text-xs">
      <p className="font-semibold text-white">{d.brandName}</p>
      <p className="text-success font-bold">%{d.engagementRate} etkileşim</p>
      <p className="text-muted">Ort. beğeni: {formatLargeNumber(d.avgLikes)}</p>
    </div>
  );
};

const SentTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface border border-navy-border rounded-lg px-3 py-2 shadow-xl text-xs">
      <p className="font-semibold text-white mb-1">{label}</p>
      {payload.map(p => (
        <p key={p.dataKey} style={{ color: p.fill }}>%{p.value} {p.name}</p>
      ))}
    </div>
  );
};

export default function SocialMedia() {
  return (
    <div className="space-y-10 animate-fade-in">
      <DataFreshnessBar
        sources={[{ label: 'Instagram (Public)' }, { label: 'Google Maps' }, { label: 'BoomSocial' }]}
        interval={3_600_000}
      />
      <SectionHeader
        title="Sosyal Medya & İtibar Analizi"
        subtitle="Instagram performansı · Google Maps itibarı · Duygu analizi — Mayıs 2026"
      />

      {/* ── SECTION 1: Instagram ─────────────────────────────────── */}
      <section className="space-y-5">
        <h2 className="text-base font-bold text-white border-b border-navy-border pb-2 flex items-center gap-2">
          <span>📸</span> Instagram Performansı
        </h2>

        {/* KPI row */}
        {own && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Espressolab Takipçi',   value: formatLargeNumber(own.followers),      color: 'text-caramel', icon: '👥' },
              { label: 'Etkileşim Oranı',        value: `%${own.engagementRate}`,              color: 'text-success', icon: '💬' },
              { label: 'Etkileşim Sıralaması',   value: `#${ownRank} / ${igData.length}`,     color: 'text-success', icon: '🏆' },
              { label: 'Takip Edilen Hesap',     value: igData.length,                         color: 'text-info',    icon: '📊' },
            ].map(k => (
              <div key={k.label} className="card">
                <div className="text-2xl mb-1">{k.icon}</div>
                <div className={`text-2xl font-bold ${k.color}`}>{k.value}</div>
                <div className="text-xs text-muted">{k.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Öne Çıkan Bulgular */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {[
            { icon: '🏆', color: 'text-success',  border: 'border-success/20',     title: 'Espressolab Açık Ara Lider',      desc: '%1.28 etkileşim · 52.736 max beğeni (viral post) — sektörün en yüksek engagement oranı' },
            { icon: '📉', color: 'text-danger',   border: 'border-danger/20',      title: 'Gloria Jean\'s: Boş Kalabalık',   desc: '61.749 takipçiyle %0.11 etkileşim — içerik stratejisi çalışmıyor, pazar fırsatı var' },
            { icon: '💬', color: 'text-warning',  border: 'border-warning/20',     title: 'Nevada: Tartışmalı İçerik',       desc: 'Ort. 46 yorum — like oranı düşük ama yorum yüksek, negatif tartışma riski taşıyor' },
            { icon: '🔍', color: 'text-blue-400', border: 'border-blue-500/20',    title: 'Mikel: Like Gizleme Anomalisi',   desc: 'Ort. 1 beğeni · 104 yorum — Instagram like gizleme politikası uyguluyor olabilir' },
            { icon: '💡', color: 'text-caramel',  border: 'border-caramel/20',     title: 'GUA: Az Takipçi, Güçlü Etki',    desc: '15.651 takipçiyle %0.82 etkileşim — Kahve Dünyası\'nın etkileşim oranını geçiyor' },
          ].map(f => (
            <div key={f.title} className={`card border ${f.border}`}>
              <div className="flex items-start gap-2">
                <span className="text-lg flex-shrink-0">{f.icon}</span>
                <div>
                  <p className={`text-xs font-semibold ${f.color} mb-1`}>{f.title}</p>
                  <p className="text-[11px] text-muted leading-relaxed">{f.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          {/* Engagement bar chart */}
          <div className="card">
            <h3 className="text-sm font-semibold text-white mb-3">Etkileşim Oranı Karşılaştırması (%)</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={igData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A3A55" />
                <XAxis dataKey="shortName" tick={{ fill: '#8B9BB4', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#8B9BB4', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `%${v}`} />
                <Tooltip content={<EngTooltip />} />
                <Bar dataKey="engagementRate" radius={[4, 4, 0, 0]}>
                  {igData.map(d => (
                    <Cell key={d.username} fill={d.color} opacity={d.isOwn ? 1 : 0.65} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Scatter: followers vs engagement, bubble=posts */}
          <div className="card">
            <h3 className="text-sm font-semibold text-white mb-1">Takipçi × Etkileşim (kabarcık = gönderi sayısı)</h3>
            <p className="text-[10px] text-muted mb-3">Sol-üst: az takipçi, yüksek etkileşim = verimli içerik stratejisi</p>
            <ResponsiveContainer width="100%" height={245}>
              <ScatterChart margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A3A55" />
                <XAxis
                  dataKey="followers"
                  name="Takipçi"
                  type="number"
                  tick={{ fill: '#8B9BB4', fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={v => formatLargeNumber(v)}
                />
                <YAxis
                  dataKey="engagementRate"
                  name="Etkileşim"
                  type="number"
                  tick={{ fill: '#8B9BB4', fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={v => `%${v}`}
                />
                <ZAxis dataKey="posts" range={[50, 500]} />
                <Tooltip content={<IgTooltip />} />
                {igData.map(d => (
                  <Scatter key={d.username} name={d.brandName} data={[d]} fill={d.color} opacity={d.isOwn ? 1 : 0.7} />
                ))}
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detail table */}
        <div className="card">
          <h3 className="text-sm font-semibold text-white mb-4">Instagram Hesap Detay Tablosu</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-navy-border">
                  {['Hesap', 'Takipçi', 'Takip', 'Gönderi', 'Ort. Beğeni', 'Max Beğeni', 'Ort. Yorum', 'Etkileşim', 'Max Görüntülenme', 'Doğrulandı', 'Hesap Türü'].map(h => (
                    <th key={h} className="table-header py-3 px-3 text-left whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {igData.map(d => (
                  <tr key={d.username} className={clsx('table-row', d.isOwn && 'bg-caramel/5')}>
                    <td className="table-cell">
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                        <span className={clsx('font-semibold', d.isOwn ? 'text-caramel' : 'text-white')}>
                          {d.brandName}
                        </span>
                              </div>
                      <div className="text-[10px] text-muted mt-0.5">@{d.username}</div>
                    </td>
                    <td className="table-cell text-white font-medium">{formatLargeNumber(d.followers)}</td>
                    <td className="table-cell text-muted">{d.following.toLocaleString('tr-TR')}</td>
                    <td className="table-cell text-muted">{d.posts.toLocaleString('tr-TR')}</td>
                    <td className="table-cell text-white">{formatLargeNumber(d.avgLikes)}</td>
                    <td className="table-cell text-white">{formatLargeNumber(d.maxLikes)}</td>
                    <td className="table-cell text-muted">{d.avgComments}</td>
                    <td className="table-cell">
                      <span className={clsx(
                        'font-bold',
                        d.engagementRate >= 2 ? 'text-success'
                          : d.engagementRate >= 1 ? 'text-warning'
                          : 'text-danger'
                      )}>
                        %{d.engagementRate}
                      </span>
                    </td>
                    <td className="table-cell text-muted">
                      {d.maxViews ? formatLargeNumber(d.maxViews) : '—'}
                    </td>
                    <td className="table-cell">
                      {d.verified
                        ? <span className="text-xs font-semibold text-blue-400 bg-blue-400/10 border border-blue-400/30 rounded-full px-2 py-0.5">✓ Doğrulandı</span>
                        : <span className="text-xs text-muted">—</span>}
                    </td>
                    <td className="table-cell">
                      {d.isBusinessAccount
                        ? <span className="text-xs font-semibold text-success bg-success/10 border border-success/20 rounded-full px-2 py-0.5">İşletme</span>
                        : <span className="text-xs text-muted bg-muted/10 border border-muted/20 rounded-full px-2 py-0.5">Kişisel</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[10px] text-muted mt-3">
            ✅ Veriler BoomSocial.com ve Instagram Public API ile doğrulanmıştır (Mayıs 2026).
            Etkileşim = (beğeni + yorum) / takipçi × 100.
          </p>
        </div>
      </section>

      {/* ── SECTION 2: Google Maps ───────────────────────────────── */}
      <section className="space-y-5">
        <h2 className="text-base font-bold text-white border-b border-navy-border pb-2 flex items-center gap-2">
          <span>🗺️</span> Google Maps İtibar Skoru
        </h2>

        {/* Critical alert */}
        {mapsData.find(d => d.brand === 'kahvedunyasi') && (
          <div className="flex items-start gap-3 bg-danger/10 border border-danger/30 rounded-xl px-4 py-3">
            <span className="text-danger text-xl flex-shrink-0">⚠️</span>
            <div>
              <p className="text-sm font-semibold text-danger mb-0.5">Kritik: Kahve Dünyası İtibar Riski</p>
              <p className="text-xs text-white/80">
                Google Maps ortalaması <strong className="text-danger">3.64 ⭐</strong> ile en düşük seviyede ve düşüş eğiliminde.
                67.200+ yorum — personel tutarsızlığı ve temizlik şikayetleri dominant.
                Rakipler için <strong className="text-success">pazar fırsatı</strong>: müşteri memnuniyeti öne çıkarılmalı.
              </p>
            </div>
          </div>
        )}

        {/* Rating cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-3">
          {mapsData.map(d => (
            <div key={d.brand} className={clsx('card text-center', d.isOwn && 'border-caramel/30')}>
              <div className="text-xs font-semibold mb-2 truncate" style={{ color: d.color }}>{d.shortName}</div>
              <div className={clsx('text-2xl font-bold mb-1', d.isOwn ? 'text-caramel' : 'text-white')}>
                {d.rating}
              </div>
              <StarRating rating={d.rating} />
              <div className={clsx('text-xs font-semibold mt-1', TREND_COLOR[d.ratingTrend])}>
                {TREND_ICON[d.ratingTrend]} {d.ratingTrend === 'up' ? 'Yükseliyor' : d.ratingTrend === 'down' ? 'Düşüyor' : 'Stabil'}
              </div>
              <div className="text-[10px] text-muted mt-1">{formatLargeNumber(d.reviewCount)} yorum</div>
            </div>
          ))}
        </div>

        {/* Risk traffic light table */}
        <div className="card">
          <h3 className="text-sm font-semibold text-white mb-4">İtibar Risk Tablosu</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-navy-border">
                  {['Marka', 'Puan', 'Trend', 'Yorum Sayısı', 'Şube', 'Risk Seviyesi'].map(h => (
                    <th key={h} className="table-header py-3 px-3 text-left whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mapsData.map(d => {
                  const isRed = d.rating < 4.0 || (d.rating < 4.2 && d.ratingTrend === 'down');
                  const isYellow = !isRed && (d.rating < 4.3 || d.ratingTrend === 'down');
                  const riskLabel = isRed ? 'Yüksek Risk' : isYellow ? 'Orta Risk' : 'Düşük Risk';
                  return (
                    <tr key={d.brand} className={clsx('table-row', d.isOwn && 'bg-caramel/5')}>
                      <td className="table-cell">
                        <div className="flex items-center gap-2">
                          <span className="h-2.5 w-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                          <span className={clsx('font-semibold', d.isOwn ? 'text-caramel' : 'text-white')}>
                            {d.brandName}
                          </span>
                                  </div>
                      </td>
                      <td className="table-cell">
                        <span className={clsx('font-bold', d.rating >= 4.4 ? 'text-success' : d.rating >= 4.0 ? 'text-warning' : 'text-danger')}>
                          {d.rating} ⭐
                        </span>
                      </td>
                      <td className={clsx('table-cell font-semibold', TREND_COLOR[d.ratingTrend])}>
                        {TREND_ICON[d.ratingTrend]} {d.ratingTrend === 'up' ? 'Artıyor' : d.ratingTrend === 'down' ? 'Azalıyor' : 'Stabil'}
                      </td>
                      <td className="table-cell text-muted">{d.reviewCount.toLocaleString('tr-TR')}</td>
                      <td className="table-cell text-muted">{d.branches}</td>
                      <td className="table-cell">
                        <div className="flex items-center gap-2">
                          <RiskLight rating={d.rating} trend={d.ratingTrend} />
                          <span className={clsx('text-xs font-semibold', isRed ? 'text-danger' : isYellow ? 'text-warning' : 'text-success')}>
                            {riskLabel}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── SECTION 3: Sentiment ─────────────────────────────────── */}
      <section className="space-y-5">
        <h2 className="text-base font-bold text-white border-b border-navy-border pb-2 flex items-center gap-2">
          <span>🧠</span> Duygu Analizi
        </h2>

        {/* Own sentiment highlight */}
        {ownSent && (
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Olumlu Yorum', value: `%${ownSent.positive}`, color: 'text-success', bg: 'border-success/20', icon: '😊' },
              { label: 'Nötr Yorum',   value: `%${ownSent.neutral}`,  color: 'text-muted',   bg: 'border-muted/20',   icon: '😐' },
              { label: 'Olumsuz Yorum',value: `%${ownSent.negative}`, color: 'text-danger',  bg: 'border-danger/20',  icon: '😟' },
            ].map(k => (
              <div key={k.label} className={`card border ${k.bg} text-center`}>
                <div className="text-2xl mb-1">{k.icon}</div>
                <div className={`text-2xl font-bold ${k.color}`}>{k.value}</div>
                <div className="text-xs text-muted">Espressolab {k.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Stacked bar */}
        <div className="card">
          <h3 className="text-sm font-semibold text-white mb-3">Marka Bazlı Duygu Dağılımı (%)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={sentChartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A3A55" />
              <XAxis dataKey="name" tick={{ fill: '#8B9BB4', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#8B9BB4', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `%${v}`} domain={[0, 100]} />
              <Tooltip content={<SentTooltip />} />
              <Bar dataKey="positive" name="Olumlu"  stackId="s" fill="#22c55e" />
              <Bar dataKey="neutral"  name="Nötr"    stackId="s" fill="#475569" />
              <Bar dataKey="negative" name="Olumsuz" stackId="s" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Complaint badges per brand */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {sentChartData.map(d => (
            <div key={d.name} className={clsx('card', d.isOwn && 'border-caramel/30')}>
              <div className="flex items-center gap-2 mb-3">
                <span className="h-2.5 w-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                <span className={clsx('text-sm font-semibold', d.isOwn ? 'text-caramel' : 'text-white')}>{d.fullName}</span>
                <span className="ml-auto text-xs font-bold text-success">%{d.positive}</span>
              </div>
              <div className="space-y-1.5">
                <p className="text-[10px] text-muted uppercase tracking-wider">Başlıca Şikayetler</p>
                <div className="flex flex-wrap gap-1">
                  {d.topComplaints.map(c => (
                    <span key={c} className="text-[10px] bg-danger/10 text-danger border border-danger/20 rounded-full px-2 py-0.5">{c}</span>
                  ))}
                </div>
                <p className="text-[10px] text-muted uppercase tracking-wider mt-2">Öne Çıkan Olumlu</p>
                <div className="flex flex-wrap gap-1">
                  {d.topPraises.map(p => (
                    <span key={p} className="text-[10px] bg-success/10 text-success border border-success/20 rounded-full px-2 py-0.5">{p}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SECTION 4: AI Action Plan ────────────────────────────── */}
      <section className="space-y-5">
        <h2 className="text-base font-bold text-white border-b border-navy-border pb-2 flex items-center gap-2">
          <span>🤖</span> AI Aksiyon Planı
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card border-success/20">
            <div className="text-2xl mb-2">📈</div>
            <h4 className="text-sm font-semibold text-white mb-2">Instagram Avantajını Koru</h4>
            <p className="text-xs text-muted leading-relaxed">
              Espressolab <strong className="text-success">%1.28 etkileşim</strong> ile tüm rakiplerin önünde.
              Bu oran endüstri ortalamasının (~%1) 2 katı. Reels formatına yatırım sürdürülmeli;
              4.9M görüntülenme alan içerik formatı artırılmalı.
            </p>
          </div>
          <div className="card border-warning/20">
            <div className="text-2xl mb-2">🗺️</div>
            <h4 className="text-sm font-semibold text-white mb-2">Kahve Dünyası Açığını Değerlendir</h4>
            <p className="text-xs text-muted leading-relaxed">
              KD'nin 3.64 ⭐ skoru ve düşüş trendi, özellikle temizlik ve personel şikayetleri
              doğrudan Espressolab'a yönlendirme fırsatı. Google My Business yanıt hızı ve
              &ldquo;temiz — sıcak&rdquo; mesajlaşması kampanyaya alınmalı.
            </p>
          </div>
          <div className="card border-info/20">
            <div className="text-2xl mb-2">💡</div>
            <h4 className="text-sm font-semibold text-white mb-2">Takipçi Büyütme Hedefi</h4>
            <p className="text-xs text-muted leading-relaxed">
              Mevcut 192K takipçiyle Starbucks TR (235K) ve KD (327K) arasında anlamlı açık var.
              Etkileşim kalitesi üstün olsa da kitle genişletmek için influencer iş birlikleri ve
              şehir bazlı kampanyalar kritik öncelik.
            </p>
          </div>
        </div>

        {/* Source footnote */}
        <div className="flex items-start gap-3 bg-blue-900/20 border border-blue-500/20 rounded-xl p-3 text-xs">
          <span className="text-blue-400 text-base mt-0.5">🔍</span>
          <p className="text-muted">
            <strong className="text-blue-300">Kaynaklar: </strong>
            Instagram takipçi ve etkileşim verileri 100'er post analizi (Mayıs 2026) ile doğrulanmıştır.
            Google Maps puanları Google Places API ve manuel doğrulama kombinasyonuyla alınmıştır.
            Duygu analizi sosyal medya yorumları ve Google Maps yorumlarının yapısal analizine dayanmaktadır.
          </p>
        </div>
      </section>
    </div>
  );
}
