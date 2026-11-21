import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import AuthShell from "@/components/auth/AuthShell";
import RoleLoginPanel from "@/components/auth/RoleLoginPanel";

export default async function ParentLoginPage() {
  const t = await getTranslations("LoginHub");

  return (
    <AuthShell title={t("parentAccess")} intro={t("parentBody")}>
      <Suspense fallback={<p className="text-sm text-black/60">…</p>}>
        <RoleLoginPanel role="parent" />
      </Suspense>
    </AuthShell>
  );
}
