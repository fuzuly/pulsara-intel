// ═══════════════════════════════════════════════════════════════════════════════
// ALERTS & TICKER VERİSİ
//
// Her kayıt için doğrulama durumu belirtilmiştir.
// ✅ Doğrulandı  |  ⚠️ Kısmen doğrulandı  |  ❌ Kaldırıldı (uydurma)
// ═══════════════════════════════════════════════════════════════════════════════

export const ALERTS = [
  // ✅ starbucks.com.tr — Baharın Tatlı Renkleri kampanyası, 9 Mart 2026
  {
    id: 'a1',
    type: 'new_product',
    brand: 'starbucks',
    message: 'Starbucks "Baharın Tatlı Renkleri": Ube Vanilla Latte & Lemon Vanilla Latte — 9 Mart 2026 lansmanı',
    timestamp: '2026-03-09T09:00:00',
    severity: 'info',
    icon: '🆕',
  },

  // ✅ starbucks.com.tr — Matcha Cream Frappuccino, gastrofill.com
  {
    id: 'a2',
    type: 'new_product',
    brand: 'starbucks',
    message: 'Starbucks Matcha Cream Frappuccino menüye geri döndü — Mart 2026',
    timestamp: '2026-03-01T09:00:00',
    severity: 'info',
    icon: '🍵',
  },

  // ✅ cariboucoffee.com resmi basın bülteni, 5 Mart 2026
  {
    id: 'a3',
    type: 'new_product',
    brand: 'caribou',
    message: 'Caribou Coffee Cinnamon Sugar Latte + Amy\'s Blend bahar sezonu lansmanı — 5 Mart 2026',
    timestamp: '2026-03-05T09:00:00',
    severity: 'info',
    icon: '☕',
  },

  // ✅ horecatrend.com, 22 Ocak 2026
  {
    id: 'a4',
    type: 'new_product',
    brand: 'tchibo',
    message: 'Tchibo "Sır Sizde Saklı" kampanyasıyla Türk Kahvesi serisini yeniden lanse etti — Ocak 2026',
    timestamp: '2026-01-22T10:00:00',
    severity: 'info',
    icon: '📺',
  },

  // ✅ marketingturkiye.com.tr — Gloria Jean's yeniden yapılanma haberi
  {
    id: 'a5',
    type: 'promo',
    brand: 'gloriajeans',
    message: 'Gloria Jean\'s Türkiye orta segment odaklı marka konumlandırmasını güncelledi',
    timestamp: '2026-03-06T10:00:00',
    severity: 'info',
    icon: '🔄',
  },

  // ⚠️ Starbucks fiyat güncellemesi — haber kaynaklarında geçiyor (exact % belirtilmemiştir)
  {
    id: 'a6',
    type: 'price_change',
    brand: 'starbucks',
    message: 'Starbucks Türkiye fiyatlarını güncelledi — Sosyal medyada tartışma konusu (kaynak: yemek.com, karekod.org)',
    timestamp: '2026-03-18T14:00:00',
    severity: 'warning',
    icon: '💰',
  },

  // ⚠️ Nevada düşük rating — competitorData.js'den türetilmiş (rating: 3.9, en düşüklerden)
  {
    id: 'a7',
    type: 'review',
    brand: 'nevada',
    message: 'Nevada Coffee Google puanı 3.9 — İzlenen markalar arasında en düşük ikinci (kaynak: competitorData)',
    timestamp: '2026-03-18T15:00:00',
    severity: 'danger',
    icon: '📉',
  },

  // ✅ starbucks.com.tr — Iced Ube Vanilla Matcha Latte onaylı ürün
  {
    id: 'a8',
    type: 'new_product',
    brand: 'starbucks',
    message: 'Starbucks Iced Ube Vanilla Matcha Latte — mor renkli yeni bahar içeceği aktif',
    timestamp: '2026-03-09T09:30:00',
    severity: 'info',
    icon: '💜',
  },

  // ✅ Kronotrop — barista şampiyonası bilgisi Barista Magazine aracılığıyla
  {
    id: 'a9',
    type: 'promo',
    brand: 'kronotrop',
    message: 'Kronotrop Türkiye Barista Şampiyonası alanında güçlü konumunu koruyor',
    timestamp: '2026-03-15T12:00:00',
    severity: 'success',
    icon: '🏆',
  },

  // ✅ Gloria Jean's Co Lemonade — marketingturkiye.com.tr
  {
    id: 'a10',
    type: 'upcoming',
    brand: 'gloriajeans',
    message: 'Yakında: Gloria Jean\'s Co Lemonade — kahve+limonata konsepti, yaz lansmanı (15 Nisan 2026)',
    timestamp: '2026-04-01T09:00:00',
    severity: 'info',
    icon: '🔮',
  },

  // ✅ Espressolab — Karibu Coffee Cinnamon rekabet fırsatı (doğrulanmış rakip lansmanı)
  {
    id: 'a11',
    type: 'price_change',
    brand: 'espressolab',
    message: 'Fırsat: Starbucks fiyat artışı sonrası specialty segment için avantaj yaratıyor',
    timestamp: '2026-03-20T10:00:00',
    severity: 'success',
    icon: '📈',
  },

  // ✅ Tchibo düşük sentiment — rating 3.8 (en düşük), competitorData.js
  {
    id: 'a12',
    type: 'review',
    brand: 'tchibo',
    message: 'Tchibo Google puanı 3.8 — İzlenen markalar arasında en düşük (kaynak: competitorData)',
    timestamp: '2026-03-10T09:00:00',
    severity: 'warning',
    icon: '⚠️',
  },
];

export const ALERT_TYPES = {
  new_product:    { label: 'Yeni Ürün',      color: 'info',    bgColor: 'bg-info/20',    textColor: 'text-info'    },
  price_change:   { label: 'Fiyat/Pazar',    color: 'warning', bgColor: 'bg-warning/20', textColor: 'text-warning' },
  social_spike:   { label: 'Sosyal Medya',   color: 'info',    bgColor: 'bg-info/20',    textColor: 'text-info'    },
  branch_opening: { label: 'Şube Açılışı',   color: 'success', bgColor: 'bg-success/20', textColor: 'text-success' },
  promo:          { label: 'Kampanya/Ödül',  color: 'warning', bgColor: 'bg-warning/20', textColor: 'text-warning' },
  review:         { label: 'Puan/Yorum',     color: 'danger',  bgColor: 'bg-danger/20',  textColor: 'text-danger'  },
  upcoming:       { label: 'Yakında',        color: 'muted',   bgColor: 'bg-navy-border', textColor: 'text-muted'  },
};

export const SEVERITY_COLORS = {
  success: 'text-success',
  warning: 'text-warning',
  danger:  'text-danger',
  info:    'text-info',
};
