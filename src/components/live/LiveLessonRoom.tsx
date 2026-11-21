"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
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
} from "@/lib/live-assignments";
import { liveLessonStyles, type LiveLesson } from "@/lib/live-lessons";

type LiveLessonRoomProps = {
  lesson: LiveLesson;
};

type RoomStatus = "lobby" | "live" | "ended";

export default function LiveLessonRoom({ lesson }: LiveLessonRoomProps) {
  const t = useTranslations("LiveLessons");
  const { user, profile } = useAuth();
  const canAssign = profile?.role === "teacher" || profile?.role === "admin";
  const isTeacher = canAssign;
  const style = liveLessonStyles[lesson.category];

  const [teacherName, setTeacherName] = useState(lesson.teacher);
  const [teacherId, setTeacherId] = useState(
    () => findTeacherByName(lesson.teacher)?.id || "",
  );
  const [status, setStatus] = useState<RoomStatus>("lobby");
  const [captions, setCaptions] = useState(true);
  const [joined, setJoined] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [note, setNote] = useState("");

  useEffect(() => {
    try {
      const assignment = loadLiveAssignments()[lesson.id];
      const teacher = teacherFromAssignment(assignment, lesson.teacher);
      if (teacher) {
        setTeacherId(teacher.id);
        setTeacherName(teacher.nameEn);
      } else if (assignment?.teacherName) {
        setTeacherName(assignment.teacherName);
        setTeacherId(assignment.teacherId || "");
      }
    } catch {
      // ignore corrupt storage
    }
  }, [lesson.id, lesson.teacher]);

  useEffect(() => {
    if (status !== "live") return;
    const id = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, [status]);

  const clock = useMemo(() => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  }, [seconds]);

  const teacher = teacherFromAssignment(
    teacherId || teacherName
      ? {
          teacherId: teacherId || "unknown",
          teacherName,
          assignedAt: "",
        }
      : undefined,
    lesson.teacher,
  );

  function onAssign(id: string) {
    const next = assignableTeachers.find((x) => x.id === id);
    if (!next) return;
    setTeacherId(next.id);
    setTeacherName(next.nameEn);
    saveLiveAssignment(
      lesson.id,
      next,
      profile?.display_name || user?.email || profile?.role,
    );
  }

  function assignMyself() {
    const me =
      findTeacherByName(profile?.display_name) ||
      findTeacherByName(user?.name);
    if (me) {
      onAssign(me.id);
      return;
    }
    const name = profile?.display_name || user?.name || "Teacher";
    setTeacherName(name);
    setTeacherId(user?.$id || "me");
    saveLiveAssignment(
      lesson.id,
      { id: user?.$id || "me", nameEn: name },
      name,
    );
  }

  function joinRoom() {
    setJoined(true);
    if (isTeacher) {
      setStatus("live");
      setSeconds(0);
    }
  }

  function startLive() {
    setStatus("live");
    setSeconds(0);
    setJoined(true);
  }

  function endLive() {
    setStatus("ended");
  }

  return (
    <div className="space-y-5">
      <div className={`rounded-2xl border-2 p-5 ${style.card}`}>
        <div className="flex flex-wrap items-start gap-4">
          <span
            className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl ${style.iconBg} ${style.accent}`}
          >
            <KidsLessonIcon name={lesson.icon} className="h-8 w-8" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${style.badge}`}>
                {lesson.category === "kids" ? t("kidsBadge") : t("adultsBadge")}
              </span>
              <span className="text-xs font-medium text-black/55">{lesson.level}</span>
              {lesson.ages ? (
                <span className="text-xs text-black/45">
                  {t("ages", { range: lesson.ages })}
                </span>
              ) : null}
            </div>
            <h2 className="mt-2 text-2xl font-bold text-[#0b0b1a]">{lesson.title}</h2>
            <p className="mt-1 text-sm font-semibold uppercase tracking-wide text-black/45">
              {lesson.subject}
            </p>

            <div className="mt-3 flex items-center gap-3 rounded-xl border border-black/10 bg-white/80 px-3 py-2">
              {teacher?.image ? (
                <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full">
                  <Image
                    src={teacher.image}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="44px"
                  />
                </span>
              ) : (
                <Avatar name={teacherName} role="teacher" size="md" />
              )}
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wide text-black/45">
                  {t("assignedTo")}
                </p>
                <p className="truncate text-sm font-bold text-[#0b0b1a]">
                  {teacher?.nameEn || teacherName}
                </p>
                <p className="text-xs text-black/55">
                  {lesson.when} · {t("duration", { minutes: lesson.durationMin })}
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-xl bg-white/80 px-4 py-3 text-center">
            <p className="text-[10px] font-bold uppercase tracking-wide text-black/45">
              {t("roomStatus")}
            </p>
            <p className={`mt-1 text-sm font-bold ${style.accent}`}>
              {status === "lobby"
                ? t("statusLobby")
                : status === "live"
                  ? t("statusLive")
                  : t("statusEnded")}
            </p>
            {status === "live" ? (
              <p className="mt-1 font-mono text-lg font-bold tabular-nums text-[#0b0b1a]">
                {clock}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      {canAssign ? (
        <div className="rounded-2xl border border-black/10 bg-white p-4">
          <label className="block text-xs font-semibold text-black/55">
            {t("assignTeacher")}
            <select
              className="mt-1 w-full rounded-lg border border-black/15 px-3 py-2 text-sm"
              value={teacherId}
              onChange={(e) => onAssign(e.target.value)}
            >
              <option value="" disabled>
                {t("pickTeacher")}
              </option>
              {assignableTeachers.map((tr) => (
                <option key={tr.id} value={tr.id}>
                  {tr.nameEn}
                </option>
              ))}
            </select>
          </label>
          {profile?.role === "teacher" ? (
            <button
              type="button"
              onClick={assignMyself}
              className="mt-2 rounded-full border border-black/15 bg-[#f8f9ff] px-3 py-1.5 text-xs font-semibold text-[#0016BD]"
            >
              {t("assignMyself")}
            </button>
          ) : null}
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-2xl border-2 border-black bg-[#0b0b1a] p-5 text-white">
          <p className="text-xs font-bold uppercase tracking-wide text-white/50">
            {t("roomStage")}
          </p>
          <div className="mt-4 flex min-h-[12rem] flex-col items-center justify-center rounded-xl border border-dashed border-white/25 bg-white/5 p-6 text-center">
            {!joined ? (
              <>
                <p className="text-lg font-bold">{t("readyTitle")}</p>
                <p className="mt-2 max-w-sm text-sm text-white/65">{t("readyBody")}</p>
                <button
                  type="button"
                  onClick={joinRoom}
                  className="mt-5 rounded-full bg-[#ffc933] px-6 py-3 text-sm font-bold text-[#0b0b1a]"
                >
                  {t("joinRoom")}
                </button>
              </>
            ) : status === "ended" ? (
              <>
                <p className="text-lg font-bold">{t("endedTitle")}</p>
                <p className="mt-2 text-sm text-white/65">{t("endedBody")}</p>
              </>
            ) : (
              <>
                <p className="text-lg font-bold">
                  {status === "live" ? t("liveNow") : t("waitingTeacher")}
                </p>
                <p className="mt-2 max-w-sm text-sm text-white/65">
                  {captions ? t("captionsOn") : t("captionsOff")}
                </p>
                {status === "live" ? (
                  <ul className="mt-4 space-y-1 text-sm text-[#ffc933]">
                    <li>{t("agenda1")}</li>
                    <li>{t("agenda2")}</li>
                    <li>{t("agenda3")}</li>
                  </ul>
                ) : null}
              </>
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {isTeacher && status !== "live" ? (
              <button
                type="button"
                onClick={startLive}
                className="rounded-full bg-[#22c55e] px-4 py-2 text-sm font-semibold text-white"
              >
                {t("startSession")}
              </button>
            ) : null}
            {isTeacher && status === "live" ? (
              <button
                type="button"
                onClick={endLive}
                className="rounded-full bg-[#ef4444] px-4 py-2 text-sm font-semibold text-white"
              >
                {t("endSession")}
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => setCaptions((v) => !v)}
              className="rounded-full border border-white/25 px-4 py-2 text-sm font-semibold"
            >
              {captions ? t("hideCaptions") : t("showCaptions")}
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-black/10 bg-white p-4">
            <h3 className="text-sm font-bold text-[#0b0b1a]">{t("sessionNotes")}</h3>
            <textarea
              className="mt-2 min-h-[8rem] w-full rounded-xl border border-black/15 px-3 py-2 text-sm"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={t("notesPlaceholder")}
            />
          </div>
          <div className="rounded-2xl border border-black/10 bg-[#f8f9ff] p-4 text-sm text-black/70">
            <p className="font-semibold text-[#0016BD]">{t("serveHintTitle")}</p>
            <p className="mt-1">{t("serveHintBody")}</p>
          </div>
        </div>
      </div>

      <p>
        <Link href="/live-lessons" className="text-sm font-semibold text-[#0016BD] underline">
          {t("backLive")}
        </Link>
      </p>
    </div>
  );
}
