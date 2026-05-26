import { getBrand } from '../../constants/brands';
import clsx from 'clsx';

export default function BrandBadge({ brandId, size = 'md', showDot = true }) {
  const brand = getBrand(brandId);
  if (!brand) return null;

  const sizeClasses = {
    xs: 'text-[10px] px-1.5 py-0.5 gap-1',
    sm: 'text-xs px-2 py-0.5 gap-1.5',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2',
  };

  const dotSizes = { xs: 'h-1.5 w-1.5', sm: 'h-2 w-2', md: 'h-2 w-2', lg: 'h-2.5 w-2.5' };

  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full font-medium',
        sizeClasses[size] || sizeClasses.md
      )}
      style={{
        backgroundColor: brand.bgColor || `${brand.color}20`,
        color: brand.textColor || brand.color,
      }}
    >
      {showDot && (
        <span
          className={clsx('rounded-full flex-shrink-0', dotSizes[size] || dotSizes.md)}
          style={{ backgroundColor: brand.color }}
        />
      )}
      {brand.name}
    </span>
  );
}
