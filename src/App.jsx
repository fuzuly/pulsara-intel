import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import MainLayout from './components/layout/MainLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CompetitorAnalysis from './pages/CompetitorAnalysis';
import MenuComparison from './pages/MenuComparison';
import SalesAnalysis from './pages/SalesAnalysis';
import SocialMedia from './pages/SocialMedia';
import NewProductRadar from './pages/NewProductRadar';
import OsintReports from './pages/OsintReports';
import Reports from './pages/Reports';
import BreakingNews from './pages/BreakingNews';
import BranchRatings from './pages/BranchRatings';

function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
      />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <MainLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="rakip-analizi" element={<CompetitorAnalysis />} />
        <Route path="menu-karsilastirmasi" element={<MenuComparison />} />
        <Route path="satis-analizi" element={<SalesAnalysis />} />
        <Route path="sosyal-medya" element={<SocialMedia />} />
        <Route path="yeni-urun-radar" element={<NewProductRadar />} />
        <Route path="osint-raporlari" element={<OsintReports />} />
        <Route path="son-dakika" element={<BreakingNews />} />
        <Route path="sube-puanlari" element={<BranchRatings />} />
        <Route path="raporlar" element={<Reports />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
