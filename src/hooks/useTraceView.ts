import { useCallback, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { casesApi, traceApi, API_ENDPOINTS } from '@/services/api';
import { mockLiveCases } from '@/mocks/mockData';

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 4;

export const useTraceView = (caseId?: string) => {
  const resolvedId = caseId ?? mockLiveCases[0].id;
  const [zoom, setZoom] = useState(1);
  const [annotation, setAnnotation] = useState('');

  const caseQ = useQuery({
    queryKey: [API_ENDPOINTS.caseById(resolvedId)],
    queryFn: () => casesApi.getById(resolvedId),
  });

  const rhythmQ = useQuery({
    queryKey: [API_ENDPOINTS.anomalyDetails(resolvedId)],
    queryFn: () => traceApi.getAnomalyDetails(resolvedId),
  });

  const zoomIn = useCallback(() => {
    setZoom((z) => Math.min(MAX_ZOOM, +(z + 0.25).toFixed(2)));
  }, []);
  const zoomOut = useCallback(() => {
    setZoom((z) => Math.max(MIN_ZOOM, +(z - 0.25).toFixed(2)));
  }, []);
  const resetZoom = useCallback(() => setZoom(1), []);

  const saveAnnotation = useCallback(async () => {
    if (!annotation.trim()) return;
    await traceApi.saveAnnotation(resolvedId, annotation);
    setAnnotation('');
  }, [annotation, resolvedId]);

  return {
    caseItem: caseQ.data,
    rhythm: rhythmQ.data,
    zoom,
    zoomIn,
    zoomOut,
    resetZoom,
    annotation,
    setAnnotation,
    saveAnnotation,
  };
};
