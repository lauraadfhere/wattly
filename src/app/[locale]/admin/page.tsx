import { getTranslations } from "next-intl/server";
import AdminPanel from "@/components/admin/AdminPanel";
import PlatformShell from "@/components/platform/PlatformShell";

export default async function AdminPage() {
  const t = await getTranslations("Admin");

  return (
    <PlatformShell title={t("title")} intro={t("intro")} gate="admin">
      <AdminPanel />
    </PlatformShell>
  );
}
