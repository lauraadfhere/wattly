import { Query } from "node-appwrite";
import { createAdminClient } from "@/lib/appwrite/server";
import { appwriteConfig } from "@/lib/appwrite/config";
import { stories as staticStories, type Story, type StoryWord } from "@/lib/stories";
import cefrCatalog from "@/lib/stories/stories-content.json";

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

function cefrId(code: string): string {
  return `cefr-${code.toLowerCase().replace(/\./g, "-")}`;
}

function rowToStory(row: StoryRow): Story {
  const passage = row.passage.trim();
  const sentence = passage.split(/(?<=[.!?])\s+/)[0] ?? passage;
  return {
    id: cefrId(row.code),
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

/** Bundled CEFR catalog, used when Appwrite is unavailable. */
const bundledCefrStories: Story[] = cefrCatalog.stories.map((entry) =>
  rowToStory({
    $id: cefrId(entry.code),
    code: entry.code,
    level: entry.level,
    title: entry.title,
    passage: entry.passage,
    questions: JSON.stringify(entry.questions),
  }),
);

const fallbackStories = [...staticStories, ...bundledCefrStories];

/** CEFR stories from Appwrite, with the bundled catalog as the fallback. */
export async function fetchStories(): Promise<Story[]> {
  if (!process.env.APPWRITE_API_KEY) return fallbackStories;

  try {
    const { tablesDB } = createAdminClient();
    const result = await tablesDB.listRows({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.tables.stories,
      queries: [Query.limit(100)],
    });
    const rows = (result.rows ?? []) as unknown as StoryRow[];
    if (!rows.length) return fallbackStories;
    const remote = rows.map(rowToStory);
    const remoteIds = new Set(remote.map((story) => story.id));
    return [...staticStories, ...bundledCefrStories.filter((s) => !remoteIds.has(s.id)), ...remote];
  } catch (error) {
    console.error("fetchStories: Appwrite unavailable, using bundled catalog", error);
    return fallbackStories;
  }
}

export async function fetchStory(id: string): Promise<Story | null> {
  const catalog = await fetchStories();
  return catalog.find((s) => s.id === id) ?? null;
}
