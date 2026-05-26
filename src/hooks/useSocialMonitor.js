import { useState, useEffect, useRef, useCallback } from 'react';
import { LIVE_POSTS, LIVE_COMMENTS, LIVE_TEASERS } from '../data/socialMonitorData';

// Simulates real-time social media monitoring
// In production: replace with Instagram Graph API / TikTok API / Twitter API v2 WebSocket feeds

const generateDelta = (base, variance = 0.03) =>
  Math.floor(base * (1 + (Math.random() - 0.5) * variance));

const randomComment = () => {
  const positiveTexts = [
    'Bu içecek harika! 😍', 'Kesinlikle tavsiye ederim ☕', 'Bugün denedim, muhteşemdi!',
    'Favorim oldu 💛', 'Her sabah bu kahveyle başlıyorum 🌅', 'Mükemmel lezzet!',
    'Ekip çok güler yüzlü 👏', 'Fiyat/performans üstün 🙌',
  ];
  const neutralTexts = [
    'Fiyat biraz yüksek ama lezzet iyi', 'Bekleme süresi fazlaydı ama değdi',
    'Ortalama bir deneyimdi', 'Lokasyona göre değişiyor',
  ];
  const negativeTexts = [
    'Bu sefer pek beğenmedim 😕', 'Fiyatlar artmış...', 'Bekleme süresi çok uzundu',
  ];
  const r = Math.random();
  const sentiment = r < 0.65 ? 'positive' : r < 0.85 ? 'neutral' : 'negative';
  const texts = sentiment === 'positive' ? positiveTexts : sentiment === 'neutral' ? neutralTexts : negativeTexts;
  return {
    text: texts[Math.floor(Math.random() * texts.length)],
    sentiment,
  };
};

export default function useSocialMonitor(intervalMs = 8000) {
  const [posts, setPosts] = useState(LIVE_POSTS);
  const [comments, setComments] = useState(LIVE_COMMENTS);
  const [teasers] = useState(LIVE_TEASERS);
  const [liveMetrics, setLiveMetrics] = useState(() =>
    Object.fromEntries(LIVE_POSTS.map(p => [p.id, { likes: p.likes || 0, comments: p.comments || 0, views: p.views || 0, shares: p.shares || 0 }]))
  );
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [newCommentFlash, setNewCommentFlash] = useState(null);
  const commentIdRef = useRef(1000);

  const tick = useCallback(() => {
    // Update metrics for trending posts with small deltas
    setLiveMetrics(prev => {
      const next = { ...prev };
      LIVE_POSTS.forEach(post => {
        if (post.trending) {
          next[post.id] = {
            likes: generateDelta(prev[post.id].likes, 0.008),
            comments: generateDelta(prev[post.id].comments, 0.012),
            views: post.views ? generateDelta(prev[post.id].views, 0.015) : 0,
            shares: generateDelta(prev[post.id].shares, 0.006),
          };
        }
      });
      return next;
    });

    // Occasionally add a new comment (30% chance per tick)
    if (Math.random() < 0.30) {
      const trendingPosts = LIVE_POSTS.filter(p => p.trending);
      const targetPost = trendingPosts[Math.floor(Math.random() * trendingPosts.length)];
      const brands = ['espressolab', 'starbucks', 'kahvedunyasi', 'kronotrop', 'mikel'];
      const users = ['@kahve_gurmesi', '@barista_fan', '@coffee_tr', '@sabah_kahvesi', '@espresso_lover_tr', '@daily_brew', '@coffeeholic_tr'];
      const { text, sentiment } = randomComment();
      const newComment = {
        id: `live_${commentIdRef.current++}`,
        brand: targetPost.brand,
        postId: targetPost.id,
        platform: targetPost.platform,
        user: users[Math.floor(Math.random() * users.length)],
        text,
        sentiment,
        likes: Math.floor(Math.random() * 25),
        postedAt: new Date().toISOString(),
        isLive: true,
      };
      setComments(prev => [newComment, ...prev.slice(0, 49)]);
      setNewCommentFlash(newComment.id);
      setTimeout(() => setNewCommentFlash(null), 3000);
    }

    setLastUpdate(new Date());
  }, []);

  useEffect(() => {
    const id = setInterval(tick, intervalMs);
    return () => clearInterval(id);
  }, [tick, intervalMs]);

  return { posts, comments, teasers, liveMetrics, lastUpdate, newCommentFlash };
}
