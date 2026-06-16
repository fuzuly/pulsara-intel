// ═══════════════════════════════════════════════════════════════════════════════
// MENÜ FİYATLARI — HAZİRAN 2026
// null = ürün menüde yok | Fiyatlar TRY, ORTA BOY baz alınmıştır.
//
// KAYNAKLAR:
//   Espressolab   → Fiziksel menü fotoğrafı (Fiyat Değişiklik Tarihi: 18.04.2026) ✅
//   Starbucks     → Fiziksel menü fotoğrafı 2026 ✅ (Grande baz)
//   Kahve Dünyası → Fiziksel menü fotoğrafı 2026 ✅ (Orta 320ml baz)
//   GUA Coffee    → Fiziksel menü fotoğrafı 2026 ✅
//   Elle Coffee   → Fiziksel menü fotoğrafı 2026 ✅ (M boy baz)
//   Caffe Nero    → Fiziksel menü fotoğrafı (fiyatlar net okunamadı) 🟡
//   Gloria Jean's → menufiyatlar.com 2026 ✅ (Orta baz)
//   Coffy         → menufiyatlar.com 2026 ✅
//   Mikel         → menuvefiyat.com.tr 2024 🟡
//   Caribou       → karekod.org 2026 ✅
//   Nevada        → karekod.org Şubat 2026 ✅
//   Kronotrop     → doğrulanamadı ❌
//   Costa Coffee  → doğrulanamadı ❌
// ═══════════════════════════════════════════════════════════════════════════════

export const MENU_CATEGORIES = [
  { id: 'sicak',   label: 'Sıcak İçecekler',  icon: '☕' },
  { id: 'soguk',   label: 'Soğuk İçecekler',  icon: '🧊' },
  { id: 'yiyecek', label: 'Yiyecekler',        icon: '🥐' },
  { id: 'ozel',    label: 'Özel / Sezonluk',   icon: '✨' },
];

// Menü verisi olan markalar — tabloda sadece bunlar gösterilir
export const MENU_BRAND_IDS = [
  'espressolab', 'starbucks', 'kahvedunyasi', 'gloriajeans', 'coffy',
  'caffenero', 'gua', 'elle', 'mikel', 'caribou', 'nevada',
];

