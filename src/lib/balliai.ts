/** Shared BALLIAI types and catalogue values (safe for the browser). */

export type BalliaiMode =
  | "ask"
  | "grammar"
  | "vocabulary"
  | "reading"
  | "writing"
  | "conversation"
  | "exam";

export type BalliaiLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type BalliaiMessage = {
  role: "user" | "assistant";
  content: string;
};

export const balliaiModes: { id: BalliaiMode; labelKey: string; chipKey: string }[] = [
  { id: "ask", labelKey: "modeAsk", chipKey: "chipAsk" },
  { id: "grammar", labelKey: "modeGrammar", chipKey: "chipGrammar" },
  { id: "vocabulary", labelKey: "modeVocabulary", chipKey: "chipVocabulary" },
  { id: "reading", labelKey: "modeReading", chipKey: "chipReading" },
  { id: "writing", labelKey: "modeWriting", chipKey: "chipWriting" },
  { id: "conversation", labelKey: "modeConversation", chipKey: "chipConversation" },
  { id: "exam", labelKey: "modeExam", chipKey: "chipExam" },
];

export const balliaiLevels: BalliaiLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];

export function isBalliaiMode(value: unknown): value is BalliaiMode {
  return typeof value === "string" && balliaiModes.some((m) => m.id === value);
}

export function isBalliaiLevel(value: unknown): value is BalliaiLevel {
  return typeof value === "string" && (balliaiLevels as string[]).includes(value);
}

export const BALLIAI_MAX_MESSAGE = 2000;
export const BALLIAI_MAX_HISTORY = 8;
