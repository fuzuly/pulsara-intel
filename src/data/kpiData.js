// ═══════════════════════════════════════════════════════════════════════════════
// KPI VERİLERİ — MART 2026
// Espressolab 280 TR şube, güncel TRY fiyatlandırması baz alınarak
// ═══════════════════════════════════════════════════════════════════════════════

export const KPI_DATA = {
  aylikCiro: {
    label: 'Aylık Ciro',
    value: 18200000,
    change: 12.3,
    unit: '₺',
    format: 'currency',
    sparkline: [10500000, 12000000, 13200000, 15500000, 14800000, 16200000, 18200000],
    color: 'caramel',
    icon: 'DollarSign',
  },
  gunlukSiparis: {
    label: 'Günlük Sipariş',
    value: 23200,
    change: 9.4,
    unit: '',
    format: 'number',
    sparkline: [16500, 18200, 19800, 21000, 21800, 22400, 23200],
    color: 'info',
    icon: 'ShoppingBag',
  },
  ortSepet: {
    label: 'Ortalama Sepet',
    value: 784,
    change: 4.1,
    unit: '₺',
    format: 'currency',
    sparkline: [620, 665, 698, 724, 745, 765, 784],
    color: 'success',
    icon: 'Receipt',
  },
  musterimemnuniyeti: {
    label: 'Müşteri Memnuniyeti',
    value: 72,
    change: 4,
    unit: 'NPS',
    format: 'nps',
    sparkline: [60, 62, 65, 67, 68, 70, 72],
    color: 'success',
    icon: 'Star',
  },
  aktifSube: {
    label: 'Aktif Şube (TR)',
    value: 280,
    change: 17.9,
    unit: '',
    format: 'number',
    sparkline: [185, 205, 222, 240, 255, 268, 280],
    color: 'warning',
    icon: 'MapPin',
  },
  sosyalErisim: {
    label: 'Sosyal Medya Erişimi',
    value: 2100000,
    change: 15.3,
    unit: '',
    format: 'large',
    sparkline: [1200000, 1400000, 1600000, 1750000, 1850000, 1950000, 2100000],
    color: 'info',
    icon: 'Users',
  },
};

export const KPI_ARRAY = Object.entries(KPI_DATA).map(([key, val]) => ({ key, ...val }));
