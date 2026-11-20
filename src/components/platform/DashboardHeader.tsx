"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import Avatar from "@/components/Avatar";
import LanguageGlobe from "@/components/LanguageGlobe";

export default function DashboardHeader() {
  const t = useTranslations("Platform");
  const tMenu = useTranslations("Menu");
  const { user, profile, loading, logout } = useAuth();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const displayName = profile?.display_name || user?.name || "";
  const role = profile?.role;

  function onSearch(event: FormEvent) {
    event.preventDefault();
    const q = query.trim();
    router.push(q ? `/teachers?q=${encodeURIComponent(q)}` : "/teachers");
    setMobileOpen(false);
  }

  return (
    <>
      {/* Desktop / tablet: tall translucent black header with black border + logo left */}
      <header className="dashboard-header hidden border-b-2 border-black bg-black/70 text-black backdrop-blur-md md:block">
        <div className="mx-auto flex min-h-[5.5rem] w-full max-w-6xl items-center justify-between gap-4 px-6 py-5 sm:px-10">
          <Link href="/dashboard" className="inline-flex items-center">
            <Image
              src="/brand/wattly-logo-white.png"
              alt="Wattly"
              width={1000}
              height={280}
              className="h-9 w-auto"
              priority
            />
          </Link>

          <nav
            aria-label={t("navLabel")}
            className="dashboard-nav flex items-center gap-6 text-[15px] font-medium text-white"
          >
            <Link href="/dashboard">{t("dashboard")}</Link>
            <Link href="/teachers">{t("teachers")}</Link>
            <Link href="/practice">{t("practice")}</Link>
            <Link href="/profile">{t("profile")}</Link>
          </nav>

          <div className="flex items-center gap-2">
            <form onSubmit={onSearch} className="relative">
              <label className="sr-only" htmlFor="dash-search">
                {tMenu("search")}
              </label>
              <input
                id="dash-search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={tMenu("searchPlaceholder")}
                className="w-44 rounded-full bg-[#2b2b2b] py-2 pe-10 ps-4 text-sm text-white placeholder:text-white/45 lg:w-56"
              />
              <button
                type="submit"
                className="absolute end-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center text-white"
                aria-label={tMenu("search")}
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="7" />
                  <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
                </svg>
              </button>
            </form>

            <LanguageGlobe tone="dark" />

            {loading ? (
              <span className="h-9 w-24 animate-pulse rounded-full bg-white/10" />
            ) : user ? (
              <Link href="/profile" className="flex items-center gap-2 pe-1">
                <Avatar name={displayName || user.email} role={role} size="sm" />
                <span className="hidden max-w-[8rem] truncate text-sm font-medium text-white lg:inline">
                  {displayName || user.email}
                </span>
              </Link>
            ) : (
              <Link href="/login" className="text-sm font-semibold text-white">
                {t("login")}
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Mobile: solid black header without logo */}
      <header className="border-b-2 border-black bg-black text-white md:hidden">
        <div className="flex h-14 items-center justify-between px-4">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center text-white"
            aria-label={tMenu("search")}
            onClick={() => setMobileOpen(true)}
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
            </svg>
          </button>
          <p className="dashboard-nav text-sm font-semibold tracking-wide">
            {t("dashboard")}
          </p>
          <LanguageGlobe tone="dark" />
        </div>
      </header>

      {/* Mobile bottom bar with small menu icon */}
      <nav
        aria-label={t("navLabel")}
        className="fixed inset-x-0 bottom-0 z-40 border-t-2 border-black bg-black px-2 pb-[env(safe-area-inset-bottom)] md:hidden"
      >
        <ul className="grid grid-cols-5 items-center">
          <li>
            <Link href="/dashboard" className="flex flex-col items-center gap-1 py-2 text-[10px] text-white">
              <span className="h-1 w-8 rounded-full bg-white" aria-hidden="true" />
              {t("dashboard")}
            </Link>
          </li>
          <li>
            <Link href="/teachers" className="flex flex-col items-center gap-1 py-2 text-[10px] text-white/80">
              <span className="h-1 w-5 rounded-full bg-white/40" aria-hidden="true" />
              {t("teachers")}
            </Link>
          </li>
          <li>
            <button
              type="button"
              className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#2b2b2b] text-white"
              aria-label={tMenu("open")}
              onClick={() => setMobileOpen((value) => !value)}
            >
              <span className="relative block h-3.5 w-5" aria-hidden="true">
                <span className="absolute start-0 top-0 h-[2px] w-full bg-white" />
                <span className="absolute start-0 top-[6px] h-[2px] w-full bg-white" />
                <span className="absolute start-0 top-[12px] h-[2px] w-full bg-white" />
              </span>
            </button>
          </li>
          <li>
            <Link href="/practice" className="flex flex-col items-center gap-1 py-2 text-[10px] text-white/80">
              <span className="h-1 w-5 rounded-full bg-white/40" aria-hidden="true" />
              {t("practice")}
            </Link>
          </li>
          <li>
            <Link href="/profile" className="flex flex-col items-center gap-1 py-2 text-[10px] text-white/80">
              <span className="h-1 w-5 rounded-full bg-white/40" aria-hidden="true" />
              {t("profile")}
            </Link>
          </li>
        </ul>
      </nav>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 bg-black/70 md:hidden" onClick={() => setMobileOpen(false)}>
          <div
            className="absolute inset-x-3 bottom-20 rounded-2xl bg-[#2b2b2b] p-4 text-white shadow-[0_12px_30px_rgba(0,0,0,0.45)]"
            onClick={(event) => event.stopPropagation()}
          >
            <form onSubmit={onSearch} className="mb-3">
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={tMenu("searchPlaceholder")}
                className="w-full rounded-xl bg-[#3a3a3a] px-4 py-3 text-sm text-white placeholder:text-white/45"
              />
            </form>
            <div className="grid gap-1 text-sm">
              <Link href="/dashboard" className="rounded-lg px-3 py-2.5 hover:bg-[#353535]" onClick={() => setMobileOpen(false)}>
                {t("dashboard")}
              </Link>
              <Link href="/teachers" className="rounded-lg px-3 py-2.5 hover:bg-[#353535]" onClick={() => setMobileOpen(false)}>
                {t("teachers")}
              </Link>
              <Link href="/practice" className="rounded-lg px-3 py-2.5 hover:bg-[#353535]" onClick={() => setMobileOpen(false)}>
                {t("practice")}
              </Link>
              <Link href="/profile" className="rounded-lg px-3 py-2.5 hover:bg-[#353535]" onClick={() => setMobileOpen(false)}>
                {t("profile")}
              </Link>
              {user ? (
                <button
                  type="button"
                  className="rounded-lg px-3 py-2.5 text-start hover:bg-[#353535]"
                  onClick={async () => {
                    await logout();
                    setMobileOpen(false);
                    router.push("/login");
                  }}
                >
                  {t("logout")}
                </button>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
