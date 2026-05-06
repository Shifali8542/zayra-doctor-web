import { AppLayout } from '@/components/AppLayout';
import { Card } from '@/components/Card';
import { SectionTitle } from '@/components/SectionTitle';
import { Icon, type IconName } from '@/components/Icon';
import { useImpact } from '@/hooks/useImpact';

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
  const { profile, summary, isLoading } = useImpact();

  if (isLoading) return <AppLayout><p className="py-10 text-center text-[var(--color-text-tertiary)]">Loading…</p></AppLayout>;

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
          Dr. {profile?.first_name} {profile?.last_name}
        </h1>
        <p className="mb-5 text-[14px] leading-[22px] text-white/80">
          {profile?.specialization ?? '—'} · {profile?.hospital_name ?? '—'}
        </p>
        <div className="mb-3 flex gap-3">
          <ImpactStat icon="heart" label="EXPERIENCE" value={profile?.years_of_experience ? `${profile.years_of_experience}y` : '—'} />
          <ImpactStat icon="trace" label="QUALIFICATION" value={profile?.qualification ?? '—'} />
        </div>
        <div className="flex gap-3">
          <ImpactStat icon="medal" label="PATIENTS" value={(summary as { count?: number })?.count ?? '—'} />
          <ImpactStat icon="flame" label="ROLE" value={profile?.role ?? '—'} />
        </div>
      </div>

      {/* Confidence + Reliability — stacked mobile, side-by-side desktop */}
      <Card className="mt-5">
        <div className="mb-4 flex items-center gap-2">
          <Icon name="shield-check" size={18} color="var(--color-text-primary)" strokeWidth={1.8} />
          <h2 className="text-[22px] font-bold text-[var(--color-text-primary)]">Profile details</h2>
        </div>
        <div className="flex flex-col gap-2 text-[14px] text-[var(--color-text-primary)]">
          <p><span className="text-[var(--color-text-tertiary)]">Email: </span>{profile?.email ?? '—'}</p>
          <p><span className="text-[var(--color-text-tertiary)]">License: </span>{profile?.license_number ?? '—'}</p>
          <p><span className="text-[var(--color-text-tertiary)]">Member since: </span>{profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : '—'}</p>
        </div>
      </Card>
    </AppLayout>
  );
};
