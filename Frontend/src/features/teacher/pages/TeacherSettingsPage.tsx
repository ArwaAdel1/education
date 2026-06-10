import { useTranslation } from 'react-i18next';
import { Button, Card, Input } from '@/components/ui';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';

export function TeacherSettingsPage() {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const language = useUIStore((state) => state.language);
  const setLanguage = useUIStore((state) => state.setLanguage);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <h1 className="font-cairo text-2xl font-bold text-text-primary">{t('nav.settings')}</h1>

      <Card padding="lg" className="flex flex-col gap-4">
        <Input label={t('auth:name')} defaultValue={user?.name ?? ''} />
        <Input type="email" label={t('auth:email')} defaultValue={user?.email ?? ''} />
        <Input type="password" label="كلمة المرور الجديدة" autoComplete="new-password" />

        <div className="flex w-full flex-col gap-1">
          <label
            htmlFor="settings-language"
            className="text-start font-cairo text-sm font-medium text-text-primary"
          >
            اللغة
          </label>
          <select
            id="settings-language"
            value={language}
            onChange={(event) => setLanguage(event.target.value as 'ar' | 'en')}
            className="h-[48px] w-full rounded-input border border-border bg-surface px-3 font-cairo text-text-primary outline-none focus:border-accent"
          >
            <option value="ar">{t('language.ar')}</option>
            <option value="en">{t('language.en')}</option>
          </select>
        </div>

        <Button className="self-start">{t('actions.save')}</Button>
      </Card>
    </div>
  );
}
