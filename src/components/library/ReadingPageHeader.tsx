"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

type Props = {
  title: string;
  pageLabel?: string;
  backHref: string;
};

/**
 * Dedicated reading chrome: logo top-left, translucent black bar, black border.
 */
export default function ReadingPageHeader({ title, pageLabel, backHref }: Props) {
  const t = useTranslations("Library");

  return (
    <header className="shrink-0 border-b-2 border-black bg-black/65 text-white backdrop-blur-md">
      <div className="flex h-14 w-full items-center gap-3 px-3 sm:h-16 sm:px-5">
        <Link
          href="/dashboard"
          className="inline-flex shrink-0 items-center"
          aria-label="Wattly"
        >
          <Image
            src="/brand/wattly-logo-white.png"
            alt="Wattly"
            width={1000}
            height={280}
            className="h-7 w-auto sm:h-8"
            priority
          />
        </Link>

        <div className="min-w-0 flex-1 text-center">
          <p className="truncate font-serif text-sm font-semibold tracking-wide sm:text-base">
            {title}
          </p>
          {pageLabel ? (
            <p className="truncate text-[11px] tabular-nums text-white/70 sm:text-xs">
              {pageLabel}
            </p>
          ) : null}
        </div>

        <Link
          href={backHref}
          className="shrink-0 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/15"
        >
          {t("backDetails")}
        </Link>
      </div>
    </header>
  );
}
