# Rekabet Analizi — İstihbarat Platformu
## Tam Sistem Dokümantasyonu · Haziran 2026

---

## 1. GENEL BAKIŞ

**Platform:** `intel.pulsaraai.com`  
**Versiyon:** 1.0.0  
**Teknoloji:** React 18 + Vite + TailwindCSS + Recharts  
**Deployment:** Render (Static Site) — GitHub otomatik deploy  
**Scraper API:** Railway — `espressolab-scraper-production.up.railway.app`  
**Repo:** `github.com/fuzuly/pulsara-intel`

**Amaç:** Türkiye kahve sektöründeki 20 rakip markayı gerçek zamanlı ve statik verilerle izleyen, analiz eden ve raporlayan özel istihbarat platformu.

---

## 2. GİRİŞ / KİMLİK DOĞRULAMA

**URL:** `/login`  
**Dosya:** `src/pages/Login.jsx`  
**Sistem:** `src/context/AuthContext.jsx`

- Kullanıcı adı + şifre ile giriş
- Kimlik doğrulama `localStorage`'da saklanır
- Giriş yapılmadan tüm sayfalar `/login`'e yönlendirir
- Kullanıcılar `src/config/users.js` dosyasında tanımlıdır
- Oturum kapatma: Sol menü alt kısım → "Çıkış Yap"

---

## 3. ANA LAYOUT

**Dosya:** `src/components/layout/MainLayout.jsx`

Tüm sayfalarda ortak olan yapı:

| Bileşen | Açıklama |
|---------|----------|
| **Sidebar** (sol) | Navigasyon menüsü, daraltılabilir (16px / 240px) |
| **TopBar** (üst) | Saat/tarih, bildirim zili, Rapor İndir butonu, Soru işareti |
| **LiveTicker** | En üstte akan canlı haber bandı (her 8 saniyede güncellenir) |
| **İçerik Alanı** | Her sayfanın kendine özgü içeriği |

### Sidebar Özellikleri
- Tam genişlik (240px): İkon + Etiket
- Daraltılmış (64px): Yalnızca ikonlar, hover'da tooltip
- Aktif sayfa: Karamel renkli sol çizgi + vurgulu arka plan
- "CANLI" rozeti: Haber Akışı menüsünde kırmızı yanıp söner
- "YENİ" rozeti: Gloria Jean's menüsünde mor

### TopBar Özellikleri
- **Saat/Tarih:** Gerçek zamanlı saat (HH:MM:SS formatı)
- **Bildirim Zili:** Uyarı sayacı (rakip değişiklikleri vb.)
- **Rapor İndir:** Doğrudan `/raporlar` sayfasına bağlantı
- **Soru işareti:** Yardım / destek

---

## 4. SAYFALAR — DETAYLI AÇIKLAMA

---

### 4.1 ANA DASHBOARD
**URL:** `/`  
**Dosya:** `src/pages/Dashboard.jsx`  
**Menü İkonu:** LayoutDashboard  

**Amaç:** Tüm sistemin özet görünümü. Platforma giriş sayfası.

#### İçerik Bölümleri:

**KPI Kartları (4 adet):**
| Kart | Veri Kaynağı | Açıklama |
|------|-------------|----------|
| İzlenen Marka | `brands.js` | Sistemde takip edilen toplam marka sayısı (20) |
| 2026 Yeni Ürün Lansmanı | `newProductData.js` | Aktif + yakında gelecek ürün sayısı |
| En Yüksek Engagement | `instagramPosts.json` | Sektördeki en yüksek Instagram etkileşim oranı |
| Risk Altındaki Şube | Statik | Google puanı 4.0 altındaki şube sayısı |

**Instagram Engagement Trendi (Çizgi Grafik):**
- Eylül 2025 — Mayıs 2026 dönemi
- 3 marka: Espressolab, Starbucks, Kahve Dünyası
- Aylık bazda etkileşim oranı karşılaştırması

**Google Maps Puan Sıralaması (Bar Grafik):**
- 20 markanın puan karşılaştırması
- `competitorData.js`'den dinamik
- Yüksekten düşüğe sıralı

