import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { casesApi, API_ENDPOINTS } from '@/services/api';
import type { CaseStatus } from '@/types';

// Tab maps exactly to backend status field
export type CasesTab = 'live' | 'claimed' | 'completed' | 'missed' | 'escalated';

export const useCases = () => {
  const [activeTab, setActiveTab] = useState<CasesTab>('live');
  const queryClient = useQueryClient();

  // Each tab fetches its own status from backend
  const casesQ = useQuery({
    queryKey: [API_ENDPOINTS.caseList, activeTab],
    queryFn: () => casesApi.getList({ status: activeTab as CaseStatus }),
  });

  // Counts per tab — fetched once for badge numbers
  const liveCntQ    = useQuery({ queryKey: [API_ENDPOINTS.caseList, 'live'],      queryFn: () => casesApi.getList({ status: 'live' }) });
  const claimedCntQ = useQuery({ queryKey: [API_ENDPOINTS.caseList, 'claimed'],   queryFn: () => casesApi.getList({ status: 'claimed' }) });
  const completedCntQ = useQuery({ queryKey: [API_ENDPOINTS.caseList, 'completed'], queryFn: () => casesApi.getList({ status: 'completed' }) });
  const missedCntQ  = useQuery({ queryKey: [API_ENDPOINTS.caseList, 'missed'],    queryFn: () => casesApi.getList({ status: 'missed' }) });
  const escalatedCntQ = useQuery({ queryKey: [API_ENDPOINTS.caseList, 'escalated'], queryFn: () => casesApi.getList({ status: 'escalated' }) });

  const tabCounts = {
    live:      liveCntQ.data?.count      ?? 0,
    claimed:   claimedCntQ.data?.count   ?? 0,
    completed: completedCntQ.data?.count ?? 0,
    missed:    missedCntQ.data?.count    ?? 0,
    escalated: escalatedCntQ.data?.count ?? 0,
  };

 // Claim mutation — invalidates all case tabs so counts update
  const claimMutation = useMutation({
    mutationFn: (caseId: number) => casesApi.claim(caseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.caseList] });
    },
  });

  // Wraps mutate so callers can pass onSuccess for navigation
  const claimCase = (
    caseId: number,
    options?: { onSuccess?: () => void },
  ) => {
    claimMutation.mutate(caseId, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.caseList] });
        options?.onSuccess?.();
      },
    });
  };

  return {
    activeTab,
    setActiveTab,
    cases: casesQ.data?.results ?? [],
    totalCount: casesQ.data?.count ?? 0,
    tabCounts,
    isLoading: casesQ.isLoading,
    claimCase,
    isClaiming: claimMutation.isPending,
  };
};