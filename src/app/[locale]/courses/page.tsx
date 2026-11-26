import { getTranslations } from "next-intl/server";
import CoursesDemo from "@/components/courses/CoursesDemo";
import PlatformShell from "@/components/platform/PlatformShell";
import { Link } from "@/i18n/navigation";

export default async function CoursesPage() {
  const t = await getTranslations("Courses");
  const tActivities = await getTranslations("Activities");

  return (
    <PlatformShell title={t("title")} intro={t("subtitle")}>
      <CoursesDemo />

      <section className="mt-10 rounded-2xl border-2 border-[#0016BD]/15 bg-[#f8f9ff] p-5">
        <h2 className="text-lg font-bold text-[#0b0b1a]">{tActivities("title")}</h2>
        <p className="mt-1 text-sm text-black/65">{tActivities("intro")}</p>
        <p className="mt-3">
          <Link
            href="/courses/activities"
            className="text-sm font-semibold text-[#0016BD] underline"
          >
            {tActivities("curriculumTitle")} · {tActivities("writingTitle")}
          </Link>
        </p>
      </section>
    </PlatformShell>
  );
}
