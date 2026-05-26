import { useLiveTicker } from '../../hooks/useLiveTicker';
import { BRAND_MAP } from '../../constants/brands';
import clsx from 'clsx';

const SEVERITY_COLOR = {
  success: 'text-success',
  warning: 'text-warning',
  danger:  'text-danger',
  info:    'text-info',
};

export default function LiveTicker() {
  const { alerts, isLive } = useLiveTicker(8000);

  return (
    <div className="flex items-center gap-2 flex-1 overflow-hidden">
      {/* Durum göstergesi */}
      <div className="flex-shrink-0 flex items-center gap-1.5 pr-3 border-r border-navy-border">
        <span className={clsx(
          'flex h-1.5 w-1.5 rounded-full',
          isLive ? 'bg-success animate-pulse' : 'bg-warning'
        )} />
        <span className="text-xs font-semibold text-muted uppercase tracking-wider">
          {isLive ? 'CANLI' : 'STATİK'}
        </span>
      </div>

      {/* Kayan içerik */}
      <div className="flex-1 overflow-hidden relative">
        <div className="flex gap-12 animate-ticker whitespace-nowrap">
          {[...alerts, ...alerts].map((alert, i) => {
            const brand = BRAND_MAP[alert.brand];
            return (
              <span key={`${alert.id ?? i}-${i}`} className="inline-flex items-center gap-2 text-xs">
                <span className="text-base">{alert.icon}</span>
                {brand && (
                  <span className="font-semibold" style={{ color: brand.color }}>
                    {brand.name}
                  </span>
                )}
                <span className={clsx('font-medium', SEVERITY_COLOR[alert.severity] || 'text-muted')}>
                  {alert.message}
                </span>
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
