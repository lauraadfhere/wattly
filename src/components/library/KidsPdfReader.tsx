"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import ReadingPageHeader from "@/components/library/ReadingPageHeader";
import {
  libraryPageCount,
  libraryPdfSrc,
  type LibraryBook,
} from "@/lib/library";
import {
  loadReadingProgress,
  saveReadingProgress,
} from "@/lib/library/reading-progress";

type Props = {
  book: LibraryBook;
  contextHtml?: string;
};

/**
 * Full-screen storybook reader:
 * special reading header, left/right page turns, page numbers, auto-fit PDF.
 */
export default function KidsPdfReader({ book }: Props) {
  const t = useTranslations("Library");
  const pdfSrc = libraryPdfSrc(book);
  const totalPages = libraryPageCount(book);
  const [page, setPage] = useState(1);
  const [percent, setPercent] = useState(0);
  const [spreadMode, setSpreadMode] = useState(false);

  useEffect(() => {
    const saved = loadReadingProgress(book.id);
    setPercent(saved.percent);
    if (typeof saved.location === "number") {
      setPage(Math.max(1, Math.min(totalPages, saved.location)));
    }
  }, [book.id, totalPages]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => setSpreadMode(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        setPage((p) => {
          const next = Math.max(1, p - 1);
          const nextPercent = Math.round((next / totalPages) * 100);
          setPercent(nextPercent);
          saveReadingProgress(book.id, { percent: nextPercent, location: next });
          return next;
        });
      }
      if (e.key === "ArrowRight" || e.key === "PageDown" || e.key === " ") {
        e.preventDefault();
        setPage((p) => {
          const next = Math.min(totalPages, p + 1);
          const nextPercent = Math.round((next / totalPages) * 100);
          setPercent(nextPercent);
          saveReadingProgress(book.id, { percent: nextPercent, location: next });
          return next;
        });
      }
      if (e.key === "Home") {
        e.preventDefault();
        setPage(1);
        saveReadingProgress(book.id, { percent: Math.round(100 / totalPages), location: 1 });
        setPercent(Math.round(100 / totalPages));
      }
      if (e.key === "End") {
        e.preventDefault();
        setPage(totalPages);
        setPercent(100);
        saveReadingProgress(book.id, { percent: 100, location: totalPages });
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [book.id, totalPages]);

  const leftPage = page;
  const rightPage = Math.min(totalPages, page + 1);
  const showSpread = spreadMode && totalPages > 1 && page < totalPages;
  const step = showSpread ? 2 : 1;

  const leftSrc = useMemo(() => {
    if (!pdfSrc) return "";
    return `${pdfSrc}#page=${leftPage}&view=Fit&toolbar=0&navpanes=0&scrollbar=0`;
  }, [pdfSrc, leftPage]);

  const rightSrc = useMemo(() => {
    if (!pdfSrc || !showSpread) return "";
    return `${pdfSrc}#page=${rightPage}&view=Fit&toolbar=0&navpanes=0&scrollbar=0`;
  }, [pdfSrc, rightPage, showSpread]);

  function goTo(nextPage: number) {
    const safe = Math.max(1, Math.min(totalPages, nextPage));
    setPage(safe);
    const nextPercent = Math.round((safe / totalPages) * 100);
    setPercent(nextPercent);
    saveReadingProgress(book.id, { percent: nextPercent, location: safe });
  }

  function turnBack() {
    goTo(Math.max(1, page - step));
  }

  function turnForward() {
    goTo(Math.min(totalPages, page + step));
  }

  const pageLabel = showSpread
    ? t("spreadOf", { left: leftPage, right: rightPage, total: totalPages })
    : t("pageOf", { page: leftPage, total: totalPages });

  return (
    <div className="flex h-full min-h-0 flex-col">
      <ReadingPageHeader
        title={book.title}
        pageLabel={pageLabel}
        backHref={`/stories/library/${book.id}`}
      />

      <div className="relative flex min-h-0 flex-1">
        {/* Left turn zone */}
        <button
          type="button"
          aria-label={t("prevPage")}
          disabled={page <= 1}
          onClick={turnBack}
          className="group absolute inset-y-0 start-0 z-20 flex w-[12%] max-w-24 items-center justify-center disabled:pointer-events-none"
        >
          <span className="rounded-full border border-white/20 bg-black/50 px-2.5 py-3 text-lg text-white opacity-70 backdrop-blur-sm transition group-hover:opacity-100 group-disabled:opacity-20 sm:px-3 sm:text-xl">
            ‹
          </span>
        </button>

        {/* Right turn zone */}
        <button
          type="button"
          aria-label={t("nextPage")}
          disabled={page >= totalPages}
          onClick={turnForward}
          className="group absolute inset-y-0 end-0 z-20 flex w-[12%] max-w-24 items-center justify-center disabled:pointer-events-none"
        >
          <span className="rounded-full border border-white/20 bg-black/50 px-2.5 py-3 text-lg text-white opacity-70 backdrop-blur-sm transition group-hover:opacity-100 group-disabled:opacity-20 sm:px-3 sm:text-xl">
            ›
          </span>
        </button>

        {/* Book stage */}
        <main className="mx-auto flex h-full w-full max-w-6xl flex-col px-10 py-3 sm:px-14 sm:py-4">
          {!pdfSrc ? (
            <p className="m-auto text-sm text-red-300">{t("pdfMissing")}</p>
          ) : (
            <div
              className={`mx-auto grid h-full min-h-0 w-full flex-1 overflow-hidden rounded-sm border-2 border-black bg-[#f7f3e8] shadow-[0_24px_60px_rgba(0,0,0,0.55)] ${
                showSpread
                  ? "grid-cols-1 md:grid-cols-2"
                  : "grid-cols-1"
              }`}
            >
              <div className="relative min-h-0 border-black/10 md:border-e-2">
                <iframe
                  key={`L-${leftPage}`}
                  title={`${book.title} — ${t("pageOf", { page: leftPage, total: totalPages })}`}
                  src={leftSrc}
                  className="absolute inset-0 h-full w-full border-0 bg-[#f7f3e8]"
                  onLoad={() => {
                    if (percent < 1) goTo(1);
                  }}
                />
                <span className="pointer-events-none absolute bottom-2 start-1/2 z-10 -translate-x-1/2 rounded-full bg-black/55 px-2.5 py-0.5 text-[11px] font-semibold tabular-nums text-white backdrop-blur-sm">
                  {leftPage}
                </span>
              </div>

              {showSpread ? (
                <div className="relative hidden min-h-0 md:block">
                  <iframe
                    key={`R-${rightPage}`}
                    title={`${book.title} — ${t("pageOf", { page: rightPage, total: totalPages })}`}
                    src={rightSrc}
                    className="absolute inset-0 h-full w-full border-0 bg-[#f7f3e8]"
                  />
                  <span className="pointer-events-none absolute bottom-2 start-1/2 z-10 -translate-x-1/2 rounded-full bg-black/55 px-2.5 py-0.5 text-[11px] font-semibold tabular-nums text-white backdrop-blur-sm">
                    {rightPage}
                  </span>
                </div>
              ) : null}
            </div>
          )}

          {/* Footer page strip */}
          <div className="mt-3 flex shrink-0 items-center justify-between gap-3 text-xs text-white/70">
            <button
              type="button"
              onClick={turnBack}
              disabled={page <= 1}
              className="rounded-full border border-white/20 bg-white/5 px-3 py-1.5 font-semibold text-white disabled:opacity-30"
            >
              {t("prevPage")}
            </button>
            <div className="flex min-w-0 flex-col items-center gap-1">
              <p className="tabular-nums font-semibold text-white">{pageLabel}</p>
              <div className="h-1 w-40 max-w-[40vw] overflow-hidden rounded-full bg-white/15 sm:w-56">
                <div
                  className="h-full rounded-full bg-white/80 transition-[width]"
                  style={{ width: `${Math.max(percent, Math.round((page / totalPages) * 100))}%` }}
                />
              </div>
            </div>
            <button
              type="button"
              onClick={turnForward}
              disabled={page >= totalPages}
              className="rounded-full border border-white/20 bg-white/5 px-3 py-1.5 font-semibold text-white disabled:opacity-30"
            >
              {t("nextPage")}
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
