export const LOGIN_PAGE_URL = '/login';
export const DASHBOARD_PAGE_URL = '/dashboard';
export const CREATE_TEST_PAGE_URL = '/tests/create';
export const CREATE_TEST_TYPE_URL = (type: string) => `/tests/create/${type}`;
export const CREATE_TEST_CHAPTERWISE_URL = CREATE_TEST_TYPE_URL('chapterwise');
export const EDIT_TEST_PAGE_URL = (id: string, type = 'chapterwise') => `/tests/${id}/edit/${type}`;
export const EDIT_TEST_TYPE_URL = (id: string, type: string) => `/tests/${id}/edit/${type}`;
export const ADD_QUESTIONS_PAGE_URL = (id: string) => `/tests/${id}/questions`;
export const PREVIEW_PUBLISH_PAGE_URL = (id: string) => `/tests/${id}/preview`;
