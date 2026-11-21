export type LiveLessonCategory = "kids" | "adults";

export type LiveLesson = {
  id: string;
  title: string;
  titleAr: string;
  category: LiveLessonCategory;
  level: string;
  ages?: string;
  teacher: string;
  teacherAr: string;
  when: string;
  durationMin: number;
  subject: string;
  icon: "star" | "rocket" | "bear" | "book" | "globe" | "chat";
};

/** 14 live subjects — 7 kids + 7 adults, A1→B2 range, with teacher assignment. */
export const featuredLiveLessons: LiveLesson[] = [
  // Kids (7)
  {
    id: "kids-abc-phonics",
    title: "ABC phonics lab",
    titleAr: "مختبر صوتيات الحروف",
    category: "kids",
    level: "Pre-A1",
    ages: "5–7",
    teacher: "Layla Farouk",
    teacherAr: "ليلى فاروق",
    when: "Today · 4:00 PM",
    durationMin: 25,
    subject: "Phonics",
    icon: "star",
  },
  {
    id: "kids-animals",
    title: "Animal friends vocabulary",
    titleAr: "مفردات أصدقاء الحيوانات",
    category: "kids",
    level: "A1",
    ages: "5–8",
    teacher: "Amina Benali",
    teacherAr: "أمينة بنعلي",
    when: "Today · 5:00 PM",
    durationMin: 30,
    subject: "Vocabulary",
    icon: "bear",
  },
  {
    id: "kids-family",
    title: "My family & feelings",
    titleAr: "عائلتي ومشاعري",
    category: "kids",
    level: "A1",
    ages: "6–9",
    teacher: "Sara Al-Mansouri",
    teacherAr: "سارة المنصوري",
    when: "Tomorrow · 10:00 AM",
    durationMin: 30,
    subject: "Speaking",
    icon: "chat",
  },
  {
    id: "kids-school-day",
    title: "School day English",
    titleAr: "إنجليزية يوم المدرسة",
    category: "kids",
    level: "A1–A2",
    ages: "7–10",
    teacher: "Layla Farouk",
    teacherAr: "ليلى فاروق",
    when: "Tomorrow · 3:00 PM",
    durationMin: 30,
    subject: "Everyday English",
    icon: "book",
  },
  {
    id: "kids-songs",
    title: "Stories & songs circle",
    titleAr: "حلقة القصص والأغاني",
    category: "kids",
    level: "A1",
    ages: "5–8",
    teacher: "Sara Al-Mansouri",
    teacherAr: "سارة المنصوري",
    when: "Wed · 4:30 PM",
    durationMin: 25,
    subject: "Listening",
    icon: "rocket",
  },
  {
    id: "kids-numbers",
    title: "Numbers & colours play",
    titleAr: "لعبة الأرقام والألوان",
    category: "kids",
    level: "Pre-A1",
    ages: "5–7",
    teacher: "Amina Benali",
    teacherAr: "أمينة بنعلي",
    when: "Thu · 5:00 PM",
    durationMin: 25,
    subject: "Basics",
    icon: "star",
  },
  {
    id: "kids-outdoor",
    title: "Outdoor play English",
    titleAr: "إنجليزية اللعب في الخارج",
    category: "kids",
    level: "A2",
    ages: "8–12",
    teacher: "Layla Farouk",
    teacherAr: "ليلى فاروق",
    when: "Fri · 4:00 PM",
    durationMin: 35,
    subject: "Conversation",
    icon: "globe",
  },
  // Adults (7)
  {
    id: "adults-greetings",
    title: "Greetings & introductions",
    titleAr: "التحيات والتعارف",
    category: "adults",
    level: "A1",
    teacher: "Omar Youssef",
    teacherAr: "عمر يوسف",
    when: "Today · 6:00 PM",
    durationMin: 40,
    subject: "Speaking",
    icon: "chat",
  },
  {
    id: "adults-travel",
    title: "Travel English clinic",
    titleAr: "عيادة الإنجليزية للسفر",
    category: "adults",
    level: "A2",
    teacher: "Karim Haddad",
    teacherAr: "كريم حداد",
    when: "Today · 7:30 PM",
    durationMin: 40,
    subject: "Travel",
    icon: "globe",
  },
  {
    id: "adults-work",
    title: "Workplace small talk",
    titleAr: "محادثة قصيرة في العمل",
    category: "adults",
    level: "B1",
    teacher: "Omar Youssef",
    teacherAr: "عمر يوسف",
    when: "Tomorrow · 6:00 PM",
    durationMin: 45,
    subject: "Business",
    icon: "chat",
  },
  {
    id: "adults-shopping",
    title: "Shopping & services",
    titleAr: "التسوق والخدمات",
    category: "adults",
    level: "A2–B1",
    teacher: "Nour El-Amin",
    teacherAr: "نور الأمين",
    when: "Wed · 7:00 PM",
    durationMin: 40,
    subject: "Everyday English",
    icon: "book",
  },
  {
    id: "adults-ielts",
    title: "IELTS speaking warm-up",
    titleAr: "إحماء التحدث لـ IELTS",
    category: "adults",
    level: "B2",
    teacher: "Nour El-Amin",
    teacherAr: "نور الأمين",
    when: "Thu · 11:00 AM",
    durationMin: 50,
    subject: "Exam prep",
    icon: "book",
  },
  {
    id: "adults-news",
    title: "News & opinions circle",
    titleAr: "حلقة الأخبار والآراء",
    category: "adults",
    level: "B2",
    teacher: "Karim Haddad",
    teacherAr: "كريم حداد",
    when: "Fri · 6:30 PM",
    durationMin: 45,
    subject: "Discussion",
    icon: "globe",
  },
  {
    id: "adults-emails",
    title: "Everyday emails",
    titleAr: "رسائل البريد اليومية",
    category: "adults",
    level: "B1",
    teacher: "Omar Youssef",
    teacherAr: "عمر يوسف",
    when: "Sat · 10:00 AM",
    durationMin: 40,
    subject: "Writing",
    icon: "book",
  },
];

export const liveLessons = featuredLiveLessons;

export const liveLessonTeachers = Array.from(
  new Set(featuredLiveLessons.map((l) => l.teacher)),
);

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

export function getLiveLessonById(id: string) {
  return featuredLiveLessons.find((l) => l.id === id);
}
