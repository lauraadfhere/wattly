/**
 * Seed the Wattly curriculum (70) and writing-practice (100) activities into Appwrite.
 * Sources: src/lib/activities/*.json (run the parse-* scripts first).
 * Idempotent: upserts rows by the activity id.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { Client, TablesDB, Permission, Role } from "node-appwrite";

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const apiKey = process.env.APPWRITE_API_KEY;
const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "wattly";
const tableId = "activities";

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

function load(file) {
  return JSON.parse(readFileSync(resolve(process.cwd(), "src/lib/activities", file), "utf8"))
    .activities;
}

const activities = [...load("wattly-curriculum.json"), ...load("writing-practice.json")];

const trim = (value, size) => String(value ?? "").slice(0, size);

async function ensureTable() {
  try {
    await tablesDB.getTable({ databaseId, tableId });
  } catch {
    await tablesDB.createTable({
      databaseId,
      tableId,
      name: "Activities",
      permissions: anyUser,
      columns: [],
    });
    const columns = [
      ["activity_id", 32],
      ["track", 16],
      ["skill", 24],
      ["level", 24],
      ["focus", 200],
      ["title", 300],
      ["outcome", 1000],
      ["procedure", 4000],
      ["model", 2000],
      ["task", 3000],
      ["success", 1000],
      ["body", 4000],
    ];
    for (const [key, size] of columns) {
      await tablesDB.createVarcharColumn({ databaseId, tableId, key, size, required: false });
    }
    await tablesDB.createIntegerColumn({
      databaseId,
      tableId,
      key: "number",
      required: true,
      min: 1,
      max: 1000,
    });
    await tablesDB.createIntegerColumn({
      databaseId,
      tableId,
      key: "minutes",
      required: false,
      min: 0,
      max: 600,
    });
    // Appwrite creates columns asynchronously; give the table a moment to settle.
    await new Promise((r) => setTimeout(r, 6000));
  }
}

function toData(activity) {
  return {
    activity_id: activity.externalId,
    track: activity.track,
    number: activity.number,
    skill: activity.skill,
    level: trim(activity.level, 24),
    focus: trim(activity.focus, 200),
    title: trim(activity.title, 300),
    minutes: activity.minutes ?? null,
    outcome: trim(activity.outcome, 1000),
    procedure: trim(activity.procedure, 4000),
    model: trim(activity.model, 2000),
    task: trim(activity.task, 3000),
    success: trim(activity.success, 1000),
    body: JSON.stringify({
      group: activity.group ?? null,
      groupLabel: activity.groupLabel ?? null,
      genre: activity.genre ?? null,
      length: activity.length ?? null,
      after: activity.after ?? null,
    }),
  };
}

async function upsert(activity) {
  const rowId = activity.id;
  const data = toData(activity);
  try {
    await tablesDB.getRow({ databaseId, tableId, rowId });
    await tablesDB.updateRow({ databaseId, tableId, rowId, data });
  } catch {
    await tablesDB.createRow({ databaseId, tableId, rowId, data });
  }
}

async function main() {
  await ensureTable();
  let done = 0;
  const failed = [];
  for (const activity of activities) {
    try {
      await upsert(activity);
      done += 1;
    } catch (err) {
      failed.push(`${activity.id}: ${err.message}`);
    }
  }
  console.log(`Done: ${done} activities (${load("wattly-curriculum.json").length} curriculum, ${load("writing-practice.json").length} writing).`);
  if (failed.length) {
    console.log(`Failed ${failed.length}:`);
    for (const line of failed) console.log(` - ${line}`);
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
