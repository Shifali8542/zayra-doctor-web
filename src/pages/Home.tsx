import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/AppLayout';
import { StatBadge } from '@/components/StatBadge';
import { SectionTitle } from '@/components/SectionTitle';
import { CaseCard } from '@/components/CaseCard';
import { useDashboard } from '@/hooks/useDashboard';
import { cn } from '@/utils/format';

const MiniHeartbeat = () => (
  <svg width={36} height={120} viewBox="0 0 36 120" fill="none">
    <polyline
      points="2,60 8,60 12,30 16,90 20,50 24,60 34,60"
      stroke="rgba(255,255,255,0.45)"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

export const HomePage = () => {
  const navigate = useNavigate();
  const { profile, patientCount, liveCases, liveCount, claimCase, isClaiming } = useDashboard();

  const firstName = profile?.first_name ?? 'Doctor';

  return (
    <AppLayout>
      {/* Hero */}
      <div className="hero-gradient relative my-3 mb-6 overflow-hidden rounded-2xl p-6 lg:my-0 lg:p-10">
        {/* Animated ECG line — runs across the top portion of the card */}
        <div className="pointer-events-none absolute left-0 right-0 top-0 h-[140px] overflow-hidden lg:h-[180px]">
          <svg
            viewBox="0 0 600 120"
            preserveAspectRatio="none"
            className="h-full w-full"
          >
            <defs>
              <linearGradient id="ecgFade" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="rgba(255,255,255,0)" />
                <stop offset="15%" stopColor="rgba(255,255,255,0.55)" />
                <stop offset="85%" stopColor="rgba(255,255,255,0.55)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </linearGradient>
              <filter id="ecgGlow" x="-20%" y="-50%" width="140%" height="200%">
                <feGaussianBlur stdDeviation="1.4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Two identical ECG paths offset by 600px, scrolling left for seamless loop */}
            <g className="ecg-scroll" filter="url(#ecgGlow)">
              <path
                d="M 0 60 L 40 60 L 60 60 L 70 40 L 80 80 L 90 20 L 100 90 L 110 55 L 120 60 L 180 60 L 200 60 L 215 50 L 225 70 L 235 25 L 245 95 L 255 50 L 265 60 L 320 60 L 350 60 L 365 45 L 375 75 L 385 15 L 395 100 L 405 50 L 415 60 L 480 60 L 500 60 L 515 50 L 525 70 L 535 25 L 545 95 L 555 50 L 565 60 L 600 60"
                fill="none"
                stroke="url(#ecgFade)"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M 600 60 L 640 60 L 660 60 L 670 40 L 680 80 L 690 20 L 700 90 L 710 55 L 720 60 L 780 60 L 800 60 L 815 50 L 825 70 L 835 25 L 845 95 L 855 50 L 865 60 L 920 60 L 950 60 L 965 45 L 975 75 L 985 15 L 995 100 L 1005 50 L 1015 60 L 1080 60 L 1100 60 L 1115 50 L 1125 70 L 1135 25 L 1145 95 L 1155 50 L 1165 60 L 1200 60"
                fill="none"
                stroke="url(#ecgFade)"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          </svg>
        </div>

        <div className="relative">
          <p className="eyebrow mb-4 text-white" style={{ letterSpacing: '1.6px' }}>
            AVAILABLE · EMERGENCY REVIEW
          </p>
          <h1 className="mb-4 text-[24px] font-bold leading-[32px] text-white sm:text-[26px] sm:leading-[36px] lg:text-[44px] lg:leading-[52px]">
            Good evening,{' '}
            <span className="lg:inline">
              <br className="lg:hidden" />
              Dr. {firstName}.
            </span>
          </h1>
          <p className="mb-6 text-[14px] leading-[22px] text-white/80 lg:max-w-2xl lg:text-[16px] lg:leading-[24px]">
            {liveCount} anomalies are awaiting clinician review. First to claim{' '}
            <span className="rounded bg-white/20 px-1 text-white">becomes</span> the
            primary reviewer.
          </p>

          {/* Stat pills: stack on mobile, row on desktop */}
         <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap">
            <StatBadge
              icon="heart"
              label="Specialization"
              value={profile?.specialization ?? '—'}
            />
            <StatBadge
              icon="activity"
              label="Hospital"
              value={profile?.hospital_name ?? '—'}
            />
            <StatBadge
              icon="clock"
              label="Experience"
              value={profile?.years_of_experience ? `${profile.years_of_experience}y` : '—'}
            />
          </div>
        </div>
      </div>

      {/* Cases live now section */}
      <div className="mb-4 mt-8 flex items-end justify-between lg:mt-10">
        <SectionTitle
          title="Cases live now"
          subtitle="Sorted by severity and elapsed time. Claim within 60s for response bonus."
        />
        <button
          className="hidden whitespace-nowrap text-[14px] font-bold text-[var(--color-primary)] transition hover:opacity-70 lg:inline-block"
          onClick={() => navigate('/cases')}
        >
          View all →
        </button>
      </div>

      {liveCases.length === 0 ? (
        <p className="py-6 text-center text-[14px] text-[var(--color-text-tertiary)]">
          No live cases right now.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {liveCases.map((c) => (
            <CaseCard
              key={c.id}
              caseItem={c}
              isClaiming={isClaiming}
              onClick={() => navigate(`/case/${c.id}`)}
              onClaim={() => claimCase(c.id, {
                onSuccess: () => navigate(`/case/${c.id}`),
              })}
              showClaim
            />
          ))}
        </div>
      )}
    </AppLayout>
  );
};
