import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import PlatformShell from "@/components/platform/PlatformShell";
import BalliaiChat from "@/components/practice/BalliaiChat";
import { retrieveLessonContext } from "@/lib/balliai.server";
import { isBalliaiMode, type BalliaiMode } from "@/lib/balliai";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ConversationPracticePage({ searchParams }: Props) {
  const t = await getTranslations("Practice");
  const params = await searchParams;
  const activityId = first(params.activity);
  const storyId = first(params.story);
  const prompt = first(params.q)?.slice(0, 300);
  const rawMode = first(params.mode);
  const mode: BalliaiMode = isBalliaiMode(rawMode) ? rawMode : "ask";

  const { lesson } = await retrieveLessonContext({ activityId, storyId });

  return (
    <PlatformShell title={t("conversation")} intro={t("balliaiIntro")}>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_260px]">
        <BalliaiChat
          lesson={lesson ? { title: lesson.title, kind: lesson.kind } : null}
          activityId={activityId}
          storyId={storyId}
          initialPrompt={prompt}
          initialMode={mode}
        />

        <aside className="space-y-4">
          {lesson ? (
            <section className="rounded-2xl border border-[#0016BD]/15 bg-white p-4">
              <p className="text-[11px] font-bold uppercase tracking-wide text-[#c45c00]">
                {t("balliaiLesson")}
              </p>
              <p className="mt-1 text-sm font-semibold text-[#000A5E]">{lesson.title}</p>
              <p className="mt-2 text-xs leading-5 text-black/55">{t("balliaiLessonNote")}</p>
            </section>
          ) : null}

          <section className="rounded-2xl border border-[#0016BD]/15 bg-white p-4">
            <p className="text-xs font-bold text-[#000A5E]">{t("balliaiMoreTitle")}</p>
            <ul className="mt-2 space-y-1.5 text-xs">
              <li>
                <Link href="/courses/activities" className="text-[#0016BD] underline">
                  {t("balliaiMoreActivities")}
                </Link>
              </li>
              <li>
                <Link href="/stories" className="text-[#0016BD] underline">
                  {t("balliaiMoreStories")}
                </Link>
              </li>
              <li>
                <Link href="/practice" className="text-[#0016BD] underline">
                  {t("balliaiMorePractice")}
                </Link>
              </li>
            </ul>
          </section>
        </aside>
      </div>
    </PlatformShell>
  );
}
