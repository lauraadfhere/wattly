"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  libraryCoverSrc,
  libraryPageCount,
  type LibraryBook,
} from "@/lib/library";
import BookReviews from "@/components/library/BookReviews";
import { loadReadingProgress } from "@/lib/library/reading-progress";
import { useEffect, useState } from "react";

type Props = {
  book: LibraryBook;
};

/** Amazon-style ebook details: cover, title, description, pages, Read CTA. */
export default function EbookDetails({ book }: Props) {
  const t = useTranslations("Library");
  const cover = libraryCoverSrc(book, 640);
  const pages = libraryPageCount(book);
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    setPercent(loadReadingProgress(book.id).percent);
  }, [book.id]);

  const description = book.description || book.summary;
  const readHref = `/stories/library/${book.id}/read`;

  return (
    <div className="mx-auto max-w-5xl">
      <article className="grid gap-8 md:grid-cols-[minmax(0,16rem)_1fr] md:gap-10">
        <div className="mx-auto w-full max-w-[16rem]">
          <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-[#1c1914] shadow-[0_18px_40px_rgba(0,0,0,0.28)]">
            {cover ? (
              <Image
                src={cover}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 768px) 70vw, 256px"
                priority
                unoptimized
              />
            ) : (
              <div className="flex h-full items-end p-4 text-[#f7f3e8]">
                <p className="font-serif text-xl font-bold leading-snug">{book.title}</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[#1c1914] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#f7f3e8]">
              {book.format === "pdf" ? t("formatPdf") : t("formatEpub")}
            </span>
            <span className="rounded-full border border-[#1c1914]/15 bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#1c1914]/70">
              {book.audience === "kids" ? t("kidsBadge") : t("kindleBadge")}
            </span>
            <span className="text-xs font-semibold text-[#c45c00]">{book.level}</span>
          </div>

          <h1 className="mt-3 font-serif text-3xl font-bold leading-tight text-[#1c1914] sm:text-4xl">
            {book.title}
          </h1>
          <p className="mt-1.5 text-sm text-black/55">
            {t("byAuthor", { author: book.author })}
          </p>

          <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-[#1c1914]/10 bg-[#f7f3e8] px-3 py-2.5">
              <dt className="text-[10px] font-bold uppercase tracking-wide text-black/45">
                {t("pagesLabel")}
              </dt>
              <dd className="mt-0.5 text-lg font-bold tabular-nums text-[#1c1914]">
                {t("pagesCount", { count: pages })}
              </dd>
            </div>
            <div className="rounded-xl border border-[#1c1914]/10 bg-[#f7f3e8] px-3 py-2.5">
              <dt className="text-[10px] font-bold uppercase tracking-wide text-black/45">
                {t("minutesLabel")}
              </dt>
              <dd className="mt-0.5 text-lg font-bold tabular-nums text-[#1c1914]">
                {t("minutesCount", { count: book.minutes })}
              </dd>
            </div>
            {book.ages ? (
              <div className="rounded-xl border border-[#1c1914]/10 bg-[#f7f3e8] px-3 py-2.5">
                <dt className="text-[10px] font-bold uppercase tracking-wide text-black/45">
                  {t("agesLabel")}
                </dt>
                <dd className="mt-0.5 text-lg font-bold text-[#1c1914]">{book.ages}</dd>
              </div>
            ) : null}
          </dl>

          <div className="mt-6">
            <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-black/45">
              {t("descriptionLabel")}
            </h2>
            <p className="mt-2 max-w-prose text-sm leading-7 text-[#1c1914]/85">
              {description}
            </p>
          </div>

          {percent > 0 ? (
            <p className="mt-4 text-sm font-semibold text-[#c45c00]">
              {t("continueProgress", { percent })}
            </p>
          ) : null}

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={readHref}
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#1c1914] px-6 text-sm font-bold text-[#f7f3e8] shadow-md transition hover:bg-black"
            >
              {percent > 0 ? t("continueReading") : t("readNow")}
            </Link>
            <Link
              href="/stories"
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#1c1914]/20 bg-white px-5 text-sm font-semibold text-[#1c1914]"
            >
              {t("backStories")}
            </Link>
          </div>
        </div>
      </article>

      <BookReviews bookId={book.id} bookTitle={book.title} />
    </div>
  );
}
