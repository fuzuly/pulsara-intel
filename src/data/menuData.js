// ═══════════════════════════════════════════════════════════════════════════════
// MENÜ FİYATLARI — MAYIS 2026
// null = ürün menüde yok | Fiyatlar TRY, ORTA BOY baz alınmıştır.
//
// KAYNAKLAR:
//   Espressolab   → menufiyatlar.com 2026 ✅ (kullanıcı tarafından doğrulandı)
//   Gloria Jean's → menufiyatlar.com 2026 ✅
//   Coffy         → menufiyatlar.com 2026 ✅
//   Kahve Dünyası → menufiyatlar.com 2026 ✅
//   Starbucks     → haberler.com + sözcü.com.tr 2 Ocak 2026 ✅
//   Caffe Nero    → karekod.org 26 Şubat 2026 ✅
//   Nevada        → karekod.org 26 Şubat 2026 ✅
//   Caribou       → karekod.org 2026 ✅
//   Mikel         → menuvefiyat.com.tr 2024 🟡
//   Kronotrop     → doğrulanamadı ❌
//   Costa Coffee  → doğrulanamadı ❌
// ═══════════════════════════════════════════════════════════════════════════════

export const MENU_CATEGORIES = [
  { id: 'sicak',   label: 'Sıcak İçecekler',  icon: '☕' },
  { id: 'soguk',   label: 'Soğuk İçecekler',  icon: '🧊' },
  { id: 'yiyecek', label: 'Yiyecekler',        icon: '🥐' },
  { id: 'ozel',    label: 'Özel / Sezonluk',   icon: '✨' },
];

