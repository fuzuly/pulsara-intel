/**
 * generate_docs.cjs
 * Sistem dokümantasyonunu PPTX ve DOCX olarak üretir.
 * Çalıştırma: node scripts/generate_docs.cjs
 */

const pptxgen = require('pptxgenjs');
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
  Table, TableRow, TableCell, WidthType, BorderStyle,
  AlignmentType, ShadingType, NumberFormat,
} = require('docx');
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', 'docs_export');
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT);

const DATE = new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });

// ─── RENK TEması ──────────────────────────────────────────────────────────────
const C = {
  bg:      '0F1624',
  surface: '1A2235',
  caramel: 'C4922A',
  white:   'FFFFFF',
  muted:   '8B9BB4',
  success: '22C55E',
  danger:  'EF4444',
  info:    '3B82F6',
};

// ══════════════════════════════════════════════════════════════════════════════
// POWERPOINT
// ══════════════════════════════════════════════════════════════════════════════
async function generatePPTX() {
  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_WIDE';
  pptx.title  = 'Rekabet Analizi — Sistem Dokümantasyonu';

  const bg = (s) => s.addShape('rect', { x:0, y:0, w:'100%', h:'100%', fill:{color:C.bg}, line:{color:C.bg} });
  const accent = (s) => s.addShape('rect', { x:0, y:0, w:'100%', h:0.08, fill:{color:C.caramel}, line:{color:C.caramel} });
  const footer = (s, n) => s.addText(`Rekabet Analizi — Sistem Dokümantasyonu  |  ${DATE}  |  ${n}`, {
    x:0, y:6.9, w:'100%', h:0.3, fontSize:8, color:C.muted, align:'center', fontFace:'Calibri',
  });
  const header = (s, t, sub='') => {
    s.addText(t,   { x:0.5, y:0.15, w:12, h:0.55, fontSize:24, bold:true,  color:C.white, fontFace:'Calibri' });
    if(sub) s.addText(sub, { x:0.5, y:0.65, w:12, h:0.3,  fontSize:12, color:C.muted, fontFace:'Calibri' });
    s.addShape('line', { x:0.5, y:0.95, w:12.3, h:0, line:{color:C.caramel, width:1} });
  };

  // ── Slayt 1: Kapak ─────────────────────────────────────────────────────────
  const s1 = pptx.addSlide();
  bg(s1); accent(s1);
  s1.addShape('rect', { x:9, y:0, w:4.3, h:7.5, fill:{color:C.surface}, line:{color:C.surface} });
  s1.addText('☕', { x:9.5, y:1.5, w:3, h:3, fontSize:120, align:'center' });
  s1.addText('REKABET ANALİZİ', { x:0.6, y:1.4, w:8, h:0.8, fontSize:38, bold:true, color:C.caramel, fontFace:'Calibri' });
  s1.addText('İstihbarat Platformu — Sistem Dokümantasyonu', { x:0.6, y:2.35, w:8, h:0.5, fontSize:18, color:C.white, fontFace:'Calibri' });
  s1.addText('intel.pulsaraai.com · Türkiye Kahve Sektörü · 20 Marka', { x:0.6, y:2.9, w:8, h:0.4, fontSize:13, color:C.muted, fontFace:'Calibri' });
  s1.addShape('rect', { x:0.6, y:3.5, w:2.2, h:0.05, fill:{color:C.caramel}, line:{color:C.caramel} });
  s1.addText(`Hazırlama Tarihi: ${DATE}`, { x:0.6, y:3.7, w:8, h:0.3, fontSize:11, color:C.muted, fontFace:'Calibri' });
  s1.addText('Gizli — Yalnızca İç Kullanım İçin', { x:0.6, y:4.1, w:4, h:0.3, fontSize:9, color:C.danger, fontFace:'Calibri' });

  // ── Slayt 2: Platform Özeti ─────────────────────────────────────────────────
  const s2 = pptx.addSlide();
  bg(s2); accent(s2);
  header(s2, 'Platform Genel Bilgileri', 'Teknik altyapı ve erişim bilgileri');

  const infos = [
    { label:'Platform URL',     value:'intel.pulsaraai.com' },
    { label:'Teknoloji',        value:'React 18 + Vite + TailwindCSS + Recharts' },
    { label:'Deployment',       value:'Render (Static Site) — GitHub otomatik deploy' },
    { label:'Scraper API',      value:'Railway — espressolab-scraper-production.up.railway.app' },
    { label:'Veritabanı',       value:'MongoDB (Rakip + Haber verileri)' },
    { label:'Versiyon',         value:'v1.0.0 — Haziran 2026' },
  ];
  infos.forEach((inf, i) => {
    const x = i % 2 === 0 ? 0.4 : 6.8;
    const y = 1.1 + Math.floor(i/2) * 1.7;
    s2.addShape('rect', { x, y, w:6.0, h:1.45, fill:{color:C.surface}, line:{color:'2A3A55',width:1} });
    s2.addShape('rect', { x, y, w:0.07, h:1.45, fill:{color:C.caramel}, line:{color:C.caramel} });
    s2.addText(inf.label, { x:x+0.2, y:y+0.15, w:5.6, h:0.3, fontSize:10, color:C.muted, fontFace:'Calibri' });
    s2.addText(inf.value, { x:x+0.2, y:y+0.5,  w:5.6, h:0.6, fontSize:13, bold:true, color:C.white, fontFace:'Calibri' });
  });
  footer(s2, '2');

  // ── Slayt 3: Menü Yapısı ────────────────────────────────────────────────────
  const s3 = pptx.addSlide();
  bg(s3); accent(s3);
  header(s3, 'Menü & Sayfa Yapısı', '12 ana navigasyon öğesi');

  const pages = [
    { icon:'🏠', name:'Ana Dashboard',           url:'/',                  desc:'KPI özeti, engagement trendi, Google puanları, son haberler' },
    { icon:'📊', name:'Rakip Analizi',            url:'/rakip-analizi',     desc:'20 marka, radar grafik, skor tablosu, Google puan modal' },
    { icon:'🍽️', name:'Menü Karşılaştırması',     url:'/menu-karsilastirmasi', desc:'Ürün fiyat matrisi, renk kodlaması, kategori filtresi' },
    { icon:'📈', name:'Satış Analizi',            url:'/satis-analizi',     desc:'Aylık/haftalık satışlar, top ürünler, şehir dağılımı' },
    { icon:'📱', name:'Sosyal Medya',             url:'/sosyal-medya',      desc:'Instagram, Google Maps itibar, duygu analizi, AI aksiyon' },
    { icon:'✨', name:'Yeni Ürün Radar',          url:'/yeni-urun-radar',   desc:'OSINT ürün lansmanları, 3 güven katmanı, yaklaşan ürünler' },
    { icon:'🛰️', name:'OSINT Raporları',          url:'/osint-raporlari',   desc:'Trend kelimeler, sentiment skorları, haber akışı' },
    { icon:'📰', name:'Haber Akışı (CANLI)',      url:'/son-dakika',        desc:'Railway API — gerçek zamanlı kahve sektörü haberleri' },
    { icon:'📍', name:'Şube Puan Analizi',        url:'/sube-puanlari',     desc:'1375+ şube, boşluk analizi, pivot tablo, scatter grafik' },
    { icon:'🏢', name:"Gloria Jean's (YENİ)",     url:'/gloria-jeans',      desc:'Derinlemesine marka raporu, canlı şube puanları, SWOT' },
    { icon:'🖥️', name:'Müşteri Deneyimi Paneli', url:'gloriajeans.pulsaraai.com', desc:'Dış link — Gloria Jean\'s müşteri deneyimi yönetimi' },
    { icon:'📥', name:'Raporlar & Export',        url:'/raporlar',          desc:'Excel (.xlsx) ve PowerPoint (.pptx) rapor indirme' },
  ];

  pages.forEach((p, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 0.3 + col * 6.7;
    const y = 1.1 + row * 0.88;
    s3.addShape('rect', { x, y, w:6.4, h:0.78, fill:{color:C.surface}, line:{color:'2A3A55',width:1} });
    s3.addText(`${p.icon}  ${p.name}`, { x:x+0.15, y:y+0.07, w:3.5, h:0.28, fontSize:10, bold:true, color:C.white, fontFace:'Calibri' });
    s3.addText(p.url,  { x:x+3.6,  y:y+0.07, w:2.6, h:0.28, fontSize:8,  color:C.caramel, fontFace:'Calibri', align:'right' });
    s3.addText(p.desc, { x:x+0.15, y:y+0.38, w:6.1, h:0.3,  fontSize:8,  color:C.muted, fontFace:'Calibri' });
  });
  footer(s3, '3');

  // ── Slayt 4: Veri Mimarisi ──────────────────────────────────────────────────
  const s4 = pptx.addSlide();
  bg(s4); accent(s4);
  header(s4, 'Veri Mimarisi', 'Statik dosyalar + Canlı Railway API');

  // Statik dosyalar
  s4.addText('📁 STATİK VERİ DOSYALARI', { x:0.4, y:1.1, w:6.2, h:0.35, fontSize:11, bold:true, color:C.caramel, fontFace:'Calibri' });
  const staticFiles = [
    'competitorData.js — 20 marka skor/şube/fiyat verileri',
    'menuData.js — Ürün fiyat matrisi',
    'newProductData.js — OSINT ürün lansmanları',
    'osintData.js — Sentiment + trend kelimeler',
    'instagramProfiles.json — 11 hesap profili (May 2026)',
    'instagramPosts.json — 11 hesap etkileşim (May 2026)',
    'googleMapsRatings.json — 7 marka puan/trend',
  ];
  staticFiles.forEach((f, i) => {
    s4.addText(`• ${f}`, { x:0.6, y:1.5+i*0.33, w:6.0, h:0.28, fontSize:9, color:C.white, fontFace:'Calibri' });
  });

  // Canlı API
  s4.addText('🔴 CANLI RAILWAY API', { x:7.0, y:1.1, w:5.7, h:0.35, fontSize:11, bold:true, color:C.success, fontFace:'Calibri' });
  const api = [
    'GET /api/branches → Şube Puan Analizi',
    'GET /api/news → Haber Akışı + Dashboard',
    'GET /api/competitors → Rakip fiyat verileri',
    '',
    'Cron Jobs (otomatik):',
    '• Her gece 02:00 — Tüm scraper\'lar',
    '• Her 6 saatte — Haber taraması',
    '• Her 6 saatte — Fiyat güncelleme',
  ];
  api.forEach((a, i) => {
    s4.addText(a, { x:7.0, y:1.5+i*0.33, w:5.6, h:0.28, fontSize:9, color: a.startsWith('•') ? C.success : a.startsWith('Cron') ? C.caramel : C.white, fontFace:'Calibri' });
  });

  // Deployment akışı
  s4.addShape('rect', { x:0.4, y:5.5, w:12.5, h:1.0, fill:{color:C.surface}, line:{color:'2A3A55',width:1} });
  s4.addText('GitHub (fuzuly/pulsara-intel)  →  Render (Static Site)  →  intel.pulsaraai.com  →  Railway API  →  MongoDB', {
    x:0.6, y:5.7, w:12.1, h:0.4, fontSize:11, bold:true, color:C.white, align:'center', fontFace:'Calibri',
  });
  footer(s4, '4');

  // ── Slayt 5: Şube Puan Analizi Detayı ──────────────────────────────────────
  const s5 = pptx.addSlide();
  bg(s5); accent(s5);
  header(s5, 'Şube Puan Analizi', '1375+ şube — Google Maps verisi — Canlı');

  const features5 = [
    { icon:'⚠️', title:'Düşük Performans Alarmı',   desc:'Puan < 3.5 VE yorum > 100 olan şubeler. Gerçek müşteri şikayeti riski.' },
    { icon:'🏆', title:'En İyi / En Kötü 10',        desc:'Ağırlıklı skor = Puan × log10(Yorum+1). Min 10 yorum şartı.' },
    { icon:'📊', title:'Puan Dağılımı (Tıklanabilir)',desc:'6 aralık bar grafik. Bara tıklayınca o aralıktaki şubeler filtrelenir.' },
    { icon:'🔍', title:'Boşluk Analizi',             desc:'Hangi şehirde hangi marka var/yok. Referans marka seçilebilir.' },
    { icon:'📍', title:'Şehir × Marka Pivot',        desc:'En yoğun 15 şehir. Ortalama puan + şube sayısı matrisi.' },
    { icon:'📋', title:'Şube Listesi',               desc:'50\'lik sayfalama. Tüm sütunlar sıralanabilir. Google Maps linki.' },
  ];
  features5.forEach((f, i) => {
    const col = i % 2;
    const row = Math.floor(i/2);
    const x = 0.3 + col * 6.7;
    const y = 1.1 + row * 1.6;
    s5.addShape('rect', { x, y, w:6.3, h:1.4, fill:{color:C.surface}, line:{color:'2A3A55',width:1} });
    s5.addText(`${f.icon}  ${f.title}`, { x:x+0.2, y:y+0.15, w:5.9, h:0.35, fontSize:12, bold:true, color:C.caramel, fontFace:'Calibri' });
    s5.addText(f.desc, { x:x+0.2, y:y+0.55, w:5.9, h:0.65, fontSize:10, color:C.muted, fontFace:'Calibri' });
  });
  footer(s5, '5');

  // ── Slayt 6: Gloria Jean's Detayı ──────────────────────────────────────────
  const s6 = pptx.addSlide();
  bg(s6); accent(s6);
  header(s6, "Gloria Jean's — Marka İstihbarat Sayfası", 'Derinlemesine analiz + Canlı şube verileri');

  const gj = [
    { title:'KPI Kartları (8 adet)',       desc:'Şube sayısı, pazar payı, fiyat, Google puanı, Instagram takipçi/etkileşim, NPS, çalışan' },
    { title:'Performans Radar',            desc:'8 boyut: Kalite, Bilinirlik, Sadakat, Sosyal, İnovasyon, Dijital, Menü, Sürdürülebilirlik' },
    { title:'Rakip Karşılaştırması',       desc:'Google puanı ve Instagram etkileşimi karşılaştırma barları' },
    { title:'Canlı Şube Puanları (YENİ)', desc:'Railway API: En iyi 5 / En kötü 5 GJ şubesi. Google Maps linkleri.' },
    { title:'Şehir Bazında GJ (YENİ)',    desc:'En fazla şubeli 12 şehir. Ortalama puan + şube sayısı.' },
    { title:'Instagram Analizi @gjcsturkey',desc:'10 metrik: Takipçi, etkileşim, doğrulama, hesap türü (29 Mayıs 2026)' },
    { title:'Duygu Analizi',              desc:'%62 olumlu / %23 nötr / %15 olumsuz. Şikayet ve övgü etiketleri.' },
    { title:'SWOT + 2026 Ürünler',        desc:'Güçlü/Zayıf/Fırsat/Tehdit analizi. Aktif ve yaklaşan ürünler.' },
  ];
  gj.forEach((g, i) => {
    const col = i % 2;
    const row = Math.floor(i/2);
    const x = 0.3 + col * 6.7;
    const y = 1.1 + row * 1.3;
    s6.addShape('rect', { x, y, w:6.3, h:1.15, fill:{color:C.surface}, line:{color:'2A3A55',width:1} });
    s6.addText(g.title, { x:x+0.2, y:y+0.1,  w:5.9, h:0.35, fontSize:11, bold:true, color:C.white, fontFace:'Calibri' });
    s6.addText(g.desc,  { x:x+0.2, y:y+0.5,  w:5.9, h:0.5,  fontSize:9,  color:C.muted, fontFace:'Calibri' });
  });
  footer(s6, '6');

  // ── Slayt 7: Export & Raporlar ──────────────────────────────────────────────
  const s7 = pptx.addSlide();
  bg(s7); accent(s7);
  header(s7, 'Raporlar & Export Sistemi', 'Excel + PowerPoint otomatik üretim');

  s7.addText('📊 EXCEL RAPORU (.xlsx)', { x:0.4, y:1.1, w:6.0, h:0.4, fontSize:13, bold:true, color:C.success, fontFace:'Calibri' });
  const excel = ['Genel KPI Özeti (1 sayfa)','Rakip Analizi — 20 marka (1 sayfa)','Menü Karşılaştırması (1 sayfa)','Satış Analizi (2 sayfa)','Sosyal Medya (1 sayfa)','OSINT Raporları (2 sayfa)'];
  excel.forEach((e,i) => s7.addText(`✓  ${e}`, { x:0.6, y:1.6+i*0.44, w:5.8, h:0.35, fontSize:10, color:C.white, fontFace:'Calibri' }));
  s7.addText('Otomatik filtreli tablo + Türkçe format + Hücre renk kodlaması', { x:0.4, y:4.4, w:6.0, h:0.35, fontSize:9, color:C.muted, fontFace:'Calibri', italic:true });

  s7.addText('🖥️ POWERPOINT SUNUMU (.pptx)', { x:7.0, y:1.1, w:6.0, h:0.4, fontSize:13, bold:true, color:C.info, fontFace:'Calibri' });
  const pptSlides = ['Slayt 1: Kapak — Tarih otomatik','Slayt 2: KPI Özeti (6 metrik)','Slayt 3: Pazar Payı Tablosu','Slayt 4: Rakip Skor Karşılaştırması','Slayt 5: Sosyal Medya Performansı','Slayt 6: Yeni Ürün Radar','Slayt 7: OSINT Duygu Analizi','Slayt 8: Kapanış'];
  pptSlides.forEach((p,i) => s7.addText(`✓  ${p}`, { x:7.0, y:1.6+i*0.44, w:5.8, h:0.35, fontSize:10, color:C.white, fontFace:'Calibri' }));
  footer(s7, '7');

  // ── Slayt 8: Kapanış ────────────────────────────────────────────────────────
  const s8 = pptx.addSlide();
  bg(s8); accent(s8);
  s8.addShape('rect', { x:0, y:2.5, w:'100%', h:2.5, fill:{color:C.surface}, line:{color:C.surface} });
  s8.addText('Rekabet Analizi', { x:0.5, y:0.8, w:12.3, h:0.9, fontSize:44, bold:true, color:C.caramel, align:'center', fontFace:'Calibri' });
  s8.addText('İstihbarat Platformu — Sistem Dokümantasyonu', { x:0.5, y:1.8, w:12.3, h:0.5, fontSize:18, color:C.white, align:'center', fontFace:'Calibri' });
  s8.addText(`intel.pulsaraai.com  ·  Türkiye Kahve Sektörü  ·  20 Marka  ·  ${DATE}`, { x:1, y:2.9, w:11, h:0.5, fontSize:12, color:C.muted, align:'center', fontFace:'Calibri' });
  s8.addText('GİZLİ — Yalnızca Yetkili Kullanıcılar İçin', { x:2, y:4.8, w:9.3, h:0.3, fontSize:10, color:C.danger, align:'center', fontFace:'Calibri' });

  const fname = path.join(OUT, `Rekabet_Analizi_Sistem_Dokumantasyonu_${new Date().toISOString().split('T')[0]}.pptx`);
  await pptx.writeFile({ fileName: fname });
  console.log('✅ PPTX oluşturuldu:', fname);
}

