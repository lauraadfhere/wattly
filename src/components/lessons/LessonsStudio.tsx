"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import {
  filterAdvancedLessons,
  filterKidsLessons,
  type AdvancedLevel,
  type KidsLevel,
  type Lesson,
  type LessonTrack,
} from "@/lib/lessons";
import LessonArtMark from "./LessonArtMark";
import LessonEditorPopup from "./LessonEditorPopup";

type Step = "track" | "level" | "list";

export default function LessonsStudio() {
  const t = useTranslations("Lessons");
  const [step, setStep] = useState<Step>("track");
  const [track, setTrack] = useState<LessonTrack | null>(null);
  const [kidsLevel, setKidsLevel] = useState<KidsLevel | null>(null);
  const [advancedLevel, setAdvancedLevel] = useState<AdvancedLevel | null>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const lessons: Lesson[] = useMemo(() => {
    if (track === "kids" && kidsLevel) return filterKidsLessons(kidsLevel);
    if (track === "advanced" && advancedLevel) return filterAdvancedLessons(advancedLevel);
    return [];
  }, [track, kidsLevel, advancedLevel]);

  function pickTrack(next: LessonTrack) {
    setTrack(next);
    setKidsLevel(null);
    setAdvancedLevel(null);
    setOpenIndex(null);
    setStep("level");
  }

  function pickKidsLevel(level: KidsLevel) {
    setKidsLevel(level);
    setStep("list");
  }

  function pickAdvancedLevel(level: AdvancedLevel) {
    setAdvancedLevel(level);
    setStep("list");
  }

  function resetToTrack() {
    setStep("track");
    setTrack(null);
    setKidsLevel(null);
    setAdvancedLevel(null);
    setOpenIndex(null);
  }

  const kidsLevels: { id: KidsLevel; ages: string }[] = [
    { id: "beginner", ages: "5–6" },
    { id: "growing", ages: "7" },
    { id: "confident", ages: "8–9" },
  ];

  const advancedLevels: { id: AdvancedLevel; label: string }[] = [
    { id: "b1", label: "B1" },
    { id: "b2", label: "B2" },
    { id: "c1", label: "C1" },
  ];

  return (
    <div className="relative">
      {/* Decorative arts strip */}
      <div
        className="pointer-events-none absolute -inset-x-2 -top-2 h-24 overflow-hidden opacity-40"
        aria-hidden="true"
      >
        <svg className="h-full w-full" viewBox="0 0 800 96" preserveAspectRatio="none">
          <rect x="20" y="36" width="40" height="8" fill="#2f2f2f" />
          <rect x="20" y="50" width="40" height="8" fill="#2f2f2f" />
          <rect x="90" y="44" width="16" height="16" fill="#333" />
          <rect x="104" y="30" width="16" height="16" fill="#333" />
          <path d="M160 64 L200 64 L200 28 Z" fill="#2f2f2f" />
          <rect x="230" y="32" width="28" height="28" fill="#2a2a2a" />
          <circle cx="258" cy="46" r="14" fill="#f4f4f5" stroke="#333" strokeWidth="3" />
        </svg>
      </div>

      {step !== "track" ? (
        <button
          type="button"
          onClick={() => (step === "list" ? setStep("level") : resetToTrack())}
          className="relative mb-6 text-sm font-semibold text-[#0016BD] underline underline-offset-4"
        >
          {t("back")}
        </button>
      ) : null}

      {step === "track" ? (
        <div className="relative">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0016BD]">
            {t("selectEyebrow")}
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            {t("selectTitle")}
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-black/65">{t("selectBody")}</p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => pickTrack("kids")}
              className="group flex min-h-[200px] flex-col border-2 border-[#22c55e] bg-[#f4f4f5] p-6 text-start transition hover:-translate-y-0.5 hover:bg-white"
            >
              <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#22c55e] text-black">
                <LessonArtMark art="garden" className="h-6 w-6" />
              </span>
              <h3 className="text-xl font-bold">{t("kidsTitle")}</h3>
              <p className="mt-2 flex-1 text-sm leading-6 text-black/65">{t("kidsBody")}</p>
              <span className="mt-4 text-sm font-semibold text-[#15803d] underline underline-offset-4">
                {t("kidsCta")}
              </span>
            </button>

            <button
              type="button"
              onClick={() => pickTrack("advanced")}
              className="group flex min-h-[200px] flex-col border-2 border-[#0016BD] bg-[#f4f4f5] p-6 text-start transition hover:-translate-y-0.5 hover:bg-white"
            >
              <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#0016BD] text-white">
                <LessonArtMark art="debate" className="h-6 w-6 text-white" />
              </span>
              <h3 className="text-xl font-bold">{t("advancedTitle")}</h3>
              <p className="mt-2 flex-1 text-sm leading-6 text-black/65">{t("advancedBody")}</p>
              <span className="mt-4 text-sm font-semibold text-[#0016BD] underline underline-offset-4">
                {t("advancedCta")}
              </span>
            </button>
          </div>
        </div>
      ) : null}

      {step === "level" && track === "kids" ? (
        <div className="relative">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#22c55e]">
            {t("kidsTitle")}
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">{t("kidsLevelTitle")}</h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-black/65">{t("kidsLevelBody")}</p>

          <ul className="mt-8 grid gap-3 sm:grid-cols-3">
            {kidsLevels.map((level) => (
              <li key={level.id}>
                <button
                  type="button"
                  onClick={() => pickKidsLevel(level.id)}
                  className="flex h-full w-full flex-col border-2 border-black bg-white p-5 text-start transition hover:-translate-y-0.5 hover:bg-[#ffc933]/25"
                >
                  <span className="text-xs font-bold uppercase tracking-wider text-black/50">
                    {t("ages", { range: level.ages })}
                  </span>
                  <span className="mt-2 text-lg font-bold">{t(`kidsLevel.${level.id}`)}</span>
                  <span className="mt-3 text-sm text-black/65">
                    {t(`kidsLevelHint.${level.id}`)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {step === "level" && track === "advanced" ? (
        <div className="relative">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0016BD]">
            {t("advancedTitle")}
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">{t("advancedLevelTitle")}</h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-black/65">{t("advancedLevelBody")}</p>

          <ul className="mt-8 grid gap-3 sm:grid-cols-3">
            {advancedLevels.map((level) => (
              <li key={level.id}>
                <button
                  type="button"
                  onClick={() => pickAdvancedLevel(level.id)}
                  className="flex h-full w-full flex-col border-2 border-black bg-white p-5 text-start transition hover:-translate-y-0.5 hover:bg-[#0016BD]/10"
                >
                  <span className="text-xs font-bold uppercase tracking-wider text-black/50">
                    CEFR
                  </span>
                  <span className="mt-2 text-lg font-bold">{level.label}</span>
                  <span className="mt-3 text-sm text-black/65">
                    {t(`advancedLevelHint.${level.id}`)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {step === "list" ? (
        <div className="relative">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0016BD]">
            {track === "kids"
              ? t(`kidsLevel.${kidsLevel ?? "beginner"}`)
              : (advancedLevel ?? "b1").toUpperCase()}
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">{t("listTitle")}</h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-black/65">{t("listBody")}</p>

          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {lessons.map((lesson, index) => (
              <li key={lesson.id}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(index)}
                  className="flex h-full w-full gap-4 border-2 bg-white p-4 text-start transition hover:-translate-y-0.5"
                  style={{ borderColor: lesson.accent }}
                >
                  <span
                    className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-black"
                    style={{ backgroundColor: lesson.accent }}
                  >
                    <LessonArtMark art={lesson.art} className="h-6 w-6" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-base font-bold leading-snug">{lesson.title}</span>
                    <span className="mt-1 block text-xs text-black/55">
                      {lesson.minutes} min · {lesson.tags.slice(0, 3).map((tag) => `#${tag}`).join(" ")}
                    </span>
                    <span className="mt-2 block text-sm leading-5 text-black/70">
                      {lesson.summary}
                    </span>
                    <span className="mt-3 inline-block text-sm font-semibold text-[#0016BD] underline underline-offset-4">
                      {t("openLesson")}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>

          {lessons.length === 0 ? (
            <p className="mt-6 text-sm text-black/60">{t("empty")}</p>
          ) : null}
        </div>
      ) : null}

      {openIndex !== null && lessons[openIndex] ? (
        <LessonEditorPopup
          lessons={lessons}
          index={openIndex}
          onClose={() => setOpenIndex(null)}
          onChangeIndex={setOpenIndex}
        />
      ) : null}
    </div>
  );
}
