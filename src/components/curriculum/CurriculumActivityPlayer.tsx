"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  checkAnswer,
  levelMeta,
  type CurriculumActivity,
} from "@/lib/curriculum";

type Props = {
  activity: CurriculumActivity;
};

function formatTime(totalSeconds: number) {
  const m = Math.floor(Math.max(0, totalSeconds) / 60);
  const s = Math.max(0, totalSeconds) % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function CurriculumActivityPlayer({ activity }: Props) {
  const t = useTranslations("Curriculum");
  const meta = levelMeta[activity.level];
  const itemCount =
    activity.kind === "grammar" ? activity.items.length : activity.questions.length;

  const [answers, setAnswers] = useState<string[]>(() =>
    Array.from({ length: itemCount }, () => ""),
  );
  const [checked, setChecked] = useState<boolean[] | null>(null);
  const [showKey, setShowKey] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(activity.durationMin * 60);
  const [running, setRunning] = useState(true);
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    setAnswers(Array.from({ length: itemCount }, () => ""));
    setChecked(null);
    setShowKey(false);
    setSecondsLeft(activity.durationMin * 60);
    setRunning(true);
    setTimedOut(false);
  }, [activity.id, itemCount, activity.durationMin]);

  useEffect(() => {
    if (!running || timedOut) return;
    const id = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(id);
          setRunning(false);
          setTimedOut(true);
          setShowKey(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [running, timedOut, activity.id]);

  const score = useMemo(() => {
    if (!checked) return null;
    const correct = checked.filter(Boolean).length;
    return { correct, total: checked.length };
  }, [checked]);

  function onCheck() {
    const expected = activity.answers;
    const result = answers.map((ans, i) =>
      checkAnswer(ans, expected[i] || ""),
    );
    setChecked(result);
    setShowKey(true);
    setRunning(false);
  }

  function onReset() {
    setAnswers(Array.from({ length: itemCount }, () => ""));
    setChecked(null);
    setShowKey(false);
    setSecondsLeft(activity.durationMin * 60);
    setRunning(true);
    setTimedOut(false);
  }

  const lowTime = secondsLeft <= 60;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3 rounded-2xl border-2 border-black bg-white p-5">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold uppercase tracking-wide" style={{ color: meta.accent }}>
            {activity.level} · {activity.kind === "grammar" ? t("grammarBadge") : t("readingBadge")}
          </p>
          <h2 className="mt-1 text-2xl font-bold text-[#0b0b1a]">
            {activity.number}. {activity.title}
          </h2>
          {activity.kind === "grammar" ? (
            <p className="mt-2 text-sm leading-6 text-black/70">{activity.goal}</p>
          ) : (
            <p className="mt-2 text-sm text-black/55">{activity.subject}</p>
          )}
        </div>

        <div
          className={`rounded-2xl px-4 py-3 text-center ${
            timedOut
              ? "bg-[#ff5c5c]/15 text-[#8a1010]"
              : lowTime
                ? "bg-[#fff3cd] text-[#7a5a00]"
                : "bg-[#eef1ff] text-[#0016BD]"
          }`}
        >
          <p className="text-[10px] font-bold uppercase tracking-wide">
            {t("timeRemaining")}
          </p>
          <p className="mt-0.5 font-mono text-2xl font-bold tabular-nums">
            {formatTime(secondsLeft)}
          </p>
          <button
            type="button"
            className="mt-1 text-xs font-semibold underline"
            onClick={() => setRunning((v) => !v)}
            disabled={timedOut}
          >
            {running ? t("pause") : t("resume")}
          </button>
        </div>
      </div>

      {activity.kind === "grammar" ? (
        <div className="rounded-2xl border border-black/10 bg-[#f8f9ff] p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-[#0016BD]">
            {t("learn")}
          </p>
          {activity.examples ? (
            <p className="mt-2 text-sm leading-6 text-black/75">
              <span className="font-semibold">{t("examples")}: </span>
              {activity.examples}
            </p>
          ) : null}
          <p className="mt-3 text-sm font-medium text-[#0b0b1a]">{activity.prompt}</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-black/10 bg-white p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-[#0016BD]">
            {t("passage")}
          </p>
          <p className="mt-3 text-base leading-7 text-[#0b0b1a]">{activity.passage}</p>
        </div>
      )}

      <div className="rounded-2xl border-2 border-[#0016BD]/20 bg-white p-5">
        <p className="mb-3 text-xs font-bold uppercase tracking-wide text-[#0016BD]">
          {activity.kind === "grammar" ? t("practice") : t("questions")}
        </p>
        <ul className="space-y-3">
          {(activity.kind === "grammar" ? activity.items : activity.questions).map(
            (item, index) => {
              const ok = checked?.[index];
              return (
                <li key={`${activity.id}-${index}`} className="space-y-1.5">
                  <label className="block text-sm font-medium text-[#0b0b1a]">
                    {index + 1}. {item}
                  </label>
                  <input
                    value={answers[index] || ""}
                    onChange={(e) => {
                      const next = [...answers];
                      next[index] = e.target.value;
                      setAnswers(next);
                      setChecked(null);
                    }}
                    className={`w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:border-[#0016BD] ${
                      checked
                        ? ok
                          ? "border-green-500 bg-green-50"
                          : "border-red-400 bg-red-50"
                        : "border-black/15"
                    }`}
                    placeholder={t("yourAnswer")}
                    disabled={timedOut && showKey}
                  />
                  {showKey && activity.answers[index] ? (
                    <p className="text-xs text-black/55">
                      <span className="font-semibold text-[#0016BD]">{t("answer")}: </span>
                      {activity.answers[index]}
                    </p>
                  ) : null}
                </li>
              );
            },
          )}
        </ul>

        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onCheck}
            className="rounded-full bg-[#0016BD] px-5 py-2.5 text-sm font-semibold text-white"
          >
            {t("check")}
          </button>
          <button
            type="button"
            onClick={() => setShowKey((v) => !v)}
            className="rounded-full border border-black/20 px-5 py-2.5 text-sm font-semibold"
          >
            {showKey ? t("hideAnswers") : t("showAnswers")}
          </button>
          <button
            type="button"
            onClick={onReset}
            className="rounded-full border border-black/20 px-5 py-2.5 text-sm font-semibold"
          >
            {t("reset")}
          </button>
        </div>

        {score ? (
          <p className="mt-4 rounded-xl bg-[#eef1ff] px-4 py-3 text-sm font-semibold text-[#0016BD]">
            {t("score", { correct: score.correct, total: score.total })}
          </p>
        ) : null}
        {timedOut ? (
          <p className="mt-3 text-sm font-semibold text-[#8a1010]">{t("timeUp")}</p>
        ) : null}
      </div>

      <p className="flex flex-wrap gap-4 text-sm">
        <Link href="/courses/curriculum" className="font-semibold text-[#0016BD] underline">
          {t("backCurriculum")}
        </Link>
        <Link href="/courses" className="font-semibold text-black/55 underline">
          {t("backCourses")}
        </Link>
      </p>
    </div>
  );
}
