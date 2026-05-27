import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { formatKPI, formatPercent } from '../../utils/formatters';
import { ResponsiveContainer, LineChart, Line, Tooltip } from 'recharts';
import clsx from 'clsx';

const ACCENT_MAP = {
  caramel: '#C4922A',
  success: '#10b981',
  warning: '#f59e0b',
  danger:  '#ef4444',
  info:    '#0ea5e9',
};

export default function KPICard({ label, value, change, unit, format, sparkline, icon: Icon, color = 'info' }) {
  const accentColor = ACCENT_MAP[color] || ACCENT_MAP.info;
  const isUp   = change > 0;
  const isDown = change < 0;
  const sparkData = (sparkline || []).map((v, i) => ({ v, i }));

  return (
    <div
      className="kpi-card relative overflow-hidden group"
      style={{ borderLeft: `3px solid ${accentColor}` }}
    >
      {/* Top gradient line */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: `linear-gradient(90deg, ${accentColor}, transparent)`, opacity: 0.7 }} />

      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="kpi-label">{label}</p>
          <p className="kpi-value" style={{ color: accentColor }}>
            {unit === '₺' && <span style={{ fontSize: '1.2rem', marginRight: '2px', color: 'var(--text-muted)' }}>₺</span>}
            {formatKPI(value, format, unit)}
            {unit && unit !== '₺' && (
              <span style={{ fontSize: '0.9rem', fontWeight: 400, color: 'var(--text-muted)', marginLeft: '4px' }}>{unit}</span>
            )}
          </p>
        </div>
        {Icon && (
          <div style={{ padding: '0.5rem', background: `${accentColor}15`, border: `1px solid ${accentColor}30`, borderRadius: '1px' }}>
            <Icon size={16} style={{ color: accentColor }} />
          </div>
        )}
      </div>

      <div className="flex items-end justify-between">
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.25rem',
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: '0.65rem',
          color: isUp ? 'var(--accent-success)' : isDown ? 'var(--accent-danger)' : 'var(--text-muted)',
        }}>
          {isUp ? <TrendingUp size={11} /> : isDown ? <TrendingDown size={11} /> : <Minus size={11} />}
          <span>{formatPercent(change, 1)}</span>
          <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>geçen aya göre</span>
        </div>

        {sparkData.length > 0 && (
          <div className="h-10 w-20">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparkData}>
                <Tooltip content={() => null} />
                <Line type="monotone" dataKey="v" stroke={accentColor} strokeWidth={1.5} dot={false} activeDot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
