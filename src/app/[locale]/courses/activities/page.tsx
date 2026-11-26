import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import PlatformShell from "@/components/platform/PlatformShell";
import { fetchActivities } from "@/lib/activities.server";

export const dynamic = "force-dynamic";

export default async function ActivitiesPage() {
  const t = await getTranslations("Activities");
  const activities = await fetchActivities();

  const curriculum = activities.filter((a) => a.track === "curriculum");
  const writing = activities.filter((a) => a.track === "writing");

  const curriculumBySkill = [
    { skill: "Grammar", items: curriculum.filter((a) => a.skill === "Grammar") },
    { skill: "Writing", items: curriculum.filter((a) => a.skill === "Writing") },
  ].filter((g) => g.items.length);

  return (
    <PlatformShell title={t("title")} intro={t("intro")} gate="none">
      <section>
        <h2 className="text-lg font-bold text-[#0b0b1a]">{t("curriculumTitle")}</h2>
        <p className="mt-1 text-sm text-black/60">{t("curriculumIntro")}</p>
        <div className="mt-4 grid gap-6 sm:grid-cols-2">
          {curriculumBySkill.map((group) => (
            <div key={group.skill}>
              <p className="mb-2 text-xs font-semibold text-[#c45c00]">
                {group.skill} · {group.items.length}
              </p>
              <ul className="space-y-2">
                {group.items.map((activity) => (
                  <li key={activity.id}>
                    <Link
                      href={`/courses/activities/${activity.id}`}
                      className="block rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-medium hover:border-[#0016BD]/40"
                    >
                      <span className="text-black/45">
                        {activity.level} · {activity.title}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12 border-t border-black/10 pt-8">
        <h2 className="text-lg font-bold text-[#0b0b1a]">{t("writingTitle")}</h2>
        <p className="mt-1 text-sm text-black/60">{t("writingIntro")}</p>
        <div className="mt-4 space-y-6">
          {[1, 2, 3, 4, 5].map((group) => {
            const items = writing.filter((a) => a.group === group);
            if (!items.length) return null;
            return (
              <div key={group}>
                <p className="mb-2 text-xs font-semibold text-[#0016BD]">
                  {items[0]?.groupLabel} · {items[0]?.level} · {items.length}
                </p>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {items.map((activity) => (
                    <li key={activity.id}>
                      <Link
                        href={`/courses/activities/${activity.id}`}
                        className="block rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-medium hover:border-[#0016BD]/40"
                      >
                        {activity.number}. {activity.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      <p className="mt-8">
        <Link href="/courses" className="text-sm font-semibold text-[#0016BD] underline">
          {t("backCourses")}
        </Link>
      </p>
    </PlatformShell>
  );
}
