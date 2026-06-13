import { z } from 'zod';

export const createTestSchema = z.object({
  name: z.string().min(1, 'Test name is required'),
  type: z.string().min(1),
  subject: z.string().min(1, 'Subject is required'),
  topics: z.array(z.string()).min(1, 'Select at least one topic'),
  sub_topics: z.array(z.string()).optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  total_time: z
    .number({ invalid_type_error: 'Duration is required' })
    .min(1, 'Duration must be at least 1'),
  total_questions: z
    .number({ invalid_type_error: 'No of questions is required' })
    .min(1, 'At least 1 question required'),
  correct_marks: z.number(),
  wrong_marks: z.number(),
  unattempt_marks: z.number(),
  total_marks: z.number(),
});

export type CreateTestFormValues = z.infer<typeof createTestSchema>;
