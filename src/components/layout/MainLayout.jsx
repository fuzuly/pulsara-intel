import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { useLocalStorage } from '../../hooks/useLocalStorage';

export default function MainLayout() {
  const [collapsed, setCollapsed] = useLocalStorage('sidebar-collapsed', false);

  return (
    <div className="min-h-screen bg-navy">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(v => !v)} />
      <TopBar sidebarCollapsed={collapsed} />
      <main
        className="transition-all duration-300 pt-14"
        style={{ marginLeft: collapsed ? '3.5rem' : '14rem' }}
      >
        <div className="p-6 min-h-[calc(100vh-3.5rem)]">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
