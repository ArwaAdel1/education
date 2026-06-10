 
# Teacher AI Academy

A single-teacher, multi-tenant Learning Management System (LMS) built for Egyptian educators. Each teacher gets their own branded academy with AI-powered quiz generation, a RAG-based AI tutor, chapter-level payments via Paymob, and full bilingual support (Arabic RTL / English LTR).

> **Note:** This is the frontend scaffold — all pages use mock data. Backend integration happens feature-by-feature after the scaffold is complete.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 |
| Build Tool | Vite |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS v3 + CSS custom properties |
| Client State | Zustand |
| Server State | TanStack Query (React Query) |
| Routing | React Router v6 (data router) |
| HTTP Client | Axios |
| Forms | React Hook Form + Zod |
| i18n | i18next + react-i18next |
| Icons | Lucide React |
| Font | Cairo (Google Fonts) |

---

## Getting Started

```bash
git clone <repo-url>
cd Front-End
npm install
cp .env.example .env
npm run dev
```

The app opens at `http://localhost:5173/` with Arabic RTL layout by default.

---

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_APP_NAME` | App display name | Teacher AI Academy |
| `VITE_API_BASE_URL` | Backend API base URL | http://localhost:3000/api |
| `VITE_DEFAULT_LOCALE` | Default language | ar |
| `VITE_TENANT_RESOLUTION_MODE` | How to resolve tenant | subdomain |

---

## Complete File Reference

Below is every file in the project with a description of what it does and what it should contain.

---

### Root Config Files

```
.env.example          → Template for environment variables. Copy to .env for local dev.
.env                  → Local environment variables (git-ignored).
.gitignore            → Files/folders excluded from git (node_modules, dist, .env).
tailwind.config.ts    → Tailwind CSS configuration: custom colors (primary, accent, etc.),
                         border radii (card: 14px, button: 12px, input: 10px),
                         and Cairo font family.
