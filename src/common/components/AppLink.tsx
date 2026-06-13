import { Link, type LinkProps } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface AppLinkProps extends LinkProps {
  className?: string;
  viewTransition?: boolean;
}

export default function AppLink({
  className,
  viewTransition = false,
  children,
  ...props
}: AppLinkProps) {
  return (
    <Link
      className={cn(className)}
      viewTransition={viewTransition}
      {...props}
    >
      {children}
    </Link>
  );
}
