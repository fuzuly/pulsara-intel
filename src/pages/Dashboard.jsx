import { AlertTriangle } from 'lucide-react';
import {
  LineChart, Line,
  BarChart, Bar, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ReferenceLine,
} from 'recharts';
import SectionHeader from '../components/common/SectionHeader';
import useNewsData from '../hooks/useNewsData';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { NEW_PRODUCTS, LAYER_CONFIG } from '../data/newProductData';
import { COMPETITOR_SCORES } from '../data/competitorData';
import { BRANDS } from '../constants/brands';
import instagramPosts from '../data/instagramPosts.json';

const SENTIMENT_DOT = {
  positive: 'bg-success',
  neutral:  'bg-muted',
  negative: 'bg-danger',
};

// ── Dinamik veriler ────────────────────────────────────────────────────────────

// En güncel engagement — instagramPosts.json'dan
const topEngagement = [...instagramPosts]
  .filter(p => p.engagementRate !== null)
  .sort((a, b) => b.engagementRate - a.engagementRate)[0];
const topEngagementBrand = BRANDS.find(b => {
  const map = { espressolabtr: 'espressolab', starbucks_tr: 'starbucks', kahvedunyasi: 'kahvedunyasi', gjcsturkey: 'gloriajeans', caffeneroturkiye: 'caffenero', guacoffeecompany: 'gua', luuqcoffee: 'luuq', mikelcoffee_tr: 'mikel', coffy_tr: 'coffy', 'nevadacoffee.tr': 'nevada', 'laos.coffee': 'laos' };
  return b.id === map[topEngagement?.username];
});
const sectorAvgEngagement = (instagramPosts.filter(p => p.engagementRate !== null).reduce((s, p) => s + p.engagementRate, 0) / instagramPosts.filter(p => p.engagementRate !== null).length).toFixed(2);

const KPI_CARDS = [
  {
    label: 'İzlenen Marka',
    value: String(BRANDS.length),
    sub: 'Türkiye kahve sektörü',
    trend: null,
  },
  {
    label: '2026 Yeni Ürün Lansmanı',
    value: String(NEW_PRODUCTS.filter(p => p.status === 'active').length),
    sub: `${NEW_PRODUCTS.filter(p => p.status === 'upcoming').length} ürün yakında`,
    trend: 'up',
  },
  {
    label: 'En Yüksek Engagement',
    value: `%${topEngagement?.engagementRate ?? '—'}`,
    sub: `${topEngagementBrand?.name ?? '—'} — sektör ort. %${sectorAvgEngagement}`,
    trend: 'up',
  },
  {
    label: 'Risk Altındaki Şube',
    value: '34',
    sub: '4.0 altı Google puanı',
    trend: 'down',
  },
];

// Engagement trendi — Mayıs 2026 gerçek verisi ile güncellendi
const engagementTrend = [
  { month: "Eyl '25", espressolab: 1.80, starbucks: 0.40, kahveDunyasi: 0.14 },
  { month: "Eki '25", espressolab: 1.65, starbucks: 0.41, kahveDunyasi: 0.15 },
  { month: "Kas '25", espressolab: 1.50, starbucks: 0.41, kahveDunyasi: 0.17 },
  { month: "Ara '25", espressolab: 1.40, starbucks: 0.42, kahveDunyasi: 0.18 },
  { month: "Oca '26", espressolab: 1.35, starbucks: 0.42, kahveDunyasi: 0.18 },
  { month: "Şub '26", espressolab: 1.32, starbucks: 0.42, kahveDunyasi: 0.19 },
  { month: "Mar '26", espressolab: 1.30, starbucks: 0.42, kahveDunyasi: 0.19 },
  { month: "Nis '26", espressolab: 1.29, starbucks: 0.42, kahveDunyasi: 0.19 },
  { month: "May '26", espressolab: 1.28, starbucks: 0.42, kahveDunyasi: 0.19 },
];

// Ratings — competitorData.js'den dinamik
const ratingsData = [
  { brand: 'Espressolab',   rating: COMPETITOR_SCORES.espressolab.googleRating,  fill: '#C4922A' },
  { brand: "Gloria Jean's", rating: COMPETITOR_SCORES.gloriajeans.googleRating,  fill: '#F46621' },
  { brand: 'Caffè Nero',    rating: COMPETITOR_SCORES.caffenero.googleRating,    fill: '#1D4ED8' },
  { brand: 'Kahve Dünyası', rating: COMPETITOR_SCORES.kahvedunyasi.googleRating, fill: '#8B1A1A' },
  { brand: 'Starbucks',     rating: COMPETITOR_SCORES.starbucks.googleRating,    fill: '#00704A' },
].sort((a, b) => b.rating - a.rating);

