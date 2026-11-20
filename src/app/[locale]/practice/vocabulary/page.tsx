import { getTranslations } from "next-intl/server";
import PlatformShell from "@/components/platform/PlatformShell";

export default async function VocabularyPracticePage() {
  const t = await getTranslations("Practice");

  return (
    <PlatformShell title={t("vocabulary")}>
      <p className="max-w-2xl text-base leading-7 text-[#000A5E]/75">
        {t("vocabularyDetail")}
      </p>
    </PlatformShell>
  );
}
