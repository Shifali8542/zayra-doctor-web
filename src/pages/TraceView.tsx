import type { ReactNode } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppLayout } from '@/components/AppLayout';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Icon, type IconName } from '@/components/Icon';
import { RealEcgWaveform, WaveformPlaceholder } from '@/components/Waveform';
import { useTraceView } from '@/hooks/useTraceView';
import { cn } from '@/utils/format';
import type { RecordsIndexRecord, TraceViewCase } from '@/types';

export const TraceViewPage = () => {
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();
  const caseIdNum = caseId ? Number(caseId) : undefined;

  const {
    // Picker
    myCases,
    myCount,
    liveCases,
    liveCount,
    pickerLoading,
    hasMoreMyCases,
    hasMoreLiveCases,
    showingMoreMyCases,
    showingMoreLiveCases,
    loadMoreMyCases,
    loadMoreLiveCases,
    loadLessMyCases,
    loadLessLiveCases,
    myLoadingMore,
    liveLoadingMore,
    // Case/patient
    caseDetail,
    patientId,
    // Waveform
    primarySamples,
    allLeadSamples,
    effectiveSamplingRate,
    segments,
    waveformData,
    waveformLoading,
    // Lead
    selectedLead,
    setSelectedLead,
    availableLeads,
    // Records
    records,
    totalRecords,
    activeRecordId,
    activeRecordIndex,
    selectRecord,
    // Analysis
    analysis,
    // Metadata
    recordName,
    samplingRate,
    // View mode
    viewMode,
    setViewMode,
    // Zoom
    zoom,
    zoomIn,
    zoomOut,
    // Annotation
    annotation,
    setAnnotation,
    saveAnnotation,
    // Loading
    isLoading,
  } = useTraceView(caseIdNum);

  const hasWaveform = Boolean(primarySamples && primarySamples.length > 0);
  const caseInfo = caseDetail?.case;
  const patientInfo = caseDetail?.patient;

  // ── Case picker (sidebar click with no caseId) ─────────────────────────────
  if (!caseIdNum) {
    return (
      <AppLayout>
        <div className="mb-6 mt-4">
          <h1 className="text-[26px] font-bold text-[var(--color-text-primary)]">TraceView</h1>
          <p className="mt-1 text-[14px] text-[var(--color-text-secondary)]">
            Select a case to inspect its ECG signal
          </p>
        </div>

        {pickerLoading ? (
          <div className="py-10 text-center text-[14px] text-[var(--color-text-secondary)]">
            Loading cases…
          </div>
        ) : (
          <>
            {/* My claimed cases */}
           <CasePickerSection
              title={`My claimed cases · ${myCount}`}
              cases={myCases}
              onSelect={(id) => navigate(`/trace/${id}`)}
              hasMore={hasMoreMyCases}
              showingMore={showingMoreMyCases}
              onLoadMore={loadMoreMyCases}
              onLoadLess={loadLessMyCases}
              loadingMore={myLoadingMore}
            />
            <CasePickerSection
              title={`Live · unclaimed · ${liveCount}`}
              cases={liveCases}
              onSelect={(id) => navigate(`/trace/${id}`)}
              hasMore={hasMoreLiveCases}
              showingMore={showingMoreLiveCases}
              onLoadMore={loadMoreLiveCases}
              onLoadLess={loadLessLiveCases}
              loadingMore={liveLoadingMore}
            />
            {myCases.length === 0 && liveCases.length === 0 && (
              <Card>
                <p className="py-8 text-center text-[14px] text-[var(--color-text-secondary)]">
                  No active cases right now.
                </p>
              </Card>
            )}
          </>
        )}
      </AppLayout>
    );
  }

  // ── Waveform view (caseId present) ─────────────────────────────────────────
  return (
    <AppLayout>
      {/* Page header */}
      <div className="mb-4 mt-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1 text-[13px] text-[var(--color-text-secondary)] transition hover:text-[var(--color-text-primary)]"
            >
              <Icon name="chevron-left" size={16} color="currentColor" />
              Back
            </button>
          </div>
          <h1 className="text-[24px] font-bold text-[var(--color-text-primary)]">TraceView</h1>
          <p className="mt-0.5 text-[13px] text-[var(--color-text-secondary)]">
            Case #{caseId}
            {patientInfo?.patient_code ? ` · ${patientInfo.patient_code}` : ''}
            {patientInfo?.age ? ` · ${patientInfo.age}y` : ''}
            {patientInfo?.sex ? ` ${patientInfo.sex}` : ''}
            {` · Lead ${selectedLead} · ${samplingRate} Hz`}
            {recordName ? ` · ${recordName}` : ''}
          </p>
        </div>

        {/* Severity badge + view toggle */}
        <div className="flex items-center gap-2">
          {caseInfo?.severity && <SeverityBadge severity={caseInfo.severity} />}
          <div className="flex overflow-hidden rounded-pill border border-[var(--color-divider)] bg-[var(--color-surface)]">
            <ViewToggleBtn
              active={viewMode === 'strip'}
              onClick={() => setViewMode('strip')}
              label="Strip"
            />
            <ViewToggleBtn
              active={viewMode === '12lead'}
              onClick={() => setViewMode('12lead')}
              label="12-lead"
            />
          </div>
          <button
            onClick={() => navigate('/trace')}
            className="flex items-center gap-1.5 rounded-pill border border-[var(--color-divider)] bg-[var(--color-surface)] px-3 py-1.5 text-[12px] font-semibold text-[var(--color-text-secondary)] transition hover:bg-[var(--color-bg-alt)]"
          >
            <Icon name="cases" size={13} color="currentColor" />
            Switch case
          </button>
        </div>
      </div>

      {/* Loading skeleton */}
      {isLoading && (
        <>
          <WaveformStrip label="Before — loading…" lead={selectedLead}>
            <WaveformPlaceholder height={120} />
          </WaveformStrip>
          <WaveformStrip label="During anomaly — loading…" highlighted lead={selectedLead}>
            <WaveformPlaceholder height={120} />
          </WaveformStrip>
          <WaveformStrip label="After — loading…" lead={selectedLead}>
            <WaveformPlaceholder height={120} />
          </WaveformStrip>
        </>
      )}

      {!isLoading && (
        <>
          {/* Toolbar */}
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 rounded-pill border border-[var(--color-divider)] bg-[var(--color-surface)] px-2 py-1">
              <ToolBtn icon="minus" onClick={zoomOut} />
              <span className="min-w-[42px] text-center text-[13px] font-semibold text-[var(--color-text-primary)]">
                {zoom.toFixed(2)}×
              </span>
              <ToolBtn icon="plus" onClick={zoomIn} />
              <span className="mx-1 h-4 w-px bg-[var(--color-divider)]" />
              <ToolBtn icon="expand" />
              <ToolBtn icon="bookmark" />
              <ToolBtn icon="share" />
            </div>

            {/* Record tabs */}
            {records.length > 1 && (
              <div className="flex flex-wrap items-center gap-1.5">
                {records.map((rec: RecordsIndexRecord) => (
                  <button
                    key={rec.id}
                    onClick={() => selectRecord(rec.id)}
                    className={cn(
                      'rounded-pill border px-3 py-1 text-[12px] font-semibold transition',
                      rec.id === activeRecordId
                        ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white'
                        : 'border-[var(--color-divider)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)]',
                    )}
                  >
                    {rec.label || rec.record_name}
                    {rec.duration_seconds ? ` · ${rec.duration_seconds.toFixed(0)}s` : ''}
                  </button>
                ))}
                <span className="text-[12px] text-[var(--color-text-tertiary)]">
                  {activeRecordIndex + 1} of {totalRecords}
                </span>
              </div>
            )}
          </div>

          {/* Lead selector — strip mode only */}
          {viewMode === 'strip' && availableLeads.length > 1 && (
            <div className="mb-3 flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] uppercase tracking-[1px] text-[var(--color-text-tertiary)]">
                Lead
              </span>
              {availableLeads.map((lead) => (
                <button
                  key={lead}
                  onClick={() => setSelectedLead(lead)}
                  className={cn(
                    'rounded-pill border px-2.5 py-0.5 text-[11px] font-semibold transition',
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

          {/* ── 12-lead grid view ─────────────────────────────────────────── */}
          {viewMode === '12lead' && (
            <>
              {waveformLoading ? (
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <WaveformPlaceholder key={i} height={90} />
                  ))}
                </div>
              ) : Object.keys(allLeadSamples).length > 0 ? (
                <div className="mb-4 grid grid-cols-2 gap-2 md:grid-cols-3">
                  {availableLeads.map((lead) => {
                    const samples = allLeadSamples[lead] ?? allLeadSamples[lead.toLowerCase()];
                    if (!samples) return null;
                    const isAnomalyLead = lead.toUpperCase() === 'II';
                    return (
                      <button
                        key={lead}
                        onClick={() => {
                          setSelectedLead(lead);
                          setViewMode('strip');
                        }}
                        className="overflow-hidden rounded-lg text-left transition hover:ring-1 hover:ring-[var(--color-primary)]"
                        style={{ backgroundColor: '#0E1B2C' }}
                      >
                        <div className="flex items-center justify-between px-2.5 pt-2 pb-1">
                          <span
                            className={cn(
                              'text-[10px] font-bold uppercase tracking-[1.1px]',
                              isAnomalyLead ? 'text-[#FF6E7A]' : 'text-white/60',
                            )}
                          >
                            {lead}
                            {isAnomalyLead && ' ★'}
                          </span>
                          <span className="text-[9px] text-white/30">25mm/s</span>
                        </div>
                        <RealEcgWaveform
                          samples={samples}
                          effectiveSamplingRate={effectiveSamplingRate}
                          height={70}
                          strokeColor={isAnomalyLead ? '#FF6E7A' : '#4EECD8'}
                          grid={waveformData?.grid}
                        />
                      </button>
                    );
                  })}
                </div>
              ) : (
                <Card className="mb-4">
                  <p className="py-4 text-center text-[14px] text-[var(--color-text-tertiary)]">
                    No waveform data available.
                  </p>
                </Card>
              )}
            </>
          )}

          {/* ── Strip view ────────────────────────────────────────────────── */}
          {viewMode === 'strip' && (
            <>
              {/* Before */}
              <WaveformStrip
                label={
                  segments.before
                    ? `Before · ${segments.before.start_sec}s – ${segments.before.end_sec}s`
                    : `Before · Lead ${selectedLead}`
                }
                lead={selectedLead}
              >
                {waveformLoading ? (
                  <WaveformPlaceholder height={120} />
                ) : segments.before?.samples?.length ? (
                  <RealEcgWaveform
                    samples={segments.before.samples}
                    effectiveSamplingRate={effectiveSamplingRate}
                    height={120}
                    grid={waveformData?.grid}
                  />
                ) : primarySamples ? (
                  <RealEcgWaveform
                    samples={primarySamples.slice(0, Math.floor(primarySamples.length / 3))}
                    effectiveSamplingRate={effectiveSamplingRate}
                    height={120}
                  />
                ) : (
                  <NoSignal />
                )}
              </WaveformStrip>

              {/* During anomaly */}
              <WaveformStrip
                label={
                  segments.anomaly
                    ? `During anomaly · ${segments.anomaly.start_sec}s – ${segments.anomaly.end_sec}s`
                    : `During anomaly · Lead ${selectedLead}`
                }
                highlighted
                lead={selectedLead}
              >
                {waveformLoading ? (
                  <WaveformPlaceholder height={120} />
                ) : segments.anomaly?.samples?.length ? (
                  <RealEcgWaveform
                    samples={segments.anomaly.samples}
                    effectiveSamplingRate={effectiveSamplingRate}
                    height={120}
                    strokeColor="#FF6E7A"
                    grid={waveformData?.grid}
                  />
                ) : primarySamples ? (
                  <RealEcgWaveform
                    samples={primarySamples.slice(
                      Math.floor(primarySamples.length / 3),
                      Math.floor((primarySamples.length / 3) * 2),
                    )}
                    effectiveSamplingRate={effectiveSamplingRate}
                    height={120}
                    strokeColor="#FF6E7A"
                  />
                ) : (
                  <NoSignal />
                )}
              </WaveformStrip>

              {/* After */}
              <WaveformStrip
                label={
                  segments.after
                    ? `After · ${segments.after.start_sec}s – ${segments.after.end_sec}s`
                    : `After · Lead ${selectedLead}`
                }
                lead={selectedLead}
              >
                {waveformLoading ? (
                  <WaveformPlaceholder height={120} />
                ) : segments.after?.samples?.length ? (
                  <RealEcgWaveform
                    samples={segments.after.samples}
                    effectiveSamplingRate={effectiveSamplingRate}
                    height={120}
                    grid={waveformData?.grid}
                  />
                ) : primarySamples ? (
                  <RealEcgWaveform
                    samples={primarySamples.slice(Math.floor((primarySamples.length / 3) * 2))}
                    effectiveSamplingRate={effectiveSamplingRate}
                    height={120}
                  />
                ) : (
                  <NoSignal />
                )}
              </WaveformStrip>

              {/* Full recording */}
              {hasWaveform && !waveformLoading && (
                <WaveformStrip
                  label={`Full recording · Lead ${selectedLead} · ECG ${activeRecordIndex + 1} of ${totalRecords}`}
                  lead={selectedLead}
                >
                  <div className="overflow-x-auto">
                    <RealEcgWaveform
                      samples={primarySamples!}
                      effectiveSamplingRate={effectiveSamplingRate}
                      displaySeconds={10 * zoom}
                      height={120}
                      minWidth={600}
                      grid={waveformData?.grid}
                    />
                  </div>
                </WaveformStrip>
              )}

              {!waveformLoading && !hasWaveform && (
                <Card className="mb-4">
                  <p className="py-4 text-center text-[14px] text-[var(--color-text-tertiary)]">
                    No waveform signal available for this record.
                  </p>
                </Card>
              )}
            </>
          )}

          {/* Metrics */}
          {analysis && (
            <Card className="mb-4">
              <h2 className="mb-4 text-[17px] font-bold text-[var(--color-text-primary)]">
                Waveform analysis
              </h2>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {analysis.heart_rate_bpm != null && (
                  <MetricBox label="Heart rate" value={`${Math.round(analysis.heart_rate_bpm)} bpm`} />
                )}
                {analysis.hrv_ms != null && (
                  <MetricBox label="HRV (RMSSD)" value={`${Math.round(analysis.hrv_ms)} ms`} />
                )}
                {analysis.rhythm && (
                  <MetricBox label="Rhythm" value={analysis.rhythm} />
                )}
                {analysis.quality_score != null && (
                  <MetricBox
                    label="Signal quality"
                    value={`${Math.round(analysis.quality_score * 100)}%`}
                  />
                )}
                {analysis.wave_intervals?.pr_interval_ms != null && (
                  <MetricBox
                    label="PR interval"
                    value={`${Math.round(analysis.wave_intervals.pr_interval_ms)} ms`}
                  />
                )}
                {analysis.wave_intervals?.qrs_duration_ms != null && (
                  <MetricBox
                    label="QRS duration"
                    value={`${Math.round(analysis.wave_intervals.qrs_duration_ms)} ms`}
                  />
                )}
                {analysis.wave_intervals?.qt_interval_ms != null && (
                  <MetricBox
                    label="QT interval"
                    value={`${Math.round(analysis.wave_intervals.qt_interval_ms)} ms`}
                  />
                )}
                {analysis.num_beats != null && (
                  <MetricBox label="Beats detected" value={String(analysis.num_beats)} />
                )}
              </div>
            </Card>
          )}

          {/* Right panel info (patient + AI summary) — mobile only; desktop has sidebar */}
          {patientInfo && (
            <Card className="mb-4">
              <h2 className="mb-3 text-[16px] font-bold text-[var(--color-text-primary)]">
                Patient context
              </h2>
              <InfoRow label="Code" value={patientInfo.patient_code} />
              <InfoRow
                label="Age / sex"
                value={`${patientInfo.age ?? '—'}y · ${patientInfo.sex ?? '—'}`}
              />
              <InfoRow label="Dataset" value={patientInfo.dataset_source_display} />
              <InfoRow
                label="Diagnosis"
                value={patientInfo.display_diagnosis || patientInfo.diagnosis || '—'}
                last
              />
            </Card>
          )}

          {/* Annotation */}
          <Card className="mb-4">
            <h2 className="mb-3 text-[17px] font-bold text-[var(--color-text-primary)]">
              Clinical annotation
            </h2>
            <div className="rounded-lg border border-[var(--color-divider)] bg-[var(--color-surface)] p-3">
              <textarea
                placeholder="Add a clinician note for this strip…"
                value={annotation}
                onChange={(e) => setAnnotation(e.target.value)}
                rows={3}
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
        </>
      )}
    </AppLayout>
  );
};

// Sub-components

const ToolBtn = ({ icon, onClick }: { icon: IconName; onClick?: () => void }) => (
  <button
    onClick={onClick}
    className="flex h-7 w-7 items-center justify-center rounded-full transition hover:bg-[var(--color-bg-alt)]"
  >
    <Icon name={icon} size={15} color="var(--color-text-primary)" />
  </button>
);

const ViewToggleBtn = ({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) => (
  <button
    onClick={onClick}
    className={cn(
      'px-3 py-1.5 text-[12px] font-semibold transition',
      active
        ? 'bg-[var(--color-primary)] text-white'
        : 'bg-transparent text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-alt)]',
    )}
  >
    {label}
  </button>
);

const SeverityBadge = ({ severity }: { severity: string }) => {
  const styles: Record<string, string> = {
    critical: 'bg-red-100 text-red-700',
    urgent: 'bg-orange-100 text-orange-700',
    routine: 'bg-green-100 text-green-700',
    normal: 'bg-gray-100 text-gray-600',
  };
  return (
    <span
      className={cn(
        'rounded-pill px-3 py-1 text-[11px] font-bold capitalize',
        styles[severity] ?? styles.normal,
      )}
    >
      {severity}
    </span>
  );
};

const WaveformStrip = ({
  label,
  highlighted,
  children,
  lead,
}: {
  label: string;
  highlighted?: boolean;
  children: ReactNode;
  lead?: string;
}) => (
  <div
    className={cn(
      'mb-3 overflow-hidden rounded-lg',
      highlighted && 'border border-[rgba(255,110,122,0.45)]',
    )}
    style={{ backgroundColor: '#0E1B2C' }}
  >
    <div className="flex justify-between px-3 pt-2 pb-1">
      <span className="text-[10px] font-bold uppercase tracking-[1.2px] text-white/70">
        {label}
      </span>
      <span className="text-[10px] tracking-[1px] text-white/40">
        {lead ?? 'II'} · 25mm/s · 10mm/mV
      </span>
    </div>
    {children}
  </div>
);

const NoSignal = () => (
  <div className="flex h-[120px] items-center justify-center">
    <span className="text-[12px] text-white/30">No signal data</span>
  </div>
);

const MetricBox = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-lg bg-[var(--color-bg-alt)] p-3">
    <p className="mb-1 text-[10px] uppercase tracking-[1px] text-[var(--color-text-tertiary)]">
      {label}
    </p>
    <p className="text-[15px] font-semibold text-[var(--color-text-primary)]">{value}</p>
  </div>
);

const InfoRow = ({
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
      'flex justify-between py-2.5',
      !last && 'border-b border-[var(--color-divider)]',
    )}
  >
    <span className="text-[13px] text-[var(--color-text-secondary)]">{label}</span>
    <span className="text-[13px] font-semibold text-[var(--color-text-primary)]">{value}</span>
  </div>
);

// ── Case picker components ─────────────────────────────────────────────────────

const SEVERITY_COLORS: Record<string, string> = {
  critical: '#E24B4A',
  urgent: '#EF9F27',
  routine: '#639922',
  normal: '#888780',
};

const SEVERITY_BADGE: Record<string, string> = {
  critical: 'bg-red-100 text-red-700',
  urgent: 'bg-orange-100 text-orange-700',
  routine: 'bg-green-100 text-green-700',
  normal: 'bg-gray-100 text-gray-600',
};

const CasePickerSection = ({
  title,
  cases,
  onSelect,
  hasMore,
  showingMore,
  onLoadMore,
  onLoadLess,
  loadingMore,
}: {
  title: string;
  cases: TraceViewCase[];
  onSelect: (id: number) => void;
  hasMore?: boolean;
  showingMore?: boolean;
  onLoadMore?: () => void;
  onLoadLess?: () => void;
  loadingMore?: boolean;
}) => {
  if (cases.length === 0) return null;
  return (
    <div className="mb-4 overflow-hidden rounded-xl border border-[var(--color-divider)] bg-[var(--color-surface)]">
      <div className="border-b border-[var(--color-divider)] px-4 py-3">
        <p className="text-[11px] font-semibold uppercase tracking-[1.1px] text-[var(--color-text-secondary)]">
          {title}
        </p>
      </div>
      {cases.map((c, i) => (
        <button
          key={c.id}
          onClick={() => onSelect(c.id)}
          className={cn(
            'flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-[var(--color-bg-alt)]',
            i > 0 && 'border-t border-[var(--color-divider)]',
          )}
        >
          <span
            className="h-2 w-2 flex-shrink-0 rounded-full"
            style={{ backgroundColor: SEVERITY_COLORS[c.severity] ?? SEVERITY_COLORS.normal }}
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[14px] font-semibold text-[var(--color-text-primary)]">
              {c.display_diagnosis}
            </p>
            <p className="truncate text-[12px] text-[var(--color-text-secondary)]">
              {c.patient_code}
              {c.age ? ` · ${c.age}y` : ''}
              {c.sex ? ` ${c.sex}` : ''}
              {c.dataset_source_display ? ` · ${c.dataset_source_display}` : ''}
              {c.heart_rate_bpm ? ` · ${Math.round(c.heart_rate_bpm)} bpm` : ''}
            </p>
          </div>
          <span
            className={cn(
              'flex-shrink-0 rounded-pill px-2.5 py-0.5 text-[10px] font-bold capitalize',
              SEVERITY_BADGE[c.severity] ?? SEVERITY_BADGE.normal,
            )}
          >
            {c.severity}
          </span>
        </button>
      ))}
      {(hasMore || showingMore) && onLoadMore && onLoadLess && (
        <button
          onClick={showingMore ? onLoadLess : onLoadMore}
          disabled={loadingMore}
          className="flex w-full items-center justify-center gap-2 border-t border-[var(--color-divider)] px-4 py-3 text-[12px] font-semibold text-[var(--color-primary)] transition hover:bg-[var(--color-bg-alt)] disabled:opacity-50"
        >
          {loadingMore ? 'Loading…' : showingMore ? 'View less' : 'View more'}
        </button>
      )}
    </div>
  );
};