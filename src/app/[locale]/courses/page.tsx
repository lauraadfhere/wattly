import { getTranslations } from "next-intl/server";
import CoursesDemo from "@/components/courses/CoursesDemo";
import PlatformShell from "@/components/platform/PlatformShell";

export default async function CoursesPage() {
  const t = await getTranslations("Courses");

  return (
    <PlatformShell title={t("title")} intro={t("subtitle")}>
      <CoursesDemo />
    </PlatformShell>
  );
}
