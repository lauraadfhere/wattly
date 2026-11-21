import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import LiveLessonsStudio from "@/components/live/LiveLessonsStudio";
import PlatformShell from "@/components/platform/PlatformShell";
import { fetchLiveLessons } from "@/lib/live-lessons";

export default async function LiveLessonsPage() {
  const t = await getTranslations("LiveLessons");
  const lessons = await fetchLiveLessons();

  return (
    <PlatformShell title={t("title")} intro={t("intro")}>
      <LiveLessonsStudio lessons={lessons} />
      <p className="mt-8">
        <Link
          href="/dashboard"
          className="text-sm font-semibold text-[#0016BD] underline underline-offset-2"
        >
          {t("backDashboard")}
        </Link>
      </p>
    </PlatformShell>
  );
}
