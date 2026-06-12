# PrepRoute — Cursor AI Agent Prompt
## Complete Frontend Build Guide (PR-by-PR)

---

## 🧠 Context & Goal

You are building **PrepRoute** — a test management web application for admins to create, manage, and publish MCQ-based tests. The tech stack is fixed:

- **React 18 + TypeScript + Vite**
- **Tailwind CSS** (utility-first styling)
- **shadcn/ui** (component library — BUT always wrap in app-level components, never use directly in pages)
- **Zustand** (global state)
- **React Hook Form + Zod** (form handling & validation)
- **Axios** (API calls)
- **Lucide React** (icons)
- **Inter font only** (via Google Fonts or Fontsource — no other fonts)

The app has **5 pages**: Login → Dashboard → Create/Edit Test → Add Questions → Preview & Publish.

Backend staging URL: `https://admin-moderator-backend-staging.up.railway.app/api`

Test credentials — userId: `vedant-admin`, password: `vedant123`

The entire development must be done in a **branch-per-screen workflow** with PRs merged into `main`.

---

## 📐 Design System Reference

From Figma screenshots and task doc:

- **Primary blue**: `#4F6EF7`
- **Dark navy card**: `#1E1B4B`
- **Background**: `#F0F4FF` (light blue-grey)
- **White surface**: `#FFFFFF`
- **Text primary**: `#1A1A2E`
- **Text muted**: `#6B7280`
- **Success green**: `#10B981`
- **Error red**: `#EF4444`
- **Border**: `#E5E7EB`
- **Font**: Inter (400, 500, 600, 700 weights only)
- **Border radius**: `8px` for inputs/cards, `6px` for buttons
- Layout: Left sidebar (160px) + main content area, fully responsive down to 320px

---

## 🗂️ PR Breakdown — Build in This Exact Order

---

### PR 1 — Project Scaffold & Configuration
**Branch:** `feat/project-scaffold`

**Tasks:**

1. Initialize Vite project:
```bash
npm create vite@latest preproute -- --template react-ts
cd preproute
```

2. Install all dependencies:
```bash
npm install tailwindcss @tailwindcss/vite autoprefixer
npm install @fontsource/inter
npm install axios zustand
npm install react-hook-form @hookform/resolvers zod
npm install lucide-react
npm install react-router-dom
npm install clsx tailwind-merge
npm install class-variance-authority

# shadcn/ui setup
npx shadcn@latest init
# Choose: TypeScript=yes, style=default, base color=slate, CSS variables=yes
# Then add components as needed per screen
```

3. Configure `tailwind.config.ts`:
```ts
import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#4F6EF7',
          hover: '#3B5BEB',
          foreground: '#FFFFFF',
        },
        navy: '#1E1B4B',
        surface: '#F0F4FF',
        border: '#E5E7EB',
      },
      borderRadius: {
        DEFAULT: '8px',
      },
    },
  },
  plugins: [],
} satisfies Config
```

4. In `src/index.css`:
```css
@import '@fontsource/inter/400.css';
@import '@fontsource/inter/500.css';
@import '@fontsource/inter/600.css';
@import '@fontsource/inter/700.css';
@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  font-family: 'Inter', system-ui, sans-serif;
}
```

5. Create the full folder structure:

```
src/
├── api/
│   ├── axios.ts              # Axios instance with interceptors
│   └── endpoints.ts          # All API endpoint constants
├── common/
│   ├── components/
│   │   ├── AppButton.tsx
│   │   ├── AppInput.tsx
│   │   ├── AppSelect.tsx
│   │   ├── AppMultiSelect.tsx
│   │   ├── AppModal.tsx
│   │   ├── AppBadge.tsx
│   │   ├── AppSpinner.tsx
│   │   └── AppToast.tsx
│   └── layouts/
│       ├── AuthLayout.tsx
│       └── DashboardLayout.tsx
├── constants/
│   └── routes.ts             # All route URL constants
├── pages/
│   ├── Login/
│   │   └── LoginPage.tsx
│   ├── Dashboard/
│   │   └── DashboardPage.tsx
│   ├── CreateTest/
│   │   └── CreateTestPage.tsx
│   ├── AddQuestions/
│   │   └── AddQuestionsPage.tsx
│   └── PreviewPublish/
│       └── PreviewPublishPage.tsx
├── store/
│   ├── authStore.ts
│   └── testStore.ts
├── types/
│   └── index.ts
├── hooks/
│   └── useAuth.ts
├── router/
│   ├── AppRouter.tsx
│   └── ProtectedRoute.tsx
└── main.tsx
```

