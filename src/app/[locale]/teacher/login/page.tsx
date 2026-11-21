import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import AuthShell from "@/components/auth/AuthShell";
import RoleLoginPanel from "@/components/auth/RoleLoginPanel";

export default async function TeacherLoginPage() {
  const t = await getTranslations("LoginHub");

  return (
    <AuthShell title={t("teacherTitle")} intro={t("teacherBody")}>
      <Suspense fallback={<p className="text-sm text-black/60">…</p>}>
        <RoleLoginPanel role="teacher" />
      </Suspense>
    </AuthShell>
  );
}
