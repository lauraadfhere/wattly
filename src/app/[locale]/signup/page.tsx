import { getTranslations } from "next-intl/server";
import AuthShell from "@/components/auth/AuthShell";
import SignupForm from "@/components/auth/SignupForm";

export default async function SignupPage() {
  const t = await getTranslations("Auth");

  return (
    <AuthShell title={t("signupTitle")}>
      <p className="mb-6 max-w-xl text-base text-[#000A5E]/75">{t("signupIntro")}</p>
      <SignupForm />
    </AuthShell>
  );
}
