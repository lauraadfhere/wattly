"use client";

import { useEffect, useId, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import LanguageGlobe from "@/components/LanguageGlobe";

const menuItems = [
  { href: "/login", key: "login" as const },
  { href: "/signup", key: "signup" as const },
  { href: "/lessons", key: "lessons" as const },
  { href: "/levels", key: "levels" as const },
  { href: "/assessment", key: "assessment" as const },
  { href: "/courses", key: "courses" as const },
];

export default function HeroActions() {
  const t = useTranslations("Menu");
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
      <div className="absolute end-4 top-4 z-40 flex items-center gap-1 sm:end-8 sm:top-8">
        <LanguageGlobe tone="hero" />

        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center text-white"
          aria-label={t("search")}
          aria-expanded={searchOpen}
          aria-controls={searchId}
          onClick={() => setSearchOpen((value) => !value)}
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
        </button>

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

      {searchOpen ? (
        <form
          id={searchId}
          className="absolute end-4 top-[4.5rem] z-40 w-[min(100%-2rem,20rem)] rounded-xl bg-[#2b2b2b] p-2 shadow-[0_12px_30px_rgba(0,0,0,0.35)] sm:end-8"
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
            className="w-full rounded-lg bg-[#3a3a3a] px-4 py-3 text-base text-white placeholder:text-white/50"
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
        className={`fixed end-0 top-0 z-40 flex h-dvh w-[min(100%,20rem)] flex-col bg-black px-6 pb-8 pt-24 ${
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
        </ul>
      </nav>
    </>
  );
}
