import AppBreadcrumb from '@/common/components/AppBreadcrumb';
import AppForm from '@/common/components/AppForm';
import AppSpinner from '@/common/components/AppSpinner';
import TestTypeTabs from '@/pages/CreateTest/components/TestTypeTabs';
import { useCreateTestForm } from '@/pages/CreateTest/hooks/useCreateTestForm';
import { useCreateTestInputArr } from '@/pages/CreateTest/hooks/useCreateTestInputArr';

export default function CreateTestPage() {
  const {
    form,
    isEdit,
    loadingEdit,
    submitting,
    subjects,
    topics,
    subTopics,
    loadingSubjects,
    loadingTopics,
    loadingSubTopics,
    watchedSubject,
    watchedTopics,
    totalMarks,
    selectedTypeLabel,
    onSubmit,
    handleSubjectChange,
    handleTopicsChange,
    handleCancel,
  } = useCreateTestForm();

  const inputArr = useCreateTestInputArr({
    form,
    subjects,
    topics,
    subTopics,
    loadingSubjects,
    loadingTopics,
    loadingSubTopics,
    watchedSubject,
    watchedTopics,
    totalMarks,
    onSubjectChange: handleSubjectChange,
    onTopicsChange: handleTopicsChange,
  });

  if (loadingEdit) {
    return (
      <div className="flex items-center justify-center h-64">
        <AppSpinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <AppBreadcrumb
        items={['Test Creation', isEdit ? 'Edit Test' : 'Create Test', selectedTypeLabel]}
      />

      <TestTypeTabs />

      <AppForm
        formUtils={form}
        inputArr={inputArr}
        onSubmit={onSubmit}
        isSubmitting={submitting}
        primaryButtonText="Next"
        secondaryButtonText="Cancel"
        onSecondaryButtonClick={handleCancel}
      />
    </div>
  );
}
