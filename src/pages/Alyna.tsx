import { AppLayout } from '@/components/AppLayout';
import { Tag } from '@/components/Tag';
import { Icon } from '@/components/Icon';
import { Avatar } from '@/components/Avatar';
import { useAlyna } from '@/hooks/useAlyna';
import { Sparkles, Send } from 'lucide-react';
import { cn } from '@/utils/format';

export const AlynaPage = () => {
  const { messages, suggestions, draft, setDraft, send, clear, isLoading, error } = useAlyna();

  return (
    <AppLayout>
      <div className="mx-auto flex w-full max-w-4xl flex-col px-4 py-6 md:px-8 md:py-10">
        
        {/* Title block */}
        <header className="mb-5 flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-[linear-gradient(135deg,oklch(32%_0.11_255)_0%,oklch(45%_0.14_220)_50%,oklch(72%_0.15_173)_100%)] text-primary-foreground shadow-[0_8px_24px_-8px_oklch(32%_0.11_255/0.12)]">
            <Sparkles className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h1 className="font-display text-2xl font-bold">Alyna Assist</h1>
            <p className="text-xs text-muted-foreground">Governed clinical AI · grounded in patient signals</p>
          </div>
        </header>

        {/* Conversation card */}
        <div className="flex flex-1 flex-col gap-4 rounded-3xl border border-border bg-card p-5 shadow-elevated">
          
          <div className="flex-1 space-y-4 overflow-y-auto">
            {/* Empty state — shown before first message */}
            {messages.length === 0 && !isLoading ? (
              <div className="flex justify-start">
                <div className="max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed bg-muted text-foreground">
                  <p>Hello Doctor 👋 I'm Alyna, your clinical AI assistant. I can help you understand ECG findings, explain metrics like QTc and HRV, and walk you through the AI risk report for any patient. How can I help you today?</p>
                </div>
              </div>
            ) : null}

           {messages.map((m) => (
          <div key={m.id} className={cn("flex", m.role === 'assistant' ? "justify-start" : "justify-end")}>
            <div className={cn(
              "max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
              m.role === 'assistant' 
                ? "bg-[#E9F1F5] text-[var(--color-text-primary)]" 
                : "bg-[#0A2540] text-white"
            )}>
              <p>{m.text}</p>
              
              {/* Confidence tag if present */}
              {m.confidence !== undefined ? (
                <div className="mt-2.5 flex flex-wrap items-center gap-1.5 border-t border-black/10 pt-2">
                  <span className="rounded-full bg-black/10 px-2 py-0.5 text-[0.65rem] font-semibold text-[#0A2540]">
                    Confidence {m.confidence}%
                  </span>
                </div>
              ) : null}
            </div>
          </div>
        ))}

            {isLoading ? (
              <div className="flex justify-start">
                <div className="rounded-2xl bg-muted px-4 py-3 text-sm text-muted-foreground">Alyna is thinking…</div>
              </div>
            ) : null}
          </div>

          {/* Suggestion chips */}
          {!isLoading && suggestions.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-full border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  {s}
                </button>
              ))}
            </div>
          ) : null}

          {/* Input Area */}
          <form 
            className="flex items-center gap-2 rounded-full border border-border bg-background pr-1.5"
            onSubmit={(e) => { e.preventDefault(); send(); }}
          >
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              disabled={isLoading}
              placeholder="Ask Alyna about this case…"
              className="flex-1 bg-transparent px-4 py-3 text-sm outline-none"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground disabled:opacity-50"
            >
              <Send className="h-4 w-4" aria-hidden="true" />
            </button>
          </form>

        </div>
      </div>
    </AppLayout>
  );
};