export const MENU_ITEMS = [

  // ── SICAK İÇECEKLER ─────────────────────────────────────────────────────────
  {
    id: 'americano',
    name: 'Americano',
    category: 'sicak',
    prices: {
      espressolab:   189,  // ✅ menufiyatlar.com 2026
      starbucks:     150,  // ✅ haberler.com 2 Ocak 2026
      kahvedunyasi:  145,  // ✅ menufiyatlar.com 2026 (Orta 320ml)
      gloriajeans:   160,  // ✅ menufiyatlar.com 2026 (Orta)
      coffy:         145,  // ✅ menufiyatlar.com 2026
      caffenero:      74,  // ✅ karekod.org 26 Şubat 2026
      mikel:          85,  // 🟡 2024
      caribou:       110,  // ✅ karekod.org 2026
      nevada:         95,  // ✅ karekod.org Şubat 2026
      kronotrop:     null,
      costacoffee:   null,
    },
  },
  {
    id: 'latte',
    name: 'Latte',
    category: 'sicak',
    prices: {
      espressolab:   223,  // ✅ menufiyatlar.com 2026
      starbucks:     175,  // ✅ Ocak 2026
      kahvedunyasi:  165,  // ✅ menufiyatlar.com 2026 (Caffe Latte Orta)
      gloriajeans:   185,  // ✅ menufiyatlar.com 2026 (Orta)
      coffy:         150,  // ✅ menufiyatlar.com 2026
      caffenero:      87,  // ✅ karekod.org Şubat 2026
      mikel:          98,  // 🟡 2024
      caribou:       135,  // ✅ karekod.org 2026
      nevada:        110,  // 🟡
      kronotrop:     null,
      costacoffee:   null,
    },
  },
  {
    id: 'cappuccino',
    name: 'Cappuccino',
    category: 'sicak',
    prices: {
      espressolab:   223,  // ✅ menufiyatlar.com 2026
      starbucks:     175,  // ✅ Ocak 2026
      kahvedunyasi:  null, // KD menüsünde sıcak cappuccino listede yok
      gloriajeans:   185,  // ✅ menufiyatlar.com 2026 (Orta)
      coffy:         150,  // ✅ menufiyatlar.com 2026
      caffenero:      87,  // ✅ karekod.org Şubat 2026
      mikel:          95,  // 🟡 2024
      caribou:       135,  // ✅ karekod.org 2026
      nevada:        105,  // 🟡
      kronotrop:     null,
      costacoffee:   null,
    },
  },
  {
    id: 'flatwhite',
    name: 'Flat White',
    category: 'sicak',
    prices: {
      espressolab:   210,  // ✅ menufiyatlar.com 2026
      starbucks:     170,  // ✅ karekod.org 2026
      kahvedunyasi:  null,
      gloriajeans:   200,  // ✅ menufiyatlar.com 2026
      coffy:         155,  // ✅ menufiyatlar.com 2026
      caffenero:     102,  // ✅ karekod.org Şubat 2026
      mikel:          98,  // 🟡 2024
      caribou:       null,
      nevada:        null,
      kronotrop:     null,
      costacoffee:   null,
    },
  },
  {
    id: 'cortado',
    name: 'Cortado',
    category: 'sicak',
    prices: {
      espressolab:   210,  // ✅ menufiyatlar.com 2026
      starbucks:     175,  // ✅ Ocak 2026
      kahvedunyasi:  null,
      gloriajeans:   190,  // ✅ menufiyatlar.com 2026
      coffy:         null,
      caffenero:      85,  // ✅ karekod.org Şubat 2026
      mikel:         null,
      caribou:       null,
      nevada:        null,
      kronotrop:     null,
      costacoffee:   null,
    },
  },
  {
    id: 'mocha',
    name: 'Mocha',
    category: 'sicak',
    prices: {
      espressolab:   284,  // ✅ menufiyatlar.com 2026
      starbucks:     205,  // ✅ karekod.org 2026
      kahvedunyasi:  null, // Buzlu Mocha 195₺ var, sıcak mocha ayrıca listelenmemiş
      gloriajeans:   230,  // ✅ menufiyatlar.com 2026 (Caffe Mocha Orta)
      coffy:         160,  // ✅ menufiyatlar.com 2026
      caffenero:     115,  // ✅ karekod.org Şubat 2026
      mikel:         120,  // 🟡 2024
      caribou:       165,  // ✅ karekod.org 2026
      nevada:        119,  // ✅ karekod.org Şubat 2026
      kronotrop:     null,
      costacoffee:   null,
    },
  },
  {
    id: 'filtre',
    name: 'Filtre Kahve',
    category: 'sicak',
    prices: {
      espressolab:   176,  // ✅ menufiyatlar.com 2026
      starbucks:     145,  // ✅ Ocak 2026
      kahvedunyasi:  140,  // ✅ menufiyatlar.com 2026 (Yöresel Filtre Orta)
      gloriajeans:   155,  // ✅ menufiyatlar.com 2026 (Orta)
      coffy:         140,  // ✅ menufiyatlar.com 2026
      caffenero:      70,  // ✅ karekod.org Şubat 2026
      mikel:          85,  // 🟡 2024
      caribou:       105,  // ✅ karekod.org 2026
      nevada:         90,  // 🟡
      kronotrop:     null,
      costacoffee:   null,
    },
  },
  {
    id: 'turkkahvesi',
    name: 'Türk Kahvesi',
    category: 'sicak',
    prices: {
      espressolab:   162,  // ✅ menufiyatlar.com 2026
      starbucks:     115,  // ✅ karekod.org 2026
      kahvedunyasi:  120,  // ✅ menufiyatlar.com 2026 (80ml tekli)
      gloriajeans:   135,  // ✅ menufiyatlar.com 2026 (Tek)
      coffy:         null, // menüde listelenemedi
      caffenero:      79,  // ✅ karekod.org Şubat 2026
      mikel:         null,
      caribou:       null,
      nevada:         75,  // ✅ karekod.org Şubat 2026
      kronotrop:     null,
      costacoffee:   null,
    },
  },
  {
    id: 'machiato',
    name: 'Caramel Macchiato',
    category: 'sicak',
    prices: {
      espressolab:   284,  // ✅ menufiyatlar.com 2026 (Salted Caramel / Lotus Latte)
      starbucks:     210,  // ✅ Ocak 2026
      kahvedunyasi:  175,  // ✅ menufiyatlar.com 2026 (Karamelli Macchiato Orta)
      gloriajeans:   225,  // ✅ menufiyatlar.com 2026 (Caramelatte Orta)
      coffy:         160,  // ✅ menufiyatlar.com 2026
      caffenero:     115,  // ✅ karekod.org Şubat 2026
      mikel:         null,
      caribou:       165,  // ✅ karekod.org 2026 (Caramel High Rise)
      nevada:        119,  // ✅ karekod.org Şubat 2026
      kronotrop:     null,
      costacoffee:   null,
    },
  },
  {
    id: 'espresso',
    name: 'Espresso',
    category: 'sicak',
    prices: {
      espressolab:   162,  // ✅ menufiyatlar.com 2026
      starbucks:      80,  // ✅ karekod.org 2026 (Solo)
      kahvedunyasi:   95,  // ✅ menufiyatlar.com 2026 (40ml)
      gloriajeans:   150,  // ✅ menufiyatlar.com 2026 (50ml)
      coffy:         null,
      caffenero:      59,  // ✅ karekod.org Şubat 2026
      mikel:          65,  // 🟡 2024
      caribou:       null,
      nevada:        null,
      kronotrop:     null,
      costacoffee:   null,
    },
  },

  // ── SOĞUK İÇECEKLER ─────────────────────────────────────────────────────────
  {
    id: 'coldbrew',
    name: 'Cold Brew',
    category: 'soguk',
    prices: {
      espressolab:   237,  // ✅ menufiyatlar.com 2026 (Cold Brew Kenya)
      starbucks:     170,  // ✅ karekod.org 2026
      kahvedunyasi:  170,  // ✅ menufiyatlar.com 2026 (Cold Brew 460ml)
      gloriajeans:   190,  // ✅ menufiyatlar.com 2026
      coffy:         null,
      caffenero:     104,  // ✅ karekod.org Şubat 2026
      mikel:         null,
      caribou:       130,  // ✅ karekod.org 2026 (Cold Press)
      nevada:        null,
      kronotrop:     null,
      costacoffee:   null,
    },
  },
  {
    id: 'icelatte',
    name: 'Ice Latte',
    category: 'soguk',
    prices: {
      espressolab:   230,  // ✅ menufiyatlar.com 2026 (Iced Caffe Latte)
      starbucks:     165,  // ✅ karekod.org 2026
      kahvedunyasi:  165,  // ✅ menufiyatlar.com 2026 (Buzlu/Freddo Caffe Latte 460ml)
      gloriajeans:   195,  // ✅ menufiyatlar.com 2026 (Iced Latte Orta)
      coffy:         150,  // ✅ menufiyatlar.com 2026
      caffenero:     112,  // ✅ karekod.org Şubat 2026
      mikel:         111,  // 🟡 2024
      caribou:       135,  // ✅ karekod.org 2026
      nevada:         99,  // ✅ karekod.org Şubat 2026
      kronotrop:     null,
      costacoffee:   null,
    },
  },
  {
    id: 'frappe',
    name: 'Frappé / Blended',
    category: 'soguk',
    prices: {
      espressolab:   257,  // ✅ menufiyatlar.com 2026 (Caffe Esfrappa)
      starbucks:     200,  // ✅ karekod.org 2026
      kahvedunyasi:  215,  // ✅ menufiyatlar.com 2026 (Çikolatalı Milkshake)
      gloriajeans:   240,  // ✅ menufiyatlar.com 2026 (Mango Chiller Orta)
      coffy:         165,  // ✅ menufiyatlar.com 2026 (Chocolate Cookie Frappe)
      caffenero:     144,  // ✅ karekod.org Şubat 2026
      mikel:         null,
      caribou:       165,  // ✅ karekod.org 2026 (Cooler serisi)
      nevada:        null,
      kronotrop:     null,
      costacoffee:   null,
    },
  },
  {
    id: 'matcha',
    name: 'Matcha Latte',
    category: 'soguk',
    prices: {
      espressolab:   297,  // ✅ menufiyatlar.com 2026
      starbucks:     195,  // ✅ karekod.org 2026
      kahvedunyasi:  null,
      gloriajeans:   235,  // ✅ menufiyatlar.com 2026
      coffy:         170,  // ✅ menufiyatlar.com 2026
      caffenero:     null,
      mikel:         null,
      caribou:       null,
      nevada:        null,
      kronotrop:     null,
      costacoffee:   null,
    },
  },
  {
    id: 'icecappuccino',
    name: 'Ice Cappuccino',
    category: 'soguk',
    prices: {
      espressolab:   230,  // ✅ menufiyatlar.com 2026 (Iced Cappuccino)
      starbucks:     175,  // ✅ karekod.org 2026
      kahvedunyasi:  165,  // ✅ menufiyatlar.com 2026 (Freddo Cappuccino 460ml)
      gloriajeans:   null,
      coffy:         150,  // ✅ menufiyatlar.com 2026
      caffenero:     124,  // ✅ karekod.org Şubat 2026
      mikel:         null,
      caribou:       null,
      nevada:         99,  // ✅ karekod.org Şubat 2026
      kronotrop:     null,
      costacoffee:   null,
    },
  },
  {
    id: 'nitrobrew',
    name: 'Nitro Cold Brew',
    category: 'soguk',
    prices: {
      espressolab:   null,
      starbucks:     null,
      kahvedunyasi:  null,
      gloriajeans:   null,
      coffy:         null,
      caffenero:     null,
      mikel:         null,
      caribou:       null,
      nevada:        null,
      kronotrop:     null,
      costacoffee:   null,
    },
  },

  // ── YİYECEKLER ──────────────────────────────────────────────────────────────
  {
    id: 'croissant',
    name: 'Croissant (Sade)',
    category: 'yiyecek',
    prices: {
      espressolab:   135,  // ✅ menufiyatlar.com 2026 (Tereyağlı Kruvasan)
      starbucks:     154,  // ✅ karekod.org 2026
      kahvedunyasi:  115,  // ✅ menufiyatlar.com 2026 (Kruvasan 100g)
      gloriajeans:   125,  // ✅ menufiyatlar.com 2026 (Tereyağlı Kruvasan 80g)
      coffy:         100,  // ✅ menufiyatlar.com 2026 (Tereyağlı Kruvasan 85g)
      caffenero:      85,  // ✅ karekod.org Şubat 2026
      mikel:         null,
      caribou:        70,  // ✅ karekod.org 2026 (Anne Poğaçası)
      nevada:        null,
      kronotrop:     null,
      costacoffee:   null,
    },
  },
  {
    id: 'sandvic',
    name: 'Sandviç',
    category: 'yiyecek',
    prices: {
      espressolab:   345,  // ✅ menufiyatlar.com 2026 (Hindi Fümeli Acuka Sandviç)
      starbucks:     175,  // ✅ karekod.org 2026
      kahvedunyasi:  210,  // ✅ menufiyatlar.com 2026 (Tavuk Sezar Sandviç 240g)
      gloriajeans:   215,  // ✅ menufiyatlar.com 2026 (Artizan Sandviç Cheddar)
      coffy:         205,  // ✅ menufiyatlar.com 2026 (Bagel Sandviç ort.)
      caffenero:     147,  // ✅ karekod.org Şubat 2026
      mikel:         127,  // 🟡 2024
      caribou:       180,  // ✅ karekod.org 2026
      nevada:        null,
      kronotrop:     null,
      costacoffee:   null,
    },
  },
  {
    id: 'kek',
    name: 'Dilim Kek / Pasta',
    category: 'yiyecek',
    prices: {
      espressolab:   270,  // ✅ menufiyatlar.com 2026 (Tiramisu / Mozaik Pasta 297₺)
      starbucks:     175,  // ✅ karekod.org 2026
      kahvedunyasi:  160,  // ✅ menufiyatlar.com 2026 (Pasta 120-200₺ ort.)
      gloriajeans:   205,  // ✅ menufiyatlar.com 2026 (Tiramisu 205₺ / Pasta ort.)
      coffy:         180,  // ✅ menufiyatlar.com 2026 (Cheesecake ort.)
      caffenero:     102,  // ✅ karekod.org Şubat 2026
      mikel:         110,  // 🟡
      caribou:       165,  // ✅ karekod.org 2026
      nevada:        135,  // ✅ karekod.org Şubat 2026
      kronotrop:     null,
      costacoffee:   null,
    },
  },
  {
    id: 'muffin',
    name: 'Muffin',
    category: 'yiyecek',
    prices: {
      espressolab:   null, // menüde muffin ayrıca listelenemedi
      starbucks:     185,  // ✅ karekod.org 2026
      kahvedunyasi:  null,
      gloriajeans:   155,  // ✅ menufiyatlar.com 2026 (Çikolatalı Muffin 100g)
      coffy:         140,  // ✅ menufiyatlar.com 2026
      caffenero:     null,
      mikel:         null,
      caribou:       120,  // ✅ karekod.org 2026
      nevada:        null,
      kronotrop:     null,
      costacoffee:   null,
    },
  },

  // ── ÖZEL / SEZONLUK — MAYIS 2026 AKTİF ÜRÜNLER ─────────────────────────────
  {
    id: 'tahini_latte',
    name: 'Creme Brulee Tahini Latte ★',
    category: 'ozel',
    prices: {
      espressolab:   284,  // ✅ menufiyatlar.com 2026 (Tahinli Latte)
      starbucks:     null, kahvedunyasi: null, gloriajeans: null, coffy: null,
      caffenero:     null, mikel: null, caribou: null, nevada: null,
      kronotrop:     null, costacoffee: null,
    },
  },
  {
    id: 'ube_vanilla_latte',
    name: 'Ube Vanilla Latte ★',
    category: 'ozel',
    prices: {
      espressolab:   318,  // ✅ menufiyatlar.com 2026 (Ube Latte)
      starbucks:     210,  // ✅ starbucks.com.tr Mart 2026
      kahvedunyasi:  null, gloriajeans: null, coffy: null,
      caffenero:     null, mikel: null, caribou: null, nevada: null,
      kronotrop:     null, costacoffee: null,
    },
  },
  {
    id: 'cinnamon_sugar_latte',
    name: 'Cinnamon Sugar Latte ★',
    category: 'ozel',
    prices: {
      espressolab:   null, starbucks: null, kahvedunyasi: null,
      gloriajeans:   null, coffy: null, caffenero: null, mikel: null,
      caribou:       190,  // ✅ cariboucoffee.com Mart 2026
      nevada:        null, kronotrop: null, costacoffee: null,
    },
  },
  {
    id: 'passion_fizz',
    name: 'Passion Fizz ★',
    category: 'ozel',
    prices: {
      espressolab:   297,  // ✅ menufiyatlar.com 2026 (Passion Fruit / benzer)
      starbucks:     null, kahvedunyasi: null, gloriajeans: null, coffy: null,
      caffenero:     null, mikel: null, caribou: null, nevada: null,
      kronotrop:     null, costacoffee: null,
    },
  },
];

export const getMenuByCategory = (categoryId) =>
  categoryId === 'all' ? MENU_ITEMS : MENU_ITEMS.filter(item => item.category === categoryId);

// Ortalama fiyatlar — Mayıs 2026 (menufiyatlar.com + doğrulanmış kaynaklar)
export const BRAND_AVG_PRICES = {
  espressolab:   245,  // ✅ menufiyatlar.com 2026
  starbucks:     178,  // ✅ Ocak 2026
  kahvedunyasi:  160,  // ✅ menufiyatlar.com 2026
  gloriajeans:   190,  // ✅ menufiyatlar.com 2026
  coffy:         155,  // ✅ menufiyatlar.com 2026
  caffenero:      95,  // ✅ karekod.org Şubat 2026
  mikel:          95,  // 🟡 2024
  caribou:       135,  // ✅ karekod.org 2026
  nevada:        100,  // ✅ karekod.org Şubat 2026
  kronotrop:       0,  // ❌
  costacoffee:     0,  // ❌
};
