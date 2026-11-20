import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import PlatformShell from "@/components/platform/PlatformShell";

type SimplePageProps = {
  titleKey:
    | "login"
    | "signup"
    | "lessons"
    | "levels"
    | "assessment"
    | "courses";
};

export default async function SimplePage({ titleKey }: SimplePageProps) {
  const t = await getTranslations("Menu");
  const tHome = await getTranslations("HomePage");

  return (
    <PlatformShell title={t(titleKey)}>
      <p className="max-w-2xl text-base leading-7 text-[#000A5E]/75">
        {tHome("comingSoon")}
      </p>
      <Link
        href="/dashboard"
        className="mt-6 inline-flex rounded-full bg-[#ffc933] px-5 py-3 text-sm font-semibold text-[#0b0b1a]"
      >
        {tHome("backHome")}
      </Link>
    </PlatformShell>
  );
}
