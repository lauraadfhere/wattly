/**
 * Seed all featured live lessons into Appwrite (7 kids + 7 adults).
 * Idempotent — uses fixed row IDs matching the local catalog.
 */
import { Client, TablesDB, Query } from "node-appwrite";

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

/** Pull featured catalog from compiled source via a tiny inline mirror. */
const featured = [
  ["kids-abc-phonics", "ABC phonics lab", "مختبر صوتيات الحروف", "kids", "Pre-A1", "Layla Farouk", "ليلى فاروق", "Today · 4:00 PM", 25, "star", "Phonics", "5–7"],
  ["kids-animals", "Animal friends vocabulary", "مفردات أصدقاء الحيوانات", "kids", "A1", "Amina Benali", "أمينة بنعلي", "Today · 5:00 PM", 30, "bear", "Vocabulary", "5–8"],
  ["kids-family", "My family & feelings", "عائلتي ومشاعري", "kids", "A1", "Sara Al-Mansouri", "سارة المنصوري", "Tomorrow · 10:00 AM", 30, "chat", "Speaking", "6–9"],
  ["kids-school-day", "School day English", "إنجليزية يوم المدرسة", "kids", "A1–A2", "Layla Farouk", "ليلى فاروق", "Tomorrow · 3:00 PM", 30, "book", "Everyday English", "7–10"],
  ["kids-songs", "Stories & songs circle", "حلقة القصص والأغاني", "kids", "A1", "Sara Al-Mansouri", "سارة المنصوري", "Wed · 4:30 PM", 25, "rocket", "Listening", "5–8"],
  ["kids-numbers", "Numbers & colours play", "لعبة الأرقام والألوان", "kids", "Pre-A1", "Amina Benali", "أمينة بنعلي", "Thu · 5:00 PM", 25, "star", "Basics", "5–7"],
  ["kids-outdoor", "Outdoor play English", "إنجليزية اللعب في الخارج", "kids", "A2", "Layla Farouk", "ليلى فاروق", "Fri · 4:00 PM", 35, "globe", "Conversation", "8–12"],
  ["adults-greetings", "Greetings & introductions", "التحيات والتعارف", "adults", "A1", "Omar Youssef", "عمر يوسف", "Today · 6:00 PM", 40, "chat", "Speaking", ""],
  ["adults-travel", "Travel English clinic", "عيادة الإنجليزية للسفر", "adults", "A2", "Karim Haddad", "كريم حداد", "Today · 7:30 PM", 40, "globe", "Travel", ""],
  ["adults-work", "Workplace small talk", "محادثة قصيرة في العمل", "adults", "B1", "Omar Youssef", "عمر يوسف", "Tomorrow · 6:00 PM", 45, "chat", "Business", ""],
  ["adults-shopping", "Shopping & services", "التسوق والخدمات", "adults", "A2–B1", "Nour El-Amin", "نور الأمين", "Wed · 7:00 PM", 40, "book", "Everyday English", ""],
  ["adults-ielts", "IELTS speaking warm-up", "إحماء التحدث لـ IELTS", "adults", "B2", "Nour El-Amin", "نور الأمين", "Thu · 11:00 AM", 50, "book", "Exam prep", ""],
  ["adults-news", "News & opinions circle", "حلقة الأخبار والآراء", "adults", "B2", "Karim Haddad", "كريم حداد", "Fri · 6:30 PM", 45, "globe", "Discussion", ""],
  ["adults-emails", "Everyday emails", "رسائل البريد اليومية", "adults", "B1", "Omar Youssef", "عمر يوسف", "Sat · 10:00 AM", 40, "book", "Writing", ""],
].map(([id, title, title_ar, category, level, teacher, teacher_ar, when_label, duration_min, icon, subject, ages]) => ({
  $id: id,
  title,
  title_ar,
  category,
  level,
  teacher,
  teacher_ar,
  when_label,
  duration_min,
  icon,
  subject,
  ages: ages || undefined,
  status: "published",
}));

async function ensureOptionalColumns() {
  for (const col of [
    { key: "subject", type: "string" },
    { key: "ages", type: "string" },
  ]) {
    try {
      await tablesDB.getColumn({ databaseId, tableId, key: col.key });
    } catch {
      try {
        await tablesDB.createStringColumn({
          databaseId,
          tableId,
          key: col.key,
          size: 128,
          required: false,
        });
        console.log(`Created column: ${col.key}`);
      } catch (error) {
        console.warn(`Column ${col.key} skipped:`, error.message || error);
      }
    }
  }
}

async function upsertLesson(lesson) {
  const { $id, ...data } = lesson;
  // Drop empty optional fields
  if (!data.ages) delete data.ages;
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
    console.error(`Table "${tableId}" missing. Run: yarn appwrite:setup`);
    process.exit(1);
  }

  await ensureOptionalColumns();

  for (const lesson of featured) {
    await upsertLesson(lesson);
  }

  const listed = await tablesDB.listRows({
    databaseId,
    tableId,
    queries: [Query.equal("status", "published"), Query.limit(40)],
  });
  console.log(`Published live lessons on backend: ${listed.rows?.length ?? 0}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
