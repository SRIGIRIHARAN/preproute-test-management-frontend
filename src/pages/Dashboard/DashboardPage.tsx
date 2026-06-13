import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, Eye, Pencil, Trash2 } from 'lucide-react';
import AppButton from '@/common/components/AppButton';
import AppBreadcrumb from '@/common/components/AppBreadcrumb';
import AppBadge from '@/common/components/AppBadge';
import AppModal from '@/common/components/AppModal';
import AppTable from '@/common/components/AppTable';
import { showToast } from '@/common/components/AppToast';
import apiClient from '@/api/axios';
import { testEndpoints } from '@/api/endpoints';
import type { Test } from '@/types';
import {
  CREATE_TEST_PAGE_URL,
  EDIT_TEST_PAGE_URL,
  PREVIEW_PUBLISH_PAGE_URL,
} from '@/constants/routes';

interface TestsResponse {
  data: Test[];
}

function formatDate(iso?: string) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function statusVariant(status: Test['status']) {
  if (status === 'live') return 'success' as const;
  if (status === 'draft') return 'warning' as const;
  return 'default' as const;
}

function statusLabel(status: Test['status']) {
  if (status === 'live') return 'Live';
  if (status === 'draft') return 'Draft';
  return 'Unknown';
}

function TestActions({
  test,
  onEdit,
  onView,
  onDelete,
}: {
  test: Test;
  onEdit: (test: Test) => void;
  onView: (test: Test) => void;
  onDelete: (test: Test) => void;
}) {
  return (
    <div className="flex items-center gap-1">
      <AppButton
        variant="ghost"
        size="sm"
        onClick={() => onEdit(test)}
        aria-label={`Edit ${test.name}`}
      >
        <Pencil className="h-4 w-4" />
      </AppButton>
      <AppButton
        variant="ghost"
        size="sm"
        onClick={() => onView(test)}
        aria-label={`View ${test.name}`}
      >
        <Eye className="h-4 w-4" />
      </AppButton>
      <AppButton
        variant="ghost"
        size="sm"
        onClick={() => onDelete(test)}
        aria-label={`Delete ${test.name}`}
        className="text-red-500 hover:bg-red-50 hover:text-red-600"
      >
        <Trash2 className="h-4 w-4" />
      </AppButton>
    </div>
  );
}

function TestCard({
  test,
  onEdit,
  onView,
  onDelete,
}: {
  test: Test;
  onEdit: (test: Test) => void;
  onView: (test: Test) => void;
  onDelete: (test: Test) => void;
}) {
  return (
    <div className="bg-white rounded-lg border border-border p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 truncate">{test.name}</h3>
          <p className="text-xs text-gray-500 mt-0.5">{test.subject}</p>
        </div>
        <AppBadge label={statusLabel(test.status)} variant={statusVariant(test.status)} />
      </div>

      <div className="flex flex-wrap gap-1.5">
        {test.topics.map((topic) => (
          <AppBadge key={topic} label={topic} variant="info" />
        ))}
      </div>

      <p className="text-xs text-gray-400">Created {formatDate(test.created_at)}</p>

      <div className="flex items-center gap-2 pt-1 border-t border-border">
        <AppButton variant="secondary" size="sm" className="flex-1" onClick={() => onEdit(test)}>
          Edit
        </AppButton>
        <AppButton variant="secondary" size="sm" className="flex-1" onClick={() => onView(test)}>
          View
        </AppButton>
        <AppButton variant="danger" size="sm" className="flex-1" onClick={() => onDelete(test)}>
          Delete
        </AppButton>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Test | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchTests = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiClient.get<TestsResponse>(testEndpoints.list);
      setTests(res.data.data);
    } catch {
      showToast.error('Failed to load tests. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTests();
  }, [fetchTests]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await apiClient.delete(testEndpoints.delete(deleteTarget.id));
      setTests((prev) => prev.filter((t) => t.id !== deleteTarget.id));
      showToast.success('Test deleted successfully.');
      setDeleteTarget(null);
    } catch {
      showToast.error('Failed to delete test. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const handleEdit = (test: Test) => navigate(EDIT_TEST_PAGE_URL(test.id));
  const handleView = (test: Test) => navigate(PREVIEW_PUBLISH_PAGE_URL(test.id));

  const columns = useMemo(
    () => [
      {
        key: 'name',
        header: 'Test Name',
        className: 'font-medium text-gray-900 max-w-[200px] truncate',
        render: (test: Test) => test.name,
      },
      {
        key: 'subject',
        header: 'Subject',
        className: 'text-gray-600',
        render: (test: Test) => test.subject,
      },
      {
        key: 'topics',
        header: 'Topics',
        render: (test: Test) => (
          <div className="flex flex-wrap gap-1 max-w-[220px]">
            {test.topics.map((topic) => (
              <AppBadge key={topic} label={topic} variant="info" />
            ))}
          </div>
        ),
      },
      {
        key: 'status',
        header: 'Status',
        render: (test: Test) => (
          <AppBadge label={statusLabel(test.status)} variant={statusVariant(test.status)} />
        ),
      },
      {
        key: 'created_at',
        header: 'Created Date',
        className: 'text-gray-500 whitespace-nowrap',
        render: (test: Test) => formatDate(test.created_at),
      },
      {
        key: 'actions',
        header: 'Actions',
        align: 'right' as const,
        headerClassName: 'text-right',
        render: (test: Test) => (
          <div className="flex justify-end">
            <TestActions
              test={test}
              onEdit={handleEdit}
              onView={handleView}
              onDelete={setDeleteTarget}
            />
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <>
      <div className="flex flex-col gap-6">
        <AppBreadcrumb items={['Dashboard', 'All Tests']} />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-xl font-bold text-gray-900">All Tests</h1>
          <AppButton onClick={() => navigate(CREATE_TEST_PAGE_URL)} className="shrink-0">
            Create New Test
          </AppButton>
        </div>

        {!loading && tests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-lg border border-border">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 mb-4">
              <ClipboardList className="h-8 w-8 text-primary" />
            </div>
            <p className="text-sm font-medium text-gray-700 mb-1">
              No tests yet. Create your first test.
            </p>
            <p className="text-xs text-gray-400 mb-6 text-center">
              Start building MCQ-based tests for your students.
            </p>
            <AppButton onClick={() => navigate(CREATE_TEST_PAGE_URL)}>Create New Test</AppButton>
          </div>
        ) : (
          <AppTable
            columns={columns}
            data={tests}
            rowKey={(test) => test.id}
            loading={loading}
            mobileRender={(test) => (
              <TestCard
                test={test}
                onEdit={handleEdit}
                onView={handleView}
                onDelete={setDeleteTarget}
              />
            )}
          />
        )}
      </div>

      <AppModal
        open={!!deleteTarget}
        onClose={() => !deleting && setDeleteTarget(null)}
        title="Delete Test"
        maxWidth="max-w-md"
      >
        <p className="text-sm text-gray-600 mb-6">
          Are you sure you want to delete{' '}
          <span className="font-medium text-gray-900">&ldquo;{deleteTarget?.name}&rdquo;</span>? This
          action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <AppButton variant="secondary" onClick={() => setDeleteTarget(null)} disabled={deleting}>
            Cancel
          </AppButton>
          <AppButton variant="danger" loading={deleting} onClick={handleDelete}>
            Delete
          </AppButton>
        </div>
      </AppModal>
    </>
  );
}
