import type { Severity } from '@/types';

interface Props {
  severity: Severity;
}

export const SeverityBadge = ({ severity }: Props) => {
  return (
    <span className="inline-flex items-center">
      <span className="mr-2 h-2 w-2 rounded-full bg-[var(--color-text-primary)]" />
      <span className="text-[13px] font-bold tracking-[1.4px] text-[var(--color-text-primary)]">
        {severity}
      </span>
    </span>
  );
};