**Son Haberler (Canlı):**
- `useNewsData` hook → Railway scraper `/api/news`
- Son 5 haber kartı
- Her haber: Marka rozeti + başlık + kaynak + tarih

**Yeni Ürün Radar Özeti:**
- Son 3 aktif ürün lansmanı
- `newProductData.js`'den dinamik

---

### 4.2 RAKİP ANALİZİ
**URL:** `/rakip-analizi`  
**Dosya:** `src/pages/CompetitorAnalysis.jsx`  
**Veri:** `src/data/competitorData.js` + Railway API  

**Amaç:** 20 markanın 8 boyutta kapsamlı karşılaştırması.

#### İçerik Bölümleri:

**Marka Seçici:**
- Radar grafiği için maks. 5 marka seçilebilir
- Tüm 20 marka renk kodlu buton olarak listelenir

**Çok Boyutlu Performans Radar Grafiği:**
- 8 eksen: Kalite, Sosyal Medya, Yenilik, Müşteri Sadakati, Dijital Varlık, Menü Çeşitliliği, Sürdürülebilirlik, Marka Bilinirliği
- Seçilen markalar üst üste görselleştirilir

**Genel Performans Skoru Sıralaması (Bar Grafik):**
- Tüm 20 marka yatay bar
- Ağırlıklı genel skor (0-100)

**Tüm Markalar Detay Kartları:**
- Her kart: Marka logosu + isim + ülke/tip
- 4 metrik kutusu: Şube sayısı, Ort. fiyat, Google puanı (tıklanabilir), NPS
- 3 progress bar: Kalite, Sosyal Varlık, Menü Yeniliği
- CAGR büyüme oranı footer'da
- Sıralama: Skor / Büyüme / Fiyat butonlarıyla değiştirilebilir

**Google Puan Analizi Modal:**
- Herhangi bir markadaki Google puanına tıklanınca açılır
- İçerik: Puan göstergesi, Yüksek puan nedenleri, Düşüren faktörler, Rekabet aksiyonu

**Tam Karşılaştırma Tablosu:**
- Tüm markalar satır bazında
- Sütunlar: Şube, Ort. Fiyat, Google, NPS, Kalite, Sosyal, Yenilik, Sadakat, Skor, CAGR
- Tıklanabilir sütun başlıkları (sıralama)

**Skor Hesaplama Formülleri:**
- Kalite = Google rating × 20
- Sosyal = log10(yorum sayısı) normalized
- Yenilik = Menüdeki ürün sayısı (menuData.js)
- NPS = (rating - 3) × 50
- Genel Skor = Ağırlıklı ortalama

---

### 4.3 MENÜ KARŞILAŞTIRMASI
**URL:** `/menu-karsilastirmasi`  
**Dosya:** `src/pages/MenuComparison.jsx`  
**Veri:** `src/data/menuData.js`  

**Amaç:** Ürün fiyatlarını marka bazında karşılaştırma.

#### İçerik:
- Ürün listesi matris tablosu
- Her satır: Ürün adı + tüm markalar için fiyat
- Renk kodlaması: En ucuz yeşil, en pahalı kırmızı
- Eksik fiyat: "—" gösterimi
- Filtreler: Kategori (Sıcak, Soğuk, Tatlı vb.)

---

### 4.4 SATIŞ ANALİZİ
**URL:** `/satis-analizi`  
**Dosya:** `src/pages/SalesAnalysis.jsx`  
**Veri:** `src/data/salesData.js`  

**Amaç:** Espressolab iç satış verilerinin görselleştirilmesi.

#### İçerik:
- Aylık satış trendi (çizgi grafik)
- Haftalık satış karşılaştırması (bar grafik)
- En çok satan ürünler listesi
- Şehir bazında satış dağılımı
- Kategori bazında satış yüzdeleri

---

### 4.5 SOSYAL MEDYA
**URL:** `/sosyal-medya`  
**Dosya:** `src/pages/SocialMedia.jsx`  
**Veri:** `instagramProfiles.json` + `instagramPosts.json` + `googleMapsRatings.json` + `sentimentData.json`  

**Amaç:** Instagram performansı, Google itibarı ve duygu analizi.

