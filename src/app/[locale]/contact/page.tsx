import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import PlatformShell from "@/components/platform/PlatformShell";

export default async function ContactPage() {
  const t = await getTranslations("Contact");

  return (
    <PlatformShell title={t("title")} intro={t("intro")}>
      <div className="max-w-xl space-y-6">
        <div className="rounded-2xl border-2 border-black bg-white p-5">
          <p className="text-sm font-semibold text-black">{t("emailLabel")}</p>
          <a
            href="mailto:hello@wattly.app"
            className="mt-1 inline-block text-base text-[#0016BD] underline"
          >
            hello@wattly.app
          </a>
        </div>
        <p className="text-sm leading-6 text-black/65">{t("hours")}</p>
        <Link
          href="/courses"
          className="inline-flex rounded-full bg-[#ffc933] px-5 py-3 text-sm font-semibold text-[#0b0b1a]"
        >
          {t("seeCourses")}
        </Link>
      </div>
    </PlatformShell>
  );
}
