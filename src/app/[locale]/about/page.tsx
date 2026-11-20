import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import PlatformShell from "@/components/platform/PlatformShell";

export default async function AboutPage() {
  const t = await getTranslations("About");

  return (
    <PlatformShell title={t("title")} intro={t("intro")}>
      <div className="max-w-2xl space-y-6 text-base leading-7 text-black/75">
        <p>{t("body")}</p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/courses"
            className="inline-flex rounded-full bg-[#ffc933] px-5 py-3 text-sm font-semibold text-[#0b0b1a]"
          >
            {t("seeCourses")}
          </Link>
          <Link
            href="/"
            className="inline-flex rounded-full border-2 border-black px-5 py-3 text-sm font-semibold text-black"
          >
            {t("backHome")}
          </Link>
        </div>
      </div>
    </PlatformShell>
  );
}
