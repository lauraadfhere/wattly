import { Query } from "node-appwrite";
import { createAdminClient } from "@/lib/appwrite/server";
import { appwriteConfig } from "@/lib/appwrite/config";
import { stories as staticStories, type Story, type StoryWord } from "@/lib/stories";

type StoryRow = {
  $id: string;
  code: string;
  level: string;
  title: string;
  passage: string;
  questions: string;
};

const WORDS_PER_MINUTE = 110;

function toWords(passage: string): StoryWord[] {
  return passage
    .split(/\s+/)
    .filter(Boolean)
    .map((text) => ({ text }));
}

function parseQuestions(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter((q): q is string => typeof q === "string") : [];
  } catch {
    return [];
  }
}

function rowToStory(row: StoryRow): Story {
  const passage = row.passage.trim();
  const sentence = passage.split(/(?<=[.!?])\s+/)[0] ?? passage;
  return {
    id: `cefr-${row.code.toLowerCase().replace(/\./g, "-")}`,
    title: row.title,
    author: "Wattly Stories",
    level: row.level,
    minutes: Math.max(1, Math.round(passage.split(/\s+/).length / WORDS_PER_MINUTE)),
    cover: "#0016BD",
    summary: sentence,
    words: toWords(passage),
    questions: parseQuestions(row.questions),
  };
}

/** CEFR stories from Appwrite, with the static shelves as the fallback. */
export async function fetchStories(): Promise<Story[]> {
  if (!process.env.APPWRITE_API_KEY) return staticStories;

  try {
    const { tablesDB } = createAdminClient();
    const result = await tablesDB.listRows({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.tables.stories,
      queries: [Query.limit(100)],
    });
    const rows = (result.rows ?? []) as unknown as StoryRow[];
    if (!rows.length) return staticStories;
    return [...staticStories, ...rows.map(rowToStory)];
  } catch {
    return staticStories;
  }
}

export async function fetchStory(id: string): Promise<Story | null> {
  const catalog = await fetchStories();
  return catalog.find((s) => s.id === id) ?? null;
}
