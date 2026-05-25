import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { casesApi, API_ENDPOINTS } from '@/services/api';

// caseId here = CaseReview.id (not patient id)
export const useClaim = (caseId?: number, recordId?: number | null) => {
  const queryClient = useQueryClient();

  // Single call — gets everything for the detail page
  const detailQ = useQuery({
    queryKey: [API_ENDPOINTS.caseDetailFull(caseId ?? 0), recordId],
    queryFn: () => casesApi.getDetailFull(caseId!, recordId ?? undefined),
    enabled: Boolean(caseId),
  });

  // Complete mutation
  const completeMutation = useMutation({
    mutationFn: ({ notes }: { notes: string }) =>
      casesApi.complete(caseId!, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.caseList] });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.caseDetailFull(caseId ?? 0)],
      });
    },
  });

  // Escalate mutation
  const escalateMutation = useMutation({
    mutationFn: ({ notes }: { notes: string }) =>
      casesApi.escalate(caseId!, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.caseList] });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.caseDetailFull(caseId ?? 0)],
      });
    },
  });

  // Orinn AI analysis trigger
  const orinnMutation = useMutation({
    mutationFn: (recordId?: number) => casesApi.triggerOrinn(caseId!, recordId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.caseDetailFull(caseId ?? 0)],
      });
    },
  });

  return {
    detail: detailQ.data ?? null,
    isLoading: detailQ.isLoading,
    completeCase: completeMutation.mutate,
    escalateCase: escalateMutation.mutate,
    triggerOrinn: orinnMutation.mutate,
    isActioning: completeMutation.isPending || escalateMutation.isPending,
    isAnalyzing: orinnMutation.isPending,
  };
};