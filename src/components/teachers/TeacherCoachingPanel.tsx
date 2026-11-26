"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { kidsLessons, advancedLessons } from "@/lib/lessons";
import {
  notifyFeedbackInMessages,
  notifyRecommendationInMessages,
} from "@/lib/messages-center";
import {
  addFeedback,
  addRecommendation,
  coachingStudents,
  loadFeedback,
  loadRecommendations,
  removeFeedback,
  removeRecommendation,
  type CoachingFeedback,
  type LessonRecommendation,
} from "@/lib/teacher-coaching";

type TeacherCoachingPanelProps = {
  teacherId: string;
  teacherName: string;
};

export default function TeacherCoachingPanel({
  teacherId,
  teacherName,
}: TeacherCoachingPanelProps) {
  const t = useTranslations("TeacherCoaching");
  const { profile, loading } = useAuth();
  const isTeacher = profile?.role === "teacher" || profile?.role === "admin";

  const [feedbackList, setFeedbackList] = useState<CoachingFeedback[]>([]);
  const [recs, setRecs] = useState<LessonRecommendation[]>([]);
  const [studentKey, setStudentKey] = useState<string>(coachingStudents[0]!.key);
  const [customName, setCustomName] = useState("");
  const [rating, setRating] = useState<1 | 2 | 3 | 4 | 5>(4);
  const [note, setNote] = useState("");
  const [lessonId, setLessonId] = useState("");
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const lessons = useMemo(
    () => [
      ...kidsLessons.map((l) => ({ ...l, trackLabel: "kids" as const })),
      ...advancedLessons.map((l) => ({ ...l, trackLabel: "advanced" as const })),
    ],
    [],
  );

  useEffect(() => {
    if (!isTeacher) return;
    setFeedbackList(loadFeedback(teacherId));
    setRecs(loadRecommendations(teacherId));
    if (!lessonId && lessons[0]) setLessonId(lessons[0].id);
  }, [isTeacher, teacherId, lessons, lessonId]);

  if (loading || !isTeacher) return null;

  function studentNameFor(key: string) {
    if (key === "custom") return customName.trim() || t("customStudent");
    return coachingStudents.find((s) => s.key === key)?.name || key;
  }

  function onFeedback(event: FormEvent) {
    event.preventDefault();
    const name = studentNameFor(studentKey);
    if (studentKey === "custom" && !customName.trim()) {
      setMessage(t("needStudent"));
      return;
    }
    if (!note.trim()) {
      setMessage(t("needNote"));
      return;
    }
    const item = addFeedback({
      teacherId,
      teacherName,
      studentKey: studentKey === "custom" ? `custom:${name.toLowerCase()}` : studentKey,
      studentName: name,
      rating,
      note: note.trim(),
    });
    notifyFeedbackInMessages(item);
    setFeedbackList(loadFeedback(teacherId));
    setNote("");
    setMessage(t("feedbackSaved"));
  }

  function onRecommend(event: FormEvent) {
    event.preventDefault();
    const name = studentNameFor(studentKey);
    if (studentKey === "custom" && !customName.trim()) {
      setMessage(t("needStudent"));
      return;
    }
    const lesson = lessons.find((l) => l.id === lessonId);
    if (!lesson) {
      setMessage(t("needLesson"));
      return;
    }
    const item = addRecommendation({
      teacherId,
      teacherName,
      studentKey: studentKey === "custom" ? `custom:${name.toLowerCase()}` : studentKey,
      studentName: name,
      lessonId: lesson.id,
      lessonTitle: lesson.title,
      track: lesson.trackLabel,
      reason: reason.trim() || t("defaultReason"),
    });
    notifyRecommendationInMessages(item);
    setRecs(loadRecommendations(teacherId));
    setReason("");
    setMessage(t("recSaved"));
  }

  return (
    <section className="mt-10 space-y-6 rounded-2xl border-2 border-[#0016BD]/20 bg-[#f8f9ff] p-5">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#0016BD]">
          {t("eyebrow")}
        </p>
        <h3 className="mt-1 text-xl font-bold text-[#0b0b1a]">{t("title")}</h3>
        <p className="mt-1 text-sm text-black/60">{t("intro")}</p>
        <Link
          href="/messages"
          className="mt-2 inline-block text-sm font-semibold text-[#0016BD] underline"
        >
          {t("openMessages")}
        </Link>
      </div>

      {message ? (
        <p className="rounded-xl bg-[#0016BD]/10 px-3 py-2 text-sm text-[#0016BD]">{message}</p>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-xs font-semibold text-black/55">
          {t("student")}
          <select
            className="mt-1 w-full rounded-xl border border-black/15 bg-white px-3 py-2 text-sm"
            value={studentKey}
            onChange={(e) => setStudentKey(e.target.value)}
          >
            {coachingStudents.map((s) => (
              <option key={s.key} value={s.key}>
                {s.name}
              </option>
            ))}
          </select>
        </label>
        {studentKey === "custom" ? (
          <label className="text-xs font-semibold text-black/55">
            {t("customName")}
            <input
              className="mt-1 w-full rounded-xl border border-black/15 bg-white px-3 py-2 text-sm"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder={t("customNamePlaceholder")}
            />
          </label>
        ) : (
          <div className="hidden sm:block" />
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <form onSubmit={onFeedback} className="space-y-3 rounded-2xl border border-black/10 bg-white p-4">
          <h4 className="text-sm font-bold text-[#0b0b1a]">{t("feedbackTitle")}</h4>
          <label className="block text-xs font-semibold text-black/55">
            {t("rating")}
            <select
              className="mt-1 w-full rounded-xl border border-black/15 px-3 py-2 text-sm"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value) as 1 | 2 | 3 | 4 | 5)}
            >
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {t("stars", { count: n })}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-xs font-semibold text-black/55">
            {t("note")}
            <textarea
              className="mt-1 min-h-[6rem] w-full rounded-xl border border-black/15 px-3 py-2 text-sm"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={t("notePlaceholder")}
            />
          </label>
          <button
            type="submit"
            className="rounded-full bg-[#0016BD] px-4 py-2 text-sm font-semibold text-white"
          >
            {t("assignFeedback")}
          </button>
        </form>

        <form onSubmit={onRecommend} className="space-y-3 rounded-2xl border border-black/10 bg-white p-4">
          <h4 className="text-sm font-bold text-[#0b0b1a]">{t("recommendTitle")}</h4>
          <label className="block text-xs font-semibold text-black/55">
            {t("lesson")}
            <select
              className="mt-1 w-full rounded-xl border border-black/15 px-3 py-2 text-sm"
              value={lessonId}
              onChange={(e) => setLessonId(e.target.value)}
            >
              {lessons.map((lesson) => (
                <option key={lesson.id} value={lesson.id}>
                  {lesson.trackLabel === "kids" ? t("kidsTag") : t("adultsTag")} · {lesson.title}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-xs font-semibold text-black/55">
            {t("reason")}
            <textarea
              className="mt-1 min-h-[6rem] w-full rounded-xl border border-black/15 px-3 py-2 text-sm"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={t("reasonPlaceholder")}
            />
          </label>
          <button
            type="submit"
            className="rounded-full bg-[#c45c00] px-4 py-2 text-sm font-semibold text-white"
          >
            {t("recommendLesson")}
          </button>
        </form>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <h4 className="mb-2 text-sm font-bold text-[#0b0b1a]">{t("recentFeedback")}</h4>
          {feedbackList.length === 0 ? (
            <p className="text-sm text-black/50">{t("emptyFeedback")}</p>
          ) : (
            <ul className="space-y-2">
              {feedbackList.slice(0, 6).map((item) => (
                <li key={item.id} className="rounded-xl border border-black/10 bg-white p-3 text-sm">
                  <p className="font-semibold text-[#0b0b1a]">
                    {item.studentName} · {t("stars", { count: item.rating })}
                  </p>
                  <p className="mt-1 text-black/65">{item.note}</p>
                  <button
                    type="button"
                    className="mt-2 text-xs font-semibold text-[#8a1010]"
                    onClick={() => {
                      removeFeedback(item.id);
                      setFeedbackList(loadFeedback(teacherId));
                    }}
                  >
                    {t("remove")}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <h4 className="mb-2 text-sm font-bold text-[#0b0b1a]">{t("recentRecs")}</h4>
          {recs.length === 0 ? (
            <p className="text-sm text-black/50">{t("emptyRecs")}</p>
          ) : (
            <ul className="space-y-2">
              {recs.slice(0, 6).map((item) => (
                <li key={item.id} className="rounded-xl border border-black/10 bg-white p-3 text-sm">
                  <p className="font-semibold text-[#0b0b1a]">
                    {item.studentName} → {item.lessonTitle}
                  </p>
                  <p className="mt-1 text-black/65">{item.reason}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-3">
                    <Link
                      href="/lessons"
                      className="text-xs font-semibold text-[#0016BD] underline"
                    >
                      {t("openLessons")}
                    </Link>
                    <button
                      type="button"
                      className="text-xs font-semibold text-[#8a1010]"
                      onClick={() => {
                        removeRecommendation(item.id);
                        setRecs(loadRecommendations(teacherId));
                      }}
                    >
                      {t("remove")}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
