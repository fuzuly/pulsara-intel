import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, X, UtensilsCrossed, BarChart3, Sparkles, Hash,
  LayoutDashboard, ArrowRight,
} from 'lucide-react';
import { MENU_ITEMS } from '../../data/menuData';
import { BRANDS } from '../../constants/brands';
import { TRENDING_KEYWORDS } from '../../data/osintData';
import { NEW_PRODUCTS } from '../../data/newProductData';
import { NAV_ITEMS } from '../../constants/routes';
import clsx from 'clsx';

function brandName(id) {
  return BRANDS.find(b => b.id === id)?.name || id;
}
function brandShort(id) {
  return BRANDS.find(b => b.id === id)?.shortName || id;
}
function brandColor(id) {
  return BRANDS.find(b => b.id === id)?.color || '#8B9BB4';
}

// Build search index once at module load — never rebuilds
const INDEX = (() => {
  const items = [];

  // Pages
  NAV_ITEMS.filter(n => n.path && !n.external).forEach(nav => {
    items.push({
      id: `nav-${nav.path}`,
      category: 'Sayfa',
      title: nav.label,
      subtitle: nav.description || '',
      route: nav.path,
      searchText: `${nav.label} ${nav.description || ''}`.toLowerCase(),
    });
  });

  // Menu items
  MENU_ITEMS.forEach(item => {
    const cat = item.category === 'sicak' ? 'Sıcak İçecek'
      : item.category === 'soguk' ? 'Soğuk İçecek'
      : item.category === 'yiyecek' ? 'Yiyecek' : 'Özel Ürün';
    items.push({
      id: `menu-${item.id}`,
      category: 'Menü',
      title: item.name,
      subtitle: `${cat} — fiyat karşılaştırması`,
      route: '/menu-karsilastirmasi',
      searchText: `${item.name} ${cat} kahve içecek fiyat`.toLowerCase(),
    });
  });

  // Brands
  BRANDS.forEach(brand => {
    items.push({
      id: `brand-${brand.id}`,
      category: 'Rakip',
      title: brand.name,
      subtitle: brand.description?.slice(0, 70) || 'Rakip marka analizi',
      route: brand.id === 'gloriajeans' ? '/gloria-jeans' : '/rakip-analizi',
      searchText: `${brand.name} ${brand.shortName || ''} ${brand.description || ''} rakip`.toLowerCase(),
      brandId: brand.id,
    });
  });

  // New products
  NEW_PRODUCTS.forEach(prod => {
    const desc = prod.description || '';
    items.push({
      id: `prod-${prod.id}`,
      category: 'Yeni Ürün',
      title: prod.name,
      subtitle: `${brandShort(prod.brand)} — ${desc.slice(0, 65)}${desc.length > 65 ? '…' : ''}`,
      route: '/yeni-urun-radar',
      searchText: `${prod.name} ${desc} ${(prod.tags || []).join(' ')} ${brandName(prod.brand)}`.toLowerCase(),
      brandId: prod.brand,
    });
  });

  // Trending keywords
  Object.entries(TRENDING_KEYWORDS).forEach(([id, keywords]) => {
    keywords.forEach(kw => {
      items.push({
        id: `kw-${id}-${kw}`,
        category: 'Trend',
        title: `#${kw}`,
        subtitle: `${brandName(id)} — trend kelime`,
        route: '/osint-raporlari',
        searchText: `${kw} ${brandName(id)} trend`.toLowerCase(),
        brandId: id,
      });
    });
  });

  return items;
})();

const CATEGORY_ORDER = ['Sayfa', 'Menü', 'Rakip', 'Yeni Ürün', 'Trend'];
const CATEGORY_META = {
  Sayfa:      { icon: LayoutDashboard, color: 'text-info' },
  Menü:       { icon: UtensilsCrossed, color: 'text-caramel' },
  Rakip:      { icon: BarChart3,       color: 'text-purple-400' },
  'Yeni Ürün':{ icon: Sparkles,        color: 'text-success' },
  Trend:      { icon: Hash,            color: 'text-pink-400' },
};

