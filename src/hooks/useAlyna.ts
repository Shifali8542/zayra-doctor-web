import { useEffect, useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { alynaApi, API_ENDPOINTS } from '@/services/api';
import type { AlynaMessage } from '@/types';

export const useAlyna = (caseId = 'ZC-48217') => {
  const [messages, setMessages] = useState<AlynaMessage[]>([]);
  const [draft, setDraft] = useState('');

  const convoQ = useQuery({
    queryKey: [API_ENDPOINTS.alynaConversation(caseId)],
    queryFn: () => alynaApi.getConversation(caseId),
  });
  const suggestionsQ = useQuery({
    queryKey: [API_ENDPOINTS.alynaSuggestions],
    queryFn: alynaApi.getSuggestions,
  });

  useEffect(() => {
    if (convoQ.data) setMessages(convoQ.data);
  }, [convoQ.data]);

  const send = useCallback(
    async (text?: string) => {
      const value = (text ?? draft).trim();
      if (!value) return;
      const userMsg: AlynaMessage = {
        id: `u-${Date.now()}`,
        role: 'user',
        text: value,
      };
      setMessages((prev) => [...prev, userMsg]);
      setDraft('');
      const response = await alynaApi.sendMessage(caseId, value);
      setMessages((prev) => [...prev, response]);
    },
    [draft, caseId],
  );

  return {
    messages,
    suggestions: suggestionsQ.data ?? [],
    draft,
    setDraft,
    send,
  };
};
