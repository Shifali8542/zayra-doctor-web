import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/AppLayout';
import { SectionTitle } from '@/components/SectionTitle';
import { CaseCard } from '@/components/CaseCard';
import { SeverityBadge } from '@/components/SeverityBadge';
import { useCases } from '@/hooks/useCases';
import type { CasesTab } from '@/hooks/useCases';
import type { CaseReview } from '@/types';
import { cn, formatRelativeTime } from '@/utils/format';

interface TabProps {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}

const Tab = ({ label, count, active, onClick }: TabProps) => (
  <button
    onClick={onClick}
    className={cn(
      'flex items-center gap-2 rounded-pill px-5 py-3 transition-colors',
      active && 'bg-[var(--color-primary)]',
    )}
  >
    <span className={cn('text-[15px] font-semibold', active ? 'text-white' : 'text-[var(--color-text-primary)]')}>
      {label}
    </span>
    <span
      className={cn(
        'flex h-[22px] min-w-[26px] items-center justify-center rounded-pill px-2 text-[13px] font-bold',
        active ? 'bg-white/20 text-white' : 'bg-[var(--color-divider)] text-[var(--color-text-primary)]',
      )}
    >
      {count}
    </span>
  </button>
);

export const CasesPage = () => {
  const navigate = useNavigate();
  const {
    activeTab,
    setActiveTab,
    cases,
    totalCount,
    hasMore,
    page,
    setPage,
    tabCounts,
    isLoading,
    claimCase,
    isClaiming,
  } = useCases();

  const tabs: { key: CasesTab; label: string }[] = [
    { key: 'live',      label: 'Live' },
    { key: 'claimed',   label: 'Claimed' },
    { key: 'completed', label: 'Completed' },
    { key: 'missed',    label: 'Missed' },
    { key: 'escalated', label: 'Escalated' },
  ];

  return (
    <AppLayout>
      <SectionTitle
        title="Cases"
        subtitle="Triage queue and complete review history."
        className="mt-4"
      />

      {/* Status tabs */}
      <div className="mb-5 rounded-pill border border-[var(--color-divider)] bg-[var(--color-surface)] p-1">
        <div className="scrollbar-hide flex gap-1 overflow-x-auto">
          {tabs.map((t) => (
            <Tab
              key={t.key}
              label={t.label}
              count={tabCounts[t.key]}
              active={activeTab === t.key}
              onClick={() => setActiveTab(t.key)}
            />
          ))}
        </div>
      </div>

      {/* Cases content — cards for live/claimed, table for completed/escalated/missed */}
      {isLoading ? (
        <p className="py-10 text-center text-[var(--color-text-tertiary)]">Loading cases…</p>
      ) : cases.length === 0 ? (
        <p className="py-10 text-center text-[var(--color-text-tertiary)]">
          No {activeTab} cases.
        </p>
      ) : activeTab === 'live' || activeTab === 'claimed' ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {cases.map((c) => (
            <CaseCard
              key={c.id}
              caseItem={c}
              isClaiming={isClaiming}
              onClick={() => navigate(`/case/${c.id}`)}
              onClaim={() => claimCase(c.id, {
                onSuccess: () => navigate(`/case/${c.id}`),
              })}
              showClaim={activeTab === 'live'}
            />
          ))}
        </div>
      ) : (
        /* Table view for completed / escalated / missed */
        <div className="overflow-hidden rounded-2xl border border-[var(--color-divider)] bg-[var(--color-surface)]">
          {/* Table header */}
          <div className="grid grid-cols-[1fr_2fr_1fr_1fr_2fr_0.7fr] border-b border-[var(--color-divider)] px-6 py-3">
            {['CASE', 'ANOMALY', 'SEVERITY', 'WHEN', 'OUTCOME', 'PAYOUT'].map((h) => (
              <span key={h} className="eyebrow text-[11px] tracking-[1.2px] text-[var(--color-text-tertiary)]">
                {h}
              </span>
            ))}
          </div>
          {/* Table rows */}
          {(cases as CaseReview[]).map((c, i) => (
            <div
              key={c.id}
              onClick={() => navigate(`/case/${c.id}`)}
              className={cn(
                'grid cursor-pointer grid-cols-[1fr_2fr_1fr_1fr_2fr_0.7fr] items-center px-6 py-4 transition hover:bg-[var(--color-bg-alt)]',
                i !== cases.length - 1 && 'border-b border-[var(--color-divider)]',
              )}
            >
              {/* Case ID */}
              <span className="text-[13px] font-mono text-[var(--color-text-tertiary)]">
                {c.patient_code}
              </span>
              {/* Anomaly */}
              <div>
                <p className="text-[14px] font-semibold text-[var(--color-text-primary)]">
                  {c.display_diagnosis || c.diagnosis || '—'}
                </p>
                <p className="text-[12px] text-[var(--color-text-tertiary)]">
                  {c.sex} · {c.age}y · {c.patient_code}
                </p>
              </div>
              {/* Severity */}
              <SeverityBadge severity={c.severity} />
              {/* When */}
              <span className="text-[13px] text-[var(--color-text-secondary)]">
                {formatRelativeTime(c.completed_at ?? c.created_at)}
              </span>
              {/* Outcome — doctor's notes */}
              <span className="text-[13px] text-[var(--color-text-secondary)]">
                {(c as unknown as { outcome?: string }).outcome || c.notes || '—'}
              </span>
              {/* Payout — placeholder until earnings backend */}
              <span className="text-right text-[14px] font-bold text-[var(--color-text-primary)]">
                —
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 flex flex-col items-center gap-3">
        <p className="text-[13px] text-[var(--color-text-tertiary)]">
          {cases.length} of {totalCount} cases
        </p>
        {hasMore && (
          <button
            onClick={() => setPage(page + 1)}
            className="rounded-pill border border-[var(--color-divider)] bg-[var(--color-surface)] px-6 py-3 text-[14px] font-semibold text-[var(--color-text-primary)] transition hover:bg-[var(--color-bg-alt)]"
          >
            Load more
          </button>
        )}
      </div>
    </AppLayout>
  );
};