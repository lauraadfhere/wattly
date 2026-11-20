import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "fr", "es", "ar"],
  defaultLocale: "en",
  localePrefix: "always",
});

export const rtlLocales = new Set(["ar"]);

export function isRtlLocale(locale: string) {
  return rtlLocales.has(locale);
}
