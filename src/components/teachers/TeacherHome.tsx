"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import TeacherCoachingPanel from "@/components/teachers/TeacherCoachingPanel";
import { coachingStudents } from "@/lib/teacher-coaching";

export default function TeacherHome() {
  const t = useTranslations("TeacherDashboard");
  const { user, profile, loading } = useAuth();

  if (loading) return null;

  const isTeacher = profile?.role === "teacher" || profile?.role === "admin";
  if (!isTeacher) {
    return (
      <div className="rounded-2xl border-2 border-black bg-white p-5">
        <p className="text-sm text-black/70">{t("notTeacher")}</p>
        <Link href="/dashboard" className="mt-2 inline-block text-sm font-semibold text-[#0016BD] underline">
          {t("goStudent")}
        </Link>
      </div>
    );
  }

  const teacherId = user?.$id ?? "teacher";
  const teacherName = profile?.display_name || t("defaultName");

  const cards = [
    { href: "/messages", title: t("messages"), body: t("messagesBody") },
    { href: "/live-lessons", title: t("liveLessons"), body: t("liveLessonsBody") },
    { href: "/lessons", title: t("lessons"), body: t("lessonsBody") },
    { href: "/teachers", title: t("teachersDirectory"), body: t("teachersDirectoryBody") },
  ] as const;

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border-2 border-black bg-white p-5">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-black/55">{t("studentsCount")}</p>
          <p className="dashboard-title mt-2 text-3xl font-semibold">{coachingStudents.length}</p>
        </div>
        <div className="rounded-2xl border-2 border-black bg-white p-5 sm:col-span-2">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-black/55">{t("welcome")}</p>
          <p className="dashboard-title mt-2 text-xl font-semibold">{teacherName}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-2xl border-2 border-black bg-white p-5 text-black"
          >
            <h2 className="dashboard-title text-xl font-semibold">{card.title}</h2>
            <p className="mt-2 text-sm leading-6 text-black/70">{card.body}</p>
          </Link>
        ))}
      </div>

      <TeacherCoachingPanel teacherId={teacherId} teacherName={teacherName} />
    </>
  );
}
