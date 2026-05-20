import { AppLayout } from '@/components/AppLayout';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';

export const EcgAtlasPage = () => {
  return (
    <AppLayout>
      {/* Page header */}
      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold leading-[34px] text-[var(--color-text-primary)] lg:text-[32px]">
            ECG Atlas
          </h1>
          <p className="mt-1 text-[14px] text-[var(--color-text-secondary)]">
            Case-based learning · expert-reviewed · anonymized
          </p>
        </div>
        <div className="flex items-center gap-4 rounded-pill border border-[var(--color-divider)] bg-[var(--color-surface)] px-4 py-2">
          <span className="flex items-center gap-2 text-[13px] font-semibold text-[var(--color-text-primary)]">
            <Icon name="trophy" size={14} color="var(--color-text-primary)" strokeWidth={1.8} />
            — % accuracy
          </span>
          <span className="h-4 w-px bg-[var(--color-divider)]" />
          <span className="flex items-center gap-2 text-[13px] font-semibold text-[var(--color-text-primary)]">
            <Icon name="bookmark" size={14} color="var(--color-text-primary)" strokeWidth={1.8} />
            — solved
          </span>
        </div>
      </div>

      {/* Coming soon state */}
      <Card className="mt-6">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div
            className="mb-6 flex h-16 w-16 items-center justify-center rounded-full"
            style={{ backgroundColor: 'var(--color-bg-alt)' }}
          >
            <Icon name="book" size={28} color="var(--color-text-tertiary)" strokeWidth={1.5} />
          </div>
          <h2 className="mb-2 text-[22px] font-bold text-[var(--color-text-primary)]">
            ECG Atlas — Coming Soon
          </h2>
          <p className="mb-8 max-w-sm text-[14px] leading-[22px] text-[var(--color-text-secondary)]">
            The case library is being prepared. Expert-reviewed, anonymized ECG cases will appear here once available from the backend.
          </p>
          <Button label="Notify me" size="lg" iconLeft="book" />
        </div>
      </Card>
    </AppLayout>
  );
};