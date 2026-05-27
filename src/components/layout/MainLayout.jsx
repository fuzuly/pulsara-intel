import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { useLocalStorage } from '../../hooks/useLocalStorage';

export default function MainLayout() {
  const [collapsed, setCollapsed] = useLocalStorage('sidebar-collapsed', false);

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(v => !v)} />
      <TopBar sidebarCollapsed={collapsed} />
      <main
        className="transition-all duration-300 pt-16"
        style={{ marginLeft: collapsed ? '4rem' : '15rem', background: 'var(--bg-primary)' }}
      >
        <div className="p-6 min-h-[calc(100vh-4rem)]">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
