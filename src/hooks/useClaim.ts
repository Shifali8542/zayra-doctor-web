import { useQuery } from '@tanstack/react-query';
import { patientApi, API_ENDPOINTS } from '@/services/api';

export const useClaim = (patientId?: number) => {
  const detailQ = useQuery({
    queryKey: [API_ENDPOINTS.patientDetail(patientId ?? 0)],
    queryFn: () => patientApi.getDetail(patientId!),
    enabled: Boolean(patientId),
  });

  const clinicalQ = useQuery({
    queryKey: [API_ENDPOINTS.patientClinicalInfo(patientId ?? 0)],
    queryFn: () => patientApi.getClinicalInfo(patientId!),
    enabled: Boolean(patientId),
  });

  const recordsQ = useQuery({
    queryKey: [API_ENDPOINTS.patientRecords(patientId ?? 0)],
    queryFn: () => patientApi.getRecords(patientId!),
    enabled: Boolean(patientId),
  });

  return {
    patient: detailQ.data,
    clinicalInfo: clinicalQ.data,
    records: recordsQ.data?.records ?? [],
    isLoading: detailQ.isLoading,
  };
};