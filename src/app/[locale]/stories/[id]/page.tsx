import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import PlatformShell from "@/components/platform/PlatformShell";
import StoryPlayer from "@/components/stories/StoryPlayer";
import { getStoryById, stories } from "@/lib/stories";

export function generateStaticParams() {
  return stories.map((story) => ({ id: story.id }));
}

type Props = {
  params: Promise<{ id: string }>;
};

export default async function StoryDetailPage({ params }: Props) {
  const { id } = await params;
  const story = getStoryById(id);
  if (!story) notFound();

  const t = await getTranslations("Stories");

  return (
    <PlatformShell title={t("playerTitle")} gate="auth">
      <StoryPlayer story={story} />
      <p className="mt-8 flex flex-wrap gap-4 text-sm">
        <Link href="/stories" className="font-semibold text-[#0016BD] underline">
          {t("backStories")}
        </Link>
        <Link href="/dashboard" className="font-semibold text-black/60 underline">
          {t("backDashboard")}
        </Link>
      </p>
    </PlatformShell>
  );
}
