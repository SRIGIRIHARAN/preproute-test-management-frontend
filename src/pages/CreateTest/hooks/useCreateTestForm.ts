import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import apiClient from '@/api/axios';
import {
  subjectEndpoints,
  topicEndpoints,
  subTopicEndpoints,
  testEndpoints,
} from '@/api/endpoints';
import { showToast } from '@/common/components/AppToast';
import { useTestStore } from '@/store/testStore';
import type { Subject, SubTopic, Test, Topic } from '@/types';
import { ADD_QUESTIONS_PAGE_URL, DASHBOARD_PAGE_URL, EDIT_TEST_TYPE_URL } from '@/constants/routes';
import { TEST_TYPES } from '@/pages/CreateTest/constants';
import { createTestSchema, type CreateTestFormValues } from '@/pages/CreateTest/schema';
import type { ApiItemResponse, ApiListResponse } from '@/pages/CreateTest/types';

export function useCreateTestForm() {
  const { id, testType } = useParams();
  const isEdit = Boolean(id);
  const activeTestType =
    TEST_TYPES.find((t) => t.value === testType)?.value ?? 'chapterwise';
  const navigate = useNavigate();
  const setCurrentTest = useTestStore((s) => s.setCurrentTest);

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [subTopics, setSubTopics] = useState<SubTopic[]>([]);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [loadingTopics, setLoadingTopics] = useState(false);
  const [loadingSubTopics, setLoadingSubTopics] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(isEdit);

  const pendingEditTopicsRef = useRef<string[] | null>(null);
  const pendingEditSubTopicsRef = useRef<string[] | null>(null);

  const form = useForm<CreateTestFormValues>({
    resolver: zodResolver(createTestSchema),
    defaultValues: {
      type: 'chapterwise',
      difficulty: 'easy',
      correct_marks: 5,
      wrong_marks: -1,
      unattempt_marks: 0,
      total_marks: 0,
      topics: [],
      sub_topics: [],
    },
  });

  const { watch, setValue } = form;
  const watchedSubject = watch('subject');
  const watchedTopics = watch('topics');
  const watchedCorrectMarks = watch('correct_marks');
  const watchedTotalQuestions = watch('total_questions');
  const totalMarks = (watchedTotalQuestions || 0) * (watchedCorrectMarks || 0);

  useEffect(() => {
    setValue('type', activeTestType);
  }, [activeTestType, setValue]);

  useEffect(() => {
    setLoadingSubjects(true);
    apiClient
      .get<ApiListResponse<Subject>>(subjectEndpoints.list)
      .then((res) => setSubjects(res.data.data))
      .catch(() => showToast.error('Failed to load subjects'))
      .finally(() => setLoadingSubjects(false));
  }, []);

  useEffect(() => {
    if (!watchedSubject) {
      setTopics([]);
      return;
    }
    setLoadingTopics(true);
    apiClient
      .get<ApiListResponse<Topic>>(topicEndpoints.bySubject(watchedSubject))
      .then((res) => {
        setTopics(res.data.data);
        if (pendingEditTopicsRef.current !== null) {
          setValue('topics', pendingEditTopicsRef.current);
          pendingEditTopicsRef.current = null;
        }
      })
      .catch(() => showToast.error('Failed to load topics'))
      .finally(() => setLoadingTopics(false));
  }, [watchedSubject, setValue]);

  useEffect(() => {
    if (!watchedTopics || watchedTopics.length === 0) {
      setSubTopics([]);
      return;
    }
    setLoadingSubTopics(true);
    apiClient
      .post<ApiListResponse<SubTopic>>(subTopicEndpoints.byMultipleTopics, {
        topicIds: watchedTopics,
      })
      .then((res) => {
        setSubTopics(res.data.data);
        if (pendingEditSubTopicsRef.current !== null) {
          setValue('sub_topics', pendingEditSubTopicsRef.current);
          pendingEditSubTopicsRef.current = null;
        }
      })
      .catch(() => showToast.error('Failed to load sub-topics'))
      .finally(() => setLoadingSubTopics(false));
  }, [watchedTopics, setValue]);

  useEffect(() => {
    if (!id) return;
    setLoadingEdit(true);
    apiClient
      .get<ApiItemResponse<Test>>(testEndpoints.detail(id))
      .then((res) => {
        const test = res.data.data;
        setValue('name', test.name);
        setValue('type', test.type);
        setValue('difficulty', test.difficulty);
        setValue('total_time', test.total_time);
        setValue('total_questions', test.total_questions);
        setValue('correct_marks', test.correct_marks);
        setValue('wrong_marks', test.wrong_marks);
        setValue('unattempt_marks', test.unattempt_marks);
        setValue('total_marks', test.total_marks);
        pendingEditTopicsRef.current = test.topics || [];
        pendingEditSubTopicsRef.current = test.sub_topics || [];
        setValue('subject', test.subject);

        if (test.type !== testType) {
          navigate(EDIT_TEST_TYPE_URL(id, test.type), { replace: true });
        }
      })
      .catch(() => showToast.error('Failed to load test'))
      .finally(() => setLoadingEdit(false));
  }, [id, testType, navigate, setValue]);

  const onSubmit = async (data: CreateTestFormValues) => {
    setSubmitting(true);
    try {
      const payload = {
        name: data.name,
        type: data.type,
        subject: data.subject,
        topics: data.topics,
        sub_topics: data.sub_topics ?? [],
        difficulty: data.difficulty,
        total_time: data.total_time,
        total_questions: data.total_questions,
        correct_marks: data.correct_marks,
        wrong_marks: data.wrong_marks,
        unattempt_marks: data.unattempt_marks,
        total_marks: totalMarks,
      };

      let testId = id;
      if (isEdit && id) {
        await apiClient.put(testEndpoints.update(id), payload);
        showToast.success('Test updated successfully');
      } else {
        const res = await apiClient.post<ApiItemResponse<Test>>(
          testEndpoints.create,
          payload,
        );
        const created = res.data.data;
        setCurrentTest(created);
        testId = created.id;
        showToast.success('Test created successfully');
      }
      navigate(ADD_QUESTIONS_PAGE_URL(testId!));
    } catch {
      showToast.error(isEdit ? 'Failed to update test' : 'Failed to create test');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedTypeLabel =
    TEST_TYPES.find((t) => t.value === activeTestType)?.label ?? 'Chapterwise';

  const handleSubjectChange = () => {
    setValue('topics', []);
    setValue('sub_topics', []);
  };

  const handleTopicsChange = () => {
    setValue('sub_topics', []);
  };

  const handleCancel = () => navigate(DASHBOARD_PAGE_URL);

  return {
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
  };
}
