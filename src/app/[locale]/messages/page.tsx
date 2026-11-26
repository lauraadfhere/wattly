import { getTranslations } from "next-intl/server";
import DashboardShell from "@/components/platform/DashboardShell";
import MessagesCenter from "@/components/messages/MessagesCenter";

export default async function MessagesPage() {
  const t = await getTranslations("MessagesCenter");

  return (
    <DashboardShell title={t("pageTitle")} intro={t("pageIntro")}>
      <MessagesCenter />
    </DashboardShell>
  );
}
