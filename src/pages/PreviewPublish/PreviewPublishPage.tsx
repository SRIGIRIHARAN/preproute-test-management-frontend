import AppBreadcrumb from '@/common/components/AppBreadcrumb';

export default function PreviewPublishPage() {
  return (
    <div className="flex flex-col gap-6">
      <AppBreadcrumb items={['Test Creation', 'Preview & Publish']} />
      <div>Preview Publish Page</div>
    </div>
  );
}
