import { Icon, type IconName } from './Icon';
import { cn } from '@/utils/format';

interface Props {
  label: string;
  value: string | number;
  unit?: string;
  delta?: string;
  subscript?: string;
  icon?: IconName;
  className?: string;
  large?: boolean;
}

export const MetricCard = ({
  label,
  value,
  unit,
  delta,
  subscript,
  icon,
  className,
  large = false,
}: Props) => {
  return (
    <div
      className={cn(
        'flex-1 rounded-lg border border-[var(--color-divider)] bg-[var(--color-surface)]',
        large ? 'min-h-[96px] px-4 py-4' : 'min-h-[76px] px-3 py-3',
        className,
      )}
    >
      <div className="mb-2 flex items-center gap-1">
        {icon ? (
          <Icon name={icon} size={14} color="var(--color-text-tertiary)" />
        ) : null}
        <span className="eyebrow truncate text-[11px] tracking-[1px] text-[var(--color-text-tertiary)]">
          {label}
          {subscript ? (
            <span className="text-[9px]">{subscript}</span>
          ) : null}
        </span>
      </div>
      <div className="flex items-baseline gap-1">
        <span
          className={cn(
            'font-bold text-[var(--color-text-primary)]',
            large ? 'text-[22px] leading-[26px]' : 'text-[18px] leading-7',
          )}
        >
          {value}
        </span>
        {unit ? (
          <span className="text-[12px] text-[var(--color-text-tertiary)]">
            {unit}
          </span>
        ) : null}
        {delta ? (
          <span className="ml-2 text-[12px] font-semibold text-[var(--color-text-tertiary)]">
            {delta}
          </span>
        ) : null}
      </div>
    </div>
  );
};
