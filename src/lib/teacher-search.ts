import { loadProfilePrefs, type EnglishLevel } from "@/lib/profile-prefs";
import { loadFeedback } from "@/lib/teacher-coaching";
import {
  learnerInterestTokens,
  loadTeacherTraces,
  teacherEngagementScores,
  tokenize,
  type TeacherTrace,
} from "@/lib/teacher-traces";
import { demoTeachers, type DemoTeacher } from "@/lib/teachers";

export type TeacherSearchFilters = {
  query?: string;
  language?: string; // "all" | arabic | english | french
  specialty?: string; // keyword bucket
  maxRate?: number;
  verifiedOnly?: boolean;
  sort?: "smart" | "rate" | "name";
};

export type RankedTeacher = DemoTeacher & {
  score: number;
  reasons: string[];
  matchPercent: number;
  engagement: number;
};

const SPECIALTY_TAGS: Record<string, string[]> = {
  amina: ["dyslexia", "reading", "a1", "b1", "multisensory", "arabic"],
  karim: ["deaf", "captions", "hard-of-hearing", "visual", "signing", "french"],
  sara: ["autism", "short", "visual", "predictable", "calm"],
  layla: ["kids", "phonics", "beginners", "pre-a1", "a1", "songs", "children"],
  omar: ["conversation", "b1", "b2", "travel", "work", "speaking"],
  nour: ["ielts", "exam", "listening", "c1", "b2", "prep"],
};

const LEVEL_BOOST: Record<EnglishLevel, string[]> = {
  "Pre-A1": ["kids", "phonics", "beginners", "pre-a1"],
  A1: ["a1", "beginners", "kids", "phonics", "reading"],
  A2: ["a1", "a2", "conversation", "kids"],
  B1: ["b1", "conversation", "dyslexia", "work"],
  B2: ["b2", "conversation", "ielts", "exam"],
  C1: ["c1", "ielts", "exam", "advanced"],
};

function teacherCorpus(teacher: DemoTeacher) {
  const tags = SPECIALTY_TAGS[teacher.id] || [];
  return [
    teacher.nameEn,
    teacher.nameAr,
    teacher.focus,
    teacher.focusAr,
    teacher.languages,
    teacher.languagesAr,
    teacher.bioEn,
    teacher.bioAr,
    ...tags,
  ]
    .join(" ")
    .toLowerCase();
}

function textRelevance(teacher: DemoTeacher, query: string) {
  if (!query.trim()) return { score: 0, hits: [] as string[] };
  const corpus = teacherCorpus(teacher);
  const tokens = tokenize(query);
  if (!tokens.length) return { score: 0, hits: [] as string[] };

  let score = 0;
  const hits: string[] = [];
  for (const tok of tokens) {
    if (corpus.includes(tok)) {
      score += tok.length >= 5 ? 3 : 2;
      hits.push(tok);
    }
  }
  // Phrase bonus
  if (tokens.length > 1 && corpus.includes(query.toLowerCase().trim())) {
    score += 5;
  }
  return { score, hits };
}

function languageMatch(teacher: DemoTeacher, language?: string) {
  if (!language || language === "all") return 0;
  const langs = `${teacher.languages} ${teacher.languagesAr}`.toLowerCase();
  if (language === "arabic" && (langs.includes("arabic") || langs.includes("العرب")))
    return 4;
  if (language === "english" && (langs.includes("english") || langs.includes("الإنجل")))
    return 3;
  if (language === "french" && (langs.includes("french") || langs.includes("الفرنس")))
    return 4;
  return -8; // hard filter soft-penalty (caller may exclude)
}

function specialtyMatch(teacher: DemoTeacher, specialty?: string) {
  if (!specialty || specialty === "all") return 0;
  const tags = SPECIALTY_TAGS[teacher.id] || [];
  const corpus = teacherCorpus(teacher);
  if (tags.includes(specialty) || corpus.includes(specialty)) return 6;
  return -10;
}

function levelAffinity(teacher: DemoTeacher, level?: EnglishLevel) {
  if (!level) return 0;
  const wanted = LEVEL_BOOST[level] || [];
  const tags = SPECIALTY_TAGS[teacher.id] || [];
  let score = 0;
  for (const w of wanted) {
    if (tags.includes(w) || teacher.focus.toLowerCase().includes(w)) score += 2;
  }
  return score;
}

function interestAffinity(teacher: DemoTeacher, interests: string[]) {
  if (!interests.length) return 0;
  const corpus = teacherCorpus(teacher);
  let score = 0;
  for (const tok of interests) {
    if (corpus.includes(tok)) score += 1.5;
  }
  return Math.min(score, 12);
}

