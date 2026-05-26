import clsx from 'clsx';

export default function SectionHeader({ title, subtitle, children, className }) {
  return (
    <div className={clsx('flex items-center justify-between mb-5', className)}>
      <div>
        <h2 className="section-title">{title}</h2>
        {subtitle && <p className="section-subtitle mt-0.5">{subtitle}</p>}
      </div>
      {children && (
        <div className="flex items-center gap-2 flex-wrap justify-end">
          {children}
        </div>
      )}
    </div>
  );
}
