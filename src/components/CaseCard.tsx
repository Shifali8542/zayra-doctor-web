import type { CaseReview } from '@/types';
import { MetricCard } from './MetricCard';
import { WaveformPlaceholder } from './Waveform';
import { Button } from './Button';
import { Icon } from './Icon';
import { formatRelativeTime, cn } from '@/utils/format';

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
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative block w-full text-left overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-elevated transition-all hover:shadow-glow",
        caseItem.severity === 'critical' && "ring-1 ring-[oklch(var(--severity-critical)/0.4)]"
      )}
    >
      {caseItem.severity === 'critical' && (
        <div className="absolute right-4 top-4 h-2 w-2 animate-pulse-ring rounded-full bg-[oklch(var(--severity-critical))]"></div>
      )}

      {/* Header row */}
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-wide ring-1 ring-inset",
            caseItem.severity === 'critical' ? "bg-[oklch(var(--severity-critical)/0.12)] text-[oklch(var(--severity-critical))] ring-[oklch(var(--severity-critical)/0.3)]" :
            caseItem.severity === 'urgent' ? "bg-[oklch(var(--severity-urgent)/0.12)] text-[oklch(var(--severity-urgent))] ring-[oklch(var(--severity-urgent)/0.3)]" :
            caseItem.severity === 'routine' ? "bg-[oklch(var(--severity-routine)/0.12)] text-[oklch(var(--severity-routine))] ring-[oklch(var(--severity-routine)/0.3)]" :
            "bg-[oklch(var(--severity-normal)/0.12)] text-[oklch(var(--severity-normal))] ring-[oklch(var(--severity-normal)/0.3)]"
          )}>
            <span className="relative flex h-1.5 w-1.5">
              {caseItem.severity === 'critical' && <span className="absolute inset-0 animate-pulse-dot rounded-full bg-current"></span>}
              <span className="relative h-1.5 w-1.5 rounded-full bg-current"></span>
            </span>
            {caseItem.severity}
          </span>
          <span className="font-mono text-xs text-muted-foreground">{caseItem.patient_code}</span>
        </div>
        
        <span className="flex items-center gap-1 text-xs text-muted-foreground tabular-nums">
          <Icon name="clock" size={13} color="currentColor" strokeWidth={1.8} />
          {formatRelativeTime(caseItem.created_at)}
        </span>
      </div>

      <div className="mt-4">
        {/* Diagnosis */}
        <h3 className="font-display text-base font-semibold leading-tight text-foreground">
          {caseItem.display_diagnosis || caseItem.diagnosis || '—'}
        </h3>
        {/* Patient meta */}
        <p className="mt-1 text-sm text-muted-foreground">
          {caseItem.sex ?? '—'} · {caseItem.age ?? '—'}y · {caseItem.patient_code}
        </p>
      </div>

      {/* ECG skeleton */}
      <WaveformPlaceholder className="mt-3 -mx-1 h-12 overflow-hidden rounded-lg bg-muted/40" />

      {/* Metrics */}
      <div className="mt-4 grid grid-cols-3 gap-3 text-xs">
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

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Icon name="eye" size={12} color="currentColor" strokeWidth={2} />
            3 viewing
          </span>
          {caseItem.record_name && (
            <span className="flex items-center gap-1">
              <Icon name="activity" size={12} color="currentColor" strokeWidth={2} />
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
          <span className="text-[13px] font-semibold text-primary">
            Dr. {caseItem.doctor_name}
          </span>
        )}
      </div>
    </button>
  );
};