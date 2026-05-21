import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { patientApi, casesApi, API_ENDPOINTS } from '@/services/api';
import type {
  PatientWaveformResponse,
  WaveformAnalysisResponse,
  RecordsIndexRecord,
  TraceViewCase,
} from '@/types';

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 4;

// Module-level in-memory waveform cache keyed by record_id
const waveformCache = new Map<number, PatientWaveformResponse>();

export type TraceViewMode = 'strip' | '12lead';

/**
 * useTraceView
 *
 * Two modes:
 *   1. caseId present (from /trace/:caseId) → resolve patient → load waveform
 *   2. caseId absent (sidebar click to /trace) → show case picker
 *
 * Analysis query passes record_id so HR/HRV reflects the active record.
 */
export const useTraceView = (caseId?: number) => {
  const [zoom, setZoom] = useState(1);
  const [annotation, setAnnotation] = useState('');
  const [selectedRecordId, setSelectedRecordId] = useState<number | undefined>();
  const [waveformData, setWaveformData] = useState<PatientWaveformResponse | null>(null);
  const [waveformLoading, setWaveformLoading] = useState(false);
  const [selectedLead, setSelectedLead] = useState<string>('II');
  const [viewMode, setViewMode] = useState<TraceViewMode>('strip');

  // ── Case picker state (only when no caseId — sidebar entry) ───────────────
  const [myPage, setMyPage] = useState(1);
  const [myAllCases, setMyAllCases] = useState<TraceViewCase[]>([]);
  const [livePage, setLivePageNum] = useState(1);
  const [liveAllCases, setLiveAllCases] = useState<TraceViewCase[]>([]);

  const PAGE_SIZE = 10;

  const myCasesQ = useQuery({
    queryKey: [API_ENDPOINTS.caseList, 'claimed', 'mine', 'traceview', myPage],
    queryFn: () => casesApi.getList({ status: 'claimed', mine: true, page_size: PAGE_SIZE, page: myPage }),
    enabled: !caseId,
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  });

  const liveCasesQ = useQuery({
    queryKey: [API_ENDPOINTS.caseList, 'live', 'traceview', livePage],
    queryFn: () => casesApi.getList({ status: 'live', page_size: PAGE_SIZE, page: livePage }),
    enabled: !caseId,
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  });

  // Append new pages into accumulated lists
  useEffect(() => {
    if (!myCasesQ.data?.results) return;
    const incoming = myCasesQ.data.results as TraceViewCase[];
    if (myPage === 1) {
      setMyAllCases(incoming);
    } else {
      setMyAllCases((prev) => {
        const existingIds = new Set(prev.map((c) => c.id));
        const fresh = incoming.filter((c) => !existingIds.has(c.id));
        return [...prev, ...fresh];
      });
    }
  }, [myCasesQ.data, myPage]);

  useEffect(() => {
    if (!liveCasesQ.data?.results) return;
    const incoming = liveCasesQ.data.results as TraceViewCase[];
    if (livePage === 1) {
      setLiveAllCases(incoming);
    } else {
      setLiveAllCases((prev) => {
        const existingIds = new Set(prev.map((c) => c.id));
        const fresh = incoming.filter((c) => !existingIds.has(c.id));
        return [...prev, ...fresh];
      });
    }
  }, [liveCasesQ.data, livePage]);

  // Reset to page 1 when returning to picker (caseId goes away)
  useEffect(() => {
    if (!caseId) {
      setMyPage(1);
      setLivePageNum(1);
    }
  }, [caseId]);

  const myCount = myCasesQ.data?.count ?? 0;
  const liveCount = liveCasesQ.data?.count ?? 0;
  const hasMoreMyCases = myAllCases.length < myCount;
  const hasMoreLiveCases = liveAllCases.length < liveCount;
  const showingMoreMyCases = myPage > 1;
  const showingMoreLiveCases = livePage > 1;
  const loadMoreMyCases = useCallback(() => setMyPage((p) => p + 1), []);
  const loadMoreLiveCases = useCallback(() => setLivePageNum((p) => p + 1), []);
  const loadLessMyCases = useCallback(() => {
    setMyPage(1);
    setMyAllCases([]);
  }, []);
  const loadLessLiveCases = useCallback(() => {
    setLivePageNum(1);
    setLiveAllCases([]);
  }, []);
  const pickerLoading = (myCasesQ.isLoading && myPage === 1) || (liveCasesQ.isLoading && livePage === 1);
  const myLoadingMore = myCasesQ.isLoading && myPage > 1;
  const liveLoadingMore = liveCasesQ.isLoading && livePage > 1;

  // ── Step 1: Resolve patient from case detail ───────────────────────────────
  const caseDetailQ = useQuery({
    queryKey: [API_ENDPOINTS.caseDetailFull(caseId ?? 0)],
    queryFn: () => casesApi.getDetailFull(caseId!),
    enabled: Boolean(caseId),
    staleTime: 5 * 60 * 1000,
  });

  const caseDetail = caseDetailQ.data ?? null;
  const patientId = caseDetail?.patient?.id;

  // ── Step 2: Lightweight records index (DB only, no S3) ────────────────────
  const recordsIndexQ = useQuery({
    queryKey: [API_ENDPOINTS.patientRecordsIndex(patientId ?? 0)],
    queryFn: () => patientApi.getRecordsIndex(patientId!),
    enabled: Boolean(patientId),
    staleTime: 5 * 60 * 1000,
  });

  const records: RecordsIndexRecord[] = recordsIndexQ.data?.records ?? [];
  const totalRecords = recordsIndexQ.data?.total_records ?? 0;

  // Active record: user selection OR first from index
  const activeRecordId = useMemo(() => {
    if (selectedRecordId) return selectedRecordId;
    return records[0]?.id ?? undefined;
  }, [selectedRecordId, records]);

  // ── Step 3: Waveform — all channels, downsample=8, filtered on backend ─────
  const activeRecordIdRef = useRef(activeRecordId);
  activeRecordIdRef.current = activeRecordId;

  useEffect(() => {
    if (!patientId || !activeRecordId) return;

    const cached = waveformCache.get(activeRecordId);
    if (cached) {
      setWaveformData(cached);
      setWaveformLoading(false);
      return;
    }

    setWaveformLoading(true);
    patientApi
      .getWaveform(patientId, { record_id: activeRecordId, downsample: 8 })
      .then((res) => {
        if (activeRecordIdRef.current === activeRecordId) {
          waveformCache.set(activeRecordId, res);
          setWaveformData(res);
          setWaveformLoading(false);
        }
      })
      .catch(() => {
        if (activeRecordIdRef.current === activeRecordId) {
          setWaveformLoading(false);
        }
      });
  }, [patientId, activeRecordId]);

  // ── Step 4: Waveform analysis — scoped to active record ───────────────────
  const analysisQ = useQuery<WaveformAnalysisResponse>({
    queryKey: [API_ENDPOINTS.patientWaveformAnalysis(patientId ?? 0), activeRecordId],
    queryFn: () =>
      patientApi.getWaveformAnalysis(patientId!, activeRecordId),
    enabled: Boolean(patientId) && Boolean(activeRecordId),
    staleTime: 5 * 60 * 1000,
  });

  // ── Lead data ─────────────────────────────────────────────────────────────
  const availableLeads = useMemo(() => {
    if (!waveformData?.all_channel_names?.length) return ['II'];
    return waveformData.all_channel_names;
  }, [waveformData]);

  // Reset lead to II when record changes (II is the cardiac standard)
  useEffect(() => {
    setSelectedLead('II');
  }, [activeRecordId]);

  // Extract selected lead — fallback: selected → II → ii → first available
  const primarySamples = useMemo(() => {
    if (!waveformData?.waveforms) return null;
    const w = waveformData.waveforms;
    return (
      w[selectedLead] ??
      w[selectedLead.toLowerCase()] ??
      w['II'] ??
      w['ii'] ??
      Object.values(w)[0] ??
      null
    );
  }, [waveformData, selectedLead]);

  // All lead samples for 12-lead grid view
  const allLeadSamples = useMemo(() => {
    if (!waveformData?.waveforms) return {};
    return waveformData.waveforms;
  }, [waveformData]);

  // ── UI actions ────────────────────────────────────────────────────────────
  const zoomIn = useCallback(
    () => setZoom((z) => Math.min(MAX_ZOOM, +(z + 0.25).toFixed(2))),
    [],
  );
  const zoomOut = useCallback(
    () => setZoom((z) => Math.max(MIN_ZOOM, +(z - 0.25).toFixed(2))),
    [],
  );
  const resetZoom = useCallback(() => setZoom(1), []);

  const selectRecord = useCallback((id: number) => {
    setSelectedRecordId(id);
    setWaveformData(null);
    setZoom(1);
  }, []);

  // Annotation save is a no-op placeholder until backend endpoint exists
  const saveAnnotation = useCallback(() => {
    setAnnotation('');
  }, []);

  const effectiveSamplingRate = waveformData?.effective_sampling_rate ?? 125;
  const segments = waveformData?.segments ?? {};
  const isLoading = caseDetailQ.isLoading || recordsIndexQ.isLoading;

  return {
    // Picker 
    myCases: myAllCases,
    myCount,
    liveCases: liveAllCases,
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
    //Case/patient 
    caseDetail,
    patientId,
    // Waveform 
    primarySamples,
    allLeadSamples,
    effectiveSamplingRate,
    segments,
    waveformData,
    waveformLoading,
    // ── Lead selector ───────────────────────────────────────────────────────
    selectedLead,
    setSelectedLead,
    availableLeads,
    // ── Record tabs ─────────────────────────────────────────────────────────
    records,
    totalRecords,
    activeRecordId,
    activeRecordIndex: waveformData?.record_index ?? 0,
    selectRecord,
    // ── Analysis (HR/HRV/rhythm/wave intervals) ─────────────────────────────
    analysis: analysisQ.data ?? null,
    analysisLoading: analysisQ.isLoading,
    // ── Metadata ────────────────────────────────────────────────────────────
    recordName: waveformData?.record_name ?? caseDetail?.records?.[0]?.record_name,
    samplingRate: waveformData?.sampling_rate ?? 500,
    // ── View mode ───────────────────────────────────────────────────────────
    viewMode,
    setViewMode,
    // ── Zoom ────────────────────────────────────────────────────────────────
    zoom,
    zoomIn,
    zoomOut,
    resetZoom,
    // ── Annotation ──────────────────────────────────────────────────────────
    annotation,
    setAnnotation,
    saveAnnotation,
    // ── Loading states ──────────────────────────────────────────────────────
    isLoading,
  };
};