import { useState } from 'react';
import SectionHeader from '../components/common/SectionHeader';
import ConnectionPending from '../components/common/ConnectionPending';
import clsx from 'clsx';

export default function SalesAnalysis() {
  const [period, setPeriod] = useState('monthly');

  return (
    <div className="space-y-6 animate-fade-in">
      <SectionHeader
        title="Satış Analizi"
        subtitle="Satış performansı ve dönemsel trendler"
      >
        <div className="flex items-center gap-1 bg-surface2 rounded-lg p-1">
          {[
            { key: 'weekly', label: 'Haftalık' },
            { key: 'monthly', label: 'Aylık' },
          ].map(opt => (
            <button
              key={opt.key}
              onClick={() => setPeriod(opt.key)}
              className={clsx(
                'px-3 py-1.5 rounded-md text-xs font-medium transition-all',
                period === opt.key ? 'bg-caramel text-espresso' : 'text-muted hover:text-white'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </SectionHeader>

      <ConnectionPending
        system="POS / Satış Sistemi"
        description="Aylık ciro, haftalık sipariş sayısı, ürün bazlı satış dağılımı ve günlük trafik verileri şirket içi POS sisteminden alınır. Gerçek satış grafiklerini görmek için ERP entegrasyonu tamamlanmalıdır."
      />

      {/* Hangi veriler gerekli? */}
      <div className="card space-y-3">
        <h3 className="text-sm font-semibold text-white">Entegrasyon Gerektiren Veri Kaynakları</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { icon: '💳', label: 'POS Sistemi', desc: 'Anlık satış, sipariş adedi, ortalama sepet' },
            { icon: '📦', label: 'ERP / Envanter', desc: 'Ürün bazlı satış, kategori dağılımı, stok' },
            { icon: '📊', label: 'Muhasebe Yazılımı', desc: 'Aylık/yıllık ciro, kar/zarar' },
            { icon: '🏪', label: 'Şube Yönetim Sistemi', desc: 'Şube bazında satış performansı' },
          ].map(item => (
            <div key={item.label} className="flex items-start gap-3 p-3 rounded-lg bg-surface2 border border-navy-border">
              <span className="text-xl">{item.icon}</span>
              <div>
                <p className="text-xs font-semibold text-white">{item.label}</p>
                <p className="text-xs text-muted mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
