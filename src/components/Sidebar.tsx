import { NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Icon, type IconName } from './Icon';
import { Avatar } from './Avatar';
import { ZayraLogo } from './ZayraLogo';
import { useDashboard } from '@/hooks/useDashboard';
import { cn } from '@/utils/format';

interface NavItem {
  to: string;
  icon: IconName;
  label: string;
}

const WORKFLOW_ITEMS: NavItem[] = [
  { to: '/home', icon: 'activity', label: 'PulseDesk' },
  { to: '/cases', icon: 'layers', label: 'Cases' },
  { to: '/trace', icon: 'line-chart', label: 'TraceView' },
  { to: '/alyna', icon: 'sparkles', label: 'Alyna' },
  { to: '/impact', icon: 'trophy', label: 'Impact' },
];

const MORE_ITEMS: NavItem[] = [
  { to: '/atlas', icon: 'graduation-cap', label: 'ECG Atlas' },
  { to: '/grand-rounds', icon: 'users', label: 'Grand Rounds' },
  { to: '/earnings', icon: 'wallet', label: 'Earnings' },
  { to: '/profile', icon: 'user', label: 'Profile' },
];
const STORAGE_KEY = 'zayra_sidebar_collapsed';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export const Sidebar = ({ collapsed, onToggle }: SidebarProps) => {
  const { profile, todayEarnings, avgResponseSec } = useDashboard();

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-30 hidden flex-col border-r border-sidebar-border bg-sidebar/80 backdrop-blur transition-[width] duration-300 md:flex',
        collapsed ? 'w-[88px]' : 'w-[260px]',
      )}
    >
      {/* Brand + collapse/expand toggle */}
      <div
        className={cn(
          'flex items-center px-6 pb-4 pt-6',
          collapsed ? 'justify-center' : 'justify-start',
        )}
      >
        {/* Logo */}
        <button
          onClick={collapsed ? onToggle : undefined}
          className={cn(
            'flex items-center gap-2.5',
            collapsed && 'cursor-pointer hover:opacity-70 transition',
          )}
          aria-label={collapsed ? 'Expand sidebar' : undefined}
        >
          <ZayraLogo showWordmark={!collapsed} />
        </button>
      </div>

     {/* Available status pill */}
      <div className="px-4">
        <button
          className={cn(
            'group flex w-full items-center rounded-xl border px-3 py-2.5 text-left transition-all',
            'border-[oklch(var(--teal)/0.3)] bg-[oklch(var(--teal)/0.08)]',
            collapsed ? 'justify-center' : 'justify-between',
          )}
        >
          <span className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[oklch(var(--teal))] opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[oklch(var(--teal))]"></span>
            </span>
            {!collapsed && (
              <span className="text-sm font-semibold text-foreground">
                Available
              </span>
            )}
          </span>
          {!collapsed && (
            <span className="text-[0.65rem] uppercase tracking-wider text-muted-foreground">
              Tap
            </span>
          )}
        </button>
      </div>

     {/* Nav scroll area */}
      <nav className="mt-5 flex-1 overflow-y-auto px-3">
        {!collapsed && (
          <p className="px-3 pb-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            WORKFLOW
          </p>
        )}
        <ul className="space-y-0.5">
          {WORKFLOW_ITEMS.map((item) => (
            <li key={item.to}>
              <NavItemLink item={item} collapsed={collapsed} />
            </li>
          ))}
        </ul>

        <div className="my-4 h-px bg-border/60"></div>

        {!collapsed && (
          <p className="px-3 pb-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            MORE
          </p>
        )}
        <ul className="space-y-0.5">
          {MORE_ITEMS.map((item) => (
            <li key={`${item.to}-${item.label}`}>
              <NavItemLink item={item} collapsed={collapsed} />
            </li>
          ))}
        </ul>
      </nav>

     {/* Bottom stats card / Footer */}
      {!collapsed ? (
        <div className="border-t border-sidebar-border px-4 py-4">
          <div className="rounded-xl p-4 bg-aurora shadow-sm">
            <p className="mb-1 text-[11px] font-bold uppercase tracking-[1.2px] text-white/80">
              TODAY
            </p>
            <p className="mb-1 text-3xl font-bold text-white">
              ${todayEarnings || 0}
            </p>
            <p className="text-[12px] leading-snug text-white/80">
              7 cases reviewed · {avgResponseSec ? Math.round(avgResponseSec) : '--'}s avg
            </p>
          </div>
        </div>
      ) : (
        <button
          onClick={onToggle}
          className="m-4 flex h-10 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-tertiary)] transition hover:bg-[var(--color-bg-alt)]"
          aria-label="Expand sidebar"
          title="Expand sidebar"
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
    className={({ isActive }) =>
      cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all',
        collapsed && 'justify-center',
        isActive
          ? 'bg-primary text-primary-foreground shadow-elevated'
          : 'text-sidebar-foreground hover:bg-sidebar-accent',
      )
    }
    title={collapsed ? item.label : undefined}
  >
    <Icon
      name={item.icon}
      size={16}
      color="currentColor"
      strokeWidth={2}
    />
    {!collapsed && (
      <span className="font-medium">
        {item.label}
      </span>
    )}
  </NavLink>
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