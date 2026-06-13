import type { ReactNode } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import type { IStateTabList } from '@/common/components/types';

interface AppStateBasedTabsProps {
  tabList: IStateTabList[];
  className?: string;
  tabsListClassName?: string;
  tabsTriggerClassName?: string;
  tabsHeaderClassName?: string;
  tabsContentClassName?: string;
  headerAsideComp?: ReactNode;
  hideContent?: boolean;
  value?: string;
  onValueChange?: (value: string) => void;
}

export default function AppStateBasedTabs({
  tabList,
  className,
  tabsListClassName,
  tabsTriggerClassName,
  tabsHeaderClassName,
  tabsContentClassName,
  headerAsideComp,
  hideContent = false,
  value,
  onValueChange,
}: AppStateBasedTabsProps) {
  const firstId = tabList[0]?.id;
  const isControlled = value !== undefined && onValueChange !== undefined;

  return (
    <Tabs
      className={cn('min-w-0', className)}
      {...(isControlled ? { value, onValueChange } : { defaultValue: firstId })}
    >
      <div className={cn('relative', tabsHeaderClassName)}>
        <TabsList
          className={cn(
            'no-scrollbar flex w-fit flex-nowrap justify-start overflow-x-auto',
            tabsListClassName,
          )}
        >
          {tabList.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className={cn('shrink-0', tabsTriggerClassName)}
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {headerAsideComp ? <div>{headerAsideComp}</div> : null}
      </div>

      {!hideContent &&
        tabList.map((tab) => (
          <TabsContent key={tab.id} value={tab.id} className={tabsContentClassName}>
            {tab.content}
          </TabsContent>
        ))}
    </Tabs>
  );
}
