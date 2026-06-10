import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Card, Input, Tabs } from '@/components/ui';
import { useAuthStore } from '@/store/authStore';

type AuthTab = 'login' | 'register';

export function AuthPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<AuthTab>('login');

  const loginAsStudent = useAuthStore((state) => state.loginAsStudent);
  const loginAsTeacher = useAuthStore((state) => state.loginAsTeacher);
  const loginAsSupportAgent = useAuthStore((state) => state.loginAsSupportAgent);
  const loginAsSuperAdmin = useAuthStore((state) => state.loginAsSuperAdmin);

  const devLogins = [
    { key: 'student', label: t('auth:loginAs.student'), action: loginAsStudent, path: '/student/dashboard' },
    { key: 'teacher', label: t('auth:loginAs.teacher'), action: loginAsTeacher, path: '/teacher/dashboard' },
    { key: 'support', label: t('auth:loginAs.support'), action: loginAsSupportAgent, path: '/support/promo-codes' },
    { key: 'admin', label: t('auth:loginAs.admin'), action: loginAsSuperAdmin, path: '/admin/tenants' },
  ];

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    // TODO: connect to real auth API.
  };

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6">
      <Card padding="lg" className="flex flex-col gap-6">
        <Tabs
          tabs={[
            { key: 'login', label: t('auth:loginTitle') },
            { key: 'register', label: t('auth:registerTitle') },
          ]}
          activeTab={activeTab}
          onTabChange={(key) => setActiveTab(key as AuthTab)}
        />

        {activeTab === 'login' ? (
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <Input type="email" label={t('auth:email')} autoComplete="email" />
            <Input type="password" label={t('auth:password')} autoComplete="current-password" />
            <Link to="/forgot-password" className="text-start font-cairo text-sm text-accent hover:underline">
              {t('auth:forgotPassword')}
            </Link>
            <Button type="submit">{t('auth:loginTitle')}</Button>
          </form>
        ) : (
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <Input label={t('auth:name')} autoComplete="name" />
            <Input type="email" label={t('auth:email')} autoComplete="email" />
            <Input type="password" label={t('auth:password')} autoComplete="new-password" />
            <Input type="password" label={t('auth:confirmPassword')} autoComplete="new-password" />
            <Button type="submit">{t('auth:registerTitle')}</Button>
          </form>
        )}
      </Card>

      {/* Dev toolbar */}
      <Card padding="md" className="flex flex-col gap-3">
        <span className="font-cairo text-sm font-medium text-text-secondary">{t('auth:devLogin')}</span>
        <div className="grid grid-cols-2 gap-2">
          {devLogins.map(({ key, label, action, path }) => (
            <Button
              key={key}
              variant="ghost"
              size="sm"
              onClick={() => {
                action();
                navigate(path);
              }}
            >
              {label}
            </Button>
          ))}
        </div>
      </Card>
    </div>
  );
}
