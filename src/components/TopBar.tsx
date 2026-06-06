import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from './Icon';
import { Avatar } from './Avatar';
import { useAuth } from '@/context/AuthContext';
import { casesApi } from '@/services/api';
import type { CaseReview } from '@/types';
import { cn } from '@/utils/format';

export const TopBar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CaseReview[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const initials = user
    ? `${user.first_name?.[0] ?? ''}${user.last_name?.[0] ?? ''}`.toUpperCase()
    : '?';

  const doctorLabel = user
    ? `Dr. ${user.last_name || user.first_name}`
    : 'Doctor';

  const handleSearch = (value: string) => {
    setQuery(value);
    if (!value.trim()) {
      setResults([]);
      setShowDropdown(false);
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const data = await casesApi.getList({ search: value, page_size: 10 });
        const datasetKeywords: Record<string, string> = {
          'ptb_diagnostic':  'ptb_diagnostic',
          'ptb-diagnostic':  'ptb_diagnostic',
          'ptbdiagnostic':   'ptb_diagnostic',
          'ptb_xl':          'ptb_xl',
          'ptb-xl':          'ptb_xl',
          'ptbxl':           'ptb_xl',
          'georgia_12lead':  'georgia_12lead',
          'georgia':         'georgia_12lead',
          'cpsc_2018':       'cpsc_2018',
          'cpsc':            'cpsc_2018',
        };

        const lowerVal = value.toLowerCase().trim();
        const matchedKey = Object.keys(datasetKeywords)
          .sort((a, b) => b.length - a.length)
          .find((key) => lowerVal === key || lowerVal.startsWith(key));

        const filtered = matchedKey
          ? (data.results ?? []).filter(
              (c) => c.dataset_source === datasetKeywords[matchedKey],
            )
          : data.results ?? [];

        setResults(filtered);
        setShowDropdown(true);
      } catch {
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 400);
  };

  const handleSelect = (c: CaseReview) => {
    setQuery('');
    setShowDropdown(false);
    setResults([]);
    navigate(`/case/${c.id}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setShowDropdown(false);
      setQuery('');
    }
    if (e.key === 'Enter' && results.length > 0) {
      handleSelect(results[0]);
    }
  };

  const severityColor: Record<string, string> = {
    critical: 'bg-[var(--color-danger)]',
    urgent: 'bg-[var(--color-warning)]',
    routine: 'bg-[var(--color-success)]',
    normal: 'bg-[var(--color-text-tertiary)]',
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-[var(--color-border)] bg-[var(--color-surface)]/80 px-4 backdrop-blur-md md:px-8">

      {/* Search box */}
      <div className="hidden flex-1 items-center gap-2 md:flex">
        <div className="relative w-full max-w-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-search pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          >
            <path d="m21 21-4.34-4.34"></path>
            <circle cx="11" cy="11" r="8"></circle>
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => results.length > 0 && setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
            placeholder="Search cases, patients, ECG patterns…"
            className="h-9 w-full rounded-full border border-border bg-card/60 pl-9 pr-4 text-sm outline-none ring-ring focus:ring-2"
          />

          {/* Dropdown results — compact + scrollable */}
          {showDropdown && (
            <div className="absolute left-0 right-0 top-[52px] z-50 max-h-[320px] overflow-y-auto rounded-2xl border border-[var(--color-divider)] bg-[var(--color-surface)] shadow-[0_8px_32px_rgba(10,37,64,0.12)]">
              {isSearching ? (
                <p className="px-4 py-3 text-[13px] text-[var(--color-text-tertiary)]">
                  Searching…
                </p>
              ) : results.length === 0 ? (
                <p className="px-4 py-3 text-[13px] text-[var(--color-text-tertiary)]">
                  No cases found for "{query}"
                </p>
              ) : (
                results.map((c) => (
                  <button
                    key={c.id}
                    onMouseDown={() => handleSelect(c)}
                    className="flex w-full items-center gap-3 border-b border-[var(--color-divider)] px-4 py-2 text-left transition last:border-0 hover:bg-[var(--color-bg-alt)]"
                  >
                    <span className={cn('h-2 w-2 shrink-0 rounded-full', severityColor[c.severity] ?? 'bg-gray-400')} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-semibold text-[var(--color-text-primary)]">
                        {c.display_diagnosis || c.diagnosis || '—'}
                      </p>
                      <p className="truncate text-[11px] text-[var(--color-text-tertiary)]">
                        {c.patient_code} · {c.sex ?? '—'} · {c.age ?? '—'}y · {c.dataset_source_display}
                      </p>
                    </div>
                    <span className="shrink-0 text-[10px] font-bold uppercase tracking-wide text-[var(--color-text-tertiary)]">
                      {c.status}
                    </span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </div> 

      {/* Controls Container */}
      <div className="flex items-center gap-2">
        {/* Bell */}
        <button
          aria-label="Notifications"
          className="relative grid h-9 w-9 place-items-center rounded-full border border-border bg-card transition-colors hover:bg-muted"
        >
          <Icon name="bell" size={24} color="currentColor" strokeWidth={2} />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 animate-pulse-dot rounded-full bg-[oklch(var(--severity-critical))]"></span>
        </button>

        {/* Profile */}
        <button
          onClick={() => navigate('/profile')}
          className="flex h-9 items-center gap-2 rounded-full border border-border bg-card pl-1 pr-3 transition-colors hover:bg-muted"
        >
          <span className="grid h-7 w-7 place-items-center rounded-full bg-aurora text-xs font-bold text-primary-foreground">
            {initials}
          </span>
          <span className="hidden text-xs font-semibold md:inline">
            {doctorLabel}
          </span>
        </button>
      </div>
    </header>
  );
};