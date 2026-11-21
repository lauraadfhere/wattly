"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { DeviceView } from "@/lib/library/reading-progress";

type KindleChromeProps = {
  title: string;
  author?: string;
  percent: number;
  device: DeviceView;
  onDeviceChange: (view: DeviceView) => void;
  chromeOpen: boolean;
  onToggleChrome: () => void;
  downloadHref?: string;
  downloadLabel: string;
  children: React.ReactNode;
  footerLeft?: React.ReactNode;
  footerRight?: React.ReactNode;
  /** Kindle-style scrub: jump to a 0–100 reading location. */
  onSeekPercent?: (percent: number) => void;
  backHref?: string;
};

/** Amazon Kindle-like shell: paper frame, progress bar, mobile/tablet switch. */
export default function KindleChrome({
  title,
  author,
  percent,
  device,
  onDeviceChange,
  chromeOpen,
  onToggleChrome,
  downloadHref,
  downloadLabel,
  children,
  footerLeft,
  footerRight,
  onSeekPercent,
  backHref = "/stories",
}: KindleChromeProps) {
  const t = useTranslations("Library");
  const trackRef = useRef<HTMLDivElement>(null);
  const clamped = Math.max(0, Math.min(100, percent));

  function seekFromPointer(clientX: number) {
    if (!onSeekPercent || !trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    onSeekPercent(Math.round(ratio * 100));
  }

  return (
    <div className="mx-auto w-full max-w-5xl">
      {/* 2-option device switch: Mobile | Tablet */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div
          role="group"
          aria-label={t("deviceSwitch")}
          className="inline-flex rounded-full border border-[#1c1914]/20 bg-[#f7f3e8] p-1"
        >
          <button
            type="button"
            onClick={() => onDeviceChange("mobile")}
            className={`rounded-full px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide ${
              device === "mobile"
                ? "bg-[#1c1914] text-[#f7f3e8]"
                : "text-[#1c1914]/60"
            }`}
          >
            {t("viewMobile")}
          </button>
          <button
            type="button"
            onClick={() => onDeviceChange("tablet")}
            className={`rounded-full px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide ${
              device === "tablet"
                ? "bg-[#1c1914] text-[#f7f3e8]"
                : "text-[#1c1914]/60"
            }`}
          >
            {t("viewTablet")}
          </button>
        </div>
        <button
          type="button"
          onClick={onToggleChrome}
          className="rounded-full border border-[#1c1914]/15 bg-white px-3 py-1.5 text-xs font-semibold text-[#1c1914]"
        >
          {chromeOpen ? t("hideChrome") : t("showChrome")}
        </button>
      </div>

      <div
        className={`overflow-hidden border border-[#1c1914]/25 bg-[#1c1914] shadow-[0_20px_50px_rgba(0,0,0,0.28)] ${
          device === "mobile"
            ? "mx-auto max-w-[26.5rem] rounded-[1.75rem]"
            : "mx-auto max-w-[52rem] rounded-[1.15rem]"
        }`}
      >
        {chromeOpen ? (
          <div className="flex items-center justify-between gap-3 border-b border-white/10 px-3 py-2.5 text-[#f7f3e8]">
            <Link href={backHref} className="text-xs font-semibold text-[#d4a574]">
              {t("backDetails")}
            </Link>
            <div className="min-w-0 flex-1 text-center">
              <p className="truncate font-serif text-sm font-semibold">{title}</p>
              {author ? (
                <p className="truncate text-[11px] text-white/50">{author}</p>
              ) : null}
            </div>
            {downloadHref ? (
              <a
                href={downloadHref}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 text-xs font-semibold text-[#d4a574]"
              >
                {downloadLabel}
              </a>
            ) : (
              <span className="w-12" />
            )}
          </div>
        ) : null}

        <div
          className={`relative bg-[#f7f3e8] ${
            device === "mobile" ? "min-h-[78dvh]" : "min-h-[84dvh]"
          }`}
        >
          {children}
        </div>

        {/* Kindle footer: location + scrubbable % progress */}
        <div className="border-t border-white/10 bg-[#1c1914] px-3 py-2.5 text-[#f7f3e8]">
          <div className="mb-1.5 flex items-center justify-between text-[11px] text-white/65">
            <span>{t("locationLabel")}</span>
            <span className="font-semibold tabular-nums text-[#d4a574]">
              {t("percentRead", { percent: clamped })}
            </span>
          </div>
          <div
            ref={trackRef}
            role={onSeekPercent ? "slider" : "progressbar"}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={clamped}
            aria-label={t("locationLabel")}
            tabIndex={onSeekPercent ? 0 : undefined}
            className={`relative h-2 overflow-hidden rounded-full bg-white/15 ${
              onSeekPercent ? "cursor-pointer touch-none" : ""
            }`}
            onClick={(e) => seekFromPointer(e.clientX)}
            onKeyDown={(e) => {
              if (!onSeekPercent) return;
              if (e.key === "ArrowRight") onSeekPercent(Math.min(100, clamped + 5));
              if (e.key === "ArrowLeft") onSeekPercent(Math.max(0, clamped - 5));
            }}
            onPointerDown={(e) => {
              if (!onSeekPercent) return;
              e.currentTarget.setPointerCapture(e.pointerId);
              seekFromPointer(e.clientX);
            }}
            onPointerMove={(e) => {
              if (!onSeekPercent || !e.currentTarget.hasPointerCapture(e.pointerId)) return;
              seekFromPointer(e.clientX);
            }}
          >
            <div
              className="h-full rounded-full bg-[#d4a574] transition-[width] duration-150"
              style={{ width: `${clamped}%` }}
            />
            <span
              className="absolute top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f7f3e8] shadow"
              style={{ left: `${clamped}%` }}
              aria-hidden
            />
          </div>
          {(footerLeft || footerRight) && chromeOpen ? (
            <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap gap-2">{footerLeft}</div>
              <div className="flex flex-wrap gap-2">{footerRight}</div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
