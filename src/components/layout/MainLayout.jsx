import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { useLocalStorage } from '../../hooks/useLocalStorage';

export default function MainLayout() {
  const [collapsed, setCollapsed] = useLocalStorage('sidebar-collapsed', false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-navy">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(v => !v)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <TopBar
        sidebarCollapsed={collapsed}
        onMobileMenuOpen={() => setMobileOpen(true)}
      />
      <main
        className={[
          'transition-all duration-300 pt-14',
          collapsed ? 'md:ml-14' : 'md:ml-56',
        ].join(' ')}
      >
        <div className="p-3 sm:p-6 min-h-[calc(100vh-3.5rem)]">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
