import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';

const AuthContext = createContext(null);

const TIMEOUT_MS = 15 * 60 * 1000; // 15 dakika
const EVENTS = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart'];

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem('isAuthenticated') === 'true'
  );
  const timerRef = useRef(null);

  const logout = useCallback(() => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('auth_token');
    setIsAuthenticated(false);
  }, []);

  const resetTimer = useCallback(() => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(logout, TIMEOUT_MS);
  }, [logout]);

  useEffect(() => {
    if (!isAuthenticated) return;

    EVENTS.forEach(e => window.addEventListener(e, resetTimer, { passive: true }));
    resetTimer();

    return () => {
      EVENTS.forEach(e => window.removeEventListener(e, resetTimer));
      clearTimeout(timerRef.current);
    };
  }, [isAuthenticated, resetTimer]);

  const login = () => {
    setIsAuthenticated(true);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
