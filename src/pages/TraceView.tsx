import { useParams } from 'react-router-dom';
import { AppLayout } from '@/components/AppLayout';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { EcgWaveform } from '@/components/Waveform';
import { useTraceView } from '@/hooks/useTraceView';
import { cn } from '@/utils/format';

const ToolBtn = ({
  icon,
  onClick,
}: {
  icon: any;
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    className="flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-[var(--color-bg-alt)]"
  >
    <Icon name={icon} size={16} color="var(--color-text-primary)" />
  </button>
);

export const TraceViewPage = () => {
  const { caseId } = useParams<{ caseId: string }>();
  const {
    caseItem,
    rhythm,
    zoom,
    zoomIn,
    zoomOut,
    annotation,
    setAnnotation,
    saveAnnotation,
  } = useTraceView(caseId);

  if (!caseItem || !rhythm) return <AppLayout>{null}</AppLayout>;

  const sev =
    caseItem.severity === 'CRITICAL'
      ? 'critical'
      : caseItem.severity === 'URGENT'
        ? 'urgent'
        : 'normal';

  return (
    <AppLayout>
      {/* Title */}
      <div className="mb-4 mt-4">
        <h1 className="mb-2 text-[26px] font-bold text-[var(--color-text-primary)]">
          TraceView
        </h1>
        <p className="text-[14px] leading-[22px] text-[var(--color-text-secondary)]">
          {caseItem.caseId} · Lead II · 25 mm/s · 10 mm/mV · {caseItem.signalQ}
        </p>
      </div>

      {/* Toolbar */}
      <div className="mb-4 flex items-center gap-1 rounded-pill border border-[var(--color-divider)] bg-[var(--color-surface)] px-3 py-1.5">
        <ToolBtn icon="minus" onClick={zoomOut} />
        <span className="px-2 text-[14px] font-semibold text-[var(--color-text-primary)]">
          {zoom.toFixed(2)}x
        </span>
        <ToolBtn icon="plus" onClick={zoomIn} />
        <span className="mx-2 h-5 w-px bg-[var(--color-divider)]" />
        <ToolBtn icon="expand" />
        <ToolBtn icon="bookmark" />
        <ToolBtn icon="share" />
        <ToolBtn icon="book" />
      </div>

      {/* BEFORE */}
      <Strip label="BEFORE · 14:41:30 → 14:42:00">
        <EcgWaveform severity="normal" seed={11} cycles={Math.round(4 * zoom)} />
      </Strip>

      {/* DURING */}
      <Strip
        label="DURING ANOMALY · 14:42:00 → 14:42:30"
        highlighted
      >
        <EcgWaveform severity={sev} seed={42} cycles={Math.round(6 * zoom)} />
      </Strip>

      {/* AFTER */}
      <Strip label="AFTER · 14:42:30 → 14:43:00">
        <EcgWaveform severity="urgent" seed={73} cycles={Math.round(5 * zoom)} />
      </Strip>

      {/* Rhythm summary */}
      <Card className="mt-6">
        <h2 className="mb-3 text-[22px] font-bold text-[var(--color-text-primary)]">
          Rhythm summary
        </h2>
        <KvRow label="Rate" value={`${rhythm.rate} bpm`} />
        <KvRow label="QRS width" value={`${rhythm.qrsWidth} ms`} />
        <KvRow label="QT / QTc" value={`${rhythm.qt} / ${rhythm.qtc} ms`} />
        <KvRow label="Axis" value={`${rhythm.axis}°`} last />
      </Card>

      {/* Bookmarks */}
      <Card className="mt-4">
        <h2 className="mb-3 text-[22px] font-bold text-[var(--color-text-primary)]">
          Event bookmarks
        </h2>
        {rhythm.bookmarks.map((b) => (
          <button
            key={b.label}
            className="flex w-full items-center justify-between border-b border-[var(--color-divider)] py-3 text-left transition last:border-0 hover:opacity-70"
          >
            <span className="text-[14px] text-[var(--color-text-primary)]">
              {b.label} {b.offset}
            </span>
            <span className="text-[13px] font-semibold text-[var(--color-primary)]">
              jump →
            </span>
          </button>
        ))}
      </Card>

      {/* Annotations */}
      <Card className="mt-4">
        <h2 className="mb-3 text-[22px] font-bold text-[var(--color-text-primary)]">
          Annotations
        </h2>
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
          <textarea
            placeholder="Add a clinician note for this strip…"
            value={annotation}
            onChange={(e) => setAnnotation(e.target.value)}
            rows={4}
            className="w-full resize-none bg-transparent text-[14px] text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-tertiary)]"
          />
        </div>
        <Button
          label="Save annotation"
          onClick={saveAnnotation}
          fullWidth
          size="lg"
          className="mt-3"
        />
      </Card>
    </AppLayout>
  );
};

const Strip = ({
  label,
  highlighted,
  children,
}: {
  label: string;
  highlighted?: boolean;
  children: React.ReactNode;
}) => (
  <div
    className={cn(
      'mb-4 overflow-hidden rounded-lg p-3',
      highlighted &&
        'border border-[rgba(255,110,122,0.45)] shadow-[0_0_20px_rgba(255,110,122,0.35)]',
    )}
    style={{ backgroundColor: '#0E1B2C' }}
  >
    <div className="mb-2 flex justify-between">
      <span className="eyebrow text-[11px] tracking-[1.2px] text-white/80">
        {label}
      </span>
      <span className="eyebrow text-[11px] tracking-[1.2px] text-white/60">
        II · 25MM/S
      </span>
    </div>
    {children}
  </div>
);

const KvRow = ({
  label,
  value,
  last,
}: {
  label: string;
  value: string;
  last?: boolean;
}) => (
  <div
    className={cn(
      'flex items-center justify-between py-3',
      !last && 'border-b border-[var(--color-divider)]',
    )}
  >
    <span className="text-[14px] text-[var(--color-text-secondary)]">
      {label}
    </span>
    <span className="text-[14px] font-semibold text-[var(--color-text-primary)]">
      {value}
    </span>
  </div>
);