// Güncel rakip hareketleri — newProductData.js'den dinamik (en yeni 4 kayıt)
const RECENT_MOVES = [...NEW_PRODUCTS]
  .filter(p => p.layer <= 2)
  .sort((a, b) => new Date(b.detectedAt) - new Date(a.detectedAt))
  .slice(0, 4);

const EngagementTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface border border-navy-border rounded-lg px-3 py-2 shadow-xl text-xs">
      <p className="font-semibold text-white mb-1">{label}</p>
      {payload.map(p => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}: <strong>%{p.value}</strong>
        </p>
      ))}
    </div>
  );
};

const RatingsTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-surface border border-navy-border rounded-lg px-3 py-2 shadow-xl text-xs">
      <p className="font-semibold text-white">{d.brand}</p>
      <p style={{ color: d.fill }}>{d.rating} / 5.0</p>
    </div>
  );
};

const RatingsLabel = ({ x, y, width, value }) => (
  <text
    x={x + width + 6}
    y={y + 10}
    fill="#e2e8f0"
    fontSize={11}
    fontWeight="600"
  >
    {value}
  </text>
);

export default function Dashboard() {
  const { articles, loading: newsLoading, error: newsError, refetch: refetchNews } = useNewsData();

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Alert Banner — newProductData.js'den dinamik */}
      <div className="flex items-start gap-3 bg-warning/10 border border-warning/30 rounded-xl px-4 py-3">
        <AlertTriangle size={16} className="text-warning flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm text-warning font-semibold">Güncel Rakip Hareketleri</p>
            <Link to="/yeni-urun-radar" className="text-[10px] text-caramel hover:underline flex-shrink-0">
              Tümünü Gör →
            </Link>
          </div>
          <ul className="text-xs text-white/80 space-y-1 list-none">
            {RECENT_MOVES.map(p => {
              const brand   = BRANDS.find(b => b.id === p.brand);
              const layerCfg = LAYER_CONFIG[p.layer];
              const date    = new Date(p.launchDate).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
              const srcShort = p.source.split(' —')[0].split(' + ')[0];
              return (
                <li key={p.id} className="flex items-start gap-1.5 flex-wrap">
                  <span className="text-white/40">•</span>
                  <strong className="text-white">{brand?.name ?? p.brand}</strong>
                  <span className="truncate">{p.name}</span>
                  <span className="text-white/40">—</span>
                  <span className="text-muted flex-shrink-0">{date}</span>
                  <span className={clsx('text-[10px] flex-shrink-0', layerCfg.color)}>
                    {layerCfg.icon} {srcShort}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* KPI Cards */}
      <div>
        <SectionHeader
          title="Rekabet İstihbarat Özeti"
          subtitle="İzlenen markalar, sosyal medya ve Google Maps verisinden türetilmiştir"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mt-4">
          {KPI_CARDS.map(card => (
            <div key={card.label} className="card flex flex-col gap-2">
              <div className="flex items-center justify-end h-5">
                {card.trend === 'up' && (
                  <span className="text-success text-sm font-bold">↑</span>
                )}
                {card.trend === 'down' && (
                  <span className="text-danger text-sm font-bold">↓</span>
                )}
              </div>
              <div className={clsx(
                'text-2xl font-bold',
                card.trend === 'up' ? 'text-success'
                  : card.trend === 'down' ? 'text-danger'
                  : 'text-white'
              )}>
                {card.value}
              </div>
              <div>
                <p className="text-xs font-medium text-white">{card.label}</p>
                <p className="text-[10px] text-muted mt-0.5">{card.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* Engagement Trend */}
        <div className="card flex flex-col">
          <div className="mb-3">
            <h3 className="text-base font-semibold text-white">Sosyal Medya Engagement Trendi</h3>
            <p className="text-xs text-muted mt-0.5">Instagram etkileşim oranı (%)</p>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={engagementTrend} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A3A55" />
              <XAxis
                dataKey="month"
                tick={{ fill: '#8B9BB4', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#8B9BB4', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={v => `%${v}`}
              />
              <Tooltip content={<EngagementTooltip />} />
              <Legend
                formatter={val => <span style={{ color: '#8B9BB4', fontSize: 11 }}>{val}</span>}
              />
              <Line
                type="monotone"
                dataKey="espressolab"
                name="Espressolab"
                stroke="#10b981"
                strokeWidth={2.5}
                dot={{ r: 3, fill: '#10b981' }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="starbucks"
                name="Starbucks"
                stroke="#3b82f6"
                strokeWidth={1.5}
                dot={{ r: 3, fill: '#3b82f6' }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="kahveDunyasi"
                name="Kahve Dünyası"
                stroke="#f59e0b"
                strokeWidth={1.5}
                dot={{ r: 3, fill: '#f59e0b' }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Google Maps Ratings */}
        <div className="card flex flex-col">
          <div className="mb-3">
            <h3 className="text-base font-semibold text-white">Google Maps Ortalama Puan</h3>
            <p className="text-xs text-muted mt-0.5">Doğrulanmış Google Maps verisi — Haziran 2026</p>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={ratingsData}
              layout="vertical"
              margin={{ top: 5, right: 50, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#2A3A55" horizontal={false} />
              <XAxis
                type="number"
                domain={[0, 5]}
                tick={{ fill: '#8B9BB4', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                ticks={[0, 1, 2, 3, 4, 5]}
              />
              <YAxis
                type="category"
                dataKey="brand"
                tick={{ fill: '#8B9BB4', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={90}
              />
              <Tooltip content={<RatingsTooltip />} />
              <ReferenceLine
                x={4.0}
                stroke="#ef4444"
                strokeDasharray="4 3"
                label={{ value: 'Sektör Eşiği', position: 'insideTopRight', fill: '#ef4444', fontSize: 10 }}
              />
              <Bar dataKey="rating" radius={[0, 6, 6, 0]} label={<RatingsLabel />}>
                {ratingsData.map(entry => (
                  <Cell key={entry.brand} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Rakip Analizi linki */}
        <div className="card xl:col-span-1 flex flex-col items-center justify-center text-center py-8 gap-3">
          <h3 className="text-base font-semibold text-white">Rakip Skor Analizi</h3>
          <p className="text-xs text-muted leading-relaxed">
            Google Maps puanları, şube büyümesi ve menü analizinden türetilen canlı rakip skorları.
          </p>
          <Link to="/rakip-analizi" className="btn btn-primary text-xs mt-2">
            Rakip Analizini Görüntüle →
          </Link>
        </div>

        {/* Son Dakika */}
        <div className="card xl:col-span-2 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-white">Son Dakika</h3>
            </div>
            <Link to="/son-dakika" className="text-xs text-caramel hover:underline">
              Tümünü Gör →
            </Link>
          </div>

          {newsLoading && (
            <div className="flex items-center gap-2 text-xs text-muted py-4">
              <span className="animate-spin text-caramel">⟳</span> Haberler yükleniyor...
            </div>
          )}
          {newsError && (
            <div className="text-xs text-warning bg-warning/10 border border-warning/20 rounded-lg px-3 py-2 mb-3">
              ⚠️ API hatası: {newsError}
            </div>
          )}

          <div className="space-y-2 flex-1">
            {articles.slice(0, 4).map(article => (
              <div key={article.id} className="flex items-start gap-3 p-3 rounded-lg bg-surface2/50 hover:bg-surface2 transition-colors border border-navy-border/50">
                <span className={clsx('h-2 w-2 rounded-full flex-shrink-0 mt-1.5', SENTIMENT_DOT[article.sentiment] || 'bg-muted')} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-white leading-snug font-medium line-clamp-2">{article.title}</p>
                  <div className="flex items-center gap-2 mt-1 text-[10px] text-muted">
                    <span>{article.source}</span>
                    <span>{article.date}</span>
                    {article.url && article.url !== '#' && (
                      <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-caramel hover:underline ml-auto">
                        Git →
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {!newsLoading && articles.length === 0 && !newsError && (
              <p className="text-xs text-muted text-center py-4">Haber bulunamadı.</p>
            )}
          </div>

          {articles.length > 4 && (
            <Link
              to="/son-dakika"
              className="mt-3 pt-3 border-t border-navy-border text-center text-xs text-caramel hover:underline"
            >
              + {articles.length - 4} haber daha — Haber Akışı sayfasına git →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
