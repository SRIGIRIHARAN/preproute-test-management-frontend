import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import AppPagination, { DEFAULT_PAGE_SIZE } from '@/common/components/AppPagination';

export interface AppTableColumn<T> {
  key: string;
  header: ReactNode;
  className?: string;
  headerClassName?: string;
  align?: 'left' | 'center' | 'right';
  render: (row: T, index: number) => ReactNode;
}

interface AppTableProps<T> {
  columns: AppTableColumn<T>[];
  data: T[];
  rowKey: (row: T) => string;
  pageSize?: number;
  loading?: boolean;
  className?: string;
  mobileRender?: (row: T, index: number) => ReactNode;
  skeletonRows?: number;
}

function TableSkeleton({ columns, rows }: { columns: number; rows: number }) {
  return (
    <div className="animate-pulse">
      <div className="h-11 bg-gray-50 border-b border-border" />
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 px-4 py-4 border-b border-border last:border-0"
        >
          {Array.from({ length: columns }).map((__, j) => (
            <div
              key={j}
              className={cn(
                'h-4 bg-gray-100 rounded',
                j === columns - 1 ? 'w-28 ml-auto' : j === 0 ? 'flex-1 max-w-[180px]' : 'w-24',
              )}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function MobileSkeleton({ rows }: { rows: number }) {
  return (
    <div className="md:hidden flex flex-col gap-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="animate-pulse bg-white rounded-lg border border-border p-4 space-y-3">
          <div className="h-4 bg-gray-100 rounded w-2/3" />
          <div className="h-3 bg-gray-100 rounded w-1/3" />
          <div className="h-8 bg-gray-100 rounded w-full" />
        </div>
      ))}
    </div>
  );
}

const alignClass = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

export default function AppTable<T>({
  columns,
  data,
  rowKey,
  pageSize = DEFAULT_PAGE_SIZE,
  loading = false,
  className,
  mobileRender,
  skeletonRows = 5,
}: AppTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(data.length / pageSize));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return data.slice(start, start + pageSize);
  }, [data, currentPage, pageSize]);

  if (loading) {
    return (
      <>
        <div className={cn('hidden md:block bg-white rounded-lg border border-border overflow-hidden', className)}>
          <TableSkeleton columns={columns.length} rows={skeletonRows} />
        </div>
        {mobileRender && <MobileSkeleton rows={3} />}
      </>
    );
  }

  return (
    <>
      <div
        className={cn(
          'hidden md:block bg-white rounded-lg border border-border overflow-hidden',
          className,
        )}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-gray-50">
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={cn(
                      'px-4 py-3 font-medium text-gray-600',
                      alignClass[column.align ?? 'left'],
                      column.headerClassName,
                    )}
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row, index) => (
                <tr
                  key={rowKey(row)}
                  className="border-b border-border last:border-0 hover:bg-gray-50/50"
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={cn(
                        'px-4 py-3',
                        alignClass[column.align ?? 'left'],
                        column.className,
                      )}
                    >
                      {column.render(row, index)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <AppPagination
          currentPage={currentPage}
          totalItems={data.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
        />
      </div>

      {mobileRender && (
        <div className="md:hidden flex flex-col gap-3">
          {paginatedData.map((row, index) => (
            <div key={rowKey(row)}>{mobileRender(row, index)}</div>
          ))}

          {data.length > pageSize && (
            <div className="bg-white rounded-lg border border-border overflow-hidden">
              <AppPagination
                currentPage={currentPage}
                totalItems={data.length}
                pageSize={pageSize}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>
      )}
    </>
  );
}

export { DEFAULT_PAGE_SIZE };
