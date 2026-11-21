import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import BookAssessmentForm from "@/components/assessment/BookAssessmentForm";
import PlatformShell from "@/components/platform/PlatformShell";
import {
  ASSESSMENT_DURATION_MIN,
  ASSESSMENT_FEE_DA,
} from "@/lib/assessment-booking";

export default async function AssessmentPage() {
  const t = await getTranslations("Assessment");

  return (
    <PlatformShell title={t("title")} intro={t("intro")}>
      <div className="mb-8 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-[#0016BD]/15 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#0016BD]">
            {t("chipRemote")}
          </p>
          <p className="mt-1 text-sm text-black/70">{t("chipRemoteBody")}</p>
        </div>
        <div className="rounded-2xl border border-[#0016BD]/15 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#0016BD]">
            {t("chipDuration")}
          </p>
          <p className="mt-1 text-sm font-semibold text-[#0b0b1a]">
            {t("durationValue", { minutes: ASSESSMENT_DURATION_MIN })}
          </p>
        </div>
        <div className="rounded-2xl border border-[#0016BD]/15 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#0016BD]">
            {t("chipFee")}
          </p>
          <p className="mt-1 text-sm font-semibold text-[#0b0b1a]">
            {t("feeValue", { fee: ASSESSMENT_FEE_DA })}
          </p>
        </div>
      </div>

      <BookAssessmentForm />

      <p className="mt-8">
        <Link
          href="/dashboard"
          className="text-sm font-semibold text-[#0016BD] underline underline-offset-2"
        >
          {t("backDashboard")}
        </Link>
      </p>
    </PlatformShell>
  );
}
