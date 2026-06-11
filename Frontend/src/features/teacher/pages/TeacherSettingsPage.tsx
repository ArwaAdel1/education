import { useEffect, useRef, useState, type ChangeEvent, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import {
  User,
  Mail,
  Phone,
  Camera,
  BookOpen,
  GraduationCap,
  ChevronDown,
  Palette,
  Upload,
  type LucideIcon,
} from 'lucide-react';
import { Button, Card, Skeleton, Spinner } from '@/components/ui';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { addToast } from '@/store/slices/toastSlice';
import {
  fetchTeacherProfile,
  updateTeacherProfile,
  uploadTeacherPhoto,
  uploadTeacherLogo,
} from '@/store/slices/teacherSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  updateTeacherProfileSchema,
  zodToFieldErrors,
  normalizeMobile,
  MAX_FILE_SIZE,
} from '../validation';

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

/** First letter of the first one or two meaningful words (skips honorific tokens like "أ."). */
function getInitials(name: string): string {
  const words = name
    .trim()
    .split(/\s+/)
    .filter((word) => word.replace(/\./g, '').length > 0);
  const meaningful = words.filter((word) => word.replace(/\./g, '').length >= 2);
  const source = meaningful.length > 0 ? meaningful : words;
  return source
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join('');
}

interface SectionHeaderProps {
  icon: LucideIcon;
  title: string;
  action?: ReactNode;
}

/** Card header: accent icon circle + title on the start side, optional action on the end side. */
function SectionHeader({ icon: Icon, title, action }: SectionHeaderProps) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10">
          <Icon size={20} className="text-accent" />
        </span>
        <h2 className="font-cairo text-lg font-bold text-text-primary">{title}</h2>
      </div>
      {action}
    </div>
  );
}

function UnsavedBadge({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center justify-between rounded-input border border-warning/20 bg-warning/10 p-3">
      <span className="font-cairo text-sm text-warning">{label}</span>
    </div>
  );
}

interface TextFieldProps {
  label: string;
  icon: LucideIcon;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  inputMode?: 'text' | 'email' | 'tel';
  dir?: 'rtl' | 'ltr';
  error?: string;
}

