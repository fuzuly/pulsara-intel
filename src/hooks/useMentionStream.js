import { useState, useEffect, useRef, useCallback } from 'react';

// Local: http://localhost:3600 (CORS allows 8333)
// Production: VITE_SCRAPER_URL env var
const SCRAPER_BASE = (import.meta.env.VITE_SCRAPER_URL || 'http://localhost:3600') + '/api';
const MAX_LOCAL = 200;
const RECONNECT_DELAY_MS = 5000;

export default function useMentionStream() {
  const [mentions, setMentions]       = useState([]);
  const [stats, setStats]             = useState(null);
  const [connected, setConnected]     = useState(false);
  const [lastPoll, setLastPoll]       = useState(null);
  const [newFlash, setNewFlash]       = useState(null); // id of latest new mention
  const esRef                         = useRef(null);
  const reconnectRef                  = useRef(null);

  const connect = useCallback(() => {
    if (esRef.current) {
      esRef.current.close();
    }

    const es = new EventSource(`${SCRAPER_BASE}/mentions/stream`);
    esRef.current = es;

    es.onopen = () => {
      setConnected(true);
      if (reconnectRef.current) {
        clearTimeout(reconnectRef.current);
        reconnectRef.current = null;
      }
    };

    es.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);

        if (msg.type === 'initial') {
          setMentions(msg.mentions || []);
        } else if (msg.type === 'mention') {
          setMentions(prev => {
            const deduped = prev.filter(m => m.id !== msg.mention.id);
            const next = [msg.mention, ...deduped].slice(0, MAX_LOCAL);
            return next;
          });
          setNewFlash(msg.mention.id);
          setTimeout(() => setNewFlash(null), 3000);
        } else if (msg.type === 'poll') {
          setLastPoll(new Date());
          setStats(msg.stats);
        }
      } catch {
        // malformed JSON — ignore
      }
    };

    es.onerror = () => {
      setConnected(false);
      es.close();
      esRef.current = null;
      reconnectRef.current = setTimeout(connect, RECONNECT_DELAY_MS);
    };
  }, []);

  useEffect(() => {
    connect();
    return () => {
      if (esRef.current)     esRef.current.close();
      if (reconnectRef.current) clearTimeout(reconnectRef.current);
    };
  }, [connect]);

  // Manuel stats yükle (SSE bağlantısından önce)
  useEffect(() => {
    fetch(`${SCRAPER_BASE}/mentions/stats`)
      .then(r => r.json())
      .then(d => { if (d.status === 'ok') setStats(d); })
      .catch(() => {});
  }, []);

  return { mentions, stats, connected, lastPoll, newFlash };
}
