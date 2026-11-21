import { demoTeachers, type DemoTeacher } from "@/lib/teachers";

export const LIVE_ASSIGN_KEY = "wattly-live-teacher-assignments";

export type LiveAssignment = {
  teacherId: string;
  teacherName: string;
  assignedAt: string;
  assignedBy?: string;
};

/** Safe JSON.parse — empty / truncated strings no longer throw SyntaxError. */
export function safeJsonParse<T>(raw: string | null | undefined, fallback: T): T {
  if (raw == null) return fallback;
  const trimmed = raw.trim();
  if (!trimmed || trimmed === "undefined" || trimmed === "null") return fallback;
  try {
    return JSON.parse(trimmed) as T;
  } catch {
    return fallback;
  }
}

export function findTeacherByName(name: string | undefined | null): DemoTeacher | undefined {
  if (!name?.trim()) return undefined;
  const needle = name.trim().toLowerCase();
  return demoTeachers.find(
    (t) =>
      t.nameEn.toLowerCase() === needle ||
      t.nameAr === name.trim() ||
      t.nameEn.toLowerCase().includes(needle) ||
      needle.includes(t.nameEn.toLowerCase().split(" ")[0]!),
  );
}

export function teacherFromAssignment(
  assignment: LiveAssignment | undefined,
  fallbackName?: string,
): DemoTeacher | undefined {
  if (assignment?.teacherId) {
    const byId = demoTeachers.find((t) => t.id === assignment.teacherId);
    if (byId) return byId;
  }
  return findTeacherByName(assignment?.teacherName || fallbackName);
}

function readRawMap(): Record<string, unknown> {
  if (typeof window === "undefined") return {};
  return safeJsonParse<Record<string, unknown>>(
    localStorage.getItem(LIVE_ASSIGN_KEY),
    {},
  );
}

/** Normalize legacy string maps `{ lessonId: "Name" }` into LiveAssignment. */
export function loadLiveAssignments(): Record<string, LiveAssignment> {
  const raw = readRawMap();
  const out: Record<string, LiveAssignment> = {};
  for (const [lessonId, value] of Object.entries(raw)) {
    if (typeof value === "string" && value.trim()) {
      const teacher = findTeacherByName(value);
      out[lessonId] = {
        teacherId: teacher?.id || value.toLowerCase().replace(/\s+/g, "-"),
        teacherName: teacher?.nameEn || value.trim(),
        assignedAt: new Date().toISOString(),
      };
      continue;
    }
    if (value && typeof value === "object") {
      const v = value as Partial<LiveAssignment>;
      if (v.teacherName || v.teacherId) {
        const teacher =
          (v.teacherId && demoTeachers.find((t) => t.id === v.teacherId)) ||
          findTeacherByName(v.teacherName);
        out[lessonId] = {
          teacherId: teacher?.id || v.teacherId || "unknown",
          teacherName: teacher?.nameEn || v.teacherName || "Teacher",
          assignedAt: v.assignedAt || new Date().toISOString(),
          assignedBy: v.assignedBy,
        };
      }
    }
  }
  return out;
}

export function saveLiveAssignment(
  lessonId: string,
  teacher: DemoTeacher | { id: string; nameEn: string },
  assignedBy?: string,
) {
  if (typeof window === "undefined") return;
  const all = loadLiveAssignments();
  all[lessonId] = {
    teacherId: teacher.id,
    teacherName: teacher.nameEn,
    assignedAt: new Date().toISOString(),
    assignedBy,
  };
  localStorage.setItem(LIVE_ASSIGN_KEY, JSON.stringify(all));
}

export function clearLiveAssignment(lessonId: string) {
  if (typeof window === "undefined") return;
  const all = loadLiveAssignments();
  delete all[lessonId];
  localStorage.setItem(LIVE_ASSIGN_KEY, JSON.stringify(all));
}

export const assignableTeachers = demoTeachers;
