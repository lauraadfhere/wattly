import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import KidsPdfReader from "@/components/library/KidsPdfReader";
import KindleEpubReader from "@/components/library/KindleEpubReader";
import PlatformShell from "@/components/platform/PlatformShell";
import { getLibraryBook, libraryBooks } from "@/lib/library";
import { kidsContextHtml } from "@/lib/library/kids-context";

const KNOWN_IDS = [
  "kids-hello-sunny",
  "kids-alphabet-adventure",
  "kids-lost-dragon",
  "kids-day-zoo",
  "kids-colourful-world",
  "kids-magic-school-bag",
  "kids-friends-forest",
  "kids-little-chef",
  "kids-where-teddy",
  "kids-big-blue-sea",
  "adults-babbylon",
  "adults-do-not-click",
  "adults-sports-injuries",
  "adults-kingdom-rainbow",
  "adults-kingdom-clock",
];

export function generateStaticParams() {
  const ids = new Set([...KNOWN_IDS, ...libraryBooks.map((b) => b.id)]);
  return Array.from(ids).map((id) => ({ id }));
}

type Props = {
  params: Promise<{ id: string }>;
};

export default async function LibraryBookReadPage({ params }: Props) {
  const { id } = await params;
  const book = getLibraryBook(id);
  if (!book) notFound();

  const t = await getTranslations("Library");

  return (
    <PlatformShell
      title={book.format === "pdf" ? t("pdfReaderTitle") : t("kindleReaderTitle")}
      intro={t("readerIntro")}
      gate="auth"
    >
      {book.format === "pdf" ? (
        <KidsPdfReader book={book} contextHtml={kidsContextHtml(book.id)} />
      ) : (
        <KindleEpubReader book={book} />
      )}
    </PlatformShell>
  );
}
