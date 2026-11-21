import Image from "next/image";
import { getTranslations } from "next-intl/server";
import CoursesShowcase from "@/components/CoursesShowcase";
import Footer from "@/components/Footer";
import HeroActions from "@/components/HeroActions";
import HeroWaveLetters from "@/components/HeroWaveLetters";
import ProductsStories from "@/components/ProductsStories";
import { Link } from "@/i18n/navigation";

export default async function HomePage() {
  const t = await getTranslations("HomePage");

  return (
    <div className="flex min-h-dvh flex-1 flex-col">
      <main className="relative flex flex-1 flex-col overflow-hidden bg-[#000ea8] text-white">
        <HeroWaveLetters />
        <HeroActions />
        <header className="relative z-[2] flex flex-1 flex-col justify-start px-5 pb-20 pt-10 sm:px-8 sm:pt-14 lg:px-12">
          <div className="w-full max-w-4xl ps-10 sm:ps-16 lg:ps-28 xl:ps-36">
            <div className="hero-rise mb-8 flex items-start gap-1 sm:mb-10">
              <Image
                src="/brand/wattly-logo-white.png"
                alt="Wattly"
                width={1000}
                height={280}
                priority
                className="h-auto w-[34vw] min-w-[140px] max-w-[220px] sm:w-[10vw] sm:min-w-[72px] sm:max-w-[140px]"
              />
              <span
                className="mt-0.5 text-[0.65rem] font-medium leading-none text-white/80 sm:text-[0.7rem]"
                aria-hidden="true"
              >
                ™
              </span>
              <span className="sr-only">Trademark</span>
            </div>
            <h1 className="hero-rise max-w-[14ch] text-[clamp(2.5rem,7vw,4.75rem)] font-medium leading-[1.05] tracking-[-0.03em] text-white">
              {t("title")}
            </h1>
            <p className="hero-rise hero-rise-delay mt-6 max-w-[38ch] text-lg leading-8 text-[#c9d4ff] sm:text-xl sm:leading-9">
              {t("description")}
            </p>
            <p className="hero-rise hero-rise-delay mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-medium text-white/90">
              <Link
                href="/lessons"
                className="underline underline-offset-4 decoration-white/50 hover:decoration-white"
              >
                {t("startLearning")}
              </Link>
              <Link
                href="/assessment"
                className="underline underline-offset-4 decoration-white/50 hover:decoration-white"
              >
                {t("bookTest")}
              </Link>
            </p>
          </div>
        </header>
      </main>
      <CoursesShowcase />
      <ProductsStories />
      <Footer />
    </div>
  );
}
