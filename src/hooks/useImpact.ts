import { useQuery } from '@tanstack/react-query';
import { patientApi, profileApi, API_ENDPOINTS } from '@/services/api';

export const useImpact = () => {
  const profileQ = useQuery({
    queryKey: [API_ENDPOINTS.profile],
    queryFn: profileApi.getProfile,
  });

  const summaryQ = useQuery({
    queryKey: [API_ENDPOINTS.diagnosisSummary],
    queryFn: patientApi.getDiagnosisSummary,
  });

  return {
    profile: profileQ.data,
    summary: summaryQ.data,
    isLoading: profileQ.isLoading || summaryQ.isLoading,
  };
};