// ══════════════════════════════════════════════════════════════════════════════
// WORD DOCX
// ══════════════════════════════════════════════════════════════════════════════
async function generateDOCX() {
  const h1 = (text) => new Paragraph({
    text, heading: HeadingLevel.HEADING_1,
    spacing: { before: 400, after: 200 },
  });
  const h2 = (text) => new Paragraph({
    text, heading: HeadingLevel.HEADING_2,
    spacing: { before: 300, after: 150 },
  });
  const h3 = (text) => new Paragraph({
    text, heading: HeadingLevel.HEADING_3,
    spacing: { before: 200, after: 100 },
  });
  const p = (text, opts={}) => new Paragraph({
    children: [new TextRun({ text, size: 22, ...opts })],
    spacing: { after: 120 },
  });
  const bullet = (text) => new Paragraph({
    children: [new TextRun({ text: `• ${text}`, size: 22 })],
    spacing: { after: 80 },
    indent: { left: 360 },
  });
  const empty = () => new Paragraph({ text: '', spacing: { after: 100 } });

  const tableRow = (cells, isHeader=false) => new TableRow({
    children: cells.map(c => new TableCell({
      children: [new Paragraph({
        children: [new TextRun({ text: c, bold: isHeader, size: isHeader ? 20 : 18 })],
        spacing: { after: 60 },
      })],
      shading: isHeader ? { type: ShadingType.CLEAR, color: 'C4922A', fill: 'C4922A' } : undefined,
    })),
  });

  const makeTable = (headers, rows) => new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [tableRow(headers, true), ...rows.map(r => tableRow(r))],
  });

  const doc = new Document({
    title: 'Rekabet Analizi — Sistem Dokümantasyonu',
    description: 'Pulsara Intel platform dokümantasyonu',
    sections: [{
      properties: {},
      children: [

        // ── Kapak ──────────────────────────────────────────────────────────────
        new Paragraph({
          children: [new TextRun({ text: 'REKABET ANALİZİ', bold: true, size: 64, color: 'C4922A' })],
          alignment: AlignmentType.CENTER, spacing: { before: 1200, after: 200 },
        }),
        new Paragraph({
          children: [new TextRun({ text: 'İstihbarat Platformu — Sistem Dokümantasyonu', size: 36 })],
          alignment: AlignmentType.CENTER, spacing: { after: 200 },
        }),
        new Paragraph({
          children: [new TextRun({ text: `intel.pulsaraai.com  ·  Türkiye Kahve Sektörü  ·  20 Marka`, size: 24, color: '666666' })],
          alignment: AlignmentType.CENTER, spacing: { after: 200 },
        }),
        new Paragraph({
          children: [new TextRun({ text: `Hazırlama Tarihi: ${DATE}`, size: 22, italics: true, color: '666666' })],
          alignment: AlignmentType.CENTER, spacing: { after: 200 },
        }),
        new Paragraph({
          children: [new TextRun({ text: 'Gizli — Yalnızca İç Kullanım İçin', size: 20, color: 'EF4444', bold: true })],
          alignment: AlignmentType.CENTER, spacing: { after: 800 },
        }),

        // ── 1. Genel Bakış ─────────────────────────────────────────────────────
        h1('1. GENEL BAKIŞ'),
        makeTable(
          ['Özellik', 'Değer'],
          [
            ['Platform URL', 'intel.pulsaraai.com'],
            ['Versiyon', '1.0.0 — Haziran 2026'],
            ['Teknoloji', 'React 18 + Vite + TailwindCSS + Recharts'],
            ['Deployment', 'Render (Static Site) — GitHub otomatik deploy'],
            ['Scraper API', 'Railway — espressolab-scraper-production.up.railway.app'],
            ['Veritabanı', 'MongoDB (Rakip + Haber verileri)'],
            ['GitHub Repo', 'github.com/fuzuly/pulsara-intel'],
          ]
        ),
        empty(),
        p('Platform, Türkiye kahve sektöründeki 20 rakip markayı gerçek zamanlı ve statik verilerle izleyen, analiz eden ve raporlayan özel bir istihbarat dashboardudur.'),

        // ── 2. Giriş ─────────────────────────────────────────────────────────
        h1('2. GİRİŞ / KİMLİK DOĞRULAMA'),
        bullet('URL: /login | Dosya: src/pages/Login.jsx'),
        bullet('Kullanıcı adı + şifre ile giriş'),
        bullet('Kimlik doğrulama localStorage\'da saklanır'),
        bullet('Giriş yapılmadan tüm sayfalar /login\'e yönlendirir'),
        bullet('Kullanıcılar: src/config/users.js'),
        bullet('Oturum kapatma: Sol menü alt kısım → Çıkış Yap'),
        empty(),

        // ── 3. Ana Layout ─────────────────────────────────────────────────────
        h1('3. ANA LAYOUT'),
        makeTable(
          ['Bileşen', 'Açıklama'],
          [
            ['Sidebar (sol)', 'Navigasyon menüsü, daraltılabilir (64px / 240px)'],
            ['TopBar (üst)', 'Saat/tarih, bildirim zili, Rapor İndir, Yardım'],
            ['LiveTicker', 'En üstte akan canlı haber bandı (her 8 saniyede)'],
            ['İçerik Alanı', 'Her sayfanın kendine özgü içeriği'],
          ]
        ),
        empty(),

        // ── 4. Sayfalar ───────────────────────────────────────────────────────
        h1('4. SAYFALAR — DETAYLI AÇIKLAMA'),

        h2('4.1 Ana Dashboard (/)'),
        p('Tüm sistemin özet görünümü. Platforma giriş sayfası.'),
        bullet('KPI Kartları: İzlenen Marka (20), Yeni Ürün Lansmanı, En Yüksek Engagement, Risk Altındaki Şube'),
        bullet('Instagram Engagement Trendi: Eyl 2025 – May 2026 çizgi grafik (3 marka)'),
        bullet('Google Maps Puan Sıralaması: 20 marka bar grafik'),
        bullet('Son Haberler: Railway API\'den canlı çekilir (son 5 haber)'),
        bullet('Yeni Ürün Radar Özeti: Son 3 aktif lansman'),
        empty(),

        h2('4.2 Rakip Analizi (/rakip-analizi)'),
        p('20 markanın 8 boyutta kapsamlı karşılaştırması. Veri: competitorData.js + Railway API.'),
        bullet('Marka Seçici: Radar için maks. 5 marka'),
        bullet('Radar Grafik: 8 eksen (Kalite, Sosyal, Yenilik, Sadakat, Dijital, Menü, Sürdürülebilirlik, Bilinirlik)'),
        bullet('Genel Performans Bar Grafiği: Tüm 20 marka'),
        bullet('Detay Kartları: Şube, fiyat, Google puanı (modal açılır), NPS, progress barlar, CAGR'),
        bullet('Google Puan Modal: Yüksek/düşük faktörler + rekabet aksiyonu'),
        bullet('Tam Karşılaştırma Tablosu: Tüm sütunlar sıralanabilir'),
        empty(),

        h2('4.3 Menü Karşılaştırması (/menu-karsilastirmasi)'),
        bullet('Ürün fiyat matrisi (tüm markalar satır × sütun)'),
        bullet('Renk kodlaması: En ucuz yeşil, en pahalı kırmızı'),
        bullet('Kategori filtresi: Sıcak, Soğuk, Tatlı vb.'),
        empty(),

        h2('4.4 Satış Analizi (/satis-analizi)'),
        bullet('Aylık satış trendi (çizgi grafik)'),
        bullet('Haftalık satış karşılaştırması (bar grafik)'),
        bullet('En çok satan ürünler listesi'),
        bullet('Şehir bazında satış dağılımı'),
        empty(),

        h2('4.5 Sosyal Medya (/sosyal-medya)'),
        p('Instagram performansı, Google itibarı ve duygu analizi. Veri: instagramProfiles.json (May 2026).'),
        bullet('Bölüm 1 — Instagram: 4 KPI kartı, 5 bulgu kartı, etkileşim bar grafik, scatter grafik, 11 marka detay tablosu'),
        bullet('Bölüm 2 — Google Maps: 7 marka puan kartı, itibar risk tablosu (trafik lambası sistemi)'),
        bullet('Bölüm 3 — Duygu Analizi: Yığılmış bar grafik, marka bazında şikayet/övgü etiketleri'),
        bullet('Bölüm 4 — AI Aksiyon Planı: Instagram avantajı, KD açığı, takipçi hedefi'),
        empty(),

        h2('4.6 Yeni Ürün Radar (/yeni-urun-radar)'),
        p('Rakip ürün lansmanlarını ve yaklaşan ürünleri takip etme. Veri: newProductData.js.'),
        bullet('Filtreler: Marka, Durum (Aktif/Yakında), Kategori, Kaynak (3 güven katmanı)'),
        bullet('Ürün Kartları: İsim, açıklama, lansman tarihi, OSINT güven skoru'),
        bullet('3 Kaynak Katmanı: Resmi (~%95), Sosyal/Blog (~%80), Erken Sinyal (~%65)'),
        bullet('Mevcut İzlenen Ürünler: Starbucks yaz serisi, GJ Co Lemonade, Espressolab yaz menüsü, Caribou bahar, Sonbahar PSL tahmini'),
        empty(),

        h2('4.7 OSINT Raporları (/osint-raporlari)'),
        bullet('Trend Kelimeler: 20 marka için karakteristik kelime etiketleri'),
        bullet('Sentiment Skorları: Google Maps rating\'den formülle türetilmiş 20 marka dağılımı'),
        bullet('Haber Akışı: newProductData.js\'den otomatik oluşturulur, marka filtresi'),
        empty(),

        h2('4.8 Haber Akışı (/son-dakika) — CANLI'),
        bullet('Railway scraper /api/news\'dan gerçek zamanlı haberler'),
        bullet('Google News RSS → espressolab-scraper → MongoDB → Dashboard'),
        bullet('Her 6 saatte cron job ile güncellenir'),
        empty(),

        h2('4.9 Şube Puan Analizi (/sube-puanlari)'),
        p('1375+ şubenin Google Maps puanlarını analiz etme. Veri: Railway API /api/branches (1 saatlik cache).'),
        bullet('Düşük Performans Alarmı: Puan < 3.5 VE yorum > 100'),
        bullet('Marka Özet Kartları: Tıklanabilir filtre'),
        bullet('En İyi/Kötü 10: Ağırlıklı skor = Puan × log10(Yorum+1)'),
        bullet('Puan Dağılımı: 6 aralıklı tıklanabilir bar grafik'),
        bullet('Scatter Grafik: Yorum sayısı × Puan ilişkisi'),
        bullet('Boşluk Analizi: Referans marka bazlı şehir analizi'),
        bullet('Pivot Tablo: 15 şehir × tüm markalar'),
        bullet('Şube Listesi: 50\'lik sayfalama, tüm sütunlar sıralanabilir'),
        empty(),

        h2("4.10 Gloria Jean's (/gloria-jeans) — YENİ"),
        p('Gloria Jean\'s Coffees Türkiye için derinlemesine marka istihbarat raporu.'),
        bullet('8 KPI kartı: Şube, pazar payı, fiyat, Google puanı, Instagram, NPS, çalışan'),
        bullet('Performans Radar: 8 boyut'),
        bullet('Rakip Karşılaştırması: Google puanı + Instagram etkileşim barları'),
        bullet('🆕 Canlı Şube Puanları: Railway API — En iyi 5 / En kötü 5 GJ şubesi'),
        bullet('🆕 Şehir Bazında GJ: 12 şehir, ortalama puan + şube sayısı'),
        bullet('Instagram Analizi @gjcsturkey: 10 metrik kartı (29 Mayıs 2026)'),
        bullet('Duygu Analizi: %62 olumlu / %23 nötr / %15 olumsuz'),
        bullet('SWOT Analizi + 2026 Yeni Ürünler + Stratejik Değerlendirme'),
        empty(),

        h2('4.11 Raporlar & Export (/raporlar)'),
        p('Excel ve PowerPoint formatında otomatik rapor üretimi.'),
        bullet('Excel: 6 bölüm seçilebilir, toplam 8 sayfa, renk kodlamalı'),
        bullet('PPTX: 8 slayt, koyu tema, karamel aksan, dinamik tarih'),
        bullet('Dosya adları tarih içerir: Rekabet_Raporu_YYYY-MM-DD.xlsx'),
        empty(),

        // ── 5. Veri Mimarisi ──────────────────────────────────────────────────
        h1('5. VERİ MİMARİSİ'),

        h2('5.1 Statik Veri Dosyaları (src/data/)'),
        makeTable(
          ['Dosya', 'İçerik', 'Güncelleme'],
          [
            ['competitorData.js', '20 marka: şube, fiyat, puanlar, skorlar', 'Manuel (araştırma)'],
            ['menuData.js', 'Ürün fiyat matrisi', 'Manuel'],
            ['newProductData.js', 'OSINT ürün lansmanları veritabanı', 'Manuel'],
            ['osintData.js', 'Sentiment skorları + trend kelimeler', 'Manuel/formül'],
            ['instagramProfiles.json', '11 hesap profili (29 Mayıs 2026)', 'Manuel'],
            ['instagramPosts.json', '11 hesap etkileşim verileri (29 Mayıs 2026)', 'Manuel'],
            ['googleMapsRatings.json', '7 marka puan + trend + yorum', 'Manuel'],
            ['sentimentData.json', 'Duygu analizi verileri', 'Manuel'],
          ]
        ),
        empty(),

        h2('5.2 Canlı Veri (Railway API)'),
        makeTable(
          ['Endpoint', 'Kullanılan Sayfa', 'Açıklama'],
          [
            ['GET /api/branches', 'Şube Puan Analizi, GJ', 'Tüm şube verileri (branches.json)'],
            ['GET /api/news', 'Haber Akışı, Dashboard', 'Son haberler (MongoDB)'],
            ['GET /api/competitors', 'Rakip Analizi', 'Rakip fiyat verileri (MongoDB)'],
            ['GET /api/health', '—', 'Sunucu sağlık kontrolü'],
          ]
        ),
        empty(),

        h2('5.3 Otomatik Güncelleme (Cron Jobs)'),
        bullet('Her gece 02:00 (TR saati): Tüm rakip scraper\'ları çalışır'),
        bullet('Her 6 saatte: Starbucks + Kahve Dünyası fiyat güncelleme'),
        bullet('Her 6 saatte: Haber taraması'),
        bullet('Google Maps şube puanları: GOOGLE_MAPS_API_KEY ile gece 02:00'),
        empty(),

        // ── 6. Deployment ─────────────────────────────────────────────────────
        h1('6. DEPLOYMENT MİMARİSİ'),
        bullet('GitHub (fuzuly/pulsara-intel) → Push → Otomatik build'),
        bullet('Render (Static Site) → npm run build → dist/ → intel.pulsaraai.com'),
        bullet('Railway (Node.js Express) → espressolab-scraper → 7/24 çalışır'),
        bullet('MongoDB → Şube + Haber + Rakip verileri'),
        bullet('Railway aylık ~$5 kredi limiti (izlenmelidir)'),
        empty(),

        // ── 7. İzlenen Markalar ───────────────────────────────────────────────
        h1('7. İZLENEN 20 MARKA'),
        makeTable(
          ['#', 'Marka', 'Menşei', 'Tip'],
          [
            ['1','Espressolab (bizim marka)','Türkiye','Specialty'],
            ['2','Starbucks','ABD','Premium'],
            ['3','Kahve Dünyası','Türkiye','Orta Segment'],
            ["4","Gloria Jean's",'Avustralya','Premium'],
            ['5','Şen Çay Kahve','Türkiye','Budget'],
            ['6','Arabica Coffee House','Türkiye','Specialty'],
            ['7','Coffy','Türkiye','Budget'],
            ['8','GUA Coffee Company','Türkiye','Specialty'],
            ['9','LUUQ Coffee & Roastery','Türkiye','Specialty'],
            ['10','Caffè Nero','İngiltere','Premium'],
            ['11','Laos Coffee Roastery','Türkiye','Specialty'],
            ['12','Brew Mood','Türkiye','Orta Segment'],
            ['13','Coffeemania','Türkiye','Orta Segment'],
            ['14','Mikel Coffee','Yunanistan','Orta Segment'],
            ['15','Tchibo','Almanya','Orta Segment'],
            ['16','Caribou Coffee','ABD','Premium'],
            ['17','Nevada Coffee','Türkiye','Budget'],
            ['18','Kronotrop','Türkiye','Specialty'],
            ['19','1401 Coffee','Türkiye','Specialty'],
            ['20','Costa Coffee','İngiltere','Premium'],
          ]
        ),
        empty(),

        // ── 8. Eksik/Geliştirilebilecek ───────────────────────────────────────
        h1('8. EKSİK / GELİŞTİRİLEBİLECEK ALANLAR'),
        bullet('Menü verisi eksik markalar: LUUQ, Laos, Kronotrop, GUA, Costa Coffee — Yenilik skoru 0'),
        bullet('Instagram: Sadece 11 marka var (9 marka eksik)'),
        bullet('TikTok/Twitter verileri: Hepsi tahmini, gerçek data girilmeli'),
        bullet('Satış analizi: Espressolab gerçek satış verisi entegrasyonu yapılabilir'),
        bullet('Gerçek NPS verisi: Şu an formülden hesaplanıyor'),
        bullet('Şube puanı otomatik güncelleme: GOOGLE_MAPS_API_KEY aktif, gece 02:00\'de çalışıyor'),
        empty(),

        new Paragraph({
          children: [new TextRun({ text: `─────────────────────────────────────────────────────────`, color: 'C4922A' })],
          alignment: AlignmentType.CENTER, spacing: { before: 400, after: 200 },
        }),
        new Paragraph({
          children: [new TextRun({ text: `Hazırlama Tarihi: ${DATE}  ·  Versiyon 1.0.0  ·  Gizli`, size: 18, color: '888888', italics: true })],
          alignment: AlignmentType.CENTER,
        }),
      ],
    }],
  });

  const buffer = await Packer.toBuffer(doc);
  const fname = path.join(OUT, `Rekabet_Analizi_Sistem_Dokumantasyonu_${new Date().toISOString().split('T')[0]}.docx`);
  fs.writeFileSync(fname, buffer);
  console.log('✅ DOCX oluşturuldu:', fname);
}

// ─── Çalıştır ─────────────────────────────────────────────────────────────────
(async () => {
  console.log('📄 Dosyalar oluşturuluyor...');
  await generatePPTX();
  await generateDOCX();
  console.log('\n✅ Tüm dosyalar:', OUT);
})();
