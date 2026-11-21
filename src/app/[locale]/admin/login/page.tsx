import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import AuthShell from "@/components/auth/AuthShell";
import RoleLoginPanel from "@/components/auth/RoleLoginPanel";

export default async function AdminLoginPage() {
  const t = await getTranslations("LoginHub");

  return (
    <AuthShell title={t("adminAccess")} intro={t("adminBody")}>
      <Suspense fallback={<p className="text-sm text-black/60">…</p>}>
        <RoleLoginPanel role="admin" />
      </Suspense>
    </AuthShell>
  );
}
