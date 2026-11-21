"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  adultsShelf,
  kidsShelf,
  libraryCoverSrc,
  libraryPageCount,
  type LibraryBook,
} from "@/lib/library";

function BookCard({ book }: { book: LibraryBook }) {
  const t = useTranslations("Library");
  const cover = libraryCoverSrc(book, 360);
  const pages = libraryPageCount(book);
  const description = book.description || book.summary;

  return (
    <Link
      href={`/stories/library/${book.id}`}
      className="group flex w-[11.5rem] shrink-0 flex-col sm:w-[13rem]"
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-[#1c1914] shadow-md transition group-hover:shadow-lg">
        {cover ? (
          <Image
            src={cover}
            alt=""
            fill
            className="object-cover transition duration-300 group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 45vw, 208px"
            unoptimized
          />
        ) : (
          <div className="flex h-full items-end p-3 text-white">
            <p className="text-sm font-bold leading-snug">{book.title}</p>
          </div>
        )}
        <span className="absolute start-2 top-2 rounded bg-black/65 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
          {book.format === "pdf" ? t("formatPdf") : t("formatEpub")}
        </span>
        <span className="absolute bottom-2 end-2 rounded bg-[#f7f3e8]/95 px-1.5 py-0.5 text-[10px] font-bold tabular-nums text-[#1c1914]">
          {t("pagesCount", { count: pages })}
        </span>
      </div>
      <p className="mt-2 line-clamp-2 text-sm font-semibold leading-snug text-[#0b0b1a]">
        {book.title}
      </p>
      <p className="mt-0.5 text-[11px] font-medium text-[#c45c00]">{book.level}</p>
      <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-black/55">
        {description}
      </p>
      <span className="mt-2 inline-flex text-xs font-bold text-[#0016BD] underline-offset-2 group-hover:underline">
        {t("viewDetails")}
      </span>
    </Link>
  );
}

export default function LibraryShelf() {
  const t = useTranslations("Library");
  const kids = kidsShelf();
  const adults = adultsShelf();

  return (
    <div className="space-y-10">
      <section>
        <div className="mb-4">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#c45c00]">
            {t("kidsShelf")}
          </p>
          <h2 className="text-xl font-bold text-[#0b0b1a]">{t("kidsTitle")}</h2>
          <p className="mt-1 text-sm text-black/60">{t("kidsIntro")}</p>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {kids.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>

      <section>
        <div className="mb-4">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0016BD]">
            {t("adultsShelf")}
          </p>
          <h2 className="text-xl font-bold text-[#0b0b1a]">{t("adultsTitle")}</h2>
          <p className="mt-1 text-sm text-black/60">{t("adultsIntro")}</p>
        </div>
        {adults.length ? (
          <div className="flex gap-4 overflow-x-auto pb-2">
            {adults.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <p className="rounded-xl border border-dashed border-black/20 px-4 py-6 text-sm text-black/55">
            {t("uploadPending")}
          </p>
        )}
      </section>
    </div>
  );
}
