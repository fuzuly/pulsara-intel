import pptxgen from 'pptxgenjs';
import { BRANDS } from '../constants/brands';
import { COMPETITOR_SCORES, MARKET_SHARE_DATA } from '../data/competitorData';
import { SENTIMENT_SCORES } from '../data/osintData';
import { NEW_PRODUCTS } from '../data/newProductData';
import { SOCIAL_MEDIA } from '../data/socialMediaData';
import igProfiles from '../data/instagramProfiles.json';
import igPostsData from '../data/instagramPosts.json';

const NOW = new Date();
const REPORT_DATE = NOW.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' });
const REPORT_DATE_FULL = NOW.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });

const BRAND_TO_USERNAME = {
  espressolab: 'espressolabtr',
  starbucks:   'starbucks_tr',
  kahvedunyasi:'kahvedunyasi',
  gloriajeans: 'gjcsturkey',
  caffenero:   'caffeneroturkiye',
  nevada:      'nevadacoffee.tr',
  luuq:        'luuqcoffee',
  mikel:       'mikelcoffee_tr',
  coffy:       'coffy_tr',
  gua:         'guacoffeecompany',
  laos:        'laos.coffee',
};

const getIGData = (brandId) => {
  const username = BRAND_TO_USERNAME[brandId];
  if (!username) return null;
  const profile = igProfiles.find(p => p.username === username);
  const posts   = igPostsData.find(p => p.username === username);
  if (!profile) return null;
  return {
    followers:      profile.followers,
    engagementRate: posts?.engagementRate ?? 0,
  };
};

const THEME = {
  bg: '0F1624',
  surface: '1A2235',
  caramel: 'C4922A',
  espresso: '2C1810',
  white: 'FFFFFF',
  muted: '8B9BB4',
  success: '22C55E',
  warning: 'F59E0B',
  danger: 'EF4444',
};

const addSlideBg = (slide) => {
  slide.addShape('rect', {
    x: 0, y: 0, w: '100%', h: '100%',
    fill: { color: THEME.bg },
    line: { color: THEME.bg },
  });
  // Caramel accent line at top
  slide.addShape('rect', {
    x: 0, y: 0, w: '100%', h: 0.08,
    fill: { color: THEME.caramel },
    line: { color: THEME.caramel },
  });
};

const addSlideHeader = (slide, title, subtitle = '') => {
  slide.addText(title, {
    x: 0.5, y: 0.15, w: 8.5, h: 0.55,
    fontSize: 24, bold: true, color: THEME.white, fontFace: 'Calibri',
  });
  if (subtitle) {
    slide.addText(subtitle, {
      x: 0.5, y: 0.65, w: 8.5, h: 0.3,
      fontSize: 12, color: THEME.muted, fontFace: 'Calibri',
    });
  }
  // Separator line
  slide.addShape('line', {
    x: 0.5, y: 0.95, w: 9, h: 0,
    line: { color: THEME.caramel, width: 1 },
  });
};

const addFooter = (slide, pageNum) => {
  slide.addText(`Rekabet İstihbaratı Raporu  |  ${REPORT_DATE}  |  Sayfa ${pageNum}`, {
    x: 0, y: 6.9, w: '100%', h: 0.3,
    fontSize: 8, color: THEME.muted, align: 'center', fontFace: 'Calibri',
  });
};

