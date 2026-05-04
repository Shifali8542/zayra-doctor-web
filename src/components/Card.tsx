import type { ReactNode, CSSProperties } from 'react';
import { cn } from '@/utils/format';

interface CardProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
  elevated?: boolean;
}

export const Card = ({
  children,
  className,
  style,
  onClick,
  elevated = true,
}: CardProps) => {
  const base =
    'rounded-2xl p-5 transition-all';
  const surface = 'bg-[var(--color-surface)]';
  const shadow = elevated ? 'shadow-card' : '';
  const interactive = onClick
    ? 'cursor-pointer hover:opacity-95 active:scale-[0.997]'
    : '';

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn(base, surface, shadow, interactive, 'text-left w-full', className)}
        style={style}
      >
        {children}
      </button>
    );
  }
  return (
    <div className={cn(base, surface, shadow, className)} style={style}>
      {children}
    </div>
  );
};
