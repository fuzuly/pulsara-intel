import { useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts';
import SectionHeader from '../components/common/SectionHeader';
import { BRANDS, BRAND_COLORS } from '../constants/brands';
import { MENU_ITEMS, MENU_CATEGORIES, BRAND_AVG_PRICES } from '../data/menuData';
import menuPrices from '../data/menuPrices.json';
import clsx from 'clsx';

// ─── Fiyat Tablosu Tanımları ────────────────────────────────────────────────
const PRICE_SECTIONS = [
  { id: 'sicak',   label: 'Sıcak İçecekler',   icon: '☕' },
  { id: 'soguk',   label: 'Soğuk İçecekler',   icon: '🧊' },
  { id: 'yiyecek', label: 'Yiyecekler',         icon: '🥐' },
];

const PRICE_ROWS = [
  // ── SICAK ──────────────────────────────────────────────────────────────────
  { key: 'espresso',                    label: 'Espresso',                    size: null, sec: 'sicak'   },
  { key: 'americano_small',             label: 'Americano',                   size: 'S',  sec: 'sicak'   },
  { key: 'americano_large',             label: 'Americano',                   size: 'L',  sec: 'sicak'   },
  { key: 'cappuccino_small',            label: 'Cappuccino',                  size: 'S',  sec: 'sicak'   },
  { key: 'cappuccino_large',            label: 'Cappuccino',                  size: 'L',  sec: 'sicak'   },
  { key: 'caffe_latte_small',           label: 'Caffe Latte',                 size: 'S',  sec: 'sicak'   },
  { key: 'caffe_latte_large',           label: 'Caffe Latte',                 size: 'L',  sec: 'sicak'   },
  { key: 'flat_white',                  label: 'Flat White',                  size: null, sec: 'sicak'   },
  { key: 'cortado',                     label: 'Cortado',                     size: null, sec: 'sicak'   },
  { key: 'mocha',                       label: 'Mocha / Caffe Mocha',         size: null, sec: 'sicak'   },
  { key: 'hot_chocolate_small',         label: 'Sıcak Çikolata',              size: 'S',  sec: 'sicak'   },
  { key: 'hot_chocolate_large',         label: 'Sıcak Çikolata',              size: 'L',  sec: 'sicak'   },
  { key: 'salted_caramel_latte_small',  label: 'Salted Caramel Latte',        size: 'S',  sec: 'sicak'   },
  { key: 'salted_caramel_latte_large',  label: 'Salted Caramel Latte',        size: 'L',  sec: 'sicak'   },
  { key: 'chai_latte',                  label: 'Chai Latte',                  size: null, sec: 'sicak'   },
  { key: 'filter_coffee_small',         label: 'Filtre Kahve',                size: 'S',  sec: 'sicak'   },
  { key: 'filter_coffee_large',         label: 'Filtre Kahve',                size: 'L',  sec: 'sicak'   },
  { key: 'turkish_coffee',              label: 'Türk Kahvesi',                size: null, sec: 'sicak'   },
  // ── SOĞUK ─────────────────────────────────────────────────────────────────
  { key: 'cold_brew_small',             label: 'Cold Brew',                   size: 'S',  sec: 'soguk'   },
  { key: 'cold_brew_large',             label: 'Cold Brew',                   size: 'L',  sec: 'soguk'   },
  { key: 'nitro_cold_brew',             label: 'Nitro Cold Brew',             size: null, sec: 'soguk'   },
  { key: 'iced_latte_small',            label: 'Iced Latte',                  size: 'S',  sec: 'soguk'   },
  { key: 'iced_latte_large',            label: 'Iced Latte',                  size: 'L',  sec: 'soguk'   },
  { key: 'iced_cappuccino',             label: 'Iced Cappuccino / Freddo',    size: null, sec: 'soguk'   },
  { key: 'iced_americano',              label: 'Iced Americano',              size: null, sec: 'soguk'   },
  { key: 'frappuccino_small',           label: 'Frappuccino / Frappé',        size: 'S',  sec: 'soguk'   },
  { key: 'frappuccino_large',           label: 'Frappuccino / Frappé',        size: 'L',  sec: 'soguk'   },
  { key: 'milkshake',                   label: 'Milkshake',                   size: null, sec: 'soguk'   },
  { key: 'matcha_latte',                label: 'Matcha Latte',                size: null, sec: 'soguk'   },
  { key: 'refresher',                   label: 'Meyveli İçecek / Refresher',  size: null, sec: 'soguk'   },
  // ── YİYECEK ───────────────────────────────────────────────────────────────
  { key: 'croissant',                   label: 'Croissant',                   size: null, sec: 'yiyecek' },
  { key: 'sandvic',                     label: 'Sandviç',                     size: null, sec: 'yiyecek' },
  { key: 'cheesecake',                  label: 'Cheesecake',                  size: null, sec: 'yiyecek' },
  { key: 'tiramisu',                    label: 'Tiramisu',                    size: null, sec: 'yiyecek' },
  { key: 'brownie',                     label: 'Brownie',                     size: null, sec: 'yiyecek' },
  { key: 'cookie',                      label: 'Cookie',                      size: null, sec: 'yiyecek' },
  { key: 'profiterol',                  label: 'Profiterol',                  size: null, sec: 'yiyecek' },
  { key: 'mozaik_pasta',                label: 'Mozaik Pasta',                size: null, sec: 'yiyecek' },
  { key: 'waffle',                      label: 'Waffle',                      size: null, sec: 'yiyecek' },
];

const PRICE_BRANDS = Object.keys(menuPrices.brands);
const PRICE_BRAND_COLORS = {
  'Espressolab':   '#C4922A',
  'Starbucks':     '#00704A',
  'GUA Coffee':    '#DB2777',
  'Kahve Dünyası': '#E05050',
  'ELLE Coffee':   '#9B1B5A',
};

function getPrice(key, brand) {
  return menuPrices.brands[brand]?.[key] ?? null;
}

// ─── Fiyat Tablosu Bileşeni ─────────────────────────────────────────────────
function PriceTable() {
  const [activeSection, setActiveSection] = useState('all');
  const [highlight, setHighlight]         = useState(true);

  const tableRows = useMemo(() => {
    const base = activeSection === 'all'
      ? PRICE_ROWS
      : PRICE_ROWS.filter(r => r.sec === activeSection);
    const filtered = base.filter(row => PRICE_BRANDS.some(b => getPrice(row.key, b) !== null));
    // Kategori başlıklarını flatten array olarak ekle (Fragment key sorununu önler)
    const result = [];
    let lastSec = null;
    filtered.forEach(row => {
      if (activeSection === 'all' && row.sec !== lastSec) {
        result.push({ type: 'header', sec: row.sec, id: `header-${row.sec}` });
        lastSec = row.sec;
      }
      result.push({ type: 'row', ...row, id: row.key });
    });
    return { rows: result, total: filtered.length };
  }, [activeSection]);

  const getCellStyle = (key, brand) => {
    if (!highlight) return {};
    const price = getPrice(key, brand);
    if (price === null) return {};
    const prices = PRICE_BRANDS.map(b => getPrice(key, b)).filter(p => p !== null);
    if (prices.length < 2) return {};
    if (price === Math.min(...prices)) return { bg: 'bg-success/10', text: 'text-success font-bold' };
    if (price === Math.max(...prices)) return { bg: 'bg-danger/10',  text: 'text-danger font-semibold' };
    return {};
  };

  return (
    <div className="card">
      {/* Başlık + Kontroller */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div>
          <h3 className="text-sm font-semibold text-white">Fiyat Karşılaştırma Tablosu</h3>
          <p className="text-xs text-muted mt-0.5">
            {PRICE_BRANDS.join(' · ')} — Haziran 2026
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs flex-shrink-0">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-success inline-block" />En Ucuz
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-danger inline-block" />En Pahalı
          </span>
          <label className="flex items-center gap-1.5 text-muted cursor-pointer select-none">
            <input
              type="checkbox"
              checked={highlight}
              onChange={e => setHighlight(e.target.checked)}
              className="accent-caramel"
            />
            Vurgula
          </label>
        </div>
      </div>

      {/* Kategori Filtre Butonları */}
      <div className="flex items-center gap-2 flex-wrap mb-4">
        <button
          onClick={() => setActiveSection('all')}
          className={clsx('btn text-xs', activeSection === 'all' ? 'btn-primary' : 'btn-secondary')}
        >
          Tümü
        </button>
        {PRICE_SECTIONS.map(s => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            className={clsx('btn text-xs', activeSection === s.id ? 'btn-primary' : 'btn-secondary')}
          >
            {s.icon} {s.label}
          </button>
        ))}
        <span className="ml-auto text-xs text-muted">{tableRows.total} ürün</span>
      </div>

      {/* Tablo */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-navy-border">
              <th className="table-header py-3 px-3 text-left sticky left-0 bg-surface z-10 min-w-[180px]">
                Ürün
              </th>
              <th className="table-header py-3 px-2 text-center w-8">Boy</th>
              {PRICE_BRANDS.map(brand => (
                <th key={brand} className="table-header py-3 px-3 text-center min-w-[110px]">
                  <div className="flex flex-col items-center gap-0.5">
                    <span
                      className="h-1.5 w-1.5 rounded-full inline-block"
                      style={{ backgroundColor: PRICE_BRAND_COLORS[brand] }}
                    />
                    <span style={{ color: brand === 'Espressolab' ? '#C4922A' : undefined }}>
                      {brand}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableRows.rows.map(item => {
              if (item.type === 'header') {
                const secInfo = PRICE_SECTIONS.find(s => s.id === item.sec);
                return (
                  <tr key={item.id}>
                    <td
                      colSpan={PRICE_BRANDS.length + 2}
                      className="px-3 pt-5 pb-1.5 text-[10px] font-bold tracking-widest uppercase text-muted border-b border-navy-border/50"
                    >
                      {secInfo?.icon} {secInfo?.label}
                    </td>
                  </tr>
                );
              }
              return (
                <tr key={item.id} className="table-row">
                  <td className="table-cell font-medium text-white sticky left-0 bg-surface">
                    {item.label}
                  </td>
                  <td className="table-cell text-center">
                    {item.size ? (
                      <span className="text-[10px] bg-surface2 px-1.5 py-0.5 rounded text-muted font-mono">
                        {item.size}
                      </span>
                    ) : (
                      <span className="text-navy-border text-xs">—</span>
                    )}
                  </td>
                  {PRICE_BRANDS.map(brand => {
                    const price = getPrice(item.key, brand);
                    const { bg = '', text = 'text-white' } = getCellStyle(item.key, brand);
                    return (
                      <td key={brand} className={clsx('table-cell text-center', bg)}>
                        {price !== null ? (
                          <span
                            className={clsx(text, brand === 'Espressolab' && 'underline decoration-caramel/40')}
                          >
                            ₺{price}
                          </span>
                        ) : (
                          <span className="text-navy-border select-none">—</span>
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

      <p className="mt-4 text-[11px] text-muted">
        Yeşil = satırdaki en düşük fiyat &nbsp;·&nbsp; Kırmızı = satırdaki en yüksek fiyat &nbsp;·&nbsp;
        — = menüde yok &nbsp;·&nbsp; Son güncelleme: {menuPrices.lastUpdated}
      </p>
    </div>
  );
}

// ─── Ana Sayfa ───────────────────────────────────────────────────────────────
export default function MenuComparison() {

  const avgPriceData = useMemo(() =>
    BRANDS.map(b => ({
      name: b.shortName,
      fullName: b.name,
      avg: BRAND_AVG_PRICES[b.id] || 0,
      id: b.id,
      isOwn: b.isOwn,
    })).filter(b => b.avg > 0).sort((a, b) => b.avg - a.avg)
  , []);

  const categoryPriceData = useMemo(() =>
    MENU_CATEGORIES.map(cat => {
      const catItems = MENU_ITEMS.filter(i => i.category === cat.id);
      const row = { category: cat.label };
      BRANDS.slice(0, 6).forEach(b => {
        const prices = catItems
          .map(i => i.prices[b.id])
          .filter(p => p !== null && p !== undefined);
        row[b.id] = prices.length > 0
          ? Math.round(prices.reduce((a, c) => a + c, 0) / prices.length)
          : 0;
      });
      return row;
    })
  , []);

  return (
    <div className="space-y-6 animate-fade-in">
      <SectionHeader
        title="Menü Karşılaştırması"
        subtitle="Tüm markaların ürün ve fiyat karşılaştırması"
      />

      {/* Grafik paneli */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <div className="card">
          <h3 className="text-sm font-semibold text-white mb-3">Marka Ortalama Fiyat Karşılaştırması</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={avgPriceData} margin={{ left: 0, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A3A55" />
              <XAxis dataKey="name" tick={{ fill: '#8B9BB4', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#8B9BB4', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₺${v}`} />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const d = payload[0].payload;
                  return (
                    <div className="bg-surface border border-navy-border rounded-lg px-3 py-2">
                      <p className="text-sm font-semibold text-white">{d.fullName}</p>
                      <p className="text-xs text-caramel font-bold">Ort. Fiyat: ₺{d.avg}</p>
                    </div>
                  );
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
            <span>Yeşil çizgi = Espressolab</span>
            <span className="text-caramel font-semibold">
              Espressolab: ₺{BRAND_AVG_PRICES.espressolab}
            </span>
          </div>
        </div>

        <div className="card">
          <h3 className="text-sm font-semibold text-white mb-3">Kategori Bazlı Ortalama Fiyatlar</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={categoryPriceData} margin={{ left: 0, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A3A55" />
              <XAxis
                dataKey="category"
                tick={{ fill: '#8B9BB4', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#8B9BB4', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={v => `₺${v}`}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;
                  return (
                    <div className="bg-surface border border-navy-border rounded-lg px-3 py-2">
                      <p className="text-sm font-semibold text-white mb-1">{label}</p>
                      {payload.map((p, i) => {
                        const brand = BRANDS.find(b => b.id === p.dataKey);
                        return p.value > 0 ? (
                          <p key={i} className="text-xs" style={{ color: brand?.color || '#8B9BB4' }}>
                            {brand?.shortName}: ₺{p.value}
                          </p>
                        ) : null;
                      })}
                    </div>
                  );
                }}
              />
              {BRANDS.slice(0, 6).map(b => (
                <Bar
                  key={b.id}
                  dataKey={b.id}
                  name={b.name}
                  fill={b.color}
                  opacity={b.isOwn ? 1 : 0.7}
                  radius={[2, 2, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tam Menü Karşılaştırma Tablosu */}
      <PriceTable />
    </div>
  );
}
