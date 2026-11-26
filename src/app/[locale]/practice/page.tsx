import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import PlatformShell from "@/components/platform/PlatformShell";
import { fetchActivities } from "@/lib/activities.server";
import { fetchStories } from "@/lib/stories.server";

export const dynamic = "force-dynamic";

export default async function PracticePage() {
  const t = await getTranslations("Practice");
  const [activities, stories] = await Promise.all([fetchActivities(), fetchStories()]);

  const practiceContextStories = stories.filter((s) => s.questions?.length).slice(0, 3);
  const curriculum = activities.filter((a) => a.track === "curriculum").slice(0, 3);
  const writing = activities.filter((a) => a.track === "writing").slice(0, 3);

  const contexts = [
    { key: "curriculum", items: curriculum },
    { key: "writing", items: writing },
  ] as const;

  const activitiesList = [
    { href: "/practice/vocabulary", title: t("vocabulary"), body: t("vocabularyBody") },
    { href: "/practice/listening", title: t("listening"), body: t("listeningBody") },
    { href: "/practice/conversation", title: t("conversation"), body: t("conversationBody"), highlight: true },
    { href: "/practice/pronunciation", title: t("pronunciation"), body: t("pronunciationBody") },
  ] as const;

  return (
    <PlatformShell title={t("title")} intro={t("intro")}>
      <section className="rounded-3xl border border-[#0016BD]/20 bg-[#0016BD] p-6 text-white">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#FFD400]">BALLIAI</p>
        <h2 className="mt-1 text-2xl font-bold">{t("balliaiTitle")}</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-white/80">{t("balliaiBody")}</p>
        <Link
          href="/practice/conversation"
          className="mt-4 inline-flex rounded-full bg-[#FFD400] px-5 py-2.5 text-sm font-bold text-[#000A5E]"
        >
          {t("balliaiCta")}
        </Link>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-bold text-[#0b0b1a]">{t("waysTitle")}</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {activitiesList.map((activity) => (
            <Link
              key={activity.href}
              href={activity.href}
              className={`rounded-2xl border-2 bg-white p-5 ${
                "highlight" in activity ? "border-[#0016BD]/40" : "border-[#0016BD]/15"
              }`}
            >
              <h3 className="text-lg font-bold text-[#000A5E]">{activity.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#000A5E]/70">{activity.body}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-12 border-t border-black/10 pt-8">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-black/45">
          {t("contextKicker")}
        </p>
        <h2 className="mt-1 text-lg font-bold text-[#0b0b1a]">{t("contextTitle")}</h2>
        <p className="mt-1 max-w-2xl text-sm text-black/60">{t("contextIntro")}</p>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {practiceContextStories.map((story) => (
            <article
              key={story.id}
              className="flex flex-col rounded-2xl border border-black/10 bg-white p-4"
            >
              <p className="text-[11px] font-bold uppercase tracking-wide text-[#c45c00]">
                {story.level} · {t("storyLabel")}
              </p>
              <h3 className="mt-1 text-base font-bold text-[#0b0b1a]">{story.title}</h3>
              {story.questions?.[0] ? (
                <p className="mt-2 line-clamp-3 text-sm leading-6 text-black/65">
                  {story.questions[0]}
                </p>
              ) : null}
              <p className="mt-2 text-xs text-black/45">
                {t("questionCount", { count: story.questions?.length ?? 0 })}
              </p>
              <div className="mt-3 flex flex-wrap gap-3 text-xs font-semibold">
                <Link href={`/stories/${story.id}`} className="text-[#0016BD] underline">
                  {t("openStory")}
                </Link>
                <Link
                  href={`/practice/conversation?story=${story.id}&mode=reading`}
                  className="text-[#c45c00] underline"
                >
                  {t("askBalliai")}
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {contexts.map((group) => (
            <div key={group.key}>
              <p className="mb-2 text-xs font-semibold text-[#0016BD]">
                {group.key === "curriculum" ? t("contextCurriculum") : t("contextWriting")}
              </p>
              <ul className="space-y-2">
                {group.items.map((activity) => (
                  <li
                    key={activity.id}
                    className="rounded-xl border border-black/10 bg-white p-3"
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-black/40">
                      {activity.level} · {activity.skill}
                    </p>
                    <Link
                      href={`/courses/activities/${activity.id}`}
                      className="text-sm font-semibold text-[#0b0b1a] hover:text-[#0016BD]"
                    >
                      {activity.title}
                    </Link>
                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-black/55">
                      {activity.task}
                    </p>
                    <Link
                      href={`/practice/conversation?activity=${activity.id}&mode=grammar`}
                      className="mt-2 inline-block text-xs font-semibold text-[#c45c00] underline"
                    >
                      {t("askBalliai")}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="mt-6 flex flex-wrap gap-4 text-sm">
          <Link href="/courses/activities" className="font-semibold text-[#0016BD] underline">
            {t("allActivities")}
          </Link>
          <Link href="/stories" className="font-semibold text-[#0016BD] underline">
            {t("allStories")}
          </Link>
        </p>
      </section>
    </PlatformShell>
  );
}
