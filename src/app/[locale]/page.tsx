import Image from "next/image";
import { getTranslations } from "next-intl/server";
import Footer from "@/components/Footer";
import HeroActions from "@/components/HeroActions";

export default async function HomePage() {
  const t = await getTranslations("HomePage");

  return (
    <div className="flex min-h-dvh flex-1 flex-col">
      <main className="relative flex flex-1 flex-col bg-[#000ea8] text-white">
        <HeroActions />
        <header className="flex flex-1 flex-col justify-start px-6 pb-20 pt-28 sm:px-10 sm:pt-32 lg:px-16">
          <div className="mx-auto w-full max-w-4xl">
            <Image
              src="/brand/wattly-logo-white.png"
              alt="Wattly"
              width={1000}
              height={280}
              priority
              className="hero-rise mb-8 h-auto w-[34vw] min-w-[140px] max-w-[220px] sm:mb-10 sm:w-[10vw] sm:min-w-[72px] sm:max-w-[140px]"
            />
            <h1 className="hero-rise max-w-[14ch] text-[clamp(2.5rem,7vw,4.75rem)] font-extrabold leading-[1.05] tracking-[-0.03em] text-white">
              {t("title")}
            </h1>
            <p className="hero-rise hero-rise-delay mt-6 max-w-[38ch] text-lg leading-8 text-[#c9d4ff] sm:text-xl sm:leading-9">
              {t("description")}
            </p>
          </div>
        </header>
      </main>
      <Footer />
    </div>
  );
}
