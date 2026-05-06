import type { CaseSeverity } from '@/types';
import { cn } from '@/utils/format';

interface Props {
  severity: CaseSeverity;
}

const SEVERITY_CONFIG: Record<CaseSeverity, { dot: string; text: string; label: string }> = {
  critical: {
    dot:   'bg-[var(--color-danger)]',
    text:  'text-[var(--color-danger)]',
    label: 'CRITICAL',
  },
  urgent: {
    dot:   'bg-[var(--color-warning)]',
    text:  'text-[var(--color-warning)]',
    label: 'URGENT',
  },
  routine: {
    dot:   'bg-[var(--color-success)]',
    text:  'text-[var(--color-success)]',
    label: 'ROUTINE',
  },
  normal: {
    dot:   'bg-[var(--color-text-tertiary)]',
    text:  'text-[var(--color-text-tertiary)]',
    label: 'NORMAL',
  },
};

export const SeverityBadge = ({ severity }: Props) => {
  const cfg = SEVERITY_CONFIG[severity] ?? SEVERITY_CONFIG.normal;
  return (
    <span className="inline-flex items-center gap-2">
      <span className={cn('h-2 w-2 rounded-full', cfg.dot)} />
      <span className={cn('text-[13px] font-bold tracking-[1.4px]', cfg.text)}>
        {cfg.label}
      </span>
    </span>
  );
};