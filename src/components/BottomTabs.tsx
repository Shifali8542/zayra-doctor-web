import { NavLink } from 'react-router-dom';
import { Icon, type IconName } from './Icon';
import { cn } from '@/utils/format';

interface TabDef {
  to: string;
  icon: IconName;
  label: string;
}

const TABS: TabDef[] = [
  { to: '/home', icon: 'pulse', label: 'PulseDesk' },
  { to: '/cases', icon: 'cases', label: 'Cases' },
  { to: '/trace', icon: 'trace', label: 'TraceView' },
  { to: '/alyna', icon: 'sparkle', label: 'Alyna' },
  { to: '/impact', icon: 'trophy', label: 'Impact' },
];

export const BottomTabs = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-[var(--color-divider)] bg-[var(--color-tab-bar-bg)] pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_16px_rgba(10,37,64,0.04)] lg:hidden">
      <div className="mx-auto flex max-w-3xl px-3 py-2">
        {TABS.map((t) => (
          <NavLink
            key={t.to}
            to={t.to}
            className="flex-1"
            children={({ isActive }) => (
              <div className="flex flex-col items-center py-2 transition hover:opacity-80">
                <div
                  className={cn(
                    'mb-1 flex h-7 w-11 items-center justify-center rounded-[14px] transition-colors',
                    isActive && 'bg-[var(--color-tab-active-bg)]',
                  )}
                >
                  <Icon
                    name={t.icon}
                    size={20}
                    color={isActive ? 'var(--color-tab-icon-active)' : 'var(--color-tab-icon-inactive)'}
                    strokeWidth={isActive ? 2.2 : 1.8}
                  />
                </div>
                <span
                  className={cn(
                    'text-[12px] font-semibold',
                    isActive
                      ? 'font-bold text-[var(--color-tab-icon-active)]'
                      : 'text-[var(--color-tab-icon-inactive)]',
                  )}
                >
                  {t.label}
                </span>
              </div>
            )}
          />
        ))}
      </div>
    </nav>
  );
};
