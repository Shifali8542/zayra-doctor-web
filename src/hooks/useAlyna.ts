import { useState, useCallback, useEffect, useRef } from 'react';
import type { AlynaMessage } from '@/types';
import { alynaApi } from '@/services/api';

interface UseAlynaOptions {
  patientId?: number;
  caseId?: number;
}

export const useAlyna = (opts: UseAlynaOptions = {}) => {
  const [messages,    setMessages]    = useState<AlynaMessage[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [draft,       setDraft]       = useState('');
  const [isLoading,   setIsLoading]   = useState(false);
  const [error,       setError]       = useState<string | null>(null);
  const hasFetchedHistory             = useRef(false);

  // ── Load history once on mount ────────────────────────────────────────────
  useEffect(() => {
    if (hasFetchedHistory.current) return;
    hasFetchedHistory.current = true;

    alynaApi
      .getHistory({ patient_id: opts.patientId, case_id: opts.caseId })
      .then((history) => {
        const mapped: AlynaMessage[] = history.map((m) => ({
          id:          String(m.id),
          role:        m.role,
          text:        m.text,
          suggestions: m.suggestions,
        }));
        setMessages(mapped);

        // Restore last assistant suggestions
        const lastAssistant = [...mapped].reverse().find((m) => m.role === 'assistant');
        if (lastAssistant?.suggestions?.length) {
          setSuggestions(lastAssistant.suggestions);
        }
      })
      .catch(() => {
        // History load failure is silent — fresh conversation starts
      });
  }, [opts.patientId, opts.caseId]);

  // ── Send message ──────────────────────────────────────────────────────────
  const send = useCallback(
    async (text?: string) => {
      const value = (text ?? draft).trim();
      if (!value || isLoading) return;

      // Optimistically add user message
      const userMsg: AlynaMessage = {
        id:   `u-${Date.now()}`,
        role: 'user',
        text: value,
      };
      setMessages((prev) => [...prev, userMsg]);
      setDraft('');
      setSuggestions([]);
      setIsLoading(true);
      setError(null);

      try {
        const response = await alynaApi.chat(value, {
          patient_id: opts.patientId,
          case_id:    opts.caseId,
        });

        const assistantMsg: AlynaMessage = {
          id:          `a-${response.message_id}`,
          role:        'assistant',
          text:        response.reply,
          suggestions: response.suggestions,
        };

        setMessages((prev) => [...prev, assistantMsg]);
        setSuggestions(response.suggestions ?? []);
      } catch (err) {
        setError('Alyna is unavailable. Please try again.');
        // Remove the optimistic user message on failure
        setMessages((prev) => prev.filter((m) => m.id !== userMsg.id));
      } finally {
        setIsLoading(false);
      }
    },
    [draft, isLoading, opts.patientId, opts.caseId],
  );

  // ── Clear conversation ────────────────────────────────────────────────────
  const clear = useCallback(async () => {
    await alynaApi.clear().catch(() => {});
    setMessages([]);
    setSuggestions([]);
    setError(null);
  }, []);

  return {
    messages,
    suggestions,
    draft,
    setDraft,
    send,
    clear,
    isLoading,
    error,
  };
};