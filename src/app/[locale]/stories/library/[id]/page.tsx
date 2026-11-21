import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import EbookDetails from "@/components/library/EbookDetails";
import PlatformShell from "@/components/platform/PlatformShell";
import { getLibraryBook, libraryBooks } from "@/lib/library";

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

export default async function LibraryBookDetailsPage({ params }: Props) {
  const { id } = await params;
  const book = getLibraryBook(id);
  if (!book) notFound();

  const t = await getTranslations("Library");

  return (
    <PlatformShell title={t("detailsTitle")} intro={t("detailsIntro")} gate="auth">
      <EbookDetails book={book} />
    </PlatformShell>
  );
}
