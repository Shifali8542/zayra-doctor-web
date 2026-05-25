import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppLayout } from '@/components/AppLayout';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { MetricCard } from '@/components/MetricCard';
import { Icon, type IconName } from '@/components/Icon';
import { RealEcgWaveform, WaveformPlaceholder } from '@/components/Waveform';
import { SeverityBadge } from '@/components/SeverityBadge';
import { useClaim } from '@/hooks/useClaim';
import { cn, formatRelativeTime } from '@/utils/format';
import { useQuery } from '@tanstack/react-query';
import { patientApi, API_ENDPOINTS } from '@/services/api';
import type { CaseHistoryEvent, CaseEcgRecord, PatientWaveformResponse } from '@/types';

// Sub-components
const Row = ({ label, value, last }: { label: string; value: string; last?: boolean }) => (
  <div className={cn('flex items-start py-3', !last && 'border-b border-[var(--color-divider)]')}>
    <span className="flex-1 text-[14px] text-[var(--color-text-secondary)]">{label}</span>
    <span className="flex-[1.4] text-right text-[14px] font-semibold text-[var(--color-text-primary)]">
      {value}
    </span>
  </div>
);

const TimelineItem = ({
  event,
  isFirst,
  isLast,
}: {
  event: CaseHistoryEvent;
  isFirst: boolean;
  isLast: boolean;
}) => (
  <div className="flex items-stretch">
    <div className="flex w-5 flex-col items-center">
      {!isFirst && <div className="h-3 w-px bg-[var(--color-divider)]" />}
      <div className="my-1 h-2 w-2 rounded-full bg-[var(--color-primary)]" />
      {!isLast && <div className="w-px flex-1 bg-[var(--color-divider)]" />}
    </div>
    <div className="mb-4 ml-3 flex-1">
      <p className="eyebrow mb-0.5 text-[11px] tracking-[1.2px] text-[var(--color-text-tertiary)]">
        {event.when ? formatRelativeTime(event.when) : '—'}
        {event.doctor_name ? ` · ${event.doctor_name}` : ''}
      </p>
      <p className="text-[14px] leading-[22px] text-[var(--color-text-primary)]">
        {event.description}
      </p>
    </div>
  </div>
);

