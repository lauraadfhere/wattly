import { getTranslations } from "next-intl/server";
import CourseCovers from "@/components/courses/CourseCovers";
import CoursesDemo from "@/components/courses/CoursesDemo";
import PlatformShell from "@/components/platform/PlatformShell";
import { Link } from "@/i18n/navigation";

export default async function CoursesPage() {
  const t = await getTranslations("Courses");
  const tActivities = await getTranslations("Activities");

  return (
    <PlatformShell title={t("title")} intro={t("subtitle")}>
      <section className="rounded-3xl border border-[#0016BD]/15 bg-white p-5 sm:p-6">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#c45c00]">
          {t("coversKicker")}
        </p>
        <h2 className="mt-1 text-xl font-bold text-[#000A5E]">{t("coversTitle")}</h2>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-black/60">{t("coversIntro")}</p>
        <div className="mt-5">
          <CourseCovers />
        </div>
      </section>

      <div className="mt-10">
        <CoursesDemo />
      </div>

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
