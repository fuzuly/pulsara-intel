import * as XLSX from 'xlsx';
import { BRANDS, BRAND_MAP } from '../constants/brands';
import { COMPETITOR_SCORES } from '../data/competitorData';
import { MENU_ITEMS } from '../data/menuData';
import { MONTHLY_SALES, TOP_PRODUCTS } from '../data/salesData';
import { SOCIAL_MEDIA } from '../data/socialMediaData';
import { WEB_MENTIONS, SENTIMENT_SCORES } from '../data/osintData';

const HEADER_STYLE = {
  font: { bold: true, color: { rgb: 'FFFFFF' }, sz: 11 },
  fill: { fgColor: { rgb: '2C1810' } },
  alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
  border: {
    top: { style: 'thin', color: { rgb: 'C4922A' } },
    bottom: { style: 'thin', color: { rgb: 'C4922A' } },
    left: { style: 'thin', color: { rgb: 'C4922A' } },
    right: { style: 'thin', color: { rgb: 'C4922A' } },
  },
};

function makeHeaderRow(headers) {
  return headers.map(h => ({ v: h, t: 's', s: HEADER_STYLE }));
}

function setColWidths(ws, widths) {
  ws['!cols'] = widths.map(w => ({ wch: w }));
}

function addSheet(wb, name, data, headers, colWidths) {
  const rows = [headers, ...data];
  const ws = XLSX.utils.aoa_to_sheet(rows);
  setColWidths(ws, colWidths);
  ws['!autofilter'] = { ref: ws['!ref'] };
  XLSX.utils.book_append_sheet(wb, ws, name);
}

