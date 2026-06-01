import { AppLayout } from '@/components/AppLayout';
import { Tag } from '@/components/Tag';
import { Icon } from '@/components/Icon';
import { Avatar } from '@/components/Avatar';
import { useAlyna } from '@/hooks/useAlyna';

export const AlynaPage = () => {
  const { messages, suggestions, draft, setDraft, send, clear, isLoading, error } = useAlyna();

  return (
    <AppLayout>
      {/* Title block */}
      <div className="mb-5 mt-4 flex items-center">
        <Avatar initials="AL" size={56} />
        <div className="ml-4 flex-1">
          <h1 className="mb-1 text-[26px] font-bold text-[var(--color-text-primary)]">
            Alyna Assist
          </h1>
          <p className="text-[13px] leading-5 text-[var(--color-text-secondary)]">
            Governed clinical AI · grounded in patient signals
          </p>
        </div>
      </div>

      {/* Conversation card */}
      <div className="rounded-2xl border border-[var(--color-divider)] bg-[var(--color-surface)] p-4">

        {/* Empty state — shown before first message */}
        {messages.length === 0 && !isLoading ? (
          <div className="mb-4 flex">
            <div className="max-w-[92%] rounded-xl bg-[var(--color-bg-alt)] p-4">
              <p className="text-[14px] leading-[22px] text-[var(--color-text-primary)]">
                Hello Doctor 👋 I'm Alyna, your clinical AI assistant.
                I can help you understand ECG findings, explain metrics like QTc and HRV,
                and walk you through the AI risk report for any patient.
                How can I help you today?
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {['Explain QTc', 'What does HRV mean?', 'Summarise this case'].map((chip) => (
                  <button
                    key={chip}
                    onClick={() => send(chip)}
                    className="rounded-pill border border-[var(--color-divider)] px-3 py-2 text-[13px] text-[var(--color-text-primary)] transition hover:opacity-70"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        {messages.map((m) => {
          if (m.role === 'assistant') {
            return (
              <div key={m.id} className="mb-4 flex">
                <div
                  className="max-w-[92%] rounded-xl bg-[var(--color-bg-alt)] p-4"
                >
                  <p className="text-[14px] leading-[22px] text-[var(--color-text-primary)]">
                    {m.text}
                  </p>
                  {m.confidence !== undefined ? (
                    <>
                      <div className="my-3 h-px bg-[var(--color-divider)]" />
                      <p className="text-[14px] font-semibold text-[var(--color-text-primary)]">
                        Confidence {m.confidence}%
                      </p>
                    </>
                  ) : null}
                  {m.tags && m.tags.length > 0 ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {m.tags.map((t) => (
                        <Tag key={t} label={t} />
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            );
          }
          return (
            <div key={m.id} className="mb-4 flex justify-end">
              <div className="max-w-[85%] rounded-xl bg-[var(--color-primary)] p-4">
                <p className="text-[14px] leading-[22px] text-white">{m.text}</p>
              </div>
            </div>
          );
        })}

        {/* Suggestion chips — shown after last assistant reply */}
        {!isLoading && suggestions.length > 0 ? (
          <div className="mb-3 flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="rounded-pill border border-[var(--color-divider)] px-3 py-2 text-[13px] text-[var(--color-text-primary)] transition hover:opacity-70"
              >
                {s}
              </button>
            ))}
          </div>
        ) : null}

        {/* Error banner */}
        {error ? (
          <div className="mb-3 rounded-xl bg-red-50 px-4 py-3 text-[13px] text-red-600">
            {error}
          </div>
        ) : null}

        {/* Loading indicator */}
        {isLoading ? (
          <div className="mb-4 flex">
            <div className="rounded-xl bg-[var(--color-bg-alt)] px-4 py-3">
              <p className="text-[13px] text-[var(--color-text-secondary)]">
                Alyna is thinking…
              </p>
            </div>
          </div>
        ) : null}

        {/* Input */}
        <div className="flex items-center gap-2 rounded-pill border border-[var(--color-divider)] bg-[var(--color-surface)] py-1 pl-4 pr-1">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                send();
              }
            }}
            disabled={isLoading}
            placeholder="Ask Alyna about this case…"
            className="flex-1 bg-transparent py-3 text-[14px] text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-tertiary)] disabled:opacity-50"
          />
          <button
            onClick={() => send()}
            disabled={isLoading}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-primary)] transition hover:opacity-90 disabled:opacity-40"
            aria-label="Send"
          >
            <Icon name="send" size={16} color="#FFFFFF" strokeWidth={2.4} />
          </button>
        </div>

        {/* Clear conversation */}
        {messages.length > 0 ? (
          <button
            onClick={clear}
            className="mt-3 self-end text-[12px] text-[var(--color-text-tertiary)] transition hover:text-[var(--color-text-secondary)]"
          >
            Clear conversation
          </button>
        ) : null}
      </div>
    </AppLayout>
  );
};
