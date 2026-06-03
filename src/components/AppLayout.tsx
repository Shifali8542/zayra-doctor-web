import type { ReactNode } from 'react';
import { Header } from './Header';
import { BottomTabs } from './BottomTabs';
import { Sidebar, useSidebarCollapsed } from './Sidebar';
import { TopBar } from './TopBar';
import { cn } from '@/utils/format';

interface AppLayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  showTabs?: boolean;
  className?: string;
  constrained?: boolean;
}

export const AppLayout = ({
  children,
  showHeader = true,
  showTabs = true,
  className,
  constrained = false,
}: AppLayoutProps) => {
  const { collapsed, toggle } = useSidebarCollapsed();

  return (
    <div className="flex min-h-screen w-full bg-mist">
      {/* Desktop sidebar */}
      <Sidebar collapsed={collapsed} onToggle={toggle} />

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Desktop top bar (search + bell + profile) — sticky on desktop */}
        <TopBar />

        {/* Mobile/tablet header*/}
        <main
          className={cn(
            'flex-1 pb-24 md:pb-8',
            className,
          )}
        >
          {/* Mobile-only header */}
          {showHeader ? (
            <div className="md:hidden">
              <Header />
            </div>
          ) : null}

          <div
            className={cn(
              'mx-auto w-full max-w-7xl px-4 py-6 md:px-8 md:py-10',
            )}
          >
            {children}
          </div>
        </main>
      </div>

      {/* Mobile/tablet bottom tabs only */}
      {showTabs ? (
        <div className="md:hidden">
          <BottomTabs />
        </div>
      ) : null}
    </div>
  );
};