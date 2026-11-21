"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const SLIDES = [
  {
    key: "courses" as const,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqaPKEbIb7jaf2FmOfUZTFgzG92rOzU3QFooFcdR-VI4_KgrOB0CO8r5w&s=10",
  },
  {
    key: "practice" as const,
    image:
      "https://static01.nyt.com/images/2019/06/06/opinion/06brooksSub/d385d7e06de14d83945f4ad2c5232196-articleLarge.jpg?quality=75&auto=webp&disable=upscale",
  },
] as const;

export default function ProductsStories() {
  const t = useTranslations("ProductsStories");
  const [active, setActive] = useState(0);
  const slide = SLIDES[active];

  return (
    <section className="relative overflow-hidden bg-[#ebe4d8] py-14 text-[#0b0b1a] sm:py-20">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-10 lg:px-16">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#000ea8]">
          {t("eyebrow")}
        </p>
        <h2 className="mt-3 max-w-[22ch] text-[clamp(1.6rem,3.5vw,2.4rem)] font-semibold tracking-tight">
          {t("title")}
        </h2>

        <div className="relative mt-10">
          <div className="relative overflow-hidden bg-[#ddd4c6] p-3 sm:p-5">
            <div className="relative aspect-[16/10] w-full overflow-hidden sm:aspect-[16/9]">
              <Image
                key={slide.image}
                src={slide.image}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 1100px"
                unoptimized
                priority={active === 0}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-transparent" />
              <blockquote className="absolute inset-y-0 start-0 flex max-w-[18ch] items-center px-5 sm:max-w-[22ch] sm:px-10">
                <p className="text-[clamp(1.35rem,3.2vw,2.35rem)] font-medium leading-[1.15] tracking-[-0.02em] text-white">
                  “{t(`slides.${slide.key}.quote`)}”
                </p>
              </blockquote>
            </div>
          </div>

          <ul className="mt-8 flex flex-wrap items-end gap-6 sm:gap-10">
            {SLIDES.map((item, index) => {
              const selected = index === active;
              return (
                <li key={item.key}>
                  <button
                    type="button"
                    onClick={() => setActive(index)}
                    className="group flex items-center gap-3 text-start"
                    aria-pressed={selected}
                  >
                    <span
                      className={`relative h-12 w-12 overflow-hidden rounded-full border-2 ${
                        selected ? "border-[#ffc933]" : "border-transparent opacity-80"
                      }`}
                    >
                      <Image
                        src={item.image}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="48px"
                        unoptimized
                      />
                    </span>
                    <span>
                      <span className="block text-sm font-semibold text-[#0b0b1a]">
                        {t(`slides.${item.key}.name`)}
                      </span>
                      <span className="block text-xs text-black/60">
                        {t(`slides.${item.key}.detail`)}
                      </span>
                      <span className="mt-0.5 block text-[11px] font-semibold uppercase tracking-wide text-[#000ea8]">
                        {t(`slides.${item.key}.product`)}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="mt-8">
            <Link
              href="/courses"
              className="inline-flex bg-[#000ea8] px-5 py-3 text-sm font-semibold text-white hover:bg-[#0016BD]"
            >
              {t("cta")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
