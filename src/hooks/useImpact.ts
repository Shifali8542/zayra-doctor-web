import { useQuery } from '@tanstack/react-query';
import { impactApi, API_ENDPOINTS } from '@/services/api';

export const useImpact = () => {
  const statsQ = useQuery({
    queryKey: [API_ENDPOINTS.impact],
    queryFn: impactApi.getStats,
  });
  const momentsQ = useQuery({
    queryKey: [API_ENDPOINTS.lifesavingMoments],
    queryFn: impactApi.getLifesavingMoments,
  });

  return {
    stats: statsQ.data,
    moments: momentsQ.data ?? [],
    isLoading: statsQ.isLoading || momentsQ.isLoading,
  };
};
