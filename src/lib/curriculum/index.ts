import data from "@/lib/curriculum/kinpal-data.json";

export type CefrLevel = "A1" | "A2" | "B1" | "B2" | "C1";

export type GrammarActivity = {
  id: string;
  kind: "grammar";
  level: CefrLevel;
  number: number;
  title: string;
  durationMin: number;
  goal: string;
  examples: string;
  prompt: string;
  items: string[];
  answers: string[];
};

export type ReadingActivity = {
  id: string;
  kind: "reading";
  level: CefrLevel;
  number: number;
  title: string;
  subject: string;
  durationMin: number;
  passage: string;
  questions: string[];
  answers: string[];
};

export type CurriculumActivity = GrammarActivity | ReadingActivity;

export const curriculumLevels = data.levels as CefrLevel[];

export const grammarActivities = data.grammar as GrammarActivity[];
export const readingActivities = data.reading as ReadingActivity[];

export const allCurriculumActivities: CurriculumActivity[] = [
  ...grammarActivities,
  ...readingActivities,
];

export function getCurriculumActivity(id: string) {
  return allCurriculumActivities.find((a) => a.id === id);
}

export function curriculumByLevel(level: CefrLevel) {
  return {
    grammar: grammarActivities.filter((a) => a.level === level),
    reading: readingActivities.filter((a) => a.level === level),
  };
}

export function normalizeAnswer(value: string) {
  return value
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s'-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Soft check: exact normalized match, or expected contained in learner answer. */
export function checkAnswer(learner: string, expected: string) {
  const a = normalizeAnswer(learner);
  const b = normalizeAnswer(expected);
  if (!a || !b) return false;
  if (a === b) return true;
  if (a.includes(b) || b.includes(a)) return true;
  // tolerate "any two: ..." style keys by splitting on commas / "or"
  const options = b.split(/\bor\b|,|;|\//).map((p) => p.trim()).filter(Boolean);
  if (options.length > 1 && options.some((opt) => a.includes(opt) || opt.includes(a))) {
    return true;
  }
  return false;
}

export const levelMeta: Record<
  CefrLevel,
  { label: string; tint: string; accent: string }
> = {
  A1: { label: "Beginner", tint: "#fff8ef", accent: "#c45c00" },
  A2: { label: "Elementary", tint: "#fff4e8", accent: "#b45309" },
  B1: { label: "Intermediate", tint: "#eef1ff", accent: "#0016BD" },
  B2: { label: "Upper-intermediate", tint: "#e8ecff", accent: "#000ea8" },
  C1: { label: "Advanced", tint: "#f3f0ff", accent: "#000A5E" },
};
