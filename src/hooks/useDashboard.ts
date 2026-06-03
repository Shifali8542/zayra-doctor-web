import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { patientApi, profileApi, casesApi, impactApi, API_ENDPOINTS, getAccessToken } from '@/services/api';

export const useDashboard = () => {
  const hasToken = Boolean(getAccessToken());
  const queryClient = useQueryClient();

  const profileQuery = useQuery({
    queryKey: [API_ENDPOINTS.profile],
    queryFn: profileApi.getProfile,
    enabled: hasToken,
  });

  const patientsQuery = useQuery({
    queryKey: [API_ENDPOINTS.patientList],
    queryFn: () => patientApi.getList(),
    enabled: hasToken,
  });

  const impactQuery = useQuery({
    queryKey: [API_ENDPOINTS.impactStats],
    queryFn: impactApi.getStats,
    enabled: hasToken,
  });

  // All assigned patients for home page — always shows all 5 regardless of case status
  const liveCasesQuery = useQuery({
    queryKey: [API_ENDPOINTS.caseList, 'all_assigned', 'dashboard'],
    queryFn: () => casesApi.getList({ all_assigned: true }),
    enabled: hasToken,
  });

  // Claim mutation — same pattern as useCases
  const claimMutation = useMutation({
    mutationFn: (caseId: number) => casesApi.claim(caseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.caseList] });
    },
  });

  const claimCase = (caseId: number, options?: { onSuccess?: () => void }) => {
    claimMutation.mutate(caseId, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.caseList] });
        options?.onSuccess?.();
      },
    });
  };

  const impact = impactQuery.data;

  return {
    profile: profileQuery.data,
    patientCount: patientsQuery.data?.count ?? 0,
    liveCases: (liveCasesQuery.data?.results ?? []).slice(0, 6),
    liveCount: liveCasesQuery.data?.count ?? 0,
    isLoading: profileQuery.isLoading || liveCasesQuery.isLoading,
    claimCase,
    isClaiming: claimMutation.isPending,
    avgResponseSec: impact?.avg_response_sec ?? null,
    streakDays: impact?.streak_days ?? 0,
    confidenceScore: impact?.confidence_score ?? null,
    todayEarnings: impact?.reviewed_count ?? 0,
  };
};