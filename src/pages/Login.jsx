import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Coffee, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('isAuthenticated', 'true');
        login();
        navigate('/');
      } else {
        setError('Geçersiz kullanıcı adı veya şifre');
      }
    } catch (err) {
      setError('Bağlantı hatası. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center p-4">
      {/* Background pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-caramel/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-caramel/5 blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-caramel to-espresso flex items-center justify-center shadow-2xl mb-4">
            <Coffee size={30} className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-white">Rekabet Analizi</h1>
          <p className="text-xs text-muted mt-1">Rekabet İstihbaratı Platformu</p>
        </div>

        {/* Card */}
        <div className="bg-surface border border-navy-border rounded-2xl p-6 shadow-2xl">
          <h2 className="text-base font-semibold text-white mb-1">Giriş Yap</h2>
          <p className="text-xs text-muted mb-5">Devam etmek için hesabınıza giriş yapın.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">Kullanıcı Adı</label>
              <div className="relative">
                <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="kullanici_adi"
                  required
                  autoFocus
                  className="w-full bg-surface2 border border-navy-border rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder-muted focus:outline-none focus:border-caramel transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">Şifre</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-surface2 border border-navy-border rounded-lg pl-9 pr-10 py-2.5 text-sm text-white placeholder-muted focus:outline-none focus:border-caramel transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="text-xs text-danger bg-danger/10 border border-danger/20 rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary justify-center py-2.5 text-sm disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Giriş yapılıyor...
                </span>
              ) : (
                'Giriş Yap'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-[10px] text-muted mt-6">
          © 2026 Rekabet Analizi Dashboard
        </p>
      </div>
    </div>
  );
}
