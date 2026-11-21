"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import LanguageGlobe from "@/components/LanguageGlobe";

/** Clean login chrome — dashboard header colors, logo + search + language only. */
export default function AuthHeader() {
  const tMenu = useTranslations("Menu");
  const router = useRouter();
  const [query, setQuery] = useState("");

  function onSearch(event: FormEvent) {
    event.preventDefault();
    const q = query.trim();
    router.push(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
  }

  return (
    <header className="border-b-2 border-black bg-black/70 text-white backdrop-blur-md">
      <div className="mx-auto flex min-h-[4.5rem] w-full max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:min-h-[5.5rem] sm:px-10 sm:py-5">
        <Link href="/" className="inline-flex items-center gap-1">
          <Image
            src="/brand/wattly-logo-white.png"
            alt="Wattly"
            width={1000}
            height={280}
            className="h-8 w-auto sm:h-9"
            priority
          />
          <span className="text-[0.6rem] text-white/55" aria-hidden="true">
            ™
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <form onSubmit={onSearch} className="relative">
            <label className="sr-only" htmlFor="auth-search">
              {tMenu("search")}
            </label>
            <input
              id="auth-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={tMenu("searchPlaceholder")}
              className="w-36 rounded-full bg-[#2b2b2b] py-2 pe-10 ps-4 text-sm text-white placeholder:text-white/45 sm:w-44 lg:w-56"
            />
            <button
              type="submit"
              className="absolute end-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center text-white"
              aria-label={tMenu("search")}
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
              </svg>
            </button>
          </form>

          <LanguageGlobe tone="dark" />
        </div>
      </div>
    </header>
  );
}