6. Create `src/api/endpoints.ts` with EXACTLY this content:
```ts
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
```

7. Create `src/constants/routes.ts` with EXACTLY this content:
```ts
export const LOGIN_PAGE_URL = '/login';
export const DASHBOARD_PAGE_URL = '/dashboard';
export const CREATE_TEST_PAGE_URL = '/tests/create';
export const EDIT_TEST_PAGE_URL = (id: string) => `/tests/${id}/edit`;
export const ADD_QUESTIONS_PAGE_URL = (id: string) => `/tests/${id}/questions`;
export const PREVIEW_PUBLISH_PAGE_URL = (id: string) => `/tests/${id}/preview`;
```

8. Create `src/api/axios.ts`:
```ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://admin-moderator-backend-staging.up.railway.app/api',
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

9. Create `src/types/index.ts` with shared interfaces:
```ts
export interface User {
  id: string;
  name: string;
  role: string;
}

export interface Subject {
  id: string;
  name: string;
}

export interface Topic {
  id: string;
  name: string;
  subject_id: string;
}

export interface SubTopic {
  id: string;
  name: string;
  topic_id: string;
}

export interface Test {
  id: string;
  name: string;
  type: string;
  subject: string;
  topics: string[];
  sub_topics?: string[];
  correct_marks: number;
  wrong_marks: number;
  unattempt_marks: number;
  difficulty: 'easy' | 'medium' | 'hard';
  total_time: number;
  total_marks: number;
  total_questions: number;
  status: 'draft' | 'live' | null;
  created_at?: string;
  questions?: string[];
}

export interface Question {
  id?: string;
  type: 'mcq';
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  correct_option: 'option1' | 'option2' | 'option3' | 'option4';
  explanation?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  topic?: string;
  sub_topic?: string;
  media_url?: string;
  test_id: string;
}
```

10. Create `src/store/authStore.ts`:
```ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  user: { userId: string } | null;
  setAuth: (token: string, user: { userId: string }) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setAuth: (token, user) => {
        localStorage.setItem('token', token);
        set({ token, user });
      },
      logout: () => {
        localStorage.removeItem('token');
        set({ token: null, user: null });
      },
    }),
    { name: 'auth-storage' }
  )
);
```

11. Create `src/store/testStore.ts`:
```ts
import { create } from 'zustand';
import { Test, Question } from '../types';

interface TestState {
  currentTest: Test | null;
  questions: Question[];
  setCurrentTest: (test: Test) => void;
  setQuestions: (questions: Question[]) => void;
  reset: () => void;
}

export const useTestStore = create<TestState>((set) => ({
  currentTest: null,
  questions: [],
  setCurrentTest: (test) => set({ currentTest: test }),
  setQuestions: (questions) => set({ questions }),
  reset: () => set({ currentTest: null, questions: [] }),
}));
```

12. Create `src/router/ProtectedRoute.tsx`:
```tsx
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { LOGIN_PAGE_URL } from '../constants/routes';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((s) => s.token);
  if (!token) return <Navigate to={LOGIN_PAGE_URL} replace />;
  return <>{children}</>;
}
```

13. Create `src/router/AppRouter.tsx` with all routes using lazy imports:
```tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import ProtectedRoute from './ProtectedRoute';
import AppSpinner from '../common/components/AppSpinner';
import {
  LOGIN_PAGE_URL, DASHBOARD_PAGE_URL, CREATE_TEST_PAGE_URL,
  EDIT_TEST_PAGE_URL, ADD_QUESTIONS_PAGE_URL, PREVIEW_PUBLISH_PAGE_URL
} from '../constants/routes';

const LoginPage = lazy(() => import('../pages/Login/LoginPage'));
const DashboardPage = lazy(() => import('../pages/Dashboard/DashboardPage'));
const CreateTestPage = lazy(() => import('../pages/CreateTest/CreateTestPage'));
const AddQuestionsPage = lazy(() => import('../pages/AddQuestions/AddQuestionsPage'));
const PreviewPublishPage = lazy(() => import('../pages/PreviewPublish/PreviewPublishPage'));

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="flex h-screen items-center justify-center"><AppSpinner /></div>}>
        <Routes>
          <Route path="/" element={<Navigate to={DASHBOARD_PAGE_URL} replace />} />
          <Route path={LOGIN_PAGE_URL} element={<LoginPage />} />
          <Route path={DASHBOARD_PAGE_URL} element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path={CREATE_TEST_PAGE_URL} element={<ProtectedRoute><CreateTestPage /></ProtectedRoute>} />
          <Route path="/tests/:id/edit" element={<ProtectedRoute><CreateTestPage /></ProtectedRoute>} />
          <Route path="/tests/:id/questions" element={<ProtectedRoute><AddQuestionsPage /></ProtectedRoute>} />
          <Route path="/tests/:id/preview" element={<ProtectedRoute><PreviewPublishPage /></ProtectedRoute>} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
