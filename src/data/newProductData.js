// ═══════════════════════════════════════════════════════════════════════════════
// YENİ ÜRÜN RADAR — 2026 Lansmanları
//
// Sadece 2026 yılı yeni ürün ve lansmanlarını içerir.
// Eski/mevcut menü ürünleri buraya GİRMEZ.
//
// Rakip haber akışı → scraper otomatik çeker (Google News RSS, her 6 saat)
// ═══════════════════════════════════════════════════════════════════════════════

export const NEW_PRODUCTS = [

  // ── STARBUCKS — Baharın Tatlı Renkleri Kampanyası (9 Mart 2026) ─────────────
  // Kaynak: starbucks.com.tr, foodandtravel.com.tr, horecatrend.com

  {
    id: 'sbx-2026-001',
    brand: 'starbucks',
    name: 'Ube Vanilla Latte',
    category: 'Sezonluk',
    launchDate: '2026-03-09',
    price: 210,
    description: 'Mor tatlı patates (ube) ve vanilya aroması. Blonde espresso + buharda ısıtılmış süt + ube vanilya sosu. "Baharın Tatlı Renkleri" kampanyasının öne çıkan ürünü.',
    status: 'active',
    isOwn: false,
    tags: ['sezonluk', 'bahar', 'ube', 'mor', 'yeni'],
    source: 'starbucks.com.tr — Baharın Tatlı Renkleri',
    isUpcoming: false,
  },
  {
    id: 'sbx-2026-002',
    brand: 'starbucks',
    name: 'Iced Ube Vanilla Matcha Latte',
    category: 'Sezonluk',
    launchDate: '2026-03-09',
    price: 220,
    description: 'Ube vanilya ve matcha bir arada — mor rengiyle sosyal medyada viral olan bahar içeceği.',
    status: 'active',
    isOwn: false,
    tags: ['sezonluk', 'ube', 'matcha', 'soğuk', 'viral'],
    source: 'starbucks.com.tr — Baharın Tatlı Renkleri',
    isUpcoming: false,
  },
  {
    id: 'sbx-2026-003',
    brand: 'starbucks',
    name: 'Lemon Vanilla Latte',
    category: 'Sezonluk',
    launchDate: '2026-03-09',
    price: 205,
    description: 'Limon tazeliği ve vanilyanın yumuşak tadı. Bahar 2026 menüsünün sıcak varyantı.',
    status: 'active',
    isOwn: false,
    tags: ['sezonluk', 'bahar', 'limon', 'vanilla'],
    source: 'starbucks.com.tr — Baharın Tatlı Renkleri',
    isUpcoming: false,
  },
  {
    id: 'sbx-2026-004',
    brand: 'starbucks',
    name: 'Iced Ube Vanilla Macchiato',
    category: 'Sezonluk',
    launchDate: '2026-03-09',
    price: 215,
    description: 'Ube Vanilla Latte serisinin macchiato versiyonu. Soğuk servis.',
    status: 'active',
    isOwn: false,
    tags: ['sezonluk', 'ube', 'macchiato', 'soğuk'],
    source: 'starbucks.com.tr — Baharın Tatlı Renkleri',
    isUpcoming: false,
  },
  {
    id: 'sbx-2026-005',
    brand: 'starbucks',
    name: 'Matcha Cream Frappuccino',
    category: 'Soğuk İçecek',
    launchDate: '2026-03-01',
    price: 215,
    description: 'Menüye geri dönen klasik. Matcha tozu + Frappuccino kreması. "Matcha Zamanı" kampanyası.',
    status: 'active',
    isOwn: false,
    tags: ['matcha', 'frappuccino', 'geri-dönüş'],
    source: 'gastrofill.com — Starbucks\'ta Matcha Zamanı',
    isUpcoming: false,
  },

  // ── CARİBOU COFFEE — Bahar 2026 Menüsü (5 Mart 2026) ───────────────────────
  // Kaynak: cariboucoffee.com resmi basın bülteni

  {
    id: 'car-2026-001',
    brand: 'caribou',
    name: 'Cinnamon Sugar Latte',
    category: 'Sezonluk',
    launchDate: '2026-03-05',
    price: 190,
    description: 'Tarçın şeker aromalı imza latte. Bahar 2026 kampanyasının geri dönen yıldız ürünü.',
    status: 'active',
    isOwn: false,
    tags: ['tarçın', 'şeker', 'sezonluk', 'bahar', 'geri-dönüş'],
    source: 'cariboucoffee.com — Spring 2026 Press Release',
    isUpcoming: false,
  },
  {
    id: 'car-2026-002',
    brand: 'caribou',
    name: 'Amy\'s Blend',
    category: 'Specialty',
    launchDate: '2026-03-05',
    price: 195,
    description: 'İlk kavurma ustası Amy Erickson anısına her yıl çıkan sınırlı üretim harmanlama. Kadın kahve üreticilerini destekleyen özel ürün.',
    status: 'active',
    isOwn: false,
    tags: ['sınırlı-üretim', 'specialty', 'harmanlama', 'özel'],
    source: 'cariboucoffee.com — Amy\'s Blend Spring 2026',
    isUpcoming: false,
  },

  // ── TCHİBO — Ocak 2026 ───────────────────────────────────────────────────────
  // Kaynak: horecatrend.com

  {
    id: 'tch-2026-001',
    brand: 'tchibo',
    name: 'Tchibo Türk Kahvesi — Yeni Reklam Serisi',
    category: 'Türk Kahvesi',
    launchDate: '2026-01-22',
    price: 95,
    description: '"Sır Sizde Saklı" kampanyasıyla yeniden lansmanı yapılan Tchibo Türk Kahvesi. 2018\'den beri mutfaklarda olan ürün yeni kimlikle öne çıktı.',
    status: 'active',
    isOwn: false,
    tags: ['türk-kahvesi', 'kampanya', 'yeniden-lansman'],
    source: 'horecatrend.com — Tchibo\'dan Yeni Reklam Filmi',
    isUpcoming: false,
  },

  // ── GLORİA JEAN'S — Yaz Hazırlığı 2026 ─────────────────────────────────────
  // Kaynak: marketingturkiye.com.tr

  {
    id: 'gj-2026-001',
    brand: 'gloriajeans',
    name: 'Co Lemonade',
    category: 'Soğuk İçecek',
    launchDate: '2026-04-15',
    price: 175,
    description: 'Kahve ve limonata kombinasyonu. Genç nesle yönelik yaz lansmanı. Tüm Gloria Jean\'s şubelerinde.',
    status: 'upcoming',
    isOwn: false,
    tags: ['limonata', 'soğuk', 'gençlik', 'yaz', 'yakında'],
    source: 'marketingturkiye.com.tr — Gloria Jean\'s Coffees',
    osintConfidence: 72,
    isUpcoming: true,
  },

  // ── ESPRESSOLAB — 2026 Yeni Lansmanlar ──────────────────────────────────────

  {
    id: 'esp-2026-001',
    brand: 'espressolab',
    name: 'Spring Bloom Latte',
    category: 'Sezonluk',
    launchDate: '2026-03-21',
    price: 295,
    description: 'Bahar sezonu özel latte. Elderflower ve kiraz çiçeği aromalı, oat milk bazlı.',
    status: 'active',
    isOwn: false,
    tags: ['sezonluk', 'bahar', 'elderflower', 'oat-milk'],
    source: 'İç Kaynak — Lütfen doğrulayın',
    isUpcoming: false,
  },
  {
    id: 'esp-2026-002',
    brand: 'espressolab',
    name: 'Pistachio Cold Brew',
    category: 'Cold Brew',
    launchDate: '2026-04-01',
    price: 275,
    description: 'Antep fıstığı aroması ile hazırlanan nitro cold brew. Yeni sezon soğuk içecek serisi.',
    status: 'upcoming',
    isOwn: false,
    tags: ['cold-brew', 'fıstık', 'nitro', 'yakında'],
    source: 'İç Kaynak — Lütfen doğrulayın',
    osintConfidence: 70,
    isUpcoming: true,
  },
  {
    id: 'esp-2026-003',
    brand: 'espressolab',
    name: 'Matcha Esfrappa',
    category: 'Signature',
    launchDate: '2026-04-15',
    price: 295,
    description: 'Esfrappa serisine eklenen matcha varyantı. Japon matcha tozu ve espresso karışımı.',
    status: 'upcoming',
    isOwn: false,
    tags: ['esfrappa', 'matcha', 'signature', 'yakında'],
    source: 'İç Kaynak — Lütfen doğrulayın',
    osintConfidence: 65,
    isUpcoming: true,
  },
];

export const PRODUCT_CATEGORIES = [
  'Tümü', 'Sezonluk', 'Soğuk İçecek', 'Specialty', 'Cold Brew',
  'Signature', 'Türk Kahvesi', 'Fonksiyonel', 'Sıcak İçecek', 'Yiyecek',
];
