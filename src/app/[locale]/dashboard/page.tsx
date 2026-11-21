import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import DashboardShell from "@/components/platform/DashboardShell";
import StudentCoachingInbox from "@/components/teachers/StudentCoachingInbox";

export default async function DashboardPage() {
  const t = await getTranslations("Dashboard");

  const cards = [
    { href: "/teachers", title: t("findTeacher"), body: t("findTeacherBody") },
    { href: "/live-lessons", title: t("liveLessons"), body: t("liveLessonsBody") },
    { href: "/stories", title: t("stories"), body: t("storiesBody") },
    { href: "/practice", title: t("practice"), body: t("practiceBody") },
    { href: "/practice/oral", title: t("oral"), body: t("oralBody") },
    { href: "/audiobooks", title: t("audiobooks"), body: t("audiobooksBody") },
    { href: "/lessons", title: t("lessons"), body: t("lessonsBody") },
    { href: "/assessment", title: t("assessment"), body: t("assessmentBody") },
  ] as const;

  return (
    <DashboardShell title={t("title")} intro={t("intro")}>
      <div className="grid gap-4 sm:grid-cols-2">
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
      <StudentCoachingInbox />
    </DashboardShell>
  );
}
