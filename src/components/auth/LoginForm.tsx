"use client";

import { FormEvent, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { getCurrentProfile, loginAccount } from "@/lib/auth";
import { DEMO_CREDENTIALS } from "@/lib/demo";

export default function LoginForm() {
  const t = useTranslations("Auth");
  const router = useRouter();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function signIn(email: string, password: string) {
    setError(null);
    setLoading(true);
    try {
      await loginAccount(email, password);
      const profile = await getCurrentProfile();
      router.push(profile?.onboarding_done ? "/dashboard" : "/onboarding");
    } catch (err) {
      const message = err instanceof Error ? err.message : t("loginFailed");
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "").trim();
    const password = String(form.get("password") || "");
    await signIn(email, password);
  }

  async function useDemoAccess() {
    if (emailRef.current) emailRef.current.value = DEMO_CREDENTIALS.email;
    if (passwordRef.current) passwordRef.current.value = DEMO_CREDENTIALS.password;
    await signIn(DEMO_CREDENTIALS.email, DEMO_CREDENTIALS.password);
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto w-full max-w-md space-y-4">
      <button
        type="button"
        onClick={useDemoAccess}
        disabled={loading}
        className="flex w-full items-center gap-3 rounded-2xl border border-[#0016BD]/20 bg-white px-4 py-3 text-left disabled:opacity-60"
        aria-label={t("demoAccess")}
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#ffc933] text-[#0b0b1a]">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
            <path d="M12 2a5 5 0 0 1 5 5v1h1a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2h1V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v1h6V7a3 3 0 0 0-3-3zm0 8a2 2 0 1 0 .001 4.001A2 2 0 0 0 12 12z" />
          </svg>
        </span>
        <span>
          <span className="block text-sm font-semibold text-[#000A5E]">
            {t("demoAccess")}
          </span>
          <span className="block text-xs text-[#000A5E]/65">
            {t("demoAccessHint")}
          </span>
        </span>
      </button>

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
          className="w-full rounded-xl border border-[#0016BD]/20 bg-white px-4 py-3 text-base"
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
          className="w-full rounded-xl border border-[#0016BD]/20 bg-white px-4 py-3 text-base"
        />
      </div>

      {error ? (
        <p role="alert" className="rounded-xl bg-[#ff5c5c]/15 px-4 py-3 text-sm text-[#8a1010]">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-[#0016BD] px-5 py-3 text-base font-semibold text-white disabled:opacity-60"
      >
        {loading ? t("signingIn") : t("signIn")}
      </button>

      <p className="text-center text-sm text-[#000A5E]/80">
        {t("noAccount")}{" "}
        <Link href="/signup" className="font-semibold text-[#0016BD]">
          {t("signupLink")}
        </Link>
      </p>
    </form>
  );
}
