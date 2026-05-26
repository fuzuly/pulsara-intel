// NewsData.io — Sadece kahve sektörü haberleri
// CORS destekli: tarayıcıdan doğrudan çalışır
import { useState, useEffect, useCallback } from 'react';
import { NEWSDATA_API_KEY, NEWSDATA_BASE_URL, COFFEE_NEWS_QUERY } from '../config/apiConfig';

// ─── Kahve alaka filtresi ──────────────────────────────────────────────────────
// Kural: "coffee" veya "kahve" GEÇMELİ
// VEYA kesin kahve markası adı (tırnak içinde, yanında coffee/kahve ile)
const CORE_COFFEE_TERMS = [
  'coffee', 'kahve', 'espresso', 'latte', 'cappuccino', 'barista', 'café',
  'cold brew', 'frappuccino', 'americano', 'macchiato', 'caffeine',
];

// Bu markalar tek başına yeterli — başka terim gerekmez
const UNAMBIGUOUS_BRANDS = [
  'espressolab', 'kronotrop', 'coffy coffee', 'mikel coffee',
  'kahve dünyası', 'kahve dunyasi', 'nevada coffee', 'caffe nero',
  'costa coffee', 'brewmood', 'gua coffee', 'luuq coffee', 'laos coffee',
  'kahve zinciri', 'coffee chain', 'coffee shop',
];

function isCoffeeRelated(text) {
  const lower = text.toLowerCase();
  // "coffee" veya "kahve" kelimesi geçiyor mu?
  if (CORE_COFFEE_TERMS.some(t => lower.includes(t))) return true;
  // Kesin marka adı geçiyor mu?
  if (UNAMBIGUOUS_BRANDS.some(t => lower.includes(t))) return true;
  return false;
}

// ─── Marka tespiti ─────────────────────────────────────────────────────────────
const BRAND_KEYWORDS = {
  espressolab:  ['espressolab', 'espresso lab'],
  starbucks:    ['starbucks'],
  kahvedunyasi: ['kahve dünyası', 'kahvedunyasi', 'kahve dunyasi'],
  coffy:        ['coffy'],
  kronotrop:    ['kronotrop'],
  mikel:        ['mikel coffee', 'mikel kahve'],
  nevada:       ['nevada coffee', 'nevada kahve'],
  arabica:      ['arabica coffee'],
  caffenero:    ['caffè nero', 'caffe nero'],
  costacoffee:  ['costa coffee'],
  brewmood:     ['brewmood'],
  luuq:         ['luuq'],
  gua:          ['gua coffee'],
  laos:         ['laos coffee'],
};

// ─── Kategori tespiti ──────────────────────────────────────────────────────────
const CATEGORY_KEYWORDS = {
  expansion:   ['şube', 'açıl', 'genişle', 'franchise', 'branch', 'expansion', 'new location', 'opens', 'büyüme'],
  financial:   ['yatırım', 'gelir', 'ciro', 'kâr', 'investment', 'revenue', 'funding', 'profit'],
  product:     ['ürün', 'menü', 'içecek', 'product', 'menu', 'latte', 'frappuccino', 'yeni ürün', 'lansman'],
  milestone:   ['100.', '200.', '300.', 'rekor', 'ilk', 'milestone', 'anniversary', 'yıldönümü'],
  controversy: ['tepki', 'boykot', 'şikayet', 'sorun', 'boycott', 'controversy', 'protest', 'kapatıl'],
  corporate:   ['satın alma', 'birleşme', 'acquisition', 'merger', 'ortaklık', 'partnership'],
  sector:      ['sektör', 'pazar', 'market', 'industry', 'trend', 'büyüme', 'tüketim'],
};

function detectBrand(text) {
  const lower = text.toLowerCase();
  for (const [id, keywords] of Object.entries(BRAND_KEYWORDS)) {
    if (keywords.some(k => lower.includes(k))) return id;
  }
  return null;
}

function detectCategory(text) {
  const lower = text.toLowerCase();
  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some(k => lower.includes(k))) return cat;
  }
  return 'sector';
}

function detectSentiment(text) {
  const lower = text.toLowerCase();
  const pos = ['büyüme', 'başarı', 'rekor', 'artış', 'açıl', 'growth', 'success', 'record', 'award', 'ödül', 'expands', 'profit'];
  const neg = ['düşüş', 'kapan', 'sorun', 'şikayet', 'boykot', 'tepki', 'decline', 'boycott', 'problem', 'protest', 'loss'];
  const pScore = pos.filter(k => lower.includes(k)).length;
  const nScore = neg.filter(k => lower.includes(k)).length;
  if (pScore > nScore) return 'positive';
  if (nScore > pScore) return 'negative';
  return 'neutral';
}

// NewsData.io → uygulama formatına dönüştür
function transformArticle(article, index) {
  const text = `${article.title || ''} ${article.description || ''}`;
  return {
    id:        `live_${article.article_id || index}`,
    brand:     detectBrand(text),
    title:     article.title || 'Başlıksız haber',
    summary:   article.description || article.content?.slice(0, 250) || '',
    date:      article.pubDate?.split(' ')[0] || new Date().toISOString().split('T')[0],
    source:    article.source_name || article.source_id || 'NewsData.io',
    url:       article.link || '#',
    sentiment: detectSentiment(text),
    category:  detectCategory(text),
    isBreaking: false,
    isLive:    true,
  };
}

// ─── Ana hook ─────────────────────────────────────────────────────────────────
export default function useNewsData(query = COFFEE_NEWS_QUERY, interval = 300_000) {
  const [articles, setArticles]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [lastFetched, setLastFetched]   = useState(null);

  const fetchNews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        apikey:   NEWSDATA_API_KEY,
        q:        query,
        language: 'tr,en',   // Türkçe + İngilizce
        country:  'tr',      // Türkiye haberleri
        size:     '10',
      });

      const res = await fetch(`${NEWSDATA_BASE_URL}?${params}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      if (data.status !== 'success') throw new Error(data.message || 'API yanıt hatası');

      // Kahveyle alakasız haberleri filtrele
      const coffeeOnly = (data.results || [])
        .filter(a => isCoffeeRelated(`${a.title || ''} ${a.description || ''}`))
        .map(transformArticle);

      setArticles(coffeeOnly);
      setLastFetched(new Date());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    fetchNews();
    const id = setInterval(fetchNews, interval);
    return () => clearInterval(id);
  }, [fetchNews, interval]);

  return { articles, loading, error, lastFetched, refetch: fetchNews };
}
