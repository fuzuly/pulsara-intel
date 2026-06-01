import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const GJ_ORANGE      = '#F46621';
const GJ_ORANGE_DARK = '#C94E10';
const GJ_GRADIENT    = 'linear-gradient(135deg, #C94E10, #F46621)';
const GJ_BG          = '#0F0B08';
const GJ_SURFACE     = '#1C1410';
const GJ_SURFACE2    = '#261C14';
const GJ_BORDER      = '#4A2E1A';
const GJ_BORDER_FOCUS= '#F46621';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusUser, setFocusUser] = useState(false);
  const [focusPass, setFocusPass] = useState(false);

  const USERS = [
    { username: 'admin',   password: 'Gloria2026' },
    { username: 'gloria',  password: 'Gloria2026' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      const match = USERS.find(
        u => u.username === username && u.password === password
      );
      if (match) {
        localStorage.setItem('isAuthenticated', 'true');
        login();
        navigate('/');
      } else {
        setError('Geçersiz kullanıcı adı veya şifre');
      }
      setLoading(false);
    }, 400);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: GJ_BG }}
    >
      {/* Arka plan dekorasyon */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full blur-3xl"
          style={{ backgroundColor: `${GJ_ORANGE}15` }} />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full blur-3xl"
          style={{ backgroundColor: `${GJ_ORANGE_DARK}10` }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[140px]"
          style={{ backgroundColor: `${GJ_ORANGE}08` }} />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div
            className="w-24 h-24 rounded-2xl flex items-center justify-center shadow-2xl mb-4 overflow-hidden"
            style={{ background: '#FFFFFF' }}
          >
            <img
              src="/GJlogo.png"
              alt="Gloria Jean's"
              className="w-20 h-20 object-contain"
              onError={e => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement.style.background = GJ_GRADIENT;
                e.currentTarget.parentElement.innerHTML = '<span style="color:white;font-size:28px;font-weight:900">GJ</span>';
              }}
            />
          </div>
          <h1 className="text-xl font-bold text-white">Rekabet Analizi</h1>
          <p className="text-xs mt-1" style={{ color: GJ_ORANGE }}>
            Gloria Jean's İstihbarat Platformu
          </p>
        </div>

        {/* Kart */}
        <div
          className="rounded-2xl p-6 shadow-2xl"
          style={{ backgroundColor: GJ_SURFACE, border: `1px solid ${GJ_BORDER}` }}
        >
          <h2 className="text-base font-semibold text-white mb-1">Giriş Yap</h2>
          <p className="text-xs mb-5" style={{ color: '#9CA3AF' }}>
            Devam etmek için hesabınıza giriş yapın.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Kullanıcı Adı */}
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: '#9CA3AF' }}>
                Kullanıcı Adı
              </label>
              <div className="relative">
                <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: focusUser ? GJ_ORANGE : '#6B7280' }} />
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  onFocus={() => setFocusUser(true)}
                  onBlur={() => setFocusUser(false)}
                  placeholder="kullanici_adi"
                  required
                  autoFocus
                  style={{
                    backgroundColor: GJ_SURFACE2,
                    border: `1px solid ${focusUser ? GJ_BORDER_FOCUS : GJ_BORDER}`,
                    color: 'white',
                    outline: 'none',
                    boxShadow: focusUser ? `0 0 0 3px ${GJ_ORANGE}25` : 'none',
                  }}
                  className="w-full rounded-lg pl-9 pr-4 py-2.5 text-sm placeholder-gray-600 transition-all"
                />
              </div>
            </div>

            {/* Şifre */}
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: '#9CA3AF' }}>
                Şifre
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: focusPass ? GJ_ORANGE : '#6B7280' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onFocus={() => setFocusPass(true)}
                  onBlur={() => setFocusPass(false)}
                  placeholder="••••••••"
                  required
                  style={{
                    backgroundColor: GJ_SURFACE2,
                    border: `1px solid ${focusPass ? GJ_BORDER_FOCUS : GJ_BORDER}`,
                    color: 'white',
                    outline: 'none',
                    boxShadow: focusPass ? `0 0 0 3px ${GJ_ORANGE}25` : 'none',
                  }}
                  className="w-full rounded-lg pl-9 pr-10 py-2.5 text-sm placeholder-gray-600 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: '#6B7280' }}
                  onMouseEnter={e => e.currentTarget.style.color = GJ_ORANGE}
                  onMouseLeave={e => e.currentTarget.style.color = '#6B7280'}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Hata */}
            {error && (
              <div className="text-xs bg-red-900/20 border border-red-500/30 rounded-lg px-3 py-2" style={{ color: '#FCA5A5' }}>
                {error}
              </div>
            )}

            {/* Giriş Butonu */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg py-2.5 text-sm font-semibold text-white transition-all disabled:opacity-60"
              style={{
                background: GJ_GRADIENT,
                boxShadow: `0 4px 20px ${GJ_ORANGE}40`,
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.boxShadow = `0 6px 28px ${GJ_ORANGE}70`; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = `0 4px 20px ${GJ_ORANGE}40`; }}
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

        <p className="text-center text-[10px] mt-6" style={{ color: '#4B5563' }}>
          © 2026 Rekabet Analizi Dashboard
        </p>
      </div>
    </div>
  );
}
