"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Link, useRouter } from "@/i18n/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { getCurrentProfile, loginAccount } from "@/lib/auth";
import { postLoginPath } from "@/lib/auth-redirect";
import { DEMO_ACCOUNTS, type DemoRole } from "@/lib/demo";

type RoleLoginPanelProps = {
  role: DemoRole;
};

function safeNextPath(raw: string | null): string | null {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return null;
  return raw;
}

export default function RoleLoginPanel({ role }: RoleLoginPanelProps) {
  const t = useTranslations("Auth");
  const tHub = useTranslations("LoginHub");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refresh } = useAuth();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const account = DEMO_ACCOUNTS[role];

  async function signIn(email: string, password: string) {
    setError(null);
    setLoading(true);
    try {
      await loginAccount(email, password);
      await refresh();
      const profile = await getCurrentProfile();
      const next = safeNextPath(searchParams.get("next"));
      router.push(next || postLoginPath(profile));
    } catch (err) {
      setError(err instanceof Error ? err.message : t("loginFailed"));
    } finally {
      setLoading(false);
    }
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    await signIn(String(form.get("email") || "").trim(), String(form.get("password") || ""));
  }

  async function useFastAccess() {
    if (emailRef.current) emailRef.current.value = account.email;
    if (passwordRef.current) passwordRef.current.value = account.password;
    await signIn(account.email, account.password);
  }

  useEffect(() => {
    if (emailRef.current) emailRef.current.value = account.email;
    if (passwordRef.current) passwordRef.current.value = account.password;
  }, [account.email, account.password]);

  const roleLabel =
    role === "learner"
      ? tHub("studentTitle")
      : role === "teacher"
        ? tHub("teacherTitle")
        : role === "parent"
          ? tHub("parentAccess")
          : tHub("adminAccess");

  return (
    <div className="mx-auto w-full max-w-md space-y-5">
      <button
        type="button"
        disabled={loading}
        onClick={() => useFastAccess()}
        className="flex w-full items-center gap-3 border-2 border-black bg-[#ffc933] px-4 py-4 text-start disabled:opacity-60"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center bg-black text-[#ffc933]">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
            <path d="M12 2a5 5 0 0 1 5 5v1h1a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2h1V7a5 5 0 0 1 5-5z" />
          </svg>
        </span>
        <span>
          <span className="block text-sm font-bold text-[#0b0b1a]">{tHub("fastAccess")}</span>
          <span className="block text-xs text-[#0b0b1a]/75">
            {tHub("fastAccessHint", { role: roleLabel })}
          </span>
        </span>
      </button>

      <form onSubmit={onSubmit} className="space-y-4 border-2 border-black bg-white p-5 text-black">
        <p className="text-sm text-black/65">{tHub("manualHint")}</p>
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium">
            {t("email")}
          </label>
          <input
            id="email"
            name="email"
            ref={emailRef}
            type="email"
            required
            autoComplete="email"
            className="w-full border border-black/20 px-4 py-3 text-base"
          />
        </div>
        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium">
            {t("password")}
          </label>
          <input
            id="password"
            name="password"
            ref={passwordRef}
            type="password"
            required
            autoComplete="current-password"
            className="w-full border border-black/20 px-4 py-3 text-base"
          />
        </div>

        {error ? (
          <p role="alert" className="bg-[#ff5c5c]/15 px-4 py-3 text-sm text-[#8a1010]">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#0016BD] px-5 py-3 text-base font-semibold text-white disabled:opacity-60"
        >
          {loading ? t("signingIn") : t("signIn")}
        </button>
      </form>

      <p className="text-center text-sm text-black/70">
        <Link href="/login" className="font-semibold text-[#0016BD]">
          {tHub("backToOptions")}
        </Link>
      </p>
    </div>
  );
}
