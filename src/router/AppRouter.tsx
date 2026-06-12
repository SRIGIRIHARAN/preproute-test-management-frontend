import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import ProtectedRoute from './ProtectedRoute';
import AppSpinner from '../common/components/AppSpinner';
import {
  LOGIN_PAGE_URL,
  DASHBOARD_PAGE_URL,
  CREATE_TEST_PAGE_URL,
} from '../constants/routes';

const LoginPage = lazy(() => import('../pages/Login/LoginPage'));
const DashboardPage = lazy(() => import('../pages/Dashboard/DashboardPage'));
const CreateTestPage = lazy(() => import('../pages/CreateTest/CreateTestPage'));
const AddQuestionsPage = lazy(() => import('../pages/AddQuestions/AddQuestionsPage'));
const PreviewPublishPage = lazy(() => import('../pages/PreviewPublish/PreviewPublishPage'));

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="flex h-screen items-center justify-center">
            <AppSpinner />
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<Navigate to={DASHBOARD_PAGE_URL} replace />} />
          <Route path={LOGIN_PAGE_URL} element={<LoginPage />} />
          <Route
            path={DASHBOARD_PAGE_URL}
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path={CREATE_TEST_PAGE_URL}
            element={
              <ProtectedRoute>
                <CreateTestPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tests/:id/edit"
            element={
              <ProtectedRoute>
                <CreateTestPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tests/:id/questions"
            element={
              <ProtectedRoute>
                <AddQuestionsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tests/:id/preview"
            element={
              <ProtectedRoute>
                <PreviewPublishPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
