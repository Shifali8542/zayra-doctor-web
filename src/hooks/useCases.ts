import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { casesApi, API_ENDPOINTS } from '@/services/api';
import type { Case } from '@/types';

export type CasesTab = 'live' | 'claimed' | 'completed';

export const useCases = () => {
  const [activeTab, setActiveTab] = useState<CasesTab>('live');

  const liveQ = useQuery({
    queryKey: [API_ENDPOINTS.liveCases],
    queryFn: casesApi.getLive,
  });
  const claimedQ = useQuery({
    queryKey: [API_ENDPOINTS.claimedCases],
    queryFn: casesApi.getClaimed,
  });
  const completedQ = useQuery({
    queryKey: [API_ENDPOINTS.completedCases],
    queryFn: casesApi.getCompleted,
  });

  const data: Case[] = useMemo(() => {
    switch (activeTab) {
      case 'live':
        return liveQ.data ?? [];
      case 'claimed':
        return claimedQ.data ?? [];
      case 'completed':
        return completedQ.data ?? [];
    }
  }, [activeTab, liveQ.data, claimedQ.data, completedQ.data]);

  const counts = useMemo(
    () => ({
      live: liveQ.data?.length ?? 0,
      claimed: claimedQ.data?.length ?? 0,
      completed: completedQ.data?.length ?? 0,
    }),
    [liveQ.data, claimedQ.data, completedQ.data],
  );

  return {
    activeTab,
    setActiveTab,
    data,
    counts,
    isLoading: liveQ.isLoading || claimedQ.isLoading || completedQ.isLoading,
  };
};
