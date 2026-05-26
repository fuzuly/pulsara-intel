// ═══════════════════════════════════════════════════════════════════════════════
// SATIŞ VERİLERİ — MART 2026
// Espressolab 280 TR şube bazında güncel tahminler
// ═══════════════════════════════════════════════════════════════════════════════

export const MONTHLY_SALES = [
  // 2025
  { month: 'Oca 25', espressolab: 9800000,  starbucks: 98000000,  kahvedunyasi: 52000000, kronotrop: 3800000 },
  { month: 'Şub 25', espressolab: 9200000,  starbucks: 94000000,  kahvedunyasi: 49500000, kronotrop: 3600000 },
  { month: 'Mar 25', espressolab: 10500000, starbucks: 104000000, kahvedunyasi: 55000000, kronotrop: 4100000 },
  { month: 'Nis 25', espressolab: 11200000, starbucks: 110000000, kahvedunyasi: 58000000, kronotrop: 4400000 },
  { month: 'May 25', espressolab: 12000000, starbucks: 116000000, kahvedunyasi: 61000000, kronotrop: 4700000 },
  { month: 'Haz 25', espressolab: 11500000, starbucks: 112000000, kahvedunyasi: 59000000, kronotrop: 4500000 },
  { month: 'Tem 25', espressolab: 13200000, starbucks: 124000000, kahvedunyasi: 65000000, kronotrop: 5100000 },
  { month: 'Ağu 25', espressolab: 14000000, starbucks: 130000000, kahvedunyasi: 68000000, kronotrop: 5400000 },
  { month: 'Eyl 25', espressolab: 14800000, starbucks: 136000000, kahvedunyasi: 71000000, kronotrop: 5700000 },
  { month: 'Eki 25', espressolab: 15500000, starbucks: 142000000, kahvedunyasi: 74000000, kronotrop: 6000000 },
  { month: 'Kas 25', espressolab: 16200000, starbucks: 148000000, kahvedunyasi: 77000000, kronotrop: 6300000 },
  { month: 'Ara 25', espressolab: 18500000, starbucks: 168000000, kahvedunyasi: 87000000, kronotrop: 7200000 },
  // 2026
  { month: 'Oca 26', espressolab: 15000000, starbucks: 140000000, kahvedunyasi: 73000000, kronotrop: 5900000 },
  { month: 'Şub 26', espressolab: 16200000, starbucks: 148000000, kahvedunyasi: 77000000, kronotrop: 6200000 },
  { month: 'Mar 26', espressolab: 18200000, starbucks: 165000000, kahvedunyasi: 85000000, kronotrop: 7100000 },
];

export const WEEKLY_SALES = [
  { week: 'Hft 1',  revenue: 3850000, orders: 4920, avgBasket: 782, newCustomers: 412 },
  { week: 'Hft 2',  revenue: 4050000, orders: 5180, avgBasket: 782, newCustomers: 438 },
  { week: 'Hft 3',  revenue: 3920000, orders: 5010, avgBasket: 783, newCustomers: 405 },
  { week: 'Hft 4',  revenue: 4200000, orders: 5370, avgBasket: 782, newCustomers: 461 },
  { week: 'Hft 5',  revenue: 4350000, orders: 5550, avgBasket: 784, newCustomers: 478 },
  { week: 'Hft 6',  revenue: 4520000, orders: 5770, avgBasket: 783, newCustomers: 495 },
  { week: 'Hft 7',  revenue: 4680000, orders: 5970, avgBasket: 784, newCustomers: 512 },
  { week: 'Hft 8',  revenue: 4850000, orders: 6190, avgBasket: 783, newCustomers: 534 },
  { week: 'Hft 9',  revenue: 4700000, orders: 6000, avgBasket: 783, newCustomers: 508 },
  { week: 'Hft 10', revenue: 4920000, orders: 6280, avgBasket: 783, newCustomers: 548 },
  { week: 'Hft 11', revenue: 5100000, orders: 6510, avgBasket: 784, newCustomers: 570 },
  { week: 'Hft 12', revenue: 5280000, orders: 6740, avgBasket: 784, newCustomers: 590 },
];

export const CATEGORY_BREAKDOWN = [
  { name: 'Sıcak İçecekler', espressolab: 42, starbucks: 45, kahvedunyasi: 48, kronotrop: 55 },
  { name: 'Soğuk İçecekler', espressolab: 30, starbucks: 32, kahvedunyasi: 22, kronotrop: 27 },
  { name: 'Yiyecekler',      espressolab: 20, starbucks: 17, kahvedunyasi: 25, kronotrop: 13 },
  { name: 'Merchandise',     espressolab:  8, starbucks:  6, kahvedunyasi:  5, kronotrop:  5 },
];

export const DAILY_PATTERN = [
  { saat: '07:00', satis: 210,  istek: 'Americano, Filtre' },
  { saat: '08:00', satis: 510,  istek: 'Latte, Croissant' },
  { saat: '09:00', satis: 720,  istek: 'Cappuccino, Sandviç' },
  { saat: '10:00', satis: 640,  istek: 'Latte, Kek' },
  { saat: '11:00', satis: 480,  istek: 'Filtre, Sandviç' },
  { saat: '12:00', satis: 780,  istek: 'Ice Latte, Sandviç' },
  { saat: '13:00', satis: 860,  istek: 'Soğuk İçecekler, Yiyecek' },
  { saat: '14:00', satis: 650,  istek: 'Cold Brew, Kek' },
  { saat: '15:00', satis: 610,  istek: 'Cappuccino, Croissant' },
  { saat: '16:00', satis: 690,  istek: 'Latte, Kek' },
  { saat: '17:00', satis: 800,  istek: 'Ice Latte, Cold Brew' },
  { saat: '18:00', satis: 720,  istek: 'Latte, Sandviç' },
  { saat: '19:00', satis: 530,  istek: 'Cappuccino, Kek' },
  { saat: '20:00', satis: 380,  istek: 'Filtre, Tatlı' },
  { saat: '21:00', satis: 260,  istek: 'Decaf, Tatlı' },
  { saat: '22:00', satis: 145,  istek: 'Türk Kahvesi, Tatlı' },
];

export const TOP_PRODUCTS = [
  { rank: 1,  name: 'Signature Latte',        category: 'Sıcak',  sales: 28400, revenue: 4970000, growth: 22.5 },
  { rank: 2,  name: 'Cold Brew',              category: 'Soğuk',  sales: 22100, revenue: 4641000, growth: 38.2 },
  { rank: 3,  name: 'Cappuccino',             category: 'Sıcak',  sales: 21500, revenue: 3655000, growth: 12.4 },
  { rank: 4,  name: 'Flat White',             category: 'Sıcak',  sales: 18900, revenue: 3402000, growth: 18.8 },
  { rank: 5,  name: 'Nitro Cold Brew',        category: 'Özel',   sales: 14200, revenue: 3550000, growth: 62.5 },
  { rank: 6,  name: 'Croissant',              category: 'Yiyecek',sales: 20100, revenue: 2613000, growth: 8.4  },
  { rank: 7,  name: 'Filtre Kahve',           category: 'Sıcak',  sales: 16400, revenue: 2296000, growth: 5.1  },
  { rank: 8,  name: 'Matcha Latte',           category: 'Soğuk',  sales: 12500, revenue: 2687500, growth: 88.4 },
  { rank: 9,  name: 'Caramel Macchiato',      category: 'Sıcak',  sales: 14100, revenue: 2820000, growth: 25.3 },
  { rank: 10, name: 'Spring Blossom Latte ★', category: 'Özel',   sales: 9800,  revenue: 2303000, growth: null },
];
