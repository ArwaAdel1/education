// src/features/auth/pages/AuthPage.tsx
import { useState } from "react";
import { useForm, type UseFormRegisterReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import {
  GraduationCap, User, Mail, Phone, Lock, UserCheck, LogIn,
  type LucideIcon,
} from "lucide-react";

import { authApi } from "@/lib/api/endpoints/auth";
import type { ApiError } from "@/lib/api/client";
import { useAuthStore, dashboardPathByRole } from "@/store/authStore";
import type { AuthResponse } from "@/types/user";

type Mode = "login" | "register";

/* ------------------------------ schemas ------------------------------ */

const loginSchema = z.object({
  email: z.string().min(1, "البريد الإلكتروني مطلوب").email("ادخل بريد إلكتروني صحيح"),
  password: z.string().min(1, "كلمة المرور مطلوبة"),
});

const registerSchema = z
  .object({
    fullName: z.string().min(3, "الاسم لازم يكون ٣ حروف على الأقل"),
    email: z.string().min(1, "البريد الإلكتروني مطلوب").email("ادخل بريد إلكتروني صحيح"),
    mobile: z.string().regex(/^01[0125][0-9]{8}$/, "ادخل رقم موبايل مصري صحيح"),
    password: z.string().min(8, "كلمة المرور لازم تكون ٨ حروف على الأقل"),
  })
  .strict();

type LoginValues = z.infer<typeof loginSchema>;
type RegisterValues = z.infer<typeof registerSchema>;

/* ------------------------------- field ------------------------------- */

function Field({
  icon: Icon,
  label,
  error,
  registration,
  ...props
}: {
  icon: LucideIcon;
  label: string;
  error?: string;
  registration: UseFormRegisterReturn;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="mb-[17px]">
      <label className="mb-2 block text-sm font-bold text-[#374151]">{label}</label>
      <div className="relative">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#9AA0AE]">
          <Icon size={20} strokeWidth={2} />
        </span>
        <input
          {...registration}
          {...props}
          className="h-14 w-full rounded-[14px] border border-[#E9E9F1] bg-[#F6F6FB] pl-[52px] pr-[18px] text-sm text-primary outline-none transition placeholder:text-[#9CA3AF] focus:border-accent focus:bg-white focus:ring-4 focus:ring-accent/10"
        />
      </div>
      {error && <p className="mt-1.5 text-xs text-danger">{error}</p>}
    </div>
  );
}

/* ------------------------------- page -------------------------------- */

export function AuthPage() {
  const [mode, setMode] = useState<Mode>("login");
  const { t } = useTranslation("auth");
  const isLogin = mode === "login";

  return (
    <div className="relative mx-auto min-h-screen w-full max-w-[460px] overflow-hidden bg-surface px-[22px] pb-8 pt-[42px]">
      {/* زخارف */}
      <span className="pointer-events-none absolute left-6 top-[118px] h-[62px] w-[62px] rotate-45 rounded-[14px] border-2 border-[#E5E5EE]/80" />
      <span className="pointer-events-none absolute -right-8 bottom-[150px] h-[120px] w-[120px] rounded-full border-2 border-accent/25" />

      {/* الهيدر */}
      <div className="relative z-10 text-center">
        <div className="mx-auto flex h-[66px] w-[66px] items-center justify-center rounded-[18px] bg-primary text-white shadow-[0_14px_30px_-8px_rgba(26,16,61,.5)]">
          <GraduationCap size={32} />
        </div>
        <h1 className="mb-2 mt-5 text-[30px] font-extrabold text-primary">
          {t(isLogin ? "loginTitle" : "registerTitle")}
        </h1>
        <p className="mx-auto max-w-[330px] text-sm leading-[1.85] text-text-secondary">
          {t(isLogin ? "loginSubtitle" : "registerSubtitle")}
        </p>
      </div>

      {/* الكارت */}
      <div className="relative z-10 mt-[26px] rounded-[22px] border border-[#EEEEF4] bg-surface p-[26px_22px] shadow-[0_24px_48px_-20px_rgba(26,16,61,.18)]">
        {isLogin ? <LoginForm /> : <RegisterForm />}
      </div>

      {/* تبديل */}
      <p className="relative z-10 mt-[26px] text-center text-[15px] font-semibold text-text-secondary">
        {t(isLogin ? "noAccount" : "hasAccount")}{" "}
        <button
          type="button"
          onClick={() => setMode(isLogin ? "register" : "login")}
          className="font-extrabold text-accent hover:underline"
        >
          {t(isLogin ? "registerTitle" : "loginTitle")}
        </button>
      </p>
    </div>
  );
}

/* ---------------------------- login form ----------------------------- */

function LoginForm() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const { t } = useTranslation("auth");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const mutation = useMutation<AuthResponse, ApiError, LoginValues>({
    mutationFn: (v) => authApi.login(v.email, v.password),
    onSuccess: (data) => {
      login(data.user, data.accessToken);
      navigate(dashboardPathByRole[data.user.role]);
    },
    onError: (err) => console.error(err.message),
  });

  return (
    <form onSubmit={handleSubmit((v) => mutation.mutate(v))} noValidate>
      <Field
        icon={Mail}
        label={t("email")}
        type="email"
        dir="ltr"
        style={{ textAlign: "right" }}
        autoComplete="email"
        placeholder="example@domain.com"
        error={errors.email?.message}
        registration={register("email")}
      />
      <Field
        icon={Lock}
        label={t("password")}
        type="password"
        autoComplete="current-password"
        placeholder="••••••••"
        error={errors.password?.message}
        registration={register("password")}
      />

      <div className="-mt-1.5 mb-3.5 text-left">
        <button
          type="button"
          onClick={() => navigate("/forgot-password")}
          className="text-[13px] font-semibold text-accent hover:underline"
        >
          {t("forgotPassword")}
        </button>
      </div>

      <SubmitButton icon={LogIn} loading={mutation.isPending}>
        {t("loginTitle")}
      </SubmitButton>
    </form>
  );
}

