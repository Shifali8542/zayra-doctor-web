import type { InputHTMLAttributes } from 'react';
import { Icon, type IconName } from './Icon';
import { cn } from '@/utils/format';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  iconLeft?: IconName;
  rightSlot?: React.ReactNode;
  containerClassName?: string;
}

export const Input = ({
  label,
  error,
  iconLeft,
  rightSlot,
  containerClassName,
  className,
  ...rest
}: InputProps) => {
  return (
    <div className={cn('w-full', containerClassName)}>
      {label ? (
        <label className="mb-2 block text-[13px] font-medium text-[var(--color-text-secondary)]">
          {label}
        </label>
      ) : null}
      <div
        className={cn(
          'flex items-center gap-3 rounded-lg border bg-[var(--color-surface)] px-4 min-h-[52px]',
          error
            ? 'border-[var(--color-danger)]'
            : 'border-[var(--color-border)] focus-within:border-[var(--color-primary)]',
          'transition-colors',
        )}
      >
        {iconLeft ? (
          <Icon
            name={iconLeft}
            size={18}
            color="var(--color-text-tertiary)"
          />
        ) : null}
        <input
          {...rest}
          className={cn(
            'flex-1 bg-transparent py-3 text-[14px] text-[var(--color-text-primary)] outline-none',
            'placeholder:text-[var(--color-text-tertiary)]',
            className,
          )}
        />
        {rightSlot}
      </div>
      {error ? (
        <p className="mt-1 text-xs text-[var(--color-danger)]">{error}</p>
      ) : null}
    </div>
  );
};
