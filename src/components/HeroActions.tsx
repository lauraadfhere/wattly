"use client";

import { useEffect, useId, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const menuItems = [
  { href: "/login", key: "login" as const },
  { href: "/signup", key: "signup" as const },
  { href: "/lessons", key: "lessons" as const },
  { href: "/levels", key: "levels" as const },
  { href: "/assessment", key: "assessment" as const },
  { href: "/courses", key: "courses" as const },
];

const localeLabels: Record<string, string> = {
  en: "EN",
  fr: "FR",
  es: "ES",
};

export default function HeroActions() {
  const t = useTranslations("Menu");
  const tLang = useTranslations("Language");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const panelId = useId();
  const searchId = useId();

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
      <div className="absolute right-4 top-4 z-40 flex items-center gap-2 sm:right-8 sm:top-8">
        <label className="sr-only" htmlFor="hero-language">
          {tLang("label")}
        </label>
        <select
          id="hero-language"
          value={locale}
          onChange={(event) => {
            router.replace(pathname, { locale: event.target.value });
          }}
          className="h-14 rounded-full border border-white/30 bg-transparent px-3 text-sm font-semibold text-white"
          aria-label={tLang("label")}
        >
          {routing.locales.map((code) => (
            <option key={code} value={code} className="text-black">
              {localeLabels[code] ?? code.toUpperCase()}
            </option>
          ))}
        </select>

        <button
          type="button"
          className="flex h-14 w-14 items-center justify-center rounded-full border border-white/30 text-white"
          aria-label={t("search")}
          aria-expanded={searchOpen}
          aria-controls={searchId}
          onClick={() => setSearchOpen((value) => !value)}
        >
          <svg
            viewBox="0 0 24 24"
            className="h-7 w-7"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
          </svg>
        </button>

        <button
          type="button"
          className="flex h-14 w-14 items-center justify-center rounded-full border border-white/30 text-white"
          aria-label={open ? t("close") : t("open")}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((value) => !value)}
        >
          <span className="sr-only">{open ? t("close") : t("open")}</span>
          <span className="relative block h-5 w-7" aria-hidden="true">
            <span
              className={`absolute left-0 top-0 h-[3px] w-full rounded-full bg-white ${
                open ? "translate-y-[8.5px] rotate-45" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-[8.5px] h-[3px] w-full rounded-full bg-white ${
                open ? "opacity-0" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-[17px] h-[3px] w-full rounded-full bg-white ${
                open ? "-translate-y-[8.5px] -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </div>

      {searchOpen ? (
        <form
          id={searchId}
          className="absolute right-4 top-[5.25rem] z-40 w-[min(100%-2rem,22rem)] border border-white/30 bg-[#000ea8] p-3 sm:right-8"
          onSubmit={(event) => {
            event.preventDefault();
            const q = query.trim();
            setSearchOpen(false);
            router.push(
              q ? `/teachers?q=${encodeURIComponent(q)}` : "/teachers",
            );
          }}
        >
          <label className="sr-only" htmlFor="hero-search">
            {t("search")}
          </label>
          <input
            id="hero-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("searchPlaceholder")}
            className="w-full border border-white/30 bg-transparent px-4 py-3 text-base text-white placeholder:text-white/60"
            autoFocus
          />
        </form>
      ) : null}

      <div
        className={`fixed inset-0 z-30 bg-black/50 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!open}
        onClick={() => setOpen(false)}
      />

      <nav
        id={panelId}
        className={`fixed right-0 top-0 z-40 flex h-dvh w-[min(100%,20rem)] flex-col bg-black px-6 pb-8 pt-24 ${
          open ? "translate-x-0" : "translate-x-full"
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
        </ul>
      </nav>
    </>
  );
}
