export type CoachingFeedback = {
  id: string;
  teacherId: string;
  teacherName: string;
  studentKey: string;
  studentName: string;
  rating: 1 | 2 | 3 | 4 | 5;
  note: string;
  createdAt: string;
};

export type LessonRecommendation = {
  id: string;
  teacherId: string;
  teacherName: string;
  studentKey: string;
  studentName: string;
  lessonId: string;
  lessonTitle: string;
  track: "kids" | "advanced";
  reason: string;
  createdAt: string;
};

const FEEDBACK_KEY = "wattly-teacher-feedback";
const RECS_KEY = "wattly-lesson-recommendations";

/** Demo students teachers can assign coaching to. */
export const coachingStudents = [
  { key: "learner-demo", name: "Demo Learner", email: "learner@wattly.app" },
  { key: "yara", name: "Yara Benali", email: "yara@example.com" },
  { key: "adam", name: "Adam Karim", email: "adam@example.com" },
  { key: "nora", name: "Nora Haddad", email: "nora@example.com" },
  { key: "custom", name: "Other student…", email: "" },
] as const;

function readList<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(key);
    const parsed = raw ? (JSON.parse(raw) as T[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeList<T>(key: string, items: T[]) {
  localStorage.setItem(key, JSON.stringify(items.slice(0, 100)));
}

export function loadFeedback(teacherId?: string): CoachingFeedback[] {
  const all = readList<CoachingFeedback>(FEEDBACK_KEY);
  return teacherId ? all.filter((f) => f.teacherId === teacherId) : all;
}

export function loadRecommendations(teacherId?: string): LessonRecommendation[] {
  const all = readList<LessonRecommendation>(RECS_KEY);
  return teacherId ? all.filter((r) => r.teacherId === teacherId) : all;
}

export function feedbackForStudent(studentKey: string): CoachingFeedback[] {
  return loadFeedback().filter((f) => f.studentKey === studentKey);
}

export function recommendationsForStudent(studentKey: string): LessonRecommendation[] {
  return loadRecommendations().filter((r) => r.studentKey === studentKey);
}

export function addFeedback(
  input: Omit<CoachingFeedback, "id" | "createdAt">,
): CoachingFeedback {
  const item: CoachingFeedback = {
    ...input,
    id: `fb-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  writeList(FEEDBACK_KEY, [item, ...loadFeedback()]);
  return item;
}

export function addRecommendation(
  input: Omit<LessonRecommendation, "id" | "createdAt">,
): LessonRecommendation {
  const item: LessonRecommendation = {
    ...input,
    id: `rec-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  writeList(RECS_KEY, [item, ...loadRecommendations()]);
  return item;
}

export function removeFeedback(id: string) {
  writeList(
    FEEDBACK_KEY,
    loadFeedback().filter((f) => f.id !== id),
  );
}

export function removeRecommendation(id: string) {
  writeList(
    RECS_KEY,
    loadRecommendations().filter((r) => r.id !== id),
  );
}

/** Map signed-in learner to a coaching student key when possible. */
export function resolveStudentKey(email?: string | null, name?: string | null) {
  if (email) {
    const hit = coachingStudents.find(
      (s) => s.email && s.email.toLowerCase() === email.toLowerCase(),
    );
    if (hit) return hit.key;
  }
  if (name) {
    const hit = coachingStudents.find(
      (s) => s.name.toLowerCase() === name.toLowerCase(),
    );
    if (hit) return hit.key;
  }
  return email || name || "learner";
}
