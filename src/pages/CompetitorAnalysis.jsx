import { useState, useMemo, useEffect } from 'react';
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
  ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell,
} from 'recharts';
import { TrendingUp, TrendingDown, Star, MapPin, DollarSign, Users, X, AlertCircle, CheckCircle, Zap } from 'lucide-react';
import SectionHeader from '../components/common/SectionHeader';
import DataFreshnessBar from '../components/common/DataFreshnessBar';
import { BRANDS, BRAND_COLORS } from '../constants/brands';
import { COMPETITOR_SCORES, RADAR_AXES } from '../data/competitorData';
import { MENU_ITEMS } from '../data/menuData';
import { getScoreColor } from '../utils/formatters';
import useCompetitorData from '../hooks/useCompetitorData';
import clsx from 'clsx';

// Türkiye'ye giriş yılları (CAGR hesabı için)
const FOUNDING_YEARS = {
  espressolab: 2014, starbucks: 2003, kahvedunyasi: 2000,
  gloriajeans: 2002, sencay: 2010, arabica: 2015,
  coffy: 2018, gua: 2016, luuq: 2023, caffenero: 2015,
  laos: 2017, brewmood: 2016, coffeemania: 2008,
  mikel: 2018, tchibo: 2006, caribou: 2022,
  nevada: 2012, kronotrop: 2011, coffee1401: 2019, costacoffee: 2024,
};

// Marka başına menüdeki dolu ürün sayısı (yenilik skoru için)
const MENU_COUNTS = (() => {
  const counts = {};
  MENU_ITEMS.forEach(item => {
    Object.entries(item.prices).forEach(([brandId, price]) => {
      if (price != null) counts[brandId] = (counts[brandId] || 0) + 1;
    });
  });
  return counts;
})();
const MAX_MENU = Math.max(...Object.values(MENU_COUNTS));

// Tüm markalar için maksimum reviewCount (sosyal skor normalizasyonu)
const MAX_REVIEWS_LOG = Math.log10(340000); // Starbucks ~337K

