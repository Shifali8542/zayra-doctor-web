import type { Case } from '@/types';
import { Card } from './Card';
import { SeverityBadge } from './SeverityBadge';
import { MetricCard } from './MetricCard';
import { WaveformPlaceholder } from './Waveform';
import { Button } from './Button';
import { Icon } from './Icon';
import { formatRelativeMinutes } from '@/utils/format';

interface Props {
  caseItem: Case;
  onClick?: () => void;
  onClaim?: () => void;
  showClaim?: boolean;
}

export const CaseCard = ({
  caseItem,
  onClick,
  onClaim,
  showClaim = true,
}: Props) => {
  const seedFromId = caseItem.caseId
    .split('')
    .reduce((acc, c) => acc + c.charCodeAt(0), 0);

  return (
    <Card
      className="transition hover:shadow-[0_8px_24px_rgba(10,37,64,0.08)]"
      onClick={onClick}
    >
      {/* Header row */}
      <div className="mb-3 flex items-center">
        <SeverityBadge severity={caseItem.severity} />
        <span className="ml-3 flex-1 text-[13px] tracking-[0.4px] text-[var(--color-text-tertiary)]">
          {caseItem.caseId}
        </span>
        <div className="flex items-center gap-1">
          <Icon
            name="clock"
            size={13}
            color="var(--color-text-tertiary)"
            strokeWidth={1.8}
          />
          <span className="text-[13px] text-[var(--color-text-tertiary)]">
            {formatRelativeMinutes(caseItem.ageMinutes)}
          </span>
          {caseItem.severity === 'CRITICAL' ? (
            <span className="relative ml-2 inline-block h-2 w-2 rounded-full border-[1.5px] border-[var(--color-pulse-red)]">
              <span className="absolute inset-0 animate-pulse-ring rounded-full border-[1.5px] border-[var(--color-pulse-red)]" />
            </span>
          ) : null}
        </div>
      </div>

      {/* Anomaly + patient info */}
      <h3 className="mb-1 text-[18px] font-bold leading-7 text-[var(--color-text-primary)]">
        {caseItem.anomaly}
      </h3>
      <p className="mb-4 text-[14px] text-[var(--color-text-tertiary)]">
        {caseItem.patientSex} · {caseItem.patientAge}y · {caseItem.patientId}
      </p>

      <WaveformPlaceholder seed={seedFromId} className="mb-4" />

      {/* Metrics row */}
      <div className="mb-4 flex gap-2">
        <MetricCard
          label="HR"
          value={caseItem.hr}
          unit="bpm"
          delta={
            caseItem.hrDelta !== undefined
              ? `${caseItem.hrDelta > 0 ? '+' : ''}${caseItem.hrDelta}`
              : undefined
          }
        />
        <MetricCard label="SPO" subscript="₂" value={caseItem.spo2} unit="%" />
        <MetricCard label="CONFIDENCE" value={caseItem.confidence} unit="%" />
      </div>

      {/* Footer row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 text-[13px] text-[var(--color-text-tertiary)]">
            <Icon
              name="eye"
              size={15}
              color="var(--color-text-tertiary)"
              strokeWidth={1.8}
            />
            {caseItem.viewing} viewing
          </span>
          <span className="flex items-center gap-1 text-[13px] text-[var(--color-text-tertiary)]">
            <Icon
              name="trace"
              size={15}
              color="var(--color-text-tertiary)"
              strokeWidth={1.8}
            />
            {caseItem.signalQ}
          </span>
        </div>
        {showClaim ? (
          <Button
            label="Claim"
            size="sm"
            onClick={(e) => {
              e?.stopPropagation();
              onClaim?.();
            }}
            iconRight="chevron-right"
          />
        ) : null}
      </div>
    </Card>
  );
};
