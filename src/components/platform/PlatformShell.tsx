import { getTranslations } from "next-intl/server";
import Footer from "@/components/Footer";
import PlatformHeader from "@/components/platform/PlatformHeader";

type PlatformShellProps = {
  title: string;
  children: React.ReactNode;
};

export default async function PlatformShell({
  title,
  children,
}: PlatformShellProps) {
  await getTranslations("Platform");

  return (
    <div className="flex min-h-dvh flex-1 flex-col bg-[#f5f7ff] text-[#0b0b1a]">
      <PlatformHeader />
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
