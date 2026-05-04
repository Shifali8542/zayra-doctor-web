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
  /**
   * If true, content is constrained to a readable max width.
   * Defaults to false — content fills the available width on desktop.
   */
  constrained?: boolean;
}

/**
 * AppLayout — main shell for authenticated screens.
 *
 * Desktop (≥lg): collapsible sidebar on the left + sticky TopBar.
 *                Content fills the full remaining width.
 * Mobile/Tablet: compact top Header + BottomTabs nav at the bottom.
 */
export const AppLayout = ({
  children,
  showHeader = true,
  showTabs = true,
  className,
  constrained = false,
}: AppLayoutProps) => {
  const { collapsed, toggle } = useSidebarCollapsed();

  return (
    <div className="min-h-screen bg-app">
      {/* Desktop sidebar */}
      <Sidebar collapsed={collapsed} onToggle={toggle} />

      {/* Main column — offset on desktop by sidebar width */}
      <div
        className={cn(
          'min-h-screen transition-[padding] duration-300',
          collapsed ? 'lg:pl-[88px]' : 'lg:pl-[260px]',
        )}
      >
        {/* Desktop top bar (search + bell + profile) — sticky on desktop */}
        <TopBar />

        {/* Mobile/tablet header + content padding */}
        <main
          className={cn(
            // Mobile: small horizontal padding, reserve space for bottom tabs
            'px-5 pt-3 pb-[110px]',
            // Tablet+: more breathing room
            'sm:px-6',
            // Desktop: full width inside main column, no bottom-tab padding
            'lg:px-8 lg:pt-6 lg:pb-10',
            className,
          )}
        >
          {/* Mobile-only header (sidebar replaces this on desktop) */}
          {showHeader ? (
            <div className="lg:hidden">
              <Header />
            </div>
          ) : null}

          <div
            className={cn(
              'w-full',
              constrained && 'mx-auto max-w-5xl',
            )}
          >
            {children}
          </div>
        </main>
      </div>

      {/* Mobile/tablet bottom tabs only */}
      {showTabs ? (
        <div className="lg:hidden">
          <BottomTabs />
        </div>
      ) : null}
    </div>
  );
};