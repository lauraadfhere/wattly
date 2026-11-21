"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const localeLabels: Record<string, string> = {
  en: "English",
  fr: "Français",
  es: "Español",
  ar: "العربية",
};

type LanguageGlobeProps = {
  tone?: "hero" | "light" | "dark";
};

export default function LanguageGlobe({ tone = "hero" }: LanguageGlobeProps) {
  const t = useTranslations("Language");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onPointer = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("mousedown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const iconColor =
    tone === "hero" ? "text-white" : tone === "dark" ? "text-white" : "text-black";

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        className={`flex h-11 w-11 items-center justify-center ${iconColor}`}
        aria-label={t("label")}
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
      >
        <svg
          viewBox="0 0 24 24"
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18" strokeLinecap="round" />
          <path
            d="M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {open ? (
        <div className="absolute end-0 top-[calc(100%+0.35rem)] z-50 pt-1.5">
          <span
            className="absolute end-4 top-0 h-0 w-0 border-x-[7px] border-b-[8px] border-x-transparent border-b-[#f3f3f3]"
            aria-hidden="true"
          />
          <ul
            id={menuId}
            role="listbox"
            className="relative min-w-[11rem] overflow-hidden rounded-xl border border-[#e4e4e4] bg-[#f7f7f7] py-1.5 text-[#1a1a1a] shadow-[0_12px_28px_rgba(0,0,0,0.14)]"
          >
            {routing.locales.map((code) => (
              <li key={code} role="option" aria-selected={code === locale}>
                <button
                  type="button"
                  className={`block w-full px-4 py-2.5 text-start text-[15px] ${
                    code === locale
                      ? "bg-white font-semibold"
                      : "font-normal hover:bg-[#ececec]"
                  }`}
                  onClick={() => {
                    setOpen(false);
                    router.replace(pathname, { locale: code });
                  }}
                >
                  {localeLabels[code] ?? code}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
