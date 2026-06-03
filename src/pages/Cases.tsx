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
    activeTab, setActiveTab,
    cases, totalCount, hasMore, page, setPage,
    tabCounts, isLoading, claimCase, isClaiming,
    search, setSearch,
    assignedCount,
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
      <SectionTitle
        title="Cases"
        subtitle={
          assignedCount > 0
            ? `Your assigned ${assignedCount} patients — triage queue and complete review history.`
            : 'Triage queue and complete review history.'
        }
        className="mt-4"
      />

      {/* Search + Dataset filter */}
      <div className="mb-4 flex flex-col gap-3">
        <div className="flex items-center gap-2 rounded-xl border border-[var(--color-divider)] bg-[var(--color-surface)] px-4 py-2.5">
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none"
            stroke="var(--color-text-tertiary)" strokeWidth={2}
            strokeLinecap="round" strokeLinejoin="round">
            <circle cx={11} cy={11} r={8} />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search by patient code, diagnosis, or dataset…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-[14px] text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-tertiary)]"
          />
          {search && (
            <button onClick={() => setSearch('')}
              className="text-[var(--color-text-tertiary)] transition hover:text-[var(--color-text-primary)]">
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth={2.5}
                strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* <div className="flex flex-wrap gap-2">
          <span className="self-center text-[12px] text-[var(--color-text-tertiary)] mr-1">Dataset:</span>
          {DATASET_CHIPS.map((chip) => (
            <button
              key={chip.value}
              onClick={() => setSearch(chip.value)}
              className={cn(
                'rounded-pill border px-3 py-1 text-[12px] font-semibold transition',
                activeChip === chip.value
                  ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white'
                  : 'border-[var(--color-divider)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]',
              )}
            >
              {chip.label}
            </button>
          ))}
        </div> */}
      </div>

      {/* Status tabs */}
      <div className="mb-5 rounded-pill border border-[var(--color-divider)] bg-[var(--color-surface)] p-1">
        <div className="scrollbar-hide flex gap-1 overflow-x-auto">
          {tabs.map((t) => (
            <Tab key={t.key} label={t.label} count={tabCounts[t.key]}
              active={activeTab === t.key} onClick={() => setActiveTab(t.key)} />
          ))}
        </div>
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