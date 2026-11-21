/**
 * Seed 4 published live lessons into Appwrite (2 kids + 2 adults).
 * Idempotent — uses fixed row IDs.
 */
import { Client, TablesDB, ID, Query } from "node-appwrite";

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const apiKey = process.env.APPWRITE_API_KEY;
const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "wattly";
const tableId = "live_lessons";

if (!endpoint || !projectId || !apiKey) {
  console.error("Missing Appwrite env vars.");
  process.exit(1);
}

const client = new Client().setEndpoint(endpoint).setProject(projectId).setKey(apiKey);
const tablesDB = new TablesDB(client);

/** Four featured live lessons for the platform. */
const LESSONS = [
  {
    $id: "live-kids-abc",
    title: "ABC song & letter hunt",
    title_ar: "أغنية الحروف وصيد الحروف",
    category: "kids",
    level: "Pre-A1",
    teacher: "Layla Farouk",
    teacher_ar: "ليلى فاروق",
    when_label: "Today · 4:00 PM",
    duration_min: 25,
    icon: "star",
    status: "published",
  },
  {
    $id: "live-kids-animals",
    title: "Animal friends vocabulary",
    title_ar: "مفردات أصدقاء الحيوانات",
    category: "kids",
    level: "A1",
    teacher: "Amina Benali",
    teacher_ar: "أمينة بنعلي",
    when_label: "Today · 5:30 PM",
    duration_min: 30,
    icon: "bear",
    status: "published",
  },
  {
    $id: "live-adults-work",
    title: "Workplace small talk",
    title_ar: "محادثة قصيرة في العمل",
    category: "adults",
    level: "B1",
    teacher: "Omar Youssef",
    teacher_ar: "عمر يوسف",
    when_label: "Today · 6:00 PM",
    duration_min: 45,
    icon: "chat",
    status: "published",
  },
  {
    $id: "live-adults-travel",
    title: "Travel English live clinic",
    title_ar: "عيادة الإنجليزية للسفر",
    category: "adults",
    level: "A2–B1",
    teacher: "Karim Haddad",
    teacher_ar: "كريم حداد",
    when_label: "Today · 7:30 PM",
    duration_min: 40,
    icon: "globe",
    status: "published",
  },
];

async function upsertLesson(lesson) {
  const { $id, ...data } = lesson;
  try {
    await tablesDB.getRow({ databaseId, tableId, rowId: $id });
    await tablesDB.updateRow({ databaseId, tableId, rowId: $id, data });
    console.log(`Updated: ${$id} — ${data.title}`);
  } catch {
    await tablesDB.createRow({
      databaseId,
      tableId,
      rowId: $id,
      data,
    });
    console.log(`Created: ${$id} — ${data.title}`);
  }
}

async function main() {
  try {
    await tablesDB.getTable({ databaseId, tableId });
  } catch {
    console.error(
      `Table "${tableId}" missing. Run: yarn appwrite:setup`,
    );
    process.exit(1);
  }

  for (const lesson of LESSONS) {
    await upsertLesson(lesson);
  }

  const listed = await tablesDB.listRows({
    databaseId,
    tableId,
    queries: [Query.equal("status", "published"), Query.limit(20)],
  });
  console.log(`Published live lessons on backend: ${listed.rows?.length ?? 0}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
