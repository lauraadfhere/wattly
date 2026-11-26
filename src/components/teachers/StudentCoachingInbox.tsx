"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  listThreadsForParticipant,
  migrateCoachingIntoMessages,
  totalUnreadForParticipant,
  type CenterThread,
} from "@/lib/messages-center";
import {
  feedbackForStudent,
  recommendationsForStudent,
  resolveStudentKey,
  type CoachingFeedback,
  type LessonRecommendation,
} from "@/lib/teacher-coaching";

export default function StudentCoachingInbox() {
  const t = useTranslations("TeacherCoaching");
  const tMsg = useTranslations("MessagesCenter");
  const { user, profile, loading } = useAuth();
  const [feedback, setFeedback] = useState<CoachingFeedback[]>([]);
  const [recs, setRecs] = useState<LessonRecommendation[]>([]);
  const [threads, setThreads] = useState<CenterThread[]>([]);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!user) return;
    const key = resolveStudentKey(user.email, profile?.display_name || user.name);
    migrateCoachingIntoMessages();
    setFeedback(feedbackForStudent(key));
    setRecs(recommendationsForStudent(key));
    setThreads(listThreadsForParticipant({ role: "student", studentKey: key }));
    setUnread(totalUnreadForParticipant({ role: "student", studentKey: key }));
  }, [user, profile]);

  if (loading || !user) return null;
  if (profile?.role === "teacher" || profile?.role === "admin") return null;
  if (!feedback.length && !recs.length && !threads.length) return null;

  return (
    <section className="mt-8 space-y-4 rounded-2xl border-2 border-[#0016BD]/15 bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#0016BD]">
            {t("inboxEyebrow")}
          </p>
          <h2 className="mt-1 text-xl font-bold text-[#0b0b1a]">{t("inboxTitle")}</h2>
          <p className="mt-1 text-sm text-black/55">{tMsg("inboxHint")}</p>
        </div>
        <Link
          href="/messages"
          className="rounded-full bg-[#0016BD] px-4 py-2 text-sm font-semibold text-white"
        >
          {unread > 0
            ? tMsg("openInboxUnread", { count: unread })
            : tMsg("openInbox")}
        </Link>
      </div>

      {feedback.length ? (
        <div>
          <h3 className="mb-2 text-sm font-bold">{t("yourFeedback")}</h3>
          <ul className="space-y-2">
            {feedback.slice(0, 3).map((item) => (
              <li key={item.id} className="rounded-xl bg-[#f5f7ff] px-3 py-2 text-sm">
                <p className="font-semibold text-[#0016BD]">
                  {item.teacherName} · {t("stars", { count: item.rating })}
                </p>
                <p className="mt-1 text-black/70">{item.note}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {recs.length ? (
        <div>
          <h3 className="mb-2 text-sm font-bold">{t("yourRecs")}</h3>
          <ul className="space-y-2">
            {recs.slice(0, 3).map((item) => (
              <li key={item.id} className="rounded-xl bg-[#fff8ef] px-3 py-2 text-sm">
                <p className="font-semibold text-[#c45c00]">
                  {item.teacherName} → {item.lessonTitle}
                </p>
                <p className="mt-1 text-black/70">{item.reason}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
