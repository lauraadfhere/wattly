import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { kidsShelf, libraryCoverSrc, libraryPageCount } from "@/lib/library";

/**
 * Marketing strip above the site footer: kids book covers → login.
 */
export default async function KidsBooksShowcase() {
  const t = await getTranslations("Library");
  const books = kidsShelf().slice(0, 10);

  return (
    <section
      aria-labelledby="kids-books-showcase-heading"
      className="border-t border-black/10 bg-[#f7f3e8]"
    >
      <div className="mx-auto w-full max-w-6xl px-6 py-10 sm:px-10 lg:px-16">
        <div className="mb-6 max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#c45c00]">
            {t("showcaseEyebrow")}
          </p>
          <h2
            id="kids-books-showcase-heading"
            className="mt-1 font-serif text-2xl font-bold text-[#1c1914] sm:text-3xl"
          >
            {t("showcaseTitle")}
          </h2>
          <p className="mt-2 text-sm leading-6 text-black/60">{t("showcaseIntro")}</p>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-2">
          {books.map((book) => {
            const cover = libraryCoverSrc(book, 280);
            const pages = libraryPageCount(book);
            return (
              <Link
                key={book.id}
                href={`/login?next=${encodeURIComponent(`/stories/library/${book.id}`)}`}
                className="group w-[7.5rem] shrink-0 sm:w-[8.5rem]"
                aria-label={t("showcaseLoginAria", { title: book.title })}
              >
                <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-[#1c1914] shadow-md ring-1 ring-black/10 transition group-hover:-translate-y-0.5 group-hover:shadow-lg">
                  {cover ? (
                    <Image
                      src={cover}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="140px"
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-full items-end p-2 text-[11px] font-bold text-white">
                      {book.title}
                    </div>
                  )}
                </div>
                <p className="mt-2 line-clamp-2 text-[11px] font-semibold leading-snug text-[#1c1914]">
                  {book.title}
                </p>
                <p className="mt-0.5 text-[10px] text-black/50">
                  {t("pagesCount", { count: pages })}
                </p>
              </Link>
            );
          })}
        </div>

        <p className="mt-5">
          <Link
            href="/login"
            className="inline-flex min-h-10 items-center rounded-full bg-[#1c1914] px-5 text-sm font-bold text-[#f7f3e8]"
          >
            {t("showcaseCta")}
          </Link>
        </p>
      </div>
    </section>
  );
}
