"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { libraryEpubSrc, libraryPageCount, type LibraryBook } from "@/lib/library";
import {
  loadReadingProgress,
  saveReadingProgress,
} from "@/lib/library/reading-progress";

type Props = {
  book: LibraryBook;
};

type EpubLocations = {
  generate: (chars: number) => Promise<unknown>;
  percentageFromCfi: (cfi: string) => number;
  cfiFromPercentage: (percentage: number) => string;
  length: () => number;
};

type EpubBook = {
  ready: Promise<unknown>;
  opened?: Promise<unknown>;
  locations: EpubLocations;
  renderTo: (
    el: HTMLElement,
    options: Record<string, unknown>,
  ) => EpubRendition;
  destroy: () => void;
};

type EpubContents = {
  document?: Document;
  find?: (query: string) => unknown[];
};

type EpubRendition = {
  display: (target?: string | number) => Promise<unknown>;
  next: () => Promise<unknown>;
  prev: () => Promise<unknown>;
  resize: (width: number, height: number) => void;
  themes: {
    default: (styles: Record<string, Record<string, string>>) => void;
    fontSize: (size: string) => void;
  };
  on: (event: string, cb: (...args: unknown[]) => void) => void;
  getContents: () => EpubContents[];
  currentLocation: () => { start?: { cfi?: string } } | undefined;
};

declare global {
  interface Window {
    ePub?: (url: string | ArrayBuffer, options?: Record<string, unknown>) => EpubBook;
  }
}

function waitForSize(el: HTMLElement, timeoutMs = 8000) {
  return new Promise<{ width: number; height: number }>((resolve, reject) => {
    const measure = () => ({
      width: Math.floor(el.clientWidth),
      height: Math.floor(el.clientHeight),
    });
    const first = measure();
    if (first.width > 40 && first.height > 40) {
      resolve(first);
      return;
    }
    const started = Date.now();
    const ro = new ResizeObserver(() => {
      const size = measure();
      if (size.width > 40 && size.height > 40) {
        ro.disconnect();
        resolve(size);
      } else if (Date.now() - started > timeoutMs) {
        ro.disconnect();
        reject(new Error("Reader area has no size"));
      }
    });
    ro.observe(el);
  });
}

