import type { ReactNode } from 'react';
import { cn } from '@/utils/format';

interface Props {
  title: string;
  subtitle?: string | ReactNode;
  className?: string;
}

export const SectionTitle = ({ title, subtitle, className }: Props) => (
  <div className={cn('mb-4', className)}>
    <h2 className="mb-2 text-[22px] font-bold leading-[26px] text-[var(--color-text-primary)]">
      {title}
    </h2>
    {subtitle ? (
      <p className="text-[13px] leading-5 text-[var(--color-text-secondary)]">
        {subtitle}
      </p>
    ) : null}
  </div>
);