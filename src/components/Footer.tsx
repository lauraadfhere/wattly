import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function Footer() {
  const t = await getTranslations("Footer");

  return (
    <footer className="bg-black text-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-3 px-6 py-8 sm:px-10 lg:px-16">
        <Image
          src="/brand/wattly-logo-white.png"
          alt="Wattly"
          width={1000}
          height={280}
          className="h-auto w-[10vw] min-w-[72px] max-w-[120px]"
        />
        <p className="max-w-xl text-sm leading-6 text-white/70">{t("tagline")}</p>
        <div className="flex w-full items-end justify-between gap-4 pt-2">
          <p className="text-xs text-white/45">
            © 2026 Wattly. {t("rights")}
          </p>
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white/80 hover:bg-white/15 hover:text-white"
            aria-label={t("adminAccess")}
            title={t("adminAccess")}
          >
            <svg
              viewBox="0 0 24 24"
              className="h-3.5 w-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M12 3l8 4v5c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V7l8-4z" />
              <path d="M9.5 12l1.8 1.8L15 10" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>{t("adminAccess")}</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
