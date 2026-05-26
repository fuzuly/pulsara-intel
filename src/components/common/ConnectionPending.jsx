import { Database } from 'lucide-react';

export default function ConnectionPending({ system, description, className = '' }) {
  return (
    <div className={`card flex flex-col items-center justify-center py-16 gap-4 border border-dashed border-navy-border ${className}`}>
      <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-surface2">
        <Database size={28} className="text-muted" />
      </div>
      <div className="text-center">
        <h3 className="text-base font-semibold text-white mb-1">Veri Bağlantısı Bekleniyor</h3>
        {system && (
          <p className="text-sm text-caramel font-medium mb-2">{system}</p>
        )}
        <p className="text-xs text-muted max-w-sm leading-relaxed">
          {description || 'Bu veriler iç sistemlerden (POS / ERP) gelmektedir. Gerçek veri görmek için sistem entegrasyonu gereklidir.'}
        </p>
      </div>
      <div className="flex items-center gap-2 text-xs text-muted border border-navy-border rounded-lg px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-warning animate-pulse" />
        Entegrasyon bekleniyor
      </div>
    </div>
  );
}
