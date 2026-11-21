import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import CurriculumHub from "@/components/curriculum/CurriculumHub";
import PlatformShell from "@/components/platform/PlatformShell";

export default async function CurriculumPage() {
  const t = await getTranslations("Curriculum");

  return (
    <PlatformShell title={t("pageTitle")} intro={t("pageIntro")} gate="auth">
      <CurriculumHub />
      <p className="mt-8">
        <Link href="/courses" className="text-sm font-semibold text-[#0016BD] underline">
          {t("backCourses")}
        </Link>
      </p>
    </PlatformShell>
  );
}
