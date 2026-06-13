import { createContext, useContext } from 'react';

interface SidebarContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const SidebarContext = createContext<SidebarContextValue | null>(null);

export function useSidebarContext() {
  const ctx = useContext(SidebarContext);
  if (!ctx) {
    throw new Error('useSidebarContext must be used within AppSidebar');
  }
  return ctx;
}
