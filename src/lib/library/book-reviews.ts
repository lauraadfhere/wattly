export type BookReview = {
  id: string;
  bookId: string;
  userId: string;
  authorName: string;
  rating: 1 | 2 | 3 | 4 | 5;
  body: string;
  createdAt: string;
};

const STORAGE_KEY = "wattly-book-reviews";

function readAll(): BookReview[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY)?.trim();
    if (!raw) return [];
    const parsed = JSON.parse(raw) as BookReview[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(items: BookReview[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, 400)));
}

export function reviewsForBook(bookId: string): BookReview[] {
  return readAll()
    .filter((r) => r.bookId === bookId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function averageRating(bookId: string): { avg: number; count: number } {
  const list = reviewsForBook(bookId);
  if (!list.length) return { avg: 0, count: 0 };
  const sum = list.reduce((acc, r) => acc + r.rating, 0);
  return { avg: Math.round((sum / list.length) * 10) / 10, count: list.length };
}

export function reviewByUser(bookId: string, userId: string) {
  return reviewsForBook(bookId).find((r) => r.userId === userId) || null;
}

export function upsertBookReview(input: {
  bookId: string;
  userId: string;
  authorName: string;
  rating: 1 | 2 | 3 | 4 | 5;
  body: string;
}): BookReview {
  const all = readAll();
  const existing = all.find(
    (r) => r.bookId === input.bookId && r.userId === input.userId,
  );
  const item: BookReview = {
    id: existing?.id || `rev-${Date.now()}`,
    bookId: input.bookId,
    userId: input.userId,
    authorName: input.authorName.trim() || "Student",
    rating: input.rating,
    body: input.body.trim(),
    createdAt: existing?.createdAt || new Date().toISOString(),
  };

  const next = existing
    ? all.map((r) => (r.id === existing.id ? item : r))
    : [item, ...all];
  writeAll(next);
  return item;
}

export function removeBookReview(id: string, userId: string) {
  writeAll(readAll().filter((r) => !(r.id === id && r.userId === userId)));
}
