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
      <div className="hero-gradient relative my-3 mb-6 overflow-hidden rounded-2xl p-6 lg:my-0 lg:p-10">
        {/* ECG waveform: draws left→right, fades out at right edge, then repeats */}
        <div className="pointer-events-none absolute left-0 top-[28px] lg:top-[42px] w-full overflow-hidden h-[180px]">
          <svg
            viewBox="0 0 1000 180"
            preserveAspectRatio="none"
            className="absolute left-0 top-0 h-[180px] w-full"
          >
            <defs>
              {/* Fade: opaque on left, transparent on right */}
              <linearGradient id="ecgFadeH" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="rgba(180,210,230,0.0)" />
                <stop offset="3%" stopColor="rgba(180,210,230,0.55)" />
                <stop offset="50%" stopColor="rgba(180,210,230,0.42)" />
                <stop offset="82%" stopColor="rgba(180,210,230,0.18)" />
                <stop offset="100%" stopColor="rgba(180,210,230,0.0)" />
              </linearGradient>

              {/* Mask that clips: only the already-drawn portion is visible */}
              <mask id="ecgRevealMask">
                <rect id="ecgMaskRect" x="0" y="0" width="0" height="56" fill="white">
                  <animate
                    attributeName="width"
                    from="0"
                    to="1000"
                    dur="4s"
                    repeatCount="indefinite"
                    calcMode="linear"
                  />
                </rect>
              </mask>

              <filter id="ecgGlow" x="-5%" y="-120%" width="110%" height="340%">
                <feGaussianBlur stdDeviation="2.2" result="blur" />
                <feComposite in="blur" in2="SourceGraphic" operator="over" result="blurred" />
                <feMerge>
                  <feMergeNode in="blurred" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Full ECG path — masked to reveal left→right */}
            <path
              mask="url(#ecgRevealMask)"
              filter="url(#ecgGlow)"
              d="
M 0 28
L 8 28 L 12 23 L 16 28
L 22 28 L 25 23 L 28 33 L 30 6 L 33 50 L 36 26 L 40 28
L 48 28 L 52 23 L 56 28
L 62 28 L 65 23 L 68 33 L 70 6 L 73 50 L 76 26 L 80 28
L 88 28 L 92 23 L 96 28
L 102 28 L 105 23 L 108 33 L 110 6 L 113 50 L 116 26 L 120 28
L 128 28 L 132 23 L 136 28
L 142 28 L 145 23 L 148 33 L 150 6 L 153 50 L 156 26 L 160 28
L 168 28 L 172 23 L 176 28
L 182 28 L 185 23 L 188 33 L 190 6 L 193 50 L 196 26 L 200 28
L 208 28 L 212 23 L 216 28
L 222 28 L 225 23 L 228 33 L 230 6 L 233 50 L 236 26 L 240 28
L 248 28 L 252 23 L 256 28
L 262 28 L 265 23 L 268 33 L 270 6 L 273 50 L 276 26 L 280 28
L 288 28 L 292 23 L 296 28
L 302 28 L 305 23 L 308 33 L 310 6 L 313 50 L 316 26 L 320 28
L 328 28 L 332 23 L 336 28
L 342 28 L 345 23 L 348 33 L 350 6 L 353 50 L 356 26 L 360 28
L 368 28 L 372 23 L 376 28
L 382 28 L 385 23 L 388 33 L 390 6 L 393 50 L 396 26 L 400 28
L 408 28 L 412 23 L 416 28
L 422 28 L 425 23 L 428 33 L 430 6 L 433 50 L 436 26 L 440 28
L 448 28 L 452 23 L 456 28
L 462 28 L 465 23 L 468 33 L 470 6 L 473 50 L 476 26 L 480 28
L 488 28 L 492 23 L 496 28
L 502 28 L 505 23 L 508 33 L 510 6 L 513 50 L 516 26 L 520 28
L 528 28 L 532 23 L 536 28
L 542 28 L 545 23 L 548 33 L 550 6 L 553 50 L 556 26 L 560 28
L 568 28 L 572 23 L 576 28
L 582 28 L 585 23 L 588 33 L 590 6 L 593 50 L 596 26 L 600 28
L 608 28 L 612 23 L 616 28
L 622 28 L 625 23 L 628 33 L 630 6 L 633 50 L 636 26 L 640 28
L 648 28 L 652 23 L 656 28
L 662 28 L 665 23 L 668 33 L 670 6 L 673 50 L 676 26 L 680 28
L 688 28 L 692 23 L 696 28
L 702 28 L 705 23 L 708 33 L 710 6 L 713 50 L 716 26 L 720 28
L 728 28 L 732 23 L 736 28
L 742 28 L 745 23 L 748 33 L 750 6 L 753 50 L 756 26 L 760 28
L 768 28 L 772 23 L 776 28
L 782 28 L 785 23 L 788 33 L 790 6 L 793 50 L 796 26 L 800 28
L 808 28 L 812 23 L 816 28
L 822 28 L 825 23 L 828 33 L 830 6 L 833 50 L 836 26 L 840 28
L 848 28 L 852 23 L 856 28
L 862 28 L 865 23 L 868 33 L 870 6 L 873 50 L 876 26 L 880 28
L 888 28 L 892 23 L 896 28
L 902 28 L 905 23 L 908 33 L 910 6 L 913 50 L 916 26 L 920 28
L 928 28 L 932 23 L 936 28
L 942 28 L 945 23 L 948 33 L 950 6 L 953 50 L 956 26 L 960 28
L 968 28 L 972 23 L 976 28
L 982 28 L 985 23 L 988 33 L 990 6 L 993 50 L 996 26 L 1000 28"
              fill="none"
              stroke="url(#ecgFadeH)"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="relative">
          <p className="eyebrow mb-4 text-[17px] font-bold text-white" style={{ letterSpacing: '1.6px' }}>
            AVAILABLE · EMERGENCY REVIEW
          </p>
          <h1 className="mb-4 text-[24px] font-bold leading-[32px] text-white sm:text-[26px] sm:leading-[36px] lg:text-[44px] lg:leading-[52px]">
            {getTimeGreeting()},{' '}
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

          {/* Stat pills: performance metrics row */}
          <div className="flex flex-row flex-wrap gap-3">
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
