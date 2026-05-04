import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/AppLayout';
import { SectionTitle } from '@/components/SectionTitle';
import { CaseCard } from '@/components/CaseCard';
import { Card } from '@/components/Card';
import { SeverityBadge } from '@/components/SeverityBadge';
import { useCases, type CasesTab } from '@/hooks/useCases';
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
    <span
      className={cn(
        'text-[15px] font-semibold',
        active ? 'text-white' : 'text-[var(--color-text-primary)]',
      )}
    >
      {label}
    </span>
    <span
      className={cn(
        'flex h-[22px] min-w-[26px] items-center justify-center rounded-pill px-2 text-[13px] font-bold',
        active
          ? 'bg-white/20 text-white'
          : 'bg-[var(--color-divider)] text-[var(--color-text-primary)]',
      )}
    >
      {count}
    </span>
  </button>
);

export const CasesPage = () => {
  const navigate = useNavigate();
  const { activeTab, setActiveTab, data, counts } = useCases();

  const tabs: { key: CasesTab; label: string; count: number }[] = [
    { key: 'live', label: 'Live', count: counts.live },
    { key: 'claimed', label: 'Claimed', count: counts.claimed },
    { key: 'completed', label: 'Completed', count: counts.completed },
  ];

  return (
    <AppLayout>
      <SectionTitle
        title="Cases"
        subtitle="Triage queue and complete review history."
        className="mt-4"
      />

      {/* Tabs */}
      <div className="mb-5 rounded-pill border border-[var(--color-divider)] bg-[var(--color-surface)] p-1">
        <div className="scrollbar-hide flex gap-1 overflow-x-auto">
          {tabs.map((t) => (
            <Tab
              key={t.key}
              label={t.label}
              count={t.count}
              active={activeTab === t.key}
              onClick={() => setActiveTab(t.key)}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      {activeTab !== 'completed' ? (
        data.length === 0 ? (
          <p className="py-10 text-center text-[var(--color-text-tertiary)]">
            No cases here yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {data.map((c) => (
              <CaseCard
                key={c.id}
                caseItem={c}
                onClick={() => navigate(`/case/${c.id}`)}
                onClaim={() => navigate(`/case/${c.id}`)}
              />
            ))}
          </div>
        )
      ) : (
        <Card className="!px-4">
          <div className="mb-2 flex border-b border-[var(--color-divider)] py-3">
            <span className="eyebrow flex-1 text-[11px] tracking-[1.2px] text-[var(--color-text-tertiary)]">
              CASE
            </span>
            <span className="eyebrow flex-[1.6] text-[11px] tracking-[1.2px] text-[var(--color-text-tertiary)]">
              ANOMALY
            </span>
            <span className="eyebrow flex-1 text-[11px] tracking-[1.2px] text-[var(--color-text-tertiary)]">
              SEVERITY
            </span>
          </div>
          {data.map((c, i) => (
            <div
              key={c.id}
              className={cn(
                'flex items-start py-4',
                i !== data.length - 1 && 'border-b border-[var(--color-divider)]',
              )}
            >
              <div className="flex-1">
                <span className="text-[14px] text-[var(--color-text-tertiary)]">
                  {c.caseId}
                </span>
              </div>
              <div className="flex-[1.6]">
                <p className="mb-1 text-[14px] font-semibold leading-5 text-[var(--color-text-primary)]">
                  {c.anomaly}
                </p>
                <p className="text-[13px] text-[var(--color-text-tertiary)]">
                  {c.patientSex} · {c.patientAge}y · {c.patientId}
                </p>
              </div>
              <div className="flex-1">
                <SeverityBadge severity={c.severity} />
              </div>
            </div>
          ))}
        </Card>
      )}
    </AppLayout>
  );
};
