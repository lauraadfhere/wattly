import { getTranslations } from "next-intl/server";
import DashboardShell from "@/components/platform/DashboardShell";
import TeacherHome from "@/components/teachers/TeacherHome";

export default async function TeacherDashboardPage() {
  const t = await getTranslations("TeacherDashboard");

  return (
    <DashboardShell title={t("title")} intro={t("intro")}>
      <TeacherHome />
    </DashboardShell>
  );
}
