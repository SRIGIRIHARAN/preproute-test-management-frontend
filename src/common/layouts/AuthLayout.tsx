export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface flex">
      <div className="hidden md:flex w-1/2 items-center justify-center bg-surface">
        <div className="text-gray-300 text-sm">Illustration</div>
      </div>
      <div className="w-full md:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-8 border border-border">
          {children}
        </div>
      </div>
    </div>
  );
}
