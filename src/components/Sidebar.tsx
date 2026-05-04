import { NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Icon, type IconName } from './Icon';
import { Avatar } from './Avatar';
import { mockDoctorProfile } from '@/mocks/mockData';
import { useDashboard } from '@/hooks/useDashboard';
import { cn, formatCurrency } from '@/utils/format';

interface NavItem {
  to: string;
  icon: IconName;
  label: string;
}

const WORKFLOW_ITEMS: NavItem[] = [
  { to: '/home', icon: 'pulse', label: 'PulseDesk' },
  { to: '/cases', icon: 'cases', label: 'Cases' },
  { to: '/trace', icon: 'trace', label: 'TraceView' },
  { to: '/alyna', icon: 'sparkle', label: 'Alyna' },
  { to: '/impact', icon: 'trophy', label: 'Impact' },
];

const MORE_ITEMS: NavItem[] = [
  { to: '/atlas', icon: 'book', label: 'ECG Atlas' },
  { to: '/grand-rounds', icon: 'stethoscope', label: 'Grand Rounds' },
  { to: '/earnings', icon: 'trending-up', label: 'Earnings' },
  { to: '/profile', icon: 'shield', label: 'Profile' },
];
const STORAGE_KEY = 'zayra_sidebar_collapsed';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export const Sidebar = ({ collapsed, onToggle }: SidebarProps) => {
  const { stats } = useDashboard();

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-30 hidden flex-col border-r border-[var(--color-divider)] bg-[var(--color-surface)] transition-[width] duration-300 lg:flex',
        collapsed ? 'w-[88px]' : 'w-[260px]',
      )}
    >
      {/* Brand + collapse toggle */}
      <div
        className={cn(
          'flex items-center border-b border-[var(--color-divider)] px-5 py-5',
          collapsed ? 'justify-center' : 'justify-between',
        )}
      >
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[var(--color-primary)]">
            <Icon name="pulse" size={18} color="#1FA59B" strokeWidth={2.4} />
          </div>
          {!collapsed && (
            <span className="text-[16px] font-bold tracking-[3px] text-[var(--color-text-primary)]">
              ZAYRA
            </span>
          )}
        </div>
        {!collapsed && (
          <button
            onClick={onToggle}
            className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--color-text-tertiary)] transition hover:bg-[var(--color-bg-alt)]"
            aria-label="Collapse sidebar"
          >
            <Icon name="chevron-left" size={16} color="currentColor" />
          </button>
        )}
      </div>

      {/* Available status pill */}
      <div className={cn('px-4 pt-4', collapsed && 'px-3')}>
        <div
          className={cn(
            'flex items-center rounded-pill border border-[var(--color-divider)] bg-[var(--color-surface)] px-3 py-2',
            collapsed ? 'justify-center' : 'justify-between',
          )}
        >
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[var(--color-success)]" />
            {!collapsed && (
              <span className="text-[14px] font-bold text-[var(--color-text-primary)]">
                Available
              </span>
            )}
          </div>
          {!collapsed && (
            <span className="rounded bg-[var(--color-bg-alt)] px-1.5 py-0.5 text-[10px] font-bold tracking-[1px] text-[var(--color-text-tertiary)]">
              TAP
            </span>
          )}
        </div>
      </div>

      {/* Nav scroll area */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {!collapsed && (
          <p className="mb-2 px-2 text-[11px] font-bold tracking-[1.4px] text-[var(--color-text-tertiary)]">
            WORKFLOW
          </p>
        )}
        <ul className="mb-6 flex flex-col gap-1">
          {WORKFLOW_ITEMS.map((item) => (
            <li key={item.to}>
              <NavItemLink item={item} collapsed={collapsed} />
            </li>
          ))}
        </ul>

        {!collapsed && (
          <p className="mb-2 px-2 text-[11px] font-bold tracking-[1.4px] text-[var(--color-text-tertiary)]">
            MORE
          </p>
        )}
        <ul className="flex flex-col gap-1">
          {MORE_ITEMS.map((item) => (
            <li key={`${item.to}-${item.label}`}>
              <NavItemLink item={item} collapsed={collapsed} />
            </li>
          ))}
        </ul>
      </nav>

      {/* Today earnings card */}
      {!collapsed && stats ? (
        <div className="m-3 rounded-2xl p-4 hero-gradient">
          <p className="eyebrow mb-2 text-white/80" style={{ letterSpacing: '1.4px' }}>
            TODAY
          </p>
          <p className="mb-1 text-[28px] font-bold leading-[32px] text-white">
            {formatCurrency(stats.todayEarningsUsd)}
          </p>
          <p className="text-[12px] leading-4 text-white/75">
            7 cases reviewed · {stats.avgResponseSec}s avg
          </p>
        </div>
      ) : null}

      {/* Expand button (when collapsed) */}
      {collapsed && (
        <button
          onClick={onToggle}
          className="m-3 flex h-10 items-center justify-center rounded-md border border-[var(--color-divider)] text-[var(--color-text-tertiary)] transition hover:bg-[var(--color-bg-alt)]"
          aria-label="Expand sidebar"
        >
          <Icon name="chevron-right" size={16} color="currentColor" />
        </button>
      )}
    </aside>
  );
};

const NavItemLink = ({
  item,
  collapsed,
}: {
  item: NavItem;
  collapsed: boolean;
}) => (
  <NavLink
    to={item.to}
    end={item.to === '/home'}
    children={({ isActive }) => (
      <div
        className={cn(
          'flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors',
          collapsed && 'justify-center',
          isActive
            ? 'bg-[var(--color-primary)] text-white'
            : 'text-[var(--color-text-primary)] hover:bg-[var(--color-bg-alt)]',
        )}
        title={collapsed ? item.label : undefined}
      >
        <Icon
          name={item.icon}
          size={18}
          color={isActive ? '#FFFFFF' : 'var(--color-text-primary)'}
          strokeWidth={isActive ? 2.2 : 1.8}
        />
        {!collapsed && (
          <span
            className={cn(
              'text-[14px] font-semibold',
              isActive ? 'text-white' : 'text-[var(--color-text-primary)]',
            )}
          >
            {item.label}
          </span>
        )}
      </div>
    )}
  />
);

export const useSidebarCollapsed = () => {
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem(STORAGE_KEY) === '1';
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, collapsed ? '1' : '0');
  }, [collapsed]);

  return {
    collapsed,
    toggle: () => setCollapsed((c) => !c),
  };
};