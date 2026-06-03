import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/AppLayout';
import { StatBadge } from '@/components/StatBadge';
import { SectionTitle } from '@/components/SectionTitle';
import { CaseCard } from '@/components/CaseCard';
import { useDashboard } from '@/hooks/useDashboard';
import { getTimeGreeting } from '@/utils/format';

export const HomePage = () => {
  const navigate = useNavigate();
  const {
    profile, liveCases, liveCount, claimCase, isClaiming,
    avgResponseSec, streakDays, confidenceScore, todayEarnings,
  } = useDashboard();

  const firstName = profile?.first_name ?? 'Doctor';

  return (
    <AppLayout>
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-[var(--color-border)] bg-aurora p-6 text-white shadow-elevated md:p-10">
        {/* ECG waveform: draws left→right, fades out at right edge, then repeats */}
        <div className="absolute inset-0 opacity-30">
          <svg
            viewBox="0 0 300 60"
            height="140"
            width="100%"
            preserveAspectRatio="none"
          >
            <path
              d="M 0 30 L 4 30 L 6 26 L 8 34 L 10 12 L 12 42 L 14 30 L 18 30 L 22 26 L 26 30 L 34 30 L 36 26 L 38 34 L 40 12 L 42 42 L 44 30 L 48 30 L 52 26 L 56 30 L 64 30 L 66 26 L 68 34 L 70 12 L 72 42 L 74 30 L 78 30 L 82 26 L 86 30 L 94 30 L 96 26 L 98 34 L 100 12 L 102 42 L 104 30 L 108 30 L 112 26 L 116 30 L 124 30 L 126 26 L 128 34 L 130 12 L 132 42 L 134 30 L 138 30 L 142 26 L 146 30 L 154 30 L 156 26 L 158 34 L 160 12 L 162 42 L 164 30 L 168 30 L 172 26 L 176 30 L 184 30 L 186 26 L 188 34 L 190 12 L 192 42 L 194 30 L 198 30 L 202 26 L 206 30 L 214 30 L 216 26 L 218 34 L 220 12 L 222 42 L 224 30 L 228 30 L 232 26 L 236 30 L 244 30 L 246 26 L 248 34 L 250 12 L 252 42 L 254 30 L 258 30 L 262 26 L 266 30 L 274 30 L 276 26 L 278 34 L 280 12 L 282 42 L 284 30 L 288 30 L 292 26 L 296 30 L 300 30"
              fill="none"
              stroke="oklch(0.97 0.02 173)"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-ecg"
              opacity="0.95"
            />
          </svg>
        </div>
        <div className="relative">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] opacity-90">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-white"></span>
            </span>
            AVAILABLE · EMERGENCY REVIEW
          </div>
          <h1 className="mt-3 font-display text-3xl font-bold leading-[1.05] text-balance md:text-5xl">
            {getTimeGreeting()}, Dr. {firstName}.
          </h1>
          <p className="mt-2 max-w-xl text-sm opacity-85 md:text-base">
            {liveCount} anomalies are awaiting clinician review. First to claim becomes the
            primary reviewer.
          </p>

          {/* Stat pills: performance metrics row */}
          <div className="mt-6 flex flex-wrap gap-3">
            <StatBadge
              icon="bolt"
              label="Avg response"
              value={avgResponseSec !== null ? `${Math.round(avgResponseSec)}s` : '—'}
            />
            <StatBadge
              icon="trending-up"
              label="Today"
              value={todayEarnings > 0 ? `$${todayEarnings * 2}` : '—'}
            />
            <StatBadge
              icon="activity"
              label="Confidence"
              value={confidenceScore !== null ? `${confidenceScore}%` : '—'}
            />
            <StatBadge
              icon="clock"
              label="Streak"
              value={streakDays > 0 ? `${streakDays}d` : '—'}
            />
          </div>
        </div>
      </section>

      {/* Cases live now section */}
      <div className="mb-4 mt-8 flex items-end justify-between">
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
