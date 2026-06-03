import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { casesApi, assignmentsApi, API_ENDPOINTS } from '@/services/api';
import type { CaseStatus, CaseReview } from '@/types';

export type CasesTab = 'live' | 'claimed' | 'completed' | 'missed' | 'escalated';

export const useCases = () => {
  const [activeTab, setActiveTabState] = useState<CasesTab>('live');
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const setActiveTab = (tab: CasesTab) => {
    setActiveTabState(tab);
    setPage(1);
  };

  const setSearchTerm = (term: string) => {
    setSearch(term);
    setPage(1);
  };

  const queryClient = useQueryClient();
  const [allCases, setAllCases] = useState<CaseReview[]>([]);

  const casesQ = useQuery({
    queryKey: [API_ENDPOINTS.caseList, activeTab, page, search],
    queryFn: () => casesApi.getList({
      status: activeTab as CaseStatus,
      page,
      search: search || undefined,
    }),
  });

  useEffect(() => {
    if (casesQ.data?.results) {
      if (page === 1) {
        // Backend scopes results to assigned patients — dedup by case id only
        const uniqueCases = Array.from(
          new Map(casesQ.data.results.map((c) => [c.id, c])).values()
        );
        setAllCases(uniqueCases);
      } else {
        setAllCases((prev) => {
          const combined = [...prev, ...casesQ.data!.results];
          return Array.from(
            new Map(combined.map((c) => [c.id, c])).values()
          );
        });
      }
    }
  }, [casesQ.data, page]);

  const countsQ = useQuery({
    queryKey: [API_ENDPOINTS.caseCounts],
    queryFn: () => casesApi.getCounts(),
    staleTime: 30 * 1000,
  });

  const assignmentsQ = useQuery({
    queryKey: [API_ENDPOINTS.myAssignments],
    queryFn: () => assignmentsApi.getMyAssignments(),
    staleTime: 5 * 60 * 1000, // assignments rarely change — cache 5 min
  });

  const tabCounts = {
    live:      countsQ.data?.live      ?? 0,
    claimed:   countsQ.data?.claimed   ?? 0,
    completed: countsQ.data?.completed ?? 0,
    missed:    countsQ.data?.missed    ?? 0,
    escalated: countsQ.data?.escalated ?? 0,
  };

  const claimMutation = useMutation({
    mutationFn: (caseId: number) => casesApi.claim(caseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.caseList] });
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.caseCounts] });
    },
  });

  const claimCase = (
    caseId: number,
    options?: { onSuccess?: () => void },
  ) => {
    claimMutation.mutate(caseId, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.caseList] });
        queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.caseCounts] });
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
    search,
    setSearch: setSearchTerm,
    assignedCount: assignmentsQ.data?.count ?? 0,
  };
};