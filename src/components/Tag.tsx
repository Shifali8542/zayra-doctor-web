import type { ReactNode } from 'react';
import { cn } from '@/utils/format';

interface TagProps {
  label: string;
  variant?: 'default' | 'soft' | 'outline';
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  className?: string;
  onDark?: boolean;
}

export const Tag = ({
  label,
  variant = 'soft',
  leftIcon,
  rightIcon,
  className,
  onDark = false,
}: TagProps) => {
  const variantClasses =
    variant === 'soft'
      ? onDark
        ? 'bg-white/12'
        : 'bg-[var(--color-bg-alt)]'
      : variant === 'default'
        ? 'bg-[var(--color-bg-alt)]'
        : 'bg-transparent border border-[var(--color-border)]';

  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-pill px-4 py-2 text-[13px] font-medium',
        onDark ? 'text-white' : 'text-[var(--color-text-primary)]',
        variantClasses,
        className,
      )}
    >
      {leftIcon}
      <span className="truncate">{label}</span>
      {rightIcon}
    </span>
  );
};
