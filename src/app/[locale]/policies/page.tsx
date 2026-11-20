import { getTranslations } from "next-intl/server";
import PlatformShell from "@/components/platform/PlatformShell";

export default async function PoliciesPage() {
  const t = await getTranslations("Policies");

  return (
    <PlatformShell title={t("title")} intro={t("intro")}>
      <div className="space-y-8 text-base leading-7 text-black/75">
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-black">{t("privacyTitle")}</h2>
          <p>{t("privacyBody")}</p>
        </section>
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-black">{t("termsTitle")}</h2>
          <p>{t("termsBody")}</p>
        </section>
      </div>
    </PlatformShell>
  );
}