```

14. Wire `AppRouter` into `src/main.tsx`. Add placeholder files for all pages (just export a `() => <div>Page</div>` stub) so the build passes.

15. Create placeholder `src/common/components/AppSpinner.tsx`:
```tsx
export default function AppSpinner() {
  return (
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
  );
}
```

16. Commit with message: `feat: project scaffold, routing, store, API setup`
17. Push branch and open PR → merge to `main`.

---

### PR 2 — App-Level Common Components
**Branch:** `feat/common-components`

Build all wrapper components under `src/common/components/`. These are the ONLY components pages should use — never import shadcn primitives directly in pages.

Add shadcn components needed:
```bash
npx shadcn@latest add button input label select dialog badge toast
```

**`AppButton.tsx`** — wraps shadcn Button with consistent variants:
```tsx
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface AppButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
}

const variantMap = {
  primary: 'bg-primary hover:bg-primary-hover text-white',
  secondary: 'bg-white border border-border text-gray-700 hover:bg-gray-50',
  ghost: 'bg-transparent text-primary hover:bg-blue-50',
  danger: 'bg-red-500 hover:bg-red-600 text-white',
};

const sizeMap = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-11 px-6 text-base',
};

export default function AppButton({
  variant = 'primary', size = 'md', loading, fullWidth, className, children, disabled, ...props
}: AppButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed',
        variantMap[variant], sizeMap[size],
        fullWidth && 'w-full', className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}
