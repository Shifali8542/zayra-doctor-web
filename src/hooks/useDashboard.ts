import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { patientApi, profileApi, casesApi, API_ENDPOINTS, getAccessToken } from '@/services/api';

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

  // Live cases for home page preview — max 6 cards
  const liveCasesQuery = useQuery({
    queryKey: [API_ENDPOINTS.caseList, 'live', 'dashboard'],
    queryFn: () => casesApi.getList({ status: 'live' }),
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

  return {
    profile: profileQuery.data,
    patientCount: patientsQuery.data?.count ?? 0,
    liveCases: (liveCasesQuery.data?.results ?? []).slice(0, 6),
    liveCount: liveCasesQuery.data?.count ?? 0,
    isLoading: profileQuery.isLoading || liveCasesQuery.isLoading,
    claimCase,
    isClaiming: claimMutation.isPending,
  };
};