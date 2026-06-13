import { useParams } from 'react-router-dom';
import AppBreadcrumb from '@/common/components/AppBreadcrumb';

export default function CreateTestPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);

  return (
    <div className="flex flex-col gap-6">
      <AppBreadcrumb
        items={['Test Creation', isEdit ? 'Edit Test' : 'Create Test', 'Chapter Wise']}
      />
      <div>Create Test Page</div>
    </div>
  );
}
