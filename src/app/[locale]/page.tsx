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

  const points = [t("point1"), t("point2"), t("point3")] as const;

  return (
    <div className="flex min-h-dvh flex-1 flex-col">
      <main className="relative flex min-h-[70dvh] flex-col overflow-hidden bg-[#000ea8] text-white sm:min-h-[72dvh]">
        <HeroWaveLetters />
        <HeroActions />
        <header className="relative z-[2] flex flex-1 flex-col justify-start px-5 pb-12 pt-6 sm:px-8 sm:pb-14 sm:pt-9 lg:px-12">
          <div className="w-full max-w-xl ps-4 sm:max-w-lg sm:ps-12 lg:max-w-xl lg:ps-20 xl:ps-28">
            <div className="hero-rise mb-4 flex items-start gap-1 sm:mb-5">
              <Image
                src="/brand/wattly-logo-white.png"
                alt="Wattly"
                width={1000}
                height={280}
                priority
                className="h-auto w-[34vw] min-w-[140px] max-w-[200px] sm:w-[10vw] sm:min-w-[72px] sm:max-w-[120px]"
              />
              <span
                className="mt-0.5 text-[0.65rem] font-medium leading-none text-white/70 sm:text-[0.7rem]"
                aria-hidden="true"
              >
                ™
              </span>
              <span className="sr-only">Trademark</span>
            </div>

            {/* Speech bubble — triangle tail */}
            <div className="hero-rise relative mb-4 inline-block max-w-[20rem]">
              <div className="rounded-2xl bg-white px-4 py-2.5 text-[0.95rem] font-semibold leading-snug text-[#0b0b1a] sm:text-base">
                {t("bubble")}
              </div>
              <span
                className="absolute -bottom-2 start-8 h-0 w-0 border-x-[8px] border-t-[10px] border-x-transparent border-t-white"
                aria-hidden="true"
              />
            </div>

            <h1 className="hero-rise max-w-[16ch] text-[clamp(1.85rem,4.8vw,3.25rem)] font-bold leading-[1.12] tracking-[-0.02em] text-white">
              {t("title")}
            </h1>

            {/* Check list under heading */}
            <ul className="hero-rise hero-rise-delay mt-5 max-w-[40ch] space-y-3">
              {points.map((point) => (
                <li key={point} className="flex items-start gap-3 text-[0.95rem] leading-6 text-white/85 sm:text-base sm:leading-7">
                  <span
                    className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/90 text-[#000ea8]"
                    aria-hidden="true"
                  >
                    <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.4">
                      <path d="M3.5 8.2l3 3 6-6.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>

            <p className="hero-rise hero-rise-delay mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-medium text-white/90">
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