tsconfig.json         → Root TypeScript config. Sets strict mode and path alias @/* → src/*.
tsconfig.app.json     → App-specific TS config that extends tsconfig.json.
vite.config.ts        → Vite config: React plugin, Tailwind plugin, and @ path alias.
package.json          → Project metadata, scripts (dev, build, preview), all dependencies.
README.md             → This file.
index.html            → HTML entry point. Sets <html lang="ar" dir="rtl"> for Arabic-first.
```

---

### `src/main.tsx`
**The entry point.** Renders `<App />` inside `<React.StrictMode>` and imports global styles.

---

### `src/styles/` — Global Styles

```
globals.css    → Three things:
                 1. Tailwind directives (@import "tailwindcss")
                 2. Cairo font import from Google Fonts
                 3. Base body styles (font-family, background color, text color)

tokens.css     → CSS custom properties (variables) for all design tokens:
                 --color-primary: #1A103D
                 --color-accent: #00C9DB
                 --radius-card: 14px
                 ... etc.
                 Also includes --tenant-* variables that get overridden
                 by JavaScript when a tenant theme is applied.
```

---

### `src/types/` — TypeScript Type Definitions

Every type used across the app is defined here. No logic, no imports from React — pure TypeScript interfaces and enums.

```
user.ts        → User interface (id, email, name, role, tenantId, avatarUrl, createdAt)
                 UserRole type: 'student' | 'teacher' | 'support_agent' | 'super_admin'

tenant.ts      → Tenant interface (id, name, slug, teacherName, subject, bio, logoUrl,
                 teacherPhotoUrl, brandColors, subscriptionStatus)
                 BrandColors interface (primary, secondary, accent)
                 SubscriptionStatus type: 'active' | 'trial' | 'expired' | 'suspended'

content.ts     → Stage interface (id, tenantId, name, description, order)
                 — A stage = a school year level like "الصف الثاني الثانوي"
                 Chapter interface (id, tenantId, stageId, name, price, order, isUnlocked)
                 — A chapter = a purchasable unit like "الباب الثالث: الأحماض والقواعد"
                 Lesson interface (id, tenantId, chapterId, title, duration, youtubeUrl,
                 order, attachments[], progress?)
                 — A lesson = a single video with PDFs attached
                 LessonAttachment interface (id, fileName, fileSize, url)
                 LessonProgress interface (lessonId, studentId, percentWatched, completed)

enrollment.ts  → Enrollment interface (id, studentId, chapterId, tenantId, method, purchasedAt)
                 — Tracks which student bought which chapter
                 EnrollmentMethod type: 'paymob' | 'promo_code'

quiz.ts        → Quiz interface (id, tenantId, chapterId, title, status, questions[], createdAt)
                 QuizQuestion interface (id, type, question, options?, correctAnswer?, explanation?)
                 QuizAttempt interface (id, quizId, studentId, answers, score?, submittedAt)
                 QuizStatus: 'draft' | 'published' | 'archived'
                 QuestionType: 'mcq' | 'true_false' | 'essay'

payment.ts     → Payment interface (id, studentId, chapterId, amount, currency, status,
                 paymobTransactionId?)
                 — Tracks Paymob payment transactions
                 PromoCode interface (id, tenantId, code, used, usedByStudentId?,
                 redeemedChapterId?, generatedBy, createdAt)
                 PaymentStatus: 'pending' | 'success' | 'failed'

aiTutor.ts     → AiTutorMessage interface (id, role, content, sources?, createdAt)
                 — A single message in the AI tutor chat
                 AiTutorSource interface (lessonId, lessonTitle, chapterName)
                 — Citation: which lesson the AI's answer came from (RAG source)

api.ts         → ApiResponse<T> — generic wrapper: { data: T, message? }
                 PaginatedResponse<T> — paginated: { data: T[], total, page, limit }
                 ApiError — error shape: { statusCode, message, errors? }
                 These are used to type all API responses consistently.

index.ts       → Barrel file: re-exports everything from all type files.
                 So you can write: import { User, Tenant, Quiz } from '@/types'
```

---

### `src/store/` — Zustand State Stores

Zustand stores hold client-side state that multiple components need access to. Each store is a single function with state + actions.

```
authStore.ts   → Holds the current logged-in user.
                 State: user (User | null), token (string | null), isAuthenticated (boolean)
                 Actions:
                   login(user, token) — saves user + token to state and localStorage
                   logout() — clears everything, removes token from localStorage
                   loginAsStudent() — creates a fake student user (يوسف أحمد) for dev testing
                   loginAsTeacher() — creates a fake teacher user (أ. أحمد محمد)
                   loginAsSupportAgent() — creates a fake support user (نادية حسن)
                   loginAsSuperAdmin() — creates a fake admin user (المدير العام)
                 The mock login functions exist so you can test all 4 roles
                 without needing a real backend.

tenantStore.ts → Holds the current tenant (academy) context.
                 State: currentTenant (Tenant | null)
                 Actions:
                   setTenant(tenant) — stores the tenant object
                   clearTenant() — resets to null
                   applyTenantTheme() — reads currentTenant.brandColors and sets
                     CSS variables on <html>: --tenant-primary, --tenant-secondary,
                     --tenant-accent. This makes the entire UI rebrand dynamically.

uiStore.ts     → Holds UI preferences.
                 State: sidebarOpen (boolean), language ('ar'|'en'), direction ('rtl'|'ltr')
                 Actions:
                   toggleSidebar() — flips sidebarOpen
                   setSidebarOpen(open) — sets directly
                   setLanguage(lang) — updates language + direction in state,
                     sets document.documentElement.lang and dir attributes,
                     and calls i18n.changeLanguage(lang)

toastStore.ts  → Manages toast notification queue.
                 State: toasts (array of { id, type, message, duration })
                 Actions:
                   addToast({ type, message }) — generates random id, pushes to array,
                     auto-removes after duration (default 4 seconds)
                   removeToast(id) — removes specific toast
                 Usage from anywhere: toastStore.getState().addToast({
                   type: 'success', message: 'تم بنجاح'
                 })
```

---

### `src/hooks/` — Custom React Hooks

Thin wrappers around stores and browser APIs. They make components cleaner.

```
useAuth.ts       → Reads from authStore.
                   Returns: { user, token, isAuthenticated, role, login, logout }
                   'role' is a shorthand for user?.role so you don't repeat it everywhere.

useTenant.ts     → Reads from tenantStore.
                   Returns: { tenant, setTenant, applyTheme }

useDirection.ts  → Reads 'direction' from uiStore.
                   Returns: 'rtl' | 'ltr'
                   Useful for conditional styling (e.g., flip an icon in RTL).

useMediaQuery.ts → Takes a CSS media query string like '(min-width: 768px)'.
                   Returns: boolean (true if matches).
                   Uses window.matchMedia internally with a useEffect listener.
                   Useful for showing/hiding mobile bottom tabs vs desktop sidebar.
```

---

### `src/lib/api/` — HTTP Client & API Layer

```
client.ts      → Creates and exports a configured Axios instance (apiClient).
                 Base URL comes from VITE_API_BASE_URL environment variable.
                 Request interceptor:
                   - Reads token from localStorage → adds Authorization: Bearer header
                   - Reads tenant from tenantStore → adds X-Tenant-ID header
                 Response interceptor:
                   - On 401 error → calls authStore.logout() + redirects to /auth
                   - On other errors → rejects the promise with structured error
                 Every API call in the app goes through this client.

endpoints/     → One file per feature domain. Each exports an object with
                 async functions. Currently they are all TODO stubs.
                 When you connect the backend, you replace the stub with
                 a real apiClient.get/post/put/delete call.

  auth.ts      → login(email, password), register(data), forgotPassword(email),
                 resetPassword(token, password)
                 Later: these will call POST /api/auth/login, etc.

  content.ts   → getStages(), getChapters(stageId), getLessons(chapterId),
                 getLesson(lessonId), createLesson(data), updateLesson(id, data),
                 deleteLesson(id)
                 Later: these will call GET /api/content/stages, etc.

  enrollment.ts → getMyEnrollments(), checkChapterAccess(chapterId),
                  enrollWithPromoCode(chapterId, code)
                  Later: GET /api/enrollments/me, POST /api/enrollments, etc.

  quiz.ts      → generateQuiz(params), getQuiz(quizId), updateQuiz(quizId, data),
                 publishQuiz(quizId), submitAttempt(quizId, answers), getResults(quizId)
                 Later: POST /api/quizzes/generate (calls Gemini AI on backend)

  aiTutor.ts   → sendMessage(message), getHistory(), getRemainingQuestions()
                 Later: POST /api/ai-tutor/ask (RAG pipeline on backend)

  payment.ts   → createSession(chapterId), verify(transactionId)
                 Later: integrates with Paymob payment gateway via backend

  support.ts   → generatePromoCode(tenantId), getPromoCodes(tenantId),
                 lookupStudent(query)

  index.ts     → Barrel export: export { authApi } from './auth'; etc.
```

---

### `src/lib/auth/` — Token Helpers

```
token.ts       → Three simple functions for localStorage token management:
                 getToken() — returns the JWT string or null
                 setToken(token) — saves to localStorage key 'auth-token'
                 removeToken() — deletes from localStorage
                 Used by authStore and the axios interceptor.
```

---

### `src/lib/tenant/` — Tenant Resolution

```
resolver.ts    → resolveTenantSlug() function.
                 Tries two strategies to figure out which teacher's academy to load:
                 1. Subdomain: if URL is "mr-ahmed.platform.com", returns "mr-ahmed"
                 2. URL path: if URL contains "/t/mr-ahmed-chemistry", returns that slug
                 Returns null if neither works.
                 Used by TenantGuard to auto-resolve the tenant on page load.
```

---

### `src/lib/i18n/` — Internationalization

```
index.ts       → Initializes i18next:
                 - Default language: 'ar'
                 - Fallback: 'en'
                 - Registers 5 namespaces: common, auth, student, teacher, landing
                 - Imports and registers all JSON translation files
                 - Enables browser language detection

ar/            → Arabic translations (Egyptian dialect for UI copy):
  common.json  → Navigation labels (الرئيسية, لوحة التحكم, الدورات...),
                 action buttons (حفظ, إلغاء, حذف, تعديل, بحث...),
                 status labels (جاري التحميل, حدث خطأ, لا توجد بيانات...),
                 language names (العربية, English)

  auth.json    → Login/register copy: تسجيل الدخول, البريد الإلكتروني,
                 كلمة المرور, نسيت كلمة المرور?, dev login labels
                 (ادخل كطالب, ادخل كمعلم, etc.)

  student.json → Student UI copy: دوراتي, كل المحتوى, التقدم, مقفول, متاح,
                 اشترك, AI tutor labels (اكتب سؤالك هنا, أسئلة متبقية),
                 payment labels (الدفع بالبطاقة, عندي كود خصم)

  teacher.json → Teacher UI copy: stat card labels (إجمالي الطلاب, نشطين هذا الشهر),
                 quick actions (أضف درس, أنشئ اختبار), content manager labels,
                 quiz generator steps (إعدادات, مراجعة, نشر), branding labels

  landing.json → Landing page copy: hero headline (أكاديميتك الخاصة... جاهزة في دقائق),
                 subheadline, CTA text (سجّل الآن), 3 feature card titles + descriptions

en/            → English translations — same structure and keys as ar/, translated to English.
  common.json  → "Home", "Dashboard", "Courses", "Save", "Cancel", "Loading...", etc.
  auth.json    → "Sign In", "Email", "Password", "Forgot Password?", etc.
  student.json → "My Courses", "All Content", "Progress", "Locked", "Subscribe", etc.
  teacher.json → "Total Students", "Active This Month", "Add Lesson", etc.
  landing.json → "Your own academy... ready in minutes", etc.
```

---

### `src/lib/utils/` — Utility Functions

```
cn.ts              → className merge utility. Combines clsx (conditional classes)
                     with tailwind-merge (resolves Tailwind conflicts).
                     Usage: cn('p-4 text-red', isActive && 'bg-blue', className)
                     Used in every UI component.

formatCurrency.ts  → formatEGP(amount, locale?) — formats a number as Egyptian Pounds.
                     Example: formatEGP(150) → "١٥٠ ج.م." (in Arabic)
                     Example: formatEGP(150, 'en-EG') → "EGP 150"
                     Used in payment pages and chapter price badges.

formatDate.ts      → formatDate(dateString, locale?) — formats ISO date to readable text.
                     Example: formatDate('2025-03-15') → "١٥ مارس ٢٠٢٥" (in Arabic)
                     Used in tables, enrollment dates, activity timestamps.
```

---

### `src/app/` — App Entry & Configuration

```
App.tsx            → Root component. Wraps everything:
                     <AppProviders>        ← TanStack Query provider
                       <RouterProvider />  ← All routes
                       <Toast />          ← Global toast notifications
                     </AppProviders>

router.tsx         → Defines ALL routes using createBrowserRouter.
                     Structure:
                     - Public routes → PublicLayout → LandingPage, AuthPage, etc.
                     - Auth-protected routes → AuthGuard → RoleGuard → Layout → Pages
                     - Each role group has its own RoleGuard + Layout
                     - Catch-all * → NotFoundPage
                     (Full route table is in the Routing Map section below)

providers/
  AppProviders.tsx → Wraps children with QueryClientProvider from TanStack Query.
                     Also imports the i18n setup (side effect import).
                     If you add more providers later (theme, context), nest them here.

config/
  queryClient.ts   → Creates and exports a QueryClient instance with defaults:
                     staleTime: 5 minutes (data stays fresh for 5 min)
                     retry: 1 (retry failed requests once)
                     refetchOnWindowFocus: false (don't refetch when user tabs back)
                     These are sensible defaults for an LMS.
```

---

### `src/components/ui/` — UI Design System

Every component here is reusable and feature-agnostic. They receive data via props, never import from stores or mocks directly.

```
Button.tsx         → Clickable button with 5 variants:
                     - primary (cyan bg, white text — for CTAs)
                     - secondary (dark purple bg)
                     - outline (border only)
                     - ghost (transparent, hover shows bg)
                     - danger (red bg — for delete actions)
                     Props: variant, size (sm/md/lg), loading (shows Spinner),
                     disabled, children, plus all native <button> props.
                     Height: min 44px. Border radius: 12px.

Card.tsx           → White container with shadow.
                     Props: children, className, padding (none/sm/md/lg).
                     Background: white. Shadow: shadow-sm. Border radius: 14px.
                     Used everywhere: dashboards, forms, content panels.

Input.tsx          → Form text input with label and error display.
                     Props: label (shown above), error (red text below),
                     helperText (gray text below), plus native <input> props.
                     Height: 48px. Border radius: 10px. Font: Cairo.
                     Error state: red border + red error message.

Badge.tsx          → Small colored pill for statuses.
                     Props: variant (success/danger/warning/info/default), children.
                     Examples: "متاح" (green), "مقفول" (red), "مستخدم" (gray).

Tabs.tsx           → Horizontal tab bar with underline style.
                     Props: tabs (array of {key, label}), activeTab, onTabChange.
                     Active tab: accent-colored bottom border.
                     Used in StudentDashboard (My Courses / All Content).

Table.tsx          → Generic data table.
                     Props: columns (array of {key, header, render?}), data, emptyMessage.
                     Renders a <table> with header row. If data is empty, shows EmptyState.
                     Used in: PromoCodesPage, StudentEngagementPage, TenantsPage.

Avatar.tsx         → User profile picture circle.
                     Props: src (image URL), name (fallback), size (sm/md/lg).
                     If no image: shows first letter of name on colored background.
                     Sizes: 32px / 40px / 56px.

Progress.tsx       → Horizontal progress bar.
                     Props: value (0-100), size (sm/md), showLabel.
                     Background: gray. Fill: accent cyan. Used in chapter cards.

EmptyState.tsx     → Centered placeholder for empty views.
                     Props: icon (Lucide icon), title, description, action (button).
                     Shows: large gray icon, title text, optional button.
                     Used when tables are empty or no content is selected.

StatCard.tsx       → Dashboard metric card.
                     Props: title, value (big number), icon (Lucide icon).
                     Uses Card component. Icon in accent color, large bold value,
                     smaller title text underneath.
                     Used in: TeacherDashboardPage (4 stat cards in grid).

Modal.tsx          → Overlay dialog popup.
                     Props: isOpen, onClose, title, children, size (sm/md/lg).
                     Dark semi-transparent overlay + centered white Card.
                     Close on X button click or overlay click.

Toast.tsx          → Renders active toasts from toastStore.
                     Positioned: fixed, top center of screen.
                     Each toast: small Card with colored left border
                     (green=success, red=error, yellow=warning, purple=info),
                     message text, and X close button. Auto-disappears.

Skeleton.tsx       → Loading placeholder shape.
                     Props: className (to set width/height).
                     Renders: gray rectangle with animate-pulse animation.
                     Used while data is loading to prevent layout shift.

Spinner.tsx        → Spinning circle loader.
                     Props: size (sm/md/lg).
                     CSS animation: animate-spin. Color: accent.
                     Used inside Button (loading state) and loading screens.

ConfirmDialog.tsx  → "Are you sure?" dialog.
                     Props: isOpen, onConfirm, onCancel, title, message,
                     confirmLabel, variant (danger/primary).
                     Uses Modal internally. Two buttons: cancel (outline) + confirm.
                     Used before destructive actions (delete lesson, etc.).

index.ts           → Barrel export file. Re-exports everything so you can write:
                     import { Button, Card, Input, Badge } from '@/components/ui'
```

---

### `src/components/layout/` — Page Layout Shells

Layouts wrap pages and provide the consistent navigation structure. Each layout renders `<Outlet />` where the page content goes.

```
Topbar.tsx         → Horizontal top navigation bar (64px height, white bg).
                     Left side: app name or tenant logo
                     Right side: LanguageSwitcher + user Avatar + name + logout Button
                     On mobile: adds a hamburger menu icon (☰) that calls
                     uiStore.toggleSidebar() to open the sidebar overlay.

Sidebar.tsx        → Vertical navigation panel.
                     Props: items (array of { label, icon, path }).
                     Each item is a NavLink from react-router.
                     Active item: accent background tint + accent text color.
                     Desktop: fixed side panel, 260px wide, always visible.
                     Mobile: slides in as overlay when uiStore.sidebarOpen is true.
                     Clicking outside or on a link closes it.

PublicLayout.tsx   → For unauthenticated pages (landing, login, forgot password).
                     Structure: Topbar (no user info) + centered content area
                     (max-width 1200px, padded). Renders <Outlet />.

StudentLayout.tsx  → For student pages. Mobile-first design.
                     Mobile: Topbar + scrollable content + fixed bottom tab bar
                       (4 tabs: Dashboard, Courses, AI Tutor, Profile — icons + labels)
                     Desktop (md+): Topbar + Sidebar (right side in RTL) + content area
                     Uses useMediaQuery to decide which nav to show.
                     Renders <Outlet />.

TeacherLayout.tsx  → For teacher pages. Desktop-first design.
                     Structure: persistent left Sidebar + Topbar + main content area.
                     Sidebar items: Dashboard, Content, Quizzes, Students, Branding, Settings.
                     On small screens: sidebar collapses behind hamburger.
                     Renders <Outlet />.

SupportLayout.tsx  → Same structure as TeacherLayout.
                     Sidebar items: Promo Codes, Student Lookup.
                     Renders <Outlet />.

AdminLayout.tsx    → Same structure as TeacherLayout.
                     Sidebar items: Tenants.
                     Renders <Outlet />.
```

---

### `src/components/guards/` — Route Protection

Guards sit between the router and the page. They check conditions and either render `<Outlet />` (pass through) or `<Navigate />` (redirect).

```
AuthGuard.tsx      → Checks: is the user logged in?
                     Reads isAuthenticated from authStore.
                     If false → <Navigate to="/auth" />
                     If true → <Outlet /> (renders the child route)
                     Wraps ALL protected route groups in the router.

RoleGuard.tsx      → Checks: does the user have the right role?
                     Props: allowedRoles (e.g., ['student'])
                     Reads user.role from authStore.
                     If role NOT in allowedRoles → redirects to user's own dashboard:
                       student → /student/dashboard
                       teacher → /teacher/dashboard
                       support_agent → /support/promo-codes
                       super_admin → /admin/tenants
                     If role matches → <Outlet />
                     Prevents students from accessing teacher pages, etc.

TenantGuard.tsx    → Checks: is a tenant loaded?
                     Reads currentTenant from tenantStore.
                     If no tenant → tries resolveTenantSlug() from the URL.
                     If still no tenant → loads mockTenant (for development).
                     Calls applyTenantTheme() to set CSS variables.
                     Renders <Outlet />.

ErrorBoundary.tsx  → Catches JavaScript errors in child components.
                     Must be a class component (React requirement for error boundaries).
                     If an error occurs:
                       Shows a friendly error Card with ⚠️ icon,
                       "حدث خطأ غير متوقع" message,
                       and a "حاول مرة أخرى" (Try Again) button that resets the state.
                     Without this, a single component crash would break the entire app.
```

---

### `src/components/common/` — Shared Components

```
LanguageSwitcher.tsx → A button that toggles between Arabic and English.
                      If current language is Arabic → shows "English" button
                      If current language is English → shows "العربية" button
                      On click: calls uiStore.setLanguage() which updates:
                        1. Zustand state (language + direction)
                        2. <html lang="..." dir="..."> attributes
                        3. i18next active language
                      The entire UI re-renders in the new language and direction.
```

---

### `src/mocks/` — Development Mock Data

All mock data uses Egyptian education examples. These files are imported by placeholder pages during development and will be replaced by real API calls later.

```
tenant.ts      → mockTenant: أكاديمية الأستاذ أحمد للكيمياء
                 A chemistry teacher's academy. Slug: mr-ahmed-chemistry.
                 Brand colors: purple primary, cyan accent.
                 Subscription: active.

users.ts       → mockStudents: 5 students with Arabic names:
                 يوسف أحمد, مريم علي, عمر حسن, فاطمة محمود, محمد إبراهيم
                 Each has: id, email, name, role: 'student', tenantId.
                 Used in StudentEngagementPage table and quiz attempts.

content.ts     → mockStages: 1 stage — الصف الثاني الثانوي (2nd Year Secondary)
                 mockChapters: 3 chapters:
                   - الباب الثالث: الأحماض والقواعد (150 EGP, unlocked)
                   - الباب الرابع: الكيمياء الكهربية (150 EGP, unlocked)
                   - الباب الخامس: الكيمياء العضوية (200 EGP, LOCKED)
                 mockLessons: 3 lessons for chapter 1:
                   - مقدمة في الأحماض والقواعد (25 min, 75% watched)
                   - مقياس الرقم الهيدروجيني pH (35 min, 30% watched)
                   - تفاعلات التعادل (30 min, 0% watched)
                   Each has YouTube placeholder URL + PDF attachments.

quizzes.ts     → mockQuiz: اختبار الأحماض والقواعد
                 5 questions: 3 MCQ + 2 True/False, all in Arabic
                 about acids, bases, pH scale. Each has explanation.
                 Status: published.
                 mockQuizAttempt: يوسف scored 4 out of 5.

enrollment.ts  → mockEnrollments: 2 records — يوسف bought chapters 1 and 2
                 via Paymob. Used to determine which chapters show as "unlocked"
                 in the student dashboard.

promoCodes.ts  → mockPromoCodes: 3 codes:
                 - ABC12345 (used by يوسف)
                 - XYZ67890 (unused)
                 - QWE11223 (unused)
                 Used in PromoCodesPage table.

analytics.ts   → mockAnalytics: dashboard stats object:
                 totalStudents: 147, activeThisMonth: 89,
                 publishedChapters: 6, quizzesCreated: 12,
                 revenueThisMonth: 12450, completionRate: 68
                 Used in TeacherDashboardPage stat cards.
```

---

### `src/features/` — Feature Pages

Each feature folder has a `pages/` subfolder. Every page is a React functional component that renders meaningful placeholder UI using mock data and UI components.

#### `features/landing/pages/`

```
LandingPage.tsx      → The public homepage for a teacher's academy.
                       Shows: teacher name + subject + bio (from mockTenant),
                       hero section with large accent CTA button "سجّل الآن",
                       3 feature Cards (content management, AI quizzes, payments)
                       using translations from landing namespace.

NotFoundPage.tsx     → 404 error page.
                       Shows EmptyState: "٤٠٤ — الصفحة مش موجودة"
                       with a Button to go back to homepage.
```

#### `features/auth/pages/`

```
AuthPage.tsx         → Login and registration page.
                       Has Tabs: "تسجيل الدخول" / "إنشاء حساب"
                       Login tab: email Input + password Input + primary Button
                         + "نسيت كلمة المرور؟" link → /forgot-password
                       Register tab: name + email + password + confirm password
                       DEV TOOLBAR at bottom: Card with 4 ghost Buttons:
                         "ادخل كطالب" → loginAsStudent() + navigate to /student/dashboard
                         "ادخل كمعلم" → loginAsTeacher() + navigate to /teacher/dashboard
                         "ادخل كدعم فني" → loginAsSupportAgent() + navigate to /support/promo-codes
                         "ادخل كمدير" → loginAsSuperAdmin() + navigate to /admin/tenants

ForgotPasswordPage.tsx → Simple form: email Input + "ابعتلي رابط الاستعادة" Button.
                          Back link to /auth.
```

#### `features/student/pages/`

```
StudentDashboardPage.tsx → Main student page with 2 tabs:
                           "دوراتي" tab: Cards for enrolled chapters with Progress bars
                           "كل المحتوى" tab: all chapters, locked ones show price + "اشترك"

MyCoursesPage.tsx        → Grid of enrolled chapter Cards. Each shows: chapter name,
                           lesson count, Progress bar. Click → goes to lessons view.

AllContentPage.tsx       → Full content tree: Stage name → Chapter Cards.
                           Unlocked: clickable with progress.
                           Locked: price Badge + accent "اشترك" Button.

LessonPage.tsx           → Video lesson view.
                           Gray 16:9 rectangle placeholder (where YouTube embed will go),
                           lesson title + description + duration Badge,
                           attachments list (PDF icon + filename + download Button),
                           "الدرس التالي" navigation link.

QuizPage.tsx             → Take a quiz interface.
                           Quiz title, list of questions:
                           MCQ → radio-style options (styled divs)
                           T/F → two buttons (صح / خطأ)
                           "إرسال" Button at bottom.

QuizResultsPage.tsx      → Shows quiz score: "٤ من ٥" in large text.
                           Per-question breakdown: question text + correct/incorrect Badge
                           + explanation text. Uses mockQuizAttempt data.

AiTutorPage.tsx          → Chat interface layout.
                           Student messages: right-aligned bubbles (in RTL)
                           AI messages: left-aligned bubbles
                           2-3 mock messages (student asks about pH, AI answers)
                           Citation chips under AI messages (Badge with lesson name)
                           Counter Badge at top: "٣ أسئلة متبقية اليوم"
                           Input area at bottom: Input + Send Button (accent)

PaymentPage.tsx          → Chapter purchase page.
                           Chapter info Card: name + price (formatted in EGP)
                           Two option Cards:
                             1. "الدفع بالبطاقة" with accent Button (Paymob placeholder)
                             2. "عندي كود خصم" with Input + "تطبيق" Button

StudentProfilePage.tsx   → Student profile view.
                           Avatar + name + email from authStore user.
                           Card: list of enrolled chapters.
```

#### `features/teacher/pages/`

```
TeacherDashboardPage.tsx   → Teacher's main page.
                             4 StatCards in 2x2 grid:
                               إجمالي الطلاب: 147 (Users icon)
                               نشطين هذا الشهر: 89 (UserCheck icon)
                               الأبواب المنشورة: 6 (BookOpen icon)
                               الاختبارات: 12 (Brain icon)
                             Quick actions row: "أضف درس" + "أنشئ اختبار" Buttons

ContentManagerPage.tsx     → Two-column layout:
                             Left (~40%): Card with collapsible tree navigation.
                               Stage name → chapters (expandable with ChevronDown) →
                               lessons (FileText icon). Built from mock content data.
                             Right (~60%): Card with EmptyState "اختر درس للتعديل".
                               This is where the lesson editor form will go later.

AiQuizGeneratorPage.tsx    → 3-step stepper wizard:
                             Step indicators: "١. إعدادات" → "٢. مراجعة" → "٣. نشر"
                             Step 1 (shown by default):
                               topic Input, question count Input (number),
                               difficulty selector (سهل/متوسط/صعب),
                               "ولّد الاختبار" accent Button.
                             Steps 2 and 3: placeholder content for later.

StudentEngagementPage.tsx  → Table showing all students.
                             Columns: الاسم, الأبواب المشتركة (count),
                             آخر نشاط (date), التقدم (Progress component)
                             Data from mockStudents.

TeacherBrandingPage.tsx    → Academy branding form.
                             Fields: اسم الأكاديمية Input (prefilled from mockTenant.name),
                             صورة الشعار (gray upload placeholder box),
                             3 color Inputs (primary/secondary/accent hex values),
                             صورة المعلم (gray upload placeholder).
                             Save Button at bottom.

TeacherSettingsPage.tsx    → Profile settings form.
                             Fields: الاسم Input, البريد الإلكتروني Input,
                             كلمة المرور الجديدة Input, اللغة select (العربية/English).
                             "حفظ" Button at bottom.
```

#### `features/support/pages/`

```
PromoCodesPage.tsx     → Promo code management.
                         Top: heading "أكواد الخصم" + "إنشاء كود جديد" accent Button.
                         Table from mockPromoCodes:
                           Columns: الكود, الحالة (Badge: مستخدم green / متاح gray),
                           الطالب (name or "—"), التاريخ.

StudentLookupPage.tsx  → Student search page.
                         Search Input with Search icon at top.
                         Below: EmptyState "ابحث عن طالب بالاسم أو البريد الإلكتروني"
                         When connected to backend: typing will search and show
                         student info Card with enrollments and payment history.
```

#### `features/admin/pages/`

```
TenantsPage.tsx        → Platform admin: all academies.
                         Heading "الأكاديميات".
                         Table with mockTenant data (1 row for now):
                           Columns: اسم الأكاديمية, المعلم, المادة,
                           الحالة (Badge), عدد الطلاب.

TenantDetailsPage.tsx  → Single academy details.
                         Card: tenant name, slug, teacher name, subject,
                         subscription status Badge.
                         Row of 3 StatCards: students (147), chapters (6),
                         revenue (12,450 EGP using formatEGP).
```

---

## Routing Map

### Public Routes (no auth required)

| Path | Page | Layout |
|------|------|--------|
| `/` | LandingPage | PublicLayout |
| `/auth` | AuthPage | PublicLayout |
| `/forgot-password` | ForgotPasswordPage | PublicLayout |
| `/t/:tenantSlug` | LandingPage | PublicLayout |
| `/t/:tenantSlug/auth` | AuthPage | PublicLayout |

### Student Routes (AuthGuard → RoleGuard['student'] → StudentLayout)

| Path | Page |
|------|------|
| `/student/dashboard` | StudentDashboardPage |
| `/student/courses` | MyCoursesPage |
| `/student/content` | AllContentPage |
| `/student/lessons/:lessonId` | LessonPage |
| `/student/quizzes/:quizId` | QuizPage |
| `/student/quizzes/:quizId/results` | QuizResultsPage |
| `/student/ai-tutor` | AiTutorPage |
| `/student/pay/:chapterId` | PaymentPage |
| `/student/profile` | StudentProfilePage |

### Teacher Routes (AuthGuard → RoleGuard['teacher'] → TeacherLayout)

| Path | Page |
|------|------|
| `/teacher/dashboard` | TeacherDashboardPage |
| `/teacher/content` | ContentManagerPage |
| `/teacher/quizzes/generator` | AiQuizGeneratorPage |
| `/teacher/students` | StudentEngagementPage |
| `/teacher/branding` | TeacherBrandingPage |
| `/teacher/settings` | TeacherSettingsPage |

### Support Routes (AuthGuard → RoleGuard['support_agent'] → SupportLayout)

| Path | Page |
|------|------|
| `/support/promo-codes` | PromoCodesPage |
| `/support/students` | StudentLookupPage |

### Admin Routes (AuthGuard → RoleGuard['super_admin'] → AdminLayout)

| Path | Page |
|------|------|
| `/admin/tenants` | TenantsPage |
| `/admin/tenants/:tenantId` | TenantDetailsPage |

---

## Roles & Permissions

| Role | Dashboard URL | Access |
|------|--------------|--------|
| `student` | `/student/dashboard` | View content, take quizzes, AI tutor, pay for chapters |
| `teacher` | `/teacher/dashboard` | Manage content, generate quizzes, view analytics, branding |
| `support_agent` | `/support/promo-codes` | Generate promo codes, look up students |
| `super_admin` | `/admin/tenants` | Manage all tenants on the platform |

---

## Multi-Tenant Architecture

Each teacher has their own "academy" (tenant). Tenant context is resolved in two ways:

1. **Subdomain:** `mr-ahmed.teacherplatform.com` → slug = `mr-ahmed`
2. **URL path:** `/t/mr-ahmed-chemistry` → slug = `mr-ahmed-chemistry`

Once resolved:
- `X-Tenant-ID` header is attached to every API request
- Tenant brand colors override CSS variables (`--tenant-primary`, etc.)
- Teacher's name, logo, and branding appear in layouts

During development, `TenantGuard` auto-loads the mock tenant.

---

## Design Tokens

### Colors

| Token | Value | Usage |
|-------|-------|-------|
| `primary` | `#1A103D` | Dark purple — headings, sidebar, text |
| `secondary` | `#37306B` | Medium purple — secondary elements |
| `accent` | `#00C9DB` | Cyan — CTAs, links, progress (use sparingly!) |
| `success` | `#10B981` | Green — success toasts/badges |
| `danger` | `#EF4444` | Red — errors, delete |
| `warning` | `#F59E0B` | Amber — warnings |
| `info` | `#7C3AED` | Purple — informational |
| `background` | `#F4F3FB` | Light lavender — page bg |
| `surface` | `#FFFFFF` | White — cards |

### Border Radius

| Element | Radius |
|---------|--------|
| Cards | 14px |
| Buttons | 12px |
| Inputs | 10px |

---

## Development Workflow

### Mock Login
The `/auth` page has a dev toolbar with 4 buttons to instantly login as any role without a backend.

### Route Guards
AuthGuard → RoleGuard → Layout → Page. Each guard checks one condition and either passes through or redirects.

### Toast Notifications
Call from anywhere: `toastStore.getState().addToast({ type: 'success', message: 'تم بنجاح' })`

---

## Next Steps (Backend Integration)

1. **Auth** — Replace mock login with real JWT via `lib/api/endpoints/auth.ts`
2. **Content** — Connect stages/chapters/lessons to backend
3. **Payments** — Integrate Paymob gateway
4. **AI Quiz** — Connect to Gemini AI backend
5. **AI Tutor** — Connect RAG chat to backend
6. **Tenant** — Real tenant resolution from API
7. **Files** — Real upload for PDFs, images, logos
8. **YouTube** — Embedded player with progress tracking
9. **Deploy** — Production build and hosting

---

## License

Graduation project at ITI (Information Technology Institute).
