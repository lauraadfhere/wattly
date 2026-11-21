import { Query } from "node-appwrite";
import { createAdminClient } from "@/lib/appwrite/server";
import { appwriteConfig } from "@/lib/appwrite/config";
import {
  featuredLiveLessons,
  getLiveLessonById,
  type LiveLesson,
  type LiveLessonCategory,
} from "@/lib/live-lessons";

type LiveLessonRow = {
  $id: string;
  title: string;
  title_ar?: string;
  category: LiveLessonCategory;
  level?: string;
  ages?: string;
  subject?: string;
  teacher: string;
  teacher_ar?: string;
  when_label: string;
  duration_min: number;
  icon: LiveLesson["icon"];
  status: string;
};

/** Always serve the rich 14-subject catalog; enrich from Appwrite when available. */
export async function fetchLiveLessons(): Promise<LiveLesson[]> {
  if (!process.env.APPWRITE_API_KEY) {
    return featuredLiveLessons;
  }

  try {
    const { tablesDB } = createAdminClient();
    const result = await tablesDB.listRows({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.tables.liveLessons,
      queries: [Query.equal("status", "published"), Query.limit(40)],
    });
    const rows = (result.rows ?? []) as unknown as LiveLessonRow[];
    if (!rows.length) return featuredLiveLessons;

    const byTitle = new Map(rows.map((r) => [r.title.toLowerCase(), r]));
    const byId = new Map(rows.map((r) => [r.$id, r]));

    return featuredLiveLessons.map((lesson) => {
      const row = byId.get(lesson.id) || byTitle.get(lesson.title.toLowerCase());
      if (!row) return lesson;
      return {
        ...lesson,
        teacher: row.teacher || lesson.teacher,
        teacherAr: row.teacher_ar || lesson.teacherAr,
        when: row.when_label || lesson.when,
        durationMin: Number(row.duration_min) || lesson.durationMin,
        level: row.level || lesson.level,
      };
    });
  } catch {
    return featuredLiveLessons;
  }
}

export async function fetchLiveLesson(id: string): Promise<LiveLesson | null> {
  const catalog = await fetchLiveLessons();
  return catalog.find((l) => l.id === id) || getLiveLessonById(id) || null;
}
