import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import PlatformShell from "@/components/platform/PlatformShell";
import { fetchActivity } from "@/lib/activities.server";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ActivityDetailPage({ params }: Props) {
  const { id } = await params;
  const activity = await fetchActivity(id);
  if (!activity) notFound();

  const t = await getTranslations("Activities");

  const meta = [
    activity.skill,
    activity.level,
    activity.minutes ? `${activity.minutes} min` : null,
    activity.genre,
    activity.length,
    activity.focus,
  ].filter(Boolean);

  const sections = [
    { title: t("outcome"), body: activity.outcome },
    { title: t("task"), body: activity.task },
    { title: t("procedure"), body: activity.procedure },
    { title: t("model"), body: activity.model },
    { title: t("success"), body: activity.success },
    { title: t("after"), body: activity.after },
  ].filter((s) => s.body);

  return (
    <PlatformShell title={activity.title} gate="none">
      <article className="rounded-2xl border-2 border-black/10 bg-white p-5">
        <p className="text-xs font-bold uppercase tracking-wide text-black/45">
          {activity.externalId} · {meta.join(" · ")}
        </p>
        <h2 className="mt-1 text-2xl font-bold text-[#0b0b1a]">{activity.title}</h2>
        <div className="mt-5 space-y-4">
          {sections.map((section) => (
            <section key={section.title}>
              <h3 className="text-sm font-bold text-[#0016BD]">{section.title}</h3>
              <p className="mt-1 text-sm leading-6 text-black/75">{section.body}</p>
            </section>
          ))}
        </div>
      </article>

      <Link
        href={`/practice/conversation?activity=${activity.id}&mode=grammar`}
        className="mt-5 inline-flex rounded-full bg-[#0016BD] px-5 py-2.5 text-sm font-bold text-white"
      >
        {t("askBalliai")}
      </Link>

      <p className="mt-8 flex flex-wrap gap-4 text-sm">
        <Link
          href="/courses/activities"
          className="font-semibold text-[#0016BD] underline"
        >
          {t("backActivities")}
        </Link>
        <Link href="/dashboard" className="font-semibold text-black/60 underline">
          {t("backDashboard")}
        </Link>
      </p>
    </PlatformShell>
  );
}
