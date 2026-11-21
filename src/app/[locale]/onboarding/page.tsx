import { getTranslations } from "next-intl/server";
import OnboardingForm from "@/components/onboarding/OnboardingForm";
import PlatformShell from "@/components/platform/PlatformShell";

export default async function OnboardingPage() {
  const t = await getTranslations("Onboarding");

  return (
    <PlatformShell title={t("title")} gate="auth">
      <OnboardingForm />
    </PlatformShell>
  );
}