function loadScript(src: string, marker: string) {
  return new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[data-${marker}]`,
    );
    if (existing) {
      if ((marker === "epubjs" && window.ePub) || marker === "jszip") {
        resolve();
        return;
      }
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error(`${marker} failed`)));
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.dataset[marker] = "1";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`${marker} failed`));
    document.body.appendChild(script);
  });
}

/**
 * Kindle Cloud Reader–style EPUB UI (separate from the PDF storybook reader).
 * Preserves Wattly logo + reading shell; white spread, circular arrows, location scrubber.
 */
export default function KindleEpubReader({ book }: Props) {
  const t = useTranslations("Library");
  const hostRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const bookRef = useRef<EpubBook | null>(null);
  const renditionRef = useRef<EpubRendition | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fontSize, setFontSize] = useState(100);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchHits, setSearchHits] = useState(0);
  const [savedFlash, setSavedFlash] = useState(false);
  const [percent, setPercent] = useState(0);
  const [locationIndex, setLocationIndex] = useState(1);
  const [locationTotal, setLocationTotal] = useState(libraryPageCount(book) * 6);
  const [currentCfi, setCurrentCfi] = useState<string | undefined>();
  const remoteSrc = libraryEpubSrc(book);
  const proxySrc = `/api/library/epub/${book.id}`;

  useEffect(() => {
    setPercent(loadReadingProgress(book.id).percent);
  }, [book.id]);

  useEffect(() => {
    let cancelled = false;

    async function boot() {
      if (!remoteSrc || !hostRef.current) {
        setError(t("epubMissing"));
        return;
      }

      try {
        await loadScript(
          "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js",
          "jszip",
        );
        await loadScript(
          "https://cdnjs.cloudflare.com/ajax/libs/epub.js/0.3.93/epub.min.js",
          "epubjs",
        );
        if (cancelled || !window.ePub || !hostRef.current) return;

        // Prefer same-origin proxy, fall back to Cloudinary raw URL
        let buffer: ArrayBuffer | null = null;
        let lastError: unknown = null;
        for (const src of [proxySrc, remoteSrc]) {
          try {
            const res = await fetch(src);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            buffer = await res.arrayBuffer();
            if (buffer.byteLength < 100) throw new Error("Empty EPUB");
            break;
          } catch (err) {
            lastError = err;
          }
        }
        if (!buffer) {
          throw lastError instanceof Error
            ? lastError
            : new Error(t("epubFailed"));
        }

        hostRef.current.innerHTML = "";
        const epubBook = window.ePub(buffer);
        await epubBook.ready;
        if (epubBook.opened) await epubBook.opened;

        try {
          await epubBook.locations.generate(1200);
          const len = epubBook.locations.length?.() || 0;
          if (len > 0) setLocationTotal(len);
        } catch {
          // locations optional
        }

        const size = await waitForSize(hostRef.current);
        if (cancelled) return;

        const wide = size.width >= 720;
        const rendition = epubBook.renderTo(hostRef.current, {
          width: size.width,
          height: size.height,
          flow: "paginated",
          spread: wide ? "always" : "none",
          allowScriptedContent: true,
        });

        rendition.themes.default({
          body: {
            "font-family":
              "Georgia, 'Bookerly', 'Times New Roman', serif !important",
            "line-height": "1.65",
            background: "#ffffff !important",
            color: "#111111 !important",
            "padding": "1.5rem 1.75rem !important",
          },
          p: { "margin-bottom": "0.85em", "font-size": "1.05em" },
          h1: {
            "font-size": "1.6em",
            "text-align": "center",
            "margin": "1.2em 0 0.8em",
          },
          h2: {
            "font-size": "1.25em",
            "text-align": "center",
            "margin": "1em 0 0.7em",
          },
          a: { color: "#0a66c2" },
        });
        rendition.themes.fontSize(`${fontSize}%`);

        const saved = loadReadingProgress(book.id);
        if (saved.location) {
          await rendition.display(String(saved.location));
        } else {
          await rendition.display();
        }

        rendition.on("relocated", (location: unknown) => {
          const loc = location as {
            start?: { cfi?: string; percentage?: number; location?: number };
            atEnd?: boolean;
          };
          let next = 0;
          if (typeof loc.start?.percentage === "number") {
            next = Math.round(loc.start.percentage * 100);
          } else if (loc.start?.cfi && epubBook.locations?.percentageFromCfi) {
            try {
              next = Math.round(
                epubBook.locations.percentageFromCfi(loc.start.cfi) * 100,
              );
            } catch {
              next = 0;
            }
          }
          if (loc.atEnd) next = 100;

          const total = epubBook.locations?.length?.() || locationTotal;
          const idx =
            typeof loc.start?.location === "number"
              ? loc.start.location + 1
              : Math.max(1, Math.round((next / 100) * Math.max(total, 1)));

          setPercent(next);
          setLocationIndex(idx);
          if (total > 0) setLocationTotal(total);
          if (loc.start?.cfi) setCurrentCfi(loc.start.cfi);
          saveReadingProgress(book.id, {
            percent: next,
            location: loc.start?.cfi || saved.location,
          });
        });

        bookRef.current = epubBook;
        renditionRef.current = rendition;
        setReady(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : t("epubFailed"));
      }
    }

    void boot();

    return () => {
      cancelled = true;
      try {
        bookRef.current?.destroy();
      } catch {
        // ignore
      }
      bookRef.current = null;
      renditionRef.current = null;
    };
    // fontSize applied in a separate effect after boot
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [book.id, remoteSrc, proxySrc, t]);

  useEffect(() => {
    if (!renditionRef.current || !ready) return;
    renditionRef.current.themes.fontSize(`${fontSize}%`);
  }, [fontSize, ready]);

  useEffect(() => {
    const host = hostRef.current;
    const rendition = renditionRef.current;
    if (!host || !rendition || !ready) return;

    const resize = () => {
      const width = Math.floor(host.clientWidth);
      const height = Math.floor(host.clientHeight);
      if (width > 40 && height > 40) {
        try {
          rendition.resize(width, height);
        } catch {
          // ignore
        }
      }
    };

    const ro = new ResizeObserver(resize);
    ro.observe(host);
    window.addEventListener("resize", resize);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, [ready]);

  function seekPercent(next: number) {
    const epubBook = bookRef.current;
    const rendition = renditionRef.current;
    if (!epubBook || !rendition) return;
    const ratio = Math.max(0, Math.min(1, next / 100));
    try {
      if (epubBook.locations?.cfiFromPercentage) {
        void rendition.display(epubBook.locations.cfiFromPercentage(ratio));
        return;
      }
    } catch {
      // fall through
    }
    setPercent(next);
  }

  function seekFromPointer(clientX: number) {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    seekPercent(Math.round(ratio * 100));
  }

  function runSearch() {
    const q = searchQuery.trim();
    if (!q || !renditionRef.current) {
      setSearchHits(0);
      return;
    }
    let hits = 0;
    try {
      const contents = renditionRef.current.getContents?.() || [];
      for (const content of contents) {
        if (typeof content.find === "function") {
          const found = content.find(q) || [];
          hits += Array.isArray(found) ? found.length : 0;
          continue;
        }
        const text = content.document?.body?.innerText || "";
        if (!text) continue;
        const lower = text.toLowerCase();
        const needle = q.toLowerCase();
        let idx = 0;
        while ((idx = lower.indexOf(needle, idx)) !== -1) {
          hits += 1;
          idx += needle.length;
        }
      }
    } catch {
      hits = 0;
    }
    setSearchHits(hits);
  }

  function saveBookmark() {
    const cfi =
      currentCfi ||
      renditionRef.current?.currentLocation?.()?.start?.cfi ||
      loadReadingProgress(book.id).location;
    if (!cfi) return;
    saveReadingProgress(book.id, {
      percent,
      location: String(cfi),
    });
    setSavedFlash(true);
    window.setTimeout(() => setSavedFlash(false), 1600);
  }

  const clamped = Math.max(0, Math.min(100, percent));
  const backHref = `/stories/library/${book.id}`;

  return (
    <div className="flex h-full min-h-0 flex-col bg-[#1a1a1a]">
      {/* Dim store-like backdrop */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(80,80,80,0.35),_#0d0d0d_70%)]" />

      <div className="relative z-10 mx-auto flex h-full w-full max-w-6xl flex-col px-2 py-2 sm:px-4 sm:py-3">
        {/* Kindle Cloud–style white reader card */}
        <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-sm bg-white shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
          {/* Header: Wattly logo + back | title | Aa */}
          <header className="flex h-12 shrink-0 items-center gap-2 border-b border-black/10 px-3 sm:h-14 sm:px-4">
            <Link href="/dashboard" className="shrink-0" aria-label="Wattly">
              <Image
                src="/brand/wattly-logo-blue.png"
                alt="Wattly"
                width={1000}
                height={280}
                className="h-6 w-auto sm:h-7"
                priority
              />
            </Link>
            <Link
              href={backHref}
              className="inline-flex shrink-0 items-center gap-1 text-sm text-[#333] hover:underline"
            >
              <span aria-hidden>‹</span>
              <span className="hidden sm:inline">{t("backDetails")}</span>
            </Link>

            <p className="min-w-0 flex-1 truncate text-center text-sm font-medium text-[#333]">
              {book.title}
            </p>

            <div className="relative flex shrink-0 items-center gap-0.5">
              <button
                type="button"
                onClick={() => {
                  setSearchOpen((v) => !v);
                  setSettingsOpen(false);
                }}
                className="rounded p-1.5 text-[#333] hover:bg-black/5"
                aria-label={t("readerSearch")}
                title={t("readerSearch")}
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="7" />
                  <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
                </svg>
              </button>
              <button
                type="button"
                onClick={saveBookmark}
                disabled={!ready}
                className="rounded p-1.5 text-[#333] hover:bg-black/5 disabled:opacity-40"
                aria-label={t("readerSave")}
                title={t("readerSave")}
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 4h12v16l-6-3.5L6 20V4z" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => {
                  setSettingsOpen((v) => !v);
                  setSearchOpen(false);
                }}
                className="rounded px-2 py-1 text-sm font-semibold text-[#333] hover:bg-black/5"
                aria-label={t("fontSize")}
              >
                Aa
              </button>
              {settingsOpen ? (
                <div className="absolute end-0 top-full z-30 mt-1 flex gap-1 rounded border border-black/10 bg-white p-2 shadow-lg">
                  <button
                    type="button"
                    className="rounded bg-black/5 px-2 py-1 text-xs font-bold"
                    onClick={() => setFontSize((v) => Math.max(80, v - 10))}
                  >
                    A−
                  </button>
                  <button
                    type="button"
                    className="rounded bg-black/5 px-2 py-1 text-xs font-bold"
                    onClick={() => setFontSize((v) => Math.min(160, v + 10))}
                  >
                    A+
                  </button>
                </div>
              ) : null}
            </div>
          </header>

          {searchOpen ? (
            <div className="flex flex-wrap items-center gap-2 border-b border-black/10 bg-[#fafafa] px-3 py-2">
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") runSearch();
                }}
                placeholder={t("readerSearchPlaceholder")}
                className="min-w-0 flex-1 rounded-lg border border-black/15 bg-white px-3 py-1.5 text-sm text-[#222] outline-none focus:border-[#3d81c8]"
              />
              <button
                type="button"
                onClick={runSearch}
                className="rounded-lg bg-[#1c1914] px-3 py-1.5 text-xs font-bold text-white"
              >
                {t("readerSearch")}
              </button>
              <span className="text-xs text-[#555]">
                {searchQuery.trim()
                  ? t("readerSearchHits", { count: searchHits })
                  : ""}
              </span>
            </div>
          ) : null}

          {savedFlash ? (
            <p className="border-b border-[#c45c00]/20 bg-[#fff8ef] px-3 py-1.5 text-center text-xs font-semibold text-[#c45c00]">
              {t("readerSaved")}
            </p>
          ) : null}

          {/* Page stage */}
          <div className="relative min-h-0 flex-1 bg-white">
            <button
              type="button"
              aria-label={t("prevPage")}
              disabled={!ready}
              onClick={() => void renditionRef.current?.prev()}
              className="absolute inset-y-0 start-0 z-20 flex w-12 items-center justify-center disabled:opacity-30 sm:w-14"
            >
              <span className="flex size-10 items-center justify-center rounded-full border border-black/15 bg-white/80 text-xl text-[#333] shadow-sm backdrop-blur-sm sm:size-11">
                ‹
              </span>
            </button>
            <button
              type="button"
              aria-label={t("nextPage")}
              disabled={!ready}
              onClick={() => void renditionRef.current?.next()}
              className="absolute inset-y-0 end-0 z-20 flex w-12 items-center justify-center disabled:opacity-30 sm:w-14"
            >
              <span className="flex size-10 items-center justify-center rounded-full border border-black/15 bg-white/80 text-xl text-[#333] shadow-sm backdrop-blur-sm sm:size-11">
                ›
              </span>
            </button>

            {error ? (
              <p className="absolute inset-0 flex items-center justify-center px-6 text-center text-sm text-[#8a1010]">
                {error}
              </p>
            ) : (
              <>
                <div
                  ref={hostRef}
                  className="absolute inset-x-12 inset-y-0 sm:inset-x-14"
                />
                {!ready ? (
                  <p className="absolute inset-0 flex items-center justify-center text-sm text-black/45">
                    {t("loadingReader")}
                  </p>
                ) : null}
              </>
            )}
          </div>

          {/* Kindle footer: scrubber + Location X of Y • Z% */}
          <footer className="shrink-0 border-t border-black/10 px-4 py-3 sm:px-6">
            <div
              ref={trackRef}
              role="slider"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={clamped}
              aria-label={t("locationLabel")}
              tabIndex={0}
              className="relative h-1.5 cursor-pointer rounded-full bg-[#d8d8d8] touch-none"
              onClick={(e) => seekFromPointer(e.clientX)}
              onPointerDown={(e) => {
                e.currentTarget.setPointerCapture(e.pointerId);
                seekFromPointer(e.clientX);
              }}
              onPointerMove={(e) => {
                if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
                seekFromPointer(e.clientX);
              }}
              onKeyDown={(e) => {
                if (e.key === "ArrowRight") seekPercent(Math.min(100, clamped + 5));
                if (e.key === "ArrowLeft") seekPercent(Math.max(0, clamped - 5));
              }}
            >
              <div
                className="h-full rounded-full bg-[#3d81c8]"
                style={{ width: `${clamped}%` }}
              />
              <span
                className="absolute top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#cfcfcf] bg-white shadow"
                style={{ left: `${clamped}%` }}
                aria-hidden
              />
            </div>
            <p className="mt-2 text-center text-xs tabular-nums text-[#555]">
              {t("kindleLocation", {
                location: locationIndex,
                total: Math.max(locationTotal, locationIndex),
                percent: clamped,
              })}
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
