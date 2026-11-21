"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import type { Lesson } from "@/lib/lessons/types";
import LessonArtMark from "./LessonArtMark";

type LessonEditorPopupProps = {
  lessons: Lesson[];
  index: number;
  onClose: () => void;
  onChangeIndex: (index: number) => void;
};

const sectionTone: Record<string, string> = {
  goal: "border-[#ffc933] bg-[#ffc933]/15",
  words: "border-[#38bdf8] bg-[#38bdf8]/10",
  play: "border-[#22c55e] bg-[#22c55e]/10",
  practice: "border-[#a855f7] bg-[#a855f7]/10",
  story: "border-[#f97316] bg-[#f97316]/10",
  challenge: "border-[#ef4444] bg-[#ef4444]/10",
};

export default function LessonEditorPopup({
  lessons,
  index,
  onClose,
  onChangeIndex,
}: LessonEditorPopupProps) {
  const t = useTranslations("Lessons");
  const lesson = lessons[index];
  const total = lessons.length;
  const [fullscreen, setFullscreen] = useState(true);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (fullscreen) {
          setFullscreen(false);
          return;
        }
        onClose();
      }
      if (event.key === "ArrowRight" && index < total - 1) onChangeIndex(index + 1);
      if (event.key === "ArrowLeft" && index > 0) onChangeIndex(index - 1);
      if (event.key.toLowerCase() === "f") setFullscreen((value) => !value);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [index, total, onClose, onChangeIndex, fullscreen]);

  if (!lesson) return null;

  return (
    <div
      className={`fixed inset-0 z-[60] flex items-stretch justify-center bg-black/60 ${
        fullscreen ? "p-0" : "p-0 sm:p-4"
      }`}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="lesson-editor-title"
        className={`flex flex-col overflow-hidden border-2 border-black bg-[#faf8f4] text-black shadow-[0_24px_60px_rgba(0,0,0,0.35)] ${
          fullscreen
            ? "h-dvh w-screen max-w-none rounded-none"
            : "h-full w-full max-w-3xl sm:h-[min(92dvh,880px)]"
        }`}
      >
        <header
          className="relative shrink-0 border-b-2 border-black px-4 py-3 text-white sm:px-6"
          style={{ backgroundColor: lesson.accent }}
        >
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full opacity-25"
            aria-hidden="true"
          >
            <defs>
              <pattern id="lesson-editor-forms" width="120" height="48" patternUnits="userSpaceOnUse">
                <rect x="8" y="16" width="18" height="4" fill="#000" opacity="0.35" />
                <rect x="8" y="24" width="18" height="4" fill="#000" opacity="0.35" />
                <rect x="40" y="18" width="10" height="10" fill="#000" opacity="0.3" />
                <path d="M70 30 L88 30 L88 14 Z" fill="#000" opacity="0.3" />
                <circle cx="104" cy="22" r="8" fill="none" stroke="#000" strokeWidth="2" opacity="0.35" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#lesson-editor-forms)" />
          </svg>

          <div className="relative flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full bg-black/20 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider">
                  <LessonArtMark art={lesson.art} className="h-4 w-4 text-white" />
                  {t("editorLabel")}
                </span>
                <span className="text-[11px] font-semibold text-white/85">
                  {t("progress", { current: index + 1, total })}
                </span>
                <span className="text-[11px] text-white/75">· {lesson.minutes} min</span>
                {fullscreen ? (
                  <span className="rounded-full bg-black/25 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide">
                    {t("fullscreenOn")}
                  </span>
                ) : null}
              </div>
              <h2
                id="lesson-editor-title"
                className="mt-2 truncate text-xl font-bold tracking-tight sm:text-2xl"
              >
                {lesson.title}
              </h2>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {lesson.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-black/25 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={() => setFullscreen((value) => !value)}
                className="flex h-10 items-center gap-1.5 border-2 border-black bg-white px-3 text-xs font-bold text-black hover:bg-[#ffc933]"
                aria-pressed={fullscreen}
                aria-label={fullscreen ? t("exitFullscreen") : t("enterFullscreen")}
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                  {fullscreen ? (
                    <path d="M9 9H4V4M15 9h5V4M9 15H4v5M15 15h5v5" strokeLinecap="round" />
                  ) : (
                    <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" strokeLinecap="round" />
                  )}
                </svg>
                {fullscreen ? t("exitFullscreen") : t("enterFullscreen")}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center border-2 border-black bg-black text-white hover:bg-[#1a1a1a]"
                aria-label={t("close")}
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>

          <div className="relative mt-3 flex items-center justify-between gap-2">
            <button
              type="button"
              disabled={index <= 0}
              onClick={() => onChangeIndex(index - 1)}
              className="border-2 border-black bg-white px-3 py-1.5 text-xs font-bold text-black disabled:opacity-35"
            >
              {t("previous")}
            </button>
            <button
              type="button"
              disabled={index >= total - 1}
              onClick={() => onChangeIndex(index + 1)}
              className="border-2 border-black bg-[#ffc933] px-3 py-1.5 text-xs font-bold text-black disabled:opacity-35"
            >
              {t("next")}
            </button>
          </div>
        </header>

        <div
          className={`min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-8 ${
            fullscreen ? "mx-auto w-full max-w-5xl lg:px-12" : "sm:px-6"
          }`}
        >
          <p className="max-w-3xl text-sm leading-6 text-black/70 sm:text-base">{lesson.summary}</p>

          <div className={`mt-5 grid gap-3 ${fullscreen ? "lg:grid-cols-2" : ""}`}>
            {lesson.sections.map((section) => (
              <section
                key={`${lesson.id}-${section.type}-${section.title}`}
                className={`border-2 p-4 sm:p-5 ${sectionTone[section.type] ?? "border-black/20 bg-white"} ${
                  fullscreen && (section.type === "story" || section.type === "challenge")
                    ? "lg:col-span-2"
                    : ""
                }`}
              >
                <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-black/70">
                  {section.title}
                </h3>
                {section.body ? (
                  <p className="mt-2 text-sm leading-6 text-black/85 sm:text-base">{section.body}</p>
                ) : null}
                {section.items?.length ? (
                  <ul className="mt-2 space-y-1.5">
                    {section.items.map((item) => (
                      <li key={item} className="flex gap-2 text-sm leading-6 text-black/85 sm:text-base">
                        <span
                          className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-black"
                          aria-hidden="true"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}
          </div>
        </div>

        <footer className="flex shrink-0 items-center justify-between gap-3 border-t-2 border-black bg-white px-4 py-3 sm:px-6">
          <p className="text-xs text-black/55">{t("editorHint")}</p>
          <button
            type="button"
            disabled={index >= total - 1}
            onClick={() => onChangeIndex(index + 1)}
            className="border-2 border-black bg-black px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
          >
            {index >= total - 1 ? t("done") : t("nextLesson")}
          </button>
        </footer>
      </div>
    </div>
  );
}
