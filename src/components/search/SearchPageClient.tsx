"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Link, useRouter } from "@/i18n/navigation";

type SearchPageClientProps = {
  title: string;
  placeholder: string;
  submit: string;
  hint: string;
  closeLabel: string;
};

export default function SearchPageClient({
  title,
  placeholder,
  submit,
  hint,
  closeLabel,
}: SearchPageClientProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    const q = query.trim();
    router.push(q ? `/teachers?q=${encodeURIComponent(q)}` : "/teachers");
  }

  return (
    <div className="flex min-h-dvh flex-1 flex-col bg-[#0b0b1a] text-white">
      <header className="flex items-center justify-between border-b border-white/10 px-4 py-4 sm:px-8">
        <Link href="/" className="inline-flex items-center">
          <Image
            src="/brand/wattly-logo-white.png"
            alt="Wattly"
            width={1000}
            height={280}
            className="h-7 w-auto"
            priority
          />
        </Link>
        <Link
          href="/"
          className="px-3 py-2 text-sm font-medium text-white/70 hover:text-white"
        >
          {closeLabel}
        </Link>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-4 py-16 sm:px-8">
        <h1 className="text-2xl font-medium tracking-tight sm:text-3xl">{title}</h1>
        <p className="mt-2 text-sm text-white/55">{hint}</p>

        <form onSubmit={onSubmit} className="mt-10">
          <label className="sr-only" htmlFor="full-search">
            {title}
          </label>
          <div className="flex items-stretch border border-white/25 bg-transparent">
            <input
              ref={inputRef}
              id="full-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={placeholder}
              className="min-w-0 flex-1 bg-transparent px-4 py-4 text-lg text-white outline-none placeholder:text-white/35"
              autoComplete="off"
            />
            <button
              type="submit"
              className="border-s border-white/25 bg-white px-5 text-sm font-semibold text-black hover:bg-[#ffc933]"
            >
              {submit}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
