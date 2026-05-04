import { useQuery } from '@tanstack/react-query';
import {
  casesApi,
  patientApi,
  API_ENDPOINTS,
} from '@/services/api';
import { mockLiveCases } from '@/mocks/mockData';

export const useClaim = (caseId?: string) => {
  // Fall back to a known case id when nothing is passed in.
  const resolvedId = caseId ?? mockLiveCases[1].id;

  const caseQ = useQuery({
    queryKey: [API_ENDPOINTS.caseById(resolvedId)],
    queryFn: () => casesApi.getById(resolvedId),
    enabled: Boolean(resolvedId),
  });

  const patientId = caseQ.data?.patientId ?? '';

  const timelineQ = useQuery({
    queryKey: [API_ENDPOINTS.timeline(patientId)],
    queryFn: () => patientApi.getTimeline(patientId),
    enabled: Boolean(patientId),
  });
  const contextQ = useQuery({
    queryKey: [API_ENDPOINTS.patientContext(patientId)],
    queryFn: () => patientApi.getContext(patientId),
    enabled: Boolean(patientId),
  });
  const physQ = useQuery({
    queryKey: [API_ENDPOINTS.physiology(patientId)],
    queryFn: () => patientApi.getPhysiology(patientId),
    enabled: Boolean(patientId),
  });

  return {
    caseItem: caseQ.data,
    timeline: timelineQ.data ?? [],
    patientContext: contextQ.data,
    physiology: physQ.data,
    isLoading: caseQ.isLoading,
  };
};
