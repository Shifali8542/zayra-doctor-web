import { AppLayout } from '@/components/AppLayout';
import { MessageCircle, Bookmark } from 'lucide-react';

export const GrandRoundsPage = () => {
  return (
    <AppLayout>
      <div className="mx-auto w-full max-w-4xl px-4 py-6 md:px-0 md:py-10">
        <header className="mb-6">
          <h1 className="font-display text-2xl font-bold md:text-3xl">Grand Rounds</h1>
          <p className="text-sm text-muted-foreground">Discussions, pearls and protocol updates from peers.</p>
        </header>

        <ul className="space-y-3">
          {/* Thread 1 */}
          <li className="rounded-2xl border border-border bg-card p-5 shadow-elevated transition-shadow hover:shadow-[0_0_0_1px_oklch(72%_0.15_173/0.15),0_8px_32px_-8px_oklch(72%_0.15_173/0.4)]">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-[linear-gradient(135deg,oklch(32%_0.11_255)_0%,oklch(45%_0.14_220)_50%,oklch(72%_0.15_173)_100%)] text-xs font-bold text-white">SU</span>
              <div>
                <p className="text-sm font-semibold">Dr. A. Subramaniam</p>
                <p className="text-xs text-muted-foreground">Cardiac Electrophysiology · 3h</p>
              </div>
            </div>
            <h3 className="mt-3 font-display text-lg font-bold leading-snug">Repolarization heterogeneity preceding torsades — a 4-case series</h3>
            <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" /> 38 replies
              </span>
              <span className="flex items-center gap-1">
                <Bookmark className="h-3.5 w-3.5" aria-hidden="true" /> 142 saved
              </span>
              <button className="ml-auto rounded-full border border-border bg-background px-3 py-1.5 text-xs font-semibold hover:bg-muted">Open thread</button>
            </div>
          </li>

          {/* Thread 2 */}
          <li className="rounded-2xl border border-border bg-card p-5 shadow-elevated transition-shadow hover:shadow-[0_0_0_1px_oklch(72%_0.15_173/0.15),0_8px_32px_-8px_oklch(72%_0.15_173/0.4)]">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-[linear-gradient(135deg,oklch(32%_0.11_255)_0%,oklch(45%_0.14_220)_50%,oklch(72%_0.15_173)_100%)] text-xs font-bold text-white">OK</span>
              <div>
                <p className="text-sm font-semibold">Dr. L. Okafor</p>
                <p className="text-xs text-muted-foreground">Interventional Cardiology · 9h</p>
              </div>
            </div>
            <h3 className="mt-3 font-display text-lg font-bold leading-snug">AI-flagged silent ischemia: should the threshold be tighter?</h3>
            <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" /> 24 replies
              </span>
              <span className="flex items-center gap-1">
                <Bookmark className="h-3.5 w-3.5" aria-hidden="true" /> 87 saved
              </span>
              <button className="ml-auto rounded-full border border-border bg-background px-3 py-1.5 text-xs font-semibold hover:bg-muted">Open thread</button>
            </div>
          </li>

          {/* Thread 3 */}
          <li className="rounded-2xl border border-border bg-card p-5 shadow-elevated transition-shadow hover:shadow-[0_0_0_1px_oklch(72%_0.15_173/0.15),0_8px_32px_-8px_oklch(72%_0.15_173/0.4)]">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-[linear-gradient(135deg,oklch(32%_0.11_255)_0%,oklch(45%_0.14_220)_50%,oklch(72%_0.15_173)_100%)] text-xs font-bold text-white">CH</span>
              <div>
                <p className="text-sm font-semibold">Dr. M. Chen</p>
                <p className="text-xs text-muted-foreground">Heart Failure · 1d</p>
              </div>
            </div>
            <h3 className="mt-3 font-display text-lg font-bold leading-snug">Sleep-onset bradyarrhythmia patterns in HFpEF</h3>
            <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" /> 17 replies
              </span>
              <span className="flex items-center gap-1">
                <Bookmark className="h-3.5 w-3.5" aria-hidden="true" /> 64 saved
              </span>
              <button className="ml-auto rounded-full border border-border bg-background px-3 py-1.5 text-xs font-semibold hover:bg-muted">Open thread</button>
            </div>
          </li>
        </ul>
      </div>
    </AppLayout>
  );
};