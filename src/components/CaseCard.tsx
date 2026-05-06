import type { CaseReview } from '@/types';
import { Card } from './Card';
import { SeverityBadge } from './SeverityBadge';
import { MetricCard } from './MetricCard';
import { WaveformPlaceholder } from './Waveform';
import { Button } from './Button';
import { Icon } from './Icon';
import { formatRelativeTime } from '@/utils/format';

interface Props {
  caseItem: CaseReview;
  onClick?: () => void;
  onClaim?: () => void;
  isClaiming?: boolean;
  showClaim?: boolean;
}

export const CaseCard = ({
  caseItem,
  onClick,
  onClaim,
  isClaiming = false,
  showClaim = true,
}: Props) => {
  // Seed waveform from patient_code string so same patient always gets same waveform
  const seed = caseItem.patient_code
    .split('')
    .reduce((acc, c) => acc + c.charCodeAt(0), 0);

  return (
    <Card
      className="transition hover:shadow-[0_8px_24px_rgba(10,37,64,0.08)]"
      onClick={onClick}
    >
      {/* Header row — severity + patient_code + time */}
      <div className="mb-3 flex items-center">
        <SeverityBadge severity={caseItem.severity} />
        <span className="ml-3 flex-1 text-[13px] tracking-[0.4px] text-[var(--color-text-tertiary)]">
          {caseItem.patient_code}
        </span>
        <div className="flex items-center gap-1">
          <Icon name="clock" size={13} color="var(--color-text-tertiary)" strokeWidth={1.8} />
          <span className="text-[13px] text-[var(--color-text-tertiary)]">
            {formatRelativeTime(caseItem.created_at)}
          </span>
          {caseItem.severity === 'critical' && (
            <span className="relative ml-2 inline-block h-2 w-2 rounded-full border-[1.5px] border-[var(--color-danger)]">
              <span className="absolute inset-0 animate-pulse-ring rounded-full border-[1.5px] border-[var(--color-danger)]" />
            </span>
          )}
        </div>
      </div>

      {/* Diagnosis — human readable from backend display_diagnosis */}
      <h3 className="mb-1 text-[18px] font-bold leading-7 text-[var(--color-text-primary)]">
        {caseItem.display_diagnosis || caseItem.diagnosis || '—'}
      </h3>
      {/* Patient meta */}
      <p className="mb-4 text-[14px] text-[var(--color-text-tertiary)]">
        {caseItem.sex ?? '—'} · {caseItem.age ?? '—'}y · {caseItem.patient_code}
      </p>

      {/* ECG waveform strip — seeded by patient_code */}
      <WaveformPlaceholder seed={seed} className="mb-4" />

      {/* Metrics — real HR + HRV + confidence from backend */}
      <div className="mb-4 flex gap-2">
        <MetricCard
          label="HR"
          value={caseItem.heart_rate_bpm ?? '—'}
          unit={caseItem.heart_rate_bpm ? 'bpm' : ''}
        />
        <MetricCard
          label="HRV"
          value={caseItem.hrv_ms ?? '—'}
          unit={caseItem.hrv_ms ? 'ms' : ''}
        />
        <MetricCard
          label="CONFIDENCE"
          value={caseItem.confidence_score ?? '—'}
          unit={caseItem.confidence_score ? '%' : ''}
        />
      </div>

      {/* Footer — dataset tag + claim button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="rounded-pill bg-[var(--color-bg-alt)] px-3 py-1 text-[11px] font-bold text-[var(--color-text-secondary)]">
            {caseItem.dataset_source_display}
          </span>
          {caseItem.record_name && (
            <span className="flex items-center gap-1 text-[13px] text-[var(--color-text-tertiary)]">
              <Icon name="trace" size={14} color="var(--color-text-tertiary)" strokeWidth={1.8} />
              {caseItem.record_name}
            </span>
          )}
        </div>
        {showClaim && caseItem.status === 'live' && (
          <Button
            label={isClaiming ? 'Claiming…' : 'Claim'}
            size="sm"
            onClick={(e) => {
              e?.stopPropagation();
              onClaim?.();
            }}
            iconRight="chevron-right"
          />
        )}
        {caseItem.status === 'claimed' && caseItem.doctor_name && (
          <span className="text-[13px] font-semibold text-[var(--color-primary)]">
            Dr. {caseItem.doctor_name}
          </span>
        )}
      </div>
    </Card>
  );
};