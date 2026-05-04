import { AppLayout } from '@/components/AppLayout';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { EcgWaveform } from '@/components/Waveform';
import { Icon } from '@/components/Icon';
import {
  mockAtlasStats,
  mockAtlasFeatured,
  mockAtlasContinue,
} from '@/mocks/mockData';
import type { AtlasCase } from '@/types';
import { cn } from '@/utils/format';

const TagPill = ({ label }: { label: string }) => (
  <span className="rounded-pill bg-[var(--color-bg-alt)] px-3 py-1.5 text-[11px] font-bold tracking-[1.2px] text-[var(--color-text-secondary)]">
    {label}
  </span>
);

const AtlasCaseCard = ({ caseItem }: { caseItem: AtlasCase }) => {
  const seedFromId = caseItem.id
    .split('')
    .reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return (
    <Card className="flex flex-col overflow-hidden !p-0 transition hover:shadow-[0_8px_24px_rgba(10,37,64,0.08)]">
      {/* Dark ECG strip */}
      <div className="relative">
        <EcgWaveform
          severity={caseItem.difficulty === 'ADVANCED' ? 'critical' : 'urgent'}
          height={140}
          seed={seedFromId}
          className="!rounded-none"
        />
        <span className="absolute left-4 top-3 text-[11px] font-bold tracking-[1.4px] text-white/70">
          {caseItem.category}
        </span>
        <span className="absolute right-4 top-3 text-[11px] font-bold tracking-[1.4px] text-white/70">
          {caseItem.durationMin} MIN
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="mb-3 text-[18px] font-bold leading-7 text-[var(--color-text-primary)]">
          {caseItem.title}
        </h3>
        <div className="mb-4 mt-auto flex items-center justify-between">
          <TagPill label={caseItem.difficulty} />
          <button className="text-[13px] font-bold text-[var(--color-primary)] transition hover:opacity-70">
            Open →
          </button>
        </div>
      </div>
    </Card>
  );
};

export const EcgAtlasPage = () => {
  return (
    <AppLayout>
      {/* Page header */}
      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold leading-[34px] text-[var(--color-text-primary)] lg:text-[32px]">
            ECG Atlas
          </h1>
          <p className="mt-1 text-[14px] text-[var(--color-text-secondary)]">
            Case-based learning · expert-reviewed · anonymized
          </p>
        </div>
        <div className="flex items-center gap-4 rounded-pill border border-[var(--color-divider)] bg-[var(--color-surface)] px-4 py-2">
          <span className="flex items-center gap-2 text-[13px] font-semibold text-[var(--color-text-primary)]">
            <Icon
              name="trophy"
              size={14}
              color="var(--color-text-primary)"
              strokeWidth={1.8}
            />
            {mockAtlasStats.accuracyPct}% accuracy
          </span>
          <span className="h-4 w-px bg-[var(--color-divider)]" />
          <span className="flex items-center gap-2 text-[13px] font-semibold text-[var(--color-text-primary)]">
            <Icon
              name="bookmark"
              size={14}
              color="var(--color-text-primary)"
              strokeWidth={1.8}
            />
            {mockAtlasStats.solved} solved
          </span>
        </div>
      </div>

      {/* Featured "Case of the day" */}
      <Card className="mt-6 overflow-hidden !p-0">
        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr]">
          <div className="relative">
            <EcgWaveform
              severity="urgent"
              height={420}
              seed={88}
              className="h-full !rounded-none"
            />
            <span className="absolute left-6 top-5 text-[11px] font-bold tracking-[1.4px] text-white/70">
              CASE OF THE DAY
            </span>
            <span className="absolute bottom-5 left-6 font-mono text-[12px] text-white/60">
              {mockAtlasFeatured.patientMeta}
            </span>
          </div>
          <div className="flex flex-col justify-center p-6 lg:p-10">
            <h2 className="mb-3 text-[24px] font-bold leading-[30px] text-[var(--color-text-primary)] lg:text-[28px] lg:leading-[34px]">
              {mockAtlasFeatured.title}
            </h2>
            <p className="mb-5 text-[14px] leading-[22px] text-[var(--color-text-secondary)]">
              {mockAtlasFeatured.description}
            </p>
            <div className="mb-6 flex flex-wrap gap-2">
              {mockAtlasFeatured.tags.map((t) => (
                <TagPill key={t} label={t} />
              ))}
            </div>
            <div>
              <Button label="Begin case" size="lg" iconLeft="book" />
            </div>
          </div>
        </div>
      </Card>

      {/* Continue learning */}
      <h2 className="mt-10 mb-4 text-[22px] font-bold text-[var(--color-text-primary)]">
        Continue learning
      </h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {mockAtlasContinue.map((c) => (
          <AtlasCaseCard key={c.id} caseItem={c} />
        ))}
      </div>
    </AppLayout>
  );
};