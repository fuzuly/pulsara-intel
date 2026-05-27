import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { formatKPI, formatPercent } from '../../utils/formatters';
import {
  ResponsiveContainer, LineChart, Line, Tooltip,
} from 'recharts';
import clsx from 'clsx';

const COLOR_MAP = {
  caramel: { bg: 'bg-caramel/10', icon: 'text-caramel', border: 'border-caramel/20' },
  success: { bg: 'bg-success/10', icon: 'text-success', border: 'border-success/20' },
  warning: { bg: 'bg-warning/10', icon: 'text-warning', border: 'border-warning/20' },
  danger:  { bg: 'bg-danger/10',  icon: 'text-danger',  border: 'border-danger/20'  },
  info:    { bg: 'bg-info/10',    icon: 'text-info',    border: 'border-info/20'    },
};

export default function KPICard({ label, value, change, unit, format, sparkline, icon: Icon, color = 'caramel' }) {
  const colors = COLOR_MAP[color] || COLOR_MAP.caramel;
  const isUp   = change > 0;
  const isDown = change < 0;

  const sparkData = (sparkline || []).map((v, i) => ({ v, i }));

  const SPARKLINE_COLORS = {
    caramel: '#C4922A',
    success: '#22C55E',
    warning: '#F59E0B',
    danger:  '#EF4444',
    info:    '#3B82F6',
  };

  const lineColor = SPARKLINE_COLORS[color] || '#C4922A';

  return (
    <div className={clsx('card-hover relative overflow-hidden group', colors.border)}>
      {/* Top glow effect on hover */}
      <div className={clsx(
        'absolute inset-x-0 top-0 h-px transition-opacity duration-300',
        `bg-gradient-to-r from-transparent via-${color === 'caramel' ? 'caramel' : color}/50 to-transparent`
      )} />

      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xs font-medium text-muted mb-1">{label}</p>
          <p className="text-2xl font-bold text-white">
            {unit === '₺' && <span className="text-lg mr-0.5 text-muted">₺</span>}
            {formatKPI(value, format, unit)}
            {unit && unit !== '₺' && (
              <span className="text-sm font-normal text-muted ml-1">{unit}</span>
            )}
          </p>
        </div>
        {Icon && (
          <div className={clsx('p-2.5 rounded-xl', colors.bg)}>
            <Icon size={18} className={colors.icon} />
          </div>
        )}
      </div>

      <div className="flex items-end justify-between">
        <div className={clsx(
          'flex items-center gap-1 text-xs font-semibold',
          isUp ? 'text-success' : isDown ? 'text-danger' : 'text-muted'
        )}>
          {isUp ? <TrendingUp size={12} /> : isDown ? <TrendingDown size={12} /> : <Minus size={12} />}
          <span>{formatPercent(change, 1)}</span>
          <span className="text-muted font-normal">geçen aya göre</span>
        </div>

        {sparkData.length > 0 && (
          <div className="h-12 w-24">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparkData}>
                <Tooltip content={() => null} />
                <Line type="monotone" dataKey="v" stroke={lineColor} strokeWidth={2} dot={false} activeDot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
