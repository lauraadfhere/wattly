"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  listThreadsForParticipant,
  markThreadRead,
  messagesForThread,
  migrateCoachingIntoMessages,
  sendChatMessage,
  totalUnreadForParticipant,
  unreadCountForThread,
  type CenterMessage,
  type CenterMessageKind,
  type CenterThread,
} from "@/lib/messages-center";
import {
  coachingStudents,
  resolveStudentKey,
} from "@/lib/teacher-coaching";
import { demoTeachers } from "@/lib/teachers";

function kindLabel(
  kind: CenterMessageKind,
  t: ReturnType<typeof useTranslations<"MessagesCenter">>,
) {
  if (kind === "feedback") return t("kindFeedback");
  if (kind === "recommendation") return t("kindRecommendation");
  if (kind === "notification") return t("kindNotification");
  return t("kindChat");
}

function formatWhen(iso: string) {
  try {
    return new Date(iso).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function MessagesCenter() {
  const t = useTranslations("MessagesCenter");
  const { user, profile, loading } = useAuth();
  const role = profile?.role || "learner";
  const isTeacher = role === "teacher" || role === "admin";

  const studentKey = resolveStudentKey(
    user?.email,
    profile?.display_name || user?.name,
  );
  const studentName =
    profile?.display_name ||
    user?.name ||
    coachingStudents.find((s) => s.key === studentKey)?.name ||
    studentKey;

  // Teachers use their profile display name / email; map to demo teacher when possible.
  const teacherMatch = useMemo(() => {
    if (!isTeacher) return null;
    const name = (profile?.display_name || user?.name || "").toLowerCase();
    return (
      demoTeachers.find(
        (teacher) =>
          teacher.nameEn.toLowerCase() === name ||
          teacher.id === profile?.display_name,
      ) || demoTeachers[0] || null
    );
  }, [isTeacher, profile?.display_name, user?.name]);

  const teacherId = teacherMatch?.id || "teacher";
  const teacherName =
    profile?.display_name || user?.name || teacherMatch?.nameEn || "Teacher";

  const [threads, setThreads] = useState<CenterThread[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<CenterMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [filter, setFilter] = useState<"all" | "feedback" | "chat">("all");
  const [composeTeacherId, setComposeTeacherId] = useState(
    demoTeachers[0]?.id || "",
  );
  const [composeStudentKey, setComposeStudentKey] = useState<string>(
    coachingStudents[0]?.key || "learner-demo",
  );
  const [unreadTotal, setUnreadTotal] = useState(0);

  function refreshThreads() {
    migrateCoachingIntoMessages();
    const next = listThreadsForParticipant(
      isTeacher
        ? { role: role === "admin" ? "admin" : "teacher", teacherId }
        : { role: "student", studentKey },
    );
    setThreads(next);
    setUnreadTotal(
      totalUnreadForParticipant(
        isTeacher
          ? { role: role === "admin" ? "admin" : "teacher", teacherId }
          : { role: "student", studentKey },
      ),
    );
    return next;
  }

  useEffect(() => {
    if (!user) return;
    const next = refreshThreads();
    if (!activeId && next[0]) setActiveId(next[0].id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isTeacher, teacherId, studentKey]);

  useEffect(() => {
    if (!activeId) {
      setMessages([]);
      return;
    }
    setMessages(messagesForThread(activeId));
    markThreadRead(activeId, isTeacher ? "teacher" : "student");
    refreshThreads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId, isTeacher]);

  const activeThread = threads.find((thread) => thread.id === activeId) || null;

  const visibleMessages = useMemo(() => {
    if (filter === "all") return messages;
    if (filter === "feedback") {
      return messages.filter(
        (m) => m.kind === "feedback" || m.kind === "recommendation",
      );
    }
    return messages.filter((m) => m.kind === "chat" || m.kind === "notification");
  }, [messages, filter]);

  function openThread(id: string) {
    setActiveId(id);
  }

  function onSend(event: FormEvent) {
    event.preventDefault();
    const body = draft.trim();
    if (!body || !activeThread) return;
    sendChatMessage({
      teacherId: activeThread.teacherId,
      teacherName: activeThread.teacherName,
      studentKey: activeThread.studentKey,
      studentName: activeThread.studentName,
      fromRole: isTeacher ? "teacher" : "student",
      body,
    });
    setDraft("");
    setMessages(messagesForThread(activeThread.id));
    refreshThreads();
  }

  function startConversation(event: FormEvent) {
    event.preventDefault();
    if (isTeacher) {
      const student =
        coachingStudents.find((s) => s.key === composeStudentKey) ||
        coachingStudents[0];
      if (!student) return;
      sendChatMessage({
        teacherId,
        teacherName,
        studentKey: student.key,
        studentName: student.name,
        fromRole: "teacher",
        body: t("threadStarted"),
      });
    } else {
      const teacher = demoTeachers.find((item) => item.id === composeTeacherId);
      if (!teacher) return;
      sendChatMessage({
        teacherId: teacher.id,
        teacherName: teacher.nameEn,
        studentKey,
        studentName,
        fromRole: "student",
        body: t("threadStarted"),
      });
    }
    const next = refreshThreads();
    if (next[0]) setActiveId(next[0].id);
  }

  if (loading) {
    return (
      <p className="text-sm text-black/50">{t("loading")}</p>
    );
  }

  if (!user) {
    return (
      <p className="text-sm text-black/60">
        {t("needLogin")}{" "}
        <Link href="/login" className="font-semibold text-[#0016BD] underline">
          {t("login")}
        </Link>
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#0016BD]">
            {t("eyebrow")}
          </p>
          <h2 className="mt-1 text-2xl font-bold text-[#0b0b1a]">{t("title")}</h2>
          <p className="mt-1 max-w-2xl text-sm text-black/60">{t("intro")}</p>
        </div>
        {unreadTotal > 0 ? (
          <span className="rounded-full bg-[#0016BD] px-3 py-1 text-xs font-bold text-white">
            {t("unreadBadge", { count: unreadTotal })}
          </span>
        ) : null}
      </div>

      <form
        onSubmit={startConversation}
        className="flex flex-wrap items-end gap-2 rounded-2xl border border-[#0016BD]/15 bg-[#f5f7ff] p-3"
      >
        <label className="min-w-[10rem] flex-1 text-xs font-semibold text-black/55">
          {isTeacher ? t("startWithStudent") : t("startWithTeacher")}
          {isTeacher ? (
            <select
              className="mt-1 w-full rounded-xl border border-black/15 bg-white px-3 py-2 text-sm"
              value={composeStudentKey}
              onChange={(e) => setComposeStudentKey(e.target.value)}
            >
              {coachingStudents
                .filter((s) => s.key !== "custom")
                .map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.name}
                  </option>
                ))}
            </select>
          ) : (
            <select
              className="mt-1 w-full rounded-xl border border-black/15 bg-white px-3 py-2 text-sm"
              value={composeTeacherId}
              onChange={(e) => setComposeTeacherId(e.target.value)}
            >
              {demoTeachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.nameEn}
                </option>
              ))}
            </select>
          )}
        </label>
        <button
          type="submit"
          className="rounded-full bg-[#0016BD] px-4 py-2 text-sm font-semibold text-white"
        >
          {t("startThread")}
        </button>
      </form>

      <div className="grid min-h-[28rem] overflow-hidden rounded-2xl border-2 border-black bg-white lg:grid-cols-[minmax(0,16rem)_1fr]">
        <aside className="border-b border-black/10 lg:border-b-0 lg:border-e">
          <div className="border-b border-black/10 px-3 py-2">
            <p className="text-xs font-bold uppercase tracking-wide text-black/45">
              {t("conversations")}
            </p>
          </div>
          {threads.length === 0 ? (
            <p className="px-3 py-6 text-sm text-black/50">{t("emptyThreads")}</p>
          ) : (
            <ul className="max-h-[14rem] overflow-y-auto lg:max-h-[32rem]">
              {threads.map((thread) => {
                const unread = unreadCountForThread(
                  thread.id,
                  isTeacher ? "teacher" : "student",
                );
                const title = isTeacher
                  ? thread.studentName
                  : thread.teacherName;
                const selected = thread.id === activeId;
                return (
                  <li key={thread.id}>
                    <button
                      type="button"
                      onClick={() => openThread(thread.id)}
                      className={`flex w-full flex-col gap-0.5 border-b border-black/5 px-3 py-3 text-start ${
                        selected ? "bg-[#eef1ff]" : "hover:bg-[#f7f7f7]"
                      }`}
                    >
                      <span className="flex items-center justify-between gap-2">
                        <span className="truncate text-sm font-semibold text-[#0b0b1a]">
                          {title}
                        </span>
                        {unread > 0 ? (
                          <span className="rounded-full bg-[#0016BD] px-1.5 text-[10px] font-bold text-white">
                            {unread}
                          </span>
                        ) : null}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wide text-[#0016BD]/80">
                        {kindLabel(thread.lastKind, t)}
                      </span>
                      <span className="line-clamp-2 text-xs text-black/55">
                        {thread.lastPreview}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </aside>

        <section className="flex min-h-[22rem] flex-col">
          {activeThread ? (
            <>
              <header className="flex flex-wrap items-center justify-between gap-2 border-b border-black/10 px-4 py-3">
                <div>
                  <p className="text-sm font-bold text-[#0b0b1a]">
                    {isTeacher
                      ? activeThread.studentName
                      : activeThread.teacherName}
                  </p>
                  <p className="text-xs text-black/50">
                    {t("contextWith", {
                      teacher: activeThread.teacherName,
                      student: activeThread.studentName,
                    })}
                  </p>
                </div>
                <div className="flex gap-1 rounded-full bg-black/5 p-1 text-xs font-semibold">
                  {(
                    [
                      ["all", t("filterAll")],
                      ["feedback", t("filterFeedback")],
                      ["chat", t("filterChat")],
                    ] as const
                  ).map(([key, label]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setFilter(key)}
                      className={`rounded-full px-2.5 py-1 ${
                        filter === key
                          ? "bg-white text-[#0016BD] shadow-sm"
                          : "text-black/55"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </header>

              <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
                {visibleMessages.length === 0 ? (
                  <p className="text-sm text-black/45">{t("emptyMessages")}</p>
                ) : (
                  visibleMessages.map((msg) => {
                    const mine =
                      (isTeacher && msg.fromRole === "teacher") ||
                      (!isTeacher && msg.fromRole === "student");
                    return (
                      <article
                        key={msg.id}
                        className={`max-w-[90%] rounded-2xl px-3 py-2 text-sm ${
                          mine
                            ? "ms-auto bg-[#0016BD] text-white"
                            : "bg-[#f3f4f8] text-[#0b0b1a]"
                        }`}
                      >
                        <div className="mb-1 flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-wide opacity-80">
                          <span>{kindLabel(msg.kind, t)}</span>
                          <span>·</span>
                          <span>{msg.fromName}</span>
                          <span>·</span>
                          <span>{formatWhen(msg.createdAt)}</span>
                        </div>
                        {msg.kind === "feedback" && msg.meta?.rating ? (
                          <p className="mb-1 text-xs font-semibold opacity-90">
                            {t("ratingLine", { count: msg.meta.rating })}
                          </p>
                        ) : null}
                        {msg.kind === "recommendation" && msg.meta?.lessonTitle ? (
                          <p className="mb-1 text-xs font-semibold opacity-90">
                            {t("lessonLine", { title: msg.meta.lessonTitle })}
                          </p>
                        ) : null}
                        <p className="whitespace-pre-wrap leading-relaxed">
                          {msg.body}
                        </p>
                        {msg.kind === "recommendation" ? (
                          <Link
                            href="/lessons"
                            className={`mt-2 inline-block text-xs font-semibold underline ${
                              mine ? "text-white" : "text-[#0016BD]"
                            }`}
                          >
                            {t("openLessons")}
                          </Link>
                        ) : null}
                      </article>
                    );
                  })
                )}
              </div>

              <form
                onSubmit={onSend}
                className="flex gap-2 border-t border-black/10 p-3"
              >
                <label className="sr-only" htmlFor="messages-draft">
                  {t("composeLabel")}
                </label>
                <input
                  id="messages-draft"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder={t("composePlaceholder")}
                  className="min-w-0 flex-1 rounded-xl border border-black/15 px-3 py-2 text-sm outline-none focus:border-[#0016BD]"
                />
                <button
                  type="submit"
                  disabled={!draft.trim()}
                  className="rounded-full bg-[#0b0b1a] px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
                >
                  {t("send")}
                </button>
              </form>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center px-6 text-center text-sm text-black/45">
              {t("pickThread")}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
