import type { BLEMIPrediction, WSMIAlert } from '@/types';
import { formatRelativeTime } from '@/utils/format';

// Severity colour map — matches existing SeverityBadge colour language
const SEVERITY_STYLES = {
  CRITICAL: 'bg-red-50 border-red-200 text-red-700',
  WARNING:  'bg-orange-50 border-orange-200 text-orange-700',
  NORMAL:   'bg-green-50 border-green-200 text-green-700',
} as const;

const SEVERITY_DOT = {
  CRITICAL: 'bg-red-500',
  WARNING:  'bg-orange-400',
  NORMAL:   'bg-green-500',
} as const;

// ── Live alert banner (used on Home page) ────────────────────────────────────
interface AlertBannerProps {
  alert: WSMIAlert;
  onDismiss: () => void;
}

export const BLEAlertBanner = ({ alert, onDismiss }: AlertBannerProps) => {
  const sev = alert.severity ?? 'WARNING';
  return (
    <div className={`mb-4 flex items-start gap-3 rounded-2xl border p-4 ${SEVERITY_STYLES[sev]}`}>
      <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${SEVERITY_DOT[sev]} animate-pulse`} />
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-bold uppercase tracking-wide mb-0.5">
          BLE MI Alert · {alert.patient_code}
        </p>
        <p className="text-[13px] leading-5">
          {sev} — {Math.round((alert.confidence ?? 0) * 100)}% confidence.{' '}
          {alert.recommendation}
        </p>
        {alert.timestamp && (
          <p className="mt-1 text-[11px] opacity-70">
            {formatRelativeTime(alert.timestamp)}
          </p>
        )}
      </div>
      <button
        onClick={onDismiss}
        className="shrink-0 text-[18px] leading-none opacity-50 hover:opacity-100"
        aria-label="Dismiss"
      >
        ×
      </button>
    </div>
  );
};

// ── Prediction history table (used in ClaimDetail) ───────────────────────────
interface PredictionTableProps {
  predictions: BLEMIPrediction[];
  isLoading: boolean;
}

export const BLEPredictionTable = ({ predictions, isLoading }: PredictionTableProps) => {
  if (isLoading) {
    return (
      <p className="text-[13px] text-[var(--color-text-tertiary)]">
        Loading BLE predictions…
      </p>
    );
  }
  if (predictions.length === 0) {
    return (
      <p className="text-[13px] text-[var(--color-text-tertiary)]">
        No BLE predictions recorded yet for this patient.
      </p>
    );
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-[13px]">
        <thead>
          <tr className="border-b border-[var(--color-divider)]">
            {['When', 'Result', 'Confidence', 'Severity', 'Recommendation'].map((h) => (
              <th
                key={h}
                className="pb-2 pr-4 text-left text-[11px] font-semibold uppercase tracking-[1px] text-[var(--color-text-tertiary)]"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {predictions.map((p) => (
            <tr
              key={p.id}
              className="border-b border-[var(--color-divider)] last:border-0"
            >
              <td className="py-3 pr-4 text-[var(--color-text-secondary)]">
                {formatRelativeTime(p.created_at)}
              </td>
              <td className="py-3 pr-4 font-semibold">
                <span className={p.mi_detected ? 'text-red-600' : 'text-green-600'}>
                  {p.mi_detected ? 'MI Detected' : 'Normal'}
                </span>
              </td>
              <td className="py-3 pr-4 text-[var(--color-text-primary)]">
                {Math.round(p.confidence * 100)}%
              </td>
              <td className="py-3 pr-4">
                <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${SEVERITY_STYLES[p.severity]}`}>
                  {p.severity}
                </span>
              </td>
              <td className="py-3 text-[var(--color-text-secondary)]">
                {p.recommendation || '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ── Mini badge (used in CaseCard) ────────────────────────────────────────────
interface MiniBadgeProps {
  prediction: BLEMIPrediction;
}

export const BLEMiniPredictionBadge = ({ prediction }: MiniBadgeProps) => {
  const sev = prediction.severity;
  if (sev === 'NORMAL') return null; // Don't clutter card if no MI
  return (
    <div className={`mt-3 flex items-center gap-2 rounded-xl border px-3 py-2 ${SEVERITY_STYLES[sev]}`}>
      <span className={`h-2 w-2 shrink-0 rounded-full ${SEVERITY_DOT[sev]}`} />
      <span className="text-[12px] font-semibold">
        BLE: {sev} · {Math.round(prediction.confidence * 100)}% confidence
      </span>
      <span className="ml-auto text-[11px] opacity-70">
        {formatRelativeTime(prediction.created_at)}
      </span>
    </div>
  );
};