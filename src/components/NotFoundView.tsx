import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Footer from "@/components/Footer";

export default async function NotFoundView() {
  const t = await getTranslations("NotFound");

  return (
    <div className="flex min-h-dvh flex-1 flex-col">
      <main className="relative flex flex-1 flex-col bg-[#000ea8] text-white">
        <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col justify-center px-6 py-20 sm:px-10 lg:px-16">
          <Image
            src="/brand/wattly-logo-white.png"
            alt="Wattly"
            width={1000}
            height={280}
            className="mb-10 h-auto w-[34vw] min-w-[120px] max-w-[180px] sm:w-[10vw] sm:min-w-[72px] sm:max-w-[120px]"
            priority
          />
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#ffc933]">
            {t("code")}
          </p>
          <h1 className="mt-4 max-w-[16ch] text-[clamp(2.25rem,6vw,4rem)] font-medium leading-[1.05] tracking-[-0.03em]">
            {t("title")}
          </h1>
          <p className="mt-5 max-w-[40ch] text-lg leading-8 text-[#c9d4ff]">
            {t("body")}
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/"
              className="inline-flex bg-[#ffc933] px-6 py-3.5 text-sm font-semibold text-[#0b0b1a]"
            >
              {t("home")}
            </Link>
            <Link
              href="/search"
              className="inline-flex border-2 border-white/40 px-6 py-3.5 text-sm font-semibold text-white hover:border-white"
            >
              {t("search")}
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
