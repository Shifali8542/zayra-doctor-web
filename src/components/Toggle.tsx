import { cn } from '@/utils/format';

interface ToggleProps {
  value: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
}

export const Toggle = ({ value, onChange, disabled = false }: ToggleProps) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      disabled={disabled}
      onClick={() => onChange(!value)}
      className={cn(
        'relative inline-flex h-[26px] w-11 shrink-0 items-center rounded-full transition-colors duration-200',
        value ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-divider)]',
        disabled && 'opacity-50 cursor-not-allowed',
      )}
    >
      <span
        className={cn(
          'inline-block h-[22px] w-[22px] transform rounded-full bg-white shadow transition-transform duration-200',
          value ? 'translate-x-[22px]' : 'translate-x-[2px]',
        )}
      />
    </button>
  );
};
