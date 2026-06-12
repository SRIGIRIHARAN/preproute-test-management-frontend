import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '@/common/layouts/AuthLayout';
import AppInput from '@/common/components/AppInput';
import AppButton from '@/common/components/AppButton';
import { showToast } from '@/common/components/AppToast';
import apiClient from '@/api/axios';
import { authEndpoints } from '@/api/endpoints';
import { useAuthStore } from '@/store/authStore';
import { DASHBOARD_PAGE_URL } from '@/constants/routes';
import AppImage from '@/common/components/AppImage';
import { logo } from '@/assets';

const schema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof schema>;

interface LoginResponse {
  data: {
    token: string;
  };
}

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(schema),
    defaultValues: { userId: '', password: '' },
  });

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    try {
      const res = await apiClient.post<LoginResponse>(authEndpoints.login, {
        userId: data.userId,
        password: data.password,
      });
      const token = res.data.data.token;
      setAuth(token, { userId: data.userId });
      navigate(DASHBOARD_PAGE_URL);
    } catch {
      showToast.error('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <AppImage src={logo} alt="logo" className="w-[134px] h-auto object-cover" />
          <h2 className="text-2xl font-bold text-gray-900">Login</h2>
          <p className="text-sm text-gray-400">
            Use your company provided Login credentials
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <AppInput
            label="User ID"
            placeholder="Enter your User ID"
            autoComplete="username"
            error={errors.userId?.message}
            {...register('userId')}
          />

          <AppInput
            label="Password"
            placeholder="Enter your password"
            autoComplete="current-password"
            showPasswordToggle
            error={errors.password?.message}
            {...register('password')}
          />

          <div className="flex justify-end">
            <button
              type="button"
              className="text-sm font-medium text-primary hover:text-primary-hover"
            >
              Forgot password?
            </button>
          </div>
        </div>

        <AppButton type="submit" fullWidth loading={loading}>
          Login
        </AppButton>
      </form>
    </AuthLayout>
  );
}