function feedbackBoost(teacherId: string) {
  try {
    const list = loadFeedback(teacherId);
    if (!list.length) return 0;
    const avg =
      list.reduce((sum, f) => sum + f.rating, 0) / Math.max(list.length, 1);
    return (avg - 3) * 2; // 5★ ≈ +4, 1★ ≈ -4
  } catch {
    return 0;
  }
}

export function rankTeachers(
  filters: TeacherSearchFilters,
  opts?: { userId?: string; traces?: TeacherTrace[]; level?: EnglishLevel },
): RankedTeacher[] {
  const query = filters.query?.trim() || "";
  const traces = opts?.traces ?? loadTeacherTraces(opts?.userId);
  const engagement = teacherEngagementScores(traces);
  const interests = learnerInterestTokens(traces);
  const level =
    opts?.level ||
    (typeof window !== "undefined" ? loadProfilePrefs(opts?.userId).level : undefined);

  const maxEng = Math.max(1, ...Object.values(engagement), 1);

  const ranked: RankedTeacher[] = demoTeachers.map((teacher) => {
    const reasons: string[] = [];
    const text = textRelevance(teacher, query);
    let score = text.score;
    if (text.hits.length) reasons.push("text");

    const lang = languageMatch(teacher, filters.language);
    score += lang;
    if (lang > 0) reasons.push("language");

    const spec = specialtyMatch(teacher, filters.specialty);
    score += spec;
    if (spec > 0) reasons.push("specialty");

    const levelScore = levelAffinity(teacher, level);
    score += levelScore;
    if (levelScore > 0) reasons.push("level");

    const interest = interestAffinity(teacher, interests);
    score += interest;
    if (interest > 0) reasons.push("history");

    const eng = engagement[teacher.id] || 0;
    const engNorm = (eng / maxEng) * 10;
    score += engNorm;
    if (engNorm >= 2) reasons.push("popular");

    const fb = feedbackBoost(teacher.id);
    score += fb;
    if (fb > 0) reasons.push("rated");

    if (teacher.verified) {
      score += 2;
      reasons.push("verified");
    }

    // Soft budget preference: slightly prefer lower rates unless sorting by rate
    score += Math.max(0, (15 - teacher.rateUsd) * 0.15);

    if (filters.maxRate && teacher.rateUsd > filters.maxRate) {
      score -= 20;
    }
    if (filters.verifiedOnly && !teacher.verified) {
      score -= 50;
    }
    if (filters.language && filters.language !== "all" && lang < 0) {
      score -= 50;
    }
    if (filters.specialty && filters.specialty !== "all" && spec < 0) {
      score -= 50;
    }

    const matchPercent = Math.max(
      0,
      Math.min(99, Math.round(35 + score * 3.2)),
    );

    return {
      ...teacher,
      score,
      reasons: [...new Set(reasons)],
      matchPercent,
      engagement: eng,
    };
  });

  let list = ranked.filter((t) => {
    if (filters.verifiedOnly && !t.verified) return false;
    if (filters.maxRate && t.rateUsd > filters.maxRate) return false;
    if (filters.language && filters.language !== "all") {
      if (languageMatch(t, filters.language) < 0) return false;
    }
    if (filters.specialty && filters.specialty !== "all") {
      if (specialtyMatch(t, filters.specialty) < 0) return false;
    }
    if (query && textRelevance(t, query).score <= 0 && t.score < 4) {
      // allow strong personalization hits without exact text
      return t.reasons.includes("history") || t.reasons.includes("level");
    }
    return true;
  });

  // If query filtered everyone out, fall back to soft ranking
  if (query && !list.length) {
    list = ranked.sort((a, b) => b.score - a.score);
  }

  const sort = filters.sort || "smart";
  if (sort === "rate") {
    list.sort((a, b) => a.rateUsd - b.rateUsd || b.score - a.score);
  } else if (sort === "name") {
    list.sort((a, b) => a.nameEn.localeCompare(b.nameEn));
  } else {
    list.sort((a, b) => b.score - a.score || a.rateUsd - b.rateUsd);
  }

  return list;
}

export const TEACHER_SPECIALTIES = [
  { id: "all", labelKey: "specialtyAll" },
  { id: "dyslexia", labelKey: "specialtyDyslexia" },
  { id: "deaf", labelKey: "specialtyDeaf" },
  { id: "autism", labelKey: "specialtyAutism" },
  { id: "kids", labelKey: "specialtyKids" },
  { id: "phonics", labelKey: "specialtyPhonics" },
  { id: "conversation", labelKey: "specialtyConversation" },
  { id: "ielts", labelKey: "specialtyExam" },
] as const;
