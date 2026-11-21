"use client";

import { useEffect, useId, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import LanguageGlobe from "@/components/LanguageGlobe";
import ProfileMenu from "@/components/platform/ProfileMenu";

const menuItems = [
  { href: "/about", key: "about" as const },
  { href: "/pricing", key: "pricing" as const },
  { href: "/login", key: "login" as const },
  { href: "/signup", key: "signup" as const },
  { href: "/lessons", key: "lessons" as const },
  { href: "/levels", key: "levels" as const },
  { href: "/assessment", key: "assessment" as const },
  { href: "/courses", key: "courses" as const },
  { href: "/search", key: "search" as const },
];

export default function HeroActions() {
  const t = useTranslations("Menu");
  const tPlatform = useTranslations("Platform");
  const { user, loading } = useAuth();
  const [open, setOpen] = useState(false);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <>
      <div className="sticky top-0 z-50 bg-[#000ea8]">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-end gap-1 px-4 py-2 sm:px-8 lg:px-12">
          <Link
            href="/about"
            className="px-2.5 py-2 text-sm font-medium text-white/90 hover:text-white"
          >
            {t("about")}
          </Link>
          <Link
            href="/pricing"
            className="px-2.5 py-2 text-sm font-medium text-white/90 hover:text-white"
          >
            {t("pricing")}
          </Link>

          <LanguageGlobe tone="hero" />

          <Link
            href="/search"
            className="flex h-11 w-11 items-center justify-center text-white"
            aria-label={t("search")}
          >
            <svg
              viewBox="0 0 24 24"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
            </svg>
          </Link>

          <a
            href="https://www.linkedin.com/company/wattly"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-11 w-11 items-center justify-center text-white"
            aria-label="LinkedIn"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
              <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8.5h4V23h-4V8.5zM8.5 8.5h3.8v2h.05c.53-1 1.82-2.05 3.75-2.05 4.01 0 4.75 2.64 4.75 6.07V23h-4v-6.6c0-1.57-.03-3.59-2.19-3.59-2.19 0-2.53 1.71-2.53 3.48V23h-4V8.5z" />
            </svg>
          </a>

          {loading ? (
            <span className="ms-1 h-9 w-9 animate-pulse rounded-full bg-white/15" />
          ) : user ? (
            <div className="ms-1">
              <ProfileMenu tone="hero" />
            </div>
          ) : null}

          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center text-white"
            aria-label={open ? t("close") : t("open")}
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen((value) => !value)}
          >
            <span className="sr-only">{open ? t("close") : t("open")}</span>
            <span className="relative block h-4 w-6" aria-hidden="true">
              <span
                className={`absolute start-0 top-0 h-[2.5px] w-full rounded-full bg-white ${
                  open ? "translate-y-[7px] rotate-45" : ""
                }`}
              />
              <span
                className={`absolute start-0 top-[7px] h-[2.5px] w-full rounded-full bg-white ${
                  open ? "opacity-0" : ""
                }`}
              />
              <span
                className={`absolute start-0 top-[14px] h-[2.5px] w-full rounded-full bg-white ${
                  open ? "-translate-y-[7px] -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      <div
        className={`fixed inset-0 z-40 bg-black/50 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!open}
        onClick={() => setOpen(false)}
      />

      <nav
        id={panelId}
        className={`fixed end-0 top-0 z-50 flex h-dvh w-[min(100%,20rem)] flex-col bg-black px-6 pb-8 pt-24 ${
          open ? "translate-x-0" : "ltr:translate-x-full rtl:-translate-x-full"
        }`}
        aria-label={t("title")}
        aria-hidden={!open}
      >
        <ul className="flex flex-col gap-1">
          {menuItems.map((item) => (
            <li key={item.key}>
              <Link
                href={item.href}
                className="block rounded-lg px-3 py-3 text-lg font-medium text-white"
                onClick={() => setOpen(false)}
                tabIndex={open ? 0 : -1}
              >
                {t(item.key)}
              </Link>
            </li>
          ))}
          <li>
            <a
              href="https://support.wall-y.ca"
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-lg px-3 py-3 text-lg font-medium text-white"
              onClick={() => setOpen(false)}
              tabIndex={open ? 0 : -1}
            >
              {t("support")}
            </a>
          </li>
          {user ? (
            <li>
              <Link
                href="/profile"
                className="block rounded-lg px-3 py-3 text-lg font-medium text-white"
                onClick={() => setOpen(false)}
                tabIndex={open ? 0 : -1}
              >
                {tPlatform("profile")}
              </Link>
            </li>
          ) : null}
        </ul>
      </nav>
    </>
  );
}
