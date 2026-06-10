import { type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button, Card, Input } from '@/components/ui';

export function ForgotPasswordPage() {
  const { t } = useTranslation();

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    // TODO: connect to real password-reset API.
  };

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6">
      <Card padding="lg" className="flex flex-col gap-4">
        <h1 className="font-cairo text-2xl font-bold text-text-primary">
          {t('auth:forgotPasswordTitle')}
        </h1>
        <p className="font-cairo text-sm text-text-secondary">{t('auth:forgotPasswordDesc')}</p>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <Input type="email" label={t('auth:email')} autoComplete="email" />
          <Button type="submit">{t('auth:sendResetLink')}</Button>
        </form>

        <Link
          to="/auth"
          className="inline-flex items-center gap-1 font-cairo text-sm text-accent hover:underline"
        >
          <ArrowRight size={16} className="rtl:rotate-180" />
          {t('actions.back')}
        </Link>
      </Card>
    </div>
  );
}
