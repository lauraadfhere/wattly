"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import KindleChrome from "@/components/library/KindleChrome";
import { libraryEpubSrc, type LibraryBook } from "@/lib/library";
import {
  loadDeviceView,
  loadReadingProgress,
  saveDeviceView,
  saveReadingProgress,
  type DeviceView,
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
  locations: EpubLocations;
  renderTo: (
    el: HTMLElement,
    options: Record<string, unknown>,
  ) => EpubRendition;
  destroy: () => void;
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
  currentLocation: () => { start?: { cfi?: string } } | undefined;
};

declare global {
  interface Window {
    ePub?: (url: string) => EpubBook;
  }
}

/** Amazon Kindle-like EPUB reader: paper UI, progress %, mobile/tablet modes. */
export default function KindleEpubReader({ book }: Props) {
  const t = useTranslations("Library");
  const hostRef = useRef<HTMLDivElement>(null);
  const bookRef = useRef<EpubBook | null>(null);
  const renditionRef = useRef<EpubRendition | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fontSize, setFontSize] = useState(100);
  const [device, setDevice] = useState<DeviceView>("mobile");
  const [chromeOpen, setChromeOpen] = useState(true);
  const [percent, setPercent] = useState(0);
  const epubSrc = libraryEpubSrc(book);

  useEffect(() => {
    setDevice(loadDeviceView());
    setPercent(loadReadingProgress(book.id).percent);
  }, [book.id]);

  useEffect(() => {
    let cancelled = false;

    function loadOne(src: string, marker: string) {
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

    async function loadScript() {
      if (!window.ePub) {
        await loadOne(
          "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js",
          "jszip",
        );
        await loadOne(
          "https://cdnjs.cloudflare.com/ajax/libs/epub.js/0.3.93/epub.min.js",
          "epubjs",
        );
      }
    }

    async function boot() {
      if (!epubSrc || !hostRef.current) {
        setError(t("epubMissing"));
        return;
      }
      try {
        await loadScript();
        if (cancelled || !window.ePub || !hostRef.current) return;
        hostRef.current.innerHTML = "";
        const epubBook = window.ePub(epubSrc);
        await epubBook.ready;
        try {
          await epubBook.locations.generate(1600);
        } catch {
          // locations optional
        }

        const rendition = epubBook.renderTo(hostRef.current, {
          width: "100%",
          height: "100%",
          flow: "paginated",
          allowScriptedContent: true,
          spread: "none",
        });
        rendition.themes.default({
          body: {
            "font-family": "Georgia, 'Times New Roman', serif !important",
            "line-height": "1.7",
            background: "#f7f3e8 !important",
            color: "#1c1914 !important",
            "padding": "1rem 1.25rem !important",
          },
          p: { "margin-bottom": "0.9em" },
          a: { color: "#8b6914" },
        });

        const saved = loadReadingProgress(book.id);
        if (saved.location) {
          await rendition.display(String(saved.location));
        } else {
          await rendition.display();
        }

        rendition.on("relocated", (location: unknown) => {
          const loc = location as {
            start?: { cfi?: string; percentage?: number };
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
          setPercent(next);
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
  }, [epubSrc, book.id, t]);

  useEffect(() => {
    if (!renditionRef.current) return;
    renditionRef.current.themes.fontSize(`${fontSize}%`);
  }, [fontSize]);

  useEffect(() => {
    const host = hostRef.current;
    const rendition = renditionRef.current;
    if (!host || !rendition || !ready) return;
    const width = host.clientWidth;
    const height = host.clientHeight;
    if (width > 0 && height > 0) {
      try {
        rendition.resize(width, height);
      } catch {
        // ignore
      }
    }
  }, [device, chromeOpen, ready]);

  function onDeviceChange(view: DeviceView) {
    setDevice(view);
    saveDeviceView(view);
  }

  function seekPercent(next: number) {
    const epubBook = bookRef.current;
    const rendition = renditionRef.current;
    if (!epubBook || !rendition) return;
    const ratio = Math.max(0, Math.min(1, next / 100));
    try {
      if (epubBook.locations?.cfiFromPercentage) {
        const cfi = epubBook.locations.cfiFromPercentage(ratio);
        void rendition.display(cfi);
        return;
      }
    } catch {
      // fall through
    }
    setPercent(next);
    saveReadingProgress(book.id, { percent: next });
  }

  return (
    <KindleChrome
      title={book.title}
      author={`${book.author} · ${book.level}`}
      percent={percent}
      device={device}
      onDeviceChange={onDeviceChange}
      chromeOpen={chromeOpen}
      onToggleChrome={() => setChromeOpen((v) => !v)}
      downloadHref={epubSrc || undefined}
      downloadLabel={t("downloadEpub")}
      onSeekPercent={ready ? seekPercent : undefined}
      backHref={`/stories/library/${book.id}`}
      footerLeft={
        <>
          <button
            type="button"
            className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold text-[#f7f3e8] disabled:opacity-40"
            onClick={() => void renditionRef.current?.prev()}
            disabled={!ready}
          >
            {t("prevPage")}
          </button>
          <button
            type="button"
            className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold text-[#f7f3e8] disabled:opacity-40"
            onClick={() => void renditionRef.current?.next()}
            disabled={!ready}
          >
            {t("nextPage")}
          </button>
        </>
      }
      footerRight={
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            className="rounded bg-white/10 px-2 py-1 text-xs font-semibold text-[#f7f3e8]"
            onClick={() => setFontSize((v) => Math.max(80, v - 10))}
          >
            A−
          </button>
          <button
            type="button"
            className="rounded bg-white/10 px-2 py-1 text-xs font-semibold text-[#f7f3e8]"
            onClick={() => setFontSize((v) => Math.min(160, v + 10))}
          >
            A+
          </button>
        </div>
      }
    >
      {error ? (
        <p className="p-8 text-center text-sm text-[#8a1010]">{error}</p>
      ) : (
        <>
          <div
            ref={hostRef}
            className={`w-full touch-pan-y ${
              device === "mobile"
                ? "h-[78dvh] min-h-[28rem]"
                : "h-[84dvh] min-h-[36rem]"
            }`}
          />
          {!ready ? (
            <p className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center text-sm text-black/50">
              {t("loadingReader")}
            </p>
          ) : null}
        </>
      )}
    </KindleChrome>
  );
}
