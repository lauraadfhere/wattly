import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { audiobooksFor, type AudiobookAudience } from "@/lib/audiobooks";

type AudiobookLibraryProps = {
  audience: AudiobookAudience;
};

export default async function AudiobookLibrary({ audience }: AudiobookLibraryProps) {
  const t = await getTranslations("Audiobooks");
  const books = audiobooksFor(audience);

  return (
    <div>
      <ul className="grid gap-3 sm:grid-cols-2">
        {books.map((book) => (
          <li key={book.id}>
            <article
              className="flex h-full flex-col border-2 bg-white p-5"
              style={{ borderColor: book.accent }}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-black/45">
                    {book.level} · {book.minutes} min
                  </p>
                  <h2 className="mt-1 text-lg font-bold text-black">{book.title}</h2>
                  <p className="mt-1 text-xs text-black/55">{book.author}</p>
                </div>
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-black"
                  style={{ backgroundColor: book.accent }}
                  aria-hidden="true"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                    <path d="M8 5v14l11-7L8 5z" />
                  </svg>
                </span>
              </div>
              <p className="mt-3 flex-1 text-sm leading-6 text-black/70">{book.summary}</p>
              <button
                type="button"
                className="mt-4 border-2 border-black bg-[#ffc933] px-4 py-2 text-sm font-semibold text-black"
              >
                {t("listen")}
              </button>
            </article>
          </li>
        ))}
      </ul>

      <p className="mt-8 flex flex-wrap gap-4 text-sm">
        <Link href="/audiobooks" className="font-semibold text-[#0016BD] underline underline-offset-4">
          {t("backHub")}
        </Link>
        <Link href="/dashboard" className="font-semibold text-black/60 underline underline-offset-4">
          {t("backDashboard")}
        </Link>
      </p>
    </div>
  );
}
