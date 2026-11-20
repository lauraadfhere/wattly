"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const STORAGE_KEY = "wattly-cookie-consent";

type Consent = "all" | "necessary" | null;

export default function CookieBanner() {
  const t = useTranslations("CookieBanner");
  const [consent, setConsent] = useState<Consent | "loading">("loading");

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === "all" || stored === "necessary") {
        setConsent(stored);
      } else {
        setConsent(null);
      }
    } catch {
      setConsent(null);
    }
  }, []);

  function save(value: Exclude<Consent, null>) {
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // ignore storage failures
    }
    setConsent(value);
  }

  if (consent === "loading" || consent !== null) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-banner-title"
      aria-describedby="cookie-banner-desc"
      className="fixed bottom-4 start-4 z-[80] w-[min(100%-2rem,22rem)] rounded-2xl bg-[#e8e8ea] p-5 text-[#0b0b1a] shadow-[0_12px_40px_rgba(0,0,0,0.35)]"
    >
      <h2 id="cookie-banner-title" className="text-base font-bold">
        {t("title")}
      </h2>
      <p id="cookie-banner-desc" className="mt-2 text-sm leading-5 text-black/75">
        {t("body")}{" "}
        <Link href="/policies" className="font-semibold underline underline-offset-2">
          {t("manage")}
        </Link>
      </p>
      <div className="mt-4 flex flex-col gap-2">
        <button
          type="button"
          onClick={() => save("all")}
          className="rounded-lg bg-[#0016BD] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#000ea8]"
        >
          {t("acceptAll")}
        </button>
        <button
          type="button"
          onClick={() => save("necessary")}
          className="rounded-lg bg-[#d4d4d8] px-4 py-2.5 text-sm font-semibold text-black hover:bg-[#c4c4c8]"
        >
          {t("necessaryOnly")}
        </button>
        <button
          type="button"
          onClick={() => save("necessary")}
          className="pt-1 text-center text-sm font-semibold text-black/70 underline underline-offset-2 hover:text-black"
        >
          {t("manage")}
        </button>
      </div>
    </div>
  );
}
