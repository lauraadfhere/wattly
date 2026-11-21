export type AudiobookAudience = "kids" | "adults";

export type Audiobook = {
  id: string;
  audience: AudiobookAudience;
  title: string;
  author: string;
  minutes: number;
  level: string;
  summary: string;
  accent: string;
};

export const audiobooks: Audiobook[] = [
  {
    id: "kids-mimi",
    audience: "kids",
    title: "Mimi the Little Cat",
    author: "Wattly Stories",
    minutes: 6,
    level: "Ages 5–7",
    summary: "A gentle farmyard morning with Mimi, a duck, a dog, and a bowl of milk.",
    accent: "#22c55e",
  },
  {
    id: "kids-balloon",
    audience: "kids",
    title: "The Lost Balloon",
    author: "Wattly Stories",
    minutes: 10,
    level: "Ages 7–9",
    summary: "Adam’s birthday balloon flies away — Nora helps him be brave.",
    accent: "#ef4444",
  },
  {
    id: "kids-garden",
    audience: "kids",
    title: "The Magic Garden",
    author: "Wattly Stories",
    minutes: 12,
    level: "Ages 8–9",
    summary: "Yara finds a golden key and saves a talking garden with fresh water.",
    accent: "#10b981",
  },
  {
    id: "adults-bridge",
    audience: "adults",
    title: "Crossing the Bridge",
    author: "Wattly Voices",
    minutes: 18,
    level: "B1–B2",
    summary: "A short narrative about change, work, and finding the right words.",
    accent: "#0016BD",
  },
  {
    id: "adults-market",
    audience: "adults",
    title: "Morning at the Market",
    author: "Wattly Voices",
    minutes: 14,
    level: "B1",
    summary: "Everyday listening: greetings, prices, and polite requests.",
    accent: "#0ea5e9",
  },
  {
    id: "adults-debate",
    audience: "adults",
    title: "Why Cities Need Quiet Hours",
    author: "Wattly Voices",
    minutes: 16,
    level: "B2–C1",
    summary: "A calm opinion piece for note-taking and paraphrase practice.",
    accent: "#6366f1",
  },
];

export function audiobooksFor(audience: AudiobookAudience) {
  return audiobooks.filter((book) => book.audience === audience);
}
