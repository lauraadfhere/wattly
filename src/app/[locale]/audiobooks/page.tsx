import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import PlatformShell from "@/components/platform/PlatformShell";

export default async function AudiobooksHubPage() {
  const t = await getTranslations("Audiobooks");

  return (
    <PlatformShell title={t("title")} intro={t("intro")} gate="auth">
      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/audiobooks/kids"
          className="flex min-h-[200px] flex-col border-2 border-[#22c55e] bg-white p-6 transition hover:-translate-y-0.5"
        >
          <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#15803d]">
            {t("kidsEyebrow")}
          </span>
          <h2 className="mt-3 text-2xl font-bold">{t("kidsTitle")}</h2>
          <p className="mt-2 flex-1 text-sm leading-6 text-black/65">{t("kidsBody")}</p>
          <span className="mt-4 text-sm font-semibold text-[#15803d] underline underline-offset-4">
            {t("kidsCta")}
          </span>
        </Link>

        <Link
          href="/audiobooks/adults"
          className="flex min-h-[200px] flex-col border-2 border-[#0016BD] bg-white p-6 transition hover:-translate-y-0.5"
        >
          <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#0016BD]">
            {t("adultsEyebrow")}
          </span>
          <h2 className="mt-3 text-2xl font-bold">{t("adultsTitle")}</h2>
          <p className="mt-2 flex-1 text-sm leading-6 text-black/65">{t("adultsBody")}</p>
          <span className="mt-4 text-sm font-semibold text-[#0016BD] underline underline-offset-4">
            {t("adultsCta")}
          </span>
        </Link>
      </div>
    </PlatformShell>
  );
}
