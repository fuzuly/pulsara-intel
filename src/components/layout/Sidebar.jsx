import { NavLink, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight, LogOut, ExternalLink } from 'lucide-react';
import { NAV_ITEMS } from '../../constants/routes';
import { useAuth } from '../../context/AuthContext';
import clsx from 'clsx';

export default function Sidebar({ collapsed, onToggle }) {
  const location = useLocation();
  const { logout } = useAuth();

  return (
    <aside
      className={clsx(
        'fixed top-0 left-0 h-screen z-30 flex flex-col transition-all duration-300 ease-in-out',
        'bg-navy-light border-r border-navy-border',
        collapsed ? 'w-14' : 'w-56'
      )}
    >
      {/* Logo */}
      <div className={clsx(
        'flex items-center gap-3 border-b border-navy-border',
        collapsed ? 'px-3 py-4 justify-center' : 'px-4 py-4'
      )}>
        {/* Mark */}
        <div
          className="flex-shrink-0 w-7 h-7 flex items-center justify-center"
          style={{ borderLeft: '2px solid #C4922A' }}
        >
          <span className="font-display font-bold text-caramel text-sm leading-none tracking-tight">RA</span>
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <div className="text-xs font-semibold text-white leading-tight tracking-wide">
              Rekabet Analizi
            </div>
            <div className="text-[9px] text-muted leading-tight tracking-wider uppercase mt-0.5">
              İstihbarat Platformu
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 overflow-y-auto no-scrollbar">
        {!collapsed && (
          <div className="px-2 mb-3">
            <span className="text-[9px] font-semibold text-muted/60 uppercase tracking-[0.15em]">
              Modüller
            </span>
          </div>
        )}
        <ul className="space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;

            if (item.external) {
              return (
                <li key={item.href}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={collapsed ? item.label : ''}
                    className={clsx(
                      'flex items-center gap-2.5 px-2.5 py-2 text-xs font-medium transition-all duration-100',
                      'text-muted hover:text-white hover:bg-surface2/40 rounded-sm',
                      collapsed && 'justify-center px-2'
                    )}
                  >
                    <Icon size={15} className="flex-shrink-0" />
                    {!collapsed && (
                      <>
                        <span className="truncate flex-1">{item.label}</span>
                        <ExternalLink size={10} className="flex-shrink-0 opacity-40" />
                      </>
                    )}
                  </a>
                </li>
              );
            }

            const isActive = item.path === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(item.path);

            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  title={collapsed ? item.label : ''}
                  className={clsx(
                    'flex items-center gap-2.5 px-2.5 py-2 text-xs font-medium transition-all duration-100 rounded-sm',
                    collapsed && 'justify-center px-2',
                    isActive
                      ? 'text-white bg-surface2/60'
                      : 'text-muted hover:text-white hover:bg-surface2/30'
                  )}
                  style={isActive ? {
                    borderLeft: '2px solid #C4922A',
                    paddingLeft: collapsed ? undefined : 'calc(0.625rem - 2px)',
                  } : {}}
                >
                  <Icon
                    size={15}
                    className={clsx('flex-shrink-0', isActive ? 'text-caramel' : '')}
                  />
                  {!collapsed && (
                    <>
                      <span className="truncate flex-1">{item.label}</span>
                    </>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="border-t border-navy-border p-2 space-y-1">
        <button
          onClick={logout}
          title="Çıkış Yap"
          className={clsx(
            'w-full flex items-center gap-2 py-2 px-2.5 rounded-sm text-muted',
            'hover:text-danger hover:bg-danger/8 transition-colors text-xs',
            collapsed && 'justify-center'
          )}
        >
          <LogOut size={13} className="flex-shrink-0" />
          {!collapsed && <span>Çıkış Yap</span>}
        </button>

        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center gap-2 py-2 px-2.5 rounded-sm text-muted hover:text-white hover:bg-surface2/40 transition-colors text-xs"
          title={collapsed ? 'Genişlet' : 'Daralt'}
        >
          {collapsed
            ? <ChevronRight size={14} />
            : <><ChevronLeft size={14} /><span>Daralt</span></>
          }
        </button>

        {!collapsed && (
          <div className="text-[9px] text-muted/40 px-2.5 pt-1 pb-0.5 font-mono tracking-wider">
            v1.0.0 · 2026
          </div>
        )}
      </div>
    </aside>
  );
}
