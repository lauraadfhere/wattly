import { advancedLessons } from "./advanced-lessons";
import { kidsLessons } from "./kids-lessons";
import type { AdvancedLevel, KidsLevel, Lesson, LessonTrack } from "./types";

export type { AdvancedLevel, KidsLevel, Lesson, LessonTrack };
export { advancedLessons, kidsLessons };

export function lessonsForTrack(track: LessonTrack): Lesson[] {
  return track === "kids" ? kidsLessons : advancedLessons;
}

export function filterKidsLessons(level: KidsLevel): Lesson[] {
  return kidsLessons.filter((lesson) => lesson.kidsLevels?.includes(level));
}

export function filterAdvancedLessons(level: AdvancedLevel): Lesson[] {
  return advancedLessons.filter((lesson) =>
    lesson.advancedLevels?.includes(level),
  );
}

export function getLessonById(id: string): Lesson | undefined {
  return [...kidsLessons, ...advancedLessons].find((lesson) => lesson.id === id);
}
