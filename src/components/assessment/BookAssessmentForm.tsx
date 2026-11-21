"use client";

import { FormEvent, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import KidsLessonIcon from "@/components/live/KidsLessonIcon";
import {
  ASSESSMENT_DURATION_MIN,
  ASSESSMENT_FEE_DA,
  AssessmentTrack,
  assessmentTimeSlots,
  assessmentTrackStyles,
  formatDayKey,
  formatDayLabel,
  getBookableDays,
} from "@/lib/assessment-booking";

type BookingResult = {
  track: AssessmentTrack;
  dayKey: string;
  dayLabel: string;
  time: string;
  name: string;
  email: string;
};

export default function BookAssessmentForm() {
  const t = useTranslations("Assessment");
  const locale = useLocale();
  const days = useMemo(() => getBookableDays(14), []);

  const [track, setTrack] = useState<AssessmentTrack | null>(null);
  const [dayKey, setDayKey] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<BookingResult | null>(null);

  const selectedDay = days.find((d) => formatDayKey(d) === dayKey) || null;
  const styles = track ? assessmentTrackStyles[track] : null;

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!track) {
      setError(t("errorTrack"));
      return;
    }
    if (!dayKey || !selectedDay) {
      setError(t("errorDay"));
      return;
    }
    if (!time) {
      setError(t("errorTime"));
      return;
    }
    if (!name.trim() || !email.trim()) {
      setError(t("errorContact"));
      return;
    }

    setResult({
      track,
      dayKey,
      dayLabel: formatDayLabel(selectedDay, locale),
      time,
      name: name.trim(),
      email: email.trim(),
    });
  }

  if (result) {
    const doneStyle = assessmentTrackStyles[result.track];
    return (
      <div className={`rounded-2xl border-2 p-6 ${doneStyle.card}`}>
        <p className={`text-xs font-bold uppercase tracking-wide ${doneStyle.accent}`}>
          {t("confirmedEyebrow")}
        </p>
        <h2 className="mt-2 text-2xl font-bold text-[#0b0b1a]">{t("confirmedTitle")}</h2>
        <p className="mt-3 max-w-xl text-sm leading-6 text-black/70">{t("confirmedBody")}</p>
        <ul className="mt-5 space-y-2 text-sm text-[#0b0b1a]">
          <li>
            <span className="font-semibold">{t("summaryTrack")}: </span>
            {result.track === "kids" ? t("kidsTitle") : t("adultsTitle")}
          </li>
          <li>
            <span className="font-semibold">{t("summaryWhen")}: </span>
            {result.dayLabel} · {result.time}
          </li>
          <li>
            <span className="font-semibold">{t("summaryDuration")}: </span>
            {t("durationValue", { minutes: ASSESSMENT_DURATION_MIN })}
          </li>
          <li>
            <span className="font-semibold">{t("summaryFee")}: </span>
            {t("feeValue", { fee: ASSESSMENT_FEE_DA })}
          </li>
          <li>
            <span className="font-semibold">{t("summaryName")}: </span>
            {result.name}
          </li>
          <li>
            <span className="font-semibold">{t("summaryEmail")}: </span>
            {result.email}
          </li>
          <li>
            <span className="font-semibold">{t("summaryMode")}: </span>
            {t("remote")}
          </li>
        </ul>
        <button
          type="button"
          className={`mt-6 rounded-full px-5 py-2.5 text-sm font-semibold ${doneStyle.button}`}
          onClick={() => {
            setResult(null);
            setTrack(null);
            setDayKey(null);
            setTime(null);
            setName("");
            setEmail("");
          }}
        >
          {t("bookAnother")}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {/* Track */}
      <section>
        <h2 className="text-lg font-bold text-[#0b0b1a]">{t("chooseTrack")}</h2>
        <p className="mt-1 text-sm text-black/65">{t("chooseTrackHint")}</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {(
            [
              {
                id: "kids" as const,
                icon: "star" as const,
                title: t("kidsTitle"),
                body: t("kidsBody"),
              },
              {
                id: "adults" as const,
                icon: "globe" as const,
                title: t("adultsTitle"),
                body: t("adultsBody"),
              },
            ] as const
          ).map((option) => {
            const optionStyle = assessmentTrackStyles[option.id];
            const selected = track === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setTrack(option.id)}
                className={`rounded-2xl border-2 p-4 text-start transition ${
                  selected ? optionStyle.selected : optionStyle.card
                }`}
              >
                <span className="flex items-center gap-2">
                  <span
                    className={`inline-flex h-9 w-9 items-center justify-center rounded-full ${
                      option.id === "kids" ? "bg-[#ffe0b8] text-[#c45c00]" : "bg-[#d4dcff] text-[#0016BD]"
                    }`}
                  >
                    <KidsLessonIcon name={option.icon} className="h-5 w-5" />
                  </span>
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${optionStyle.badge}`}>
                    {option.id === "kids" ? t("kidsBadge") : t("adultsBadge")}
                  </span>
                </span>
                <span className="mt-3 block text-base font-bold text-[#0b0b1a]">{option.title}</span>
                <span className="mt-1 block text-sm text-black/65">{option.body}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Calendar days */}
      <section>
        <h2 className="text-lg font-bold text-[#0b0b1a]">{t("chooseDay")}</h2>
        <p className="mt-1 text-sm text-black/65">{t("chooseDayHint")}</p>
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
          {days.map((day) => {
            const key = formatDayKey(day);
            const selected = dayKey === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setDayKey(key);
                  setTime(null);
                }}
                className={`rounded-xl border-2 px-2 py-3 text-center text-sm transition ${
                  selected
                    ? "border-[#000ea8] bg-[#000ea8] text-white"
                    : "border-black/15 bg-white text-[#0b0b1a] hover:border-[#000ea8]/40"
                }`}
              >
                <span className="block font-semibold">{formatDayLabel(day, locale)}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Times */}
      <section>
        <h2 className="text-lg font-bold text-[#0b0b1a]">{t("chooseTime")}</h2>
        <p className="mt-1 text-sm text-black/65">
          {t("chooseTimeHint", { minutes: ASSESSMENT_DURATION_MIN })}
        </p>
        <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-5">
          {assessmentTimeSlots.map((slot) => {
            const selected = time === slot;
            const disabled = !dayKey;
            return (
              <button
                key={slot}
                type="button"
                disabled={disabled}
                onClick={() => setTime(slot)}
                className={`rounded-lg border px-2 py-2.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40 ${
                  selected
                    ? "border-[#000ea8] bg-[#000ea8] text-white"
                    : "border-black/15 bg-white text-[#0b0b1a] hover:border-[#000ea8]/40"
                }`}
              >
                {slot}
              </button>
            );
          })}
        </div>
      </section>

      {/* Contact + fee */}
      <section className="rounded-2xl border-2 border-black/10 bg-white p-5">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-[#ffc933] px-3 py-1 text-xs font-bold text-[#0b0b1a]">
            {t("feeValue", { fee: ASSESSMENT_FEE_DA })}
          </span>
          <span className="rounded-full bg-[#eef1ff] px-3 py-1 text-xs font-bold text-[#0016BD]">
            {t("durationValue", { minutes: ASSESSMENT_DURATION_MIN })}
          </span>
          <span className="rounded-full bg-[#e8f5e9] px-3 py-1 text-xs font-bold text-[#1b5e20]">
            {t("remote")}
          </span>
        </div>

        <h2 className="mt-5 text-lg font-bold text-[#0b0b1a]">{t("contactTitle")}</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="book-name" className="mb-1.5 block text-sm font-medium">
              {t("name")}
            </label>
            <input
              id="book-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border border-black/20 px-3 py-2.5 text-base outline-none focus:border-[#000ea8]"
            />
          </div>
          <div>
            <label htmlFor="book-email" className="mb-1.5 block text-sm font-medium">
              {t("email")}
            </label>
            <input
              id="book-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-black/20 px-3 py-2.5 text-base outline-none focus:border-[#000ea8]"
            />
          </div>
        </div>

        {error ? (
          <p role="alert" className="mt-4 bg-[#ff5c5c]/15 px-3 py-2 text-sm text-[#8a1010]">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          className={`mt-5 rounded-full px-6 py-3 text-sm font-semibold ${
            styles?.button || "bg-[#000ea8] text-white"
          }`}
        >
          {t("submit")}
        </button>
      </section>
    </form>
  );
}
