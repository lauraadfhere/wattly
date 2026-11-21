export type LessonTrack = "kids" | "advanced";

export type KidsLevel = "beginner" | "growing" | "confident";

export type AdvancedLevel = "b1" | "b2" | "c1";

export type LessonSectionType =
  | "goal"
  | "words"
  | "play"
  | "practice"
  | "story"
  | "challenge";

export type LessonSection = {
  type: LessonSectionType;
  title: string;
  body?: string;
  items?: string[];
};

export type LessonArt =
  | "abc"
  | "colors"
  | "animals"
  | "nouns"
  | "family"
  | "verbs"
  | "balloon"
  | "adjectives"
  | "food"
  | "garden"
  | "debate"
  | "idioms"
  | "writing"
  | "listening";

export type Lesson = {
  id: string;
  track: LessonTrack;
  /** Kids levels this activity suits; advanced uses AdvancedLevel ids in tags/levels field */
  kidsLevels?: KidsLevel[];
  advancedLevels?: AdvancedLevel[];
  title: string;
  tags: string[];
  accent: string;
  art: LessonArt;
  minutes: number;
  summary: string;
  sections: LessonSection[];
};
