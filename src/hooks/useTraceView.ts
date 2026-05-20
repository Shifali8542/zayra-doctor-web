import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { patientApi, casesApi, API_ENDPOINTS } from '@/services/api';
import type {
  PatientWaveformResponse,
  WaveformAnalysisResponse,
  RecordsIndexRecord,
} from '@/types';

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 4;

// Module-level in-memory waveform cache keyed by record_id (same as app)
const waveformCache = new Map<number, PatientWaveformResponse>();

/**
 * useTraceView — mirrors the doctor app implementation exactly.
 * Accepts caseId from the URL. Resolves patient ID from case detail,
 * then fetches records index + waveform with downsample + channels params.
 */
export const useTraceView = (caseId?: number) => {
  const [zoom, setZoom] = useState(1);
  const [annotation, setAnnotation] = useState('');
  const [selectedRecordId, setSelectedRecordId] = useState<number | undefined>();
  const [waveformData, setWaveformData] = useState<PatientWaveformResponse | null>(null);
  const [waveformLoading, setWaveformLoading] = useState(false);

  // Step 1: Resolve patient ID from case detail
  const caseDetailQ = useQuery({
    queryKey: [API_ENDPOINTS.caseDetailFull(caseId ?? 0)],
    queryFn: () => casesApi.getDetailFull(caseId!),
    enabled: Boolean(caseId),
    staleTime: 5 * 60 * 1000,
  });

  const patientId = caseDetailQ.data?.patient?.id;

  // Step 2: Fetch lightweight records index (DB only, instant, no S3)
  const recordsIndexQ = useQuery({
    queryKey: [API_ENDPOINTS.patientRecordsIndex(patientId ?? 0)],
    queryFn: () => patientApi.getRecordsIndex(patientId!),
    enabled: Boolean(patientId),
    staleTime: 5 * 60 * 1000,
  });

  const records: RecordsIndexRecord[] = recordsIndexQ.data?.records ?? [];
  const totalRecords = recordsIndexQ.data?.total_records ?? 0;

  // Active record: selected by user OR first from index
  const activeRecordId = useMemo(() => {
    if (selectedRecordId) return selectedRecordId;
    return records[0]?.id ?? undefined;
  }, [selectedRecordId, records]);

  // Step 3: Fetch waveform with cache — matches app exactly
  // Uses channels='II' and downsample=8 to keep payload small
  const activeRecordIdRef = useRef(activeRecordId);
  activeRecordIdRef.current = activeRecordId;

  useEffect(() => {
    if (!patientId || !activeRecordId) return;

    // Serve from cache if already fetched this session
    const cached = waveformCache.get(activeRecordId);
    if (cached) {
      setWaveformData(cached);
      setWaveformLoading(false);
      return;
    }

    setWaveformLoading(true);
    patientApi
      .getWaveform(patientId, {
        record_id: activeRecordId,
        downsample: 8,
        channels: 'II',
      })
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

  // Step 4: Waveform analysis (HR, HRV, rhythm etc.)
  const analysisQ = useQuery<WaveformAnalysisResponse>({
    queryKey: [API_ENDPOINTS.patientWaveformAnalysis(patientId ?? 0)],
    queryFn: () => patientApi.getWaveformAnalysis(patientId!),
    enabled: Boolean(patientId),
    staleTime: 5 * 60 * 1000,
  });

  const zoomIn  = useCallback(() => setZoom((z) => Math.min(MAX_ZOOM, +(z + 0.25).toFixed(2))), []);
  const zoomOut = useCallback(() => setZoom((z) => Math.max(MIN_ZOOM, +(z - 0.25).toFixed(2))), []);
  const resetZoom = useCallback(() => setZoom(1), []);
  const saveAnnotation = useCallback(() => setAnnotation(''), []);
  const selectRecord = useCallback((id: number) => {
    setSelectedRecordId(id);
    setWaveformData(null);
  }, []);

  // Extract primary lead signal (prefer 'II', fall back to first channel)
  const primarySamples = useMemo(() => {
    if (!waveformData?.waveforms) return null;
    const w = waveformData.waveforms;
    return w['II'] ?? w['ii'] ?? Object.values(w)[0] ?? null;
  }, [waveformData]);

  const effectiveSamplingRate = waveformData?.effective_sampling_rate ?? 125;
  const segments = waveformData?.segments ?? {};

  const isLoading = caseDetailQ.isLoading || recordsIndexQ.isLoading;
  const isError   = caseDetailQ.isError || recordsIndexQ.isError;

  return {
    // Waveform signal data
    primarySamples,
    effectiveSamplingRate,
    segments,                        // { before?, anomaly?, after? }
    waveformData,
    waveformLoading,
    // Records tabs
    records,
    totalRecords,
    activeRecordId,
    activeRecordIndex: waveformData?.record_index ?? 0,
    selectRecord,
    // Analysis
    analysis: analysisQ.data ?? null,
    // Metadata
    patientId,
    recordName: waveformData?.record_name ?? caseDetailQ.data?.records?.[0]?.record_name,
    samplingRate: waveformData?.sampling_rate ?? 500,
    // UI state
    isLoading,
    isError,
    zoom,
    zoomIn,
    zoomOut,
    resetZoom,
    annotation,
    setAnnotation,
    saveAnnotation,
  };
};