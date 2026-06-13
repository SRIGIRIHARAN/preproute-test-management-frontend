import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
  label: string;
}

interface AppBreadcrumbProps {
  items: BreadcrumbItem[] | string[];
  className?: string;
}

export default function AppBreadcrumb({ items, className }: AppBreadcrumbProps) {
  const normalized = items.map((item) =>
    typeof item === 'string' ? { label: item } : item,
  );

  return (
    <nav aria-label="Breadcrumb" className={cn('text-sm', className)}>
      <ol className="flex flex-wrap items-center gap-1.5">
        {normalized.map((item, index) => {
          return (
            <li
              key={`${item.label}-${index}`}
              className="flex items-center gap-1.5"
            >
              {index > 0 && <span className="text-gray-400">/</span>}
              <span className={cn("text-black/60")}>{item.label}</span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
