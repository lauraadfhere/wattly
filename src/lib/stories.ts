export type StoryAudience = "kids" | "adults";

export type StoryWord = {
  text: string;
  important?: boolean;
};

export type Story = {
  id: string;
  audience: StoryAudience;
  title: string;
  author: string;
  level: string;
  ages?: string;
  minutes: number;
  cover: string;
  summary: string;
  /** Spoken script broken into words for smart tracking */
  words: StoryWord[];
};

export const stories: Story[] = [
  {
    id: "kids-mimi-morning",
    audience: "kids",
    title: "Mimi’s Sunny Morning",
    author: "Wattly Stories",
    level: "Pre-A1",
    ages: "5–7",
    minutes: 4,
    cover: "#22c55e",
    summary: "A little cat wakes up, greets friends, and drinks warm milk.",
    words: [
      { text: "Mimi", important: true },
      { text: "the" },
      { text: "little" },
      { text: "cat", important: true },
      { text: "opens" },
      { text: "her" },
      { text: "eyes." },
      { text: "Good" },
      { text: "morning,", important: true },
      { text: "sun!" },
      { text: "She" },
      { text: "sees" },
      { text: "a" },
      { text: "duck", important: true },
      { text: "and" },
      { text: "a" },
      { text: "dog." },
      { text: "Mimi" },
      { text: "drinks" },
      { text: "warm" },
      { text: "milk.", important: true },
      { text: "She" },
      { text: "is" },
      { text: "happy." },
    ],
  },
  {
    id: "kids-lost-balloon",
    audience: "kids",
    title: "The Lost Balloon",
    author: "Wattly Stories",
    level: "A1",
    ages: "7–9",
    minutes: 6,
    cover: "#ef4444",
    summary: "Adam’s balloon flies away. Nora helps him stay brave.",
    words: [
      { text: "Adam", important: true },
      { text: "has" },
      { text: "a" },
      { text: "red" },
      { text: "balloon.", important: true },
      { text: "Oh" },
      { text: "no!" },
      { text: "It" },
      { text: "flies" },
      { text: "away." },
      { text: "Nora", important: true },
      { text: "says," },
      { text: "Be" },
      { text: "brave.", important: true },
      { text: "They" },
      { text: "look" },
      { text: "in" },
      { text: "the" },
      { text: "park." },
      { text: "They" },
      { text: "find" },
      { text: "it" },
      { text: "in" },
      { text: "a" },
      { text: "tree." },
    ],
  },
  {
    id: "kids-magic-garden",
    audience: "kids",
    title: "The Magic Garden",
    author: "Wattly Stories",
    level: "A1–A2",
    ages: "8–10",
    minutes: 7,
    cover: "#10b981",
    summary: "Yara finds a key and brings water to a talking garden.",
    words: [
      { text: "Yara", important: true },
      { text: "finds" },
      { text: "a" },
      { text: "golden" },
      { text: "key.", important: true },
      { text: "Behind" },
      { text: "the" },
      { text: "door" },
      { text: "is" },
      { text: "a" },
      { text: "garden." },
      { text: "The" },
      { text: "flowers" },
      { text: "can" },
      { text: "talk!", important: true },
      { text: "Please" },
      { text: "bring" },
      { text: "water.", important: true },
      { text: "Yara" },
      { text: "helps." },
      { text: "The" },
      { text: "garden" },
      { text: "smiles." },
    ],
  },
  {
    id: "adults-market",
    audience: "adults",
    title: "Morning at the Market",
    author: "Wattly Voices",
    level: "A2–B1",
    minutes: 8,
    cover: "#0ea5e9",
    summary: "Everyday listening: greetings, prices, and polite requests.",
    words: [
      { text: "Good" },
      { text: "morning.", important: true },
      { text: "How" },
      { text: "much" },
      { text: "are" },
      { text: "the" },
      { text: "apples?", important: true },
      { text: "Two" },
      { text: "dollars" },
      { text: "a" },
      { text: "kilo." },
      { text: "Could" },
      { text: "I" },
      { text: "have" },
      { text: "one" },
      { text: "kilo,", important: true },
      { text: "please?" },
      { text: "Of" },
      { text: "course." },
      { text: "Here" },
      { text: "is" },
      { text: "your" },
      { text: "change.", important: true },
      { text: "Thank" },
      { text: "you." },
    ],
  },
  {
    id: "adults-bridge",
    audience: "adults",
    title: "Crossing the Bridge",
    author: "Wattly Voices",
    level: "B1–B2",
    minutes: 9,
    cover: "#0016BD",
    summary: "A short narrative about change, work, and finding the right words.",
    words: [
      { text: "Leila", important: true },
      { text: "stood" },
      { text: "on" },
      { text: "the" },
      { text: "bridge." },
      { text: "She" },
      { text: "needed" },
      { text: "new" },
      { text: "words", important: true },
      { text: "for" },
      { text: "a" },
      { text: "new" },
      { text: "job." },
      { text: "Slowly,", important: true },
      { text: "she" },
      { text: "practiced" },
      { text: "each" },
      { text: "sentence." },
      { text: "Confidence", important: true },
      { text: "grew" },
      { text: "with" },
      { text: "every" },
      { text: "step." },
    ],
  },
  {
    id: "adults-quiet-hours",
    audience: "adults",
    title: "Why Cities Need Quiet Hours",
    author: "Wattly Voices",
    level: "B2",
    minutes: 10,
    cover: "#6366f1",
    summary: "A calm opinion piece for note-taking and paraphrase practice.",
    words: [
      { text: "Cities", important: true },
      { text: "are" },
      { text: "busy." },
      { text: "Quiet" },
      { text: "hours", important: true },
      { text: "help" },
      { text: "people" },
      { text: "rest" },
      { text: "and" },
      { text: "focus." },
      { text: "Neighbours" },
      { text: "can" },
      { text: "agree" },
      { text: "on" },
      { text: "simple" },
      { text: "rules.", important: true },
      { text: "Respect", important: true },
      { text: "makes" },
      { text: "shared" },
      { text: "spaces" },
      { text: "calmer" },
      { text: "for" },
      { text: "everyone." },
    ],
  },
];

export function storiesFor(audience: StoryAudience) {
  return stories.filter((s) => s.audience === audience);
}

export function getStoryById(id: string) {
  return stories.find((s) => s.id === id);
}

const SAVED_WORDS_KEY = "wattly-saved-words";

export function loadSavedWords(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(SAVED_WORDS_KEY)?.trim();
    if (!raw) return [];
    const parsed = JSON.parse(raw) as string[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveWord(word: string) {
  const clean = word.replace(/[^\p{L}\p{N}'-]/gu, "").trim();
  if (!clean) return loadSavedWords();
  const next = Array.from(new Set([clean.toLowerCase(), ...loadSavedWords()]));
  localStorage.setItem(SAVED_WORDS_KEY, JSON.stringify(next.slice(0, 200)));
  return next;
}

export function removeSavedWord(word: string) {
  const next = loadSavedWords().filter((w) => w !== word.toLowerCase());
  localStorage.setItem(SAVED_WORDS_KEY, JSON.stringify(next));
  return next;
}
