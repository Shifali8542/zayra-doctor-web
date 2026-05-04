import { AppLayout } from '@/components/AppLayout';
import { Tag } from '@/components/Tag';
import { Icon } from '@/components/Icon';
import { Avatar } from '@/components/Avatar';
import { useAlyna } from '@/hooks/useAlyna';

export const AlynaPage = () => {
  const { messages, suggestions, draft, setDraft, send } = useAlyna();

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

        {/* Suggestions */}
        <div className="mb-4 mt-3 flex flex-col gap-2">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              className="self-start rounded-pill border border-[var(--color-divider)] px-4 py-3 text-[14px] text-[var(--color-text-primary)] transition hover:opacity-70"
            >
              {s}
            </button>
          ))}
        </div>

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
            placeholder="Ask Alyna about this case…"
            className="flex-1 bg-transparent py-3 text-[14px] text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-tertiary)]"
          />
          <button
            onClick={() => send()}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-primary)] transition hover:opacity-90"
            aria-label="Send"
          >
            <Icon name="send" size={16} color="#FFFFFF" strokeWidth={2.4} />
          </button>
        </div>
      </div>
    </AppLayout>
  );
};
