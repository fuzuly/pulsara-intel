import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, Download, RefreshCw } from 'lucide-react';
import { NAV_ITEMS } from '../../constants/routes';
import LiveTicker from './LiveTicker';
import { useExport } from '../../hooks/useExport';
import { useAuth } from '../../context/AuthContext';
import { ALERTS } from '../../data/alertsData';
import ThemeToggle from '../common/ThemeToggle';
import clsx from 'clsx';

export default function TopBar({ sidebarCollapsed }) {
  const location = useLocation();
  const [clock, setClock] = useState(new Date());
  const [showNotif, setShowNotif] = useState(false);
  const { exportToExcel, exportToPPTX, isExporting } = useExport();
  const { user } = useAuth();

  const currentPage = NAV_ITEMS.find(item =>
    item.path === '/'
      ? location.pathname === '/'
      : location.pathname.startsWith(item.path)
  );

  useEffect(() => {
    const timer = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeStr = clock.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const dateStr = clock.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' });
  const newAlerts = ALERTS.filter(a => a.severity === 'warning' || a.severity === 'danger').length;

  return (
    <header
      style={{ background: 'var(--bg-panel)', borderBottom: '1px solid var(--border-primary)' }}
      className={clsx(
        'fixed top-0 right-0 z-20 h-16 flex flex-col transition-all duration-300',
        sidebarCollapsed ? 'left-16' : 'left-60'
      )}
    >
      {/* Top accent line */}
      <div style={{ height: '1px', background: 'linear-gradient(90deg, var(--accent-primary), transparent)', opacity: 0.5 }} />

      {/* Main bar */}
      <div className="flex items-center gap-4 px-5 flex-1">
        {/* Page title */}
        <div className="flex items-center gap-2 min-w-0">
          {currentPage?.icon && (
            <currentPage.icon size={14} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
          )}
          <h1 style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '0.65rem',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'var(--text-primary)',
            fontWeight: 600,
          }}>
            {currentPage?.label || 'Dashboard'}
          </h1>
        </div>

        {/* Ticker */}
        <div
          style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-primary)', borderRadius: '1px' }}
          className="flex-1 min-w-0 px-3 py-1.5 overflow-hidden"
        >
          <LiveTicker />
        </div>

        {/* Right section */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <ThemeToggle compact />

          {/* Clock */}
          <div className="hidden lg:flex flex-col items-end">
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.75rem', color: 'var(--text-primary)', fontWeight: 500, letterSpacing: '0.05em' }}>
              {timeStr}
            </span>
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.55rem', color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              {dateStr}
            </span>
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotif(!showNotif)}
              style={{ padding: '0.4rem', background: 'transparent', border: '1px solid transparent', borderRadius: '1px', color: 'var(--text-muted)', transition: 'all 0.15s', cursor: 'pointer' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.borderColor = 'var(--border-primary)'; e.currentTarget.style.background = 'var(--bg-tertiary)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.background = 'transparent'; }}
            >
              <Bell size={16} />
              {newAlerts > 0 && (
                <span style={{
                  position: 'absolute', top: 2, right: 2,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: '14px', height: '14px', borderRadius: '1px',
                  background: 'var(--accent-warning)',
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: '0.5rem', fontWeight: 700,
                  color: 'var(--bg-primary)',
                }}>
                  {newAlerts}
                </span>
              )}
            </button>

            {showNotif && (
              <div
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: '1px', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}
                className="absolute right-0 top-full mt-2 w-80 z-50 overflow-hidden animate-fade-in"
              >
                <div style={{ borderBottom: '1px solid var(--border-primary)', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
                    // Bildirimler
                  </span>
                  <span className="intel-badge warning">{newAlerts} yeni</span>
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {ALERTS.slice(0, 6).map(alert => (
                    <div key={alert.id} style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border-primary)', transition: 'background 0.1s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-tertiary)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-base flex-shrink-0">{alert.icon}</span>
                        <div className="min-w-0">
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>{alert.message}</p>
                          <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.55rem', color: 'var(--text-muted)', marginTop: '0.25rem', letterSpacing: '0.05em' }}>
                            {new Date(alert.timestamp).toLocaleString('tr-TR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ padding: '0.5rem', textAlign: 'center' }}>
                  <button
                    style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.55rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent-primary)', background: 'transparent', border: 'none', cursor: 'pointer' }}
                    onClick={() => setShowNotif(false)}
                  >
                    Tümünü gör →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick export */}
          <div className="relative group">
            <button disabled={isExporting} className="btn-primary" style={{ fontSize: '0.6rem' }}>
              {isExporting ? <RefreshCw size={12} className="animate-spin" /> : <Download size={12} />}
              <span className="hidden sm:inline">Rapor</span>
            </button>
            <div
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: '1px', boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}
              className="absolute right-0 top-full mt-1 hidden group-hover:flex flex-col z-50 overflow-hidden min-w-36"
            >
              <button onClick={() => exportToExcel()}
                style={{ padding: '0.6rem 1rem', fontSize: '0.7rem', color: 'var(--text-primary)', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'background 0.1s', textAlign: 'left' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-tertiary)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <span>📊</span> Excel
              </button>
              <button onClick={() => exportToPPTX()}
                style={{ padding: '0.6rem 1rem', fontSize: '0.7rem', color: 'var(--text-primary)', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'background 0.1s', textAlign: 'left' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-tertiary)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <span>📑</span> PowerPoint
              </button>
            </div>
          </div>

          {/* User avatar */}
          <div
            style={{
              width: '32px', height: '32px', borderRadius: '1px',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--accent-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.05em',
              color: 'var(--accent-primary)',
            }}
            title={user?.name || ''}
          >
            {user?.initials || '?'}
          </div>
        </div>
      </div>

      {showNotif && (
        <div className="fixed inset-0 z-40" onClick={() => setShowNotif(false)} />
      )}
    </header>
  );
}