const ActionPathButton = ({
  icon,
  label,
  onClick,
  disabled,
}: {
  icon: IconName;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={cn(
      'mb-3 flex w-full items-center gap-3 rounded-xl border border-white/20 bg-white/10 p-4 text-left transition hover:bg-white/15',
      disabled && 'cursor-not-allowed opacity-50',
    )}
  >
    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
      <Icon name={icon} size={18} color="#FFFFFF" strokeWidth={1.8} />
    </div>
    <span className="flex-1 text-[15px] font-semibold text-white">{label}</span>
    <Icon name="arrow-up-right" size={16} color="#FFFFFF" strokeWidth={1.8} />
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
    queryFn: () => patientApi.getWaveform(patientIdFromDetail!, {
      record_id: selectedRecordId ?? undefined,
      downsample: 8,
      channels: 'II',
    }),
    enabled: Boolean(patientIdFromDetail) && Boolean(selectedRecordId),
    staleTime: 5 * 60 * 1000,
  });

  // Pick best channel from waveforms dict (prefer 'II', fall back to first)
  const primarySamples = waveformQ.data?.waveforms
    ? (waveformQ.data.waveforms['II']
        ?? waveformQ.data.waveforms['ii']
        ?? Object.values(waveformQ.data.waveforms)[0]
        ?? null)
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

  const isClaimed = c.status === 'claimed';

  return (
    <AppLayout>
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="mb-2 inline-flex items-center gap-2 py-3 text-[14px] font-medium text-[var(--color-text-primary)] transition hover:opacity-70"
      >
        <Icon name="chevron-left" size={20} color="var(--color-text-primary)" />
        Back to Cases
      </button>

      {/* Case header */}
      <Card className="mb-5">
        <div className="mb-3 flex items-center gap-3">
          <SeverityBadge severity={c.severity} />
          <span className="text-[13px] text-[var(--color-text-tertiary)]">
            {patient.patient_code}
          </span>
          <span className="ml-auto text-[13px] text-[var(--color-text-tertiary)]">
            {formatRelativeTime(c.created_at)}
          </span>
        </div>

        <h1 className="mb-1 text-[26px] font-bold leading-[34px] text-[var(--color-text-primary)]">
          {patient.display_diagnosis}
        </h1>
        <p className="mb-5 text-[14px] text-[var(--color-text-tertiary)]">
          {patient.sex ?? '—'} · {patient.age ?? '—'}y · {patient.dataset_source_display}
        </p>

        {/* Real vitals from backend */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <MetricCard
            label="HEART RATE"
            value={vitals.heart_rate_bpm ?? c.heart_rate_bpm ?? '—'}
            unit={vitals.heart_rate_bpm ? 'bpm' : ''}
            icon="heart"
            large
          />
          <MetricCard
            label="HRV"
            value={vitals.hrv_ms ?? c.hrv_ms ?? '—'}
            unit={vitals.hrv_ms ? 'ms' : ''}
            icon="activity"
            large
          />
          <MetricCard
            label="AI CONFIDENCE"
            value={c.confidence_score ?? '—'}
            unit={c.confidence_score ? '%' : ''}
            icon="sparkle"
            large
          />
          <MetricCard
            label="RHYTHM"
            value={vitals.rhythm ?? '—'}
            icon="trace"
            large
          />
        </div>

        {/* Action buttons */}
        <div className="mt-5 flex flex-wrap gap-3">
          <Button
            label={isAnalyzing ? 'Analyzing…' : 'Ask Alyna'}
            variant="secondary"
            iconLeft="sparkle"
            size="md"
            onClick={() => triggerOrinn(selectedRecordId ?? undefined)}
          />
          <Button
            label="Open TraceView"
            iconLeft="trace"
            size="md"
            onClick={() => navigate(`/trace/${caseIdNum}`)}
          />
        </div>
      </Card>

      {/* ── ECG Waveform strip  */}
      <Card className="mb-5">
        <div className="mb-3 flex items-start justify-between">
          <div>
            <h2 className="text-[18px] font-bold text-[var(--color-text-primary)]">
              Anomaly waveform
            </h2>
            <p className="text-[13px] text-[var(--color-text-tertiary)]">
              Lead II · {records.find((r) => r.id === selectedRecordId)?.sampling_rate ?? '—'}Hz · {records.find((r) => r.id === selectedRecordId)?.num_channels ?? '—'} channels
            </p>
          </div>
         <button
            onClick={() => navigate(`/trace/${caseIdNum}`)}
            className="text-[13px] font-bold text-[var(--color-primary)] transition hover:opacity-70"
          >
            Inspect in TraceView →
          </button>
        </div>

        {/* ECG Record Switcher */}
        {records.length > 1 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {records.map((record) => (
              <button
                key={record.id}
                onClick={() => setSelectedRecordId(record.id)}
                className={cn(
                  "rounded-pill px-3 py-1.5 text-[13px] font-semibold transition",
                  selectedRecordId === record.id
                    ? "bg-[var(--color-primary)] text-white"
                    : "bg-[var(--color-surface)] text-[var(--color-text-secondary)] border border-[var(--color-divider)] hover:border-[var(--color-primary)]"
                )}
              >
                {record.record_name} {record.is_current ? '(Current)' : ''}
              </button>
            ))}
          </div>
        )}

        {waveformQ.isLoading && (
          <WaveformPlaceholder height={160} className="mt-2" />
        )}
        {!waveformQ.isLoading && primarySamples && (
          <RealEcgWaveform
            samples={primarySamples}
            effectiveSamplingRate={waveformQ.data?.effective_sampling_rate ?? 125}
            height={160}
            className="mt-2"
            grid={waveformQ.data?.grid}
          />
        )}
        {!waveformQ.isLoading && !primarySamples && (
          <p className="mt-3 text-[13px] text-[var(--color-text-tertiary)]">
            Waveform not available for this record.
          </p>
        )}
        <div className="mt-3 flex justify-between text-[12px] text-[var(--color-text-tertiary)]">
          <span>Record: {records.find((r) => r.id === selectedRecordId)?.record_name ?? '—'}</span>
          <span>Lead II · 25mm/s · 10mm/mV</span>
        </div>
      </Card>

      {/* Orinn AI Summary */}
      <Card className="mb-5">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-[18px] font-bold text-[var(--color-text-primary)]">
              Orinn AI summary
            </h2>
            <p className="text-[13px] text-[var(--color-text-tertiary)]">Governed AI assessment</p>
          </div>
         {!orinn && (
            <Button
              label={isAnalyzing ? 'Analyzing…' : 'Run analysis'}
              size="sm"
              variant="secondary"
              onClick={() => triggerOrinn(selectedRecordId ?? undefined)}
            />
          )}
        </div>

        {orinn ? (
          <>
            <div className="mb-3 flex items-center gap-2">
              <span className={cn(
                'rounded-pill px-3 py-1 text-[11px] font-bold',
                orinn.risk_level === 'Critical' && 'bg-red-100 text-red-700',
                orinn.risk_level === 'High' && 'bg-orange-100 text-orange-700',
                orinn.risk_level === 'Moderate' && 'bg-yellow-100 text-yellow-700',
                orinn.risk_level === 'Low' && 'bg-green-100 text-green-700',
              )}>
                {orinn.risk_level} Risk · {orinn.risk_score}/100
              </span>
            </div>
            <p className="mb-4 text-[14px] leading-[22px] text-[var(--color-text-primary)]">
              {orinn.narrative}
            </p>
            {orinn.findings.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {orinn.findings.map((f, i) => (
                  <span
                    key={i}
                    className="rounded-pill bg-[var(--color-bg-alt)] px-3 py-1 text-[11px] font-semibold text-[var(--color-text-secondary)]"
                  >
                    {f}
                  </span>
                ))}
              </div>
            )}
            {orinn.recommendation && (
              <p className="mt-3 rounded-lg bg-[var(--color-bg-alt)] p-3 text-[13px] text-[var(--color-text-secondary)]">
                <strong>Recommendation:</strong> {orinn.recommendation}
              </p>
            )}
          </>
        ) : (
          <p className="text-[14px] text-[var(--color-text-tertiary)]">
            Click "Run analysis" to get Orinn AI cardiac assessment for this patient.
          </p>
        )}
      </Card>

      {/* ── Patient context ────────────────────────────────────────────────── */}
      <Card className="mb-5">
        <h2 className="mb-3 text-[18px] font-bold text-[var(--color-text-primary)]">
          Patient context
        </h2>
        <Row label="Sex / Age" value={`${patient.sex ?? '—'} · ${patient.age ?? '—'}y`} />
        <Row label="Dataset" value={patient.dataset_source_display} />
        <Row label="Diagnosis class" value={patient.diagnosis_class ?? '—'} />
        {Boolean(patient.extra_info?.blood_pressure) && (
          <Row label="Blood pressure" value={String(patient.extra_info.blood_pressure)} />
        )}
        {Boolean(patient.extra_info?.reason_for_admission) && (
          <Row label="Reason for admission" value={String(patient.extra_info.reason_for_admission)} />
        )}
        {Boolean(patient.extra_info?.smoker) && (
          <Row label="Smoker" value={String(patient.extra_info.smoker)} />
        )}
        <Row label="All diagnoses" value={patient.display_diagnosis || patient.all_diagnoses.join(', ') || '—'} last />
      </Card>

      {/* ── Physiology snapshot ────────────────────────────────────────────── */}
      <Card className="mb-5">
        <h2 className="mb-3 text-[18px] font-bold text-[var(--color-text-primary)]">
          Physiology snapshot
        </h2>
        <Row label="Heart Rate" value={vitals.heart_rate_bpm ? `${vitals.heart_rate_bpm} bpm` : '—'} />
        <Row label="HR Range" value={vitals.heart_rate_min && vitals.heart_rate_max ? `${vitals.heart_rate_min} – ${vitals.heart_rate_max} bpm` : '—'} />
        <Row label="HRV (RMSSD)" value={vitals.hrv_ms ? `${vitals.hrv_ms} ms` : '—'} />
        <Row label="Rhythm" value={vitals.rhythm ?? '—'} />
        <Row label="Beats detected" value={vitals.num_beats ? String(vitals.num_beats) : '—'} />
        <Row label="Signal quality" value={vitals.quality_score ? `${(vitals.quality_score * 100).toFixed(0)}%` : '—'} last />
      </Card>

      {/* ── ECG Records list ───────────────────────────────────────────────── */}
      <Card className="mb-5">
        <h2 className="mb-3 text-[18px] font-bold text-[var(--color-text-primary)]">
          ECG Records ({records.length})
        </h2>
        {records.map((r: CaseEcgRecord, i) => (
          <Row
            key={r.id}
            label={r.is_current ? `${r.record_name} (current)` : r.record_name}
            value={`${r.num_channels}ch · ${r.duration_seconds?.toFixed(1) ?? '—'}s · ${r.sampling_rate}Hz`}
            last={i === records.length - 1}
          />
        ))}
        {records.length === 0 && (
          <p className="text-[14px] text-[var(--color-text-tertiary)]">No records found.</p>
        )}
      </Card>

      {/* ── History timeline ───────────────────────────────────────────────── */}
      <Card className="mb-5">
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
              isFirst={i === 0}
              isLast={i === history.length - 1}
            />
          ))
        )}
      </Card>

      {/* ActionPath */}
      {isClaimed && (
        <div className="hero-gradient mb-5 mt-3 rounded-2xl p-6">
          <p className="eyebrow mb-2 text-white/80" style={{ letterSpacing: '1.4px' }}>
            ACTIONPATH
          </p>
          <h2 className="mb-2 text-[22px] font-bold text-white">Make a decision</h2>
          <p className="mb-5 text-[13px] text-white/70">
            Add notes before submitting your decision.
          </p>

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Clinical notes, observations, outcome…"
            rows={3}
            className="mb-4 w-full resize-none rounded-xl border border-white/20 bg-white/10 p-3 text-[14px] text-white placeholder:text-white/50 outline-none"
          />

          <ActionPathButton
            icon="phone"
            label="Escalate to emergency response"
            disabled={isActioning}
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
      )}

      {/* Show outcome if already completed/escalated */}
      {(c.status === 'completed' || c.status === 'escalated') && c.notes && (
        <Card className="mb-5 border border-[var(--color-divider)]">
          <p className="eyebrow mb-2 text-[11px] tracking-[1.4px] text-[var(--color-text-tertiary)]">
            OUTCOME
          </p>
          <p className="text-[14px] text-[var(--color-text-primary)]">{c.notes}</p>
        </Card>
      )}
    </AppLayout>
  );
};