export async function exportToExcel(config = {}) {
  const wb = XLSX.utils.book_new();
  wb.Props = {
    Title: 'Rekabet Analizi Raporu',
    Subject: 'Rekabet İstihbaratı Dashboard',
    Author: 'Rekabet Analizi Dashboard',
    CreatedDate: new Date(),
  };

  // Sheet 1: Genel Bakış (KPI Summary)
  const esl = COMPETITOR_SCORES.espressolab;
  const kpiHeaders = ['Metrik', 'Değer', 'Kaynak', 'Dönem'];
  const kpiData = [
    ['Türkiye Şube Sayısı', esl.branches, 'Gıda Bülteni 2025', 'Mart 2026'],
    ['Global Şube Sayısı', esl.branchesGlobal ?? '-', 'Perfect Daily Grind Mar 2026', 'Mart 2026'],
    ['Google Puan', esl.googleRating, 'Google Maps (doğrulandı)', 'Mart 2026'],
    ['NPS Skoru', esl.nps, 'Hesaplanan (rating × formül)', 'Mart 2026'],
    ['Market Payı', `%${esl.marketShare}`, 'Tahmini — şube × fiyat proxy', 'Mart 2026'],
    ['Genel Rakip Skoru', esl.overallScore, 'Otomatik formül (8 alt-skor)', 'Mart 2026'],
    ['Aylık Ciro', 'POS bağlantısı bekleniyor', 'ERP entegrasyonu gerekli', '-'],
    ['Günlük Sipariş', 'POS bağlantısı bekleniyor', 'ERP entegrasyonu gerekli', '-'],
    ['Ortalama Sepet', 'POS bağlantısı bekleniyor', 'ERP entegrasyonu gerekli', '-'],
  ];
  addSheet(wb, 'Genel Bakış', kpiData, kpiHeaders, [30, 25, 35, 15]);

  // Sheet 2: Rakip Analizi
  const compHeaders = [
    'Marka', 'Market Payı (%)', 'Şube Sayısı', 'Ort. Fiyat (₺)',
    'Google Puanı', 'NPS', 'Sosyal Medya Skoru', 'Yenilik Skoru',
    'Kalite Skoru', 'Genel Skor', 'Büyüme (%)', 'Yıllık Ciro'
  ];
  const compData = BRANDS.map(b => {
    const s = COMPETITOR_SCORES[b.id];
    return [
      b.name, s.marketShare, s.branches, s.avgPrice,
      s.googleRating, s.nps, s.socialScore, s.innovationScore,
      s.qualityScore, s.overallScore, s.growth, s.annualRevenue
    ];
  });
  addSheet(wb, 'Rakip Analizi', compData, compHeaders, [20, 16, 14, 16, 15, 10, 20, 16, 14, 14, 14, 16]);

  // Sheet 3: Menü Karşılaştırması
  const brandIds = BRANDS.map(b => b.id);
  const brandNames = BRANDS.map(b => b.name);
  const menuHeaders = ['Ürün Adı', 'Kategori', ...brandNames];
  const menuData = MENU_ITEMS.map(item => [
    item.name,
    item.category,
    ...brandIds.map(id => item.prices[id] !== null && item.prices[id] !== undefined
      ? `₺${item.prices[id]}`
      : '-'
    )
  ]);
  addSheet(wb, 'Menü Karşılaştırması', menuData, menuHeaders,
    [25, 18, ...brandIds.map(() => 14)]
  );

  // Sheet 4: Satış Analizi (Aylık)
  const salesHeaders = ['Ay', 'Espressolab (₺)', 'Starbucks (₺)', 'Kahve Dünyası (₺)', 'Kronotrop (₺)'];
  const salesData = MONTHLY_SALES.map(row => [
    row.month,
    row.espressolab?.toLocaleString('tr-TR') || '-',
    row.starbucks?.toLocaleString('tr-TR') || '-',
    row.kahvedunyasi?.toLocaleString('tr-TR') || '-',
    row.kronotrop?.toLocaleString('tr-TR') || '-',
  ]);
  addSheet(wb, 'Satış Analizi', salesData, salesHeaders, [15, 20, 18, 20, 16]);

  // Sheet 5: En Çok Satan Ürünler
  const topProdHeaders = ['Sıra', 'Ürün', 'Kategori', 'Satış Adedi', 'Ciro (₺)', 'Büyüme (%)'];
  const topProdData = TOP_PRODUCTS.map(p => [
    p.rank, p.name, p.category,
    p.sales.toLocaleString('tr-TR'),
    p.revenue.toLocaleString('tr-TR'),
    `+%${p.growth}`
  ]);
  addSheet(wb, 'En Çok Satanlar', topProdData, topProdHeaders, [8, 28, 15, 14, 16, 14]);

  // Sheet 6: Sosyal Medya
  const socialHeaders = [
    'Marka', 'Instagram Takipçi', 'IG Etkileşim (%)', 'TikTok Takipçi',
    'TikTok Etkileşim (%)', 'Twitter Takipçi', 'Twitter Etkileşim (%)',
    'Facebook Takipçi', 'Aylık Büyüme (%)'
  ];
  const socialData = BRANDS.map(b => {
    const s = SOCIAL_MEDIA[b.id];
    if (!s) return [b.name, '-', '-', '-', '-', '-', '-', '-', '-'];
    return [
      b.name,
      s.instagram.followers.toLocaleString('tr-TR'),
      `%${s.instagram.engagement}`,
      s.tiktok.followers.toLocaleString('tr-TR'),
      `%${s.tiktok.engagement}`,
      s.twitter.followers.toLocaleString('tr-TR'),
      `%${s.twitter.engagement}`,
      s.facebook.followers.toLocaleString('tr-TR'),
      `%${s.instagram.growthMoM}`,
    ];
  });
  addSheet(wb, 'Sosyal Medya', socialData, socialHeaders,
    [20, 18, 18, 16, 18, 16, 18, 16, 16]
  );

  // Sheet 7: OSINT Raporları
  const osintHeaders = ['Marka', 'Kaynak', 'Başlık', 'Tarih', 'Duygu', 'Skor', 'Erişim', 'Özet'];
  const osintData = WEB_MENTIONS.length > 0
    ? WEB_MENTIONS.map(m => [
        BRAND_MAP[m.brand]?.name || m.brand,
        m.source,
        m.title,
        m.date,
        m.sentiment === 'positive' ? 'Pozitif' : m.sentiment === 'negative' ? 'Negatif' : 'Nötr',
        m.score,
        m.reach?.toLocaleString('tr-TR') ?? '-',
        m.summary,
      ])
    : [['—', 'Canlı scraper API', 'Web mentions canlı API üzerinden alınmaktadır', '-', '-', '-', '-', 'Scraper bağlıyken bu veri otomatik güncellenir']];
  addSheet(wb, 'OSINT Raporları', osintData, osintHeaders, [18, 20, 45, 12, 12, 8, 12, 60]);

  // Sheet 8: Duygu Analizi Özeti
  const sentimentHeaders = ['Marka', 'Genel Skor', 'Pozitif (%)', 'Nötr (%)', 'Negatif (%)', 'Durum'];
  const sentimentData = BRANDS.map(b => {
    const s = SENTIMENT_SCORES[b.id];
    if (!s) return [b.name, '-', '-', '-', '-', '-'];
    const status = s.overall >= 70 ? 'İyi' : s.overall >= 50 ? 'Orta' : 'Zayıf';
    return [b.name, s.overall, s.positive, s.neutral, s.negative, status];
  });
  addSheet(wb, 'Duygu Analizi', sentimentData, sentimentHeaders, [20, 14, 14, 12, 14, 12]);

  // Generate filename with date
  const date = new Date().toISOString().split('T')[0];
  const filename = `Rekabet_Raporu_${date}.xlsx`;

  XLSX.writeFile(wb, filename);
  return filename;
}
