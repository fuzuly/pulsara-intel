import { NavLink, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Coffee, LogOut } from 'lucide-react';
import { NAV_ITEMS } from '../../constants/routes';
import { useAuth } from '../../context/AuthContext';
import clsx from 'clsx';

export default function Sidebar({ collapsed, onToggle }) {
  const location = useLocation();
  const { logout, user } = useAuth();

  return (
    <aside
      className={clsx(
        'fixed top-0 left-0 h-screen z-30 flex flex-col transition-all duration-300 ease-in-out',
        'bg-navy border-r border-navy-border',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Logo */}
      <div className={clsx(
        'flex items-center gap-3 px-4 py-5 border-b border-navy-border',
        collapsed && 'justify-center px-2'
      )}>
        <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-caramel to-espresso flex items-center justify-center shadow-lg">
          <Coffee size={18} className="text-white" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <div className="text-sm font-bold text-white leading-tight">Rekabet Analizi</div>
            <div className="text-[10px] text-muted leading-tight">İstihbarat Platformu</div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 px-2 overflow-y-auto no-scrollbar">
        {!collapsed && (
          <div className="px-2 mb-2">
            <span className="text-[10px] font-semibold text-muted uppercase tracking-widest">Menü</span>
          </div>
        )}
        <ul className="space-y-0.5">
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
                  className={clsx(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                    collapsed && 'justify-center px-2',
                    isActive
                      ? 'text-white bg-surface2 border-l-2 border-caramel pl-[10px]'
                      : 'text-muted hover:text-white hover:bg-surface2/60'
                  )}
                >
                  <Icon
                    size={18}
                    className={clsx(
                      'flex-shrink-0',
                      isActive ? 'text-caramel' : ''
                    )}
                  />
                  {!collapsed && (
                    <>
                      <span className="truncate flex-1">{item.label}</span>
                      {item.badge && (
                        <span className="text-[8px] bg-danger text-white px-1.5 py-0.5 rounded-full font-bold animate-pulse-slow flex-shrink-0">
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
      <div className="border-t border-navy-border p-3 space-y-2">
        {/* User info */}
        {!collapsed && user && (
          <div className="px-2 py-1.5 rounded-lg bg-surface2 border border-navy-border flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-caramel to-espresso flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0">
              {user.initials}
            </div>
            <span className="text-xs text-white truncate flex-1">{user.name}</span>
          </div>
        )}

        {/* Logout */}
        <button
          onClick={logout}
          title="Çıkış Yap"
          className={clsx(
            'w-full flex items-center gap-2 py-2 px-3 rounded-lg text-muted hover:text-danger hover:bg-danger/10 transition-colors text-xs',
            collapsed && 'justify-center'
          )}
        >
          <LogOut size={15} className="flex-shrink-0" />
          {!collapsed && <span>Çıkış Yap</span>}
        </button>

        {/* Collapse toggle */}
        {!collapsed && (
          <div className="text-[10px] text-muted px-2">
            <div>Dashboard v1.0.0</div>
            <div>© 2026 Rekabet Analizi</div>
          </div>
        )}
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-muted hover:text-white hover:bg-surface2 transition-colors text-xs"
          title={collapsed ? 'Genişlet' : 'Daralt'}
        >
          {collapsed ? <ChevronRight size={16} /> : (
            <>
              <ChevronLeft size={16} />
              <span>Daralt</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
