import { useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts';
import SectionHeader from '../components/common/SectionHeader';
import DataFreshnessBar from '../components/common/DataFreshnessBar';
import { BRANDS, BRAND_COLORS } from '../constants/brands';
import { MENU_ITEMS, MENU_CATEGORIES, BRAND_AVG_PRICES } from '../data/menuData';
import clsx from 'clsx';

export default function MenuComparison() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [highlightCheapest, setHighlightCheapest] = useState(true);

  const filteredItems = useMemo(() => {
    if (activeCategory === 'all') return MENU_ITEMS;
    return MENU_ITEMS.filter(item => item.category === activeCategory);
  }, [activeCategory]);

  const getCellClass = (item, brandId) => {
    const price = item.prices[brandId];
    if (price === null || price === undefined) return { cls: 'text-muted', style: {} };

    if (!highlightCheapest) return { cls: 'text-white', style: {} };

    const prices = Object.values(item.prices).filter(p => p !== null && p !== undefined);
    const min = Math.min(...prices);
    const max = Math.max(...prices);

    if (price === min) return { cls: 'font-bold text-success', style: { backgroundColor: '#22C55E15' } };
    if (price === max) return { cls: 'font-semibold text-danger', style: { backgroundColor: '#EF444415' } };
    return { cls: 'text-white', style: {} };
  };

  const avgPriceData = BRANDS.map(b => ({
    name: b.shortName,
    fullName: b.name,
    avg: BRAND_AVG_PRICES[b.id] || 0,
    id: b.id,
    isOwn: b.isOwn,
  })).filter(b => b.avg > 0 && BRAND_AVG_PRICES[b.id] !== undefined).sort((a, b) => b.avg - a.avg);

  const categoryPriceData = MENU_CATEGORIES.map(cat => {
    const catItems = MENU_ITEMS.filter(i => i.category === cat.id);
    const row = { category: cat.label };
    BRANDS.slice(0, 6).forEach(b => {
      const prices = catItems
        .map(i => i.prices[b.id])
        .filter(p => p !== null && p !== undefined);
      row[b.id] = prices.length > 0 ? Math.round(prices.reduce((a, c) => a + c, 0) / prices.length) : 0;
    });
    return row;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <SectionHeader
        title="Menü Karşılaştırması"
        subtitle="Tüm markaların ürün ve fiyat karşılaştırması"
      >
        <label className="flex items-center gap-2 text-xs text-muted cursor-pointer">
          <input
            type="checkbox"
            checked={highlightCheapest}
            onChange={e => setHighlightCheapest(e.target.checked)}
            className="accent-caramel"
          />
          En ucuz/pahalıyı vurgula
        </label>
      </SectionHeader>
      <DataFreshnessBar
        sources={[{ label: 'Menü Verisi' }, { label: 'Fiyat Takip' }]}
        interval={300_000}
      />

      {/* Category filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => setActiveCategory('all')}
          className={clsx(
            'btn text-xs',
            activeCategory === 'all' ? 'btn-primary' : 'btn-secondary'
          )}
        >
          🍽️ Tümü
        </button>
        {MENU_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={clsx(
              'btn text-xs',
              activeCategory === cat.id ? 'btn-primary' : 'btn-secondary'
            )}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* Avg price bar */}
        <div className="card">
          <h3 className="text-sm font-semibold text-white mb-3">Marka Ortalama Fiyat Karşılaştırması</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={avgPriceData} margin={{ left: 0, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A3A55" />
              <XAxis dataKey="name" tick={{ fill: '#8B9BB4', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#8B9BB4', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₺${v}`} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload?.length) {
                    const d = payload[0].payload;
                    return (
                      <div className="bg-surface border border-navy-border rounded-lg px-3 py-2">
                        <p className="text-sm font-semibold text-white">{d.fullName}</p>
                        <p className="text-xs text-caramel font-bold">Ort. Fiyat: ₺{d.avg}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="avg" radius={[4, 4, 0, 0]}>
                {avgPriceData.map(entry => (
                  <Cell
                    key={entry.id}
                    fill={BRAND_COLORS[entry.id] || '#8B9BB4'}
                    opacity={entry.isOwn ? 1 : 0.7}
                    strokeWidth={entry.isOwn ? 2 : 0}
                    stroke={entry.isOwn ? '#C4922A' : 'transparent'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-between mt-2 text-xs text-muted">
            <span>🟢 = En ucuz</span>
            <span>Espressolab: ₺{BRAND_AVG_PRICES.espressolab}</span>
            <span>🔴 = En pahalı</span>
          </div>
        </div>

        {/* Category breakdown */}
        <div className="card">
          <h3 className="text-sm font-semibold text-white mb-3">Kategori Bazlı Ortalama Fiyatlar</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={categoryPriceData} margin={{ left: 0, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A3A55" />
              <XAxis dataKey="category" tick={{ fill: '#8B9BB4', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#8B9BB4', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₺${v}`} />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload?.length) {
                    return (
                      <div className="bg-surface border border-navy-border rounded-lg px-3 py-2">
                        <p className="text-sm font-semibold text-white mb-1">{label}</p>
                        {payload.map((p, i) => {
                          const brand = BRANDS.find(b => b.id === p.dataKey);
                          return (
                            <p key={i} className="text-xs" style={{ color: brand?.color || '#8B9BB4' }}>
                              {brand?.name}: ₺{p.value}
                            </p>
                          );
                        })}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              {BRANDS.slice(0, 4).map(b => (
                <Bar key={b.id} dataKey={b.id} name={b.name} fill={b.color} opacity={b.isOwn ? 1 : 0.7} radius={[2, 2, 0, 0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Price Matrix Table */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white">
            Fiyat Matrisi — {activeCategory === 'all' ? 'Tüm Ürünler' : MENU_CATEGORIES.find(c => c.id === activeCategory)?.label}
          </h3>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-success" /> En Ucuz</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-danger" /> En Pahalı</span>
            <span className="text-muted">— = Menüde Yok</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-navy-border">
                <th className="table-header py-3 px-3 text-left sticky left-0 bg-surface z-10 min-w-[160px]">Ürün</th>
                <th className="table-header py-3 px-2 text-left min-w-[70px]">Kategori</th>
                {BRANDS.map(b => (
                  <th
                    key={b.id}
                    className={clsx('table-header py-3 px-3 text-center min-w-[90px]', b.isOwn && 'text-caramel')}
                  >
                    <div className="flex flex-col items-center gap-0.5">
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ backgroundColor: b.color }}
                      />
                      {b.shortName}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredItems.map(item => {
                const cat = MENU_CATEGORIES.find(c => c.id === item.category);
                return (
                  <tr key={item.id} className="table-row">
                    <td className="table-cell font-medium text-white sticky left-0 bg-surface">{item.name}</td>
                    <td className="table-cell">
                      <span className="text-[10px] bg-surface2 px-2 py-0.5 rounded-full text-muted">
                        {cat?.icon} {cat?.label}
                      </span>
                    </td>
                    {BRANDS.map(b => {
                      const price = item.prices[b.id];
                      const { cls, style } = getCellClass(item, b.id);
                      return (
                        <td key={b.id} className="table-cell text-center" style={style}>
                          {price !== null && price !== undefined ? (
                            <span className={clsx(cls, b.isOwn && 'underline decoration-caramel/50')}>
                              ₺{price}
                            </span>
                          ) : (
                            <span className="text-navy-border">—</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-4 text-xs text-muted">
          Yeşil = en düşük fiyat, Kırmızı = en yüksek fiyat.
        </div>
      </div>

    </div>
  );
}
