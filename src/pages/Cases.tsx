import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/AppLayout';
import { SectionTitle } from '@/components/SectionTitle';
import { CaseCard } from '@/components/CaseCard';
import { SeverityBadge } from '@/components/SeverityBadge';
import { useCases } from '@/hooks/useCases';
import type { CasesTab } from '@/hooks/useCases';
import type { CaseReview } from '@/types';
import { cn, formatRelativeTime } from '@/utils/format';

const DATASET_CHIPS: { label: string; value: string }[] = [
  { label: 'All',             value: '' },
  { label: 'PTB Diagnostic',  value: 'ptb_diagnostic' },
  { label: 'PTB-XL',         value: 'ptb_xl' },
  { label: 'CPSC 2018',      value: 'cpsc_2018' },
  { label: 'Georgia 12-Lead', value: 'georgia_12lead' },
];

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
      'flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-semibold transition-all',
      active ? 'bg-primary text-primary-foreground shadow-elevated' : 'text-muted-foreground hover:text-foreground',
    )}
  >
    <span>
      {label}
    </span>
    <span
      className={cn(
        'flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-xs',
        active ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-muted text-muted-foreground',
      )}
    >
      {count}
    </span>
  </button>
);

export const CasesPage = () => {
  const navigate = useNavigate();
  const {
    activeTab, setActiveTab,
    cases, totalCount, hasMore, page, setPage,
    tabCounts, isLoading, claimCase, isClaiming,
    search, setSearch,
  } = useCases();

  const tabs: { key: CasesTab; label: string }[] = [
    { key: 'live',      label: 'Live' },
    { key: 'claimed',   label: 'Claimed' },
    { key: 'completed', label: 'Completed' },
    { key: 'missed',    label: 'Missed' },
    { key: 'escalated', label: 'Escalated' },
  ];

  const activeChip = DATASET_CHIPS.find((c) => c.value === search)?.value ?? '';

  return (
    <AppLayout>
      <header className="mb-6">
        <h1 className="font-display text-2xl font-bold md:text-3xl">Cases</h1>
        <p className="text-sm text-muted-foreground">Triage queue and complete review history.</p>
      </header>

      {/* Status tabs */}
      <div className="mb-5 flex gap-1.5 overflow-x-auto rounded-full border border-border bg-card p-1.5">
        {tabs.map((t) => (
          <Tab key={t.key} label={t.label} count={tabCounts[t.key]}
            active={activeTab === t.key} onClick={() => setActiveTab(t.key)} />
        ))}
      </div>

      {/* Search result count */}
      {search && !isLoading && (
        <p className="mb-3 text-[13px] text-[var(--color-text-tertiary)]">
          {totalCount} result{totalCount !== 1 ? 's' : ''} for{' '}
          <span className="font-semibold text-[var(--color-text-primary)]">"{search}"</span>
          {' '}in {activeTab} cases
        </p>
      )}

      {/* Cases content */}
      {isLoading ? (
        <p className="py-10 text-center text-[var(--color-text-tertiary)]">Loading cases…</p>
      ) : cases.length === 0 ? (
        <p className="py-10 text-center text-[var(--color-text-tertiary)]">
          {search
            ? `No ${activeTab} cases matching "${search}" in your assigned patients.`
            : `No ${activeTab} cases in your assigned patients.`}
        </p>
      ) : activeTab === 'live' || activeTab === 'claimed' ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {cases.map((c) => (
            <CaseCard key={c.id} caseItem={c} isClaiming={isClaiming}
              onClick={() => navigate(`/case/${c.id}`)}
              onClaim={() => claimCase(c.id, { onSuccess: () => navigate(`/case/${c.id}`) })}
              showClaim={activeTab === 'live'} />
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[var(--color-divider)] bg-[var(--color-surface)]">
          <div className="grid grid-cols-[1fr_2fr_1fr_1fr_2fr] border-b border-[var(--color-divider)] px-6 py-3">
            {['CASE', 'ANOMALY', 'SEVERITY', 'WHEN', 'OUTCOME'].map((h) => (
              <span key={h} className="eyebrow text-[11px] tracking-[1.2px] text-[var(--color-text-tertiary)]">{h}</span>
            ))}
          </div>
          {(cases as CaseReview[]).map((c, i) => (
            <div key={c.id} onClick={() => navigate(`/case/${c.id}`)}
              className={cn(
                'grid cursor-pointer grid-cols-[1fr_2fr_1fr_1fr_2fr] items-center px-6 py-4 transition hover:bg-[var(--color-bg-alt)]',
                i !== cases.length - 1 && 'border-b border-[var(--color-divider)]',
              )}
            >
              <span className="text-[13px] font-mono text-[var(--color-text-tertiary)]">{c.patient_code}</span>
              <div>
                <p className="text-[14px] font-semibold text-[var(--color-text-primary)]">
                  {c.display_diagnosis || c.diagnosis || '—'}
                </p>
                <p className="text-[12px] text-[var(--color-text-tertiary)]">
                  {c.sex} · {c.age}y · {c.dataset_source_display}
                </p>
              </div>
              <SeverityBadge severity={c.severity} />
              <span className="text-[13px] text-[var(--color-text-secondary)]">
                {formatRelativeTime(c.completed_at ?? c.created_at)}
              </span>
              <span className="text-[13px] text-[var(--color-text-secondary)]">{c.notes || '—'}</span>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 flex flex-col items-center gap-3">
        <p className="text-[13px] text-[var(--color-text-tertiary)]">
          {cases.length} of {totalCount} cases
        </p>
        {hasMore && (
          <button onClick={() => setPage(page + 1)}
            className="rounded-pill border border-[var(--color-divider)] bg-[var(--color-surface)] px-6 py-3 text-[14px] font-semibold text-[var(--color-text-primary)] transition hover:bg-[var(--color-bg-alt)]">
            Load more
          </button>
        )}
      </div>
    </AppLayout>
  );
};