/** Labelled input with a leading (inline-start) icon, accent focus ring. */
function TextField({
  label,
  icon: Icon,
  value,
  onChange,
  type = 'text',
  placeholder,
  inputMode,
  dir,
  error,
}: TextFieldProps) {
  return (
    <div>
      <label className="mb-1.5 block font-cairo text-sm font-medium text-text-primary">{label}</label>
      <div className="relative">
        <Icon
          size={18}
          className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-text-secondary"
        />
        <input
          type={type}
          inputMode={inputMode}
          dir={dir}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className={`h-[48px] w-full rounded-input border bg-surface pe-3 ps-10 font-cairo text-base text-text-primary outline-none transition-colors placeholder:text-text-secondary/50 focus:ring-2 ${
            error
              ? 'border-danger focus:border-danger focus:ring-danger/20'
              : 'border-border focus:border-accent focus:ring-accent/20'
          }`}
        />
      </div>
      {error && <p className="mt-1 font-cairo text-xs text-danger">{error}</p>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export function TeacherSettingsPage() {
  const { t } = useTranslation('teacher');
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const dispatch = useAppDispatch();

  const profile = useAppSelector((state) => state.teacher.profile);
  const loading = useAppSelector((state) => state.teacher.loading);
  const error = useAppSelector((state) => state.teacher.error);

  useEffect(() => {
    dispatch(fetchTeacherProfile());
  }, [dispatch]);

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="mb-6">
        <h1 className="font-cairo text-2xl font-bold text-text-primary">{t('settings.pageTitle')}</h1>
        <p className="mt-1 font-cairo text-sm text-text-secondary">{t('settings.pageSubtitle')}</p>
      </div>

      {loading && !profile ? (
        <SettingsSkeleton />
      ) : !profile ? (
        <Card padding="none" className="p-6 md:p-8">
          <p className="text-center font-cairo text-sm text-danger">
            {error ?? t('settings.loadError', 'تعذّر تحميل بيانات الحساب')}
          </p>
          <div className="mt-4 flex justify-center">
            <Button size="sm" onClick={() => dispatch(fetchTeacherProfile())}>
              {t('settings.retry', 'إعادة المحاولة')}
            </Button>
          </div>
        </Card>
      ) : (
        <div className="flex flex-col gap-6">
          <PersonalInfoCard />
          <TeachingInfoCard />
          <AcademyBrandingCard isDesktop={isDesktop} />
        </div>
      )}
    </div>
  );
}

/** Loading placeholder mirroring the three settings cards. */
function SettingsSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      {[0, 1, 2].map((card) => (
        <Card key={card} padding="none" className="p-6 md:p-8">
          <div className="mb-6 flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-5 w-40" />
          </div>
          <div className="flex flex-col gap-4">
            <Skeleton className="h-[48px] w-full" />
            <Skeleton className="h-[48px] w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </Card>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Card 1: Personal info                                               */
/* ------------------------------------------------------------------ */

function PersonalInfoCard() {
  const { t } = useTranslation('teacher');
  const dispatch = useAppDispatch();
  const photoInputRef = useRef<HTMLInputElement>(null);

  const profile = useAppSelector((state) => state.teacher.profile);
  const saving = useAppSelector((state) => state.teacher.saving);
  const uploadingPhoto = useAppSelector((state) => state.teacher.uploadingPhoto);
  const fieldErrors = useAppSelector((state) => state.teacher.fieldErrors);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  // `mobile` holds the full canonical number, e.g. "01012345678".
  const [mobile, setMobile] = useState('');
  const [baseline, setBaseline] = useState({ name: '', email: '', mobile: '' });
  // Client-side validation errors, keyed by backend field name.
  const [errors, setErrors] = useState<Record<string, string>>({});

  const clearError = (field: string) => setErrors((prev) => ({ ...prev, [field]: '' }));

  // Hydrate the form once from the loaded profile (and re-hydrate if the
  // underlying user changes). We intentionally do not re-sync on every
  // profile update so the user's in-progress edits are preserved.
  const hydratedUserId = useRef<string | null>(null);
  useEffect(() => {
    if (profile && hydratedUserId.current !== profile.userId) {
      hydratedUserId.current = profile.userId;
      const init = {
        name: profile.user.fullName ?? '',
        email: profile.user.email ?? '',
        mobile: normalizeMobile(profile.user.mobile ?? ''),
      };
      setName(init.name);
      setEmail(init.email);
      setMobile(init.mobile);
      setBaseline(init);
    }
  }, [profile]);

  // The input edits only the local digits after the leading 0 (the +20 prefix is UI-only).
  const localPhone = mobile.replace(/^0/, '');
  const isDirty = name !== baseline.name || email !== baseline.email || mobile !== baseline.mobile;
  const initials = getInitials(name || profile?.user.fullName || '؟');

  const handleSave = () => {
    const payload = {
      fullName: name.trim(),
      email: email.trim().toLowerCase(),
      mobile,
    };

    const result = updateTeacherProfileSchema.safeParse(payload);
    if (!result.success) {
      setErrors(zodToFieldErrors(result.error));
      return;
    }
    setErrors({});

    dispatch(updateTeacherProfile(result.data))
      .unwrap()
      .then(() => {
        setBaseline({ name, email, mobile });
        dispatch(addToast({ type: 'success', message: t('settings.saved') }));
      })
      .catch((err: { message?: string }) => {
        dispatch(addToast({ type: 'error', message: err?.message ?? t('settings.saveError', 'تعذّر حفظ التعديلات') }));
      });
  };

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = ''; // allow re-selecting the same file
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      dispatch(addToast({ type: 'error', message: 'حجم الملف أكبر من ٥ ميجا' }));
      return;
    }

    dispatch(uploadTeacherPhoto(file))
      .unwrap()
      .then(() => dispatch(addToast({ type: 'success', message: t('settings.saved') })))
      .catch((err: { message?: string }) =>
        dispatch(addToast({ type: 'error', message: err?.message ?? 'حصل مشكلة في رفع الصورة' })),
      );
  };

  return (
    <Card padding="none" className="p-6 md:p-8">
      <SectionHeader
        icon={User}
        title={t('settings.personal.title')}
        action={
          <Button size="sm" className="rounded-button" loading={saving} disabled={!isDirty} onClick={handleSave}>
            {t('settings.personal.saveBtn')}
          </Button>
        }
      />

      {isDirty && <UnsavedBadge label={t('settings.unsavedChanges')} />}

      {/* Profile photo */}
      <div className="mb-6 flex flex-col items-center">
        <div className="relative">
          <div className="h-20 w-20 overflow-hidden rounded-full border-2 border-border">
            {profile?.photoUrl ? (
              <img src={profile.photoUrl} alt={name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-secondary font-cairo text-xl font-bold text-white">
                {initials}
              </div>
            )}
            {uploadingPhoto && (
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40">
                <Spinner size="sm" className="text-white" />
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => photoInputRef.current?.click()}
            disabled={uploadingPhoto}
            aria-label={t('settings.personal.changePhoto')}
            className="absolute bottom-0 end-0 flex h-7 w-7 items-center justify-center rounded-full bg-accent text-white shadow-sm transition-colors hover:bg-accent/90 disabled:opacity-50"
          >
            <Camera size={14} />
          </button>
        </div>
        <button
          type="button"
          onClick={() => photoInputRef.current?.click()}
          disabled={uploadingPhoto}
          className="mt-2 cursor-pointer font-cairo text-sm text-accent transition-colors hover:underline disabled:opacity-50"
        >
          {t('settings.personal.changePhoto')}
        </button>
        <p className="mt-1 font-cairo text-xs text-text-secondary">{t('settings.personal.photoHint')}</p>
        <input
          ref={photoInputRef}
          type="file"
          accept="image/png,image/jpeg"
          className="hidden"
          onChange={handlePhotoChange}
        />
      </div>

      {/* Fields */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
        <TextField
          label={t('settings.personal.fullName')}
          icon={User}
          value={name}
          onChange={(value) => {
            setName(value);
            clearError('fullName');
          }}
          placeholder={t('settings.personal.fullNamePlaceholder')}
          error={errors.fullName || fieldErrors?.fullName?.[0]}
        />
        <TextField
          label={t('settings.personal.email')}
          icon={Mail}
          type="email"
          inputMode="email"
          dir="ltr"
          value={email}
          onChange={(value) => {
            setEmail(value);
            clearError('email');
          }}
          placeholder={t('settings.personal.emailPlaceholder')}
          error={errors.email || fieldErrors?.email?.[0]}
        />

        {/* Mobile number with country code (full width) */}
        <div className="md:col-span-2">
          <label className="mb-1.5 block font-cairo text-sm font-medium text-text-primary">
            {t('settings.personal.mobile')}
          </label>
          <div
            className={`flex h-[48px] overflow-hidden rounded-input border focus-within:ring-2 ${
              errors.mobile || fieldErrors?.mobile?.[0]
                ? 'border-danger focus-within:border-danger focus-within:ring-danger/20'
                : 'border-border focus-within:border-accent focus-within:ring-accent/20'
            }`}
          >
            <div className="flex items-center gap-1 border-e border-border bg-background px-3">
              <Phone size={16} className="text-text-secondary" />
              <span className="font-cairo text-sm text-text-secondary">+20</span>
            </div>
            <input
              dir="ltr"
              inputMode="tel"
              value={localPhone}
              onChange={(event) => {
                const localDigits = event.target.value.replace(/\D/g, '').slice(0, 10);
                setMobile(localDigits ? `0${localDigits}` : '');
                clearError('mobile');
              }}
              placeholder={t('settings.personal.mobilePlaceholder')}
              className="flex-1 bg-transparent px-3 font-cairo text-base text-text-primary outline-none placeholder:text-text-secondary/50"
            />
          </div>
          {(errors.mobile || fieldErrors?.mobile?.[0]) && (
            <p className="mt-1 font-cairo text-xs text-danger">
              {errors.mobile || fieldErrors?.mobile?.[0]}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* Card 2: Teaching info                                               */
/* ------------------------------------------------------------------ */

const BIO_MAX_LENGTH = 500;

function TeachingInfoCard() {
  const { t } = useTranslation('teacher');
  const dispatch = useAppDispatch();

  const profile = useAppSelector((state) => state.teacher.profile);
  const saving = useAppSelector((state) => state.teacher.saving);

  const subjectOptions = t('settings.teaching.subjectOptions', { returnObjects: true }) as string[];

  const [subject, setSubject] = useState('');
  const [bio, setBio] = useState('');
  const [baseline, setBaseline] = useState({ subject: '', bio: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const clearError = (field: string) => setErrors((prev) => ({ ...prev, [field]: '' }));

  const hydratedUserId = useRef<string | null>(null);
  useEffect(() => {
    if (profile && hydratedUserId.current !== profile.userId) {
      hydratedUserId.current = profile.userId;
      const init = {
        subject: profile.subject ?? subjectOptions[0] ?? '',
        bio: profile.bio ?? '',
      };
      setSubject(init.subject);
      setBio(init.bio);
      setBaseline(init);
    }
  }, [profile, subjectOptions]);

  // Ensure a stored subject that is not one of the predefined options is still
  // selectable (otherwise a controlled <select> renders empty).
  const options =
    subject && !subjectOptions.includes(subject) ? [subject, ...subjectOptions] : subjectOptions;

  const isDirty = subject !== baseline.subject || bio !== baseline.bio;

  const handleSave = () => {
    const payload = { subject, bio: bio.trim() };

    const result = updateTeacherProfileSchema.safeParse(payload);
    if (!result.success) {
      setErrors(zodToFieldErrors(result.error));
      return;
    }
    setErrors({});

    dispatch(updateTeacherProfile(result.data))
      .unwrap()
      .then(() => {
        setBaseline({ subject, bio });
        dispatch(addToast({ type: 'success', message: t('settings.saved') }));
      })
      .catch((err: { message?: string }) => {
        dispatch(addToast({ type: 'error', message: err?.message ?? t('settings.saveError', 'تعذّر حفظ التعديلات') }));
      });
  };

  return (
    <Card padding="none" className="p-6 md:p-8">
      <SectionHeader
        icon={BookOpen}
        title={t('settings.teaching.title')}
        action={
          <Button size="sm" className="rounded-button" loading={saving} disabled={!isDirty} onClick={handleSave}>
            {t('settings.teaching.saveBtn')}
          </Button>
        }
      />

      {isDirty && <UnsavedBadge label={t('settings.unsavedChanges')} />}

      <div className="flex flex-col gap-4">
        {/* Subject */}
        <div>
          <label className="mb-1.5 block font-cairo text-sm font-medium text-text-primary">
            {t('settings.teaching.subject')}
          </label>
          <div className="relative">
            <GraduationCap
              size={18}
              className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-text-secondary"
            />
            <select
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              className="h-[48px] w-full appearance-none rounded-input border border-border bg-surface pe-10 ps-10 font-cairo text-base text-text-primary outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20"
            >
              {options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <ChevronDown
              size={18}
              className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-text-secondary"
            />
          </div>
        </div>

        {/* Bio */}
        <div>
          <label className="mb-1.5 block font-cairo text-sm font-medium text-text-primary">
            {t('settings.teaching.bio')}
          </label>
          <textarea
            rows={5}
            maxLength={BIO_MAX_LENGTH}
            value={bio}
            onChange={(event) => {
              setBio(event.target.value);
              clearError('bio');
            }}
            placeholder={t('settings.teaching.bioPlaceholder')}
            className={`w-full rounded-input border bg-surface p-3 font-cairo text-base text-text-primary outline-none transition-colors placeholder:text-text-secondary/50 focus:ring-2 ${
              errors.bio
                ? 'border-danger focus:border-danger focus:ring-danger/20'
                : 'border-border focus:border-accent focus:ring-accent/20'
            }`}
          />
          <div className="flex items-center justify-between">
            {errors.bio ? (
              <span className="mt-1 font-cairo text-xs text-danger">{errors.bio}</span>
            ) : (
              <span />
            )}
            <span className="mt-1 font-cairo text-xs text-text-secondary">
              {bio.length}/{BIO_MAX_LENGTH}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* Card 3: Academy branding                                            */
/* ------------------------------------------------------------------ */

function AcademyBrandingCard({ isDesktop }: { isDesktop: boolean }) {
  const { t } = useTranslation('teacher');
  const dispatch = useAppDispatch();
  const logoInputRef = useRef<HTMLInputElement>(null);

  const profile = useAppSelector((state) => state.teacher.profile);
  const uploadingLogo = useAppSelector((state) => state.teacher.uploadingLogo);

  const handleLogoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = ''; // allow re-selecting the same file
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      dispatch(addToast({ type: 'error', message: 'حجم الملف أكبر من ٥ ميجا' }));
      return;
    }

    dispatch(uploadTeacherLogo(file))
      .unwrap()
      .then(() => dispatch(addToast({ type: 'success', message: t('settings.saved') })))
      .catch((err: { message?: string }) =>
        dispatch(addToast({ type: 'error', message: err?.message ?? 'حصل مشكلة في رفع الصورة' })),
      );
  };

  const handleApply = () => {
    logoInputRef.current?.click();
  };

  return (
    <Card padding="none" className="p-6 md:p-8">
      <SectionHeader icon={Palette} title={t('settings.branding.title')} />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Logo upload */}
        <div>
          <p className="mb-2 font-cairo text-sm font-medium text-text-primary">
            {t('settings.branding.logoLabel')}
          </p>
          <button
            type="button"
            onClick={() => logoInputRef.current?.click()}
            disabled={uploadingLogo}
            className="flex h-[180px] w-full cursor-pointer flex-col items-center justify-center rounded-card border-2 border-dashed border-border bg-background transition-colors hover:border-accent/50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {uploadingLogo ? (
              <Spinner size="lg" />
            ) : (
              <>
                <Upload size={32} className="text-accent" />
                <p className="mt-3 font-cairo text-sm text-text-secondary">
                  {t('settings.branding.uploadText')}
                </p>
                <p className="mt-1 font-cairo text-xs text-text-secondary/60">
                  {t('settings.branding.uploadHint')}
                </p>
              </>
            )}
          </button>
          <input
            ref={logoInputRef}
            type="file"
            accept="image/png,image/jpeg"
            className="hidden"
            onChange={handleLogoChange}
          />
        </div>

        {/* Logo preview */}
        <div>
          <p className="mb-2 font-cairo text-sm font-medium text-text-primary">
            {t('settings.branding.previewTitle')}
          </p>
          <div className="rounded-card bg-background p-4">
            <p className="mb-3 font-cairo text-xs text-text-secondary">
              {t('settings.branding.previewLabel')}
            </p>
            <div className="flex items-center gap-2 rounded-input bg-surface p-3 shadow-sm">
              {profile?.logoUrl ? (
                <img
                  src={profile.logoUrl}
                  alt={t('settings.branding.academyName')}
                  className="h-8 w-8 rounded-md object-cover"
                />
              ) : (
                <div className="h-8 w-8 rounded-md bg-secondary/20" />
              )}
              <span className="font-cairo text-sm text-text-secondary">
                {t('settings.branding.academyName')}
              </span>
              <div className="ms-auto flex gap-1">
                <div className="h-2 w-2 rounded-full bg-border" />
                <div className="h-2 w-2 rounded-full bg-border" />
                <div className="h-2 w-2 rounded-full bg-accent" />
              </div>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              <div className="h-16 rounded-md bg-border/50" />
              <div className="h-16 rounded-md bg-border/50" />
              <div className="h-16 rounded-md bg-border/50" />
            </div>
          </div>
        </div>
      </div>

      {!isDesktop && (
        <Button className="mt-6 w-full" size="lg" loading={uploadingLogo} onClick={handleApply}>
          {t('settings.branding.applyBtn')}
        </Button>
      )}
    </Card>
  );
}
