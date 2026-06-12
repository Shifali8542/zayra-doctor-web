import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppLayout } from '@/components/AppLayout';
import { Icon, type IconName } from '@/components/Icon';
import { RealEcgWaveform, WaveformPlaceholder } from '@/components/Waveform';
import { SeverityBadge } from '@/components/SeverityBadge';
import { useClaim } from '@/hooks/useClaim';
import { BLEPredictionTable } from '@/components/BLEMIPrediction';
import { cn, formatRelativeTime } from '@/utils/format';
import { useQuery } from '@tanstack/react-query';
import { patientApi, API_ENDPOINTS } from '@/services/api';
import type { CaseHistoryEvent, PatientWaveformResponse } from '@/types';

// Sub-components mapped to new reference UI
const ContextRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between border-b border-[var(--color-border)]/60 pb-2 last:border-0">
    <dt className="text-[var(--color-text-tertiary)] whitespace-nowrap mr-3">{label}</dt>
    <dd className="font-semibold text-[var(--color-text-primary)] text-right max-w-[65%]">{value}</dd>
  </div>
);

const SnapshotRow = ({
  label,
  subLabel,
  value,
  isCritical,
}: {
  label: string;
  subLabel: string;
  value: string;
  isCritical?: boolean;
}) => (
  <div className="flex items-center justify-between py-2.5 border-b border-[var(--color-border)]/60 last:border-0">
    <div>
      <div className="text-sm font-semibold text-[var(--color-text-primary)]">{label}</div>
      <div className="text-[0.7rem] text-[var(--color-text-tertiary)]">{subLabel}</div>
    </div>
    <div
      className={cn(
        'font-display text-lg font-bold tabular',
        isCritical ? 'text-[var(--color-danger)]' : 'text-[var(--color-text-primary)]',
      )}
    >
      {value}
    </div>
  </div>
);

const TimelineItem = ({ event }: { event: CaseHistoryEvent }) => (
  <li className="relative">
    <span className="absolute -left-[26px] top-1.5 h-2.5 w-2.5 rounded-full bg-[var(--color-accent)] ring-4 ring-[var(--color-surface)]" />
    <div className="tabular text-xs font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)]">
      {event.when ? formatRelativeTime(event.when) : '—'}
    </div>
    <div className="mt-0.5 text-sm text-[var(--color-text-primary)]">
      {event.description} {event.doctor_name ? `(${event.doctor_name})` : ''}
    </div>
  </li>
);

