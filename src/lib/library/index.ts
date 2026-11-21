import catalog from "@/lib/library/catalog.json";
import { coverImageUrl, pdfUrl } from "@/lib/cloudinary";

export type LibraryAudience = "kids" | "adults";
export type LibraryFormat = "pdf" | "epub";

export type LibraryBook = {
  id: string;
  audience: LibraryAudience;
  format: LibraryFormat;
  title: string;
  author: string;
  level: string;
  ages?: string;
  summary: string;
  /** Longer blurb for the ebook details page. */
  description?: string;
  /** Display page count (PDF pages or estimated Kindle locations). */
  pages?: number;
  coverPublicId: string;
  coverUrl?: string;
  pdfPublicId?: string;
  pdfUrl?: string;
  epubPublicId?: string;
  epubUrl?: string;
  minutes: number;
};

export function libraryPageCount(book: LibraryBook) {
  if (typeof book.pages === "number" && book.pages > 0) return book.pages;
  return book.format === "pdf" ? 10 : 40;
}

export const libraryKids = (catalog.kids || []) as LibraryBook[];
export const libraryAdults = (catalog.adults || []) as LibraryBook[];
export const libraryBooks: LibraryBook[] = [...libraryKids, ...libraryAdults];

export function libraryCoverSrc(book: LibraryBook, width = 400) {
  if (book.coverUrl) return book.coverUrl;
  if (book.coverPublicId) return coverImageUrl(book.coverPublicId, width);
  return "";
}

export function libraryPdfSrc(book: LibraryBook) {
  if (book.pdfUrl) return book.pdfUrl;
  if (book.pdfPublicId) {
    const id = book.pdfPublicId.includes("/")
      ? book.pdfPublicId.split("/").pop()!
      : book.pdfPublicId;
    return pdfUrl(id.replace(/\.pdf$/i, ""));
  }
  return "";
}

export function libraryEpubSrc(book: LibraryBook) {
  return book.epubUrl || "";
}

/** Fallback catalog used before Cloudinary upload finishes. */
export const fallbackLibraryKids: LibraryBook[] = [
  {
    id: "kids-hello-sunny",
    audience: "kids",
    format: "pdf",
    title: "Hello, Sunny!",
    author: "Wattly English",
    level: "Pre-A1",
    ages: "5–7",
    summary: "Greetings and everyday phrases",
    coverPublicId: "kids-hello-sunny",
    minutes: 12,
  },
  {
    id: "kids-alphabet-adventure",
    audience: "kids",
    format: "pdf",
    title: "The Alphabet Adventure",
    author: "Wattly English",
    level: "Pre-A1",
    ages: "5–7",
    summary: "The alphabet A to Z",
    coverPublicId: "kids-alphabet-adventure",
    minutes: 12,
  },
  {
    id: "kids-lost-dragon",
    audience: "kids",
    format: "pdf",
    title: "The Lost Little Dragon",
    author: "Wattly English",
    level: "A1",
    ages: "6–8",
    summary: "Bravery, kindness and friendship",
    coverPublicId: "kids-lost-dragon",
    minutes: 12,
  },
  {
    id: "kids-day-zoo",
    audience: "kids",
    format: "pdf",
    title: "A Day at the Zoo",
    author: "Wattly English",
    level: "A1",
    ages: "6–8",
    summary: "Zoo animals and describing words",
    coverPublicId: "kids-day-zoo",
    minutes: 12,
  },
  {
    id: "kids-colourful-world",
    audience: "kids",
    format: "pdf",
    title: "My Colourful World",
    author: "Wattly English",
    level: "A1",
    ages: "5–8",
    summary: "Colors, objects and descriptions",
    coverPublicId: "kids-colourful-world",
    minutes: 12,
  },
  {
    id: "kids-magic-school-bag",
    audience: "kids",
    format: "pdf",
    title: "The Magic School Bag",
    author: "Wattly English",
    level: "A1",
    ages: "6–9",
    summary: "School life and classroom objects",
    coverPublicId: "kids-magic-school-bag",
    minutes: 12,
  },
  {
    id: "kids-friends-forest",
    audience: "kids",
    format: "pdf",
    title: "Friends in the Forest",
    author: "Wattly English",
    level: "A1",
    ages: "6–9",
    summary: "Friendship, nature and sharing",
    coverPublicId: "kids-friends-forest",
    minutes: 12,
  },
  {
    id: "kids-little-chef",
    audience: "kids",
    format: "pdf",
    title: "The Little Chef",
    author: "Wattly English",
    level: "A1",
    ages: "6–9",
    summary: "Food words, actions and instructions",
    coverPublicId: "kids-little-chef",
    minutes: 12,
  },
  {
    id: "kids-where-teddy",
    audience: "kids",
    format: "pdf",
    title: "Where Is My Teddy?",
    author: "Wattly English",
    level: "A1",
    ages: "5–8",
    summary: "Home, family, places and feelings",
    coverPublicId: "kids-where-teddy",
    minutes: 12,
  },
  {
    id: "kids-big-blue-sea",
    audience: "kids",
    format: "pdf",
    title: "The Big Blue Sea",
    author: "Wattly English",
    level: "A1–A2",
    ages: "6–9",
    summary: "Sea animals, places and action words",
    coverPublicId: "kids-big-blue-sea",
    minutes: 12,
  },
];

export const fallbackLibraryAdults: LibraryBook[] = [
  {
    id: "adults-babbylon",
    audience: "adults",
    format: "epub",
    title: "Babbylon",
    author: "Wattly Voices",
    level: "B1–B2",
    summary: "A narrative ebook for confident intermediate readers.",
    coverPublicId: "adults-babbylon",
    minutes: 25,
  },
  {
    id: "adults-do-not-click",
    audience: "adults",
    format: "epub",
    title: "Do Not Click",
    author: "Wattly Voices",
    level: "B1–B2",
    summary: "Practical online-safety lessons in ebook form.",
    coverPublicId: "adults-do-not-click",
    minutes: 25,
  },
  {
    id: "adults-sports-injuries",
    audience: "adults",
    format: "epub",
    title: "Prevent Sports Injuries",
    author: "Wattly Voices",
    level: "B2",
    summary: "Clear guidance for safer training and recovery.",
    coverPublicId: "adults-sports-injuries",
    minutes: 25,
  },
  {
    id: "adults-kingdom-rainbow",
    audience: "adults",
    format: "epub",
    title: "The Kingdom Behind the Rainbow",
    author: "Wattly Voices",
    level: "B1–B2",
    summary: "A story ebook with calm pacing for older learners.",
    coverPublicId: "adults-kingdom-rainbow",
    minutes: 25,
  },
  {
    id: "adults-kingdom-clock",
    audience: "adults",
    format: "epub",
    title: "The Kingdom Behind the Clock",
    author: "Wattly Voices",
    level: "B2–C1",
    summary: "An advanced narrative for Kindle-style reading practice.",
    coverPublicId: "adults-kingdom-clock",
    minutes: 25,
  },
];

export function kidsShelf() {
  return libraryKids.length ? libraryKids : fallbackLibraryKids;
}

export function adultsShelf() {
  return libraryAdults.length ? libraryAdults : fallbackLibraryAdults;
}

export function getLibraryBook(id: string) {
  return (
    libraryBooks.find((b) => b.id === id) ||
    fallbackLibraryKids.find((b) => b.id === id) ||
    fallbackLibraryAdults.find((b) => b.id === id)
  );
}
