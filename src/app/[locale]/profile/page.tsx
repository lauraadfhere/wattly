import { getTranslations } from "next-intl/server";
import PlatformShell from "@/components/platform/PlatformShell";
import ProfilePanel from "@/components/profile/ProfilePanel";

export default async function ProfilePage() {
  const t = await getTranslations("Profile");

  return (
    <PlatformShell title={t("title")}>
      <p className="mb-6 max-w-xl text-base text-[#000A5E]/75">{t("intro")}</p>
      <ProfilePanel />
    </PlatformShell>
  );
}
