import type { ReactNode } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppLayout } from '@/components/AppLayout';
import { Card } from '@/components/Card';
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
  const patientInfo = caseDetail?.patient;

  // ── Case picker view ───────────────────────────────────────────────────────
  if (!caseIdNum) {
    return (
      <AppLayout>
        <div className="mx-auto w-full max-w-7xl px-4 py-6 md:px-8 md:py-10">
          <div className="mb-6">
            <h1 className="font-display text-2xl font-bold md:text-3xl text-[var(--color-text-primary)]">TraceView</h1>
            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
              Select a case to inspect its ECG signal
            </p>
          </div>

          {pickerLoading ? (
            <div className="py-10 text-center text-sm text-[var(--color-text-secondary)]">
              Loading cases…
            </div>
          ) : (
            <>
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
                  <p className="py-8 text-center text-sm text-[var(--color-text-secondary)]">
                    No active cases right now.
                  </p>
                </Card>
              )}
            </>
          )}
        </div>
      </AppLayout>
    );
  }

  // ── Detail / Waveform view ─────────────────────────────────────────────────
  return (
    <AppLayout>
      <div className="mx-auto w-full max-w-7xl px-4 py-6 md:px-8 md:py-10">
        
        {/* Page header (Target UI) */}
        <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold md:text-3xl text-[var(--color-text-primary)]">
              TraceView
            </h1>
            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
              {patientInfo?.patient_code ?? `Case #${caseId}`}
              {` · Lead ${selectedLead}`}
              {waveformData?.grid?.paper_speed_mm_per_sec
                ? ` · ${waveformData.grid.paper_speed_mm_per_sec} mm/s`
                : ' · 25 mm/s'}
              {waveformData?.grid?.amplitude_mm_per_mv
                ? ` · ${waveformData.grid.amplitude_mm_per_mv} mm/mV`
                : ' · 10 mm/mV'}
              {analysis?.quality_score
                ? ` · Q${Math.round(analysis.quality_score * 100)}`
                : ''}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Zoom & Action Toolbar */}
            <div className="flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] p-1.5">
              <ToolBtn icon="minus" onClick={zoomOut} />
              <span className="px-2 text-xs font-mono tabular text-[var(--color-text-primary)]">
                {zoom.toFixed(2)}×
              </span>
              <ToolBtn icon="plus" onClick={zoomIn} />
              <div className="mx-1 h-5 w-px bg-[var(--color-border)]" />
              <ToolBtn icon="expand" />
              <ToolBtn icon="bookmark" />
              <ToolBtn icon="share" />
              <ToolBtn icon="book" />
            </div>

            {/* Preserved Functionality: View Toggle */}
            <div className="hidden md:flex overflow-hidden rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] p-0.5">
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

            {/* Preserved Functionality: Switch case */}
            <button
              onClick={() => navigate('/trace')}
              className="flex h-9 items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 text-sm font-semibold text-[var(--color-text-primary)] transition hover:bg-[var(--color-bg-alt)]"
            >
              Switch case
            </button>
          </div>
        </header>

        {/* Loading skeleton */}
        {isLoading && (
          <div className="space-y-4">
            <WaveformStrip label="Before — loading…" rightLabel={`Lead ${selectedLead}`}>
              <WaveformPlaceholder height={120} />
            </WaveformStrip>
            <WaveformStrip label="During anomaly — loading…" highlighted rightLabel={`Lead ${selectedLead}`}>
              <WaveformPlaceholder height={120} />
            </WaveformStrip>
            <WaveformStrip label="After — loading…" rightLabel={`Lead ${selectedLead}`}>
              <WaveformPlaceholder height={120} />
            </WaveformStrip>
          </div>
        )}

        {!isLoading && (
          <>
            {/* Record tabs & Lead selector (Preserved functionality) */}
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {records.length > 1 && (
                <div className="flex flex-wrap items-center gap-1.5">
                  {records.map((rec: RecordsIndexRecord) => (
                    <button
                      key={rec.id}
                      onClick={() => selectRecord(rec.id)}
                      className={cn(
                        'rounded-full border px-3 py-1.5 text-xs font-semibold transition-all',
                        rec.id === activeRecordId
                          ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white shadow-elevated'
                          : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]',
                      )}
                    >
                      {rec.label || rec.record_name}
                      {rec.duration_seconds ? ` · ${rec.duration_seconds.toFixed(0)}s` : ''}
                    </button>
                  ))}
                  <span className="ml-2 text-xs text-[var(--color-text-tertiary)]">
                    {activeRecordIndex + 1} of {totalRecords}
                  </span>
                </div>
              )}

              {viewMode === 'strip' && availableLeads.length > 1 && (
                <div className="ml-auto flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] uppercase tracking-[1px] text-[var(--color-text-tertiary)]">
                    Lead
                  </span>
                  {availableLeads.map((lead) => (
                    <button
                      key={lead}
                      onClick={() => setSelectedLead(lead)}
                      className={cn(
                        'rounded-full border px-2.5 py-1 text-[11px] font-semibold transition',
                        selectedLead === lead
                          ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white'
                          : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]',
                      )}
                    >
                      {lead}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ── 12-lead grid view ── */}
            {viewMode === '12lead' && (
              <>
                {waveformLoading ? (
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <WaveformPlaceholder key={i} height={90} />
                    ))}
                  </div>
                ) : Object.keys(allLeadSamples).length > 0 ? (
                  <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-3">
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
                          className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[oklch(0.13_0.025_250)] text-left transition hover:border-[var(--color-primary)] hover:ring-1 hover:ring-[var(--color-primary)]"
                        >
                          <div className="flex items-center justify-between px-3 pt-2.5 pb-1">
                            <span
                              className={cn(
                                'text-[11px] font-bold uppercase tracking-[1.1px]',
                                isAnomalyLead ? 'text-[#FF6E7A]' : 'text-white/60',
                              )}
                            >
                              {lead}
                              {isAnomalyLead && ' ★'}
                            </span>
                            <span className="text-[10px] text-white/30 font-mono">25mm/s</span>
                          </div>
                          <div className="px-2 pb-2">
                            <RealEcgWaveform
                              samples={samples}
                              effectiveSamplingRate={effectiveSamplingRate}
                              height={70}
                              strokeColor={isAnomalyLead ? '#FF6E7A' : '#4EECD8'}
                              grid={waveformData?.grid}
                            />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <Card className="mb-4">
                    <p className="py-4 text-center text-sm text-[var(--color-text-tertiary)]">
                      No waveform data available.
                    </p>
                  </Card>
                )}
              </>
            )}

            {/* ── Strip view ── */}
            {viewMode === 'strip' && (
              <div className="space-y-4">
                
                {/* Before */}
                <WaveformStrip
                  label={`Before · ${segments.before ? `${segments.before.start_sec}s → ${segments.before.end_sec}s` : 'Unknown timeframe'}`}
                  rightLabel={`${selectedLead} · 25mm/s`}
                >
                  {waveformLoading ? (
                    <WaveformPlaceholder height={120} />
                  ) : segments.before ? (
                    segments.before.samples.length > 0 ? (
                      <RealEcgWaveform
                        samples={primarySamples ? primarySamples.slice(Math.floor(segments.before.start_sec * effectiveSamplingRate), Math.ceil(segments.before.end_sec * effectiveSamplingRate)) : []}
                        effectiveSamplingRate={effectiveSamplingRate}
                        height={120}
                        grid={waveformData?.grid}
                      />
                    ) : (
                      <NoSignal message="No pre-anomaly data available." />
                    )
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
                  label={`During anomaly · ${segments.anomaly ? `${segments.anomaly.start_sec}s → ${segments.anomaly.end_sec}s` : 'Unknown timeframe'}`}
                  rightLabel={`${selectedLead} · 25mm/s`}
                  highlighted
                >
                  {waveformLoading ? (
                    <WaveformPlaceholder height={120} />
                  ) : segments.anomaly?.samples?.length ? (
                    <RealEcgWaveform
                      samples={primarySamples ? primarySamples.slice(Math.floor(segments.anomaly.start_sec * effectiveSamplingRate), Math.ceil(segments.anomaly.end_sec * effectiveSamplingRate)) : []}
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
                  label={`After · ${segments.after ? `${segments.after.start_sec}s → ${segments.after.end_sec}s` : 'Unknown timeframe'}`}
                  rightLabel={`${selectedLead} · 25mm/s`}
                >
                  {waveformLoading ? (
                    <WaveformPlaceholder height={120} />
                  ) : segments.after ? (
                    segments.after.samples.length > 0 ? (
                      <RealEcgWaveform
                        samples={primarySamples ? primarySamples.slice(Math.floor(segments.after.start_sec * effectiveSamplingRate), Math.ceil(segments.after.end_sec * effectiveSamplingRate)) : []}
                        effectiveSamplingRate={effectiveSamplingRate}
                        height={120}
                        grid={waveformData?.grid}
                      />
                    ) : (
                      <NoSignal message="No post-anomaly data available." />
                    )
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
                    label={`Full recording · ECG ${activeRecordIndex + 1} of ${totalRecords}`}
                    rightLabel={`${selectedLead} · 25mm/s`}
                  >
                    <div className="overflow-x-auto scrollbar-hide">
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
                  <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-elevated">
                    <p className="text-center text-sm text-[var(--color-text-tertiary)]">
                      No waveform signal available for this record.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* ── Bottom Grid ──────────────────────────────────────────────────────── */}
            <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
              
              {/* Rhythm Summary */}
              <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-elevated">
                <h3 className="mb-3 font-display font-bold text-[var(--color-text-primary)]">Rhythm summary</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span className="text-[var(--color-text-secondary)]">Rate</span>
                    <span className="font-display font-bold tabular text-[var(--color-text-primary)]">
                      {analysis?.heart_rate_bpm ? `${Math.round(analysis.heart_rate_bpm)} bpm` : '—'}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-[var(--color-text-secondary)]">QRS width</span>
                    <span className="font-display font-bold tabular text-[var(--color-text-primary)]">
                      {analysis?.wave_intervals?.qrs_duration_ms ? `${Math.round(analysis.wave_intervals.qrs_duration_ms)} ms` : '—'}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-[var(--color-text-secondary)]">QT / QTc</span>
                    <span className="font-display font-bold tabular text-[var(--color-text-primary)]">
                      {analysis?.wave_intervals?.qt_interval_ms ? Math.round(analysis.wave_intervals.qt_interval_ms) : '—'} /{' '}
                      {analysis?.wave_intervals?.qtc_interval_ms ? Math.round(analysis.wave_intervals.qtc_interval_ms) : '—'} ms
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-[var(--color-text-secondary)]">Axis</span>
                    <span className="font-display font-bold tabular text-[var(--color-text-primary)]">
                      {analysis?.rhythm ?? '—'}
                    </span>
                  </li>
                </ul>
              </div>

              {/* Event Bookmarks */}
              <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-elevated">
                <h3 className="mb-3 font-display font-bold text-[var(--color-text-primary)]">Event bookmarks</h3>
                <ul className="space-y-2 text-sm">
                  {(() => {
                    const onsetSec = segments.anomaly?.start_sec ?? null;
                    const peakSec = onsetSec !== null && segments.anomaly?.end_sec != null
                      ? Math.round((onsetSec + segments.anomaly.end_sec) / 2)
                      : null;
                    const resolSec = segments.after?.start_sec ?? segments.anomaly?.end_sec ?? null;

                    const bookmarks = [
                      { label: 'Onset', offsetSec: onsetSec },
                      { label: 'Peak', offsetSec: peakSec },
                      { label: 'Resolution', offsetSec: resolSec },
                    ].filter((b) => b.offsetSec !== null);

                    if (bookmarks.length === 0) {
                      return <li className="text-[var(--color-text-tertiary)]">No bookmarks available.</li>;
                    }

                    return bookmarks.map((bm, i) => (
                      <li key={i} className="flex items-center justify-between rounded-lg bg-[var(--color-bg-alt)] px-3 py-2 text-[var(--color-text-primary)]">
                        <span>{bm.label} T+{bm.offsetSec}s</span>
                        <button className="text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
                          jump →
                        </button>
                      </li>
                    ));
                  })()}
                </ul>
              </div>

              {/* Annotations */}
              <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-elevated">
                <h3 className="mb-3 font-display font-bold text-[var(--color-text-primary)]">Annotations</h3>
                <textarea
                  placeholder="Add a clinician note for this strip…"
                  value={annotation}
                  onChange={(e) => setAnnotation(e.target.value)}
                  className="h-28 w-full resize-none rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-3 text-sm text-[var(--color-text-primary)] outline-none focus:ring-2 focus:ring-[var(--color-primary)] placeholder:text-[var(--color-text-tertiary)]"
                />
                <button
                  onClick={saveAnnotation}
                  className="mt-3 w-full rounded-full bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                >
                  Save annotation
                </button>
              </div>

            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
};

// ── Sub-components ───────────────────────────────────────────────────────────

const ToolBtn = ({ icon, onClick }: { icon: IconName; onClick?: () => void }) => (
  <button
    onClick={onClick}
    className="grid h-8 w-8 place-items-center rounded-full text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-bg-alt)] hover:text-[var(--color-text-primary)]"
  >
    <Icon name={icon} size={16} color="currentColor" />
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
      'px-4 py-1.5 text-xs font-semibold transition-all rounded-full',
      active
        ? 'bg-[var(--color-primary)] text-white'
        : 'bg-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]',
    )}
  >
    {label}
  </button>
);

const WaveformStrip = ({
  label,
  rightLabel,
  highlighted,
  children,
}: {
  label: string;
  rightLabel: string;
  highlighted?: boolean;
  children: ReactNode;
}) => (
  <section
    className={cn(
      'overflow-hidden rounded-2xl border bg-[oklch(0.13_0.025_250)]',
      highlighted
        ? 'border-[oklch(var(--severity-critical)/0.4)] shadow-pulse'
        : 'border-[var(--color-border)]/20',
    )}
  >
    <div className="flex items-center justify-between px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white/70">
      <span>{label}</span>
      <span className="font-mono text-white/50">{rightLabel}</span>
    </div>
    <div className="px-2 pb-3">{children}</div>
  </section>
);

const NoSignal = ({ message = 'No signal data' }: { message?: string }) => (
  <div className="flex h-[120px] items-center justify-center px-6 text-center">
    <span className="text-sm text-white/50">{message}</span>
  </div>
);

// ── Case picker components ───────────────────────────────────────────────────

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
    <div className="mb-4 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-elevated">
      <div className="border-b border-[var(--color-border)] px-5 py-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
          {title}
        </p>
      </div>
      {cases.map((c, i) => (
        <button
          key={c.id}
          onClick={() => onSelect(c.id)}
          className={cn(
            'flex w-full items-center gap-4 px-5 py-3.5 text-left transition hover:bg-[var(--color-bg-alt)]',
            i > 0 && 'border-t border-[var(--color-border)]',
          )}
        >
          <span
            className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
            style={{ backgroundColor: SEVERITY_COLORS[c.severity] ?? SEVERITY_COLORS.normal }}
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-[var(--color-text-primary)]">
              {c.display_diagnosis}
            </p>
            <p className="truncate text-xs text-[var(--color-text-secondary)] mt-0.5">
              {c.patient_code}
              {c.age ? ` · ${c.age}y` : ''}
              {c.sex ? ` ${c.sex}` : ''}
              {c.dataset_source_display ? ` · ${c.dataset_source_display}` : ''}
              {c.heart_rate_bpm ? ` · ${Math.round(c.heart_rate_bpm)} bpm` : ''}
            </p>
          </div>
          <span
            className={cn(
              'flex-shrink-0 rounded-full px-3 py-1 text-xs font-bold capitalize',
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
          className="flex w-full items-center justify-center gap-2 border-t border-[var(--color-border)] px-4 py-3 text-xs font-semibold text-[var(--color-primary)] transition hover:bg-[var(--color-bg-alt)] disabled:opacity-50"
        >
          {loadingMore ? 'Loading…' : showingMore ? 'View less' : 'View more'}
        </button>
      )}
    </div>
  );
};