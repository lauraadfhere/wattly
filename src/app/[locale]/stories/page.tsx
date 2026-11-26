import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import LibraryShelf from "@/components/library/LibraryShelf";
import PlatformShell from "@/components/platform/PlatformShell";
import { fetchStories } from "@/lib/stories.server";

export default async function StoriesHubPage() {
  const t = await getTranslations("Stories");
  const tLib = await getTranslations("Library");
  const catalog = await fetchStories();
  const listeningKids = catalog.filter((s) => s.audience === "kids");
  const listeningAdults = catalog.filter((s) => s.audience === "adults");
  const cefrStories = catalog.filter((s) => !s.audience);

  return (
    <PlatformShell title={t("title")} intro={tLib("hubIntro")} gate="auth">
      <LibraryShelf />

      <section className="mt-12 border-t border-black/10 pt-8">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-black/45">
          {tLib("listeningShelf")}
        </p>
        <h2 className="mt-1 text-lg font-bold text-[#0b0b1a]">{tLib("listeningTitle")}</h2>
        <p className="mt-1 text-sm text-black/60">{tLib("listeningIntro")}</p>

        <div className="mt-4 grid gap-6 sm:grid-cols-2">
          <div>
            <p className="mb-2 text-xs font-semibold text-[#c45c00]">{t("kidsShelf")}</p>
            <ul className="space-y-2">
              {listeningKids.map((story) => (
                <li key={story.id}>
                  <Link
                    href={`/stories/${story.id}`}
                    className="block rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-medium hover:border-[#c45c00]/40"
                  >
                    {story.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold text-[#0016BD]">{t("adultsShelf")}</p>
            <ul className="space-y-2">
              {listeningAdults.map((story) => (
                <li key={story.id}>
                  <Link
                    href={`/stories/${story.id}`}
                    className="block rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-medium hover:border-[#0016BD]/40"
                  >
                    {story.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="mt-12 border-t border-black/10 pt-8">
        <ul className="space-y-2">
          {cefrStories.map((story) => (
            <li key={story.id}>
              <Link
                href={`/stories/${story.id}`}
                className="block rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-medium hover:border-[#0016BD]/40"
              >
                <span className="text-black/45">{story.level} · </span>
                {story.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <p className="mt-8">
        <Link href="/dashboard" className="text-sm font-semibold text-[#0016BD] underline">
          {t("backDashboard")}
        </Link>
      </p>
    </PlatformShell>
  );
}
