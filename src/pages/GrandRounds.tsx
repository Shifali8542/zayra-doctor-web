import { AppLayout } from '@/components/AppLayout';
import { Card } from '@/components/Card';
import { Avatar } from '@/components/Avatar';
import { Icon } from '@/components/Icon';
import type { GrandRoundsThread } from '@/types';

const mockGrandRoundsThreads: GrandRoundsThread[] = [];

const ThreadRow = ({ thread }: { thread: GrandRoundsThread }) => (
  <Card className="transition hover:shadow-[0_8px_24px_rgba(10,37,64,0.08)]">
    <div className="flex flex-wrap items-start gap-4">
      <Avatar initials={thread.authorInitials} size={48} />
      <div className="min-w-0 flex-1">
        <p className="text-[15px] font-bold text-[var(--color-text-primary)]">
          {thread.authorName}
        </p>
        <p className="text-[13px] text-[var(--color-text-tertiary)]">
          {thread.authorSpecialty} · {thread.postedRelative}
        </p>
      </div>
    </div>

    <h3 className="mt-4 text-[18px] font-bold leading-7 text-[var(--color-text-primary)] lg:text-[20px] lg:leading-[28px]">
      {thread.title}
    </h3>

    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--color-divider)] pt-4">
      <div className="flex items-center gap-5">
        <span className="flex items-center gap-2 text-[13px] text-[var(--color-text-secondary)]">
          <Icon
            name="sparkle"
            size={15}
            color="var(--color-text-tertiary)"
            strokeWidth={1.8}
          />
          {thread.replies} replies
        </span>
        <span className="flex items-center gap-2 text-[13px] text-[var(--color-text-secondary)]">
          <Icon
            name="bookmark"
            size={15}
            color="var(--color-text-tertiary)"
            strokeWidth={1.8}
          />
          {thread.saved} saved
        </span>
      </div>
      <button className="rounded-pill border border-[var(--color-divider)] px-4 py-2 text-[13px] font-bold text-[var(--color-text-primary)] transition hover:bg-[var(--color-bg-alt)]">
        Open thread
      </button>
    </div>
  </Card>
);

export const GrandRoundsPage = () => {
  return (
    <AppLayout>
      <div className="mt-4">
        <h1 className="text-[28px] font-bold leading-[34px] text-[var(--color-text-primary)] lg:text-[32px]">
          Grand Rounds
        </h1>
        <p className="mt-1 text-[14px] text-[var(--color-text-secondary)]">
          Discussions, pearls and protocol updates from peers.
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-4">
        {mockGrandRoundsThreads.map((t) => (
          <ThreadRow key={t.id} thread={t} />
        ))}
      </div>
    </AppLayout>
  );
};