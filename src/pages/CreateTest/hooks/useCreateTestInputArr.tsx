import { useMemo } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import type { InputGroup } from '@/common/components/form/types';
import CreateTestQuestionsMarksField from '@/pages/CreateTest/components/CreateTestQuestionsMarksField';
import MarkingSchemeSection from '@/pages/CreateTest/components/MarkingSchemeSection';
import { DIFFICULTIES } from '@/pages/CreateTest/constants';
import type { CreateTestFormValues } from '@/pages/CreateTest/schema';
import type { Subject, SubTopic, Topic } from '@/types';

interface UseCreateTestInputArrParams {
  form: UseFormReturn<CreateTestFormValues>;
  subjects: Subject[];
  topics: Topic[];
  subTopics: SubTopic[];
  loadingSubjects: boolean;
  loadingTopics: boolean;
  loadingSubTopics: boolean;
  watchedSubject: string;
  watchedTopics: string[];
  totalMarks: number;
  onSubjectChange: () => void;
  onTopicsChange: () => void;
}

export function useCreateTestInputArr({
  subjects,
  topics,
  subTopics,
  loadingSubjects,
  loadingTopics,
  loadingSubTopics,
  watchedSubject,
  watchedTopics,
  totalMarks,
  onSubjectChange,
  onTopicsChange,
}: UseCreateTestInputArrParams): InputGroup<CreateTestFormValues>[] {
  return useMemo(
    () => [
      {
        outerWrapperClassName: 'bg-white rounded-xl border border-border p-6',
        wrapperClassName: 'grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5',
        render: [
          {
            name: 'subject',
            type: 'select',
            label: 'Subject',
            placeholder: loadingSubjects ? 'Loading…' : 'Choose from Drop-down',
            disabled: loadingSubjects,
            getDynamicOptions: () =>
              subjects.map((subject) => ({ value: subject.id, label: subject.name })),
            customOnChange: () => onSubjectChange(),
          },
          {
            name: 'name',
            type: 'text',
            label: 'Name of Test',
            placeholder: 'Enter name of Test',
          },
          {
            name: 'topics',
            type: 'multi-select',
            label: 'Topic',
            getDynamicPlaceholder: () =>
              loadingTopics
                ? 'Loading…'
                : !watchedSubject
                  ? 'Select a subject first'
                  : 'Choose from Drop-down',
            getDynamicDisabled: () => !watchedSubject || loadingTopics,
            getDynamicOptions: () =>
              topics.map((topic) => ({ value: topic.id, label: topic.name })),
            customOnChange: () => onTopicsChange(),
          },
          {
            name: 'sub_topics',
            type: 'multi-select',
            label: 'Sub Topic',
            getDynamicPlaceholder: () =>
              loadingSubTopics
                ? 'Loading…'
                : !watchedTopics?.length
                  ? 'Select topics first'
                  : 'Choose from Drop-down',
            getDynamicDisabled: () => !watchedTopics?.length || loadingSubTopics,
            getDynamicOptions: () =>
              subTopics.map((subTopic) => ({ value: subTopic.id, label: subTopic.name })),
          },
          {
            name: 'total_time',
            type: 'number',
            label: 'Duration (Minutes)',
            placeholder: 'Enter the time',
            min: 1,
          },
          {
            name: 'difficulty',
            type: 'radio',
            label: 'Test Difficulty Level',
            options: DIFFICULTIES.map((item) => ({
              value: item.value,
              label: item.label,
            })),
          },
          {
            name: 'marking_scheme',
            type: 'custom-comp',
            customComp: (formUtils) => (
              <MarkingSchemeSection control={formUtils.control} />
            ),
          },
          {
            name: 'questions_and_marks',
            type: 'custom-comp',
            customComp: (formUtils) => (
              <CreateTestQuestionsMarksField formUtils={formUtils} totalMarks={totalMarks} />
            ),
          },
        ],
      },
    ],
    [
      subjects,
      topics,
      subTopics,
      loadingSubjects,
      loadingTopics,
      loadingSubTopics,
      watchedSubject,
      watchedTopics,
      totalMarks,
      onSubjectChange,
      onTopicsChange,
    ],
  );
}
