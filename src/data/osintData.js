// ═══════════════════════════════════════════════════════════════════════════════
// OSINT VERİLERİ
//
// WEB_MENTIONS → Artık statik değil. OsintReports.jsx scraper API'sinden çeker.
//   Kaynak: espressolab-scraper /api/news (Google News RSS + marka siteleri)
//
// SENTIMENT_SCORES → Google Maps ortalama puanından türetilmiştir.
//   Kaynak: competitorData.js → googleRating alanı
//   Formül: overall = round(42 + (rating - 3.8) * 51)  [3.8=min, 4.7=max]
//   positive ≈ overall * 0.78 | negative ≈ (100-overall) * 0.45
//
// ⚠️ Gerçek NLP sentiment analizi için scraper'a Twitter API v2 / haber NLP
//    entegrasyonu eklendiğinde bu değerler otomatik hesaplanacak.
// ═══════════════════════════════════════════════════════════════════════════════

// WEB_MENTIONS statik listesi kaldırıldı — OsintReports.jsx canlı API'den çeker
export const WEB_MENTIONS = [];

// ── Sentiment Skorları — Google Maps Rating'den Türetilmiş ──────────────────
// Baz veri: competitorData.js → googleRating
// espressolab:4.6 kronotrop:4.7 coffee1401:4.6 gua:4.4 luuq:4.5
// kahvedunyasi:4.3 laos:4.3 caribou:4.3 coffy:4.2 caffenero:4.2 coffeemania:4.2
// starbucks:4.1 arabica:4.1 brewmood:4.1 costacoffee:4.1 gloriajeans:4.0
// sencay:4.0 mikel:4.0 nevada:3.9 tchibo:3.8
export const SENTIMENT_SCORES = {
  espressolab:  { overall: 84, positive: 66, neutral: 26, negative: 8  },  // rating 4.6
  kronotrop:    { overall: 89, positive: 69, neutral: 22, negative: 9  },  // rating 4.7
  coffee1401:   { overall: 84, positive: 66, neutral: 26, negative: 8  },  // rating 4.6
  gua:          { overall: 73, positive: 57, neutral: 28, negative: 15 },  // rating 4.4
  luuq:         { overall: 79, positive: 62, neutral: 24, negative: 14 },  // rating 4.5
  kahvedunyasi: { overall: 68, positive: 53, neutral: 29, negative: 18 },  // rating 4.3
  laos:         { overall: 68, positive: 53, neutral: 29, negative: 18 },  // rating 4.3
  caribou:      { overall: 68, positive: 53, neutral: 29, negative: 18 },  // rating 4.3
  coffy:        { overall: 63, positive: 49, neutral: 30, negative: 21 },  // rating 4.2
  caffenero:    { overall: 63, positive: 49, neutral: 30, negative: 21 },  // rating 4.2
  coffeemania:  { overall: 63, positive: 49, neutral: 30, negative: 21 },  // rating 4.2
  starbucks:    { overall: 58, positive: 45, neutral: 32, negative: 23 },  // rating 4.1
  arabica:      { overall: 58, positive: 45, neutral: 32, negative: 23 },  // rating 4.1
  brewmood:     { overall: 58, positive: 45, neutral: 32, negative: 23 },  // rating 4.1
  costacoffee:  { overall: 58, positive: 45, neutral: 32, negative: 23 },  // rating 4.1
  gloriajeans:  { overall: 53, positive: 41, neutral: 34, negative: 25 },  // rating 4.0
  sencay:       { overall: 53, positive: 41, neutral: 34, negative: 25 },  // rating 4.0
  mikel:        { overall: 53, positive: 41, neutral: 34, negative: 25 },  // rating 4.0
  nevada:       { overall: 47, positive: 37, neutral: 33, negative: 30 },  // rating 3.9
  tchibo:       { overall: 42, positive: 33, neutral: 34, negative: 33 },  // rating 3.8
};

// ── Trend Kelimeler — Doğrulanmış Marka Karakteristikleri ───────────────────
// Kaynaklar: resmi web siteleri, basın bültenleri, haber arşivleri
export const TRENDING_KEYWORDS = {
  espressolab:  ['specialty-kahve', 'single-origin', 'roastery', 'cold-brew', 'sürdürülebilir', 'barista'],
  starbucks:    ['ube-vanilla', 'matcha', 'sezonluk-menü', 'fiyat-güncellemesi', 'rewards-app'],
  kahvedunyasi: ['türk-kahvesi', 'çikolata', 'algötür', 'şube-genişleme', 'anadolu'],
  gloriajeans:  ['franchise', 'orta-segment', 'brezilya-çekirdeği', 'co-lemonade'],
  sencay:       ['çay-kahve', 'uygun-fiyat', 'anadolu', 'hızlı-servis'],
  arabica:      ['specialty', 'marmara', 'franchise', 'genişleme'],
  coffy:        ['jubilant-foodworks', 'franchise', 'büyüme', 'transit-nokta'],
  gua:          ['hızlı-büyüme', 'z-kuşağı', 'konsept', 'şube'],
  luuq:         ['instagram', 'tasarım-odaklı', 'specialty', 'genç-kitle'],
  caffenero:    ['İtalyan-konsept', 'avm', 'transit', 'uluslararası'],
  laos:         ['franchise', 'karadeniz', 'anadolu', 'büyüme'],
  brewmood:     ['specialty', 'third-wave', 'z-kuşağı', 'single-origin'],
  coffeemania:  ['istanbul', 'specialty', 'butik'],
  mikel:        ['yunan-markası', 'franchise', 'büyüme', 'ekspansiyon'],
  tchibo:       ['türk-kahvesi', 'kapsül', 'perakende', 'hazır-kahve'],
  caribou:      ['cinnamon-sugar', 'amy-blend', 'bahar-menü', 'abd-markası'],
  nevada:       ['uygun-fiyat', 'büyüme', 'anadolu'],
  kronotrop:    ['specialty', 'barista-şampiyonası', 'single-origin', 'third-wave', 'roastery'],
  coffee1401:   ['butik', 'specialty', 'pastane', 'el-yapımı'],
  costacoffee:  ['sürdürülebilirlik', 'boyner', 'uluslararası', 'avm'],
};

export const MENTION_SOURCES = [
  { id: 'news',   label: 'Haber',        icon: '📰' },
  { id: 'social', label: 'Sosyal Medya', icon: '📱' },
  { id: 'blog',   label: 'Blog/Site',    icon: '✍️' },
  { id: 'review', label: 'Yorum',        icon: '⭐' },
  { id: 'report', label: 'Rapor',        icon: '📊' },
];
