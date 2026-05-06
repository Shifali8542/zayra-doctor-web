import { useState, useCallback } from 'react';
import type { AlynaMessage } from '@/types';

export const useAlyna = (_patientId?: number) => {
  const [messages, setMessages] = useState<AlynaMessage[]>([]);
  const [draft, setDraft] = useState('');

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
    },
    [draft],
  );

  return {
    messages,
    suggestions: [] as string[],
    draft,
    setDraft,
    send,
  };
};