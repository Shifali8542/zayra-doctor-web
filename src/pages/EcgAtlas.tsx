import { AppLayout } from '@/components/AppLayout';
import { Trophy, Star, GraduationCap } from 'lucide-react';

export const EcgAtlasPage = () => {
  return (
    <AppLayout>
      <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-0 md:py-10">
        <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-bold md:text-3xl">ECG Atlas</h1>
            <p className="text-sm text-muted-foreground">Case-based learning · expert-reviewed · anonymized</p>
          </div>
          <div className="flex items-center gap-3 rounded-full border border-border bg-card px-4 py-2 text-xs">
            <span className="flex items-center gap-1.5">
              <Trophy className="h-3.5 w-3.5 text-[oklch(var(--teal))]" aria-hidden="true" /> 84% accuracy
            </span>
            <span className="flex items-center gap-1.5">
              <Star className="h-3.5 w-3.5 text-[oklch(var(--severity-urgent))]" aria-hidden="true" /> 142 solved
            </span>
          </div>
        </header>

        <section className="overflow-hidden rounded-3xl border border-border bg-card shadow-elevated">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="bg-[oklch(0.13_0.025_250)] p-6">
              <span className="rounded-full bg-[oklch(var(--teal)/0.15)] px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wider text-[oklch(var(--teal))]">Case of the day</span>
              <svg viewBox="0 0 300 60" height="150" width="100%" preserveAspectRatio="none" className="">
                <path d="M 0 30 L 4 30 L 6 26 L 8 34 L 10 12 L 12 42 L 14 30 L 18 30 L 22 26 L 26 30 L 34 30 L 36 26 L 38 34 L 40 12 L 42 42 L 44 30 L 48 30 L 52 26 L 56 30 L 64 30 L 66 26 L 68 34 L 70 12 L 72 42 L 74 30 L 78 30 L 82 26 L 86 30 L 94 30 L 96 26 L 98 34 L 100 12 L 102 42 L 104 30 L 108 30 L 112 26 L 116 30 L 124 30 L 126 26 L 128 34 L 130 12 L 132 42 L 134 30 L 138 30 L 142 26 L 146 30 L 154 30 L 156 26 L 158 34 L 160 12 L 162 42 L 164 30 L 168 30 L 172 26 L 176 30 L 184 30 L 186 26 L 188 34 L 190 12 L 192 42 L 194 30 L 198 30 L 202 26 L 206 30 L 214 30 L 216 26 L 218 34 L 220 12 L 222 42 L 224 30 L 228 30 L 232 26 L 236 30 L 244 30 L 246 26 L 248 34 L 250 12 L 252 42 L 254 30 L 258 30 L 262 26 L 266 30 L 274 30 L 276 26 L 278 34 L 280 12 L 282 42 L 284 30 L 288 30 L 292 26 L 296 30 L 300 30" fill="none" stroke="oklch(var(--severity-urgent))" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="animate-ecg" opacity="0.95"></path>
              </svg>
              <p className="mt-2 font-mono text-xs text-white/50">Anonymized · 58F · ambulatory · lead V2</p>
            </div>
            <div className="p-6">
              <h2 className="font-display text-xl font-bold">Subtle posterior STEMI in lead V2</h2>
              <p className="mt-2 text-sm text-[oklch(50%_0.03_250)]">Reciprocal changes seen as ST depression and tall R-waves in V1–V3. Walk through the diagnostic reasoning with 4 expert annotations.</p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                <span className="rounded-full bg-[oklch(95.5%_0.012_230)] px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wider text-[oklch(50%_0.03_250)]">STEMI</span>
                <span className="rounded-full bg-[oklch(95.5%_0.012_230)] px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wider text-[oklch(50%_0.03_250)]">POSTERIOR</span>
                <span className="rounded-full bg-[oklch(95.5%_0.012_230)] px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wider text-[oklch(50%_0.03_250)]">4 MIN</span>
                <span className="rounded-full bg-[oklch(95.5%_0.012_230)] px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wider text-[oklch(50%_0.03_250)]">INTERMEDIATE</span>
              </div>
              <button className="mt-5 inline-flex items-center gap-2 rounded-full bg-[oklch(32%_0.11_255)] px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90">
                <GraduationCap className="h-4 w-4" aria-hidden="true" /> Begin case
              </button>
            </div>
          </div>
        </section>

        <h3 className="mt-8 font-display font-bold">Continue learning</h3>
        <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          
          <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-elevated transition-all hover:-translate-y-0.5 hover:shadow-glow">
            <div className="bg-[oklch(0.13_0.025_250)] px-3 py-2">
              <svg viewBox="0 0 300 60" height="70" width="100%" preserveAspectRatio="none" className="">
                <path d="M 0 30 L 4 30 L 6 26 L 8 34 L 10 4.800000000000001 L 12 46.8 L 14 30 L 18 30 L 22 26 L 26 30 L 34 30 L 36 26 L 38 34 L 40 4.800000000000001 L 42 46.8 L 44 30 L 48 30 L 52 26 L 56 30 L 64 30 L 66 26 L 68 34 L 70 4.800000000000001 L 72 46.8 L 74 30 L 78 30 L 82 26 L 86 30 L 94 30 L 96 26 L 98 34 L 100 4.800000000000001 L 102 46.8 L 104 30 L 108 30 L 112 26 L 116 30 L 124 30 L 126 26 L 128 34 L 130 4.800000000000001 L 132 46.8 L 134 30 L 138 30 L 142 26 L 146 30 L 154 30 L 156 26 L 158 34 L 160 4.800000000000001 L 162 46.8 L 164 30 L 168 30 L 172 26 L 176 30 L 184 30 L 186 26 L 188 34 L 190 4.800000000000001 L 192 46.8 L 194 30 L 198 30 L 202 26 L 206 30 L 214 30 L 216 26 L 218 34 L 220 4.800000000000001 L 222 46.8 L 224 30 L 228 30 L 232 26 L 236 30 L 244 30 L 246 26 L 248 34 L 250 4.800000000000001 L 252 46.8 L 254 30 L 258 30 L 262 26 L 266 30 L 274 30 L 276 26 L 278 34 L 280 4.800000000000001 L 282 46.8 L 284 30 L 288 30 L 292 26 L 296 30 L 300 30" fill="none" stroke="oklch(var(--severity-critical))" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="animate-ecg" opacity="0.95"></path>
              </svg>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between text-[0.65rem] uppercase tracking-wider text-muted-foreground">
                <span>VT</span><span>6 min</span>
              </div>
              <h4 className="mt-2 font-display text-sm font-bold leading-snug">Wide-complex tachycardia: VT vs SVT-aberrant</h4>
              <div className="mt-3 flex items-center justify-between">
                <span className="rounded-full bg-muted px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground">Advanced</span>
                <button className="text-xs font-semibold text-primary hover:underline">Open →</button>
              </div>
            </div>
          </article>

          <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-elevated transition-all hover:-translate-y-0.5 hover:shadow-glow">
            <div className="bg-[oklch(0.13_0.025_250)] px-3 py-2">
              <svg viewBox="0 0 300 60" height="70" width="100%" preserveAspectRatio="none" className="">
                <path d="M 0 30 L 4 30 L 6 26 L 8 34 L 10 12 L 12 42 L 14 30 L 18 30 L 22 26 L 26 30 L 34 30 L 36 26 L 38 34 L 40 12 L 42 42 L 44 30 L 48 30 L 52 26 L 56 30 L 64 30 L 66 26 L 68 34 L 70 12 L 72 42 L 74 30 L 78 30 L 82 26 L 86 30 L 94 30 L 96 26 L 98 34 L 100 12 L 102 42 L 104 30 L 108 30 L 112 26 L 116 30 L 124 30 L 126 26 L 128 34 L 130 12 L 132 42 L 134 30 L 138 30 L 142 26 L 146 30 L 154 30 L 156 26 L 158 34 L 160 12 L 162 42 L 164 30 L 168 30 L 172 26 L 176 30 L 184 30 L 186 26 L 188 34 L 190 12 L 192 42 L 194 30 L 198 30 L 202 26 L 206 30 L 214 30 L 216 26 L 218 34 L 220 12 L 222 42 L 224 30 L 228 30 L 232 26 L 236 30 L 244 30 L 246 26 L 248 34 L 250 12 L 252 42 L 254 30 L 258 30 L 262 26 L 266 30 L 274 30 L 276 26 L 278 34 L 280 12 L 282 42 L 284 30 L 288 30 L 292 26 L 296 30 L 300 30" fill="none" stroke="oklch(var(--severity-urgent))" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="animate-ecg" opacity="0.95"></path>
              </svg>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between text-[0.65rem] uppercase tracking-wider text-muted-foreground">
                <span>STEMI</span><span>4 min</span>
              </div>
              <h4 className="mt-2 font-display text-sm font-bold leading-snug">Subtle posterior STEMI in lead V2</h4>
              <div className="mt-3 flex items-center justify-between">
                <span className="rounded-full bg-muted px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground">Intermediate</span>
                <button className="text-xs font-semibold text-primary hover:underline">Open →</button>
              </div>
            </div>
          </article>

          <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-elevated transition-all hover:-translate-y-0.5 hover:shadow-glow">
            <div className="bg-[oklch(0.13_0.025_250)] px-3 py-2">
              <svg viewBox="0 0 300 60" height="70" width="100%" preserveAspectRatio="none" className="">
                <path d="M 0 30 L 4 30 L 6 26 L 8 34 L 10 12 L 12 42 L 14 30 L 18 30 L 22 26 L 26 30 L 34 30 L 36 26 L 38 34 L 40 12 L 42 42 L 44 30 L 48 30 L 52 26 L 56 30 L 64 30 L 66 26 L 68 34 L 70 12 L 72 42 L 74 30 L 78 30 L 82 26 L 86 30 L 94 30 L 96 26 L 98 34 L 100 12 L 102 42 L 104 30 L 108 30 L 112 26 L 116 30 L 124 30 L 126 26 L 128 34 L 130 12 L 132 42 L 134 30 L 138 30 L 142 26 L 146 30 L 154 30 L 156 26 L 158 34 L 160 12 L 162 42 L 164 30 L 168 30 L 172 26 L 176 30 L 184 30 L 186 26 L 188 34 L 190 12 L 192 42 L 194 30 L 198 30 L 202 26 L 206 30 L 214 30 L 216 26 L 218 34 L 220 12 L 222 42 L 224 30 L 228 30 L 232 26 L 236 30 L 244 30 L 246 26 L 248 34 L 250 12 L 252 42 L 254 30 L 258 30 L 262 26 L 266 30 L 274 30 L 276 26 L 278 34 L 280 12 L 282 42 L 284 30 L 288 30 L 292 26 L 296 30 L 300 30" fill="none" stroke="oklch(var(--severity-urgent))" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="animate-ecg" opacity="0.95"></path>
              </svg>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between text-[0.65rem] uppercase tracking-wider text-muted-foreground">
                <span>AV Block</span><span>5 min</span>
              </div>
              <h4 className="mt-2 font-display text-sm font-bold leading-snug">Mobitz II with 2:1 conduction</h4>
              <div className="mt-3 flex items-center justify-between">
                <span className="rounded-full bg-muted px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground">Advanced</span>
                <button className="text-xs font-semibold text-primary hover:underline">Open →</button>
              </div>
            </div>
          </article>

          <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-elevated transition-all hover:-translate-y-0.5 hover:shadow-glow">
            <div className="bg-[oklch(0.13_0.025_250)] px-3 py-2">
              <svg viewBox="0 0 300 60" height="70" width="100%" preserveAspectRatio="none" className="">
                <path d="M 0 30 L 4 30 L 6 26 L 8 34 L 10 12 L 12 42 L 14 30 L 18 30 L 22 26 L 26 30 L 34 30 L 36 26 L 38 34 L 40 12 L 42 42 L 44 30 L 48 30 L 52 26 L 56 30 L 64 30 L 66 26 L 68 34 L 70 12 L 72 42 L 74 30 L 78 30 L 82 26 L 86 30 L 94 30 L 96 26 L 98 34 L 100 12 L 102 42 L 104 30 L 108 30 L 112 26 L 116 30 L 124 30 L 126 26 L 128 34 L 130 12 L 132 42 L 134 30 L 138 30 L 142 26 L 146 30 L 154 30 L 156 26 L 158 34 L 160 12 L 162 42 L 164 30 L 168 30 L 172 26 L 176 30 L 184 30 L 186 26 L 188 34 L 190 12 L 192 42 L 194 30 L 198 30 L 202 26 L 206 30 L 214 30 L 216 26 L 218 34 L 220 12 L 222 42 L 224 30 L 228 30 L 232 26 L 236 30 L 244 30 L 246 26 L 248 34 L 250 12 L 252 42 L 254 30 L 258 30 L 262 26 L 266 30 L 274 30 L 276 26 L 278 34 L 280 12 L 282 42 L 284 30 L 288 30 L 292 26 L 296 30 L 300 30" fill="none" stroke="oklch(var(--severity-urgent))" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="animate-ecg" opacity="0.95"></path>
              </svg>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between text-[0.65rem] uppercase tracking-wider text-muted-foreground">
                <span>Brugada</span><span>7 min</span>
              </div>
              <h4 className="mt-2 font-display text-sm font-bold leading-snug">Brugada pattern on ambulatory ECG</h4>
              <div className="mt-3 flex items-center justify-between">
                <span className="rounded-full bg-muted px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground">Expert</span>
                <button className="text-xs font-semibold text-primary hover:underline">Open →</button>
              </div>
            </div>
          </article>

        </div>
      </div>
    </AppLayout>
  );
};