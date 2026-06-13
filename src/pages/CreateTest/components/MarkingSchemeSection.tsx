import { Controller, type Control } from 'react-hook-form';
import MarkingSpinner from '@/pages/CreateTest/components/MarkingSpinner';
import type { CreateTestFormValues } from '@/pages/CreateTest/schema';

interface MarkingSchemeSectionProps {
  control: Control<CreateTestFormValues>;
}

export default function MarkingSchemeSection({ control }: MarkingSchemeSectionProps) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-medium text-gray-700">Marking Scheme:</p>
      <div className="grid grid-cols-3 gap-3">
        <Controller
          name="wrong_marks"
          control={control}
          render={({ field }) => (
            <MarkingSpinner label="Wrong Answer" value={field.value} onChange={field.onChange} />
          )}
        />
        <Controller
          name="unattempt_marks"
          control={control}
          render={({ field }) => (
            <MarkingSpinner label="Unattempted" value={field.value} onChange={field.onChange} />
          )}
        />
        <Controller
          name="correct_marks"
          control={control}
          render={({ field }) => (
            <MarkingSpinner label="Correct Answer" value={field.value} onChange={field.onChange} />
          )}
        />
      </div>
    </div>
  );
}
