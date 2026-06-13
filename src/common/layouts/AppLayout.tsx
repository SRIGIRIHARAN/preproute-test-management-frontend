import { Outlet } from 'react-router-dom';
import AppSidebar from '@/common/components/AppSidebar';

export default function AppLayout() {
  return (
    <AppSidebar>
      <Outlet />
    </AppSidebar>
  );
}
