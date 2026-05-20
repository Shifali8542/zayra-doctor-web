import { AppLayout } from '@/components/AppLayout';
import { Card } from '@/components/Card';
import { formatCurrency, cn } from '@/utils/format';
import { useQuery } from '@tanstack/react-query';
import { earningsApi, API_ENDPOINTS } from '@/services/api';
import type { CaseReview } from '@/types';
import { formatRelativeTime } from '@/utils/format';

export const EarningsPage = () => {
  const completedQ = useQuery({
    queryKey: [API_ENDPOINTS.caseList, 'completed', 'earnings'],
    queryFn: () => earningsApi.getCompleted({ page_size: 50 }),
  });

  const cases: CaseReview[] = completedQ.data?.results ?? [];

  return (
    <AppLayout>
      <div className="mt-4">
        <h1 className="text-[28px] font-bold leading-[34px] text-[var(--color-text-primary)] lg:text-[32px]">
          Earnings
        </h1>
        <p className="mt-1 text-[14px] text-[var(--color-text-secondary)]">
          Reviewed cases, payouts and settlements.
        </p>
      </div>

      {/* Recent reviews — real completed cases from backend */}
      <Card className="mt-6 !p-0">
        <div className="px-5 py-5 lg:px-6">
          <h2 className="text-[18px] font-bold text-[var(--color-text-primary)]">
            Completed reviews
          </h2>
          <p className="mt-1 text-[13px] text-[var(--color-text-tertiary)]">
            {completedQ.data?.count ?? 0} total completed cases
          </p>
        </div>

        {/* Header */}
        <div className="hidden border-b border-[var(--color-divider)] px-6 pb-3 lg:grid lg:grid-cols-[1.2fr_2fr_1fr_1fr]">
          {['CASE', 'DIAGNOSIS', 'SEVERITY', 'WHEN'].map((h) => (
            <span key={h} className="eyebrow text-[11px] tracking-[1.2px] text-[var(--color-text-tertiary)]">
              {h}
            </span>
          ))}
        </div>

        {completedQ.isLoading && (
          <p className="px-6 py-8 text-[14px] text-[var(--color-text-tertiary)]">Loading…</p>
        )}

        <div className="divide-y divide-[var(--color-divider)]">
          {cases.map((c) => (
            <div
              key={c.id}
              className="grid grid-cols-2 gap-y-2 px-5 py-4 lg:grid-cols-[1.2fr_2fr_1fr_1fr] lg:items-center lg:gap-0 lg:px-6"
            >
              <span className="font-mono text-[13px] text-[var(--color-text-tertiary)]">
                {c.patient_code}
              </span>
              <span className="text-[14px] font-semibold text-[var(--color-text-primary)]">
                {c.display_diagnosis || c.diagnosis || '—'}
              </span>
              <span className={cn(
                'text-[13px] font-bold capitalize',
                c.severity === 'critical' && 'text-[var(--color-danger)]',
                c.severity === 'urgent' && 'text-[var(--color-warning)]',
                c.severity === 'routine' && 'text-[var(--color-success)]',
                c.severity === 'normal' && 'text-[var(--color-text-tertiary)]',
              )}>
                {c.severity}
              </span>
              <span className="text-[13px] text-[var(--color-text-secondary)]">
                {formatRelativeTime(c.completed_at ?? c.created_at)}
              </span>
            </div>
          ))}

          {!completedQ.isLoading && cases.length === 0 && (
            <p className="px-6 py-8 text-[14px] text-[var(--color-text-tertiary)]">
              No completed cases yet.
            </p>
          )}
        </div>
      </Card>
    </AppLayout>
  );
};