"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import Avatar from "@/components/Avatar";
import LanguageGlobe from "@/components/LanguageGlobe";

export default function PlatformHeader() {
  const t = useTranslations("Platform");
  const tAuth = useTranslations("Auth");
  const { user, profile, loading, logout } = useAuth();
  const router = useRouter();

  const displayName = profile?.display_name || user?.name || "";
  const role = profile?.role;

  return (
    <header className="border-b-2 border-black bg-white">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-4 sm:px-10">
        <Link href="/" className="inline-flex items-center gap-3">
          <Image
            src="/brand/wattly-logo-blue.png"
            alt="Wattly"
            width={1000}
            height={280}
            className="h-8 w-auto"
          />
          <span className="sr-only">Wattly</span>
        </Link>

        <nav
          aria-label={t("navLabel")}
          className="hidden items-center gap-4 text-sm font-medium text-black md:flex"
        >
          <Link href="/dashboard">{t("dashboard")}</Link>
          <Link href="/teachers">{t("teachers")}</Link>
          <Link href="/stories">{t("stories")}</Link>
          <Link href="/live-lessons">{t("liveLessons")}</Link>
          <Link href="/practice">{t("practice")}</Link>
          <Link href="/profile">{t("profile")}</Link>
        </nav>

        <div className="flex items-center gap-2 text-sm font-semibold">
          <LanguageGlobe tone="light" />

          {loading ? (
            <span className="h-10 w-28 animate-pulse rounded-full bg-black/10" />
          ) : user ? (
            <div className="flex items-center gap-2">
              <Link
                href="/profile"
                className="flex items-center gap-2 rounded-full px-1 py-1 pe-2"
              >
                <Avatar
                  name={displayName || user.email}
                  role={role}
                  size="sm"
                  src={profile?.avatar_url}
                />
                <span className="hidden max-w-[9rem] truncate text-black sm:inline">
                  {displayName || user.email}
                </span>
              </Link>
              <button
                type="button"
                className="rounded-full px-3 py-2 text-black"
                onClick={async () => {
                  await logout();
                  router.push("/login");
                }}
              >
                {t("logout")}
              </button>
            </div>
          ) : (
            <>
              <Link href="/login" className="rounded-full px-3 py-2 text-black">
                {tAuth("signIn")}
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-[#ffc933] px-4 py-2 text-black"
              >
                {t("signup")}
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