/* --------------------------- register form --------------------------- */

function RegisterForm() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const { t } = useTranslation("auth");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: "", email: "", mobile: "", password: "" },
  });

  const mutation = useMutation<AuthResponse, ApiError, RegisterValues>({
    mutationFn: (v) => authApi.register(v),
    onSuccess: (data) => {
      login(data.user, data.accessToken);
      navigate(dashboardPathByRole[data.user.role]);
    },
    onError: (err) => console.error(err.message),
  });

  return (
    <form onSubmit={handleSubmit((v) => mutation.mutate(v))} noValidate>
      <Field
        icon={User}
        label={t("fullName")}
        autoComplete="name"
        placeholder={t("fullNamePlaceholder")}
        error={errors.fullName?.message}
        registration={register("fullName")}
      />
      <Field
        icon={Mail}
        label={t("email")}
        type="email"
        dir="ltr"
        style={{ textAlign: "right" }}
        autoComplete="email"
        placeholder="example@domain.com"
        error={errors.email?.message}
        registration={register("email")}
      />
      <Field
        icon={Phone}
        label={t("mobile")}
        type="tel"
        dir="ltr"
        style={{ textAlign: "right" }}
        inputMode="numeric"
        autoComplete="tel"
        placeholder="01XXXXXXXXX"
        error={errors.mobile?.message}
        registration={register("mobile")}
      />
      <Field
        icon={Lock}
        label={t("password")}
        type="password"
        autoComplete="new-password"
        placeholder="••••••••"
        error={errors.password?.message}
        registration={register("password")}
      />
      <SubmitButton icon={UserCheck} loading={mutation.isPending}>
        {t("registerTitle")}
      </SubmitButton>
    </form>
  );
}

/* ----------------------------- button -------------------------------- */

function SubmitButton({
  icon: Icon,
  loading,
  children,
}: {
  icon: LucideIcon;
  loading: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="mt-1.5 flex h-14 w-full items-center justify-center gap-2.5 rounded-[14px] bg-primary text-base font-extrabold text-white shadow-[0_14px_28px_-12px_rgba(26,16,61,.55)] transition hover:bg-primary-light active:translate-y-px disabled:opacity-60"
    >
      <Icon size={20} />
      {loading ? "..." : children}
    </button>
  );
}