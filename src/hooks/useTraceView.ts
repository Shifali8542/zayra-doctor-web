import { useCallback, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { patientApi, API_ENDPOINTS } from '@/services/api';

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 4;

export const useTraceView = (patientId?: number) => {
  const [zoom, setZoom] = useState(1);
  const [annotation, setAnnotation] = useState('');

  const waveformQ = useQuery({
    queryKey: [API_ENDPOINTS.patientWaveform(patientId ?? 0)],
    queryFn: () => patientApi.getWaveform(patientId!),
    enabled: Boolean(patientId),
  });

  const analysisQ = useQuery({
    queryKey: [API_ENDPOINTS.patientWaveformAnalysis(patientId ?? 0)],
    queryFn: () => patientApi.getWaveformAnalysis(patientId!),
    enabled: Boolean(patientId),
  });

  const zoomIn = useCallback(() => {
    setZoom((z) => Math.min(MAX_ZOOM, +(z + 0.25).toFixed(2)));
  }, []);
  const zoomOut = useCallback(() => {
    setZoom((z) => Math.max(MIN_ZOOM, +(z - 0.25).toFixed(2)));
  }, []);
  const resetZoom = useCallback(() => setZoom(1), []);

  const saveAnnotation = useCallback(async () => {
    setAnnotation('');
  }, []);

  return {
    waveform: waveformQ.data as Record<string, unknown> | undefined,
    analysis: analysisQ.data as Record<string, unknown> | undefined,
    zoom,
    zoomIn,
    zoomOut,
    resetZoom,
    annotation,
    setAnnotation,
    saveAnnotation,
  };
};