#### Bölüm 1 — Instagram Performansı:
- 4 KPI kartı: Espressolab takipçisi, Etkileşim oranı, Etkileşim sıralaması, Takip edilen hesap sayısı
- 5 öne çıkan bulgu kartı (Espressolab lider, GJ kriz, Nevada tartışmalı vb.)
- Etkileşim oranı bar grafiği (tüm markalar)
- Takipçi × Etkileşim scatter grafiği (kabarcık = gönderi sayısı)
- Instagram hesap detay tablosu (11 marka): Takipçi, Takip, Gönderi, Ort. Beğeni, Max Beğeni, Ort. Yorum, Etkileşim, Max Görüntülenme, Doğrulama, Hesap Türü

**Veri kaynağı notu:** Mayıs 2026 gerçek verileri (29 Mayıs 2026 tarihli)

#### Bölüm 2 — Google Maps İtibar Skoru:
- KD itibar uyarı bandı (3.64 ile en düşük)
- 7 marka için puan kartları: Puan, Yıldız gösterimi, Trend (↑↓→), Yorum sayısı
- İtibar Risk Tablosu: Risk seviyesi trafik lambası sistemi (Kırmızı/Sarı/Yeşil)

#### Bölüm 3 — Duygu Analizi:
- Espressolab duygu özeti (Olumlu/Nötr/Olumsuz)
- Marka bazlı duygu dağılımı yığılmış bar grafiği
- Her marka için şikayet ve övgü etiketleri

#### Bölüm 4 — AI Aksiyon Planı:
- Instagram avantajını koruma önerisi
- Kahve Dünyası açığını değerlendirme önerisi
- Takipçi büyütme hedef analizi

---

### 4.6 YENİ ÜRÜN RADAR
**URL:** `/yeni-urun-radar`  
**Dosya:** `src/pages/NewProductRadar.jsx`  
**Veri:** `src/data/newProductData.js`  

**Amaç:** Rakip markaların yeni ürün lansmanlarını ve yaklaşan ürünleri takip etme.

#### İçerik:
- 3 KPI kartı: İzlenen Ürün, Aktif Lansman, Yakında

**Filtreler:**
- Marka filtresi (buton grubu)
- Durum filtresi: Tümü / Aktif / Yakında
- Kategori filtresi: Sezonluk, Soğuk İçecek, Specialty, Sınırlı Sürüm, Yiyecek vb.
- Kaynak filtresi: Resmi Kaynak / Sosyal-Blog / Erken Sinyal

