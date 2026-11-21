import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import LiveLessonRoom from "@/components/live/LiveLessonRoom";
import PlatformShell from "@/components/platform/PlatformShell";
import { featuredLiveLessons, fetchLiveLesson } from "@/lib/live-lessons";

export function generateStaticParams() {
  return featuredLiveLessons.map((lesson) => ({ id: lesson.id }));
}

type Props = {
  params: Promise<{ id: string }>;
};

export default async function LiveLessonRoomPage({ params }: Props) {
  const { id } = await params;
  const lesson = await fetchLiveLesson(id);
  if (!lesson) notFound();

  const t = await getTranslations("LiveLessons");

  return (
    <PlatformShell title={t("roomTitle")} intro={t("roomIntro")} gate="auth">
      <LiveLessonRoom lesson={lesson} />
    </PlatformShell>
  );
}
