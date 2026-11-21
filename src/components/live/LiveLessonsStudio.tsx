"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import Avatar from "@/components/Avatar";
import KidsLessonIcon from "@/components/live/KidsLessonIcon";
import {
  assignableTeachers,
  findTeacherByName,
  loadLiveAssignments,
  saveLiveAssignment,
  teacherFromAssignment,
  type LiveAssignment,
} from "@/lib/live-assignments";
import {
  liveLessonStyles,
  type LiveLesson,
  type LiveLessonCategory,
} from "@/lib/live-lessons";

type LiveLessonsStudioProps = {
  lessons: LiveLesson[];
};

export default function LiveLessonsStudio({ lessons }: LiveLessonsStudioProps) {
  const t = useTranslations("LiveLessons");
  const locale = useLocale();
  const isAr = locale === "ar";
  const { user, profile } = useAuth();
  const canAssign = profile?.role === "teacher" || profile?.role === "admin";
  const isAdmin = profile?.role === "admin";

  const [category, setCategory] = useState<LiveLessonCategory | "all">("all");
  const [level, setLevel] = useState<string>("all");
  const [age, setAge] = useState<string>("all");
  const [teacherFilter, setTeacherFilter] = useState<string>("all");
  const [assignments, setAssignments] = useState<Record<string, LiveAssignment>>(
    {},
  );

  useEffect(() => {
    try {
      setAssignments(loadLiveAssignments());
    } catch {
      setAssignments({});
    }
  }, [lessons]);

  const levels = useMemo(
    () => Array.from(new Set(lessons.map((l) => l.level))),
    [lessons],
  );
  const ages = useMemo(
    () =>
      Array.from(
        new Set(lessons.filter((l) => l.ages).map((l) => l.ages as string)),
      ),
    [lessons],
  );

  function resolvedName(lesson: LiveLesson) {
    const a = assignments[lesson.id];
    return a?.teacherName || lesson.teacher;
  }

  const filtered = lessons.filter((lesson) => {
    if (category !== "all" && lesson.category !== category) return false;
    if (level !== "all" && lesson.level !== level) return false;
    if (age !== "all" && lesson.ages !== age) return false;
    if (teacherFilter !== "all") {
      const teacher = teacherFromAssignment(
        assignments[lesson.id],
        lesson.teacher,
      );
      const name = resolvedName(lesson);
      if (teacherFilter !== teacher?.id && teacherFilter !== name) return false;
    }
    return true;
  });

  const kids = filtered.filter((l) => l.category === "kids");
  const adults = filtered.filter((l) => l.category === "adults");

  function assignTeacher(lessonId: string, teacherId: string) {
    const teacher = assignableTeachers.find((x) => x.id === teacherId);
    if (!teacher) return;
    saveLiveAssignment(
      lessonId,
      teacher,
      profile?.display_name || user?.email || profile?.role,
    );
    setAssignments(loadLiveAssignments());
  }

  function assignMyself(lessonId: string) {
    const me =
      findTeacherByName(profile?.display_name) ||
      findTeacherByName(user?.name);
    if (me) {
      assignTeacher(lessonId, me.id);
      return;
    }
    // Fallback: create a synthetic profile entry from signed-in teacher
    saveLiveAssignment(
      lessonId,
      {
        id: user?.$id || "me",
        nameEn: profile?.display_name || user?.name || "Teacher",
      },
      profile?.display_name || user?.email,
    );
    setAssignments(loadLiveAssignments());
  }

  function renderList(items: LiveLesson[], kind: LiveLessonCategory) {
    const style = liveLessonStyles[kind];
    if (!items.length) {
      return <p className="text-sm text-black/55">{t("empty")}</p>;
    }
    return (
      <ul className="grid gap-4 sm:grid-cols-2">
        {items.map((lesson) => {
          const assignment = assignments[lesson.id];
          const teacher = teacherFromAssignment(assignment, lesson.teacher);
          const assignedName =
            (isAr && teacher?.nameAr) ||
            teacher?.nameEn ||
            assignment?.teacherName ||
            (isAr ? lesson.teacherAr : lesson.teacher);
          const avatarSrc = teacher?.image;

          return (
            <li key={lesson.id} className={`rounded-2xl border-2 p-4 ${style.card}`}>
              <div className="flex items-start gap-3">
                <span
                  className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${style.iconBg} ${style.accent}`}
                >
                  <KidsLessonIcon name={lesson.icon} className="h-6 w-6" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${style.badge}`}
                    >
                      {kind === "kids" ? t("kidsBadge") : t("adultsBadge")}
                    </span>
                    <span className="text-xs font-medium text-black/55">
                      {lesson.level}
                    </span>
                    {lesson.ages ? (
                      <span className="text-xs font-medium text-black/45">
                        {t("ages", { range: lesson.ages })}
                      </span>
                    ) : null}
                  </div>
                  <h3 className="mt-1.5 text-base font-bold text-[#0b0b1a]">
                    {isAr ? lesson.titleAr : lesson.title}
                  </h3>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-black/45">
                    {lesson.subject}
                  </p>

                  {/* Assigned teacher with avatar */}
                  <div className="mt-3 flex items-center gap-2.5 rounded-xl border border-black/10 bg-white/80 px-2.5 py-2">
                    {avatarSrc ? (
                      <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full">
                        <Image
                          src={avatarSrc}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="36px"
                        />
                      </span>
                    ) : (
                      <Avatar name={assignedName} role="teacher" size="sm" />
                    )}
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-black/45">
                        {assignment ? t("assignedTo") : t("hostTeacher")}
                      </p>
                      <p className="truncate text-sm font-semibold text-[#0b0b1a]">
                        {assignedName}
                      </p>
                      {isAdmin && assignment?.assignedBy ? (
                        <p className="truncate text-[11px] text-black/45">
                          {t("assignedBy", { name: assignment.assignedBy })}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <p className="mt-2 text-sm text-black/65">{lesson.when}</p>
                  <p className={`mt-1 text-sm font-semibold ${style.accent}`}>
                    {t("duration", { minutes: lesson.durationMin })}
                  </p>

                  {canAssign ? (
                    <div className="mt-3 space-y-2">
                      <label className="block text-xs font-semibold text-black/55">
                        {t("assignTeacher")}
                        <select
                          className="mt-1 w-full rounded-lg border border-black/15 bg-white px-2 py-1.5 text-sm text-[#0b0b1a]"
                          value={teacher?.id || ""}
                          onChange={(e) => assignTeacher(lesson.id, e.target.value)}
                        >
                          <option value="" disabled>
                            {t("pickTeacher")}
                          </option>
                          {assignableTeachers.map((tr) => (
                            <option key={tr.id} value={tr.id}>
                              {isAr ? tr.nameAr : tr.nameEn}
                            </option>
                          ))}
                        </select>
                      </label>
                      {profile?.role === "teacher" ? (
                        <button
                          type="button"
                          onClick={() => assignMyself(lesson.id)}
                          className="rounded-full border border-black/15 bg-white px-3 py-1.5 text-xs font-semibold text-[#0b0b1a]"
                        >
                          {t("assignMyself")}
                        </button>
                      ) : null}
                    </div>
                  ) : null}

                  <Link
                    href={`/live-lessons/${lesson.id}`}
                    className={`mt-3 inline-flex rounded-full px-4 py-2 text-sm font-semibold text-white ${
                      kind === "kids" ? "bg-[#c45c00]" : "bg-[#0016BD]"
                    }`}
                  >
                    {t("joinLive")}
                  </Link>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <div>
      <p className="mb-4 rounded-xl bg-[#eef1ff] px-4 py-3 text-sm text-[#0016BD]">
        {t("servingHint", { count: lessons.length })}
      </p>

      <div className="mb-6 grid gap-3 rounded-2xl border border-black/10 bg-white p-4 sm:grid-cols-2 lg:grid-cols-4">
        <label className="text-xs font-semibold text-black/55">
          {t("filterCategory")}
          <select
            className="mt-1 w-full rounded-lg border border-black/15 px-2 py-2 text-sm"
            value={category}
            onChange={(e) =>
              setCategory(e.target.value as LiveLessonCategory | "all")
            }
          >
            <option value="all">{t("all")}</option>
            <option value="kids">{t("kidsBadge")}</option>
            <option value="adults">{t("adultsBadge")}</option>
          </select>
        </label>
        <label className="text-xs font-semibold text-black/55">
          {t("filterLevel")}
          <select
            className="mt-1 w-full rounded-lg border border-black/15 px-2 py-2 text-sm"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
          >
            <option value="all">{t("all")}</option>
            {levels.map((lv) => (
              <option key={lv} value={lv}>
                {lv}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs font-semibold text-black/55">
          {t("filterAge")}
          <select
            className="mt-1 w-full rounded-lg border border-black/15 px-2 py-2 text-sm"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          >
            <option value="all">{t("all")}</option>
            {ages.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs font-semibold text-black/55">
          {t("filterTeacher")}
          <select
            className="mt-1 w-full rounded-lg border border-black/15 px-2 py-2 text-sm"
            value={teacherFilter}
            onChange={(e) => setTeacherFilter(e.target.value)}
          >
            <option value="all">{t("all")}</option>
            {assignableTeachers.map((tr) => (
              <option key={tr.id} value={tr.id}>
                {isAr ? tr.nameAr : tr.nameEn}
              </option>
            ))}
          </select>
        </label>
      </div>

      {(category === "all" || category === "kids") && (
        <section className="mb-10">
          <h2 className="mb-4 text-xl font-bold text-[#0b0b1a]">{t("kidsTitle")}</h2>
          {renderList(kids, "kids")}
        </section>
      )}

      {(category === "all" || category === "adults") && (
        <section>
          <h2 className="mb-4 text-xl font-bold text-[#0b0b1a]">{t("adultsTitle")}</h2>
          {renderList(adults, "adults")}
        </section>
      )}
    </div>
  );
}
