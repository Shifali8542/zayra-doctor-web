import { AppLayout } from '@/components/AppLayout';
import { Card } from '@/components/Card';
import { SectionTitle } from '@/components/SectionTitle';
import { Icon, type IconName } from '@/components/Icon';
import { useImpact } from '@/hooks/useImpact';
import { formatSeconds } from '@/utils/format';

const ImpactStat = ({
  icon,
  label,
  value,
}: {
  icon: IconName;
  label: string;
  value: string | number;
}) => (
  <div className="flex-1 rounded-lg border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
    <div className="mb-3 flex items-center gap-2">
      <Icon name={icon} size={16} color="rgba(255,255,255,0.78)" strokeWidth={1.8} />
      <span className="eyebrow text-[11px] tracking-[1.2px] text-white/80">
        {label}
      </span>
    </div>
    <span className="text-[24px] font-bold leading-[28px] text-white sm:text-[26px]">
      {value}
    </span>
  </div>
);

const ProgressBar = ({ value, max }: { value: number; max: number }) => {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--color-divider)]">
      <div
        className="h-full rounded-full bg-[var(--color-primary)] transition-all duration-300"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
};

export const ImpactPage = () => {
  const { stats, moments } = useImpact();

  if (!stats) return <AppLayout>{null}</AppLayout>;

  return (
    <AppLayout>
      <SectionTitle
        title="Impact"
        subtitle="Your contribution to cardiac vigilance."
        className="mt-4"
      />

      {/* Hero rank card */}
      <div className="hero-gradient mb-3 rounded-2xl p-6">
        <p
          className="eyebrow mb-4 text-white/80"
          style={{ letterSpacing: '1.4px' }}
        >
          YOU RANK
        </p>
        <h1 className="mb-4 text-[32px] font-bold leading-[40px] text-white sm:text-[36px]">
          Top {stats.rankPct}%
        </h1>
        <p className="mb-5 text-[14px] leading-[22px] text-white/80">
          Among {stats.totalDoctors.toLocaleString()} active cardiologists in the
          Zayra network this quarter.
        </p>

        <div className="mb-3 flex gap-3">
          <ImpactStat
            icon="heart"
            label="REVIEWED"
            value={stats.reviewed.toLocaleString()}
          />
          <ImpactStat
            icon="trace"
            label="ESCALATIONS"
            value={stats.escalations}
          />
        </div>
        <div className="flex gap-3">
          <ImpactStat
            icon="medal"
            label="AVG RESPONSE"
            value={formatSeconds(stats.avgResponseSec)}
          />
          <ImpactStat
            icon="flame"
            label="STREAK"
            value={`${stats.streakDays}d`}
          />
        </div>
      </div>

      {/* Confidence + Reliability — stacked mobile, side-by-side desktop */}
      <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <p className="eyebrow mb-3 text-[11px] tracking-[1.4px] text-[var(--color-text-tertiary)]">
            DECISION CONFIDENCE
          </p>
          <div className="mb-4 flex items-baseline gap-2">
            <span className="text-[32px] font-bold leading-[40px] text-[var(--color-text-primary)]">
              {stats.decisionConfidence}
            </span>
            <span className="text-[14px] text-[var(--color-text-tertiary)]">
              / 100
            </span>
          </div>
          <ProgressBar value={stats.decisionConfidence} max={100} />
        </Card>

        <Card>
          <p className="eyebrow mb-3 text-[11px] tracking-[1.4px] text-[var(--color-text-tertiary)]">
            RELIABILITY
          </p>
          <div className="mb-4 flex items-baseline gap-2">
            <span className="text-[32px] font-bold leading-[40px] text-[var(--color-text-primary)]">
              {stats.reliability}
            </span>
            <span className="text-[14px] text-[var(--color-text-tertiary)]">
              / 100
            </span>
          </div>
          <ProgressBar value={stats.reliability} max={100} />
        </Card>
      </div>

      {/* Lifesaving moments */}
      <Card className="mt-4">
        <div className="mb-4 flex items-center gap-2">
          <Icon
            name="shield-check"
            size={18}
            color="var(--color-text-primary)"
            strokeWidth={1.8}
          />
          <h2 className="text-[22px] font-bold text-[var(--color-text-primary)]">
            Lifesaving moments
          </h2>
        </div>
        {moments.map((m, i) => (
          <div
            key={`${m.when}-${i}`}
            className="mb-3 rounded-lg bg-[var(--color-bg-alt)] p-4 last:mb-0"
          >
            <p className="eyebrow mb-1 text-[11px] tracking-[1.2px] text-[var(--color-text-tertiary)]">
              {m.when}
            </p>
            <p className="text-[14px] font-semibold leading-[22px] text-[var(--color-text-primary)]">
              {m.description}
            </p>
          </div>
        ))}
      </Card>
    </AppLayout>
  );
};
