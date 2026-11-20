"use client";

import { FormEvent, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { registerAccount, type UserRole } from "@/lib/auth";

export default function SignupForm() {
  const t = useTranslations("Auth");
  const locale = useLocale();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "").trim();
    const email = String(form.get("email") || "").trim();
    const password = String(form.get("password") || "");
    const role = String(form.get("role") || "learner") as UserRole;

    try {
      const { profile } = await registerAccount({
        name,
        email,
        password,
        role,
        locale,
      });

      if (profile.onboarding_done) {
        router.push("/dashboard");
      } else {
        router.push("/onboarding");
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : t("signupFailed");
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto w-full max-w-md space-y-4">
      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-medium">
          {t("name")}
        </label>
        <input
          id="name"
          name="name"
          required
          autoComplete="name"
          className="w-full rounded-xl border border-[#0016BD]/20 bg-white px-4 py-3 text-base"
        />
      </div>

      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium">
          {t("email")}
        </label>
        <input
          id="email"
          name="email"
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
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="w-full rounded-xl border border-[#0016BD]/20 bg-white px-4 py-3 text-base"
        />
        <p className="mt-1 text-xs text-[#000A5E]/70">{t("passwordHint")}</p>
      </div>

      <fieldset>
        <legend className="mb-2 text-sm font-medium">{t("role")}</legend>
        <div className="grid gap-2 sm:grid-cols-3">
          {(["learner", "parent", "teacher"] as const).map((role) => (
            <label
              key={role}
              className="flex cursor-pointer items-center gap-2 rounded-xl border border-[#0016BD]/20 bg-white px-3 py-3 text-sm"
            >
              <input
                type="radio"
                name="role"
                value={role}
                defaultChecked={role === "learner"}
              />
              {t(`roles.${role}`)}
            </label>
          ))}
        </div>
      </fieldset>

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
        {loading ? t("creating") : t("createAccount")}
      </button>

      <p className="text-center text-sm text-[#000A5E]/80">
        {t("haveAccount")}{" "}
        <Link href="/login" className="font-semibold text-[#0016BD]">
          {t("loginLink")}
        </Link>
      </p>
    </form>
  );
}
