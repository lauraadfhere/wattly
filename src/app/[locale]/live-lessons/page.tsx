import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import KidsLessonIcon from "@/components/live/KidsLessonIcon";
import PlatformShell from "@/components/platform/PlatformShell";
import { fetchLiveLessons, liveLessonStyles } from "@/lib/live-lessons";

export default async function LiveLessonsPage() {
  const t = await getTranslations("LiveLessons");
  const locale = await getLocale();
  const isAr = locale === "ar";

  const liveLessons = await fetchLiveLessons();
  const kids = liveLessons.filter((lesson) => lesson.category === "kids");
  const adults = liveLessons.filter((lesson) => lesson.category === "adults");

  return (
    <PlatformShell title={t("title")} intro={t("intro")}>
      <section className="mb-10">
        <div className="mb-4 flex items-center gap-2">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#ffe0b8] text-[#c45c00]">
            <KidsLessonIcon name="star" className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#c45c00]">
              {t("kidsEyebrow")}
            </p>
            <h2 className="text-xl font-bold text-[#0b0b1a]">{t("kidsTitle")}</h2>
          </div>
        </div>
        <ul className="grid gap-4 sm:grid-cols-2">
          {kids.map((lesson) => {
            const style = liveLessonStyles.kids;
            return (
              <li
                key={lesson.id}
                className={`rounded-2xl border-2 p-4 ${style.card}`}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${style.iconBg} ${style.accent}`}
                  >
                    <KidsLessonIcon name={lesson.icon} className="h-6 w-6" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${style.badge}`}>
                        {t("kidsBadge")}
                      </span>
                      <span className="text-xs font-medium text-black/55">{lesson.level}</span>
                    </div>
                    <h3 className="mt-1.5 text-base font-bold text-[#0b0b1a]">
                      {isAr ? lesson.titleAr : lesson.title}
                    </h3>
                    <p className="mt-1 text-sm text-black/65">
                      {isAr ? lesson.teacherAr : lesson.teacher} · {lesson.when}
                    </p>
                    <p className={`mt-2 text-sm font-semibold ${style.accent}`}>
                      {t("duration", { minutes: lesson.durationMin })}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section>
        <div className="mb-4 flex items-center gap-2">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#d4dcff] text-[#0016BD]">
            <KidsLessonIcon name="globe" className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#0016BD]">
              {t("adultsEyebrow")}
            </p>
            <h2 className="text-xl font-bold text-[#0b0b1a]">{t("adultsTitle")}</h2>
          </div>
        </div>
        <ul className="grid gap-4 sm:grid-cols-2">
          {adults.map((lesson) => {
            const style = liveLessonStyles.adults;
            return (
              <li
                key={lesson.id}
                className={`rounded-2xl border-2 p-4 ${style.card}`}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${style.iconBg} ${style.accent}`}
                  >
                    <KidsLessonIcon name={lesson.icon} className="h-6 w-6" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${style.badge}`}>
                        {t("adultsBadge")}
                      </span>
                      <span className="text-xs font-medium text-black/55">{lesson.level}</span>
                    </div>
                    <h3 className="mt-1.5 text-base font-bold text-[#0b0b1a]">
                      {isAr ? lesson.titleAr : lesson.title}
                    </h3>
                    <p className="mt-1 text-sm text-black/65">
                      {isAr ? lesson.teacherAr : lesson.teacher} · {lesson.when}
                    </p>
                    <p className={`mt-2 text-sm font-semibold ${style.accent}`}>
                      {t("duration", { minutes: lesson.durationMin })}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <p className="mt-8">
        <Link href="/dashboard" className="text-sm font-semibold text-[#0016BD] underline underline-offset-2">
          {t("backDashboard")}
        </Link>
      </p>
    </PlatformShell>
  );
}
