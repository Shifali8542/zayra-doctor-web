import { AppLayout } from '@/components/AppLayout';
import { Card } from '@/components/Card';

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
        <Card>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-[14px] leading-[22px] text-[var(--color-text-secondary)]">
              Grand Rounds discussions will appear here once the feature is live.
            </p>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
};