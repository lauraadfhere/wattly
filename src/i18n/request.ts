import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";
import * as rootParams from "next/root-params";
import { routing } from "./routing";

// Load as TS modules (not JSON) so Turbopack never wraps catalogs in JSON.parse().
import ar from "../../messages/ar";
import en from "../../messages/en";
import es from "../../messages/es";
import fr from "../../messages/fr";

const catalogs = {
  en,
  fr,
  es,
  ar,
} as const;

export default getRequestConfig(async ({ locale }) => {
  if (!locale) {
    const paramValue = await rootParams.locale();
    if (hasLocale(routing.locales, paramValue)) {
      locale = paramValue;
    } else {
      notFound();
    }
  }

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return {
    locale,
    messages: catalogs[locale],
  };
});
