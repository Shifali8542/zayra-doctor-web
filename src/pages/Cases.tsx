import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/AppLayout';
import { SectionTitle } from '@/components/SectionTitle';
import { CaseCard } from '@/components/CaseCard';
import { useCases } from '@/hooks/useCases';
import type { CasesTab } from '@/hooks/useCases';
import { cn } from '@/utils/format';

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

      {/* Cases grid */}
      {isLoading ? (
        <p className="py-10 text-center text-[var(--color-text-tertiary)]">Loading cases…</p>
      ) : cases.length === 0 ? (
        <p className="py-10 text-center text-[var(--color-text-tertiary)]">
          No {activeTab} cases.
        </p>
      ) : (
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
      )}

      <p className="mt-4 text-center text-[13px] text-[var(--color-text-tertiary)]">
        {totalCount} total · showing {cases.length}
      </p>
    </AppLayout>
  );
};