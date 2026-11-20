import { getTranslations } from "next-intl/server";
import SignupForm from "@/components/auth/SignupForm";
import PlatformShell from "@/components/platform/PlatformShell";

export default async function SignupPage() {
  const t = await getTranslations("Auth");

  return (
    <PlatformShell title={t("signupTitle")}>
      <p className="mb-6 max-w-xl text-base text-[#000A5E]/75">{t("signupIntro")}</p>
      <SignupForm />
    </PlatformShell>
  );
}
