import { Query } from "node-appwrite";
import { createAdminClient } from "@/lib/appwrite/server";
import { appwriteConfig } from "@/lib/appwrite/config";

export type LiveLessonCategory = "kids" | "adults";

export type LiveLesson = {
  id: string;
  title: string;
  titleAr: string;
  category: LiveLessonCategory;
  level: string;
  teacher: string;
  teacherAr: string;
  when: string;
  durationMin: number;
  /** Kids character icon key */
  icon: "star" | "rocket" | "bear" | "book" | "globe" | "chat";
};

/** Four featured live lessons — also seeded into Appwrite. */
export const featuredLiveLessons: LiveLesson[] = [
  {
    id: "live-kids-abc",
    title: "ABC song & letter hunt",
    titleAr: "أغنية الحروف وصيد الحروف",
    category: "kids",
    level: "Pre-A1",
    teacher: "Layla Farouk",
    teacherAr: "ليلى فاروق",
    when: "Today · 4:00 PM",
    durationMin: 25,
    icon: "star",
  },
  {
    id: "live-kids-animals",
    title: "Animal friends vocabulary",
    titleAr: "مفردات أصدقاء الحيوانات",
    category: "kids",
    level: "A1",
    teacher: "Amina Benali",
    teacherAr: "أمينة بنعلي",
    when: "Today · 5:30 PM",
    durationMin: 30,
    icon: "bear",
  },
  {
    id: "live-adults-work",
    title: "Workplace small talk",
    titleAr: "محادثة قصيرة في العمل",
    category: "adults",
    level: "B1",
    teacher: "Omar Youssef",
    teacherAr: "عمر يوسف",
    when: "Today · 6:00 PM",
    durationMin: 45,
    icon: "chat",
  },
  {
    id: "live-adults-travel",
    title: "Travel English live clinic",
    titleAr: "عيادة الإنجليزية للسفر",
    category: "adults",
    level: "A2–B1",
    teacher: "Karim Haddad",
    teacherAr: "كريم حداد",
    when: "Today · 7:30 PM",
    durationMin: 40,
    icon: "globe",
  },
];

/** @deprecated use featuredLiveLessons / fetchLiveLessons */
export const liveLessons = featuredLiveLessons;

export const liveLessonStyles = {
  kids: {
    card: "border-[#ff9f43] bg-[#fff8ef]",
    badge: "bg-[#ff9f43] text-white",
    accent: "text-[#c45c00]",
    iconBg: "bg-[#ffe0b8]",
  },
  adults: {
    card: "border-[#0016BD]/35 bg-[#eef1ff]",
    badge: "bg-[#0016BD] text-white",
    accent: "text-[#0016BD]",
    iconBg: "bg-[#d4dcff]",
  },
} as const;

type LiveLessonRow = {
  $id: string;
  title: string;
  title_ar?: string;
  category: LiveLessonCategory;
  level?: string;
  teacher: string;
  teacher_ar?: string;
  when_label: string;
  duration_min: number;
  icon: LiveLesson["icon"];
  status: string;
};

function mapRow(row: LiveLessonRow): LiveLesson {
  return {
    id: row.$id,
    title: row.title,
    titleAr: row.title_ar || row.title,
    category: row.category,
    level: row.level || "",
    teacher: row.teacher,
    teacherAr: row.teacher_ar || row.teacher,
    when: row.when_label,
    durationMin: Number(row.duration_min) || 30,
    icon: row.icon,
  };
}

/** Load published live lessons from Appwrite; fall back to the 4 featured demos. */
export async function fetchLiveLessons(): Promise<LiveLesson[]> {
  if (!process.env.APPWRITE_API_KEY) {
    return featuredLiveLessons;
  }

  try {
    const { tablesDB } = createAdminClient();
    const result = await tablesDB.listRows({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.tables.liveLessons,
      queries: [
        Query.equal("status", "published"),
        Query.limit(20),
        Query.orderAsc("category"),
      ],
    });
    const rows = (result.rows ?? []) as unknown as LiveLessonRow[];
    if (!rows.length) return featuredLiveLessons;
    return rows.map(mapRow);
  } catch {
    return featuredLiveLessons;
  }
}
