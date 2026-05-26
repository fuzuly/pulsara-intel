import { AlertTriangle } from 'lucide-react';

export default function DemoDataBanner({ message, detail }) {
  return (
    <div className="flex items-start gap-3 bg-warning/10 border border-warning/30 rounded-xl px-4 py-3">
      <AlertTriangle size={14} className="text-warning flex-shrink-0 mt-0.5" />
      <div>
        <p className="text-xs font-semibold text-warning">
          {message || '⚠️ Demo Verisi — Bu veriler tahmini/simüle içerik içermektedir.'}
        </p>
        {detail && <p className="text-xs text-muted mt-0.5">{detail}</p>}
      </div>
    </div>
  );
}