export default function GlobalSearch({ onClose }) {
  const [query, setQuery] = useState('');
  const [selIdx, setSelIdx]   = useState(0);
  const navigate  = useNavigate();
  const inputRef  = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const q = query.trim().toLowerCase();

  const { sections, total } = useMemo(() => {
    if (!q || q.length < 2) return { sections: [], total: 0 };

    const grouped = {};
    INDEX.forEach(item => {
      if (!item.searchText.includes(q)) return;
      if (!grouped[item.category]) grouped[item.category] = [];
      if (grouped[item.category].length < 4) grouped[item.category].push(item);
    });

    let gi = 0;
    const secs = [];
    CATEGORY_ORDER.forEach(cat => {
      if (!grouped[cat]?.length) return;
      secs.push({
        category: cat,
        items: grouped[cat].map(item => ({ ...item, gi: gi++ })),
      });
    });
    return { sections: secs, total: gi };
  }, [q]);

  useEffect(() => { setSelIdx(0); }, [query]);

  const allItems = useMemo(() => sections.flatMap(s => s.items), [sections]);

  const go = (item) => { navigate(item.route); onClose(); };

  const handleKey = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelIdx(p => Math.min(p + 1, total - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setSelIdx(p => Math.max(p - 1, 0)); }
    else if (e.key === 'Enter') { const sel = allItems.find(i => i.gi === selIdx); if (sel) go(sel); }
    else if (e.key === 'Escape') { onClose(); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[14vh] px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/65 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full max-w-2xl bg-navy border border-navy-border rounded-2xl shadow-2xl overflow-hidden animate-fade-in">

        {/* Input row */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-navy-border">
          <Search size={18} className="text-muted flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ara… (latte, gloria jeans, şikayet, starbucks...)"
            className="flex-1 bg-transparent text-white placeholder-muted outline-none text-sm"
          />
          {query ? (
            <button onClick={() => setQuery('')} className="text-muted hover:text-white transition-colors">
              <X size={15} />
            </button>
          ) : (
            <kbd className="hidden sm:flex items-center px-1.5 py-0.5 text-[10px] text-muted border border-navy-border rounded font-mono">
              ESC
            </kbd>
          )}
        </div>

        {/* Body */}
        <div className="max-h-[58vh] overflow-y-auto">
          {!q || q.length < 2 ? (
            <div className="px-4 py-10 text-center">
              <p className="text-2xl mb-2">🔍</p>
              <p className="text-sm text-muted">En az 2 karakter yazın</p>
              <p className="text-[11px] text-muted/50 mt-1">
                Menü, rakip, yeni ürün veya trend kelime arayın
              </p>
            </div>
          ) : total === 0 ? (
            <div className="px-4 py-10 text-center">
              <p className="text-2xl mb-2">😕</p>
              <p className="text-sm text-muted">"{query}" için sonuç bulunamadı</p>
            </div>
          ) : (
            <div className="py-1">
              {sections.map(section => {
                const meta = CATEGORY_META[section.category];
                const Icon = meta?.icon;
                return (
                  <div key={section.category}>
                    {/* Category header */}
                    <div className="flex items-center gap-2 px-4 pt-3 pb-1">
                      {Icon && <Icon size={11} className={clsx('flex-shrink-0', meta.color)} />}
                      <span className={clsx('text-[10px] font-bold uppercase tracking-widest', meta.color)}>
                        {section.category}
                      </span>
                    </div>

                    {/* Items */}
                    {section.items.map(item => {
                      const isSelected = item.gi === selIdx;
                      const bc = item.brandId ? brandColor(item.brandId) : null;
                      return (
                        <button
                          key={item.id}
                          onClick={() => go(item)}
                          onMouseEnter={() => setSelIdx(item.gi)}
                          className={clsx(
                            'w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors',
                            isSelected ? 'bg-surface2' : 'hover:bg-surface2/40'
                          )}
                        >
                          <span
                            className="w-2 h-2 rounded-full flex-shrink-0"
                            style={{ backgroundColor: bc || '#3B4A6B' }}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-white font-medium truncate">{item.title}</p>
                            {item.subtitle && (
                              <p className="text-[11px] text-muted truncate">{item.subtitle}</p>
                            )}
                          </div>
                          {isSelected && <ArrowRight size={13} className="text-muted flex-shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        {total > 0 && (
          <div className="px-4 py-2 border-t border-navy-border flex items-center gap-4 text-[10px] text-muted">
            <span>{total} sonuç</span>
            <span className="flex items-center gap-1">
              <kbd className="px-1 border border-navy-border rounded font-mono text-[9px]">↑↓</kbd> gezin
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1 border border-navy-border rounded font-mono text-[9px]">↵</kbd> aç
            </span>
            <span className="flex items-center gap-1 ml-auto">
              <kbd className="px-1 border border-navy-border rounded font-mono text-[9px]">esc</kbd> kapat
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
