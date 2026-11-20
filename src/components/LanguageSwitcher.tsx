"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const localeLabels: Record<string, string> = {
  en: "English",
  fr: "Français",
  es: "Español",
};

export default function LanguageSwitcher() {
  const t = useTranslations("HomePage");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <label className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
      <span className="sr-only">{t("languageLabel")}</span>
      <select
        className="rounded-md border border-black/[.08] bg-transparent px-2 py-1.5 text-sm text-zinc-950 dark:border-white/[.145] dark:text-zinc-50"
        value={locale}
        onChange={(event) => {
          router.replace(pathname, { locale: event.target.value });
        }}
        aria-label={t("languageLabel")}
      >
        {routing.locales.map((code) => (
          <option key={code} value={code}>
            {localeLabels[code] ?? code}
          </option>
        ))}
      </select>
    </label>
  );
}
