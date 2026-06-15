import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { formatKPI, formatPercent } from '../../utils/formatters';
import { ResponsiveContainer, LineChart, Line, Tooltip } from 'recharts';
import clsx from 'clsx';

const ACCENT = {
  caramel: '#C4922A',
  success: '#22C55E',
  warning: '#F59E0B',
  danger:  '#EF4444',
  info:    '#3B82F6',
};

export default function KPICard({ label, value, change, unit, format, sparkline, icon: Icon, color = 'caramel' }) {
  const accent   = ACCENT[color] || ACCENT.caramel;
  const isUp     = change > 0;
  const isDown   = change < 0;
  const sparkData = (sparkline || []).map((v, i) => ({ v, i }));

  return (
    <div
      className="card-hover relative overflow-hidden group"
      style={{ borderLeft: `2px solid ${accent}` }}
    >
      {/* Subtle top gradient wash */}
      <div
        className="absolute inset-x-0 top-0 h-24 pointer-events-none"
        style={{ background: `linear-gradient(180deg, ${accent}08 0%, transparent 100%)` }}
      />

      {/* Label */}
      <p className="data-label mb-3 relative">{label}</p>

      <div className="flex items-end justify-between gap-3 relative">
        <div className="min-w-0">
          {/* Value */}
          <p className="text-[1.6rem] font-mono font-semibold text-white leading-none tabular-nums">
            {unit === '₺' && (
              <span className="text-base font-sans font-normal text-muted mr-0.5">₺</span>
            )}
            {formatKPI(value, format, unit)}
            {unit && unit !== '₺' && (
              <span className="text-sm font-sans font-normal text-muted ml-1">{unit}</span>
            )}
          </p>

          {/* Delta */}
          <div className={clsx(
            'flex items-center gap-1 mt-2 text-[10px] font-mono',
            isUp ? 'text-success' : isDown ? 'text-danger' : 'text-muted'
          )}>
            {isUp   ? <TrendingUp size={10}  /> :
             isDown ? <TrendingDown size={10} /> :
                      <Minus size={10} />}
            <span>{formatPercent(change, 1)}</span>
            <span className="text-muted/50 font-sans normal-case tracking-normal font-normal">
              vs geçen ay
            </span>
          </div>
        </div>

        {/* Sparkline */}
        {sparkData.length > 0 && (
          <div className="h-10 w-20 flex-shrink-0 opacity-50 group-hover:opacity-80 transition-opacity">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparkData}>
                <Tooltip content={() => null} />
                <Line
                  type="monotone"
                  dataKey="v"
                  stroke={accent}
                  strokeWidth={1.5}
                  dot={false}
                  activeDot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
