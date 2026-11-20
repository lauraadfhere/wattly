import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Footer from "@/components/Footer";

type PlatformShellProps = {
  title: string;
  children: React.ReactNode;
};

export default async function PlatformShell({
  title,
  children,
}: PlatformShellProps) {
  const t = await getTranslations("Platform");

  return (
    <div className="flex min-h-dvh flex-1 flex-col bg-[#f5f7ff] text-[#0b0b1a]">
      <header className="border-b border-[#0016BD]/15 bg-white">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-4 sm:px-10">
          <Link href="/" className="inline-flex items-center gap-3">
            <Image
              src="/brand/wattly-logo-blue.png"
              alt="Wattly"
              width={1000}
              height={280}
              className="h-8 w-auto"
            />
            <span className="sr-only">Wattly</span>
          </Link>
          <nav aria-label={t("navLabel")} className="hidden items-center gap-4 text-sm font-medium text-[#000A5E] md:flex">
            <Link href="/dashboard">{t("dashboard")}</Link>
            <Link href="/teachers">{t("teachers")}</Link>
            <Link href="/practice">{t("practice")}</Link>
            <Link href="/onboarding">{t("onboarding")}</Link>
          </nav>
          <div className="flex items-center gap-3 text-sm font-semibold">
            <Link
              href="/login"
              className="rounded-full px-3 py-2 text-[#0016BD]"
            >
              {t("login")}
            </Link>
            <Link
              href="/signup"
              className="rounded-full bg-[#ffc933] px-4 py-2 text-[#0b0b1a]"
            >
              {t("signup")}
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10 sm:px-10">
        <h1 className="text-3xl font-extrabold tracking-tight text-[#000A5E] sm:text-4xl">
          {title}
        </h1>
        <div className="mt-8">{children}</div>
      </main>

      <Footer />
    </div>
  );
}
