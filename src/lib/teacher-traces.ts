import { safeJsonParse } from "@/lib/live-assignments";

export type TeacherTraceKind =
  | "search"
  | "impression"
  | "click"
  | "profile_view"
  | "book_intent"
  | "feedback";

export type TeacherTrace = {
  id: string;
  teacherId?: string;
  kind: TeacherTraceKind;
  query?: string;
  weight?: number;
  userId?: string;
  at: string;
};

const TRACES_KEY = "wattly-teacher-traces";
const MAX_TRACES = 500;

function readTraces(): TeacherTrace[] {
  if (typeof window === "undefined") return [];
  const list = safeJsonParse<TeacherTrace[]>(localStorage.getItem(TRACES_KEY), []);
  return Array.isArray(list) ? list : [];
}

function writeTraces(items: TeacherTrace[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(TRACES_KEY, JSON.stringify(items.slice(0, MAX_TRACES)));
}

export function recordTeacherTrace(
  input: Omit<TeacherTrace, "id" | "at"> & { at?: string },
) {
  if (typeof window === "undefined") return;
  const item: TeacherTrace = {
    ...input,
    id: `tr-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    at: input.at || new Date().toISOString(),
    weight: input.weight ?? defaultWeight(input.kind),
  };
  writeTraces([item, ...readTraces()]);
}

function defaultWeight(kind: TeacherTraceKind) {
  switch (kind) {
    case "book_intent":
      return 8;
    case "feedback":
      return 6;
    case "profile_view":
      return 4;
    case "click":
      return 3;
    case "search":
      return 1;
    case "impression":
      return 0.5;
    default:
      return 1;
  }
}

export function loadTeacherTraces(userId?: string): TeacherTrace[] {
  const all = readTraces();
  if (!userId) return all;
  return all.filter((t) => !t.userId || t.userId === userId);
}

/** Aggregate engagement score per teacher from traces (recency-weighted). */
export function teacherEngagementScores(traces: TeacherTrace[]) {
  const now = Date.now();
  const scores: Record<string, number> = {};
  for (const tr of traces) {
    if (!tr.teacherId) continue;
    const ageDays = Math.max(0, (now - Date.parse(tr.at || new Date(now).toISOString())) / 86_400_000);
    const decay = Math.exp(-ageDays / 21); // ~3 week half-life feel
    const w = (tr.weight ?? defaultWeight(tr.kind)) * decay;
    scores[tr.teacherId] = (scores[tr.teacherId] || 0) + w;
  }
  return scores;
}

/** Tokens the learner has searched for — used to boost specialty matches. */
export function learnerInterestTokens(traces: TeacherTrace[], limit = 24) {
  const counts = new Map<string, number>();
  for (const tr of traces) {
    if (tr.kind !== "search" || !tr.query) continue;
    for (const tok of tokenize(tr.query)) {
      counts.set(tok, (counts.get(tok) || 0) + 1);
    }
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([tok]) => tok);
}

export function tokenize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\p{L}\p{N}\s+-]/gu, " ")
    .split(/[\s+/·,|]+/)
    .map((t) => t.trim())
    .filter((t) => t.length >= 2);
}
