import AppInput from '@/common/components/AppInput';
import type { CreateTestFormValues } from '@/pages/CreateTest/schema';
import type { UseFormReturn } from 'react-hook-form';

interface CreateTestQuestionsMarksFieldProps {
  formUtils: UseFormReturn<CreateTestFormValues>;
  totalMarks: number;
}

export default function CreateTestQuestionsMarksField({
  formUtils,
  totalMarks,
}: CreateTestQuestionsMarksFieldProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <AppInput
        label="No of Questions"
        type="number"
        min={1}
        placeholder="Ex:250 Marks"
        error={formUtils.formState.errors.total_questions?.message}
        value={formUtils.watch('total_questions') ?? ''}
        onChange={(event) => {
          const value = event.target.value;
          formUtils.setValue(
            'total_questions',
            value === '' ? 0 : Number(value),
            { shouldValidate: true },
          );
        }}
      />
      <AppInput
        label="Total Marks"
        type="number"
        value={totalMarks}
        readOnly
        placeholder="Ex:250 Marks"
        className="bg-gray-50 cursor-not-allowed"
      />
    </div>
  );
}
