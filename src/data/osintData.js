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
// Baz veri: competitorData.js → googleRating (Mayıs 2026 güncel değerler)
// Formül: overall = round(42 + (rating - 3.8) * 51)
// positive = round(overall * 0.78) | negative = round((100-overall) * 0.55) | neutral = 100-p-n
export const SENTIMENT_SCORES = {
  laos:         { overall: 81, positive: 63, neutral: 27, negative: 10 },  // rating 4.57
  espressolab:  { overall: 79, positive: 62, neutral: 26, negative: 12 },  // rating 4.53
  tchibo:       { overall: 69, positive: 54, neutral: 29, negative: 17 },  // rating 4.32
  coffy:        { overall: 68, positive: 53, neutral: 29, negative: 18 },  // rating 4.30
  sencay:       { overall: 66, positive: 52, neutral: 29, negative: 19 },  // rating 4.28
  gua:          { overall: 65, positive: 51, neutral: 30, negative: 19 },  // rating 4.26
  mikel:        { overall: 65, positive: 51, neutral: 30, negative: 19 },  // rating 4.25
  arabica:      { overall: 61, positive: 48, neutral: 31, negative: 21 },  // rating 4.17
  gloriajeans:  { overall: 59, positive: 46, neutral: 31, negative: 23 },  // rating 4.13
  luuq:         { overall: 58, positive: 45, neutral: 32, negative: 23 },  // rating 4.12
  brewmood:     { overall: 58, positive: 45, neutral: 32, negative: 23 },  // rating 4.11
  costacoffee:  { overall: 57, positive: 45, neutral: 31, negative: 24 },  // rating 4.10
  kronotrop:    { overall: 55, positive: 43, neutral: 32, negative: 25 },  // rating 4.05
  coffeemania:  { overall: 54, positive: 42, neutral: 33, negative: 25 },  // rating 4.04
  nevada:       { overall: 51, positive: 40, neutral: 33, negative: 27 },  // rating 3.97
  coffee1401:   { overall: 49, positive: 38, neutral: 34, negative: 28 },  // rating 3.94
  caribou:      { overall: 48, positive: 37, neutral: 34, negative: 29 },  // rating 3.92
  starbucks:    { overall: 40, positive: 31, neutral: 36, negative: 33 },  // rating 3.76
  caffenero:    { overall: 40, positive: 31, neutral: 36, negative: 33 },  // rating 3.76
  kahvedunyasi: { overall: 34, positive: 27, neutral: 37, negative: 36 },  // rating 3.64
};

// ── Trend Kelimeler — Doğrulanmış Marka Karakteristikleri ───────────────────
// Kaynaklar: resmi web siteleri, basın bültenleri, haber arşivleri
export const TRENDING_KEYWORDS = {
  gloriajeans:  ['franchise', 'orta-segment', 'brezilya-çekirdeği', 'co-lemonade'],
  espressolab:  ['specialty-kahve', 'single-origin', 'roastery', 'cold-brew', 'sürdürülebilir', 'barista'],
  starbucks:    ['ube-vanilla', 'matcha', 'sezonluk-menü', 'fiyat-güncellemesi', 'rewards-app'],
  kahvedunyasi: ['türk-kahvesi', 'çikolata', 'algötür', 'şube-genişleme', 'anadolu'],
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
