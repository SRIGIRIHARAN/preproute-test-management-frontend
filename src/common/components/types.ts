import type { ReactNode } from 'react';

export interface ITabList {
  label: string;
  link: string;
  icon?: ReactNode;
  baseUrl?: string;
}

export interface IStateTabList {
  id: string;
  label: ReactNode;
  content: ReactNode;
}
