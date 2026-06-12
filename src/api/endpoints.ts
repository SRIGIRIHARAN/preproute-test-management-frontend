// Auth
export const authEndpoints = {
  login: '/auth/login',
};

// Subjects, Topics, Sub-topics
export const subjectEndpoints = {
  list: '/subjects',
};

export const topicEndpoints = {
  bySubject: (subjectId: string) => `/topics/subject/${subjectId}`,
};

export const subTopicEndpoints = {
  byTopic: (topicId: string) => `/sub-topics/topic/${topicId}`,
  byMultipleTopics: '/sub-topics/multi-topics',
};

// Tests
export const testEndpoints = {
  list: '/tests',
  create: '/tests',
  detail: (id: string) => `/tests/${id}`,
  update: (id: string) => `/tests/${id}`,
  delete: (id: string) => `/tests/${id}`,
};

// Questions
export const questionEndpoints = {
  bulkCreate: '/questions/bulk',
  fetchBulk: '/questions/fetchBulk',
};
