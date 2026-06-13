import { useLocation } from 'react-router-dom';
import AppLink from '@/common/components/AppLink';
import type { ITabList } from '@/common/components/types';
import { cn } from '@/lib/utils';

interface AppTabsProps {
  tabList: ITabList[];
  className?: string;
  viewTransition?: boolean;
  variant?: 'default' | 'pill';
}

export default function AppTabs({
  tabList,
  className,
  viewTransition = false,
  variant = 'default',
}: AppTabsProps) {
  const location = useLocation();
  const isPill = variant === 'pill';

  return (
    <div
      className={cn(
        isPill
          ? 'flex items-center gap-2 bg-white border border-border rounded-xl p-1.5 w-fit'
          : 'flex gap-8 items-center border-b border-border px-6',
        className,
      )}
    >
      {tabList.map((tab) => {
        const isSelected =
          location.pathname === tab.link ||
          (tab.baseUrl && location.pathname.includes(tab.baseUrl));

        return (
          <AppLink
            key={tab.label}
            viewTransition={viewTransition}
            to={tab.link}
            className={cn(
              'gap-1.5 text-sm flex items-center transition-colors',
              isPill
                ? cn(
                    'rounded-lg px-6 py-2.5 font-normal',
                    isSelected
                      ? 'bg-[#F8FAFF] text-[#384EC7] font-medium'
                      : 'text-gray-500 hover:text-gray-700',
                  )
                : cn(
                    'py-2',
                    isSelected ? 'app-tab-selected' : 'app-tab-unselected',
                  ),
            )}
          >
            {tab.icon}
            {tab.label}
          </AppLink>
        );
      })}
    </div>
  );
}
