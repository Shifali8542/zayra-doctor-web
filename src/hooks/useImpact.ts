import { useQuery } from '@tanstack/react-query';
import { impactApi, API_ENDPOINTS } from '@/services/api';

export const useImpact = () => {
  const statsQ = useQuery({
    queryKey: [API_ENDPOINTS.impactStats],
    queryFn: impactApi.getStats,
  });

  const momentsQ = useQuery({
    queryKey: [API_ENDPOINTS.impactMoments],
    queryFn: impactApi.getMoments,
  });

  return {
    stats: statsQ.data ?? null,
    moments: momentsQ.data?.moments ?? [],
    isLoading: statsQ.isLoading || momentsQ.isLoading,
  };
};