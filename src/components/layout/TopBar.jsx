import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useLocation } from 'react-router-dom';
import { Download, RefreshCw, Search } from 'lucide-react';
import { NAV_ITEMS } from '../../constants/routes';
import { useExport } from '../../hooks/useExport';
import { useAuth } from '../../context/AuthContext';
import GlobalSearch from '../common/GlobalSearch';
import clsx from 'clsx';

export default function TopBar({ sidebarCollapsed }) {
  const location = useLocation();
  const [clock, setClock] = useState(new Date());
  const [showSearch, setShowSearch] = useState(false);
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

  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearch(p => !p);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const timeStr = clock.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const dateStr = clock.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });


  return (
    <header
      className={clsx(
        'fixed top-0 right-0 z-20 h-14 flex flex-col bg-navy-light border-b border-navy-border transition-all duration-300',
        sidebarCollapsed ? 'left-14' : 'left-56'
      )}
    >
      <div className="flex items-center gap-4 px-5 h-full">
        {/* Page title */}
        <div className="flex items-center gap-2.5 min-w-0">
          {currentPage?.icon && (
            <currentPage.icon size={14} className="text-caramel flex-shrink-0" />
          )}
          <h1 className="text-sm font-semibold text-white tracking-tight truncate">
            {currentPage?.label || 'Dashboard'}
          </h1>
          <span className="hidden md:block text-navy-border select-none">/</span>
          <span className="hidden md:block text-[10px] text-muted/60 uppercase tracking-[0.12em] font-sans">
            {new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
        </div>

        <div className="flex-1" />

        {/* Right section */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Global search trigger */}
          <button
            onClick={() => setShowSearch(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-sm border border-navy-border text-muted hover:text-white hover:border-muted/60 bg-surface2/20 hover:bg-surface2/50 transition-all text-xs"
            title="Ara (Ctrl+K)"
          >
            <Search size={12} />
            <span className="hidden md:inline tracking-wide">Ara</span>
            <kbd className="hidden lg:flex items-center px-1.5 py-px border border-navy-border/80 rounded-sm font-mono text-[9px] ml-1 text-muted/60">
              ⌘K
            </kbd>
          </button>

          {/* Separator */}
          <div className="w-px h-5 bg-navy-border" />

          {/* Clock */}
          <div className="hidden xl:flex flex-col items-end">
            <span className="text-xs font-mono font-medium text-white tabular-nums">{timeStr}</span>
          </div>

          {/* Separator */}
          <div className="w-px h-5 bg-navy-border" />

          {/* Quick export */}
          <div className="relative group">
            <button
              disabled={isExporting}
              className="btn-primary disabled:opacity-50"
            >
              {isExporting ? (
                <RefreshCw size={12} className="animate-spin" />
              ) : (
                <Download size={12} />
              )}
              <span className="hidden sm:inline">Rapor</span>
            </button>
            <div className="absolute right-0 top-full mt-1 hidden group-hover:flex flex-col bg-surface border border-navy-border rounded-sm shadow-2xl z-50 overflow-hidden min-w-40">
              <button
                onClick={() => exportToExcel()}
                className="px-4 py-2.5 text-xs text-left text-white hover:bg-surface2/60 transition-colors flex items-center gap-2.5"
              >
                <span className="text-sm">📊</span>
                <span>Excel İndir</span>
              </button>
              <button
                onClick={() => exportToPPTX()}
                className="px-4 py-2.5 text-xs text-left text-white hover:bg-surface2/60 transition-colors flex items-center gap-2.5 border-t border-navy-border"
              >
                <span className="text-sm">📑</span>
                <span>PowerPoint İndir</span>
              </button>
            </div>
          </div>

          {/* User avatar */}
          <div
            className="w-7 h-7 rounded-sm bg-caramel/20 border border-caramel/30 flex items-center justify-center text-caramel text-[10px] font-bold font-mono flex-shrink-0 cursor-default"
            title={user?.name || ''}
          >
            {user?.initials || '?'}
          </div>
        </div>
      </div>


      {showSearch && createPortal(
        <GlobalSearch onClose={() => setShowSearch(false)} />,
        document.body
      )}
    </header>
  );
}
