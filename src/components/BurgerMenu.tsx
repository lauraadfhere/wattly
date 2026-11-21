"use client";

import { useEffect, useId, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const menuItems = [
  { href: "/about", key: "about" as const },
  { href: "/pricing", key: "pricing" as const },
  { href: "/login", key: "login" as const },
  { href: "/signup", key: "signup" as const },
  { href: "/lessons", key: "lessons" as const },
  { href: "/levels", key: "levels" as const },
  { href: "/assessment", key: "assessment" as const },
  { href: "/courses", key: "courses" as const },
];

export default function BurgerMenu() {
  const t = useTranslations("Menu");
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
      <button
        type="button"
        className="absolute right-5 top-5 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/5 text-white transition hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffc933] sm:right-8 sm:top-8"
        aria-label={open ? t("close") : t("open")}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="sr-only">{open ? t("close") : t("open")}</span>
        <span className="relative block h-3.5 w-5" aria-hidden="true">
          <span
            className={`absolute left-0 top-0 h-0.5 w-full rounded-full bg-white transition duration-300 ${
              open ? "translate-y-[6px] rotate-45" : ""
            }`}
          />
          <span
            className={`absolute left-0 top-[6px] h-0.5 w-full rounded-full bg-white transition duration-300 ${
              open ? "opacity-0" : ""
            }`}
          />
          <span
            className={`absolute left-0 top-[12px] h-0.5 w-full rounded-full bg-white transition duration-300 ${
              open ? "-translate-y-[6px] -rotate-45" : ""
            }`}
          />
        </span>
      </button>

      <div
        className={`fixed inset-0 z-30 bg-black/50 transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!open}
        onClick={() => setOpen(false)}
      />

      <nav
        id={panelId}
        className={`fixed right-0 top-0 z-40 flex h-dvh w-[min(100%,20rem)] flex-col bg-black px-6 pb-8 pt-20 shadow-[-12px_0_40px_rgba(0,0,0,0.35)] transition-transform duration-300 ease-out ${
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
                className="block rounded-lg px-3 py-3 text-lg font-medium text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffc933]"
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
              className="block rounded-lg px-3 py-3 text-lg font-medium text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffc933]"
              onClick={() => setOpen(false)}
              tabIndex={open ? 0 : -1}
            >
              {t("support")}
            </a>
          </li>
        </ul>
      </nav>
    </>
  );
}
