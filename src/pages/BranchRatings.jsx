import { Star, AlertTriangle, Trophy, TrendingDown, Shield } from 'lucide-react';
import SectionHeader from '../components/common/SectionHeader';
import { BRAND_MAP } from '../constants/brands';
import branchData from '../data/branchRatings.json';
import clsx from 'clsx';

const TOTAL_BRANCHES = branchData.reduce((s, d) => s + d.totalBranches, 0);
const TOTAL_REVIEWS  = branchData.reduce((s, d) => s + d.totalReviews, 0);
const BEST_BRAND     = [...branchData].sort((a, b) => b.avgRating - a.avgRating)[0];
const WORST_BRAND    = [...branchData].sort((a, b) => a.avgRating - b.avgRating)[0];

function ratingColor(r) {
  if (r >= 4.5) return '#22C55E';
  if (r >= 4.0) return '#FCD34D';
  return '#EF4444';
}

function ratingLabel(r) {
  if (r >= 4.5) return 'Mükemmel';
  if (r >= 4.0) return 'İyi';
  if (r >= 3.5) return 'Orta';
  return 'Riskli';
}

function Stars({ rating }) {
  const full  = Math.floor(rating);
  const half  = rating - full >= 0.3 ? 1 : 0;
  const empty = 5 - full - half;
  return (
    <span className="flex items-center gap-0.5">
      {Array(full).fill(0).map((_, i) => <Star key={`f${i}`} size={11} className="text-warning fill-warning" />)}
      {half === 1 && <Star size={11} className="text-warning fill-warning opacity-50" />}
      {Array(empty).fill(0).map((_, i) => <Star key={`e${i}`} size={11} className="text-muted" />)}
    </span>
  );
}

function RatingRing({ rating, size = 80 }) {
  const color  = ratingColor(rating);
  const r      = (size - 10) / 2;
  const circ   = 2 * Math.PI * r;
  const fill   = ((rating - 1) / 4) * circ;
  const offset = circ - fill;
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#2A3A55" strokeWidth={6} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={color} strokeWidth={6}
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-black leading-none" style={{ color }}>{rating.toFixed(2)}</span>
        <span className="text-[9px] text-muted mt-0.5">/ 5.00</span>
      </div>
    </div>
  );
}

function BranchInfoRow({ icon, label, name, rating, reviews }) {
  return (
    <div className="flex items-start gap-2 py-1.5 border-t border-navy-border/50">
      <span className="text-base flex-shrink-0">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-muted font-medium uppercase tracking-wider">{label}</p>
        <p className="text-xs text-white font-medium truncate mt-0.5" title={name}>{name}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[10px] font-bold" style={{ color: ratingColor(rating) }}>
            {rating.toFixed(1)} ⭐
          </span>
          <span className="text-[10px] text-muted">{reviews.toLocaleString('tr-TR')} yorum</span>
        </div>
      </div>
    </div>
  );
}

