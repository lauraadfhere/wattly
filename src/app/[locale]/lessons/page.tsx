import { getTranslations } from "next-intl/server";
import LessonsStudio from "@/components/lessons/LessonsStudio";
import PlatformShell from "@/components/platform/PlatformShell";

export default async function LessonsPage() {
  const t = await getTranslations("Lessons");

  return (
    <PlatformShell title={t("title")} intro={t("intro")} gate="auth">
      <LessonsStudio />
    </PlatformShell>
  );
}