**Ürün Kartları:**
Her kart şunları içerir:
- Marka rozeti + Durum (Aktif/Yakında) + Kaynak katmanı rozeti + Etiketler (#yaz, #matcha vb.)
- Ürün adı ve açıklaması
- Lansman tarihi + Tespit tarihi + Fiyat (varsa) + Kaynak linki
- OSINT Güven Skoru progress bar (%50–%98)

**OSINT Metodolojisi Bölümü:**
- 3 güvenilirlik katmanı açıklaması:
  - Katman 1 (Resmi Kaynak): ~%95 güven
  - Katman 2 (Sosyal/Blog): ~%80 güven
  - Katman 3 (Erken Sinyal): ~%65 güven
- 4 tespit yöntemi: İş İlanı Analizi, Sosyal Medya Teaser, Sezonsal Kalıp, Küresel→TR Transferi

**Mevcut Ürünler (Haziran 2026):**
- Starbucks: Tropical Butterfly Refresher, Horchata serisi (global transfer)
- Starbucks: Şeytan Marka Giyer 2 kolaborasyonu
- Espressolab: Yaz 2026 menüsü (Creme Brulee Tahini Latte, Passion Fizz, Brazilian Lemonade + 3 tatlı)
- Gloria Jean's: Co Lemonade (aktif), Fırın tatlı serisi
- Caribou: Cinnamon Sugar Latte, Amy's Blend
- Tchibo: Türk Kahvesi kampanyası
- Starbucks: PSL Sonbahar geri dönüşü (Ağustos tahmini)

---

### 4.7 OSINT RAPORLARI
**URL:** `/osint-raporlari`  
**Dosya:** `src/pages/OsintReports.jsx`  
**Veri:** `src/data/osintData.js` + `newProductData.js`  

**Amaç:** Açık kaynak istihbaratı özeti — trend kelimeler, duygu skorları ve haber akışı.

#### İçerik:

**Trend Kelimeler — Marka Bazlı:**
- 20 marka için karakteristik kelime etiketleri
- Büyüklük ve renk yoğunluğu öneme göre değişir
- Örnek: Espressolab → #specialty-kahve #single-origin #roastery

**Marka Sentiment Skorları:**
- 20 marka için Pozitif/Nötr/Negatif yüzde dağılımı
- Google Maps rating'inden matematiksel formülle türetilmiş
- Yatay yığılmış progress bar görselleştirme
- En yüksek: Laos (%63 pozitif), En düşük: Kahve Dünyası (%27 pozitif)

**Haber Akışı (Statik):**
- `newProductData.js`'deki tüm ürün lansmanlarından otomatik oluşturulur
- Marka filtresi ile filtrelenebilir
- Her kayıt: Marka rozeti + Kaynak etiketi + Kaç gün önce + Başlık + Özet

---

### 4.8 HABER AKIŞI
**URL:** `/son-dakika`  
**Dosya:** `src/pages/BreakingNews.jsx`  
**Veri:** Railway scraper API → `/api/news` (canlı)  
**Badge:** CANLI (kırmızı, yanıp söner)

**Amaç:** Kahve sektörüne dair gerçek zamanlı haber akışı.

#### İçerik:
- Canlı haber kartları (Railway'den çekilir)
- Her haber: Başlık + Kaynak + Tarih + Duygu etiketi
- Marka filtresi
- Otomatik yenileme

**Veri Akışı:**
```
Google News RSS → espressolab-scraper → /api/news → BreakingNews.jsx
```

Haberler her 6 saatte bir Railway cron job ile güncellenir.

---

### 4.9 ŞUBE PUAN ANALİZİ
**URL:** `/sube-puanlari`  
**Dosya:** `src/pages/BranchRatings.jsx`  
**Hook:** `src/hooks/useBranchData.js`  
**Veri:** Railway scraper API → `/api/branches` (canlı, 1 saatlik cache)

**Amaç:** Türkiye genelindeki 1375+ şubenin Google Maps puanlarını analiz etme.

#### İçerik:

**Düşük Performans Alarmı:**
- Puan < 3.5 VE yorum sayısı > 100 olan şubeler
- Açılır/kapanır panel
- Google Maps linki her şube için

**Marka Özet Kartları (tıklanabilir filtre):**
- Her marka için: Ortalama puan, Şube sayısı, Min/Max puan, Ağırlıklı skor
- Tıklayınca o markaya filtreler

**Filtreler:**
- Marka filtresi (renk kodlu butonlar)
- Şehir filtresi (dropdown, tüm şehirler)

**En İyi / En Kötü 10 Şube:**
- Ağırlıklı skor = Puan × log10(Yorum+1)
- Min 10 yorum şartı
- Google Maps linki

**Puan Dağılımı Bar Grafiği:**
- 6 aralık: 1-2, 2-3, 3-3.5, 3.5-4, 4-4.5, 4.5-5
- **Tıklanabilir:** O aralıktaki şubeleri aşağıda filtreler

**Yorum Sayısı × Puan Scatter Grafiği:**
- Her nokta bir şube
- Marka rengiyle kodlanmış
- Tooltip: Şube adı + şehir + puan + yorum sayısı

**Boşluk Analizi:**
- Referans marka seçilebilir
- "Rakipler var, seçili marka yok" şehirler listesi
- "Seçili marka var, rakip az" şehirler listesi

**Şehir × Marka Pivot Tablosu:**
- Açılır/kapanır
- En yoğun 15 şehir × tüm markalar
- Her hücre: Ortalama puan + şube sayısı

**Şube Listesi:**
- 50'lik sayfalama
- Sütunlar: Marka, Şube Adı + Adres, Şehir, Puan + Yıldız, Yorum sayısı, Ağırlıklı skor, Trend (önceki vs mevcut puan), Google Maps linki
- Tüm sütunlar sıralanabilir
- Düşük performanslı şubeler kırmızı zemin

---

### 4.10 GLORIA JEAN'S
**URL:** `/gloria-jeans`  
**Dosya:** `src/pages/GloriaJeans.jsx`  
**Badge:** YENİ  

**Amaç:** Gloria Jean's Coffees Türkiye için derinlemesine marka istihbarat raporu.

#### İçerik:

**KPI Kartları (8 adet):**
Türkiye Şube Sayısı, Pazar Payı, Ort. Ürün Fiyatı, Google Maps Puanı, Instagram Takipçi, Instagram Etkileşim, NPS Skoru, Çalışan Sayısı/Ciro

**Instagram Etkileşim Krizi Uyarı Bandı:**
- %0.11 etkileşim — sektör ortalamasının 12 kat altı

**Performans Skoru Radar (8 Boyut):**
- Kalite, Marka Bilinirliği, Müşteri Sadakati, Sosyal Medya, İnovasyon, Dijital Varlık, Menü Çeşitliliği, Sürdürülebilirlik

**Rakip Karşılaştırması:**
- Google Maps puanı karşılaştırma barları
- Instagram etkileşim karşılaştırma barları

**🆕 GJ Şube Google Puanları — Canlı Veri:**
- Railway API'den gerçek zamanlı çekilir
- En iyi 5 GJ şubesi (ağırlıklı skor)
- En düşük 5 GJ şubesi (min 10 yorum)
- Her şubede Google Maps linki

**🆕 Şehir Bazında GJ Şubeleri:**
- En fazla şubeli 12 şehir
- Her şehir için: Ortalama puan + şube sayısı

**Instagram Analizi — @gjcsturkey:**
- 10 metrik kartı: Takipçi, Gönderi, Takip Edilen, Ort. Beğeni, Max Beğeni, Ort. Yorum, Etkileşim, Doğrulama, Hesap Türü, Veri Tarihi
- İşletme hesabı doğrulaması olmadığına dair kritik uyarı

**Duygu Analizi:**
- Yorum dağılımı (%62 olumlu / %23 nötr / %15 olumsuz)
- Öne çıkan olumlu konular ve şikayetler

**2026 Yeni Ürünler:**
- Aktif ve yakında gelecek ürünler OSINT güven skoru ile

**SWOT Analizi:**
- 4 kart: Güçlü Yönler, Zayıf Yönler, Fırsatlar, Tehditler

**Stratejik Değerlendirme:**
- 3 kart: Instagram Krizi, Fırın Kategorisi Fırsatı, Fiyat & Dijital Dönüşüm

---

### 4.11 MÜŞTERİ DENEYİMİ PANELİ
**URL:** `https://gloriajeans.pulsaraai.com/admin/login` (dış bağlantı)  
**Tip:** External link (yeni sekmede açılır)

Gloria Jean's müşteri deneyimi yönetim paneline doğrudan erişim.

---

### 4.12 RAPORLAR & EXPORT
**URL:** `/raporlar`  
**Dosya:** `src/pages/Reports.jsx`  
**Utils:** `src/utils/exportExcel.js` + `src/utils/exportPPTX.js`

**Amaç:** Tüm analiz verilerini Excel ve PowerPoint formatında indirme.

#### Rapor İçeriği Seçimi:
6 bölüm seçilebilir/seçimi kaldırılabilir:

| Bölüm | İçerik | Excel Sayfası |
|-------|--------|--------------|
| Genel KPI Özeti | Aylık ciro, sipariş, NPS | 1 |
| Rakip Analizi | 20 marka karşılaştırma matrisi | 1 |
| Menü Karşılaştırması | 19 ürün fiyat matrisi | 1 |
| Satış Analizi | Aylık + haftalık + top ürünler | 2 |
| Sosyal Medya | 5 platform, 11 marka metrikleri | 1 |
| OSINT Raporları | Web mentions + duygu analizi | 2 |

#### Excel Raporu (.xlsx):
- Seçilen bölümlere göre dinamik sayfa sayısı
- Otomatik filtreli tablolar
- Türkçe sayı/tarih formatı
- Hücre renk kodlaması
- Dosya adı: `Rekabet_Raporu_YYYY-MM-DD.xlsx`

#### PowerPoint Sunumu (.pptx):
**8 Slayt:**

| Slayt | Başlık | İçerik |
|-------|--------|--------|
| 1 | Kapak | "Rekabet Analizi" + tarih + gizlilik notu |
| 2 | KPI Özeti | 6 Espressolab metriği (şube, puan, NPS, pazar payı, IG takipçi) |
| 3 | Pazar Payı | Top 8 marka: Şube, fiyat, skor tablosu |
| 4 | Rakip Skorları | Top 5 marka × 5 metrik karşılaştırma tablosu |
| 5 | Sosyal Medya | 5 marka Instagram + TikTok karşılaştırması (gerçek veriler) |
| 6 | Yeni Ürün Radar | Son 8 ürün lansmanı kartları |
| 7 | OSINT Duygu | 6 marka için duygu skoru kartları |
| 8 | Kapanış | Sistem bilgisi + gizlilik |

**Tasarım:** Koyu lacivert zemin, karamel aksan rengi, Calibri font

---

## 5. VERİ MİMARİSİ

### 5.1 Statik Veri Dosyaları (src/data/)

| Dosya | İçerik | Güncelleme |
|-------|--------|------------|
| `competitorData.js` | 20 marka: Şube, fiyat, puanlar, skorlar, pazar payı | Manuel (araştırma) |
| `menuData.js` | Ürün fiyat matrisi (tüm markalar) | Manuel |
| `salesData.js` | Espressolab satış verileri | Manuel |
| `socialMediaData.js` | Platform verileri (BoomSocial Mart 2026) | Manuel |
| `newProductData.js` | Ürün lansmanları OSINT veritabanı | Manuel |
| `osintData.js` | Sentiment skorları + trend kelimeler | Manuel / formül |
| `instagramProfiles.json` | 11 hesap: Takipçi, gönderi, doğrulama (Mayıs 2026) | Manuel |
| `instagramPosts.json` | 11 hesap: Etkileşim, beğeni, yorum (Mayıs 2026) | Manuel |
| `googleMapsRatings.json` | 7 marka: Puan, trend, yorum sayısı | Manuel |
| `sentimentData.json` | Duygu analizi verileri | Manuel |

### 5.2 Canlı Veri (Railway API)

**Base URL:** `https://espressolab-scraper-production.up.railway.app`

| Endpoint | Kullanılan Sayfa | Açıklama |
|----------|-----------------|----------|
| `GET /api/branches` | Şube Puan Analizi, Gloria Jean's | Tüm şube verileri (JSON dosyası) |
| `GET /api/news` | Haber Akışı, Ana Dashboard | Son haberler (MongoDB) |
| `GET /api/competitors` | (Rakip Analizi) | Rakip fiyat verileri (MongoDB) |
| `GET /api/health` | — | Sunucu sağlık kontrolü |

**Otomatik Güncelleme (Cron Jobs):**
- Her gece 02:00: Tüm rakip scraper'ları çalışır
- Her 6 saatte: Starbucks + Kahve Dünyası fiyat güncelleme
- Her 6 saatte: Haber taraması
- Google Maps şube puanları: `GOOGLE_MAPS_API_KEY` ile gece 02:00'de

### 5.3 Cache Sistemi
- `useBranchData.js`: 1 saatlik localStorage cache
- `useCompetitorData.js`: Sayfa yüklendiğinde Railway'den çeker
- `useNewsData.js`: Sayfa yüklendiğinde Railway'den çeker

---

## 6. HOOK'LAR (src/hooks/)

| Hook | Kullanıldığı Yer | Açıklama |
|------|-----------------|----------|
| `useBranchData.js` | Şube Puan Analizi, Gloria Jean's | Railway `/api/branches` → 1h cache |
| `useCompetitorData.js` | Rakip Analizi | Railway `/api/competitors` |
| `useNewsData.js` | Ana Dashboard, Haber Akışı | Railway `/api/news` |
| `useExport.js` | Raporlar | Excel/PPTX export mantığı |
| `useDataRefresh.js` | DataFreshnessBar | Son güncelleme zamanı |
| `useLiveTicker.js` | LiveTicker | Canlı haber bandı |
| `useLocalStorage.js` | Genel | localStorage yardımcısı |
| `useScrapedNews.js` | Haber Akışı | Scraper haber hook'u |
| `useSocialMonitor.js` | Sosyal Medya | Sosyal izleme |

---

## 7. ORTAK BILEŞENLER (src/components/)

### Layout Bileşenleri
| Bileşen | Açıklama |
|---------|----------|
| `MainLayout.jsx` | Tüm sayfaları saran ana çerçeve |
| `Sidebar.jsx` | Sol navigasyon, daraltılabilir |
| `TopBar.jsx` | Üst bar: saat, bildirim, rapor |
| `LiveTicker.jsx` | En üstte akan haber bandı |

### Common Bileşenleri
| Bileşen | Açıklama |
|---------|----------|
| `BrandBadge.jsx` | Renk kodlu marka rozeti |
| `DataFreshnessBar.jsx` | "Son güncelleme" durum bandı |
| `DemoDataBanner.jsx` | Demo mod uyarı bandı |
| `ConnectionPending.jsx` | Bağlantı bekleniyor göstergesi |
| `KPICard.jsx` | Standart KPI kartı bileşeni |
| `SectionHeader.jsx` | Sayfa başlığı + alt başlık |
| `ThemeToggle.jsx` | Tema değiştirici (aydınlık/karanlık) |

---

## 8. CONSTANTS (src/constants/)

### brands.js
20 marka tanımı:
- `id`: Sistem kimliği (espressolab, starbucks vb.)
- `name`: Tam isim
- `shortName`: Kısa isim (ESL, SBX vb.)
- `color`: Hex renk kodu
- `isOwn`: true = Espressolab
- `country`: Menşei
- `type`: specialty / premium / budget

### routes.js
Sidebar menü yapılandırması — tüm 12 navigasyon öğesi.

---

## 9. DEPLOYMENT MİMARİSİ

```
GitHub (fuzuly/pulsara-intel)
       ↓ Push → Otomatik deploy
Render (Static Site)
       ↓ HTTPS
intel.pulsaraai.com
       ↓ API çağrıları
Railway (espressolab-scraper)
       ↓
MongoDB (Şube + Haber + Rakip verileri)
```

**Render:** Statik site, her push'ta otomatik build (npm run build → dist/)  
**Railway:** Node.js + Express API, 7/24 çalışır, ~$5 aylık kredi  
**MongoDB:** Rakip verileri + haberler veritabanı  
**Environment Variables:** `GOOGLE_MAPS_API_KEY` → Railway Variables

---

## 10. MEVCUT KAPSAM

### İzlenen 20 Marka:
1. Espressolab (bizim marka)
2. Starbucks
3. Kahve Dünyası
4. Gloria Jean's
5. Şen Çay Kahve
6. Arabica Coffee House
7. Coffy
8. GUA Coffee Company
9. LUUQ Coffee & Roastery
10. Caffè Nero
11. Laos Coffee Roastery
12. Brew Mood
13. Coffeemania
14. Mikel Coffee
15. Tchibo
16. Caribou Coffee
17. Nevada Coffee
18. Kronotrop
19. 1401 Coffee
20. Costa Coffee

### Veri Kapsamı (Mayıs 2026):
- **Şube verileri:** 1375+ şube, 111 GJ şubesi dahil
- **Instagram:** 11 marka gerçek verisi (29 Mayıs 2026)
- **Ürün lansmanları:** 22 aktif + yakında ürün
- **Haberler:** Son 30 günlük, canlı akış

---

## 11. EKSİK / GELİŞTİRİLEBİLECEK ALANLAR

1. **Menü verisi eksik markalar:** LUUQ, Laos, Kronotrop, GUA, Costa Coffee — Yenilik skoru sıfır
2. **Instagram verileri:** Sadece 11 marka (9 marka eksik)
3. **TikTok/Twitter verileri:** Hepsi tahmini
4. **Satış analizi:** Espressolab iç verisi ile bağlantı kurulabilir
5. **Gerçek NPS verisi:** Şu an formülden hesaplanıyor
6. **Şube puanı otomatik güncelleme:** Google Maps API key aktif, gece 02:00'de çalışıyor

---

*Belge oluşturma tarihi: 1 Haziran 2026*  
*Hazırlayan: Claude Code (Pulsara AI)*
