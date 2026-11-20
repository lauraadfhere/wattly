import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
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

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: catalogs[locale],
  };
});