// ─── Her marka için Google puan analizi ────────────────────────────────────────
const RATING_INSIGHTS = {
  espressolab: {
    summary: 'Sektörün üst diliminde, specialty odaklı konumlanma puanı yukarı taşıyor.',
    guclu: ['Barista eğitimi ve kahve kalitesi öne çıkıyor', 'Specialty konsept sadık müşteri kitlesi oluşturuyor', 'Mekan tasarımı ve ambiyans güçlü'],
    zayif: ['Şube sayısı artışıyla birlikte kalite tutarsızlığı riski', 'Bazı şubelerde bekleme süresi şikayetleri'],
    aksiyon: 'Yeni açılan şubelerde kalite standartlarını korumak kritik. Merkezi barista sertifikasyon programı hayata geçirilmeli.',
  },
  starbucks: {
    summary: 'Yüksek fiyata karşın ortalama puan — beklenti-deneyim uçurumu oluşmuş.',
    guclu: ['Güçlü sadakat programı (Stars)', 'Tutarlı ürün standardı', 'Geniş şube ağı ve konum kalitesi'],
    zayif: ['Yüksek fiyat-düşük kalite algısı yaygın', 'Kalabalık şubelerde gürültü ve bekleme şikayetleri', 'Yerel damak zevkine adaptasyon yetersiz'],
    aksiyon: 'Starbucks\'ın fiyat-değer açığını fırsata çevir. Aynı fiyat bandında daha kaliteli kahve + samimi hizmet kombinasyonu güçlü rekabet avantajı yaratır.',
  },
  kahvedunyasi: {
    summary: 'En düşük puan — hızlı büyüme kalite kontrolünü bozmuş, franchise tutarsızlığı belirgin.',
    guclu: ['Erişilebilir fiyatlar geniş kitleye hitap ediyor', 'Güçlü marka tanınırlığı', 'Türk kahvesi ve lokum gibi yerel ürünler fark yaratıyor'],
    zayif: ['Franchise şubelerinde ciddi hizmet kalitesi tutarsızlığı', 'Uzun bekleme süreleri ve personel şikayetleri', 'Espresso kalitesi düşük yorumları dikkat çekici'],
    aksiyon: 'KD\'nin en zayıf olduğu nokta hizmet kalitesi. Profesyonel barista servisi ve temiz ortam vurgusunu iletişimde öne çıkar — doğrudan karşılaştırma fırsatı.',
  },
  gloriajeans: {
    summary: 'Franchise standardizasyonu tutarlı puan getiriyor ama mekan yenileme ihtiyacı var.',
    guclu: ['Lezzet tutarlılığı franchise genelinde iyi', 'AVM konumları trafik sağlıyor', 'Soğuk içecek çeşitliliği güçlü'],
    zayif: ['Eski şubelerde dekor yorgunluğu ve bakımsızlık şikayetleri', 'Yoğun saatlerde servis kalitesi düşüyor', 'Yenilikçi ürün lansmanları yetersiz'],
    aksiyon: 'Gloria Jean\'s\'in AVM odaklı konumlanması cadde lokasyonlarında boşluk bırakıyor. Modern tasarımlı cadde şubeleriyle bu kitleyi yakala.',
  },
  sencay: {
    summary: 'Fiyat-değer oranı mükemmel — bütçe segmentinde müşteri memnuniyeti yüksek.',
    guclu: ['Çok uygun fiyat, yüksek algılanan değer', 'Samimi hizmet anlayışı', 'Hızlı servis süresi'],
    zayif: ['Specialty kahve çeşidi yok', 'Premium lokasyon ve ambiyans eksik', 'Sadakat programı bulunmuyor'],
    aksiyon: 'Şen Çay müşterileri bütçe bilinçli ama kalite arayan kitle. Orta segment fiyatla üst segment deneyim sunan kampanyalarla bu kitleyi dönüştürme potansiyeli var.',
  },
  arabica: {
    summary: 'Specialty segmentinde güçlü puan — single origin ve barista uzmanlığı öne çıkıyor.',
    guclu: ['Single origin kahve seçimi etkileyici', 'Barista bilgi düzeyi yüksek', 'Kahve kültürü odaklı mekan konsepti'],
    zayif: ['Fiyat oldukça yüksek, geniş kitleye ulaşmayı engelliyor', 'Şube sayısı sınırlı, erişilebilirlik düşük', 'Hizmet hızı zaman zaman yavaş'],
    aksiyon: 'Arabica ile doğrudan specialty segmentte rekabet ediyorsunuz. Şube ağı avantajını ve daha erişilebilir fiyatı ön plana çıkar — aynı kalite, daha geniş ulaşım.',
  },
  coffy: {
    summary: 'Sektörde en yüksek büyüme + iyi puan — bütçe segmentinde ciddi tehdit.',
    guclu: ['Fiyat-kalite dengesi rakipsiz bütçe segmentinde', 'Hızlı servis, pratik konsept', 'Genç müşteri kitlesine güçlü hitap'],
    zayif: ['Premium kahve imajı yok', 'Specialty ürün çeşitliliği sınırlı', 'Mekan kalitesi değişken'],
    aksiyon: 'Coffy\'nin %72 büyüme hızı görmezden gelinemez. Orta ve üst segment için fiyat-kalite farkını net mesajlaştır. Coffy müşterisinin "bir üst basamağı" olmak için konumlanma fırsatı güçlü.',
  },
  gua: {
    summary: 'Küçük ama yüksek sadakat yaratan butik konsept — Instagram ve keşif odaklı kitle.',
    guclu: ['Özgün mekan tasarımı sosyal medyada viral oluyor', 'Yüksek müşteri sadakati', 'Kahve kalitesi tutarlı ve yüksek'],
    zayif: ['Şube sayısı çok sınırlı, ölçeklenme yok', 'Bilinirlik dar çevreyle sınırlı', 'Reklam ve pazarlama neredeyse yok'],
    aksiyon: 'GUA\'nın sosyal medya organik büyüme modeli ilham verici. Mekan fotoğraflanabilirliği ve deneyim tasarımına yatırım yaparak benzer viral etkiyi hedefle.',
  },
  luuq: {
    summary: 'En düşük puanlardan biri — hızlı büyüme kalite kontrolünü zorluyor.',
    guclu: ['Genç, modern marka kimliği', 'Uygun fiyat politikası', 'Sosyal medya görünürlüğü iyi'],
    zayif: ['Hizmet tutarsızlığı yoğun şikayet konusu', 'Kahve kalitesi beklentilerin altında', 'Hızlı büyümede eğitim altyapısı yetersiz kaldı'],
    aksiyon: 'LUUQ\'un düşük puanı, aynı yaş ve fiyat segmentinde güvenilir alternatif olduğunu öne çıkarma fırsatı. "Kaliteden ödün vermeden büyüme" mesajı güçlü.',
  },
  caffenero: {
    summary: 'Uluslararası standart tutarlılık sağlıyor ama yerel adaptasyon eksik.',
    guclu: ['Avrupa kahvecisi deneyimi ve tutarlılık', 'Mekan konforu ve çalışma ortamı', 'Yüksek kalite espresso bazı'],
    zayif: ['Türk damak zevkine uyum sınırlı', 'Fiyat yüksek ama yerel marka hissi yok', 'Yetersiz yerel ürün geliştirme'],
    aksiyon: 'Caffè Nero Türkiye\'de "yabancı" kalmaya devam ediyor. Yerel ürünler ve kültürel bağ kurarak bu boşluğu doldurabilirsin — "Türkiye\'nin kendi Caffè Nero\'su" konumlaması.',
  },
  laos: {
    summary: 'Butik modelin en başarılı örneklerinden biri — az şube ama yüksek sadakat.',
    guclu: ['Özgün mekan konsepti ve ambiyans', 'Kahve odaklı menü, dikkat dağıtmıyor', 'Yüksek müşteri sadakati ve tekrar ziyaret oranı'],
    zayif: ['Büyüme çok yavaş', 'Bilinirlik çok düşük', 'AVM ve cadde dışı konumlar erişimi kısıtlıyor'],
    aksiyon: 'Laos\'un "az ama öz" modelinden müşteri sadakati dersleri alınabilir. Sadakat programı ve tekrar ziyaret teşviklerini güçlendir.',
  },
  brewmood: {
    summary: 'Ambiyans güçlü ama sezonluk trafiğe bağımlılık puanı ortalamada tutuyor.',
    guclu: ['Mekan tasarımı ve ambiyans güçlü', 'Konum seçimi genellikle iyi', 'Kahve çeşitliliği yeterlı'],
    zayif: ['Turizm bölgesi ağırlıklı, düşük sezonda trafik eridiyor', 'Servis hızı yoğun dönemde düşüyor', 'Sadakat programı yetersiz'],
    aksiyon: 'Brewmood\'un sezonluk zayıflığına karşın yıl boyu trafik yaratan lokasyon stratejisi kritik avantaj. Ofis ve üniversite bölgeleri hedeflenmeli.',
  },
  coffeemania: {
    summary: 'Geniş menü odak eksikliği yaratıyor — kahve kimliği net değil.',
    guclu: ['Çok geniş menü farklı kitlelere hitap ediyor', 'Oturma kapasitesi yüksek', 'Uzun çalışma saatleri avantaj'],
    zayif: ['Kahve odaklı kimlik yok, restoran mı cafe mi belirsiz', 'Kahve kalitesi ikinci plana düşüyor', 'Marka mesajı dağınık'],
    aksiyon: 'Coffeemania\'nın kimlik karmaşası net kahve markalarına fırsat veriyor. "Sadece kahve yapıyoruz ve en iyisini yapıyoruz" mesajı bu segmentte güçlü.',
  },
  mikel: {
    summary: 'Yunan zinciri iyi kahve-fiyat dengesiyle istikrarlı puan alıyor.',
    guclu: ['Fiyat-kalite dengesi iyi', 'Tutarlı espresso standardı', 'Temiz ve modern mekanlar'],
    zayif: ['Türkiye\'de marka bilinirliği düşük', 'Yerel pazarlama yatırımı yetersiz', 'Farklılaştırıcı ürün yok'],
    aksiyon: 'Mikel sessizce büyüyor — bilinirlik yatırımına başladığında ciddi rakip olabilir. Şimdiden marka bağlılığı oluşturmak öncelik olmalı.',
  },
  tchibo: {
    summary: 'Hibrit perakende+cafe modeli güven veriyor — ev kahvesi markası olarak gelen müşteri memnun ayrılıyor.',
    guclu: ['Perakende ürünlerle cafe deneyiminin birleşimi', 'Güçlü marka güveni ve tanınırlığı', 'Ev ve ofis müşterisi kazanım potansiyeli'],
    zayif: ['Cafe deneyimi çoğu zaman ikincil planda kalıyor', 'Specialty kahve imajı yok', 'Ambiyans kahve odaklı değil'],
    aksiyon: 'Tchibo\'nun perakende-cafe köprüsü ilginç model. Kahve çekirdek satışını cafe ziyaretiyle birleştirmek müşteri yaşam boyu değerini artırır.',
  },
  caribou: {
    summary: 'Güçlü uluslararası marka imajı ama Türkiye\'de henüz az şubeyle tanınırlık sınırlı.',
    guclu: ['ABD premium kahve kültürü deneyimi', 'Güçlü menü çeşitliliği', 'Yüksek mekan konforu'],
    zayif: ['Türkiye\'de çok az şube, yerel müşteri henüz alışmadı', 'Pazarlama yatırımı sınırlı', 'Bilinirlik düşük'],
    aksiyon: 'Caribou henüz küçük ama büyüme planları var. Onlar büyümeden önce premium segmentteki pazar payını pekiştirmek kritik.',
  },
  nevada: {
    summary: 'Geniş şube ağına rağmen ortalama puan — ölçek kalite kontrolünü zorluyor.',
    guclu: ['Geniş şube ağı erişilebilirlik sağlıyor', 'Uygun fiyat politikası', 'Hızlı büyüme temposu'],
    zayif: ['Kalite tutarsızlığı ciddi şikayet kaynağı', 'Marka güvenilirliği sorgulanıyor', 'Franchise kalite denetimi yetersiz'],
    aksiyon: 'Nevada\'nın tutarsız kalitesi orta-üst segmentte büyük fırsat. Nevada müşterisinin "bir üst seçeneği" olmak için fiyat-kalite mesajı net verilmeli.',
  },
  kronotrop: {
    summary: 'Türkiye specialty kahve öncüsü ama yüksek fiyat ve eski konsept puanı aşağı çekiyor.',
    guclu: ['Specialty kahve kültürünü Türkiye\'ye tanıtan marka', 'Güçlü kahve uzmanlığı ve çekirdek seçimi', 'Sadık specialty müşteri kitlesi'],
    zayif: ['Fiyat artık çok yüksek, değer algısı zayıfladı', 'Bazı eski şubelerde dekor yorgunluğu', 'Yeni nesil specialty markaların gerisinde kalıyor'],
    aksiyon: 'Kronotrop\'un bıraktığı specialty liderlik boşluğunu doldur. Aynı uzmanlık düzeyinde daha modern mekan ve daha iyi fiyat-değer dengesiyle öne geç.',
  },
  coffee1401: {
    summary: 'Az şube ama yüksek kalite standardı — büyüyemeyen gizli kalite şampiyonu.',
    guclu: ['Kahve kalitesi çok yüksek ve tutarlı', 'Barista uzmanlığı öne çıkıyor', 'Özgün ve samimi konsept'],
    zayif: ['Ölçeklenme başarılamamış, şube sayısı çok az', 'Pazarlama neredeyse yok, bilinirlik sınırlı', 'Yatırım eksikliği büyümeyi engelliyor'],
    aksiyon: 'Coffee 1401 "kaliteyi ölçeklendiremeyen" örneği. En büyük fırsat tam da bu — kaliteyi korurken hızlı ve doğru büyümek.',
  },
  costacoffee: {
    summary: 'Küresel #1 ama Türkiye\'de neredeyse yok — yerel varlık çok sınırlı.',
    guclu: ['Dünyanın en büyük kahve zinciri güveni', 'Uluslararası standart ve tutarlılık', 'Güçlü kurumsal kahve programları'],
    zayif: ['Türkiye\'de sadece 10 şube, erişim çok kısıtlı', 'Yerel marka bilinirliği yok denecek kadar az', 'Pazarlama yatırımı Türkiye\'de minimal'],
    aksiyon: 'Costa Coffee Türkiye\'de büyümeden önce pazar payını sağlamlaştır. Küresel rakip henüz uyanmadan marka bağlılığını güçlendir.',
  },
};

