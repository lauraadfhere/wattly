import { getTranslations } from "next-intl/server";
import AudiobookLibrary from "@/components/audiobooks/AudiobookLibrary";
import PlatformShell from "@/components/platform/PlatformShell";

export default async function AdultsAudiobooksPage() {
  const t = await getTranslations("Audiobooks");

  return (
    <PlatformShell title={t("adultsPageTitle")} intro={t("adultsPageIntro")} gate="auth">
      <AudiobookLibrary audience="adults" />
    </PlatformShell>
  );
}
