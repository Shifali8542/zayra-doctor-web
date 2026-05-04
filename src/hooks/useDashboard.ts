import { useQuery } from '@tanstack/react-query';
import {
  casesApi,
  dashboardApi,
  profileApi,
  API_ENDPOINTS,
} from '@/services/api';

export const useDashboard = () => {
  const statsQuery = useQuery({
    queryKey: [API_ENDPOINTS.doctorStats],
    queryFn: dashboardApi.getStats,
  });

  const profileQuery = useQuery({
    queryKey: [API_ENDPOINTS.profile],
    queryFn: profileApi.getProfile,
  });

  const casesQuery = useQuery({
    queryKey: [API_ENDPOINTS.liveCases],
    queryFn: casesApi.getLive,
  });

  return {
    stats: statsQuery.data,
    profile: profileQuery.data,
    liveCases: casesQuery.data ?? [],
    pendingCount: casesQuery.data?.length ?? 0,
    isLoading:
      statsQuery.isLoading || profileQuery.isLoading || casesQuery.isLoading,
  };
};
