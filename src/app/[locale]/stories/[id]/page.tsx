import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import PlatformShell from "@/components/platform/PlatformShell";
import StoryPlayer from "@/components/stories/StoryPlayer";
import { fetchStory } from "@/lib/stories.server";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function StoryDetailPage({ params }: Props) {
  const { id } = await params;
  const story = await fetchStory(id);
  if (!story) notFound();

  const t = await getTranslations("Stories");

  return (
    <PlatformShell title={t("playerTitle")} gate="auth">
      <StoryPlayer story={story} />
      {story.questions?.length ? (
        <section className="mt-6 rounded-2xl border border-black/10 bg-white p-5">
          <h3 className="text-sm font-bold text-[#0b0b1a]">{t("questionsTitle")}</h3>
          <ol className="mt-3 list-decimal space-y-2 ps-5 text-sm text-black/75">
            {story.questions.map((q) => (
              <li key={q}>{q}</li>
            ))}
          </ol>
        </section>
      ) : null}
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
