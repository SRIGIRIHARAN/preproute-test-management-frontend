import { loginImage } from "@/assets";
import AppImage from "../components/AppImage";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface flex">
      <div className="hidden md:flex w-1/2 items-center justify-center bg-surface">
        <AppImage
          src={loginImage}
          alt="login"
          className="w-md h-auto object-cover"
        />
      </div>
      <div className="w-full md:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-8 border border-border">
          {children}
        </div>
      </div>
    </div>
  );
}
