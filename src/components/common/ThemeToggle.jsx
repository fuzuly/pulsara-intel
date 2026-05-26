import { useTheme } from '../../context/ThemeContext';
import clsx from 'clsx';

export default function ThemeToggle({ compact = false }) {
  const { theme, toggle } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggle}
      title={isDark ? 'Açık Tema\'ya Geç' : 'Koyu Tema\'ya Geç'}
      className={clsx(
        'flex items-center gap-2 rounded-lg border transition-all duration-200',
        compact ? 'p-2' : 'px-3 py-2',
        isDark
          ? 'border-navy-border bg-surface2 text-muted hover:text-white hover:border-caramel/50'
          : 'border-stone-200 bg-white text-stone-500 hover:text-stone-900 hover:border-amber-400/60'
      )}
    >
      <span className="text-base leading-none">{isDark ? '☀️' : '🌙'}</span>
      {!compact && (
        <span className="text-xs font-medium">{isDark ? 'Açık Mod' : 'Koyu Mod'}</span>
      )}
    </button>
  );
}
