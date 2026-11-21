import { getTranslations } from "next-intl/server";
import AuthShell from "@/components/auth/AuthShell";
import LoginAccessHub from "@/components/auth/LoginAccessHub";
import { Link } from "@/i18n/navigation";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const t = await getTranslations("Auth");
  const tHub = await getTranslations("LoginHub");
  const { next } = await searchParams;
  const nextPath =
    next && next.startsWith("/") && !next.startsWith("//") ? next : null;

  return (
    <AuthShell title={t("loginTitle")} intro={tHub("pageIntro")}>
      <LoginAccessHub nextPath={nextPath} />
      <p className="mt-8 text-center text-sm text-black/70">
        {t("noAccount")}{" "}
        <Link href="/signup" className="font-semibold text-[#0016BD]">
          {t("signupLink")}
        </Link>
      </p>
    </AuthShell>
  );
}