export async function exportToPPTX(config = {}) {
  const pptx = new pptxgen();

  pptx.layout = 'LAYOUT_WIDE'; // 13.3" x 7.5"
  pptx.title = 'Rekabet Analizi';
  pptx.subject = 'Rekabet İstihbaratı Dashboard';
  pptx.author = 'Rekabet Analizi Dashboard';

  // ── Slide 1: Cover ──────────────────────────────────────────────
  const slide1 = pptx.addSlide();
  addSlideBg(slide1);

  // Background decorative shapes
  slide1.addShape('rect', {
    x: 8.5, y: 0, w: 5, h: 7.5,
    fill: { color: '1A2235' },
    line: { color: '1A2235' },
  });

  slide1.addText('☕', {
    x: 9.5, y: 1.5, w: 3, h: 3,
    fontSize: 120, align: 'center',
  });

  slide1.addText('Rekabet Analizi', {
    x: 0.6, y: 1.5, w: 7.5, h: 0.8,
    fontSize: 36, bold: true, color: THEME.caramel, fontFace: 'Calibri',
  });

  slide1.addText('Rekabet İstihbaratı & Analitik Raporu', {
    x: 0.6, y: 2.4, w: 7.5, h: 0.5,
    fontSize: 20, color: THEME.white, fontFace: 'Calibri',
  });

  slide1.addText('Türkiye Kahve Sektörü — Kapsamlı Rakip Analizi', {
    x: 0.6, y: 3.0, w: 7.5, h: 0.4,
    fontSize: 14, color: THEME.muted, fontFace: 'Calibri',
  });

  slide1.addShape('rect', {
    x: 0.6, y: 3.6, w: 2, h: 0.05,
    fill: { color: THEME.caramel },
    line: { color: THEME.caramel },
  });

  slide1.addText(`Rapor Tarihi: ${REPORT_DATE_FULL}`, {
    x: 0.6, y: 3.8, w: 7.5, h: 0.3,
    fontSize: 11, color: THEME.muted, fontFace: 'Calibri',
  });

  slide1.addText('Gizli — Yalnızca İç Kullanım İçin', {
    x: 0.6, y: 4.2, w: 3, h: 0.3,
    fontSize: 9, color: THEME.danger, fontFace: 'Calibri',
  });

  // ── Slide 2: KPI Overview ──────────────────────────────────────
  const slide2 = pptx.addSlide();
  addSlideBg(slide2);
  addSlideHeader(slide2, 'Temel Performans Göstergeleri', REPORT_DATE);

  const eslScore = COMPETITOR_SCORES.espressolab;
  const eslSocial = SOCIAL_MEDIA.espressolab;
  const kpis = [
    { label: 'Türkiye Şube Sayısı', value: String(eslScore.branches), change: 'Gıda Bülteni 2025', color: THEME.caramel },
    { label: 'Global Şube Sayısı', value: String(eslScore.branchesGlobal ?? '-'), change: 'Perfect Daily Grind 2026', color: THEME.success },
    { label: 'Google Puan', value: String(eslScore.googleRating), change: 'Google Maps doğrulandı', color: THEME.success },
    { label: 'NPS Skoru', value: String(eslScore.nps), change: 'Rating formülünden hesaplandı', color: THEME.success },
    { label: 'Market Payı', value: `%${eslScore.marketShare}`, change: 'Tahmini proxy hesap', color: THEME.warning },
    { label: 'Instagram Takipçi', value: eslSocial ? (eslSocial.instagram.followers / 1000).toFixed(0) + 'K' : '-', change: 'BoomSocial Mar 2026', color: '3B82F6' },
  ];

  kpis.forEach((kpi, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = 0.3 + col * 3.2;
    const y = 1.1 + row * 2.4;

    slide2.addShape('rect', {
      x, y, w: 3.0, h: 2.1,
      fill: { color: '1A2235' },
      line: { color: '2A3A55', width: 1 },
    });
    slide2.addShape('rect', {
      x, y, w: 0.08, h: 2.1,
      fill: { color: kpi.color },
      line: { color: kpi.color },
    });
    slide2.addText(kpi.label, {
      x: x + 0.2, y: y + 0.2, w: 2.6, h: 0.3,
      fontSize: 10, color: THEME.muted, fontFace: 'Calibri',
    });
    slide2.addText(kpi.value, {
      x: x + 0.2, y: y + 0.55, w: 2.6, h: 0.8,
      fontSize: 26, bold: true, color: THEME.white, fontFace: 'Calibri',
    });
    slide2.addText(kpi.change, {
      x: x + 0.2, y: y + 1.5, w: 2.6, h: 0.3,
      fontSize: 12, bold: true, color: kpi.color, fontFace: 'Calibri',
    });
  });

  addFooter(slide2, 2);

  // ── Slide 3: Market Share ──────────────────────────────────────
  const slide3 = pptx.addSlide();
  addSlideBg(slide3);
  addSlideHeader(slide3, 'Pazar Payı Dağılımı', 'Türkiye Specialty Coffee Market 2026');

  const topBrands = MARKET_SHARE_DATA.slice(0, 6);
  const tableRows = [
    [
      { text: 'Marka', options: { bold: true, color: THEME.caramel } },
      { text: 'Pazar Payı', options: { bold: true, color: THEME.caramel } },
      { text: 'Şube', options: { bold: true, color: THEME.caramel } },
      { text: 'Ort. Fiyat', options: { bold: true, color: THEME.caramel } },
      { text: 'Skor', options: { bold: true, color: THEME.caramel } },
    ],
    ...BRANDS.slice(0, 8).map(b => {
      const s = COMPETITOR_SCORES[b.id];
      return [
        { text: b.name, options: { color: b.isOwn ? THEME.caramel : THEME.white, bold: b.isOwn } },
        { text: `%${s.marketShare}`, options: { color: THEME.white } },
        { text: String(s.branches), options: { color: THEME.white } },
        { text: `₺${s.avgPrice}`, options: { color: THEME.white } },
        { text: String(s.overallScore), options: { color: s.overallScore >= 75 ? THEME.success : THEME.warning } },
      ];
    }),
  ];

  slide3.addTable(tableRows, {
    x: 0.4, y: 1.1, w: 9.2, h: 5.4,
    fontSize: 11,
    fontFace: 'Calibri',
    fill: { color: '1A2235' },
    border: { type: 'solid', color: '2A3A55', pt: 1 },
    rowH: 0.55,
    colW: [2.5, 1.4, 1.2, 1.5, 1.2],
  });

  addFooter(slide3, 3);

  // ── Slide 4: Competitor Scores ─────────────────────────────────
  const slide4 = pptx.addSlide();
  addSlideBg(slide4);
  addSlideHeader(slide4, 'Rakip Skor Karşılaştırması', 'Çok Boyutlu Analiz — Top 5');

  const metrics = [
    { key: 'qualityScore', label: 'Kalite' },
    { key: 'socialScore', label: 'Sosyal Medya' },
    { key: 'innovationScore', label: 'Yenilik' },
    { key: 'customerLoyalty', label: 'Müşteri Sadakati' },
    { key: 'digitalPresence', label: 'Dijital Varlık' },
  ];

  const targetBrands = ['espressolab', 'starbucks', 'kahvedunyasi', 'kronotrop', 'mikel'];
  const scoreTableRows = [
    [
      { text: 'Metrik', options: { bold: true, color: THEME.caramel } },
      ...targetBrands.map(id => ({
        text: BRANDS.find(b => b.id === id)?.name || id,
        options: { bold: true, color: id === 'espressolab' ? THEME.caramel : THEME.white }
      })),
    ],
    ...metrics.map(m => [
      { text: m.label, options: { color: THEME.muted } },
      ...targetBrands.map(id => {
        const score = COMPETITOR_SCORES[id]?.[m.key] || 0;
        const color = score >= 80 ? THEME.success : score >= 60 ? THEME.warning : THEME.danger;
        return { text: String(score), options: { bold: true, color } };
      }),
    ]),
    [
      { text: 'GENEL SKOR', options: { bold: true, color: THEME.caramel } },
      ...targetBrands.map(id => {
        const score = COMPETITOR_SCORES[id]?.overallScore || 0;
        const color = score >= 80 ? THEME.success : score >= 60 ? THEME.warning : THEME.danger;
        return { text: String(score), options: { bold: true, fontSize: 14, color } };
      }),
    ],
  ];

  slide4.addTable(scoreTableRows, {
    x: 0.4, y: 1.1, w: 9.2, h: 5.4,
    fontSize: 11, fontFace: 'Calibri',
    fill: { color: '1A2235' },
    border: { type: 'solid', color: '2A3A55', pt: 1 },
    rowH: 0.75,
  });

  addFooter(slide4, 4);

  // ── Slide 5: Social Media ──────────────────────────────────────
  const slide5 = pptx.addSlide();
  addSlideBg(slide5);
  addSlideHeader(slide5, 'Sosyal Medya Performansı', `Platform Bazlı Karşılaştırma — ${REPORT_DATE}`);

  const socialBrands = ['espressolab', 'starbucks', 'kahvedunyasi', 'mikel', 'kronotrop'];
  const socialTableRows = [
    [
      { text: 'Marka', options: { bold: true, color: THEME.caramel } },
      { text: 'Instagram', options: { bold: true, color: THEME.caramel } },
      { text: 'IG Etkileşim', options: { bold: true, color: THEME.caramel } },
      { text: 'TikTok', options: { bold: true, color: THEME.caramel } },
      { text: 'TT Etkileşim', options: { bold: true, color: THEME.caramel } },
    ],
    ...socialBrands.map(id => {
      const brand = BRANDS.find(b => b.id === id);
      const realIG = getIGData(id);
      const sm = SOCIAL_MEDIA[id];
      const igF = realIG
        ? (realIG.followers / 1000).toFixed(0) + 'K'
        : sm ? (sm.instagram.followers / 1000).toFixed(0) + 'K' : '-';
      const igE = realIG
        ? (realIG.engagementRate ? `%${realIG.engagementRate}` : '-')
        : sm ? `%${sm.instagram.engagement}` : '-';
      const ttF = sm ? (sm.tiktok.followers / 1000).toFixed(0) + 'K' : '-';
      const ttE = sm ? `%${sm.tiktok.engagement}` : '-';
      return [
        { text: brand?.name || id, options: { color: id === 'espressolab' ? THEME.caramel : THEME.white, bold: id === 'espressolab' } },
        { text: igF, options: { color: THEME.white } },
        { text: igE, options: { color: THEME.success } },
        { text: ttF, options: { color: THEME.white } },
        { text: ttE, options: { color: THEME.success } },
      ];
    }),
  ];

  slide5.addTable(socialTableRows, {
    x: 0.4, y: 1.1, w: 9.2, h: 5.4,
    fontSize: 11, fontFace: 'Calibri',
    fill: { color: '1A2235' },
    border: { type: 'solid', color: '2A3A55', pt: 1 },
    rowH: 0.8,
  });

  addFooter(slide5, 5);

  // ── Slide 6: New Products ──────────────────────────────────────
  const slide6 = pptx.addSlide();
  addSlideBg(slide6);
  addSlideHeader(slide6, 'Yeni Ürün Radar', 'Son 30 Gün + Yaklaşan Lansmanlar');

  const recentProducts = NEW_PRODUCTS.slice(0, 8);
  recentProducts.forEach((p, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 0.3 + col * 4.8;
    const y = 1.1 + row * 1.45;
    const brand = BRANDS.find(b => b.id === p.brand);

    slide6.addShape('rect', {
      x, y, w: 4.5, h: 1.3,
      fill: { color: p.isUpcoming ? '1A2235' : '1A2235' },
      line: { color: p.isOwn ? THEME.caramel : p.isUpcoming ? THEME.warning : '2A3A55', width: p.isOwn ? 2 : 1 },
    });

    slide6.addText(`${p.status === 'upcoming' ? '🔮 YAKINDA' : '🆕 YENİ'} | ${brand?.name || p.brand} | ${p.category}`, {
      x: x + 0.15, y: y + 0.05, w: 4.2, h: 0.25,
      fontSize: 8, color: p.isOwn ? THEME.caramel : THEME.muted, fontFace: 'Calibri',
    });
    slide6.addText(p.name, {
      x: x + 0.15, y: y + 0.3, w: 3.5, h: 0.35,
      fontSize: 13, bold: true, color: THEME.white, fontFace: 'Calibri',
    });
    slide6.addText(p.price ? `₺${p.price}` : '', {
      x: x + 3.7, y: y + 0.3, w: 0.7, h: 0.35,
      fontSize: 13, bold: true, color: THEME.caramel, fontFace: 'Calibri', align: 'right',
    });
    slide6.addText(p.description.substring(0, 80) + (p.description.length > 80 ? '...' : ''), {
      x: x + 0.15, y: y + 0.65, w: 4.2, h: 0.4,
      fontSize: 9, color: THEME.muted, fontFace: 'Calibri',
    });
    slide6.addText(p.launchDate, {
      x: x + 0.15, y: y + 1.05, w: 4.2, h: 0.2,
      fontSize: 8, color: THEME.muted, fontFace: 'Calibri', italic: true,
    });
  });

  addFooter(slide6, 6);

  // ── Slide 7: OSINT Highlights ──────────────────────────────────
  const slide7 = pptx.addSlide();
  addSlideBg(slide7);
  addSlideHeader(slide7, 'OSINT Öne Çıkanlar & Duygu Analizi', 'Açık Kaynak İstihbaratı Özeti');

  const sentBrands = ['espressolab', 'starbucks', 'kahvedunyasi', 'mikel', 'kronotrop', 'nevada'];
  sentBrands.forEach((id, i) => {
    const s = SENTIMENT_SCORES[id];
    const brand = BRANDS.find(b => b.id === id);
    const x = 0.3 + (i % 3) * 3.2;
    const y = 1.1 + Math.floor(i / 3) * 1.8;
    const color = s.overall >= 70 ? THEME.success : s.overall >= 50 ? THEME.warning : THEME.danger;

    slide7.addShape('rect', {
      x, y, w: 3.0, h: 1.5,
      fill: { color: '1A2235' },
      line: { color: '2A3A55', width: 1 },
    });
    slide7.addText(brand?.name || id, {
      x: x + 0.15, y: y + 0.1, w: 2.7, h: 0.3,
      fontSize: 11, bold: true, color: id === 'espressolab' ? THEME.caramel : THEME.white, fontFace: 'Calibri',
    });
    slide7.addText(`Genel Skor: ${s.overall}/100`, {
      x: x + 0.15, y: y + 0.4, w: 2.7, h: 0.3,
      fontSize: 16, bold: true, color, fontFace: 'Calibri',
    });
    slide7.addText(`✅ %${s.positive}  ⚪ %${s.neutral}  ❌ %${s.negative}`, {
      x: x + 0.15, y: y + 0.75, w: 2.7, h: 0.25,
      fontSize: 10, color: THEME.muted, fontFace: 'Calibri',
    });
    slide7.addText(s.overall >= 70 ? 'POZİTİF' : s.overall >= 50 ? 'NÖTR' : 'NEGATİF', {
      x: x + 0.15, y: y + 1.1, w: 2.7, h: 0.25,
      fontSize: 10, bold: true, color, fontFace: 'Calibri',
    });
  });

  addFooter(slide7, 7);

  // ── Slide 8: Closing ───────────────────────────────────────────
  const slide8 = pptx.addSlide();
  addSlideBg(slide8);

  slide8.addShape('rect', {
    x: 0, y: 2.5, w: '100%', h: 2.5,
    fill: { color: '1A2235' },
    line: { color: '1A2235' },
  });

  slide8.addText('Rekabet Analizi', {
    x: 0.5, y: 0.8, w: 12, h: 0.8,
    fontSize: 42, bold: true, color: THEME.caramel, align: 'center', fontFace: 'Calibri',
  });
  slide8.addText('Rekabet İstihbaratı Dashboard', {
    x: 0.5, y: 1.6, w: 12, h: 0.5,
    fontSize: 18, color: THEME.white, align: 'center', fontFace: 'Calibri',
  });
  slide8.addText('Bu rapor Rekabet Analizi Dashboard sisteminden otomatik olarak oluşturulmuştur.\nVeriler piyasa araştırması ve OSINT metodolojisi ile derlenmektedir.', {
    x: 1, y: 2.8, w: 11, h: 1.0,
    fontSize: 12, color: THEME.muted, align: 'center', fontFace: 'Calibri',
  });
  slide8.addText('Rekabet Analizi Dashboard  |  Analitik & Strateji', {
    x: 0.5, y: 4.2, w: 12, h: 0.4,
    fontSize: 12, color: THEME.caramel, align: 'center', fontFace: 'Calibri',
  });
  slide8.addText('GİZLİ — Yalnızca Yetkili Kullanıcılar İçin', {
    x: 2, y: 4.8, w: 9.3, h: 0.3,
    fontSize: 10, color: THEME.danger, align: 'center', fontFace: 'Calibri',
  });

  const date = new Date().toISOString().split('T')[0];
  const filename = `Rekabet_Sunumu_${date}.pptx`;
  await pptx.writeFile({ fileName: filename });
  return filename;
}
