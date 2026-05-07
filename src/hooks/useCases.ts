import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { casesApi, API_ENDPOINTS } from '@/services/api';
import type { CaseStatus, CaseReview } from '@/types';

// Tab maps exactly to backend status field
export type CasesTab = 'live' | 'claimed' | 'completed' | 'missed' | 'escalated';

export const useCases = () => {
  const [activeTab, setActiveTabState] = useState<CasesTab>('live');
  const [page, setPage] = useState(1);

  const setActiveTab = (tab: CasesTab) => {
    setActiveTabState(tab);
    setPage(1); // reset to page 1 when switching tabs
  };
  const queryClient = useQueryClient();

  const [allCases, setAllCases] = useState<CaseReview[]>([]);

  const casesQ = useQuery({
    queryKey: [API_ENDPOINTS.caseList, activeTab, page],
    queryFn: () => casesApi.getList({ status: activeTab as CaseStatus, page }),
  });

  // Accumulate pages — reset when tab changes
  useEffect(() => {
    if (casesQ.data?.results) {
      if (page === 1) {
        setAllCases(casesQ.data.results);
      } else {
        setAllCases((prev) => [...prev, ...casesQ.data!.results]);
      }
    }
  }, [casesQ.data, page]);

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
    cases: allCases,
    totalCount: casesQ.data?.count ?? 0,
    hasMore: Boolean(casesQ.data?.next),
    page,
    setPage,
    tabCounts,
    isLoading: casesQ.isLoading && page === 1,
    isLoadingMore: casesQ.isLoading && page > 1,
    claimCase,
    isClaiming: claimMutation.isPending,
  };
};