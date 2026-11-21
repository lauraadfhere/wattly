"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  feedbackForStudent,
  recommendationsForStudent,
  resolveStudentKey,
  type CoachingFeedback,
  type LessonRecommendation,
} from "@/lib/teacher-coaching";

export default function StudentCoachingInbox() {
  const t = useTranslations("TeacherCoaching");
  const { user, profile, loading } = useAuth();
  const [feedback, setFeedback] = useState<CoachingFeedback[]>([]);
  const [recs, setRecs] = useState<LessonRecommendation[]>([]);

  useEffect(() => {
    if (!user) return;
    const key = resolveStudentKey(user.email, profile?.display_name || user.name);
    setFeedback(feedbackForStudent(key));
    setRecs(recommendationsForStudent(key));
  }, [user, profile]);

  if (loading || !user) return null;
  if (profile?.role === "teacher" || profile?.role === "admin") return null;
  if (!feedback.length && !recs.length) return null;

  return (
    <section className="mt-8 space-y-4 rounded-2xl border-2 border-[#0016BD]/15 bg-white p-5">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#0016BD]">
          {t("inboxEyebrow")}
        </p>
        <h2 className="mt-1 text-xl font-bold text-[#0b0b1a]">{t("inboxTitle")}</h2>
      </div>

      {feedback.length ? (
        <div>
          <h3 className="mb-2 text-sm font-bold">{t("yourFeedback")}</h3>
          <ul className="space-y-2">
            {feedback.slice(0, 4).map((item) => (
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
            {recs.slice(0, 4).map((item) => (
              <li key={item.id} className="rounded-xl bg-[#fff8ef] px-3 py-2 text-sm">
                <p className="font-semibold text-[#c45c00]">
                  {item.teacherName} → {item.lessonTitle}
                </p>
                <p className="mt-1 text-black/70">{item.reason}</p>
                <Link href="/lessons" className="mt-2 inline-block text-xs font-semibold text-[#0016BD] underline">
                  {t("openLessons")}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