const ActionPathButton = ({
  icon,
  label,
  onClick,
  disabled,
  variant = 'default',
}: {
  icon: IconName;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'default' | 'critical';
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={cn(
      'flex w-full items-center justify-between rounded-xl px-3.5 py-3 text-left text-sm font-semibold transition-all',
      variant === 'critical'
        ? 'bg-[oklch(var(--severity-critical))] text-white shadow-pulse hover:brightness-110'
        : 'bg-white/10 text-white hover:bg-white/15',
      disabled && 'cursor-not-allowed opacity-50',
    )}
  >
    <span className="flex items-center gap-2.5">
      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white/15 [&>svg]:h-3.5 [&>svg]:w-3.5">
        <Icon name={icon} size={14} color="currentColor" strokeWidth={2} />
      </span>
      <span className="leading-tight">{label}</span>
    </span>
    <Icon name="arrow-up-right" size={14} className="shrink-0 opacity-70" color="currentColor" strokeWidth={2} />
  </button>
);

// Main Page
export const ClaimDetailPage = () => {
  const navigate = useNavigate();
  const { caseId } = useParams<{ caseId: string }>();
  const caseIdNum = caseId ? Number(caseId) : undefined;

  const [notes, setNotes] = useState('');
  const [selectedRecordId, setSelectedRecordId] = useState<number | null>(null);

  const {
    detail,
    isLoading,
    completeCase,
    escalateCase,
    triggerOrinn,
    isActioning,
    isAnalyzing,
    blePredictions,
    blePredictionsLoading,
  } = useClaim(caseIdNum, selectedRecordId);

  // Set the initial selected record when case details load
  useEffect(() => {
    if (detail?.records && detail.records.length > 0 && !selectedRecordId) {
      const defaultRecord = detail.records.find((r) => r.is_current) || detail.records[0];
      setSelectedRecordId(defaultRecord.id);
    }
  }, [detail, selectedRecordId]);

  // Fetch real waveform once we have the patient id from the case detail
  const patientIdFromDetail = detail?.patient?.id;
  const waveformQ = useQuery<PatientWaveformResponse>({
    queryKey: [API_ENDPOINTS.patientWaveform(patientIdFromDetail ?? 0), selectedRecordId],
    queryFn: () =>
      patientApi.getWaveform(patientIdFromDetail!, {
        record_id: selectedRecordId ?? undefined,
        downsample: 8,
        channels: 'II',
      }),
    enabled: Boolean(patientIdFromDetail) && Boolean(selectedRecordId),
    staleTime: 5 * 60 * 1000,
  });

  // Pick best channel from waveforms dict (prefer 'II', fall back to first)
  const primarySamples = waveformQ.data?.waveforms
    ? waveformQ.data.waveforms['II'] ??
    waveformQ.data.waveforms['ii'] ??
    Object.values(waveformQ.data.waveforms)[0] ??
    null
    : null;

  if (isLoading) {
    return (
      <AppLayout>
        <p className="py-10 text-center text-[var(--color-text-tertiary)]">Loading case…</p>
      </AppLayout>
    );
  }

  if (!detail) {
    return (
      <AppLayout>
        <p className="py-10 text-center text-[var(--color-text-tertiary)]">Case not found.</p>
      </AppLayout>
    );
  }

  const { case: c, patient, vitals, records, orinn, history } = detail;
  const activeRecord = records.find((r) => r.id === selectedRecordId);

  return (
    <AppLayout>
      <div className="mx-auto w-full max-w-7xl px-4 py-6 md:px-8 md:py-10">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 inline-flex items-center gap-1 text-sm text-[var(--color-text-tertiary)] transition-colors hover:text-[var(--color-text-primary)]"
        >
          <Icon name="chevron-left" size={16} /> Back to PulseDesk
        </button>

        {/* ── Hero Card ── */}
        <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-elevated md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <SeverityBadge severity={c.severity} />
                <span className="font-mono text-xs text-[var(--color-text-tertiary)]">
                  {patient.patient_code}
                </span>
                <span className="text-xs text-[var(--color-text-tertiary)]">
                  · {formatRelativeTime(c.created_at)}
                </span>
              </div>
              <h1 className="mt-3 font-display text-2xl font-bold leading-tight text-[var(--color-text-primary)] md:text-3xl">
                {patient.display_diagnosis || patient.diagnosis_class || 'Unknown Diagnosis'}
              </h1>
              <p className="mt-1 text-sm text-[var(--color-text-tertiary)]">
                {patient.sex ?? '—'} · {patient.age ?? '—'}y · {patient.dataset_source_display}{' '}
                {vitals.quality_score
                  ? ` · Signal Q${(vitals.quality_score * 100).toFixed(0)}`
                  : ''}
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => triggerOrinn(selectedRecordId ?? undefined)}
                className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm font-semibold text-[var(--color-text-primary)] hover:bg-[var(--color-bg-alt)]"
              >
                <Icon name="sparkle" size={14} /> {isAnalyzing ? 'Analyzing…' : 'Ask Alyna'}
              </button>
              <button
                onClick={() => navigate(`/trace/${caseIdNum}`)}
                className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                <Icon name="trace" size={14} /> Open TraceView
              </button>
            </div>
          </div>

          {/* ── BLE Live Monitoring Predictions ───────────────────────────────── */}
          <div className="mb-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-elevated md:p-6">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h2 className="text-[18px] font-bold text-[var(--color-text-primary)]">
                  BLE live monitoring
                </h2>
                <p className="text-[13px] text-[var(--color-text-tertiary)]">
                  MI predictions from patient's continuous BLE ECG stream
                </p>
              </div>
              <span className="rounded-full bg-[var(--color-bg-alt)] px-3 py-1 text-[11px] font-bold text-[var(--color-text-secondary)]">
                {blePredictions.length} readings
              </span>
            </div>
            <BLEPredictionTable
              predictions={blePredictions}
              isLoading={blePredictionsLoading}
            />
          </div>

          {/* ── History timeline */}
          <div className="mb-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-elevated md:p-6">
            <h2 className="mb-4 text-[18px] font-bold text-[var(--color-text-primary)]">
              History timeline
            </h2>
            {history.length === 0 ? (
              <p className="text-[14px] text-[var(--color-text-tertiary)]">No history yet.</p>
            ) : (
              history.map((event, i) => (
                <TimelineItem
                  key={i}
                  event={event}
                />
              ))
            )}
          </div>

          {/* Real vitals metrics grid */}
          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)]/60 p-3.5">
              <div className="flex items-center gap-1.5 text-[0.65rem] uppercase tracking-wider text-[var(--color-text-tertiary)]">
                <Icon name="heart" size={12} strokeWidth={2.5} /> Heart Rate
              </div>
              <div className="mt-1.5 flex items-baseline gap-1">
                <span
                  className={cn(
                    'tabular font-display text-2xl font-bold',
                    c.severity === 'critical' || c.severity === 'urgent'
                      ? 'text-[var(--color-danger)]'
                      : 'text-[var(--color-text-primary)]',
                  )}
                >
                  {vitals.heart_rate_bpm ?? c.heart_rate_bpm ?? '—'}
                </span>
                {(vitals.heart_rate_bpm || c.heart_rate_bpm) && (
                  <span className="text-xs text-[var(--color-text-tertiary)]">bpm</span>
                )}
              </div>
            </div>

            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)]/60 p-3.5">
              <div className="flex items-center gap-1.5 text-[0.65rem] uppercase tracking-wider text-[var(--color-text-tertiary)]">
                <Icon name="activity" size={12} strokeWidth={2.5} /> HRV
              </div>
              <div className="mt-1.5 flex items-baseline gap-1">
                <span className="tabular font-display text-2xl font-bold text-[var(--color-text-primary)]">
                  {vitals.hrv_ms ?? c.hrv_ms ?? '—'}
                </span>
                {(vitals.hrv_ms || c.hrv_ms) && (
                  <span className="text-xs text-[var(--color-text-tertiary)]">ms</span>
                )}
              </div>
            </div>

            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)]/60 p-3.5">
              <div className="flex items-center gap-1.5 text-[0.65rem] uppercase tracking-wider text-[var(--color-text-tertiary)]">
                <Icon name="sparkle" size={12} strokeWidth={2.5} /> AI Confidence
              </div>
              <div className="mt-1.5 flex items-baseline gap-1">
                <span className="tabular font-display text-2xl font-bold text-[var(--color-accent)]">
                  {c.confidence_score ?? '—'}
                </span>
                {c.confidence_score && (
                  <span className="text-xs text-[var(--color-text-tertiary)]">%</span>
                )}
              </div>
            </div>

            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)]/60 p-3.5">
              <div className="flex items-center gap-1.5 text-[0.65rem] uppercase tracking-wider text-[var(--color-text-tertiary)]">
                <Icon name="trace" size={12} strokeWidth={2.5} /> Rhythm
              </div>
              <div className="mt-1.5 flex items-baseline gap-1">
                <span className="tabular font-display text-xl font-bold text-[var(--color-text-primary)]">
                  {vitals.rhythm ?? '—'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Main Content Grid ── */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">

            {/* ── ECG Waveform strip ── */}
            <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-elevated md:p-6">
              <header className="mb-4 flex items-end justify-between gap-3">
                <div>
                  <h2 className="font-display text-base font-bold text-[var(--color-text-primary)]">
                    Anomaly waveform
                  </h2>
                  <p className="text-xs text-[var(--color-text-tertiary)]">
                    Lead II · {activeRecord?.sampling_rate ?? '—'}Hz ·{' '}
                    {activeRecord?.num_channels ?? '—'} channels
                  </p>
                </div>
                <button
                  onClick={() => navigate(`/trace/${caseIdNum}`)}
                  className="text-xs font-semibold text-[var(--color-accent)] hover:underline"
                >
                  Inspect in TraceView →
                </button>
              </header>

              {/* Record Switcher */}
              {records.length > 1 && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {records.map((record) => (
                    <button
                      key={record.id}
                      onClick={() => setSelectedRecordId(record.id)}
                      className={cn(
                        'rounded-full px-3 py-1.5 text-xs font-semibold transition-all',
                        selectedRecordId === record.id
                          ? 'bg-[var(--color-primary)] text-white shadow-elevated'
                          : 'border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]',
                      )}
                    >
                      {record.record_name} {record.is_current ? '(Current)' : ''}
                    </button>
                  ))}
                </div>
              )}

              {/* Render standard waveform matching the new theme bounds */}
              <div className="rounded-2xl bg-[oklch(0.13_0.025_250)] p-4">
                {waveformQ.isLoading && <WaveformPlaceholder height={180} />}
                {!waveformQ.isLoading && primarySamples && (
                  <RealEcgWaveform
                    samples={primarySamples}
                    effectiveSamplingRate={waveformQ.data?.effective_sampling_rate ?? 125}
                    height={180}
                    grid={waveformQ.data?.grid}
                  />
                )}
                {!waveformQ.isLoading && !primarySamples && (
                  <div className="flex h-[180px] items-center justify-center text-sm text-[var(--color-text-tertiary)] opacity-80">
                    Waveform not available for this record.
                  </div>
                )}
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-[var(--color-text-tertiary)]">
                <span className="tabular">Record: {activeRecord?.record_name ?? '—'}</span>
                <span>Lead II · 25mm/s · 10mm/mV</span>
              </div>
            </section>

            {/* ── Orinn AI Summary ── */}
            <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-elevated md:p-6">
              <header className="mb-4 flex items-end justify-between gap-3">
                <div>
                  <h2 className="font-display text-base font-bold text-[var(--color-text-primary)]">
                    Alyna summary
                  </h2>
                  <p className="text-xs text-[var(--color-text-tertiary)]">Governed AI assessment</p>
                </div>
                {!orinn && (
                  <button
                    onClick={() => triggerOrinn(selectedRecordId ?? undefined)}
                    disabled={isAnalyzing}
                    className="text-xs font-semibold text-[var(--color-accent)] hover:underline disabled:opacity-50"
                  >
                    {isAnalyzing ? 'Analyzing...' : 'Run analysis →'}
                  </button>
                )}
              </header>

              {orinn ? (
                <>
                  <p className="text-sm leading-relaxed text-[var(--color-text-primary)]">
                    {orinn.narrative}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs">
                    <span
                      className={cn(
                        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs',
                        orinn.risk_level === 'Critical' && 'bg-red-500/10 text-red-600',
                        orinn.risk_level === 'High' && 'bg-orange-500/10 text-orange-600',
                        orinn.risk_level === 'Moderate' && 'bg-yellow-500/10 text-yellow-600',
                        orinn.risk_level === 'Low' && 'bg-[var(--color-bg-alt)] text-[var(--color-text-secondary)]',
                      )}
                    >
                      {orinn.risk_level} Risk · Score {orinn.risk_score}/100
                    </span>
                    {orinn.findings.map((f, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-bg-alt)] px-2.5 py-1 text-xs text-[var(--color-text-secondary)]"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                  {orinn.recommendation && (
                    <div className="mt-4 rounded-lg bg-[var(--color-bg-alt)] p-3 text-sm text-[var(--color-text-secondary)]">
                      <strong>Recommendation:</strong> {orinn.recommendation}
                    </div>
                  )}
                </>
              ) : (
                <p className="text-sm text-[var(--color-text-tertiary)]">
                  Assessment pending. Click run analysis to get AI insights.
                </p>
              )}
            </section>

            {/* ── History timeline ── */}
            <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-elevated md:p-6">
              <header className="mb-4 flex items-end justify-between gap-3">
                <div>
                  <h2 className="font-display text-base font-bold text-[var(--color-text-primary)]">
                    History timeline
                  </h2>
                </div>
              </header>
              {history.length === 0 ? (
                <p className="text-sm text-[var(--color-text-tertiary)]">No history yet.</p>
              ) : (
                <ol className="relative ml-2 space-y-4 border-l border-[var(--color-border)] pl-5">
                  {history.map((event, i) => (
                    <TimelineItem key={i} event={event} />
                  ))}
                </ol>
              )}
            </section>
          </div>

          <div className="space-y-6">

            {/* ── Patient context ── */}
            <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-elevated md:p-6">
              <header className="mb-4 flex items-end justify-between gap-3">
                <div>
                  <h2 className="font-display text-base font-bold text-[var(--color-text-primary)]">
                    Patient context
                  </h2>
                </div>
              </header>
              <dl className="space-y-2.5 text-sm">
                <ContextRow label="Sex / Age" value={`${patient.sex ?? 'M'} · ${patient.age ?? '67'}y`} />
                <ContextRow label="Comorbidities" value="HTN, T2DM (controlled)" />
                <ContextRow label="Adherence" value="92%" />
                <ContextRow label="Activity" value="Sedentary, 4.2k steps/day" />
                <ContextRow label="Sleep" value="6h 12m avg · efficiency 78%" />
                <ContextRow label="Diet pattern" value="Moderate sodium, low fiber" />
                <ContextRow label="Smoking / Alcohol" value="Never · Occasional" />
              </dl>
            </section>

            {/* ── Physiology snapshot ── */}
            <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-elevated md:p-6">
              <header className="mb-4 flex items-end justify-between gap-3">
                <div>
                  <h2 className="font-display text-base font-bold text-[var(--color-text-primary)]">
                    Physiology snapshot
                  </h2>
                </div>
              </header>
              <SnapshotRow
                label="Pulse"
                subLabel={vitals.heart_rate_min && vitals.heart_rate_max ? `vs range ${vitals.heart_rate_min}-${vitals.heart_rate_max}` : 'vs unknown base'}
                value={vitals.heart_rate_bpm ? String(vitals.heart_rate_bpm) : '—'}
                isCritical={c.severity === 'critical' || c.severity === 'urgent'}
              />
              <SnapshotRow
                label="HRV"
                subLabel="baseline variation"
                value={vitals.hrv_ms ? `${vitals.hrv_ms}ms` : '—'}
              />
              <SnapshotRow
                label="Beats detected"
                subLabel="in active window"
                value={vitals.num_beats ? String(vitals.num_beats) : '—'}
              />
              <SnapshotRow
                label="Recovery"
                subLabel="elevated 36 hour"
                value={vitals.quality_score ? `${(vitals.quality_score * 100).toFixed(0)}%` : '—'}
              />
            </section>

            {/* ── ActionPath ── */}
            <div className="rounded-2xl border border-border bg-aurora p-5 text-primary-foreground shadow-glow">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] opacity-80">
                ActionPath
              </p>
              <h3 className="mt-1 font-display text-lg font-bold">Make a decision</h3>
              <div className="mt-4 space-y-2">
                <ActionPathButton
                  icon="phone"
                  label="Escalate to emergency response"
                  disabled={isActioning}
                  variant="critical"
                  onClick={() => escalateCase({ notes: notes || 'Escalated to emergency response.' })}
                />
                <ActionPathButton
                  icon="stethoscope"
                  label="Connect to cardiologist on-call"
                  disabled={isActioning}
                  onClick={() => escalateCase({ notes: notes || 'Referred to cardiologist on-call.' })}
                />
                <ActionPathButton
                  icon="eye"
                  label="Continue high observation"
                  disabled={isActioning}
                  onClick={() => completeCase({ notes: notes || 'Continue high observation.' })}
                />
                <ActionPathButton
                  icon="check-circle"
                  label="Continue monitoring"
                  disabled={isActioning}
                  onClick={() => completeCase({ notes: notes || 'Continue monitoring.' })}
                />
                <ActionPathButton
                  icon="close-circle"
                  label="Mark as false positive"
                  disabled={isActioning}
                  onClick={() => completeCase({ notes: notes || 'Marked as false positive.' })}
                />
              </div>
            </div>

          </div>
        </div>
      </div>
    </AppLayout>
  );
};