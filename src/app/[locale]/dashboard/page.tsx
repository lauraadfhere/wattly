import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import PlatformShell from "@/components/platform/PlatformShell";

export default async function DashboardPage() {
  const t = await getTranslations("Dashboard");

  const cards = [
    { href: "/teachers", title: t("findTeacher"), body: t("findTeacherBody") },
    { href: "/practice", title: t("practice"), body: t("practiceBody") },
    { href: "/lessons", title: t("lessons"), body: t("lessonsBody") },
    { href: "/assessment", title: t("assessment"), body: t("assessmentBody") },
  ] as const;

  return (
    <PlatformShell title={t("title")}>
      <p className="mb-8 max-w-2xl text-base leading-7 text-[#000A5E]/75">
        {t("intro")}
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-2xl border border-[#0016BD]/15 bg-white p-5"
          >
            <h2 className="text-xl font-bold text-[#000A5E]">{card.title}</h2>
            <p className="mt-2 text-sm leading-6 text-[#000A5E]/70">{card.body}</p>
          </Link>
        ))}
      </div>
    </PlatformShell>
  );
}
