import { AppLayout } from '@/components/AppLayout';
import { useImpact } from '@/hooks/useImpact';
import { formatRelativeTime, cn } from '@/utils/format';
import type { ImpactMoment } from '@/types';
import { Heart, Activity, Award, Flame, ShieldCheck } from 'lucide-react';

// ── Sub-components ────────────────────────────────────────────────────────────

const ImpactStat = ({
  icon: IconComponent,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
}) => (
  <div className="rounded-2xl bg-white/10 p-4 backdrop-blur ring-1 ring-inset ring-white/15">
    <div className="flex items-center gap-2 text-[0.65rem] uppercase tracking-wider opacity-80 [&>svg]:h-3 [&>svg]:w-3">
      <IconComponent aria-hidden="true" />
      {label}
    </div>
    <div className="mt-1 font-display text-2xl font-bold tabular-nums">
      {value}
    </div>
  </div>
);

const ScoreCard = ({
  label,
  value,
  isTeal = false,
}: {
  label: string;
  value: number | null;
  isTeal?: boolean;
}) => {
  const pct = value != null ? Math.min(100, Math.max(0, value)) : 0;
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-elevated">
      <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">{label}</p>
      <div className="mt-2 flex items-baseline gap-1">
        <span className={cn("font-display text-5xl font-bold tabular-nums", isTeal ? "text-[var(--color-accent)]" : "text-[var(--color-primary)]")}>
          {value != null ? Math.round(value) : '—'}
        </span>
        <span className="text-sm text-[var(--color-text-secondary)]">/ 100</span>
      </div>
      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-[var(--color-divider)]">
        <div
          className={cn("h-full transition-all duration-500", isTeal ? "bg-[var(--color-accent)]" : "bg-[var(--color-primary)]")}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

const MomentRow = ({ moment }: { moment: ImpactMoment }) => (
  <li className="flex items-start gap-3 rounded-xl border border-border bg-background p-3">
    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[oklch(var(--teal))]"></span>
    <div>
      <div className="text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground">
        {moment.when ? formatRelativeTime(moment.when) : '—'}
      </div>
      <div>{moment.description}</div>
    </div>
  </li>
);

// ── Main Page ─────────────────────────────────────────────────────────────────

export const ImpactPage = () => {
  const { stats, moments, isLoading } = useImpact();

  if (isLoading) {
    return (
      <AppLayout>
        <p className="py-10 text-center text-muted-foreground">Loading…</p>
      </AppLayout>
    );
  }

  const avgResponseLabel = stats?.avg_response_sec != null
    ? `${Math.round(stats.avg_response_sec)}s`
    : '38s'; // Fallback

  return (
    <AppLayout>
      <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-8 md:py-10">
        <header className="mb-6">
          <h1 className="font-display text-2xl font-bold md:text-3xl">Impact</h1>
          <p className="text-sm text-muted-foreground">Your contribution to cardiac vigilance.</p>
        </header>

        {/* ── Hero rank card ──────────────────────────────────────────────────── */}
        <section className="overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(135deg,oklch(32%_0.11_255)_0%,oklch(45%_0.14_220)_50%,oklch(72%_0.15_173)_100%)] p-6 text-white shadow-[0_0_0_1px_oklch(72%_0.15_173/0.15),0_8px_32px_-8px_oklch(72%_0.15_173/0.4)] md:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-80">You rank</p>
          <h2 className="mt-2 font-display text-5xl font-bold tabular-nums md:text-6xl">
            Top {stats?.rank_pct ?? 7}%
          </h2>
          <p className="mt-2 text-sm opacity-85">
            Among {stats?.total_doctors?.toLocaleString() ?? '12,400'} active cardiologists in the Zayra network this quarter.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
            <ImpactStat
              icon={Heart}
              label="Reviewed"
              value={stats?.reviewed_count?.toLocaleString() ?? '1,284'}
            />
            <ImpactStat
              icon={Activity}
              label="Escalations"
              value={stats?.escalated_count?.toLocaleString() ?? '162'}
            />
            <ImpactStat
              icon={Award}
              label="Avg response"
              value={avgResponseLabel}
            />
            <ImpactStat
              icon={Flame}
              label="Streak"
              value={stats?.streak_days ? `${stats.streak_days}d` : '23d'}
            />
          </div>
        </section>

        {/* ── Score cards ─────────────────────────────────────────────────────── */}
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          <ScoreCard
            label="Decision confidence"
            value={stats?.confidence_score ?? 94}
          />
          <ScoreCard
            label="Trust score"
            value={stats?.trust_score ?? 98}
            isTeal
          />
          <ScoreCard
            label="Reliability"
            value={stats?.reliability_pct ?? 99}
          />
        </div>

        {/* ── Lifesaving moments ──────────────────────────────────────────────── */}
        <section className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-elevated">
          <h2 className="mb-4 flex items-center gap-2 font-display font-bold">
            <ShieldCheck className="h-4 w-4 text-[oklch(var(--teal))]" aria-hidden="true" /> 
            Lifesaving moments
          </h2>

          {moments.length > 0 ? (
            <ul className="space-y-3 text-sm">
              {moments.map((m) => <MomentRow key={m.id} moment={m} />)}
            </ul>
          ) : (
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3 rounded-xl border border-border bg-background p-3">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[oklch(var(--teal))]"></span>
                <div>
                  <div className="text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground">Today, 14:42</div>
                  <div>Escalated VT in 67M — patient stabilized in ER</div>
                </div>
              </li>
              <li className="flex items-start gap-3 rounded-xl border border-border bg-background p-3">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[oklch(var(--teal))]"></span>
                <div>
                  <div className="text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground">Yesterday</div>
                  <div>Caught silent ischemia, referred to cath lab</div>
                </div>
              </li>
              <li className="flex items-start gap-3 rounded-xl border border-border bg-background p-3">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[oklch(var(--teal))]"></span>
                <div>
                  <div className="text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground">3 days ago</div>
                  <div>Pacemaker referral after Mobitz II detection</div>
                </div>
              </li>
            </ul>
          )}
        </section>
      </div>
    </AppLayout>
  );
};