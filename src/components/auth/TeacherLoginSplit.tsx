"use client";

import Image from "next/image";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Link, useRouter } from "@/i18n/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import AuthGate from "@/components/auth/AuthGate";
import LanguageGlobe from "@/components/LanguageGlobe";
import { getCurrentProfile, loginAccount } from "@/lib/auth";
import { postLoginPath } from "@/lib/auth-redirect";
import { DEMO_ACCOUNTS } from "@/lib/demo";

function safeNextPath(raw: string | null): string | null {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return null;
  return raw;
}

/** British Council–style split sign-in — Wattly colors + learning image. */
export default function TeacherLoginSplit() {
  const t = useTranslations("Auth");
  const tHub = useTranslations("LoginHub");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refresh } = useAuth();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const account = DEMO_ACCOUNTS.teacher;

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

  useEffect(() => {
    if (emailRef.current) emailRef.current.value = account.email;
    if (passwordRef.current) passwordRef.current.value = account.password;
  }, [account.email, account.password]);

  return (
    <div className="flex min-h-dvh flex-1 flex-col bg-white text-[#0b0b1a]">
      <AuthGate mode="guest">
        <div className="grid min-h-dvh flex-1 lg:grid-cols-2">
          {/* Left — form */}
          <div className="relative flex flex-col px-6 py-8 sm:px-10 lg:px-14 lg:py-12">
            <div className="mb-8 flex items-center justify-between lg:mb-12">
              <Link href="/" className="inline-flex items-center gap-1 lg:hidden">
                <Image
                  src="/brand/wattly-logo-blue.png"
                  alt="Wattly"
                  width={1000}
                  height={280}
                  className="h-8 w-auto"
                  priority
                />
              </Link>
              <div className="ms-auto">
                <LanguageGlobe tone="light" />
              </div>
            </div>

            <div className="mx-auto w-full max-w-md flex-1 lg:mx-0 lg:max-w-[26rem]">
              <h1 className="text-[2rem] font-bold tracking-tight text-[#000ea8] sm:text-[2.35rem]">
                {t("signIn")}
              </h1>
              <p className="mt-4 text-[0.95rem] leading-7 text-[#0b0b1a]/75">
                {tHub("teacherSignInIntro")}{" "}
                <Link href="/signup" className="font-semibold text-[#000ea8] underline underline-offset-2">
                  {tHub("teacherAccount")}
                </Link>{" "}
                {tHub("teacherSignInMid")}{" "}
                <Link href="/signup" className="font-semibold text-[#000ea8] underline underline-offset-2">
                  {t("signupLink")}
                </Link>
                {tHub("teacherSignInEnd")}
              </p>

              <form onSubmit={onSubmit} className="mt-8 space-y-5">
                <div>
                  <label htmlFor="teacher-email" className="mb-1.5 block text-sm font-medium text-[#0b0b1a]">
                    {t("email")}
                  </label>
                  <input
                    id="teacher-email"
                    name="email"
                    ref={emailRef}
                    type="email"
                    required
                    autoComplete="email"
                    className="w-full border border-[#0b0b1a]/25 bg-white px-3 py-2.5 text-base text-[#0b0b1a] outline-none focus:border-[#000ea8] focus:ring-1 focus:ring-[#000ea8]"
                  />
                </div>

                <div>
                  <label htmlFor="teacher-password" className="mb-1.5 block text-sm font-medium text-[#0b0b1a]">
                    {t("password")}
                  </label>
                  <div className="relative">
                    <input
                      id="teacher-password"
                      name="password"
                      ref={passwordRef}
                      type={showPassword ? "text" : "password"}
                      required
                      autoComplete="current-password"
                      className="w-full border border-[#0b0b1a]/25 bg-white px-3 py-2.5 pe-16 text-base text-[#0b0b1a] outline-none focus:border-[#000ea8] focus:ring-1 focus:ring-[#000ea8]"
                    />
                    <button
                      type="button"
                      className="absolute end-2 top-1/2 -translate-y-1/2 px-2 text-sm font-semibold text-[#000ea8]"
                      onClick={() => setShowPassword((v) => !v)}
                    >
                      {showPassword ? tHub("hidePassword") : tHub("showPassword")}
                    </button>
                  </div>
                </div>

                <p className="text-sm text-[#0b0b1a]/70">
                  {tHub("forgotPassword")}{" "}
                  <Link href="/login" className="font-semibold text-[#000ea8] underline underline-offset-2">
                    {tHub("resetPassword")}
                  </Link>
                  .
                </p>

                {error ? (
                  <p role="alert" className="bg-[#ff5c5c]/15 px-3 py-2 text-sm text-[#8a1010]">
                    {error}
                  </p>
                ) : null}

                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-md bg-[#000ea8] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
                >
                  {loading ? t("signingIn") : t("signIn")}
                </button>

                <button
                  type="button"
                  disabled={loading}
                  onClick={() => signIn(account.email, account.password)}
                  className="block text-sm font-semibold text-[#000ea8] underline underline-offset-2 disabled:opacity-60"
                >
                  {tHub("fastAccess")}
                </button>
              </form>

              <p className="mt-10 text-sm text-[#0b0b1a]/70">
                {tHub("notReady")}{" "}
                <Link href="/login" className="font-semibold text-[#000ea8] underline underline-offset-2">
                  {tHub("goBack")}
                </Link>
                .
              </p>
            </div>
          </div>

          {/* Right — framed image (BC-style geometry, Wattly palette) */}
          <div className="relative hidden min-h-[28rem] bg-[#000ea8] lg:block">
            <div className="absolute inset-0 flex flex-col p-5 xl:p-7">
              <div className="relative flex flex-1 overflow-hidden">
                {/* Vertical accent bars */}
                <div className="absolute inset-y-0 start-0 z-10 flex w-7 flex-col xl:w-9">
                  <span className="flex-1 bg-[#ff5c5c]" />
                  <span className="flex-[1.1] bg-[#0016BD]" />
                  <span className="flex-[0.85] bg-[#000ea8]" />
                </div>
                {/* Top turquoise strip */}
                <div className="absolute inset-x-0 top-0 z-10 h-3 bg-[#5ec8d8] ps-7 xl:ps-9" />
                {/* Logo band */}
                <div className="absolute inset-x-0 top-3 z-20 flex h-14 items-center justify-center bg-[#000ea8] ps-7 xl:h-16 xl:ps-9">
                  <Image
                    src="/brand/wattly-logo-white.png"
                    alt="Wattly"
                    width={1000}
                    height={280}
                    className="h-8 w-auto xl:h-9"
                    priority
                  />
                </div>

                <div className="relative ms-7 mt-[4.25rem] flex-1 overflow-hidden xl:ms-9 xl:mt-[4.75rem]">
                  <Image
                    src="/brand/learning-online.jpg"
                    alt=""
                    fill
                    className="object-cover object-center"
                    sizes="50vw"
                    priority
                  />
                </div>

                {/* Soft circles */}
                <div
                  className="pointer-events-none absolute -bottom-8 -end-6 z-20 h-36 w-36 rounded-full bg-[#ffc933]/85"
                  aria-hidden="true"
                />
                <div
                  className="pointer-events-none absolute -bottom-2 end-16 z-20 h-24 w-24 rounded-full bg-[#8fa8ff]/9"
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>
        </div>
      </AuthGate>
    </div>
  );
}
