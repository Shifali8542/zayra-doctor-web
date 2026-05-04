import { AppLayout } from '@/components/AppLayout';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import {
  mockEarningsSummary,
  mockEarningsBySeverity,
  mockEarningsReviews,
} from '@/mocks/mockData';
import { formatCurrency, cn } from '@/utils/format';
import type { EarningsBySeverity, EarningsReviewRow } from '@/types';

const SummaryTile = ({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) => (
  <div
    className={cn(
      'rounded-2xl p-5 transition',
      accent
        ? 'hero-gradient text-white shadow-card'
        : 'border border-[var(--color-divider)] bg-[var(--color-surface)] text-[var(--color-text-primary)]',
    )}
  >
    <p
      className={cn(
        'eyebrow mb-3 text-[11px] tracking-[1.4px]',
        accent ? 'text-white/80' : 'text-[var(--color-text-tertiary)]',
      )}
    >
      {label}
    </p>
    <p
      className={cn(
        'text-[28px] font-bold leading-[32px] lg:text-[32px] lg:leading-[36px]',
        accent ? 'text-white' : 'text-[var(--color-text-primary)]',
      )}
    >
      {formatCurrency(value)}
    </p>
  </div>
);

const SeverityBar = ({ row }: { row: EarningsBySeverity }) => (
  <div>
    <div className="mb-2 flex items-baseline justify-between">
      <span className="text-[14px] text-[var(--color-text-primary)]">
        {row.label}
      </span>
      <span className="text-[14px] font-bold text-[var(--color-text-primary)]">
        {formatCurrency(row.amount)}
      </span>
    </div>
    <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--color-divider)]">
      <div
        className="h-full rounded-full"
        style={{
          width: `${Math.min(100, Math.max(0, row.fillPct * 100))}%`,
          backgroundImage:
            'linear-gradient(90deg, var(--color-primary) 0%, var(--color-accent) 100%)',
        }}
      />
    </div>
  </div>
);

const statusClass = (status: EarningsReviewRow['status']) =>
  status === 'Settled'
    ? 'text-[var(--color-success)]'
    : status === 'Pending'
      ? 'text-[var(--color-warning)]'
      : 'text-[var(--color-text-secondary)]';

const severityDot = (sev: EarningsReviewRow['severity']) =>
  sev === 'Critical'
    ? 'bg-[var(--color-danger)]'
    : sev === 'Urgent'
      ? 'bg-[var(--color-warning)]'
      : sev === 'Routine'
        ? 'bg-[var(--color-success)]'
        : 'bg-[var(--color-text-tertiary)]';

export const EarningsPage = () => {
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

      {/* Summary tiles */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryTile label="TODAY" value={mockEarningsSummary.today} accent />
        <SummaryTile label="THIS WEEK" value={mockEarningsSummary.thisWeek} />
        <SummaryTile label="THIS MONTH" value={mockEarningsSummary.thisMonth} />
        <SummaryTile
          label="PENDING PAYOUT"
          value={mockEarningsSummary.pendingPayout}
        />
      </div>

      {/* By-severity + Next payout */}
      <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-[1.6fr_1fr]">
        <Card>
          <h2 className="mb-5 text-[18px] font-bold text-[var(--color-text-primary)]">
            Earnings by severity (30d)
          </h2>
          <div className="flex flex-col gap-5">
            {mockEarningsBySeverity.map((row) => (
              <SeverityBar key={row.key} row={row} />
            ))}
          </div>
        </Card>

        <div className="hero-gradient rounded-2xl p-6 lg:p-7">
          <p className="text-[18px] font-bold text-white">Next payout</p>
          <p className="mb-5 mt-1 text-[14px] text-white/80">
            {mockEarningsSummary.nextSettlementLabel}
          </p>
          <p className="mb-6 text-[40px] font-bold leading-[44px] text-white">
            {formatCurrency(mockEarningsSummary.pendingPayout)}
          </p>
          <Button
            label="Withdraw to bank"
            variant="glass"
            size="lg"
            iconLeft="arrow-down"
            fullWidth
          />
        </div>
      </div>

      {/* Recent reviews */}
      <Card className="mt-5 !p-0">
        <div className="px-5 py-5 lg:px-6">
          <h2 className="text-[18px] font-bold text-[var(--color-text-primary)]">
            Recent reviews
          </h2>
        </div>

        {/* Header — desktop only */}
        <div className="hidden border-b border-[var(--color-divider)] px-6 pb-3 lg:grid lg:grid-cols-[1.2fr_1fr_1fr_1fr_0.8fr]">
          <span className="eyebrow text-[11px] tracking-[1.2px] text-[var(--color-text-tertiary)]">
            CASE
          </span>
          <span className="eyebrow text-[11px] tracking-[1.2px] text-[var(--color-text-tertiary)]">
            SEVERITY
          </span>
          <span className="eyebrow text-[11px] tracking-[1.2px] text-[var(--color-text-tertiary)]">
            TIME
          </span>
          <span className="eyebrow text-[11px] tracking-[1.2px] text-[var(--color-text-tertiary)]">
            STATUS
          </span>
          <span className="eyebrow text-right text-[11px] tracking-[1.2px] text-[var(--color-text-tertiary)]">
            PAYOUT
          </span>
        </div>

        {/* Rows */}
        <div className="divide-y divide-[var(--color-divider)]">
          {mockEarningsReviews.map((r) => (
            <div
              key={r.caseId}
              className="grid grid-cols-2 gap-y-2 px-5 py-4 lg:grid-cols-[1.2fr_1fr_1fr_1fr_0.8fr] lg:items-center lg:gap-0 lg:px-6"
            >
              {/* Case */}
              <div className="lg:col-auto">
                <p className="font-mono text-[13px] text-[var(--color-text-primary)]">
                  {r.caseId}
                </p>
              </div>

              {/* Severity */}
              <div className="flex items-center gap-2 lg:col-auto">
                <span
                  className={cn('h-2 w-2 rounded-full', severityDot(r.severity))}
                />
                <span className="text-[14px] text-[var(--color-text-primary)]">
                  {r.severity}
                </span>
              </div>

              {/* Time */}
              <div className="lg:col-auto">
                <span className="text-[14px] text-[var(--color-text-secondary)]">
                  {r.timeLabel}
                </span>
              </div>

              {/* Status */}
              <div className="lg:col-auto">
                <span
                  className={cn(
                    'text-[14px] font-bold',
                    statusClass(r.status),
                  )}
                >
                  {r.status}
                </span>
              </div>

              {/* Payout */}
              <div className="text-right lg:col-auto">
                <span className="text-[14px] font-bold text-[var(--color-text-primary)]">
                  {formatCurrency(r.payoutUsd)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </AppLayout>
  );
};