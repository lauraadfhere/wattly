"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import KindleChrome from "@/components/library/KindleChrome";
import {
  libraryPageCount,
  libraryPdfSrc,
  type LibraryBook,
} from "@/lib/library";
import {
  loadDeviceView,
  loadReadingProgress,
  saveDeviceView,
  saveReadingProgress,
  type DeviceView,
} from "@/lib/library/reading-progress";

type Props = {
  book: LibraryBook;
  contextHtml?: string;
};

/** Kindle-style kids PDF reader with mobile/tablet switch + reading progress. */
export default function KidsPdfReader({ book, contextHtml }: Props) {
  const t = useTranslations("Library");
  const pdfSrc = libraryPdfSrc(book);
  const [tab, setTab] = useState<"pdf" | "context">("pdf");
  const [device, setDevice] = useState<DeviceView>("mobile");
  const [chromeOpen, setChromeOpen] = useState(true);
  const [percent, setPercent] = useState(0);
  const [page, setPage] = useState(1);
  const totalPages = libraryPageCount(book);

  useEffect(() => {
    setDevice(loadDeviceView());
    const saved = loadReadingProgress(book.id);
    setPercent(saved.percent);
    if (typeof saved.location === "number") setPage(saved.location);
  }, [book.id]);

  const viewerSrc = useMemo(() => {
    if (!pdfSrc) return "";
    // Full-bleed page fit inside the Kindle paper frame
    return `${pdfSrc}#page=${page}&view=FitH&zoom=page-fit&toolbar=0&navpanes=0&scrollbar=0`;
  }, [pdfSrc, page]);

  function updateProgress(nextPage: number) {
    const safe = Math.max(1, Math.min(totalPages, nextPage));
    setPage(safe);
    const nextPercent = Math.round((safe / totalPages) * 100);
    setPercent(nextPercent);
    saveReadingProgress(book.id, { percent: nextPercent, location: safe });
  }

  function seekPercent(next: number) {
    const pageFromPercent = Math.max(
      1,
      Math.min(totalPages, Math.round((next / 100) * totalPages) || 1),
    );
    updateProgress(pageFromPercent);
  }

  function onDeviceChange(view: DeviceView) {
    setDevice(view);
    saveDeviceView(view);
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setTab("pdf")}
          className={`rounded-full px-4 py-2 text-sm font-semibold ${
            tab === "pdf" ? "bg-[#1c1914] text-[#f7f3e8]" : "border border-black/15 bg-white"
          }`}
        >
          {t("pdfView")}
        </button>
        <button
          type="button"
          onClick={() => setTab("context")}
          className={`rounded-full px-4 py-2 text-sm font-semibold ${
            tab === "context" ? "bg-[#1c1914] text-[#f7f3e8]" : "border border-black/15 bg-white"
          }`}
        >
          {t("contextView")}
        </button>
      </div>

      {tab === "context" ? (
        <article className="rounded-2xl border border-[#1c1914]/15 bg-[#f7f3e8] p-5 text-[#1c1914]">
          <h3 className="font-serif text-lg font-bold">{t("contextTitle")}</h3>
          {contextHtml ? (
            <div
              className="mt-3 space-y-3 text-sm leading-7"
              dangerouslySetInnerHTML={{ __html: contextHtml }}
            />
          ) : (
            <p className="mt-3 text-sm leading-7 text-black/70">
              {book.summary}
              <br />
              <br />
              {t("contextFallback")}
            </p>
          )}
        </article>
      ) : (
        <KindleChrome
          title={book.title}
          author={book.author}
          percent={percent}
          device={device}
          onDeviceChange={onDeviceChange}
          chromeOpen={chromeOpen}
          onToggleChrome={() => setChromeOpen((v) => !v)}
          downloadHref={pdfSrc || undefined}
          downloadLabel={t("downloadPdf")}
          onSeekPercent={seekPercent}
          backHref={`/stories/library/${book.id}`}
          footerLeft={
            <>
              <button
                type="button"
                className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold text-[#f7f3e8] disabled:opacity-40"
                onClick={() => updateProgress(page - 1)}
                disabled={page <= 1}
              >
                {t("prevPage")}
              </button>
              <button
                type="button"
                className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold text-[#f7f3e8] disabled:opacity-40"
                onClick={() => updateProgress(page + 1)}
                disabled={page >= totalPages}
              >
                {t("nextPage")}
              </button>
            </>
          }
          footerRight={
            <span className="text-xs text-white/60">
              {t("pageOf", { page, total: totalPages })}
            </span>
          }
        >
          {viewerSrc ? (
            <iframe
              title={book.title}
              src={viewerSrc}
              className={`block w-full border-0 bg-[#f7f3e8] ${
                device === "mobile"
                  ? "h-[78dvh] min-h-[28rem]"
                  : "h-[84dvh] min-h-[36rem]"
              }`}
              onLoad={() => {
                if (percent < 1) updateProgress(1);
              }}
            />
          ) : (
            <p className="p-8 text-center text-sm text-[#8a1010]">{t("pdfMissing")}</p>
          )}
        </KindleChrome>
      )}
    </div>
  );
}
