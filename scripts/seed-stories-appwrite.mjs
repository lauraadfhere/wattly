/**
 * Seed the A1–C2 stories and comprehension questions into Appwrite.
 * Source: src/lib/stories/stories-content.json (run parse-stories-markdown.mjs first).
 * Idempotent: upserts rows by a fixed id derived from the story code.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { Client, TablesDB, Permission, Role } from "node-appwrite";

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const apiKey = process.env.APPWRITE_API_KEY;
const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "wattly";
const tableId = "stories";

if (!endpoint || !projectId || !apiKey) {
  console.error("Missing Appwrite env vars.");
  process.exit(1);
}

const client = new Client().setEndpoint(endpoint).setProject(projectId).setKey(apiKey);
const tablesDB = new TablesDB(client);

const anyUser = [
  Permission.read(Role.users()),
  Permission.create(Role.users()),
  Permission.update(Role.users()),
  Permission.delete(Role.users()),
];

const content = JSON.parse(
  readFileSync(resolve(process.cwd(), "src/lib/stories/stories-content.json"), "utf8"),
);

async function ensureTable() {
  try {
    await tablesDB.getTable({ databaseId, tableId });
  } catch {
    await tablesDB.createTable({
      databaseId,
      tableId,
      name: "Stories",
      permissions: anyUser,
      columns: [],
    });
    const columns = [
      ["code", 16],
      ["level", 4],
      ["title", 200],
      ["passage", 10000],
      ["questions", 4000],
    ];
    for (const [key, size] of columns) {
      await tablesDB.createVarcharColumn({
        databaseId,
        tableId,
        key,
        size,
        required: true,
      });
    }
    // Appwrite creates columns asynchronously; give the table a moment to settle.
    await new Promise((r) => setTimeout(r, 5000));
  }
}

async function upsert(story) {
  const rowId = `story-${story.code.toLowerCase().replace(".", "-")}`;
  const data = {
    code: story.code,
    level: story.level,
    title: story.title,
    passage: story.passage,
    questions: JSON.stringify(story.questions),
  };
  try {
    await tablesDB.getRow({ databaseId, tableId, rowId });
    await tablesDB.updateRow({ databaseId, tableId, rowId, data });
    console.log(`Updated: ${rowId}`);
  } catch {
    await tablesDB.createRow({ databaseId, tableId, rowId, data });
    console.log(`Created: ${rowId}`);
  }
}

async function main() {
  await ensureTable();
  for (const story of content.stories) {
    await upsert(story);
  }
  console.log(`Done: ${content.stories.length} stories.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
