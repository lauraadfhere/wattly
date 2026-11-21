import { getTranslations } from "next-intl/server";
import AudiobookLibrary from "@/components/audiobooks/AudiobookLibrary";
import PlatformShell from "@/components/platform/PlatformShell";

export default async function KidsAudiobooksPage() {
  const t = await getTranslations("Audiobooks");

  return (
    <PlatformShell title={t("kidsPageTitle")} intro={t("kidsPageIntro")} gate="auth">
      <AudiobookLibrary audience="kids" />
    </PlatformShell>
  );
}
