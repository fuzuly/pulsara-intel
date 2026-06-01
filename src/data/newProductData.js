// ═══════════════════════════════════════════════════════════════════════════════
// YENİ ÜRÜN RADAR — 2026 Güncel Lansmanlar
//
// Yalnızca 2026 yılına ait veriler. 2025 ve öncesi çıkarılmıştır.
//
// layer — güvenilirlik katmanı:
//   1 = Resmi Kaynak   (marka sitesi, AA, resmi basın bülteni, çok kaynak)  → %88-98
//   2 = Sosyal / Blog  (food blog, haber sitesi, Instagram, tek kaynak)     → %68-88
//   3 = Erken Sinyal   (global transfer tahmini, geçmiş örüntü, belirsiz)   → %50-68
//
// detectedAt = Radar'ın ürünü ilk tespit ettiği tarih
//
// ARAŞTIRMA KAYNAKLARI (30 Mayıs 2026):
//   about.starbucks.com · gastrofill.com · odatv.com · mallreport.com.tr
//   foodinlife.com · marketingturkiye.com.tr · beveragedaily.com
//   Anadolu Ajansı · Food and Travel TR · Dünya Gazetesi
// ═══════════════════════════════════════════════════════════════════════════════

export const NEW_PRODUCTS = [

  // ════════════════════════════════════════════════════════════════════════
  // STARBUCKS TÜRKİYE — Global Yaz 2026 (TR'ye Transferi Bekleniyor)
  // Kaynak: about.starbucks.com (12 Mayıs 2026 ABD/Kanada lansmanı)
  // Starbucks TR global lansmanları 4-8 haftada uyarlar → Haziran-Temmuz 2026
  // ════════════════════════════════════════════════════════════════════════

  {
    id: 'sbx-2026-009',
    brand: 'starbucks',
    name: 'Tropical Butterfly Refresher',
    category: 'Global Transfer',
    launchDate: '2026-06-15',
    detectedAt: '2026-05-12',
    price: null,
    description: 'Guava ve passion fruit aromalı, mango-ananas patlayan incili, butterfly pea flower infüzyonlu (doğal mor renk) refresher. 4 versiyon: klasik, lemonade, energy, hindistan cevizi sütlü. 12 Mayıs 2026 ABD/Kanada lansmanı — TR\'ye Haziran-Temmuz 2026 bekleniyor.',
    status: 'upcoming',
    isOwn: false,
    layer: 2,
    osintConfidence: 72,
    tags: ['yaz', 'refresher', 'tropikal', 'mor', 'global-transfer'],
    source: 'about.starbucks.com — Starbucks Summer Menu 2026 (Global)',
  },
  {
    id: 'sbx-2026-010',
    brand: 'starbucks',
    name: 'Iced Horchata Shaken Espresso',
    category: 'Global Transfer',
    launchDate: '2026-06-15',
    detectedAt: '2026-05-12',
    price: null,
    description: 'Starbucks Blonde Espresso + horchata şurubu + yulaf sütü. Tarçın, vanilya ve kavrulmuş pirinç notaları. 12 Mayıs 2026 ABD lansmanı — TR uyarlaması bekleniyor.',
    status: 'upcoming',
    isOwn: false,
    layer: 2,
    osintConfidence: 70,
    tags: ['yaz', 'espresso', 'horchata', 'yulaf-sütü', 'global-transfer'],
    source: 'about.starbucks.com — Starbucks Summer Menu 2026 (Global)',
  },
  {
    id: 'sbx-2026-011',
    brand: 'starbucks',
    name: 'Horchata Frappuccino',
    category: 'Global Transfer',
    launchDate: '2026-06-15',
    detectedAt: '2026-05-12',
    price: null,
    description: 'Horchata aromalı yeni Frappuccino. Tarçın ve pirinç notaları. 2026 yaz koleksiyonunun Frappuccino versiyonu. ABD lansmanı 12 Mayıs 2026.',
    status: 'upcoming',
    isOwn: false,
    layer: 2,
    osintConfidence: 70,
    tags: ['yaz', 'frappuccino', 'horchata', 'tarçın', 'global-transfer'],
    source: 'about.starbucks.com — Starbucks Summer Menu 2026 (Global)',
  },

  // ════════════════════════════════════════════════════════════════════════
  // STARBUCKS TÜRKİYE — Şeytan Marka Giyer 2 Kolaborasyonu (Nisan 2026)
  // Kaynak: starbucks_tr Instagram + marketingturkiye.com.tr — Katman 1
  // ════════════════════════════════════════════════════════════════════════

  {
    id: 'sbx-2026-006',
    brand: 'starbucks',
    name: '"Şeytan Marka Giyer 2" Karakter Koleksiyonu',
    category: 'Sınırlı Sürüm',
    launchDate: '2026-04-24',
    detectedAt: '2026-04-24',
    price: null,
    description: '"The Devil Wears Prada 2" global film kolaborasyonu. 4 karakter temalı özel içecek: Miranda Priestly (köpüksüz ekstra shot latte), Andy Sachs (yulaf sütü karamel tarçın cappuccino), Nigel (doppio mocha krema), Emily Charlton (badem sütü iced chai latte). Sınırlı süreli kampanya.',
    status: 'active',
    isOwn: false,
    layer: 1,
    osintConfidence: 92,
    tags: ['kolaborasyon', 'sınırlı-sürüm', 'film', 'özel', 'nisan-2026'],
    source: 'marketingturkiye.com.tr + starbucks_tr Instagram (27 Nisan 2026)',
  },

  // ════════════════════════════════════════════════════════════════════════
  // ESPRESSOLAB — Yaz 2026 Menüsü (18 Nisan 2026)
  // Kaynak: gastrofill.com/113478 + odatv.com — Katman 1
  // Espressolab Roastery İstanbul tadım etkinliğiyle tanıtıldı
  // ════════════════════════════════════════════════════════════════════════

  {
    id: 'esl-2026-001',
    brand: 'espressolab',
    name: 'Creme Brulee Tahini Latte',
    category: 'Sezonluk',
    launchDate: '2026-04-18',
    detectedAt: '2026-04-18',
    price: null,
    description: 'Tahinin karamel ve espressoyla buluştuğu imza yaz içeceği. 18 Nisan 2026 itibarıyla tüm Espressolab şubelerinde aktif. Roastery İstanbul tadım etkinliğiyle lansmanı yapıldı.',
    status: 'active',
    isOwn: true,
    layer: 1,
    osintConfidence: 95,
    tags: ['yaz', 'tahini', 'karamel', 'imza', 'sezonluk'],
    source: 'gastrofill.com — Espressolab Yeni Menüsü ve Avrupa Mağazası (Nisan 2026)',
  },
  {
    id: 'esl-2026-002',
    brand: 'espressolab',
    name: 'Passion Fizz',
    category: 'Soğuk İçecek',
    launchDate: '2026-04-18',
    detectedAt: '2026-04-18',
    price: null,
    description: 'Tropikal aromalı yaz gazlı içeceği. Yaz 2026 menüsünün üç yeni içeceğinden biri. 18 Nisan 2026 itibarıyla tüm şubelerde.',
    status: 'active',
    isOwn: true,
    layer: 1,
    osintConfidence: 90,
    tags: ['yaz', 'tropikal', 'gazlı', 'soğuk', 'sezonluk'],
    source: 'gastrofill.com — Espressolab Yeni Menüsü ve Avrupa Mağazası (Nisan 2026)',
  },
  {
    id: 'esl-2026-003',
    brand: 'espressolab',
    name: 'Brazilian Lemonade',
    category: 'Soğuk İçecek',
    launchDate: '2026-04-18',
    detectedAt: '2026-04-18',
    price: null,
    description: 'Brezilya limonata tarzı serinletici içecek. Yaz 2026 menüsünün üç yeni içeceğinden biri. 18 Nisan 2026 itibarıyla tüm şubelerde.',
    status: 'active',
    isOwn: true,
    layer: 1,
    osintConfidence: 90,
    tags: ['yaz', 'limonata', 'brezilya', 'soğuk', 'sezonluk'],
    source: 'gastrofill.com — Espressolab Yeni Menüsü ve Avrupa Mağazası (Nisan 2026)',
  },
  {
    id: 'esl-2026-004',
    brand: 'espressolab',
    name: 'Key Lime Cheesecake',
    category: 'Yiyecek',
    launchDate: '2026-04-18',
    detectedAt: '2026-04-18',
    price: null,
    description: 'Yaz 2026 yeni tatlı serisinden biri. Mevsimsel malzemelerle hazırlanan sezonluk cheesecake. Yaz içecekleriyle eş zamanlı lansmanı yapıldı.',
    status: 'active',
    isOwn: true,
    layer: 1,
    osintConfidence: 88,
    tags: ['yaz', 'tatlı', 'cheesecake', 'sezonluk'],
    source: 'gastrofill.com + odatv.com — Espressolab Yaz 2026 Menüsü',
  },
  {
    id: 'esl-2026-005',
    brand: 'espressolab',
    name: 'Raspberry & Pistachio Cheesecake',
    category: 'Yiyecek',
    launchDate: '2026-04-18',
    detectedAt: '2026-04-18',
    price: null,
    description: 'Ahududu ve Antep fıstığı kombinasyonlu cheesecake. Yaz 2026 yeni tatlı serisinden biri.',
    status: 'active',
    isOwn: true,
    layer: 1,
    osintConfidence: 88,
    tags: ['yaz', 'tatlı', 'cheesecake', 'fıstık', 'ahududu'],
    source: 'gastrofill.com + odatv.com — Espressolab Yaz 2026 Menüsü',
  },
  {
    id: 'esl-2026-006',
    brand: 'espressolab',
    name: 'Strawberry & Pistachio Crumble',
    category: 'Yiyecek',
    launchDate: '2026-04-18',
    detectedAt: '2026-04-18',
    price: null,
    description: 'Çilek ve Antep fıstığı crumble tatlısı. Yaz 2026 yeni tatlı serisinden biri.',
    status: 'active',
    isOwn: true,
    layer: 1,
    osintConfidence: 88,
    tags: ['yaz', 'tatlı', 'crumble', 'çilek', 'fıstık'],
    source: 'gastrofill.com + odatv.com — Espressolab Yaz 2026 Menüsü',
  },

  // ════════════════════════════════════════════════════════════════════════
  // GLORİA JEAN'S TÜRKİYE — Yeni Tatlı Serisi (8 Nisan 2026)
  // Kaynak: mallreport.com.tr — Katman 1
  // ════════════════════════════════════════════════════════════════════════

  {
    id: 'gj-2026-002',
    brand: 'gloriajeans',
    name: 'Red Velvet Cookie',
    category: 'Yiyecek',
    launchDate: '2026-04-08',
    detectedAt: '2026-04-08',
    price: null,
    description: 'Krem peynir dolgulu red velvet kurabiye. Dinçerler Group Merkezi Mutfağı\'nda üretilip mağaza fırınlarında sıcak servis. Belçika çikolatası ve %100 tereyağı.',
    status: 'active',
    isOwn: false,
    layer: 1,
    osintConfidence: 92,
    tags: ['tatlı', 'kurabiye', 'red-velvet', 'fırın'],
    source: 'mallreport.com.tr — Gloria Jean\'s Coffees\'ten Yeni Tatlar (8 Nisan 2026)',
  },
  {
    id: 'gj-2026-003',
    brand: 'gloriajeans',
    name: 'Chocolate Chip Cookie',
    category: 'Yiyecek',
    launchDate: '2026-04-08',
    detectedAt: '2026-04-08',
    price: null,
    description: 'Sütlü çikolata parçacıklı, yumuşak iç ve hafif çıtır dış dokulu kurabiye. Merkezi Mutfak üretimi, mağaza fırınında sıcak servis.',
    status: 'active',
    isOwn: false,
    layer: 1,
    osintConfidence: 92,
    tags: ['tatlı', 'kurabiye', 'çikolata', 'fırın'],
    source: 'mallreport.com.tr — Gloria Jean\'s Coffees\'ten Yeni Tatlar (8 Nisan 2026)',
  },
  {
    id: 'gj-2026-004',
    brand: 'gloriajeans',
    name: 'Triple Chocolate Cookie',
    category: 'Yiyecek',
    launchDate: '2026-04-08',
    detectedAt: '2026-04-08',
    price: null,
    description: 'Bitter, sütlü ve beyaz Belçika çikolatası bir arada. Tereyağı bazlı tarifi ve mağaza fırınında sıcak servisiyle öne çıkıyor.',
    status: 'active',
    isOwn: false,
    layer: 1,
    osintConfidence: 92,
    tags: ['tatlı', 'kurabiye', 'üçlü-çikolata', 'fırın'],
    source: 'mallreport.com.tr — Gloria Jean\'s Coffees\'ten Yeni Tatlar (8 Nisan 2026)',
  },
  {
    id: 'gj-2026-005',
    brand: 'gloriajeans',
    name: 'White Chocolate Brownie',
    category: 'Yiyecek',
    launchDate: '2026-04-08',
    detectedAt: '2026-04-08',
    price: null,
    description: 'Belçika beyaz çikolatalı brownie. Tüm Gloria Jean\'s Türkiye şubelerinde mağaza fırınında sıcak servis.',
    status: 'active',
    isOwn: false,
    layer: 1,
    osintConfidence: 92,
    tags: ['tatlı', 'brownie', 'beyaz-çikolata', 'fırın'],
    source: 'mallreport.com.tr — Gloria Jean\'s Coffees\'ten Yeni Tatlar (8 Nisan 2026)',
  },
  {
    id: 'gj-2026-001',
    brand: 'gloriajeans',
    name: 'Co Lemonade',
    category: 'Soğuk İçecek',
    launchDate: '2026-06-01',
    detectedAt: '2026-04-01',
    price: null,
    description: 'Kahve ve limonata kombinasyonu. Genç nesle yönelik yaz lansmanı. Tüm Gloria Jean\'s Türkiye şubelerinde sunulması bekleniyor.',
    status: 'active',
    isOwn: false,
    layer: 2,
    osintConfidence: 72,
    tags: ['yaz', 'limonata', 'soğuk', 'gençlik'],
    source: 'marketingturkiye.com.tr — Gloria Jean\'s Coffees',
  },

  // ════════════════════════════════════════════════════════════════════════
  // STARBUCKS TÜRKİYE — Baharın Tatlı Renkleri (Mart 2026)
  // Kaynak: starbucks.com.tr + gastrofill.com + foodandtravel.com.tr — Katman 1
  // ════════════════════════════════════════════════════════════════════════

  {
    id: 'sbx-2026-001',
    brand: 'starbucks',
    name: 'Ube Vanilla Latte',
    category: 'Sezonluk',
    launchDate: '2026-03-09',
    detectedAt: '2026-03-09',
    price: 210,
    description: 'Mor tatlı patates (ube) ve vanilya aroması. Blonde espresso + buharda ısıtılmış süt + ube vanilya sosu. "Baharın Tatlı Renkleri" kampanyasının öne çıkan ürünü.',
    status: 'active',
    isOwn: false,
    layer: 1,
    osintConfidence: 95,
    tags: ['bahar', 'ube', 'mor', 'sezonluk'],
    source: 'starbucks.com.tr + gastrofill.com — Baharın Tatlı Renkleri (Mart 2026)',
  },
  {
    id: 'sbx-2026-002',
    brand: 'starbucks',
    name: 'Iced Ube Vanilla Matcha Latte',
    category: 'Sezonluk',
    launchDate: '2026-03-09',
    detectedAt: '2026-03-09',
    price: 220,
    description: 'Ube vanilya ve matcha bir arada — mor rengiyle sosyal medyada viral olan bahar içeceği.',
    status: 'active',
    isOwn: false,
    layer: 1,
    osintConfidence: 95,
    tags: ['bahar', 'ube', 'matcha', 'soğuk', 'viral'],
    source: 'starbucks.com.tr + gastrofill.com — Baharın Tatlı Renkleri (Mart 2026)',
  },
  {
    id: 'sbx-2026-003',
    brand: 'starbucks',
    name: 'Lemon Vanilla Latte',
    category: 'Sezonluk',
    launchDate: '2026-03-09',
    detectedAt: '2026-03-09',
    price: 205,
    description: 'Limon tazeliği ve vanilyanın yumuşak tadı. Bahar 2026 menüsünün sıcak varyantı. Iced versiyonu da mevcut.',
    status: 'active',
    isOwn: false,
    layer: 1,
    osintConfidence: 95,
    tags: ['bahar', 'limon', 'vanilya', 'sezonluk'],
    source: 'starbucks.com.tr + gastrofill.com — Baharın Tatlı Renkleri (Mart 2026)',
  },
  {
    id: 'sbx-2026-004',
    brand: 'starbucks',
    name: 'Iced Ube Vanilla Macchiato',
    category: 'Sezonluk',
    launchDate: '2026-03-09',
    detectedAt: '2026-03-09',
    price: 215,
    description: 'Ube Vanilla Latte serisinin macchiato versiyonu. Soğuk servis. Bahar 2026 koleksiyonunun parçası.',
    status: 'active',
    isOwn: false,
    layer: 1,
    osintConfidence: 95,
    tags: ['bahar', 'ube', 'macchiato', 'soğuk'],
    source: 'starbucks.com.tr + gastrofill.com — Baharın Tatlı Renkleri (Mart 2026)',
  },
  {
    id: 'sbx-2026-007',
    brand: 'starbucks',
    name: 'Spring Season Blend',
    category: 'Specialty',
    launchDate: '2026-03-09',
    detectedAt: '2026-03-09',
    price: null,
    description: 'Koyu kiraz ve baharat lezzet notalarını içeren bahar sezonuna özel paket çekirdek kahve. Aynı kampanya kapsamında özel bahar temalı aksesuar koleksiyonu da satışa sunuldu.',
    status: 'active',
    isOwn: false,
    layer: 1,
    osintConfidence: 90,
    tags: ['bahar', 'çekirdek', 'sınırlı-sürüm', 'blend'],
    source: 'foodandtravel.com.tr — Baharın Tatlı Renkleri Senin Starbucks\'ta (Mart 2026)',
  },
  {
    id: 'sbx-2026-005',
    brand: 'starbucks',
    name: 'Matcha Cream Frappuccino',
    category: 'Soğuk İçecek',
    launchDate: '2026-03-01',
    detectedAt: '2026-03-01',
    price: 215,
    description: 'Menüye geri dönen klasik. Matcha tozu + Frappuccino kreması. "Matcha Zamanı" kampanyası kapsamında yeniden sunuldu.',
    status: 'active',
    isOwn: false,
    layer: 2,
    osintConfidence: 82,
    tags: ['matcha', 'frappuccino', 'geri-dönüş', 'soğuk'],
    source: 'gastrofill.com — Starbucks\'ta Matcha Zamanı (Mart 2026)',
  },

  // ════════════════════════════════════════════════════════════════════════
  // CARİBOU COFFEE — Bahar 2026 Menüsü (5 Mart 2026)
  // Kaynak: cariboucoffee.com resmi basın bülteni — Katman 1
  // ════════════════════════════════════════════════════════════════════════

  {
    id: 'car-2026-001',
    brand: 'caribou',
    name: 'Cinnamon Sugar Latte',
    category: 'Sezonluk',
    launchDate: '2026-03-05',
    detectedAt: '2026-03-05',
    price: 190,
    description: 'Tarçın şeker aromalı imza latte. Bahar 2026 kampanyasının geri dönen yıldız ürünü. Resmi basın bülteniyle duyuruldu.',
    status: 'active',
    isOwn: false,
    layer: 1,
    osintConfidence: 95,
    tags: ['bahar', 'tarçın', 'sezonluk', 'geri-dönüş'],
    source: 'cariboucoffee.com — Spring 2026 Press Release',
  },
  {
    id: 'car-2026-002',
    brand: 'caribou',
    name: "Amy's Blend",
    category: 'Specialty',
    launchDate: '2026-03-05',
    detectedAt: '2026-03-05',
    price: 195,
    description: "İlk kavurma ustası Amy Erickson anısına her yıl çıkan sınırlı üretim harmanlama. Kadın kahve üreticilerini destekleyen özel ürün. Resmi basın bülteniyle duyuruldu.",
    status: 'active',
    isOwn: false,
    layer: 1,
    osintConfidence: 95,
    tags: ['specialty', 'sınırlı-üretim', 'harmanlama', 'özel'],
    source: "cariboucoffee.com — Amy's Blend Spring 2026",
  },

  // ════════════════════════════════════════════════════════════════════════
  // STARBUCKS TÜRKİYE — Ocak 2026 Fiyat Güncellemesi
  // Kaynak: Dünya Gazetesi + haberler.com — Katman 1
  // ════════════════════════════════════════════════════════════════════════

  {
    id: 'sbx-2026-008',
    brand: 'starbucks',
    name: 'Menü Fiyat Güncellemesi — Ocak 2026',
    category: 'Fiyat Değişikliği',
    launchDate: '2026-01-02',
    detectedAt: '2026-01-02',
    price: null,
    description: 'Tüm menüde ort. %30 zam. Yeni fiyatlar: Küçük filtre kahve 145₺ · Americano 150₺ · Cappuccino 175₺ · Cortado 180₺ · Sıcak çikolata 210₺ · White Choc Mocha 220₺ · Türk çayı 75₺. Önceki zam: Haziran 2025 (%15).',
    status: 'active',
    isOwn: false,
    layer: 1,
    osintConfidence: 98,
    tags: ['fiyat', 'zam', 'ocak-2026', 'menü'],
    source: 'dunya.com — Starbucks Türkiye Fiyatlara Zam Kararı (Ocak 2026)',
  },

  // ════════════════════════════════════════════════════════════════════════
  // TCHİBO — Ocak 2026
  // Kaynak: horecatrend.com — Katman 2
  // ════════════════════════════════════════════════════════════════════════

  {
    id: 'tch-2026-001',
    brand: 'tchibo',
    name: 'Tchibo Türk Kahvesi — "Sır Sizde Saklı" Kampanyası',
    category: 'Türk Kahvesi',
    launchDate: '2026-01-22',
    detectedAt: '2026-01-22',
    price: 95,
    description: '"Sır Sizde Saklı" kampanyasıyla yeniden lansmanı yapılan Tchibo Türk Kahvesi. Mevcut ürün yeni reklam kimliğiyle konumlandırıldı.',
    status: 'active',
    isOwn: false,
    layer: 2,
    osintConfidence: 85,
    tags: ['türk-kahvesi', 'kampanya', 'yeniden-lansman'],
    source: 'horecatrend.com — Tchibo\'dan Yeni Reklam Filmi (Ocak 2026)',
  },

  // ════════════════════════════════════════════════════════════════════════
  // YAKLAŞAN SONBAHAR 2026 — Eylül-Kasım
  // ════════════════════════════════════════════════════════════════════════

  {
    id: 'sbx-2026-012',
    brand: 'starbucks',
    name: 'Pumpkin Spice Latte — Sonbahar Geri Dönüşü',
    category: 'Sonbahar',
    launchDate: '2026-08-26',
    detectedAt: '2026-05-30',
    price: null,
    description: 'Starbucks\'ın ikonik PSL\'si her yıl Ağustos sonu geri dönüyor (2025: 26 Ağustos). 2026 için henüz resmi duyuru yok — geçmiş örüntüye göre Ağustos 2026 sonu bekleniyor. Beraberinde Pumpkin Cream Cold Brew ve Iced Pumpkin Cream Chai\'nin de geleceği tahmin ediliyor.',
    status: 'upcoming',
    isOwn: false,
    layer: 2,
    osintConfidence: 80,
    tags: ['sonbahar', 'psl', 'balkabağı', 'klasik', 'yakında'],
    source: 'parade.com — Starbucks Fall Menu 2026 + geçmiş yıl örüntüsü',
  },
  {
    id: 'sbx-2026-013',
    brand: 'starbucks',
    name: 'Pecan Oatmilk Cortado — Sonbahar Yeni Ürün',
    category: 'Sonbahar',
    launchDate: '2026-09-01',
    detectedAt: '2026-05-30',
    price: null,
    description: 'Pecan (ceviz/fındık) aromalı yulaf sütlü cortado. 2025 fall mevsiminde debüt yaptı; 2026\'da geri dönüşü bekleniyor. Global trend analizine göre pecan, 2026\'da pumpkin spice\'ın en güçlü rakibi (%28 YoY büyüme).',
    status: 'upcoming',
    isOwn: false,
    layer: 2,
    osintConfidence: 75,
    tags: ['sonbahar', 'pecan', 'yulaf-sütü', 'cortado', 'yakında'],
    source: 'beveragedaily.com — Fall 2026 Flavor Trends (Şubat 2026)',
  },
  {
    id: 'costa-2026-001',
    brand: 'costacoffee',
    name: 'Maple Hazel Latte — Sonbahar 2026',
    category: 'Sonbahar',
    launchDate: '2026-09-05',
    detectedAt: '2026-05-30',
    price: null,
    description: 'Maple ve fındık aromalı sonbahar latte. Costa Coffee UK\'de Eylül 2026\'da aktif (resmi basın bülteniyle doğrulandı). Maple Hazel Frappé ve Maple Hazel Hot Chocolate versiyonları da var. Türkiye\'ye adaptasyonu doğrulanamadı — Costa Coffee TR\'nin UK menülerini genellikle takip ettiği bilinmektedir.',
    status: 'upcoming',
    isOwn: false,
    layer: 2,
    osintConfidence: 65,
    tags: ['sonbahar', 'maple', 'fındık', 'latte', 'yakında', 'uk-kaynaklı'],
    source: 'costanewsroom.vuelio.co.uk — Costa Coffee Autumn 2026 (UK Resmi)',
  },

];

export const PRODUCT_CATEGORIES = [
  'Tümü', 'Sezonluk', 'Soğuk İçecek', 'Specialty', 'Sınırlı Sürüm',
  'Yiyecek', 'Türk Kahvesi', 'Fiyat Değişikliği', 'Global Transfer', 'Sonbahar',
];

export const LAYER_CONFIG = {
  1: { label: 'Resmi Kaynak',  icon: '✅', color: 'text-success', bg: 'bg-success/10 border-success/25' },
  2: { label: 'Sosyal / Blog', icon: '📱', color: 'text-info',    bg: 'bg-info/10    border-info/25'    },
  3: { label: 'Erken Sinyal',  icon: '🔍', color: 'text-warning', bg: 'bg-warning/10 border-warning/25' },
};
