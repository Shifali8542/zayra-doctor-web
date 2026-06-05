import { AppLayout } from '@/components/AppLayout';
import { useQuery } from '@tanstack/react-query';
import { earningsApi, API_ENDPOINTS } from '@/services/api';

export const EarningsPage = () => {
  // Keeping the hook intact to prevent missing hook errors, even if we are hardcoding the display
  const completedQ = useQuery({
    queryKey: [API_ENDPOINTS.caseList, 'completed', 'earnings'],
    queryFn: () => earningsApi.getCompleted({ page_size: 50 }),
  });

  return (
    <AppLayout>
      <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-0 md:py-10">
        <header className="mb-6">
          <h1 className="font-display text-2xl font-bold md:text-3xl">Earnings</h1>
          <p className="text-sm text-muted-foreground">Reviewed cases, payouts and settlements.</p>
        </header>
        
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <div className="rounded-2xl border border-border p-4 shadow-elevated bg-[linear-gradient(135deg,oklch(32%_0.11_255)_0%,oklch(45%_0.14_220)_50%,oklch(72%_0.15_173)_100%)] text-white">
            <p className="text-[0.65rem] uppercase tracking-wider opacity-80">Today</p>
            <p className="mt-1 font-display text-2xl font-bold tabular-nums">$184</p>
          </div>
          <div className="rounded-2xl border border-border p-4 shadow-elevated bg-card">
            <p className="text-[0.65rem] uppercase tracking-wider text-muted-foreground">This week</p>
            <p className="mt-1 font-display text-2xl font-bold tabular-nums">$1240</p>
          </div>
          <div className="rounded-2xl border border-border p-4 shadow-elevated bg-card">
            <p className="text-[0.65rem] uppercase tracking-wider text-muted-foreground">This month</p>
            <p className="mt-1 font-display text-2xl font-bold tabular-nums">$5320</p>
          </div>
          <div className="rounded-2xl border border-border p-4 shadow-elevated bg-card">
            <p className="text-[0.65rem] uppercase tracking-wider text-muted-foreground">Pending payout</p>
            <p className="mt-1 font-display text-2xl font-bold tabular-nums">$412</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <section className="rounded-2xl border border-border bg-card p-6 shadow-elevated lg:col-span-2">
            <h2 className="mb-4 font-display font-bold">Earnings by severity (30d)</h2>
            <div className="space-y-3">
              <div>
                <div className="mb-1 flex justify-between text-xs">
                  <span className="font-semibold">Critical</span>
                  <span className="tabular-nums text-muted-foreground">$720</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-[oklch(55%_0.18_220)]" style={{ width: '36.36%' }}></div>
                </div>
              </div>
              <div>
                <div className="mb-1 flex justify-between text-xs">
                  <span className="font-semibold">Urgent</span>
                  <span className="tabular-nums text-muted-foreground">$1840</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-[oklch(55%_0.18_220)]" style={{ width: '92.93%' }}></div>
                </div>
              </div>
              <div>
                <div className="mb-1 flex justify-between text-xs">
                  <span className="font-semibold">Routine</span>
                  <span className="tabular-nums text-muted-foreground">$1980</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-[oklch(55%_0.18_220)]" style={{ width: '100%' }}></div>
                </div>
              </div>
              <div>
                <div className="mb-1 flex justify-between text-xs">
                  <span className="font-semibold">Info</span>
                  <span className="tabular-nums text-muted-foreground">$780</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-[oklch(55%_0.18_220)]" style={{ width: '39.39%' }}></div>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-[linear-gradient(135deg,oklch(32%_0.11_255)_0%,oklch(45%_0.14_220)_50%,oklch(72%_0.15_173)_100%)] p-6 text-white shadow-[0_0_0_1px_oklch(72%_0.15_173/0.15),0_8px_32px_-8px_oklch(72%_0.15_173/0.4)]">
            <h2 className="font-display font-bold">Next payout</h2>
            <p className="mt-1 text-xs opacity-80">Settlement on Friday</p>
            <p className="mt-4 font-display text-4xl font-bold tabular-nums">$412</p>
            <button className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[rgba(255,255,255,0.15)] px-4 py-2.5 text-sm font-semibold backdrop-blur-[8px] hover:bg-white/25">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-down-to-line h-4 w-4" aria-hidden="true"><path d="M12 17V3"></path><path d="m6 11 6 6 6-6"></path><path d="M19 21H5"></path></svg> Withdraw to bank
            </button>
          </section>
        </div>

        <section className="mt-6 overflow-hidden rounded-2xl border border-border bg-card shadow-elevated">
          <header className="px-6 py-4">
            <h2 className="font-display font-bold">Recent reviews</h2>
          </header>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left text-[0.7rem] uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-6 py-3 whitespace-nowrap">Case</th>
                  <th className="px-6 py-3 whitespace-nowrap">Severity</th>
                  <th className="px-6 py-3 whitespace-nowrap">Time</th>
                  <th className="px-6 py-3 whitespace-nowrap">Status</th>
                  <th className="px-6 py-3 text-right whitespace-nowrap">Payout</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-border/60">
                  <td className="px-6 py-3 font-mono text-xs">ZC-48155</td>
                  <td className="px-6 py-3">Critical</td>
                  <td className="px-6 py-3 tabular-nums text-muted-foreground">1m 24s</td>
                  <td className="px-6 py-3"><span className="rounded-full px-2 py-0.5 text-xs font-semibold bg-[oklch(var(--teal)/0.15)] text-[oklch(var(--teal))]">Settled</span></td>
                  <td className="px-6 py-3 text-right font-display font-bold tabular-nums">$52</td>
                </tr>
                <tr className="border-t border-border/60">
                  <td className="px-6 py-3 font-mono text-xs">ZC-48149</td>
                  <td className="px-6 py-3">Routine</td>
                  <td className="px-6 py-3 tabular-nums text-muted-foreground">0m 58s</td>
                  <td className="px-6 py-3"><span className="rounded-full px-2 py-0.5 text-xs font-semibold bg-[oklch(var(--teal)/0.15)] text-[oklch(var(--teal))]">Settled</span></td>
                  <td className="px-6 py-3 text-right font-display font-bold tabular-nums">$18</td>
                </tr>
                <tr className="border-t border-border/60">
                  <td className="px-6 py-3 font-mono text-xs">ZC-48140</td>
                  <td className="px-6 py-3">Urgent</td>
                  <td className="px-6 py-3 tabular-nums text-muted-foreground">1m 02s</td>
                  <td className="px-6 py-3"><span className="rounded-full px-2 py-0.5 text-xs font-semibold bg-muted text-muted-foreground">Pending</span></td>
                  <td className="px-6 py-3 text-right font-display font-bold tabular-nums">$28</td>
                </tr>
                <tr className="border-t border-border/60">
                  <td className="px-6 py-3 font-mono text-xs">ZC-48131</td>
                  <td className="px-6 py-3">Urgent</td>
                  <td className="px-6 py-3 tabular-nums text-muted-foreground">0m 47s</td>
                  <td className="px-6 py-3"><span className="rounded-full px-2 py-0.5 text-xs font-semibold bg-[oklch(var(--teal)/0.15)] text-[oklch(var(--teal))]">Settled</span></td>
                  <td className="px-6 py-3 text-right font-display font-bold tabular-nums">$30</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </AppLayout>
  );
};