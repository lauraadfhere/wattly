import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import KidsLessonIcon from "@/components/live/KidsLessonIcon";
import PlatformShell from "@/components/platform/PlatformShell";

export default async function PricingPage() {
  const t = await getTranslations("Pricing");

  return (
    <PlatformShell title={t("title")} intro={t("intro")}>
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Kids */}
        <section className="rounded-2xl border-2 border-[#ff9f43] bg-[#fff8ef] p-6">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#ffe0b8] text-[#c45c00]">
              <KidsLessonIcon name="star" className="h-6 w-6" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#c45c00]">
                {t("kidsEyebrow")}
              </p>
              <h2 className="text-xl font-bold text-[#0b0b1a]">{t("kidsTitle")}</h2>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-[#ff9f43]/40 bg-white/80 p-4">
            <p className="text-sm font-medium text-black/60">{t("hourlyLabel")}</p>
            <p className="mt-1 text-3xl font-bold text-[#c45c00]">
              {t("kidsHourly", { rate: 400 })}
            </p>
            <p className="mt-1 text-sm text-black/65">{t("kidsHourlyHint")}</p>
          </div>

          <div className="mt-4 rounded-xl border-2 border-[#ff9f43] bg-white p-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[#ff9f43] px-2.5 py-0.5 text-[11px] font-bold text-white">
                {t("packBadge")}
              </span>
              <span className="text-sm font-semibold text-[#0b0b1a]">
                {t("kidsPackHours", { hours: 15 })}
              </span>
            </div>
            <p className="mt-2 text-3xl font-bold text-[#0b0b1a]">
              {t("kidsPackPrice", { price: 4000 })}
            </p>
            <ul className="mt-4 space-y-2 text-sm text-black/75">
              <li className="flex gap-2">
                <span className="font-bold text-[#ff9f43]" aria-hidden="true">
                  ✓
                </span>
                {t("kidsIncludeHours", { hours: 15 })}
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-[#ff9f43]" aria-hidden="true">
                  ✓
                </span>
                {t("kidsIncludeAssessment")}
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-[#ff9f43]" aria-hidden="true">
                  ✓
                </span>
                {t("kidsIncludeRemote")}
              </li>
            </ul>
            <Link
              href="/assessment"
              className="mt-5 inline-flex rounded-full bg-[#ff9f43] px-5 py-2.5 text-sm font-semibold text-white"
            >
              {t("kidsCta")}
            </Link>
          </div>
        </section>

        {/* Adults */}
        <section className="rounded-2xl border-2 border-[#0016BD]/35 bg-[#eef1ff] p-6">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#d4dcff] text-[#0016BD]">
              <KidsLessonIcon name="globe" className="h-6 w-6" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#0016BD]">
                {t("adultsEyebrow")}
              </p>
              <h2 className="text-xl font-bold text-[#0b0b1a]">{t("adultsTitle")}</h2>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-[#0016BD]/25 bg-white/80 p-4">
            <p className="text-sm font-medium text-black/60">{t("hourlyLabel")}</p>
            <p className="mt-1 text-3xl font-bold text-[#0016BD]">
              {t("adultsHourly", { rate: 500 })}
            </p>
            <p className="mt-1 text-sm text-black/65">{t("adultsHourlyHint")}</p>
          </div>

          <div className="mt-4 rounded-xl border-2 border-[#0016BD] bg-white p-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[#0016BD] px-2.5 py-0.5 text-[11px] font-bold text-white">
                {t("packBadge")}
              </span>
              <span className="text-sm font-semibold text-[#0b0b1a]">
                {t("adultsPackHours", { hours: 15 })}
              </span>
            </div>
            <p className="mt-2 text-3xl font-bold text-[#0b0b1a]">
              {t("adultsPackPrice", { price: 6000 })}
            </p>
            <ul className="mt-4 space-y-2 text-sm text-black/75">
              <li className="flex gap-2">
                <span className="font-bold text-[#0016BD]" aria-hidden="true">
                  ✓
                </span>
                {t("adultsIncludeHours", { hours: 15 })}
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-[#0016BD]" aria-hidden="true">
                  ✓
                </span>
                {t("adultsIncludeCourses", { count: 10 })}
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-[#0016BD]" aria-hidden="true">
                  ✓
                </span>
                {t("adultsIncludeAudiobooks", { count: 4 })}
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-[#0016BD]" aria-hidden="true">
                  ✓
                </span>
                {t("adultsIncludeRemote")}
              </li>
            </ul>
            <Link
              href="/signup"
              className="mt-5 inline-flex rounded-full bg-[#0016BD] px-5 py-2.5 text-sm font-semibold text-white"
            >
              {t("adultsCta")}
            </Link>
          </div>
        </section>
      </div>

      <p className="mt-8 max-w-2xl text-sm leading-6 text-black/65">{t("note")}</p>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/assessment"
          className="inline-flex rounded-full bg-[#ffc933] px-5 py-3 text-sm font-semibold text-[#0b0b1a]"
        >
          {t("bookTest")}
        </Link>
        <Link
          href="/"
          className="inline-flex rounded-full border-2 border-black px-5 py-3 text-sm font-semibold text-black"
        >
          {t("backHome")}
        </Link>
      </div>
    </PlatformShell>
  );
}
