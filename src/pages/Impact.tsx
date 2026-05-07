import { AppLayout } from '@/components/AppLayout';
import { Card } from '@/components/Card';
import { SectionTitle } from '@/components/SectionTitle';
import { Icon, type IconName } from '@/components/Icon';
import { useImpact } from '@/hooks/useImpact';
import { formatRelativeTime } from '@/utils/format';
import type { ImpactMoment } from '@/types';

// ── Sub-components ────────────────────────────────────────────────────────────

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
      <span className="eyebrow text-[11px] tracking-[1.2px] text-white/80">{label}</span>
    </div>
    <span className="text-[24px] font-bold leading-[28px] text-white sm:text-[26px]">
      {value}
    </span>
  </div>
);

const ScoreCard = ({
  label,
  value,
  max = 100,
}: {
  label: string;
  value: number | null;
  max?: number;
}) => {
  const pct = value != null ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  return (
    <Card>
      <p className="eyebrow mb-3 text-[11px] tracking-[1.4px] text-[var(--color-text-tertiary)]">
        {label}
      </p>
      <div className="mb-4 flex items-baseline gap-2">
        <span className="text-[32px] font-bold leading-[40px] text-[var(--color-text-primary)]">
          {value != null ? Math.round(value) : '—'}
        </span>
        {value != null && (
          <span className="text-[14px] text-[var(--color-text-tertiary)]">/ {max}</span>
        )}
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--color-divider)]">
        <div
          className="h-full rounded-full bg-[var(--color-primary)] transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </Card>
  );
};

const MomentRow = ({ moment }: { moment: ImpactMoment }) => (
  <div className="mb-3 rounded-lg bg-[var(--color-bg-alt)] p-4 last:mb-0">
    <p className="eyebrow mb-1 text-[11px] tracking-[1.2px] text-[var(--color-text-tertiary)]">
      {moment.when ? formatRelativeTime(moment.when).toUpperCase() : '—'}
      {' · '}
      {moment.patient_code}
      {' · '}
      {moment.severity.toUpperCase()}
    </p>
    <p className="text-[14px] font-semibold leading-[22px] text-[var(--color-text-primary)]">
      {moment.description}
    </p>
  </div>
);

// ── Main Page ─────────────────────────────────────────────────────────────────

export const ImpactPage = () => {
  const { stats, moments, isLoading } = useImpact();

  if (isLoading) {
    return (
      <AppLayout>
        <p className="py-10 text-center text-[var(--color-text-tertiary)]">Loading…</p>
      </AppLayout>
    );
  }

  const avgResponseLabel = stats?.avg_response_sec != null
    ? `${Math.round(stats.avg_response_sec)}s`
    : '—';

  return (
    <AppLayout>
      <SectionTitle
        title="Impact"
        subtitle="Your contribution to cardiac vigilance."
        className="mt-4"
      />

      {/* ── Hero rank card ──────────────────────────────────────────────────── */}
      <div className="hero-gradient mb-5 rounded-2xl p-6 lg:p-8">
        <p className="eyebrow mb-3 text-white/80" style={{ letterSpacing: '1.4px' }}>
          YOU RANK
        </p>
        <h1 className="mb-1 text-[40px] font-bold leading-[48px] text-white sm:text-[48px]">
          Top {stats?.rank_pct ?? '—'}%
        </h1>
        <p className="mb-6 text-[14px] leading-[22px] text-white/80">
          Among {stats?.total_doctors?.toLocaleString() ?? '—'} active cardiologists
          in the Zayra network this quarter.
        </p>

        <div className="mb-3 flex flex-col gap-3 sm:flex-row">
          <ImpactStat
            icon="heart"
            label="REVIEWED"
            value={stats?.reviewed_count?.toLocaleString() ?? '—'}
          />
          <ImpactStat
            icon="trace"
            label="ESCALATIONS"
            value={stats?.escalated_count?.toLocaleString() ?? '—'}
          />
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <ImpactStat
            icon="clock"
            label="AVG RESPONSE"
            value={avgResponseLabel}
          />
          <ImpactStat
            icon="flame"
            label="STREAK"
            value={stats?.streak_days ? `${stats.streak_days}d` : '—'}
          />
        </div>
      </div>

      {/* ── Score cards ─────────────────────────────────────────────────────── */}
      <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ScoreCard
          label="DECISION CONFIDENCE"
          value={stats?.confidence_score ?? null}
        />
        <ScoreCard
          label="TRUST SCORE"
          value={stats?.trust_score ?? null}
        />
        <ScoreCard
          label="RELIABILITY"
          value={stats?.reliability_pct ?? null}
        />
      </div>

      {/* ── Lifesaving moments ──────────────────────────────────────────────── */}
      <Card className="mt-5">
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

        {moments.length === 0 ? (
          <p className="text-[14px] text-[var(--color-text-tertiary)]">
            No lifesaving moments yet. Escalate a critical case to record one.
          </p>
        ) : (
          moments.map((m) => <MomentRow key={m.id} moment={m} />)
        )}
      </Card>
    </AppLayout>
  );
};