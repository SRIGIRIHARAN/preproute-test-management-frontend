import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, ChevronDown, LogOut, Menu } from 'lucide-react';
import AppImage from '@/common/components/AppImage';
import { userAvatar } from '@/assets';
import { useAuthStore } from '@/store/authStore';
import { LOGIN_PAGE_URL } from '@/constants/routes';
import { useSidebarContext } from '@/common/contexts/SidebarContext';

function formatDisplayName(name?: string, userId?: string) {
  if (name) {
    return name
      .toLowerCase()
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }
  return userId ?? 'Admin';
}

export default function AppHeader() {
  const navigate = useNavigate();
  const { setOpen } = useSidebarContext();
  const { user, logout } = useAuthStore();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const displayName = formatDisplayName(user?.name, user?.userId);
  const displayRole = user?.role
    ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
    : 'Admin';

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    logout();
    navigate(LOGIN_PAGE_URL);
  };

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-4 bg-white border-b border-border px-4 py-3 md:px-6">
      <div className="md:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="p-1.5 rounded-md text-gray-600 hover:bg-gray-100"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      <div className="flex items-center gap-4 shrink-0 ml-auto">
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[#D1FAE5] bg-[#ECFDF5] text-[#10B981] hover:bg-[#D1FAE5] transition-colors"
          aria-label="Notifications"
        >
          <Bell className="h-[18px] w-[18px] stroke-[1.75]" />
        </button>

        <div className="hidden sm:block h-8 w-px bg-border" />

        <div className="relative" ref={userMenuRef}>
          <button
            type="button"
            onClick={() => setUserMenuOpen((o) => !o)}
            className="flex items-center gap-2.5 rounded-lg py-1 pl-1 pr-2 hover:bg-gray-50 transition-colors"
          >
            <AppImage
              src={userAvatar}
              alt={displayName}
              className="h-9 w-9 rounded-full object-cover shrink-0"
            />
            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold text-gray-900 leading-tight whitespace-nowrap">
                {displayName}
              </p>
              <p className="text-xs text-gray-400 leading-tight">{displayRole}</p>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-400 hidden sm:block shrink-0" />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 top-full mt-1 w-44 rounded-lg border border-border bg-white shadow-lg py-1 z-50">
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
