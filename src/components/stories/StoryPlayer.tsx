"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import {
  loadSavedWords,
  removeSavedWord,
  saveWord,
  type Story,
} from "@/lib/stories";

type StoryPlayerProps = {
  story: Story;
};

/** Smart listening tracker: word-by-word highlight, pause, save important words. */
export default function StoryPlayer({ story }: StoryPlayerProps) {
  const t = useTranslations("Stories");
  const [index, setIndex] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [saved, setSaved] = useState<string[]>([]);
  const timer = useRef<number | null>(null);
  const playingRef = useRef(false);

  useEffect(() => {
    setSaved(loadSavedWords());
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
      window.speechSynthesis?.cancel();
    };
  }, []);

  function clearTimer() {
    if (timer.current) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
  }

  function speakWord(word: string) {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(word.replace(/[^\p{L}\p{N}'-]/gu, ""));
    utter.rate = 0.92;
    utter.lang = "en-US";
    window.speechSynthesis.speak(utter);
  }

  function scheduleFrom(startAt: number) {
    clearTimer();
    const run = (i: number) => {
      if (!playingRef.current) return;
      if (i >= story.words.length) {
        setPlaying(false);
        playingRef.current = false;
        setIndex(-1);
        return;
      }
      setIndex(i);
      const raw = story.words[i]!.text;
      speakWord(raw);
      const ms = Math.min(900, Math.max(320, raw.length * 85));
      timer.current = window.setTimeout(() => run(i + 1), ms);
    };
    run(startAt);
  }

  function togglePlay() {
    if (playing) {
      playingRef.current = false;
      setPlaying(false);
      clearTimer();
      window.speechSynthesis?.cancel();
      return;
    }
    playingRef.current = true;
    setPlaying(true);
    const start = index < 0 ? 0 : index;
    scheduleFrom(start);
  }

  function stepWord(dir: -1 | 1) {
    playingRef.current = false;
    setPlaying(false);
    clearTimer();
    window.speechSynthesis?.cancel();
    const next = Math.min(
      story.words.length - 1,
      Math.max(0, (index < 0 ? 0 : index) + dir),
    );
    setIndex(next);
    speakWord(story.words[next]!.text);
  }

  function toggleSave(word: string) {
    const clean = word.replace(/[^\p{L}\p{N}'-]/gu, "").toLowerCase();
    if (!clean) return;
    if (saved.includes(clean)) {
      setSaved(removeSavedWord(clean));
    } else {
      setSaved(saveWord(clean));
    }
  }

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border-2 border-black/10 bg-white p-5">
        <p className="text-xs font-bold uppercase tracking-wide text-black/45">
          {story.level}
          {story.ages ? ` · Ages ${story.ages}` : ""} · {story.minutes} min
        </p>
        <h2 className="mt-1 text-2xl font-bold text-[#0b0b1a]">{story.title}</h2>
        <p className="mt-1 text-sm text-black/55">{story.author}</p>
        <p className="mt-3 text-sm leading-6 text-black/70">{story.summary}</p>

        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={togglePlay}
            className="rounded-full bg-[#0016BD] px-4 py-2 text-sm font-semibold text-white"
          >
            {playing ? t("pause") : t("play")}
          </button>
          <button
            type="button"
            onClick={() => stepWord(-1)}
            className="rounded-full border border-black/20 px-3 py-2 text-sm font-semibold"
          >
            {t("prevWord")}
          </button>
          <button
            type="button"
            onClick={() => stepWord(1)}
            className="rounded-full border border-black/20 px-3 py-2 text-sm font-semibold"
          >
            {t("nextWord")}
          </button>
        </div>
      </div>

      <div className="rounded-2xl border-2 border-[#0016BD]/15 bg-[#f8f9ff] p-5">
        <p className="mb-3 text-xs font-bold uppercase tracking-wide text-[#0016BD]">
          {t("smartTrack")}
        </p>
        <p className="flex flex-wrap gap-x-1.5 gap-y-2 text-lg leading-9 text-[#0b0b1a]">
          {story.words.map((w, i) => {
            const clean = w.text.replace(/[^\p{L}\p{N}'-]/gu, "").toLowerCase();
            const isActive = i === index;
            const isSaved = saved.includes(clean);
            return (
              <span key={`${w.text}-${i}`} className="inline-flex items-center gap-0.5">
                <button
                  type="button"
                  onClick={() => {
                    setIndex(i);
                    speakWord(w.text);
                  }}
                  className={`rounded px-0.5 transition ${
                    isActive
                      ? "bg-[#ffc933] font-bold text-[#0b0b1a]"
                      : "hover:bg-black/5"
                  }`}
                >
                  {w.text}
                </button>
                {w.important || isSaved ? (
                  <button
                    type="button"
                    onClick={() => toggleSave(w.text)}
                    className={`ms-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${
                      isSaved
                        ? "bg-[#0016BD] text-white"
                        : "bg-white text-[#0016BD] ring-1 ring-[#0016BD]/30"
                    }`}
                    aria-label={isSaved ? t("unsaveWord") : t("saveWord")}
                    title={isSaved ? t("unsaveWord") : t("saveWord")}
                  >
                    ★
                  </button>
                ) : null}
              </span>
            );
          })}
        </p>
      </div>

      <div className="rounded-2xl border border-black/10 bg-white p-4">
        <h3 className="text-sm font-bold text-[#0b0b1a]">{t("wordBank")}</h3>
        {saved.length === 0 ? (
          <p className="mt-2 text-sm text-black/55">{t("wordBankEmpty")}</p>
        ) : (
          <ul className="mt-3 flex flex-wrap gap-2">
            {saved.map((w) => (
              <li key={w}>
                <button
                  type="button"
                  onClick={() => toggleSave(w)}
                  className="rounded-full bg-[#eef1ff] px-3 py-1 text-sm font-medium text-[#0016BD]"
                >
                  {w} ×
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
