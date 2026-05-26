// Canlı veri tazelik göstergesi — tüm sayfalarda kullanılır
import { RefreshCw, Wifi, WifiOff } from 'lucide-react';
import clsx from 'clsx';
import useDataRefresh from '../../hooks/useDataRefresh';

export default function DataFreshnessBar({
  sources = [],          // [ { label, url, verifiedAt } ]
  interval = 120_000,
  className = '',
  onRefresh,             // optional: called when user clicks Yenile
}) {
  const { freshness, isRefreshing, refresh, timeAgo, updateCount } = useDataRefresh(interval);

  return (
    <div className={clsx(
      'flex flex-wrap items-center gap-3 px-4 py-2 rounded-lg border text-xs',
      'bg-surface2 border-navy-border',
      className
    )}>
      {/* Canlı/Güncel indikatörü */}
      <div className="flex items-center gap-1.5">
        <span className="relative flex h-2 w-2">
          <span className={clsx(
            'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75',
            freshness.dot
          )} />
          <span className={clsx('relative inline-flex rounded-full h-2 w-2', freshness.dot)} />
        </span>
        <span className={clsx('font-semibold tracking-wide', freshness.color)}>
          {freshness.label}
        </span>
      </div>

      {/* Son güncelleme */}
      <span className="text-muted">
        Son güncelleme: <span className="text-white font-medium">{timeAgo()}</span>
      </span>

      {/* Güncelleme sayacı */}
      <span className="text-muted hidden sm:block">
        Güncelleme: <span className="text-caramel font-mono">{updateCount}</span>
      </span>

      {/* Kaynak listesi */}
      {sources.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-muted">Kaynaklar:</span>
          {sources.map((s, i) => (
            <span key={i} className="bg-navy-border text-muted px-1.5 py-0.5 rounded text-[10px] font-medium">
              {s.label}
            </span>
          ))}
        </div>
      )}

      {/* Manuel yenile butonu */}
      <button
        onClick={() => { refresh(); onRefresh?.(); }}
        disabled={isRefreshing}
        className={clsx(
          'ml-auto flex items-center gap-1 px-2 py-1 rounded transition-colors text-[10px] font-medium',
          isRefreshing
            ? 'text-muted cursor-not-allowed'
            : 'text-caramel hover:bg-caramel/10 cursor-pointer'
        )}
      >
        <RefreshCw size={11} className={isRefreshing ? 'animate-spin' : ''} />
        {isRefreshing ? 'Yenileniyor...' : 'Yenile'}
      </button>
    </div>
  );
}