```

**`AppInput.tsx`** — wraps input with label and error state:
```tsx
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface AppInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const AppInput = forwardRef<HTMLInputElement, AppInputProps>(
  ({ label, error, hint, className, ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <input
        ref={ref}
        className={cn(
          'h-10 w-full rounded-lg border border-border bg-white px-3 text-sm text-gray-900 placeholder:text-gray-400',
          'focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary',
          'disabled:bg-gray-50 disabled:cursor-not-allowed',
          error && 'border-red-400 focus:ring-red-200',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
      {hint && !error && <p className="text-xs text-gray-400">{hint}</p>}
    </div>
  )
);
AppInput.displayName = 'AppInput';
export default AppInput;
```

**`AppSelect.tsx`** — wraps a native or custom select:
```tsx
import { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Option { value: string; label: string; }

interface AppSelectProps {
  label?: string;
  error?: string;
  placeholder?: string;
  options: Option[];
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export default function AppSelect({ label, error, placeholder = 'Choose from Drop-down', options, value, onChange, disabled, className }: AppSelectProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <div className="relative">
        <select
          value={value || ''}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled}
          className={cn(
            'h-10 w-full appearance-none rounded-lg border border-border bg-white px-3 pr-10 text-sm',
            'focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary',
            !value && 'text-gray-400',
            value && 'text-gray-900',
            error && 'border-red-400',
            className
          )}
        >
          <option value="" disabled>{placeholder}</option>
          {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
```

**`AppMultiSelect.tsx`** — custom multi-select combobox (no shadcn equivalent):
```tsx
import { useState, useRef, useEffect } from 'react';
import { ChevronDown, X, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Option { value: string; label: string; }

interface AppMultiSelectProps {
  label?: string;
  error?: string;
  placeholder?: string;
  options: Option[];
  value: string[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
}

export default function AppMultiSelect({ label, error, placeholder = 'Choose from Drop-down', options, value, onChange, disabled }: AppMultiSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const toggle = (v: string) => {
    onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v]);
  };

  const selected = options.filter((o) => value.includes(o.value));

  return (
    <div className="flex flex-col gap-1.5" ref={ref}>
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <div
        className={cn(
          'min-h-10 w-full rounded-lg border border-border bg-white px-3 py-2 cursor-pointer',
          'focus-within:ring-2 focus-within:ring-primary/40 focus-within:border-primary',
          error && 'border-red-400',
          disabled && 'bg-gray-50 cursor-not-allowed opacity-60'
        )}
        onClick={() => !disabled && setOpen((o) => !o)}
      >
        <div className="flex flex-wrap gap-1.5 items-center">
          {selected.length === 0 && <span className="text-sm text-gray-400">{placeholder}</span>}
          {selected.map((o) => (
            <span key={o.value} className="flex items-center gap-1 bg-blue-50 text-primary text-xs font-medium px-2 py-0.5 rounded-md">
              {o.label}
              <X className="h-3 w-3 cursor-pointer hover:text-red-500" onClick={(e) => { e.stopPropagation(); toggle(o.value); }} />
            </span>
          ))}
          <ChevronDown className={cn('h-4 w-4 text-gray-400 ml-auto transition-transform', open && 'rotate-180')} />
        </div>
      </div>
      {open && (
        <div className="relative z-50">
          <ul className="absolute top-1 w-full rounded-lg border border-border bg-white shadow-lg py-1 max-h-48 overflow-y-auto">
            {options.length === 0 && <li className="px-3 py-2 text-sm text-gray-400">No options</li>}
            {options.map((o) => (
              <li key={o.value} className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-blue-50 cursor-pointer"
                onClick={() => toggle(o.value)}>
                <div className={cn('h-4 w-4 rounded border flex items-center justify-center', value.includes(o.value) ? 'bg-primary border-primary' : 'border-gray-300')}>
                  {value.includes(o.value) && <Check className="h-3 w-3 text-white" />}
                </div>
                {o.label}
              </li>
            ))}
          </ul>
        </div>
      )}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
```

**`AppModal.tsx`** — wraps shadcn Dialog:
```tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface AppModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export default function AppModal({ open, onClose, title, children, maxWidth = 'max-w-2xl' }: AppModalProps) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className={`${maxWidth} p-0`}>
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border">
          <DialogTitle className="text-base font-semibold text-gray-900">{title}</DialogTitle>
        </DialogHeader>
        <div className="px-6 py-4">{children}</div>
      </DialogContent>
    </Dialog>
  );
}
```

**`AppBadge.tsx`**:
```tsx
import { cn } from '@/lib/utils';

interface AppBadgeProps { label: string; variant?: 'success' | 'warning' | 'danger' | 'info' | 'default'; className?: string; }

const variants = {
  success: 'bg-green-50 text-green-700 border-green-200',
  warning: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  danger: 'bg-red-50 text-red-600 border-red-200',
  info: 'bg-blue-50 text-primary border-blue-200',
  default: 'bg-gray-100 text-gray-600 border-gray-200',
};

export default function AppBadge({ label, variant = 'default', className }: AppBadgeProps) {
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border', variants[variant], className)}>
      {label}
    </span>
  );
}
```

**`src/common/layouts/DashboardLayout.tsx`** — sidebar + main content, mobile responsive:

Build a layout with:
- Left sidebar (fixed, 160px desktop / full overlay on mobile)
- PrepRoute logo at top of sidebar
- Nav items: Dashboard, Test Creation, Test Tracking (with Lucide icons)
- Active state: `bg-blue-50 text-primary border-l-2 border-primary`
- Top header: breadcrumb (left) + notification bell + user avatar + name + dropdown (right)
- Mobile: hamburger button top-left, sidebar slides in as overlay
- Main content area scrollable

**`src/common/layouts/AuthLayout.tsx`**:
```tsx
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface flex">
      <div className="hidden md:flex w-1/2 items-center justify-center bg-surface">
        {/* Placeholder illustration area */}
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
```

After building all components, commit: `feat: app-level common components`
Push and open PR → merge to `main`.

---

### PR 3 — Login Page
**Branch:** `feat/page-login`

**File:** `src/pages/Login/LoginPage.tsx`

Zod schema:
```ts
const schema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  password: z.string().min(1, 'Password is required'),
});
```

UI from Figma (image 1):
- Use `AuthLayout`
- PrepRoute logo (text logo styled with Inter 700, primary color)
- "Login" heading (24px, 700)
- Subtitle: "Use your company provided Login credentials" (gray-400, 14px)
- `AppInput` for User ID and Password (password type with show/hide toggle)
- "Forgot password?" link (primary color, right-aligned)
- `AppButton` fullWidth primary "Login"
- Error toast on failed login
- On success: store token via `useAuthStore.setAuth()`, navigate to `DASHBOARD_PAGE_URL`

API call:
```ts
const res = await apiClient.post(authEndpoints.login, { userId, password });
// res.data.data.token
```

Commit: `feat: login page with auth integration`

---

### PR 4 — Dashboard Page
**Branch:** `feat/page-dashboard`

**File:** `src/pages/Dashboard/DashboardPage.tsx`

Use `DashboardLayout`.

Features:
- Page title: "Test Creation" or "All Tests"
- "Create New Test" button (primary, top right)
- Table/card list of all tests fetched from `GET /tests`
- Columns: Test Name, Subject, Topics (badges), Status (AppBadge: draft=warning, live=success), Created Date, Actions
- Actions per row: Edit button (navigates to `EDIT_TEST_PAGE_URL(id)`), Delete button (confirms then calls `DELETE /tests/:id`), View button (navigates to `PREVIEW_PUBLISH_PAGE_URL(id)`)
- Empty state: illustration + "No tests yet. Create your first test."
- Loading skeleton while fetching
- Mobile: card layout instead of table (switch at `md` breakpoint)

Commit: `feat: dashboard page with test list`

---

### PR 5 — Create/Edit Test Page
**Branch:** `feat/page-create-test`

**File:** `src/pages/CreateTest/CreateTestPage.tsx`

This page is used for both create and edit (detect via `useParams().id`).

Layout: `DashboardLayout` with breadcrumb `Test Creation / Create Test / Chapter Wise`

Tabs at top (test type selector): `Chapterwise | PYQ | Mock Test` — styled as pill tabs, `Chapterwise` active by default. Store selected type in form state.

Form fields (two-column grid on desktop, single column on mobile):

Left column:
- Subject — `AppSelect` fetched from `GET /subjects`
- Topic — `AppMultiSelect` fetched from `GET /topics/subject/:subjectId` (disabled until subject selected)
- Duration (Minutes) — `AppInput` type number
- Marking Scheme section with label:
  - Wrong Answer — number spinner (AppInput + up/down, default -1)
  - Unattempted — number spinner (default +0)
  - Correct Answer — number spinner (default +5)

Right column:
- Name of Test — `AppInput`
- Sub Topic — `AppMultiSelect` fetched from `POST /sub-topics/multi-topics` with topicIds (disabled until topics selected)
- Test Difficulty Level — radio group: Easy | Medium | Difficult (styled as per Figma image 2)
- No of Questions — `AppInput` type number
- Total Marks — `AppInput` type number (read-only, auto-calculated as `noOfQuestions × correct_marks`)

Bottom row: Cancel button (secondary) | Next button (primary)

Zod validation:
```ts
const schema = z.object({
  name: z.string().min(1, 'Test name is required'),
  subject: z.string().min(1, 'Subject is required'),
  topics: z.array(z.string()).min(1, 'Select at least one topic'),
  sub_topics: z.array(z.string()).optional(),
  type: z.string().min(1),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  total_time: z.number().min(1),
  total_questions: z.number().min(1),
  correct_marks: z.number(),
  wrong_marks: z.number(),
  unattempt_marks: z.number(),
  total_marks: z.number(),
});
```

On submit (Next):
- If creating: `POST /tests` → store result in `useTestStore`, navigate to `ADD_QUESTIONS_PAGE_URL(id)`
- If editing: `PUT /tests/:id` → navigate to `ADD_QUESTIONS_PAGE_URL(id)`

Also include Edit modal (image 4): same form fields inside `AppModal` titled "Edit Test creation" with Save button.

Commit: `feat: create/edit test page with form validation`

---

### PR 6 — Add Questions Page
**Branch:** `feat/page-add-questions`

**File:** `src/pages/AddQuestions/AddQuestionsPage.tsx`

Layout matches image 3:
- Left sidebar panel (within the page, not the app sidebar): Question list with "Question creation" header, "Total Questions: N", list of questions (Question 1, Question 2…), each clickable to jump
- Main area: Test details card at top (Chapter Wise tag, subject, topics as badges, sub-topics as badges, 60 Min / 50 Qs / 250 Marks)
- "Question N / 50" header with `+ MCQ` and `↓ CSV` buttons
- Delete All Edits button (red text)
- Rich question form:
  - Question text area (with basic formatting toolbar: B I U link list etc — you can use a simple contenteditable div or textarea; keep it simple)
  - 4 option inputs with radio select for correct answer (radio circles on left, trash icon on right)
  - Add Solution textarea
  - Navigation arrows (prev/next question)
  - Question Settings section:
    - Level of Difficulty — `AppSelect`
    - Topic — `AppSelect` (from test's topics)
    - Sub-topic — `AppSelect` (from test's sub-topics)

Bottom: `Exit Test Creation` button (danger/outline) | `Next` button (primary)

State management:
- Local array of questions `Question[]`
- On add: push to array, increment counter
- On Next/Save: call `POST /questions/bulk` with all questions, then `PUT /tests/:id` to update total_questions & questions array, then navigate to `PREVIEW_PUBLISH_PAGE_URL(id)`

Validation: minimum 1 question, all 4 options filled, correct option selected.

Commit: `feat: add questions page`

---

### PR 7 — Preview & Publish Page
**Branch:** `feat/page-preview-publish`

**File:** `src/pages/PreviewPublish/PreviewPublishPage.tsx`

Layout matches image 5:
- Left panel: same question sidebar (all questions listed)
- Main area:
  - "Test creation" breadcrumb header
  - "Test created" status with "All 50 Questions done" green badge
  - Test details card: Chapter Wise tag, Chapter 1, Easy badge, Subject, Topic badges, Sub Topic badge, 60 Min / 50 Q's / 250 Marks
  - Edit pencil icon (top right of card) → opens `AppModal` with Edit Test form
  - Publish section below card:
    - Two tabs: `Publish Now | Schedule Publish`
    - Live Until section (radio options): Always Available, 1 Week, 2 Weeks, 3 Weeks, 1 Month, Custom Duration
    - If Custom Duration: date picker + time picker inputs
  - Bottom: Cancel button | Confirm/Publish button

On Publish:
- Call `PUT /tests/:id` with `{ status: 'live' }`
- Show success toast: "Test published successfully!"
- Navigate to `DASHBOARD_PAGE_URL`

Fetch questions using `POST /questions/fetchBulk` with question IDs from the test.

Commit: `feat: preview and publish page`

---

### PR 8 — Mobile Responsiveness & Polish
**Branch:** `feat/responsive-polish`

Go through every page and ensure:
- All layouts stack properly on mobile (320px+)
- `DashboardLayout` sidebar becomes hamburger overlay on mobile
- Tables become card lists on mobile
- Multi-select dropdowns are touch-friendly (min 44px tap targets)
- Font sizes readable on small screens
- No horizontal overflow anywhere
- Add `loading` and `error` states to all API calls
- Add `AppSpinner` overlays on async operations
- Add empty states with helpful messages
- Test all flows: Login → Dashboard → Create Test → Add Questions → Preview → Publish

Commit: `feat: mobile responsiveness and UX polish`

---

## 🔧 Key Implementation Notes for Cursor

1. **Never import shadcn components directly in page files.** Always go through the `src/common/components/App*.tsx` wrappers.

2. **All API endpoints must be imported from `src/api/endpoints.ts`** — never hardcode paths.

3. **All route strings must be imported from `src/constants/routes.ts`** — never hardcode `/login` etc.

4. **Inter font only** — remove any Google Fonts `<link>` tags for other fonts, ensure `@fontsource/inter` is the only font package.

5. **Zustand stores for cross-page state** (currentTest, questions). Local component state for UI-only state.

6. **React Hook Form + Zod** on every form — no uncontrolled form submissions.

7. **Axios instance from `src/api/axios.ts`** — never call `axios.create()` elsewhere.

8. **Total Marks is calculated**: `total_questions × correct_marks`, display as read-only.

9. **AppMultiSelect** is used for Topics and Sub-Topics everywhere (dashboard filter, create test page, question settings).

10. **Status badge mapping**: `null/draft` → warning badge "Draft", `live` → success badge "Live".

---

## 🚀 Git Workflow

```bash
# Each PR follows this pattern:
git checkout main && git pull
git checkout -b feat/<branch-name>
# ... build the feature ...
git add . && git commit -m "feat: <description>"
git push origin feat/<branch-name>
# Open PR on GitHub → merge to main
git checkout main && git pull
```

PRs to create in order:
1. `feat/project-scaffold`
2. `feat/common-components`
3. `feat/page-login`
4. `feat/page-dashboard`
5. `feat/page-create-test`
6. `feat/page-add-questions`
7. `feat/page-preview-publish`
8. `feat/responsive-polish`

---

## ✅ Definition of Done per PR

- TypeScript: zero `any` types (use `unknown` + type guards if needed)
- No ESLint errors
- All API calls have loading + error states
- Mobile responsive (tested at 375px, 768px, 1280px)
- Forms validate before submit
- Navigation flows work end-to-end
