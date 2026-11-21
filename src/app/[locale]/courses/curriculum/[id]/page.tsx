import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import CurriculumActivityPlayer from "@/components/curriculum/CurriculumActivityPlayer";
import PlatformShell from "@/components/platform/PlatformShell";
import { allCurriculumActivities, getCurriculumActivity } from "@/lib/curriculum";

export function generateStaticParams() {
  return allCurriculumActivities.map((activity) => ({ id: activity.id }));
}

type Props = {
  params: Promise<{ id: string }>;
};

export default async function CurriculumActivityPage({ params }: Props) {
  const { id } = await params;
  const activity = getCurriculumActivity(id);
  if (!activity) notFound();

  const t = await getTranslations("Curriculum");

  return (
    <PlatformShell title={t("activityTitle")} intro={t("activityIntro")} gate="auth">
      <CurriculumActivityPlayer activity={activity} />
    </PlatformShell>
  );
}
