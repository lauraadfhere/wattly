import { Client, TablesDB, Permission, Role, ID } from "node-appwrite";

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const apiKey = process.env.APPWRITE_API_KEY;
const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "wattly";

if (!endpoint || !projectId || !apiKey) {
  console.error("Missing Appwrite env vars.");
  process.exit(1);
}

const client = new Client()
  .setEndpoint(endpoint)
  .setProject(projectId)
  .setKey(apiKey);

const tablesDB = new TablesDB(client);

const anyUser = [
  Permission.read(Role.users()),
  Permission.create(Role.users()),
  Permission.update(Role.users()),
  Permission.delete(Role.users()),
];

async function ensureDatabase() {
  try {
    await tablesDB.get(databaseId);
    console.log(`Database exists: ${databaseId}`);
  } catch {
    await tablesDB.create({
      databaseId,
      name: "Wattly",
      enabled: true,
    });
    console.log(`Created database: ${databaseId}`);
  }
}

async function ensureTable(tableId, name, columns = []) {
  try {
    await tablesDB.getTable({ databaseId, tableId });
    console.log(`Table exists: ${tableId}`);
  } catch {
    await tablesDB.createTable({
      databaseId,
      tableId,
      name,
      permissions: anyUser,
      columns,
    });
    console.log(`Created table: ${tableId}`);
  }
}

async function ensureUrlColumn(tableId, key, size = 2000) {
  try {
    await tablesDB.getColumn({ databaseId, tableId, key });
    console.log(`Column exists: ${tableId}.${key}`);
  } catch {
    await tablesDB.createUrlColumn({
      databaseId,
      tableId,
      key,
      required: false,
    });
    console.log(`Created column: ${tableId}.${key}`);
  }
}

async function main() {
  await ensureDatabase();

  // Primary table requested by name
  await ensureTable("wattly", "Wattly Core", [
    { key: "user_id", type: "string", size: 64, required: true },
    {
      key: "role",
      type: "enum",
      elements: ["learner", "parent", "teacher", "admin"],
      required: true,
    },
    { key: "display_name", type: "string", size: 120, required: true },
    { key: "email", type: "email", required: true },
    { key: "locale", type: "string", size: 8, required: false },
    { key: "onboarding_done", type: "boolean", required: true },
  ]);

  await ensureTable("profiles", "Profiles", [
    { key: "user_id", type: "string", size: 64, required: true },
    {
      key: "role",
      type: "enum",
      elements: ["learner", "parent", "teacher", "admin"],
      required: true,
    },
    { key: "display_name", type: "string", size: 120, required: true },
    { key: "email", type: "email", required: true },
    { key: "locale", type: "string", size: 8, required: false },
    { key: "onboarding_done", type: "boolean", required: true },
  ]);

  await ensureTable("learner_profiles", "Learner Profiles", [
    { key: "user_id", type: "string", size: 64, required: true },
    { key: "age_group", type: "string", size: 32, required: false },
    { key: "goals", type: "string", size: 2000, required: false },
    { key: "level", type: "string", size: 16, required: false },
    { key: "interests", type: "string", size: 1000, required: false },
    { key: "guardian_required", type: "boolean", required: false },
  ]);

  await ensureTable("support_settings", "Support Settings", [
    { key: "learner_id", type: "string", size: 64, required: true },
    { key: "key", type: "string", size: 64, required: true },
    { key: "value", type: "string", size: 500, required: true },
    { key: "share_with_teacher", type: "boolean", required: true },
  ]);

  await ensureTable("teacher_profiles", "Teacher Profiles", [
    { key: "user_id", type: "string", size: 64, required: true },
    { key: "bio", type: "string", size: 4000, required: false },
    { key: "languages", type: "string", size: 500, required: false },
    { key: "price", type: "double", required: false },
    { key: "verified", type: "boolean", required: true },
    { key: "specializations", type: "string", size: 1000, required: false },
    { key: "video_url", type: "url", required: false },
  ]);

  await ensureTable("bookings", "Bookings", [
    { key: "learner_id", type: "string", size: 64, required: true },
    { key: "teacher_id", type: "string", size: 64, required: true },
    { key: "start_time", type: "datetime", required: true },
    {
      key: "status",
      type: "enum",
      elements: ["pending", "confirmed", "completed", "cancelled"],
      required: true,
    },
    {
      key: "type",
      type: "enum",
      elements: ["trial", "regular"],
      required: true,
    },
  ]);

  await ensureUrlColumn("wattly", "avatar_url");
  await ensureUrlColumn("profiles", "avatar_url");

  await ensureTable("courses", "Courses", [
    { key: "title", type: "string", size: 200, required: true },
    { key: "description", type: "string", size: 4000, required: false },
    { key: "level", type: "string", size: 16, required: false },
    {
      key: "status",
      type: "enum",
      elements: ["draft", "published", "archived"],
      required: true,
    },
    { key: "created_by", type: "string", size: 64, required: false },
  ]);

  await ensureTable("videos", "Videos", [
    { key: "title", type: "string", size: 200, required: true },
    { key: "url", type: "url", required: true },
    { key: "course_id", type: "string", size: 64, required: false },
    { key: "description", type: "string", size: 2000, required: false },
    {
      key: "status",
      type: "enum",
      elements: ["draft", "published", "archived"],
      required: true,
    },
    { key: "created_by", type: "string", size: 64, required: false },
  ]);

  await ensureTable("content_items", "Content Items", [
    { key: "title", type: "string", size: 200, required: true },
    { key: "body", type: "string", size: 10000, required: false },
    {
      key: "type",
      type: "enum",
      elements: ["article", "worksheet", "notice", "resource"],
      required: true,
    },
    {
      key: "status",
      type: "enum",
      elements: ["draft", "published", "archived"],
      required: true,
    },
    { key: "created_by", type: "string", size: 64, required: false },
  ]);

  console.log("Appwrite Wattly schema ready.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
