import { cn } from '@/lib/utils';

interface SkeletonFormFieldsProps {
  fieldsCount?: number;
  skeletonWrapperClassName?: string;
}

export default function SkeletonFormFields({
  fieldsCount = 2,
  skeletonWrapperClassName,
}: SkeletonFormFieldsProps) {
  return (
    <div
      className={cn(
        'animate-pulse bg-white rounded-xl border border-border p-6 space-y-5',
        skeletonWrapperClassName,
      )}
    >
      {Array.from({ length: fieldsCount }).map((_, index) => (
        <div key={index} className="space-y-2">
          <div className="h-4 bg-gray-100 rounded w-1/4" />
          <div className="h-10 bg-gray-100 rounded w-full" />
        </div>
      ))}
    </div>
  );
}
