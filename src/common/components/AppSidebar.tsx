import { useEffect, useState, type ReactNode } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LineChart, PenLine, ClipboardList, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import AppImage from '@/common/components/AppImage';
import AppHeader from '@/common/components/AppHeader';
import { SidebarContext } from '@/common/contexts/SidebarContext';
import { logo } from '@/assets';
import {
  CREATE_TEST_PAGE_URL,
  DASHBOARD_PAGE_URL,
} from '@/constants/routes';

const SIDEBAR_WIDTH = 'w-[200px]';
const SIDEBAR_OFFSET = 'md:ml-[200px]';

const navItems = [
  { label: 'Dashboard', to: DASHBOARD_PAGE_URL, icon: LineChart },
  { label: 'Test Creation', to: CREATE_TEST_PAGE_URL, icon: PenLine },
  { label: 'Test Tracking', to: DASHBOARD_PAGE_URL, icon: ClipboardList },
];

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const location = useLocation();

  const isActive = (label: string, to: string) => {
    if (label === 'Dashboard') return location.pathname === DASHBOARD_PAGE_URL;
    if (label === 'Test Creation') {
      return (
        location.pathname === CREATE_TEST_PAGE_URL ||
        /^\/tests\/[^/]+\/edit$/.test(location.pathname)
      );
    }
    if (label === 'Test Tracking') {
      return /^\/tests\/[^/]+\/(questions|preview)$/.test(location.pathname);
    }
    return location.pathname === to;
  };

  return (
    <nav className="flex flex-col gap-1 px-3">
      {navItems.map(({ label, to, icon: Icon }) => {
        const active = isActive(label, to);
        return (
          <NavLink
            key={label}
            to={to}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-2.5 rounded-lg py-2.5 pl-3 pr-3 text-sm font-medium transition-colors border-l-[3px]",
              active
                ? "border-l-[#384EC7] bg-[#F8FAFF] text-[#384EC7]"
                : "border-l-transparent text-[#6B7180] hover:bg-[#F8FAFF]",
            )}
          >
            <Icon className="h-[18px] w-[18px] shrink-0 stroke-[1.75]" />
            {label}
          </NavLink>
        );
      })}
    </nav>
  );
}

interface AppSidebarProps {
  children: ReactNode;
}

export default function AppSidebar({ children }: AppSidebarProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  return (
    <SidebarContext.Provider value={{ open: sidebarOpen, setOpen: setSidebarOpen }}>
      <div className="min-h-svh bg-surface flex">
        {/* Desktop sidebar */}
        <aside
          className={cn(
            'hidden md:flex fixed inset-y-0 left-0 z-30 flex-col bg-white border-r border-border',
            SIDEBAR_WIDTH,
          )}
        >
          <div className="px-5 pt-6 pb-4">
            <AppImage src={logo} alt="PrepRoute" className="h-8 w-auto object-contain" />
          </div>
          <SidebarNav />
        </aside>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <aside
          className={cn(
            'fixed inset-y-0 left-0 z-50 flex flex-col bg-white border-r border-border transition-transform duration-200 md:hidden',
            SIDEBAR_WIDTH,
            sidebarOpen ? 'translate-x-0' : '-translate-x-full',
          )}
        >
          <div className="flex items-center justify-between px-5 pt-5 pb-2">
            <AppImage src={logo} alt="PrepRoute" className="h-8 w-auto object-contain" />
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="p-1 rounded-md text-gray-500 hover:bg-gray-100"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <SidebarNav onNavigate={() => setSidebarOpen(false)} />
        </aside>

        {/* Main area */}
        <div className={cn('flex-1 flex flex-col min-w-0', SIDEBAR_OFFSET)}>
          <AppHeader />
          <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
        </div>
      </div>
    </SidebarContext.Provider>
  );
}