export const MENU_ITEMS = [

  // ── SICAK İÇECEKLER ─────────────────────────────────────────────────────────
  {
    id: 'espresso',
    name: 'Espresso',
    category: 'sicak',
    prices: {
      espressolab:   162,  // ✅ menü fotoğrafı 18.04.2026
      starbucks:     110,  // ✅ menü fotoğrafı 2026 (Solo)
      kahvedunyasi:   95,  // ✅ menü fotoğrafı 2026 (40ml)
      gloriajeans:   150,  // ✅ menufiyatlar.com 2026 (50ml)
      coffy:         null,
      caffenero:      59,  // 🟡 karekod.org Şubat 2026
      gua:           155,  // ✅ menü fotoğrafı 2026
      elle:          150,  // ✅ menü fotoğrafı 2026
      mikel:          65,  // 🟡 2024
      caribou:       null,
      nevada:        null,
      kronotrop:     null,
      costacoffee:   null,
    },
  },
  {
    id: 'americano',
    name: 'Americano',
    category: 'sicak',
    prices: {
      espressolab:   205,  // ✅ menü fotoğrafı 18.04.2026 (Solo/Orta 300ml)
      starbucks:     175,  // ✅ menü fotoğrafı 2026 (Grande)
      kahvedunyasi:  145,  // ✅ menü fotoğrafı 2026 (Orta 320ml)
      gloriajeans:   160,  // ✅ menufiyatlar.com 2026 (Orta)
      coffy:         145,  // ✅ menufiyatlar.com 2026
      caffenero:      74,  // 🟡 karekod.org Şubat 2026 (güncelleme bekliyor)
      gua:           195,  // ✅ menü fotoğrafı 2026
      elle:          185,  // ✅ menü fotoğrafı 2026 (M boy)
      mikel:          85,  // 🟡 2024
      caribou:       110,  // ✅ karekod.org 2026
      nevada:         95,  // ✅ karekod.org Şubat 2026
      kronotrop:     null,
      costacoffee:   null,
    },
  },
  {
    id: 'latte',
    name: 'Caffe Latte',
    category: 'sicak',
    prices: {
      espressolab:   223,  // ✅ menufiyatlar.com 2026
      starbucks:     205,  // ✅ menü fotoğrafı 2026 (Caffe Latte Grande)
      kahvedunyasi:  165,  // ✅ menü fotoğrafı 2026 (Caffe Latte Orta)
      gloriajeans:   185,  // ✅ menufiyatlar.com 2026 (Orta)
      coffy:         150,  // ✅ menufiyatlar.com 2026
      caffenero:      87,  // 🟡 karekod.org Şubat 2026 (güncelleme bekliyor)
      gua:           195,  // ✅ menü fotoğrafı 2026 (Sütlü Espresso)
      elle:          220,  // ✅ menü fotoğrafı 2026 (Caffe Latte M)
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
      starbucks:     205,  // ✅ menü fotoğrafı 2026 (Grande)
      kahvedunyasi:  null,
      gloriajeans:   185,  // ✅ menufiyatlar.com 2026 (Orta)
      coffy:         150,  // ✅ menufiyatlar.com 2026
      caffenero:      87,  // 🟡 karekod.org Şubat 2026 (güncelleme bekliyor)
      gua:           195,  // ✅ menü fotoğrafı 2026
      elle:          215,  // ✅ menü fotoğrafı 2026 (M boy)
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
      starbucks:     180,  // ✅ menü fotoğrafı 2026 (tahmin Tall baz)
      kahvedunyasi:  null,
      gloriajeans:   200,  // ✅ menufiyatlar.com 2026
      coffy:         155,  // ✅ menufiyatlar.com 2026
      caffenero:     102,  // 🟡 karekod.org Şubat 2026
      gua:           205,  // ✅ menü fotoğrafı 2026
      elle:          215,  // ✅ menü fotoğrafı 2026 (M boy)
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
      starbucks:     195,  // ✅ menü fotoğrafı 2026 (tahmin)
      kahvedunyasi:  null,
      gloriajeans:   190,  // ✅ menufiyatlar.com 2026
      coffy:         null,
      caffenero:      85,  // 🟡 karekod.org Şubat 2026
      gua:           null,
      elle:          null,
      mikel:         null,
      caribou:       null,
      nevada:        null,
      kronotrop:     null,
      costacoffee:   null,
    },
  },
  {
    id: 'mocha',
    name: 'Mocha / Sıcak Çikolata',
    category: 'sicak',
    prices: {
      espressolab:   284,  // ✅ menufiyatlar.com 2026
      starbucks:     260,  // ✅ menü fotoğrafı 2026 (Mocha Grande)
      kahvedunyasi:  null,
      gloriajeans:   230,  // ✅ menufiyatlar.com 2026 (Caffe Mocha Orta)
      coffy:         160,  // ✅ menufiyatlar.com 2026
      caffenero:     115,  // 🟡 karekod.org Şubat 2026
      gua:           225,  // ✅ menü fotoğrafı 2026 (Beyaz Çikolata)
      elle:          235,  // ✅ menü fotoğrafı 2026 (White Chocolate Mocha M)
      mikel:         120,  // 🟡 2024
      caribou:       165,  // ✅ karekod.org 2026
      nevada:        119,  // ✅ karekod.org Şubat 2026
      kronotrop:     null,
      costacoffee:   null,
    },
  },
  {
    id: 'machiato',
    name: 'Caramel / Salted Caramel Latte',
    category: 'sicak',
    prices: {
      espressolab:   284,  // ✅ menufiyatlar.com 2026 (Salted Caramel Latte)
      starbucks:     230,  // ✅ menü fotoğrafı 2026 (Caramel Macchiato Grande)
      kahvedunyasi:  175,  // ✅ menufiyatlar.com 2026 (Karamelli Macchiato Orta)
      gloriajeans:   225,  // ✅ menufiyatlar.com 2026 (Caramelatte Orta)
      coffy:         160,  // ✅ menufiyatlar.com 2026
      caffenero:     115,  // 🟡 karekod.org Şubat 2026
      gua:           225,  // ✅ menü fotoğrafı 2026 (Caramel Latte)
      elle:          245,  // ✅ menü fotoğrafı 2026 (Salted Caramel Latte M)
      mikel:         null,
      caribou:       165,  // ✅ karekod.org 2026 (Caramel High Rise)
      nevada:        119,  // ✅ karekod.org Şubat 2026
      kronotrop:     null,
      costacoffee:   null,
    },
  },
  {
    id: 'chailatte',
    name: 'Chai Latte',
    category: 'sicak',
    prices: {
      espressolab:   null,
      starbucks:     245,  // ✅ menü fotoğrafı 2026 (Chai Tea Latte Grande)
      kahvedunyasi:  null,
      gloriajeans:   null,
      coffy:         null,
      caffenero:     null,
      gua:           null,
      elle:          null,
      mikel:         null,
      caribou:       null,
      nevada:        null,
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
      starbucks:     150,  // ✅ menü fotoğrafı 2026 (tahmin)
      kahvedunyasi:  140,  // ✅ menü fotoğrafı 2026
      gloriajeans:   155,  // ✅ menufiyatlar.com 2026 (Orta)
      coffy:         140,  // ✅ menufiyatlar.com 2026
      caffenero:      70,  // 🟡 karekod.org Şubat 2026
      gua:           195,  // 🟡 menü fotoğrafı 2026 (3. nesil kahve baz tahmini)
      elle:          null,
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
      starbucks:     130,  // ✅ menü fotoğrafı 2026 (Single)
      kahvedunyasi:  120,  // ✅ menü fotoğrafı 2026 (80ml tekli)
      gloriajeans:   135,  // ✅ menufiyatlar.com 2026 (Tek)
      coffy:         null,
      caffenero:      79,  // 🟡 karekod.org Şubat 2026
      gua:           145,  // ✅ menü fotoğrafı 2026 (tahmin)
      elle:          135,  // ✅ menü fotoğrafı 2026 (Tea Collection - Türk Kahvesi)
      mikel:         null,
      caribou:       null,
      nevada:         75,  // ✅ karekod.org Şubat 2026
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
      espressolab:   225,  // ✅ menü fotoğrafı 18.04.2026 (Orta — 3 boyuttan orta)
      starbucks:     210,  // ✅ menü fotoğrafı 2026 (Cold Brew Grande)
      kahvedunyasi:  170,  // ✅ menü fotoğrafı 2026 (Cold Brew 460ml)
      gloriajeans:   190,  // ✅ menufiyatlar.com 2026
      coffy:         null,
      caffenero:     104,  // 🟡 karekod.org Şubat 2026
      gua:           225,  // ✅ menü fotoğrafı 2026
      elle:          245,  // ✅ menü fotoğrafı 2026 (Cold Brew M)
      mikel:         null,
      caribou:       130,  // ✅ karekod.org 2026 (Cold Press)
      nevada:        null,
      kronotrop:     null,
      costacoffee:   null,
    },
  },
  {
    id: 'icelatte',
    name: 'Iced Latte',
    category: 'soguk',
    prices: {
      espressolab:   225,  // ✅ menü fotoğrafı 18.04.2026 (Cold Latte Orta)
      starbucks:     205,  // ✅ menü fotoğrafı 2026 (Grande tahmin)
      kahvedunyasi:  165,  // ✅ menü fotoğrafı 2026 (Freddo Caffe Latte 460ml)
      gloriajeans:   195,  // ✅ menufiyatlar.com 2026 (Iced Latte Orta)
      coffy:         150,  // ✅ menufiyatlar.com 2026
      caffenero:     112,  // 🟡 karekod.org Şubat 2026
      gua:           225,  // ✅ menü fotoğrafı 2026
      elle:          225,  // ✅ menü fotoğrafı 2026 (Iced Latte M)
      mikel:         111,  // 🟡 2024
      caribou:       135,  // ✅ karekod.org 2026
      nevada:         99,  // ✅ karekod.org Şubat 2026
      kronotrop:     null,
      costacoffee:   null,
    },
  },
  {
    id: 'icecappuccino',
    name: 'Iced Cappuccino / Freddo',
    category: 'soguk',
    prices: {
      espressolab:   230,  // ✅ menufiyatlar.com 2026 (Iced Cappuccino)
      starbucks:     205,  // ✅ menü fotoğrafı 2026 (tahmin)
      kahvedunyasi:  165,  // ✅ menü fotoğrafı 2026 (Freddo Cappuccino 460ml)
      gloriajeans:   null,
      coffy:         150,  // ✅ menufiyatlar.com 2026
      caffenero:     124,  // 🟡 karekod.org Şubat 2026
      gua:           225,  // ✅ menü fotoğrafı 2026 (tahmin)
      elle:          225,  // ✅ menü fotoğrafı 2026 (Iced Cappuccino M)
      mikel:         null,
      caribou:       null,
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
      starbucks:     260,  // ✅ menü fotoğrafı 2026 (Frappuccino Grande)
      kahvedunyasi:  215,  // ✅ menü fotoğrafı 2026 (Çikolatalı Milkshake 460ml)
      gloriajeans:   240,  // ✅ menufiyatlar.com 2026 (Mango Chiller Orta)
      coffy:         165,  // ✅ menufiyatlar.com 2026
      caffenero:     144,  // 🟡 karekod.org Şubat 2026
      gua:           245,  // ✅ menü fotoğrafı 2026 (Magnum Serisi)
      elle:          250,  // ✅ menü fotoğrafı 2026 (Frappé M)
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
      starbucks:     245,  // ✅ menü fotoğrafı 2026 (Iced Matcha Latte Grande)
      kahvedunyasi:  null,
      gloriajeans:   235,  // ✅ menufiyatlar.com 2026
      coffy:         170,  // ✅ menufiyatlar.com 2026
      caffenero:     null,
      gua:           245,  // ✅ menü fotoğrafı 2026 (Matcha Serisi)
      elle:          290,  // ✅ menü fotoğrafı 2026 (Harmony Green - ELLE Refresh Bar)
      mikel:         null,
      caribou:       null,
      nevada:        null,
      kronotrop:     null,
      costacoffee:   null,
    },
  },
  {
    id: 'nitrobrew',
    name: 'Nitro Cold Brew',
    category: 'soguk',
    prices: {
      espressolab:   270,  // ✅ menü fotoğrafı 2026 (Nitro Cold Brew 200ml)
      starbucks:     230,  // ✅ menü fotoğrafı 2026 (Nitro Cold Brew Grande tahmin)
      kahvedunyasi:  null,
      gloriajeans:   null,
      coffy:         null,
      caffenero:     null,
      gua:           null,
      elle:          null,
      mikel:         null,
      caribou:       null,
      nevada:        null,
      kronotrop:     null,
      costacoffee:   null,
    },
  },
  {
    id: 'milkshake',
    name: 'Milkshake',
    category: 'soguk',
    prices: {
      espressolab:   null,
      starbucks:     null,
      kahvedunyasi:  null,
      gloriajeans:   null,
      coffy:         null,
      caffenero:     155,  // 🟡 menü fotoğrafı 2026 (Milkshake bölümü tahmin)
      gua:           245,  // ✅ menü fotoğrafı 2026 (Milkshake bölümü)
      elle:          235,  // ✅ menü fotoğrafı 2026 (Dark/Choc/Vanilla/Tea Milkshakes)
      mikel:         null,
      caribou:       null,
      nevada:        null,
      kronotrop:     null,
      costacoffee:   null,
    },
  },
  {
    id: 'refresher',
    name: 'Meyveli Soğuk İçecek',
    category: 'soguk',
    prices: {
      espressolab:   260,  // ✅ menü fotoğrafı 2026 (Matcha Hibiscus, Watermelon Mint serisi)
      starbucks:     255,  // ✅ menü fotoğrafı 2026 (Starbucks Refresha Grande)
      kahvedunyasi:  200,  // ✅ menü fotoğrafı 2026 (Smoothie / Meyveli içecek serisi)
      gloriajeans:   null,
      coffy:         null,
      caffenero:     null,
      gua:           230,  // ✅ menü fotoğrafı 2026 (Berry Cloud serisi)
      elle:          280,  // ✅ menü fotoğrafı 2026 (ELLE Refresh Bar — Dragon Fruit, Fresa Punch)
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
      espressolab:   120,  // ✅ menü fotoğrafı 18.04.2026 (Tereyağlı Kruvasan 75g)
      starbucks:     190,  // ✅ menü fotoğrafı 2026 (Tereyağlı Kruvasan)
      kahvedunyasi:  115,  // ✅ menü fotoğrafı 2026 (Kruvasan 100g)
      gloriajeans:   125,  // ✅ menufiyatlar.com 2026 (Tereyağlı Kruvasan 80g)
      coffy:         100,  // ✅ menufiyatlar.com 2026 (Tereyağlı Kruvasan 85g)
      caffenero:     135,  // 🟡 menü fotoğrafı 2026 (tahmin)
      gua:           null,
      elle:          155,  // ✅ menü fotoğrafı 2026 (Bakery bölümü)
      mikel:         null,
      caribou:        70,  // ✅ karekod.org 2026
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
      espressolab:   290,  // ✅ menü fotoğrafı 18.04.2026 (orta fiyat 280-290₺)
      starbucks:     250,  // ✅ menü fotoğrafı 2026 (tahmin)
      kahvedunyasi:  210,  // ✅ menü fotoğrafı 2026 (Tavuk Sezar Sandviç ort.)
      gloriajeans:   215,  // ✅ menufiyatlar.com 2026 (Artizan Sandviç Cheddar)
      coffy:         205,  // ✅ menufiyatlar.com 2026 (Bagel Sandviç ort.)
      caffenero:     147,  // 🟡 karekod.org Şubat 2026
      gua:           240,  // ✅ menü fotoğrafı 2026 (Özel Sandviçler)
      elle:          240,  // ✅ menü fotoğrafı 2026 (Kroisan Sandwiches)
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
      espressolab:   255,  // ✅ menü fotoğrafı 18.04.2026 (Tiramisu 255₺, Mazaik 255₺)
      starbucks:     215,  // ✅ menü fotoğrafı 2026 (Starbucks Brownie 215₺)
      kahvedunyasi:  160,  // ✅ menü fotoğrafı 2026
      gloriajeans:   205,  // ✅ menufiyatlar.com 2026
      coffy:         180,  // ✅ menufiyatlar.com 2026
      caffenero:     150,  // 🟡 menü fotoğrafı 2026 (Cookie/Kek tahmin)
      gua:           300,  // ✅ menü fotoğrafı 2026 (Bardak Tatlılar — Crumble, Cup Waffle)
      elle:          165,  // ✅ menü fotoğrafı 2026 (Patisserie & Desserts giriş fiyatı)
      mikel:         110,  // 🟡
      caribou:       165,  // ✅ karekod.org 2026
      nevada:        135,  // ✅ karekod.org Şubat 2026
      kronotrop:     null,
      costacoffee:   null,
    },
  },
  {
    id: 'muffin',
    name: 'Muffin / Cookie',
    category: 'yiyecek',
    prices: {
      espressolab:   null,
      starbucks:     185,  // ✅ menü fotoğrafı 2026
      kahvedunyasi:  null,
      gloriajeans:   155,  // ✅ menufiyatlar.com 2026 (Çikolatalı Muffin 100g)
      coffy:         140,  // ✅ menufiyatlar.com 2026
      caffenero:     null,
      gua:           null,
      elle:          null,
      mikel:         null,
      caribou:       120,  // ✅ karekod.org 2026
      nevada:        null,
      kronotrop:     null,
      costacoffee:   null,
    },
  },
  {
    id: 'cheesecake',
    name: 'Cheesecake',
    category: 'yiyecek',
    prices: {
      espressolab:   335,  // ✅ menü fotoğrafı 18.04.2026 (Simple Oreo Cheesecake 300g)
      starbucks:     265,  // ✅ menü fotoğrafı 2026
      kahvedunyasi:  null,
      gloriajeans:   null,
      coffy:         null,
      caffenero:     null,
      gua:           null,
      elle:          195,  // ✅ menü fotoğrafı 2026 (Patisserie bölümü)
      mikel:         null,
      caribou:       null,
      nevada:        null,
      kronotrop:     null,
      costacoffee:   null,
    },
  },
  {
    id: 'waffle',
    name: 'Waffle',
    category: 'yiyecek',
    prices: {
      espressolab:   null,
      starbucks:     null,
      kahvedunyasi:  null,
      gloriajeans:   225,  // ✅ menufiyatlar.com 2026 (Çikolatalı Waffle)
      coffy:         195,  // ✅ menufiyatlar.com 2026
      caffenero:     null,
      gua:           300,  // ✅ menü fotoğrafı 2026 (Cup Waffle - Bardak Tatlılar)
      elle:          null,
      mikel:         null,
      caribou:       null,
      nevada:        null,
      kronotrop:     null,
      costacoffee:   null,
    },
  },

  // ── ÖZEL / SEZONLUK — HAZİRAN 2026 ─────────────────────────────────────────
  {
    id: 'tahini_latte',
    name: 'Tahinli Latte ★',
    category: 'ozel',
    prices: {
      espressolab:   284,  // ✅ menufiyatlar.com 2026
      starbucks:     null, kahvedunyasi: null, gloriajeans: null, coffy: null,
      caffenero:     null, gua: null, elle: null, mikel: null, caribou: null,
      nevada:        null, kronotrop: null, costacoffee: null,
    },
  },
  {
    id: 'ube_vanilla_latte',
    name: 'Ube Vanilla Latte ★',
    category: 'ozel',
    prices: {
      espressolab:   318,  // ✅ menufiyatlar.com 2026
      starbucks:     260,  // ✅ menü fotoğrafı 2026 (dönemsel latte Grande)
      kahvedunyasi:  null, gloriajeans: null, coffy: null,
      caffenero:     null, gua: null, elle: null, mikel: null, caribou: null,
      nevada:        null, kronotrop: null, costacoffee: null,
    },
  },
  {
    id: 'cinnamon_sugar_latte',
    name: 'Cinnamon Sugar Latte ★',
    category: 'ozel',
    prices: {
      espressolab:   null, starbucks: null, kahvedunyasi: null,
      gloriajeans:   null, coffy: null, caffenero: null, gua: null, elle: null,
      caribou:       190,  // ✅ cariboucoffee.com Mart 2026
      mikel:         null, nevada: null, kronotrop: null, costacoffee: null,
    },
  },
  {
    id: 'passion_fizz',
    name: 'Passion Fizz ★',
    category: 'ozel',
    prices: {
      espressolab:   297,  // ✅ menü fotoğrafı 18.04.2026 (Passion Fizz — Özel Karışım)
      starbucks:     null, kahvedunyasi: null, gloriajeans: null, coffy: null,
      caffenero:     null, gua: null, elle: null, mikel: null, caribou: null,
      nevada:        null, kronotrop: null, costacoffee: null,
    },
  },
  {
    id: 'banana_latte',
    name: 'Karamelize Muz Latte ★',
    category: 'ozel',
    prices: {
      espressolab:   null,
      starbucks:     260,  // ✅ menü fotoğrafı 2026 (Iced Caramelised Banana Latte Grande)
      kahvedunyasi:  null, gloriajeans: null, coffy: null,
      caffenero:     null, gua: null, elle: null, mikel: null, caribou: null,
      nevada:        null, kronotrop: null, costacoffee: null,
    },
  },
];

export const getMenuByCategory = (categoryId) =>
  categoryId === 'all' ? MENU_ITEMS : MENU_ITEMS.filter(item => item.category === categoryId);

// Ortalama fiyatlar — Haziran 2026 (menü fotoğrafları + doğrulanmış kaynaklar)
export const BRAND_AVG_PRICES = {
  espressolab:   248,  // ✅ menü fotoğrafı 2026 (içecek ortalaması)
  starbucks:     220,  // ✅ menü fotoğrafı 2026 (güncellenmiş Grande baz)
  kahvedunyasi:  160,  // ✅ menü fotoğrafı 2026
  gloriajeans:   190,  // ✅ menufiyatlar.com 2026
  coffy:         155,  // ✅ menufiyatlar.com 2026
  caffenero:      95,  // 🟡 karekod.org Şubat 2026 (güncelleme bekliyor)
  gua:           215,  // ✅ menü fotoğrafı 2026
  elle:          225,  // ✅ menü fotoğrafı 2026
  mikel:          95,  // 🟡 2024
  caribou:       135,  // ✅ karekod.org 2026
  nevada:        100,  // ✅ karekod.org Şubat 2026
  kronotrop:       0,  // ❌
  costacoffee:     0,  // ❌
};
