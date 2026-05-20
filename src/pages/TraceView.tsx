import type { ReactNode } from 'react';
import { useParams } from 'react-router-dom';
import { AppLayout } from '@/components/AppLayout';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Icon, type IconName } from '@/components/Icon';
import { RealEcgWaveform, WaveformPlaceholder } from '@/components/Waveform';
import { useTraceView } from '@/hooks/useTraceView';
import { cn } from '@/utils/format';
import type { RecordsIndexRecord } from '@/types';

const ToolBtn = ({ icon, onClick }: { icon: IconName; onClick?: () => void }) => (
  <button
    onClick={onClick}
    className="flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-[var(--color-bg-alt)]"
  >
    <Icon name={icon} size={16} color="var(--color-text-primary)" />
  </button>
);

export const TraceViewPage = () => {
  const { caseId } = useParams<{ caseId: string }>();
  const caseIdNum = caseId ? Number(caseId) : undefined;

  const {
    primarySamples,
    effectiveSamplingRate,
    segments,
    waveformData,
    waveformLoading,
    records,
    totalRecords,
    activeRecordId,
    activeRecordIndex,
    selectRecord,
    analysis,
    patientId,
    recordName,
    samplingRate,
    isLoading,
    zoom,
    zoomIn,
    zoomOut,
    annotation,
    setAnnotation,
    saveAnnotation,
    selectedLead,
    setSelectedLead,
    availableLeads,
  } = useTraceView(caseIdNum);

  const hasWaveform = Boolean(primarySamples && primarySamples.length > 0);

  return (
    <AppLayout>
      {/* Title */}
      <div className="mb-4 mt-4">
        <h1 className="mb-2 text-[26px] font-bold text-[var(--color-text-primary)]">
          TraceView
        </h1>
        <p className="text-[14px] leading-[22px] text-[var(--color-text-secondary)]">
          Case #{caseId}{waveformData?.patient_code ? ` · ${waveformData.patient_code}` : patientId ? ` · Patient #${patientId}` : ''} · Lead {selectedLead} · {samplingRate} Hz
          {recordName ? ` · ${recordName}` : ''}
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

      {/* Lead selector — shown when record has multiple leads */}
      {availableLeads.length > 1 && (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="text-[12px] text-[var(--color-text-tertiary)]">Lead:</span>
          {availableLeads.map((lead) => (
            <button
              key={lead}
              onClick={() => setSelectedLead(lead)}
              className={cn(
                'rounded-pill border px-3 py-1 text-[12px] font-semibold transition',
                selectedLead === lead
                  ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white'
                  : 'border-[var(--color-divider)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)]',
              )}
            >
              {lead}
            </button>
          ))}
        </div>
      )}

      {/* Record tabs — shown when patient has multiple records */}
      {records.length > 1 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {records.map((rec: RecordsIndexRecord) => (
            <button
              key={rec.id}
              onClick={() => selectRecord(rec.id)}
              className={cn(
                'rounded-pill border px-3 py-1.5 text-[12px] font-semibold transition',
                rec.id === activeRecordId
                  ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white'
                  : 'border-[var(--color-divider)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)]',
              )}
            >
              {rec.label || rec.record_name}
              {rec.duration_seconds ? ` · ${rec.duration_seconds.toFixed(1)}s` : ''}
            </button>
          ))}
          <span className="self-center text-[12px] text-[var(--color-text-tertiary)]">
            ECG {activeRecordIndex + 1} of {totalRecords}
          </span>
        </div>
      )}

      {/* Loading skeleton — case detail or records index */}
      {isLoading && (
        <>
          <WaveformStrip label="BEFORE — loading…">
            <WaveformPlaceholder height={130} />
          </WaveformStrip>
          <WaveformStrip label="DURING ANOMALY — loading…" highlighted>
            <WaveformPlaceholder height={130} />
          </WaveformStrip>
          <WaveformStrip label="AFTER — loading…">
            <WaveformPlaceholder height={130} />
          </WaveformStrip>
        </>
      )}

      {/* Waveform strips — shown once patient is resolved */}
      {!isLoading && (
        <>
          {/* BEFORE segment */}
          <WaveformStrip
            label={segments.before
              ? `BEFORE · ${segments.before.start_sec}s – ${segments.before.end_sec}s`
              : 'BEFORE · Lead II'}
          >
            {waveformLoading ? (
              <WaveformPlaceholder height={130} />
            ) : segments.before?.samples?.length ? (
              <RealEcgWaveform
                samples={segments.before.samples}
                effectiveSamplingRate={effectiveSamplingRate}
                height={130}
              />
            ) : primarySamples ? (
              <RealEcgWaveform
                samples={primarySamples.slice(0, Math.floor(primarySamples.length / 3))}
                effectiveSamplingRate={effectiveSamplingRate}
                height={130}
              />
            ) : (
              <NoSignal />
            )}
          </WaveformStrip>

          {/* DURING ANOMALY segment */}
          <WaveformStrip
            label={segments.anomaly
              ? `DURING ANOMALY · ${segments.anomaly.start_sec}s – ${segments.anomaly.end_sec}s`
              : 'DURING ANOMALY · Lead II'}
            highlighted
          >
            {waveformLoading ? (
              <WaveformPlaceholder height={130} />
            ) : segments.anomaly?.samples?.length ? (
              <RealEcgWaveform
                samples={segments.anomaly.samples}
                effectiveSamplingRate={effectiveSamplingRate}
                height={130}
                strokeColor="#FF6E7A"
              />
            ) : primarySamples ? (
              <RealEcgWaveform
                samples={primarySamples.slice(
                  Math.floor(primarySamples.length / 3),
                  Math.floor((primarySamples.length / 3) * 2),
                )}
                effectiveSamplingRate={effectiveSamplingRate}
                height={130}
                strokeColor="#FF6E7A"
              />
            ) : (
              <NoSignal />
            )}
          </WaveformStrip>

          {/* AFTER segment */}
          <WaveformStrip
            label={segments.after
              ? `AFTER · ${segments.after.start_sec}s – ${segments.after.end_sec}s`
              : 'AFTER · Lead II'}
          >
            {waveformLoading ? (
              <WaveformPlaceholder height={130} />
            ) : segments.after?.samples?.length ? (
              <RealEcgWaveform
                samples={segments.after.samples}
                effectiveSamplingRate={effectiveSamplingRate}
                height={130}
              />
            ) : primarySamples ? (
              <RealEcgWaveform
                samples={primarySamples.slice(Math.floor((primarySamples.length / 3) * 2))}
                effectiveSamplingRate={effectiveSamplingRate}
                height={130}
              />
            ) : (
              <NoSignal />
            )}
          </WaveformStrip>

          {/* Full lead strip */}
          {hasWaveform && (
            <WaveformStrip
              label={`FULL RECORDING · Lead ${selectedLead} · ECG ${activeRecordIndex + 1} of ${totalRecords}`}
            >
              {waveformLoading ? (
                <WaveformPlaceholder height={130} />
              ) : (
                <div className="overflow-x-auto">
                  <RealEcgWaveform
                    samples={primarySamples!}
                    effectiveSamplingRate={effectiveSamplingRate}
                    displaySeconds={10 * zoom}
                    height={130}
                    minWidth={600}
                  />
                </div>
              )}
            </WaveformStrip>
          )}

          {/* No waveform state */}
          {!waveformLoading && !hasWaveform && !isLoading && (
            <Card className="mb-4">
              <p className="py-4 text-center text-[14px] text-[var(--color-text-tertiary)]">
                No waveform signal available for this record.
              </p>
            </Card>
          )}
        </>
      )}

      {/* Waveform analysis */}
      {analysis && (
        <Card className="mt-4">
          <h2 className="mb-4 text-[18px] font-bold text-[var(--color-text-primary)]">
            Waveform analysis
          </h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {analysis.heart_rate_bpm != null && (
              <Metric label="Heart Rate" value={`${analysis.heart_rate_bpm} bpm`} />
            )}
            {analysis.hrv_ms != null && (
              <Metric label="HRV (RMSSD)" value={`${analysis.hrv_ms} ms`} />
            )}
            {analysis.rhythm && (
              <Metric label="Rhythm" value={analysis.rhythm} />
            )}
            {analysis.num_beats != null && (
              <Metric label="Beats detected" value={String(analysis.num_beats)} />
            )}
            {analysis.quality_score != null && (
              <Metric label="Signal quality" value={`${(analysis.quality_score * 100).toFixed(0)}%`} />
            )}
          </div>
        </Card>
      )}

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
        <Button label="Save annotation" onClick={saveAnnotation} fullWidth size="lg" className="mt-3" />
      </Card>
    </AppLayout>
  );
};

// Sub-components
const WaveformStrip = ({
  label,
  highlighted,
  children,
  lead = 'II',
}: {
  label: string;
  highlighted?: boolean;
  children: ReactNode;
  lead?: string;
}) => (
  <div
    className={cn(
      'mb-4 overflow-hidden rounded-lg p-3',
      highlighted && 'border border-[rgba(255,110,122,0.45)] shadow-[0_0_20px_rgba(255,110,122,0.35)]',
    )}
    style={{ backgroundColor: '#0E1B2C' }}
  >
    <div className="mb-2 flex justify-between">
      <span className="text-[11px] font-bold tracking-[1.2px] uppercase text-white/80">{label}</span>
       <span className="text-[11px] tracking-[1.2px] text-white/50">{lead} · 25MM/S</span>
    </div>
    {children}
  </div>
);

const NoSignal = () => (
  <div className="flex h-[130px] items-center justify-center">
    <span className="text-[12px] text-white/30">No signal data</span>
  </div>
);

const Metric = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="mb-1 text-[11px] uppercase tracking-[1.2px] text-[var(--color-text-tertiary)]">{label}</p>
    <p className="text-[15px] font-semibold text-[var(--color-text-primary)]">{value}</p>
  </div>
);