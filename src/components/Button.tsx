import type { ReactNode } from 'react';
import { Icon, type IconName } from './Icon';
import { cn } from '@/utils/format';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'glass';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  label: string;
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  iconLeft?: IconName;
  iconRight?: IconName;
  className?: string;
  type?: 'button' | 'submit';
  rightAdornment?: ReactNode;
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'py-2 px-4 min-h-[36px] text-[13px]',
  md: 'py-3 px-5 min-h-[44px] text-[15px]',
  lg: 'py-4 px-6 min-h-[52px] text-base',
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]',
  secondary:
    'bg-[var(--color-surface)] text-[var(--color-text-primary)] border border-[var(--color-border)] hover:bg-[var(--color-surface-alt)]',
  ghost:
    'bg-transparent text-[var(--color-primary)] hover:bg-[var(--color-bg-alt)]',
  glass:
    'bg-white/10 text-white border border-white/20 hover:bg-white/15 backdrop-blur',
};

const iconSizes: Record<ButtonSize, number> = { sm: 14, md: 16, lg: 20 };

export const Button = ({
  label,
  onClick,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  iconLeft,
  iconRight,
  className,
  type = 'button',
  rightAdornment,
}: ButtonProps) => {
  const iconColor =
    variant === 'primary' || variant === 'glass'
      ? '#FFFFFF'
      : 'var(--color-primary)';

  return (
    <button
      type={type}
      onClick={(e) => onClick?.(e)}
      disabled={disabled || loading}
      className={cn(
        'rounded-pill inline-flex items-center justify-center font-semibold tracking-[0.2px] transition-all',
        'disabled:opacity-50 active:scale-[0.985]',
        sizeClasses[size],
        variantClasses[variant],
        fullWidth && 'w-full',
        className,
      )}
    >
      {loading ? (
        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        <span className="inline-flex items-center justify-center">
          {iconLeft ? (
            <span className="mr-2 inline-flex">
              <Icon name={iconLeft} size={iconSizes[size]} color={iconColor} />
            </span>
          ) : null}
          <span className="whitespace-nowrap">{label}</span>
          {iconRight ? (
            <span className="ml-2 inline-flex">
              <Icon name={iconRight} size={iconSizes[size]} color={iconColor} />
            </span>
          ) : null}
          {rightAdornment}
        </span>
      )}
    </button>
  );
};
