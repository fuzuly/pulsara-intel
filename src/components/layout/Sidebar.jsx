import { NavLink, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Coffee, LogOut } from 'lucide-react';
import { NAV_ITEMS } from '../../constants/routes';
import { useAuth } from '../../context/AuthContext';
import clsx from 'clsx';

export default function Sidebar({ collapsed, onToggle }) {
  const location = useLocation();
  const { logout } = useAuth();

  return (
    <aside
      style={{ background: 'var(--bg-panel)', borderRight: '1px solid var(--border-primary)' }}
      className={clsx(
        'fixed top-0 left-0 h-screen z-30 flex flex-col transition-all duration-300 ease-in-out',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Logo */}
      <div
        style={{ borderBottom: '1px solid var(--border-primary)' }}
        className={clsx('flex items-center gap-3 px-4 py-5', collapsed && 'justify-center px-2')}
      >
        <div
          style={{ background: 'linear-gradient(135deg, #0ea5e9, #818cf8)', borderRadius: '2px' }}
          className="flex-shrink-0 w-9 h-9 flex items-center justify-center shadow-lg"
        >
          <Coffee size={18} className="text-white" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <div
              style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-primary)' }}
            >
              Rekabet Analizi
            </div>
            <div
              style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.55rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginTop: '2px' }}
            >
              Intel Platform
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 overflow-y-auto no-scrollbar">
        {!collapsed && (
          <div
            style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-muted)', padding: '0 1rem 0.5rem' }}
          >
            // Navigation
          </div>
        )}
        <ul className="space-y-0">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = item.path === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(item.path);

            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  title={collapsed ? item.label : ''}
                  style={isActive ? {
                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                    padding: collapsed ? '0.65rem 0' : '0.65rem 1rem',
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: '0.63rem', letterSpacing: '0.08em', textTransform: 'uppercase',
                    color: 'var(--accent-primary)',
                    background: 'rgba(14, 165, 233, 0.07)',
                    borderLeft: '2px solid var(--accent-primary)',
                  } : {
                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                    padding: collapsed ? '0.65rem 0' : '0.65rem 1rem',
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: '0.63rem', letterSpacing: '0.08em', textTransform: 'uppercase',
                    color: 'var(--text-muted)',
                    borderLeft: '2px solid transparent',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { if (!isActive) { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'var(--bg-tertiary)'; e.currentTarget.style.borderLeftColor = 'var(--accent-primary)'; }}}
                  onMouseLeave={e => { if (!isActive) { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderLeftColor = 'transparent'; }}}
                >
                  <Icon
                    size={16}
                    className="flex-shrink-0"
                    style={{ color: isActive ? 'var(--accent-primary)' : 'inherit' }}
                  />
                  {!collapsed && (
                    <>
                      <span className="truncate flex-1">{item.label}</span>
                      {item.badge && (
                        <span
                          style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.5rem', letterSpacing: '0.05em', padding: '1px 4px', border: '1px solid var(--accent-danger)', color: 'var(--accent-danger)', background: 'rgba(239,68,68,0.1)', borderRadius: '1px' }}
                        >
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div style={{ borderTop: '1px solid var(--border-primary)', padding: '0.75rem' }}>
        {/* Logout */}
        <button
          onClick={logout}
          title="Çıkış Yap"
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: '0.5rem',
            justifyContent: collapsed ? 'center' : 'flex-start',
            padding: '0.5rem 0.75rem',
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '0.6rem', letterSpacing: '0.08em', textTransform: 'uppercase',
            color: 'var(--text-muted)',
            background: 'transparent', border: '1px solid transparent', borderRadius: '1px',
            transition: 'all 0.15s', cursor: 'pointer',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent-danger)'; e.currentTarget.style.background = 'rgba(239,68,68,0.06)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; }}
        >
          <LogOut size={14} className="flex-shrink-0" />
          {!collapsed && <span>Çıkış Yap</span>}
        </button>

        {/* Version */}
        {!collapsed && (
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.5rem', letterSpacing: '0.08em', color: 'var(--text-muted)', padding: '0.5rem 0.75rem 0', textTransform: 'uppercase' }}>
            v1.0.0 © 2026
          </div>
        )}

        {/* Collapse toggle */}
        <button
          onClick={onToggle}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
            padding: '0.4rem',
            fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.55rem', letterSpacing: '0.06em', textTransform: 'uppercase',
            color: 'var(--text-muted)',
            background: 'transparent', border: '1px solid transparent', borderRadius: '1px',
            transition: 'all 0.15s', cursor: 'pointer', marginTop: '0.25rem',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent-primary)'; e.currentTarget.style.borderColor = 'var(--border-primary)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'transparent'; }}
          title={collapsed ? 'Genişlet' : 'Daralt'}
        >
          {collapsed ? <ChevronRight size={14} /> : (
            <><ChevronLeft size={14} /><span>Daralt</span></>
          )}
        </button>
      </div>
    </aside>
  );
}