// ─── Rating Modal ──────────────────────────────────────────────────────────────
function RatingModal({ brand, rating, reviewCount, onClose }) {
  const insight = RATING_INSIGHTS[brand?.id];
  const color = brand?.color || '#C4922A';

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!insight || !brand) return null;

  const stars = Math.round(rating * 2) / 2;
  const ratingColor = rating >= 4.3 ? '#22c55e' : rating >= 4.0 ? '#f59e0b' : '#ef4444';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden"
        style={{ backgroundColor: '#0F1C2E', border: `1px solid ${color}40` }}
        onClick={e => e.stopPropagation()}
      >
        {/* Üst şerit */}
        <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />

        {/* Header */}
        <div className="flex items-start justify-between p-5 pb-3">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold text-white"
              style={{ backgroundColor: color }}
            >
              {brand.shortName}
            </div>
            <div>
              <p className="text-white font-bold text-base">{brand.name}</p>
              <p className="text-xs text-muted">Google Maps Puan Analizi</p>
            </div>
          </div>
          <button onClick={onClose} className="text-muted hover:text-white transition-colors p-1">
            <X size={18} />
          </button>
        </div>

        {/* Puan göstergesi */}
        <div className="mx-5 mb-4 rounded-xl p-4 flex items-center gap-4" style={{ backgroundColor: `${color}10`, border: `1px solid ${color}20` }}>
          <div className="text-center">
            <div className="text-4xl font-black" style={{ color: ratingColor }}>{rating}</div>
            <div className="text-xs text-muted mt-0.5">/ 5.0</div>
          </div>
          <div className="flex-1">
            <div className="flex gap-0.5 mb-1">
              {[1,2,3,4,5].map(i => (
                <Star
                  key={i}
                  size={16}
                  fill={i <= Math.floor(stars) ? ratingColor : i - 0.5 === stars ? ratingColor : 'none'}
                  stroke={ratingColor}
                  strokeWidth={1.5}
                  opacity={i <= Math.ceil(stars) ? 1 : 0.3}
                />
              ))}
            </div>
            {reviewCount && (
              <p className="text-xs text-muted">{reviewCount.toLocaleString('tr-TR')} Google yorumu</p>
            )}
            <p className="text-xs mt-1.5 leading-relaxed" style={{ color: ratingColor === '#22c55e' ? '#86efac' : ratingColor === '#f59e0b' ? '#fde68a' : '#fca5a5' }}>
              {insight.summary}
            </p>
          </div>
        </div>

        {/* Güçlü yönler */}
        <div className="px-5 mb-3">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle size={14} className="text-success" />
            <span className="text-xs font-semibold text-success">Yüksek Puan Nedenleri</span>
          </div>
          <ul className="space-y-1">
            {insight.guclu.map((item, i) => (
              <li key={i} className="text-xs text-muted flex items-start gap-2">
                <span className="text-success mt-0.5 flex-shrink-0">›</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Zayıf yönler */}
        <div className="px-5 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle size={14} className="text-danger" />
            <span className="text-xs font-semibold text-danger">Düşüren Faktörler</span>
          </div>
          <ul className="space-y-1">
            {insight.zayif.map((item, i) => (
              <li key={i} className="text-xs text-muted flex items-start gap-2">
                <span className="text-danger mt-0.5 flex-shrink-0">›</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Espressolab aksiyon */}
        <div className="mx-5 mb-5 rounded-xl p-3" style={{ backgroundColor: '#C4922A15', border: '1px solid #C4922A30' }}>
          <div className="flex items-center gap-2 mb-1.5">
            <Zap size={13} className="text-caramel" />
            <span className="text-xs font-bold text-caramel">Rekabet Aksiyonu</span>
          </div>
          <p className="text-xs text-white/80 leading-relaxed">{insight.aksiyon}</p>
        </div>
      </div>
    </div>
  );
}

const COMPETITOR_SOURCES = [
  { label: 'Gıda Bülteni' },
  { label: 'Aydınlık' },
  { label: 'WCP' },
  { label: 'Ritapos' },
  { label: 'Resmi Siteler' },
];

const CustomTooltipRadar = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface border border-navy-border rounded-lg px-3 py-2 shadow-xl">
        {payload.map((p, i) => (
          <p key={i} className="text-xs" style={{ color: p.color }}>
            {p.name}: <strong>{p.value}</strong>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const ScoreRing = ({ score, color, size = 56 }) => {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#2A3A55" strokeWidth={4} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth={4}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
      />
    </svg>
  );
};

export default function CompetitorAnalysis() {
  const [selectedBrands, setSelectedBrands] = useState(['espressolab', 'starbucks', 'kahvedunyasi', 'kronotrop']);
  const [sortBy, setSortBy] = useState('overallScore');
  const [sortDir, setSortDir] = useState('desc');
  const [ratingModal, setRatingModal] = useState(null); // { brand, rating, reviewCount }

  const { data: liveData, refetch: refetchCompetitors } = useCompetitorData();

  // Canlı API verisiyle tüm skorları gerçek veriden türet
  const scores = useMemo(() => {
    const merged = {};

    BRANDS.forEach(brand => {
      const id = brand.id;
      const base = COMPETITOR_SCORES[id] || {};
      const live = liveData?.find(d => d.brandId === id);

      const rating       = live?.googleRating ?? base.googleRating ?? 4.0;
      const reviewCount  = live?.reviewCount  ?? 0;
      const branches     = live?.branches     ?? base.branches ?? 1;
      const avgPrice     = live?.avgPrice     ?? base.avgPrice;

      // ── Kalite: Google rating → 0-100 ────────────────────────────
      const qualityScore = Math.round(rating * 20);

      // ── Sosyal / Dijital Varlık: log-normalized reviewCount ───────
      const socialScore     = reviewCount > 0
        ? Math.min(Math.round(Math.log10(reviewCount) / MAX_REVIEWS_LOG * 100), 100)
        : base.socialScore ?? 40;
      const digitalPresence = socialScore;
      const brandAwareness  = reviewCount > 0
        ? Math.min(Math.round((Math.log10(reviewCount) / MAX_REVIEWS_LOG) * 110), 100)
        : base.brandAwareness ?? 40;

      // ── Müşteri Sadakati: yorum/şube (şube başına bağlılık) ───────
      const reviewsPerBranch = reviewCount / Math.max(branches, 1);
      const customerLoyalty  = reviewCount > 0
        ? Math.min(Math.round(reviewsPerBranch / 500 * 100), 100)
        : base.customerLoyalty ?? 50;

      // ── Yenilik / Menü Çeşitliliği: menuData'dan gerçek ürün sayısı
      const menuCount      = MENU_COUNTS[id] || 0;
      const innovationScore = Math.round(menuCount / MAX_MENU * 100);
      const menuVariety     = innovationScore;

      // ── NPS: (rating - 3) × 50  →  3.8→+40, 4.0→+50, 4.5→+75 ───
      const nps = Math.round((rating - 3) * 50);

      // ── Büyüme: CAGR (kuruluştan bugüne, başlangıç=1 şube) ───────
      const founded     = FOUNDING_YEARS[id] ?? 2015;
      const yearsActive = Math.max(2026 - founded, 1);
      const cagr        = Math.min(
        Math.round((Math.pow(Math.max(branches, 1), 1 / yearsActive) - 1) * 100),
        150
      );

      // ── Sürdürülebilirlik: kalite + sadakat dengesi ───────────────
      const sustainability = Math.round((qualityScore + customerLoyalty) / 2);

      // ── Genel Skor (ağırlıklı) ────────────────────────────────────
      const npsNorm    = (nps + 100) / 2;           // -100..+100 → 0..100
      const cagrNorm   = Math.min(cagr / 1.5, 100); // 150%cap → 100 puan
      const overallScore = Math.round(
        qualityScore   * 0.28 +
        socialScore    * 0.18 +
        innovationScore * 0.14 +
        npsNorm         * 0.14 +
        customerLoyalty * 0.12 +
        cagrNorm        * 0.08 +
        sustainability  * 0.06
      );

      merged[id] = {
        ...base,
        googleRating: rating,
        branches,
        avgPrice,
        qualityScore,
        socialScore,
        digitalPresence,
        brandAwareness,
        customerLoyalty,
        innovationScore,
        menuVariety,
        nps,
        sustainability,
        growth: cagr,
        overallScore,
      };
    });

    return merged;
  }, [liveData]);

  const toggleBrand = (id) => {
    setSelectedBrands(prev =>
      prev.includes(id)
        ? prev.length > 1 ? prev.filter(b => b !== id) : prev
        : prev.length >= 5 ? prev : [...prev, id]
    );
  };

  const handleSort = (key) => {
    if (sortBy === key) setSortDir(d => d === 'desc' ? 'asc' : 'desc');
    else { setSortBy(key); setSortDir('desc'); }
  };

  const sortedBrands = [...BRANDS].sort((a, b) => {
    if (a.id === 'gloriajeans') return -1;
    if (b.id === 'gloriajeans') return 1;
    const aVal = scores[a.id]?.[sortBy] ?? 0;
    const bVal = scores[b.id]?.[sortBy] ?? 0;
    return sortDir === 'desc' ? bVal - aVal : aVal - bVal;
  });

  const radarData = RADAR_AXES.map(axis => {
    const point = { subject: axis.label };
    selectedBrands.forEach(id => {
      point[id] = scores[id]?.[axis.key] ?? 0;
    });
    return point;
  });

  const barData = BRANDS.map(b => ({
    name: b.shortName,
    fullName: b.name,
    score: scores[b.id]?.overallScore || 0,
    id: b.id,
  }));

  const SortBtn = ({ label, field }) => (
    <button
      onClick={() => handleSort(field)}
      className={clsx(
        'text-xs px-2 py-1 rounded transition-colors',
        sortBy === field ? 'bg-caramel/20 text-caramel' : 'text-muted hover:text-white'
      )}
    >
      {label} {sortBy === field && (sortDir === 'desc' ? '↓' : '↑')}
    </button>
  );

  // reviewCount'u live data'dan bul
  const getReviewCount = (brandId) =>
    liveData?.find(d => d.brandId === brandId)?.reviewCount ?? null;

  return (
    <div className="space-y-6 animate-fade-in">
      {ratingModal && (
        <RatingModal
          brand={ratingModal.brand}
          rating={ratingModal.rating}
          reviewCount={ratingModal.reviewCount}
          onClose={() => setRatingModal(null)}
        />
      )}
      <SectionHeader
        title="Rakip Analizi"
        subtitle="Türkiye kahve sektöründe 20 markanın kapsamlı karşılaştırması — Haziran 2026"
      />
      <DataFreshnessBar sources={COMPETITOR_SOURCES} interval={300_000} onRefresh={refetchCompetitors} />

      {/* Brand selector */}
      <div className="card">
        <p className="text-xs text-muted mb-3 font-medium">Radar Grafiği İçin Marka Seç (maks. 5):</p>
        <div className="flex flex-wrap gap-2">
          {BRANDS.map(brand => (
            <button
              key={brand.id}
              onClick={() => toggleBrand(brand.id)}
              className={clsx(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all',
                selectedBrands.includes(brand.id)
                  ? 'text-white border'
                  : 'bg-surface2 text-muted hover:text-white border border-transparent'
              )}
              style={selectedBrands.includes(brand.id) ? {
                backgroundColor: `${brand.color}20`,
                borderColor: brand.color,
                color: brand.color,
              } : {}}
            >
              <span
                className="h-2 w-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: brand.color }}
              />
              {brand.name}
            </button>
          ))}
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* Radar */}
        <div className="card">
          <h3 className="text-base font-semibold text-white mb-4">Çok Boyutlu Performans Analizi</h3>
          <ResponsiveContainer width="100%" height={360}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#2A3A55" />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fill: '#8B9BB4', fontSize: 11 }}
              />
              {selectedBrands.map(id => {
                const brand = BRANDS.find(b => b.id === id);
                return (
                  <Radar
                    key={id}
                    name={brand?.name || id}
                    dataKey={id}
                    stroke={brand?.color || '#C4922A'}
                    fill={brand?.color || '#C4922A'}
                    fillOpacity={id === 'espressolab' ? 0.25 : 0.08}
                    strokeWidth={id === 'espressolab' ? 2.5 : 1.5}
                  />
                );
              })}
              <Tooltip content={<CustomTooltipRadar />} />
              <Legend
                formatter={(val) => <span style={{ color: '#8B9BB4', fontSize: 11 }}>{val}</span>}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Bar chart */}
        <div className="card">
          <h3 className="text-base font-semibold text-white mb-4">Genel Performans Skoru Sıralaması</h3>
          <ResponsiveContainer width="100%" height={360}>
            <BarChart data={barData} layout="vertical" margin={{ left: 10, right: 30 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A3A55" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} tick={{ fill: '#8B9BB4', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fill: '#8B9BB4', fontSize: 11 }} axisLine={false} tickLine={false} width={35} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload?.length) {
                    const d = payload[0].payload;
                    return (
                      <div className="bg-surface border border-navy-border rounded-lg px-3 py-2">
                        <p className="text-sm font-semibold text-white">{d.fullName}</p>
                        <p className="text-xs text-caramel font-bold">Skor: {d.score}/100</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="score" radius={[0, 6, 6, 0]}>
                {barData.map(entry => (
                  <Cell
                    key={entry.id}
                    fill={BRAND_COLORS[entry.id] || '#8B9BB4'}
                    opacity={entry.id === 'espressolab' ? 1 : 0.75}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Competitor Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold text-white">Tüm Markalar Detay Kartları</h3>
          <div className="flex items-center gap-1 text-xs text-muted">
            Sırala:
            <SortBtn label="Skor" field="overallScore" />
            <SortBtn label="Büyüme" field="growth" />
            <SortBtn label="Fiyat" field="avgPrice" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {sortedBrands.map(brand => {
            const s = scores[brand.id];
            if (!s) return null;
            return (
              <div
                key={brand.id}
                className={clsx(
                  'card-hover relative overflow-hidden',
                  brand.isOwn && 'border-caramel/40 border-glow'
                )}
              >
                {brand.isOwn && (
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-caramel to-transparent" />
                )}
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold text-white shadow-lg"
                      style={{ backgroundColor: brand.color }}
                    >
                      {brand.shortName}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={clsx('text-sm font-bold', brand.isOwn ? 'text-caramel' : 'text-white')}>
                          {brand.name}
                        </span>
                      </div>
                      <div className="text-xs text-muted">{brand.country} · {brand.type === 'specialty' ? 'Specialty' : brand.type === 'premium' ? 'Premium' : 'Orta Segment'}</div>
                    </div>
                  </div>
                  {/* Score ring */}
                  <div className="relative flex-shrink-0">
                    <ScoreRing score={s.overallScore} color={brand.color} size={52} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-bold text-white">{s.overallScore}</span>
                    </div>
                  </div>
                </div>

                {/* Metrics grid */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                  {[
                    { icon: MapPin, label: 'Şube', value: s.branches.toLocaleString('tr-TR'), unit: '', clickable: false },
                    { icon: DollarSign, label: 'Ort. Fiyat', value: s.avgPrice, unit: '₺', clickable: false },
                    { icon: Star, label: 'Google', value: s.googleRating, unit: '⭐', clickable: true },
                    { icon: Users, label: 'NPS', value: s.nps, unit: '', clickable: false },
                  ].map(m => (
                    <div
                      key={m.label}
                      className={clsx('bg-surface2/50 rounded-lg p-2', m.clickable && 'cursor-pointer hover:bg-yellow-400/10 transition-colors group')}
                      onClick={m.clickable ? () => setRatingModal({ brand, rating: s.googleRating, reviewCount: getReviewCount(brand.id) }) : undefined}
                      title={m.clickable ? 'Puan analizini gör' : undefined}
                    >
                      <div className="text-[10px] text-muted flex items-center gap-1">
                        {m.label}
                        {m.clickable && <span className="text-[8px] text-muted group-hover:text-yellow-300">▸</span>}
                      </div>
                      <div className="text-sm font-bold text-white">
                        {m.unit === '₺' && '₺'}{m.value}{m.unit !== '₺' && m.unit}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Progress bars */}
                <div className="space-y-2">
                  {[
                    { label: 'Kalite (Google)', value: s.qualityScore },
                    { label: 'Sosyal Varlık',   value: s.socialScore },
                    { label: 'Menü Yeniliği',   value: s.innovationScore },
                  ].map(m => (
                    <div key={m.label}>
                      <div className="flex justify-between text-[10px] mb-0.5">
                        <span className="text-muted">{m.label}</span>
                        <span className="text-white font-medium">{m.value}</span>
                      </div>
                      <div className="h-1.5 bg-navy-border rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${m.value}%`, backgroundColor: brand.color, opacity: 0.85 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end mt-3 pt-3 border-t border-navy-border">
                  <div className={clsx(
                    'flex items-center gap-1 text-xs font-bold',
                    s.growth > 0 ? 'text-success' : 'text-danger'
                  )}>
                    {s.growth > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {s.growth > 0 ? '+' : ''}{s.growth}% yıllık büyüme
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Data source disclaimer */}
      <div className="flex items-start gap-3 bg-warning/5 border border-warning/20 rounded-xl p-4">
        <span className="text-xl flex-shrink-0">📌</span>
        <div className="text-xs text-muted leading-relaxed space-y-1">
          <p className="text-white font-semibold">Veri Kaynakları ve Doğruluk Notu</p>
          <p>
            <strong className="text-success">Starbucks:</strong> 722 şube — verikaynagi.com / euronews.tr (2024) |{' '}
            <strong className="text-caramel">Espressolab:</strong> ~270 TR + 338 global — perakende.org / foodinlife.com (Oca 2025) |{' '}
            <strong className="text-red-400">Kahve Dünyası:</strong> ~320 şube, 2025 hedef 500 — ekonomim.com |{' '}
            <strong className="text-orange-400">Gloria Jean's:</strong> 214 şube — gloriajeans.com.tr (Haziran 2026)
          </p>
          <p>
            <strong className="text-amber-400">Coffy:</strong> 153 şube (2023'te 89 → %72 büyüme!) — ekonomim.com |{' '}
            <strong className="text-danger">Costa Coffee:</strong> ⚠️ Türkiye'de YALNIZCA ~11 şube — avmdergi.com (Küresel #1 ama TR'de yeni) |{' '}
            <strong className="text-cyan-400">Nevada:</strong> ~40 şube — ntv.com.tr (Nevco Holding 38M$ yatırım)
          </p>
        </div>
      </div>

      {/* Full Comparison Table */}
      <div className="card">
        <h3 className="text-base font-semibold text-white mb-4">Tam Karşılaştırma Tablosu</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-navy-border">
                {[
                  { label: 'Marka',      tip: null },
                  { label: 'Şube',       tip: null },
                  { label: 'Ort. Fiyat', tip: null },
                  { label: 'Google ⭐',  tip: 'Google Maps ağırlıklı ortalama puan' },
                  { label: 'NPS',        tip: 'Google puanından türetildi: (rating−3)×50' },
                  { label: 'Kalite',     tip: 'Google rating × 20 → 0-100' },
                  { label: 'Sosyal',     tip: 'Google yorum hacminin log-normalize değeri' },
                  { label: 'Yenilik',    tip: 'Menüdeki dolu ürün sayısına göre hesaplandı' },
                  { label: 'Sadakat',    tip: 'Şube başına yorum sayısı (bağlılık derinliği)' },
                  { label: 'Skor',       tip: 'Tüm metriklerin ağırlıklı genel skoru' },
                  { label: 'CAGR',       tip: 'Türkiye\'ye girişten bugüne bileşik yıllık büyüme oranı' },
                ].map(h => (
                  <th key={h.label} className="table-header py-3 px-3 text-left whitespace-nowrap" title={h.tip ?? undefined}>{h.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedBrands.map(brand => {
                const s = scores[brand.id];
                if (!s) return null;
                return (
                  <tr key={brand.id} className={clsx('table-row', brand.isOwn && 'bg-caramel/5')}>
                    <td className="table-cell">
                      <div className="flex items-center gap-2">
                        <span
                          className="h-2.5 w-2.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: brand.color }}
                        />
                        <span className={clsx('font-semibold', brand.isOwn ? 'text-caramel' : 'text-white')}>
                          {brand.name}
                        </span>
                      </div>
                    </td>
                    <td className="table-cell text-white">{s.branches}</td>
                    <td className="table-cell text-white">₺{s.avgPrice}</td>
                    <td className="table-cell">
                      <button
                        onClick={() => setRatingModal({ brand, rating: s.googleRating, reviewCount: getReviewCount(brand.id) })}
                        className="flex items-center gap-1 text-white hover:text-yellow-300 transition-colors group"
                        title="Puan analizini gör"
                      >
                        ⭐ {s.googleRating}
                        <span className="text-[9px] text-muted group-hover:text-yellow-300/70 ml-0.5">▸</span>
                      </button>
                    </td>
                    <td className="table-cell text-white">{s.nps}</td>
                    <td className="table-cell">
                      <span className={clsx('font-semibold', getScoreColor(s.qualityScore))}>{s.qualityScore}</span>
                    </td>
                    <td className="table-cell">
                      <span className={clsx('font-semibold', getScoreColor(s.socialScore))}>{s.socialScore}</span>
                    </td>
                    <td className="table-cell">
                      <span className={clsx('font-semibold', getScoreColor(s.innovationScore))}>{s.innovationScore}</span>
                    </td>
                    <td className="table-cell">
                      <span className={clsx('font-semibold', getScoreColor(s.customerLoyalty))}>{s.customerLoyalty}</span>
                    </td>
                    <td className="table-cell">
                      <span className={clsx('font-bold text-base', getScoreColor(s.overallScore))}>{s.overallScore}</span>
                    </td>
                    <td className={clsx('table-cell font-bold', s.growth > 0 ? 'text-success' : s.growth < 0 ? 'text-danger' : 'text-muted')}>
                      {s.growth > 0 ? '+' : ''}{s.growth}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
