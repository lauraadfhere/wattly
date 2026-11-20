import { getTranslations } from "next-intl/server";
import PlatformShell from "@/components/platform/PlatformShell";
import ProfilePanel from "@/components/profile/ProfilePanel";

export default async function ProfilePage() {
  const t = await getTranslations("Profile");

  return (
    <PlatformShell title={t("title")} intro={t("intro")}>
      <ProfilePanel />
    </PlatformShell>
  );
}
