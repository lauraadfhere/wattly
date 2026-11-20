import { getTranslations } from "next-intl/server";
import LoginForm from "@/components/auth/LoginForm";
import PlatformShell from "@/components/platform/PlatformShell";

export default async function LoginPage() {
  const t = await getTranslations("Auth");

  return (
    <PlatformShell title={t("loginTitle")}>
      <p className="mb-6 max-w-xl text-base text-[#000A5E]/75">{t("loginIntro")}</p>
      <LoginForm />
    </PlatformShell>
  );
}