export default function BranchRatings() {
  const sorted = [...branchData].sort((a, b) => b.avgRating - a.avgRating);

  return (
    <div className="space-y-6 animate-fade-in">
      <SectionHeader
        title="Şube Google Puanları"
        subtitle={`${TOTAL_BRANCHES} şube · ${branchData.length} marka · ${TOTAL_REVIEWS.toLocaleString('tr-TR')} Google yorumu — Mart 2026`}
      />

      {/* Veri kaynağı notu */}
      <div className="flex items-start gap-3 bg-blue-900/20 border border-blue-500/20 rounded-xl p-3 text-xs">
        <span className="text-blue-400 text-base mt-0.5">🗺️</span>
        <p className="text-muted">
          <strong className="text-blue-300">Kaynak: </strong>
          Google Maps Places API — şube bazlı puan ve yorum analizi. Marka (28), Kahve Dünyası (25),
          Gloria Jean's (25), Caffe Nero (17), Starbucks (13) şubesi incelenmiştir. Veri: Mart 2026.
        </p>
      </div>

      {/* ── KPI Kartları ─────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* En iyi marka */}
        <div className="card border-success/20">
          <div className="text-2xl mb-1">🏆</div>
          <div className="text-2xl font-bold text-success">{BEST_BRAND.avgRating.toFixed(2)} ⭐</div>
          <div className="text-xs font-semibold text-white mt-0.5">{BEST_BRAND.brand}</div>
          <div className="text-xs text-muted">En iyi ortalama puan</div>
        </div>

        {/* En riskli */}
        <div className="card border-danger/20">
          <div className="text-2xl mb-1">⚠️</div>
          <div className="text-2xl font-bold text-danger">{WORST_BRAND.below4}/{WORST_BRAND.totalBranches}</div>
          <div className="text-xs font-semibold text-white mt-0.5">{WORST_BRAND.brand}</div>
          <div className="text-xs text-muted">şube 4.0 altında</div>
        </div>

        {/* Toplam şube */}
        <div className="card border-info/20">
          <div className="text-2xl mb-1">🏪</div>
          <div className="text-2xl font-bold text-info">{TOTAL_BRANCHES}</div>
          <div className="text-xs font-semibold text-white mt-0.5">Analiz Edilen Şube</div>
          <div className="text-xs text-muted">{branchData.length} marka</div>
        </div>

        {/* Toplam yorum */}
        <div className="card border-caramel/20">
          <div className="text-2xl mb-1">💬</div>
          <div className="text-2xl font-bold text-caramel">{(TOTAL_REVIEWS / 1000).toFixed(1)}K</div>
          <div className="text-xs font-semibold text-white mt-0.5">Toplam Google Yorumu</div>
          <div className="text-xs text-muted">{TOTAL_REVIEWS.toLocaleString('tr-TR')} yorum</div>
        </div>
      </div>

      {/* ── Marka Kartları ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {sorted.map(d => {
          const brand   = BRAND_MAP[d.brandId] || {};
          const isOwn   = brand.isOwn || false;
          const color   = brand.color || '#8B9BB4';
          const isHighRisk = d.below4 > 5;
          const riskPct = Math.round((d.below4 / d.totalBranches) * 100);

          return (
            <div
              key={d.brandId}
              className={clsx(
                'card relative overflow-hidden',
                isOwn && 'border-caramel/40',
                isHighRisk && !isOwn && 'border-danger/20'
              )}
            >
              {/* Top accent */}
              {isOwn && (
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-caramel to-transparent" />
              )}

              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                    style={{ backgroundColor: color }}
                  >
                    {(brand.shortName || d.brand.slice(0, 2)).slice(0, 3)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={clsx('text-sm font-bold', isOwn ? 'text-caramel' : 'text-white')}>
                        {d.brand}
                      </span>
                      {isOwn && (
                        <span className="text-[9px] bg-caramel/20 text-caramel px-1.5 py-0.5 rounded-full font-semibold">BİZİZ</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Stars rating={d.avgRating} />
                      <span className="text-[10px] text-muted ml-1">{d.totalReviews.toLocaleString('tr-TR')} yorum</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                  <RatingRing rating={d.avgRating} size={72} />
                  <span
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: `${ratingColor(d.avgRating)}20`, color: ratingColor(d.avgRating) }}
                  >
                    {ratingLabel(d.avgRating)}
                  </span>
                </div>
              </div>

              {/* Şube dağılımı */}
              <div className="mb-4">
                <p className="text-[10px] text-muted uppercase tracking-wider mb-2">Şube Dağılımı ({d.totalBranches} şube)</p>
                <div className="flex items-stretch gap-2">
                  {/* Görsel progress bar */}
                  <div className="flex-1 flex rounded-lg overflow-hidden h-5">
                    {d.above45 > 0 && (
                      <div
                        className="flex items-center justify-center text-[9px] font-bold text-white"
                        style={{ width: `${(d.above45 / d.totalBranches) * 100}%`, backgroundColor: '#22C55E' }}
                        title={`${d.above45} şube 4.5+`}
                      >
                        {d.above45}
                      </div>
                    )}
                    {d.between4and45 > 0 && (
                      <div
                        className="flex items-center justify-center text-[9px] font-bold text-espresso"
                        style={{ width: `${(d.between4and45 / d.totalBranches) * 100}%`, backgroundColor: '#FCD34D' }}
                        title={`${d.between4and45} şube 4.0-4.5`}
                      >
                        {d.between4and45}
                      </div>
                    )}
                    {d.below4 > 0 && (
                      <div
                        className="flex items-center justify-center text-[9px] font-bold text-white"
                        style={{ width: `${(d.below4 / d.totalBranches) * 100}%`, backgroundColor: '#EF4444' }}
                        title={`${d.below4} şube 4.0 altı`}
                      >
                        {d.below4}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-1.5 text-[10px]">
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-success inline-block" /><span className="text-success font-medium">{d.above45} şube 4.5+</span></span>
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-warning inline-block" /><span className="text-warning font-medium">{d.between4and45} şube 4.0–4.5</span></span>
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-danger inline-block" /><span className="text-danger font-medium">{d.below4} risk</span></span>
                </div>
              </div>

              {/* Branch details */}
              <div className="space-y-0">
                <BranchInfoRow icon="🏅" label="En İyi Şube" name={d.bestBranch.name} rating={d.bestBranch.rating} reviews={d.bestBranch.reviews} />
                <BranchInfoRow icon="⚠️" label="En Düşük Şube" name={d.worstBranch.name} rating={d.worstBranch.rating} reviews={d.worstBranch.reviews} />
                <BranchInfoRow icon="💬" label="En Çok Yorum Alan" name={d.topBranch.name} rating={d.topBranch.rating} reviews={d.topBranch.reviews} />
              </div>

              {/* Risk badge */}
              {isHighRisk && (
                <div className="mt-3 flex items-center gap-2 bg-danger/10 border border-danger/30 rounded-lg px-3 py-2">
                  <AlertTriangle size={13} className="text-danger flex-shrink-0" />
                  <span className="text-xs text-danger font-semibold">
                    Yüksek Risk — {d.below4}/{d.totalBranches} şube 4.0 altında (%{riskPct})
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Risk Analizi Tablosu ─────────────────────────────────── */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle size={16} className="text-warning" />
          <h3 className="text-base font-semibold text-white">Risk Analizi Tablosu</h3>
          <span className="text-xs text-muted ml-1">4.0 altı şube risk göstergesi</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-navy-border">
                {['Marka', 'Ort. Puan', 'Risk Şube (4.0↓)', 'Toplam Şube', 'Risk Oranı', 'Durum'].map(h => (
                  <th key={h} className="table-header py-3 px-4 text-left whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map(d => {
                const brand   = BRAND_MAP[d.brandId] || {};
                const color   = brand.color || '#8B9BB4';
                const riskPct = Math.round((d.below4 / d.totalBranches) * 100);
                const isKD    = d.brandId === 'kahvedunyasi';
                const isOwn   = brand.isOwn || false;
                const riskLevel =
                  riskPct >= 50 ? 'Kritik' :
                  riskPct >= 30 ? 'Yüksek' :
                  riskPct >= 10 ? 'Orta'   : 'Düşük';
                const riskColor =
                  riskPct >= 50 ? 'text-danger' :
                  riskPct >= 30 ? 'text-warning' :
                  riskPct >= 10 ? 'text-yellow-400' : 'text-success';

                return (
                  <tr
                    key={d.brandId}
                    className={clsx(
                      'table-row',
                      isKD  && 'bg-danger/5 border-l-2 border-danger',
                      isOwn && 'bg-caramel/5'
                    )}
                  >
                    <td className="table-cell px-4">
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                        <span className={clsx('font-semibold', isOwn ? 'text-caramel' : 'text-white')}>
                          {d.brand}
                        </span>
                        {isOwn && <span className="text-[9px] bg-caramel/20 text-caramel px-1 rounded">BİZ</span>}
                        {isKD  && <span className="text-[9px] bg-danger/20 text-danger px-1 rounded">⚠️ Risk</span>}
                      </div>
                    </td>
                    <td className="table-cell px-4">
                      <span className="font-bold text-sm" style={{ color: ratingColor(d.avgRating) }}>
                        {d.avgRating.toFixed(2)} ⭐
                      </span>
                    </td>
                    <td className="table-cell px-4">
                      <span className={clsx('font-bold', d.below4 > 0 ? 'text-danger' : 'text-success')}>
                        {d.below4} şube
                      </span>
                    </td>
                    <td className="table-cell px-4 text-muted">
                      {d.totalBranches} şube
                    </td>
                    <td className="table-cell px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-navy-border rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${riskPct}%`,
                              backgroundColor: riskPct >= 50 ? '#EF4444' : riskPct >= 30 ? '#F59E0B' : '#22C55E',
                            }}
                          />
                        </div>
                        <span className={clsx('font-bold text-sm', riskColor)}>%{riskPct}</span>
                      </div>
                    </td>
                    <td className="table-cell px-4">
                      <span className={clsx(
                        'text-xs font-semibold px-2 py-0.5 rounded-full',
                        riskPct >= 50 ? 'bg-danger/20 text-danger' :
                        riskPct >= 30 ? 'bg-warning/20 text-warning' :
                        riskPct >= 10 ? 'bg-yellow-400/20 text-yellow-400' :
                        'bg-success/20 text-success'
                      )}>
                        {riskLevel}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* KD uyarısı */}
        <div className="mt-4 flex items-start gap-3 bg-danger/10 border border-danger/20 rounded-xl p-3 text-xs">
          <AlertTriangle size={14} className="text-danger flex-shrink-0 mt-0.5" />
          <p className="text-muted leading-relaxed">
            <strong className="text-danger">Kahve Dünyası kritik risk:</strong> 25 şubenin 16'sı (%64) 4.0 puanın altında.
            Doğrudan müşteri kazanım fırsatı — "Güvenilir kahve deneyimi" mesajlaşması etkili olabilir.
          </p>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 text-[10px] text-muted justify-center">
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-success" /> 4.5+ Mükemmel</span>
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-warning" /> 4.0–4.5 İyi</span>
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: '#FB923C' }} /> 3.5–4.0 Orta</span>
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-danger" /> 4.0 altı Risk</span>
      </div>
    </div>
  );
}
