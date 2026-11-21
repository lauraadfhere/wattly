import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import PlatformShell from "@/components/platform/PlatformShell";
import { storiesFor } from "@/lib/stories";

export default async function StoriesHubPage() {
  const t = await getTranslations("Stories");
  const kids = storiesFor("kids");
  const adults = storiesFor("adults");

  return (
    <PlatformShell title={t("title")} intro={t("intro")} gate="auth">
      <section className="mb-10">
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#c45c00]">
              {t("kidsShelf")}
            </p>
            <h2 className="text-xl font-bold text-[#0b0b1a]">{t("kidsTitle")}</h2>
          </div>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {kids.map((story) => (
            <Link
              key={story.id}
              href={`/stories/${story.id}`}
              className="w-[9.5rem] shrink-0 sm:w-40"
            >
              <div
                className="flex aspect-[2/3] flex-col justify-end rounded-lg p-3 text-white shadow-md"
                style={{ backgroundColor: story.cover }}
              >
                <p className="text-[10px] font-semibold uppercase tracking-wide text-white/80">
                  {story.level}
                </p>
                <p className="mt-1 text-sm font-bold leading-snug">{story.title}</p>
              </div>
              <p className="mt-2 line-clamp-2 text-xs text-black/60">{story.summary}</p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-4">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0016BD]">
            {t("adultsShelf")}
          </p>
          <h2 className="text-xl font-bold text-[#0b0b1a]">{t("adultsTitle")}</h2>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {adults.map((story) => (
            <Link
              key={story.id}
              href={`/stories/${story.id}`}
              className="w-[9.5rem] shrink-0 sm:w-40"
            >
              <div
                className="flex aspect-[2/3] flex-col justify-end rounded-lg p-3 text-white shadow-md"
                style={{ backgroundColor: story.cover }}
              >
                <p className="text-[10px] font-semibold uppercase tracking-wide text-white/80">
                  {story.level}
                </p>
                <p className="mt-1 text-sm font-bold leading-snug">{story.title}</p>
              </div>
              <p className="mt-2 line-clamp-2 text-xs text-black/60">{story.summary}</p>
            </Link>
          ))}
        </div>
      </section>

      <p className="mt-8">
        <Link href="/dashboard" className="text-sm font-semibold text-[#0016BD] underline">
          {t("backDashboard")}
        </Link>
      </p>
    </PlatformShell>
  );
}
