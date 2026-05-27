import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, Download, RefreshCw } from 'lucide-react';
import { NAV_ITEMS } from '../../constants/routes';
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
  const dateStr = clock.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });

  const newAlerts = ALERTS.filter(a => a.severity === 'warning' || a.severity === 'danger').length;

  return (
    <header
      className={clsx(
        'fixed top-0 right-0 z-20 h-16 flex flex-col bg-navy border-b border-navy-border transition-all duration-300',
        sidebarCollapsed ? 'left-16' : 'left-60'
      )}
    >
      {/* Main bar */}
      <div className="flex items-center gap-4 px-5 h-full">
        {/* Page title */}
        <div className="flex items-center gap-2 min-w-0">
          {currentPage?.icon && <currentPage.icon size={18} className="text-caramel flex-shrink-0" />}
          <h1 className="text-base font-semibold text-white truncate">
            {currentPage?.label || 'Dashboard'}
          </h1>
        </div>

        <div className="flex-1" />

        {/* Right section */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Theme toggle */}
          <ThemeToggle compact />

          {/* Clock */}
          <div className="hidden lg:flex flex-col items-end">
            <span className="text-sm font-mono font-semibold text-white">{timeStr}</span>
            <span className="text-[10px] text-muted">{dateStr}</span>
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotif(!showNotif)}
              className="relative p-2 rounded-lg text-muted hover:text-white hover:bg-surface2 transition-colors"
            >
              <Bell size={18} />
              {newAlerts > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-warning text-[9px] font-bold text-espresso">
                  {newAlerts}
                </span>
              )}
            </button>

            {showNotif && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-surface border border-navy-border rounded-xl shadow-xl z-50 overflow-hidden animate-fade-in">
                <div className="flex items-center justify-between px-4 py-3 border-b border-navy-border">
                  <span className="text-sm font-semibold text-white">Bildirimler</span>
                  <span className="badge-warning badge">{newAlerts} yeni</span>
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {ALERTS.slice(0, 6).map(alert => (
                    <div key={alert.id} className="px-4 py-3 border-b border-navy-border hover:bg-surface2 transition-colors">
                      <div className="flex items-start gap-2">
                        <span className="text-base flex-shrink-0">{alert.icon}</span>
                        <div className="min-w-0">
                          <p className="text-xs text-white leading-relaxed">{alert.message}</p>
                          <p className="text-[10px] text-muted mt-1">
                            {new Date(alert.timestamp).toLocaleString('tr-TR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2 text-center">
                  <button
                    className="text-xs text-caramel hover:underline"
                    onClick={() => setShowNotif(false)}
                  >
                    Tümünü gör
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick export */}
          <div className="relative group">
            <button
              disabled={isExporting}
              className="btn-primary text-xs disabled:opacity-50"
            >
              {isExporting ? (
                <RefreshCw size={14} className="animate-spin" />
              ) : (
                <Download size={14} />
              )}
              <span className="hidden sm:inline">Rapor İndir</span>
            </button>
            <div className="absolute right-0 top-full mt-1 hidden group-hover:flex flex-col bg-surface border border-navy-border rounded-lg shadow-xl z-50 overflow-hidden min-w-36">
              <button
                onClick={() => exportToExcel()}
                className="px-4 py-2.5 text-xs text-left text-white hover:bg-surface2 transition-colors flex items-center gap-2"
              >
                <span>📊</span> Excel İndir
              </button>
              <button
                onClick={() => exportToPPTX()}
                className="px-4 py-2.5 text-xs text-left text-white hover:bg-surface2 transition-colors flex items-center gap-2"
              >
                <span>📑</span> PowerPoint İndir
              </button>
            </div>
          </div>

          {/* User avatar */}
          <div
            className="w-8 h-8 rounded-full bg-gradient-to-br from-caramel to-espresso flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
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
