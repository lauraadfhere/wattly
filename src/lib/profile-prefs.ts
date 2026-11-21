export type EnglishLevel = "Pre-A1" | "A1" | "A2" | "B1" | "B2" | "C1";

export type ProfilePrefs = {
  level: EnglishLevel;
  timezone: string;
};

const KEY = "wattly-profile-prefs";

export const ENGLISH_LEVELS: EnglishLevel[] = [
  "Pre-A1",
  "A1",
  "A2",
  "B1",
  "B2",
  "C1",
];

/** Common timezones for Wattly learners (Africa / Europe / Middle East focus). */
export const TIMEZONES = [
  "Africa/Algiers",
  "Africa/Casablanca",
  "Africa/Cairo",
  "Africa/Tunis",
  "Europe/Paris",
  "Europe/London",
  "Europe/Madrid",
  "Asia/Dubai",
  "Asia/Riyadh",
  "UTC",
] as const;

export function loadProfilePrefs(userId?: string): ProfilePrefs {
  const fallback: ProfilePrefs = {
    level: "A1",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
  };
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(userId ? `${KEY}:${userId}` : KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as Partial<ProfilePrefs>;
    return {
      level: (parsed.level as EnglishLevel) || fallback.level,
      timezone: parsed.timezone || fallback.timezone,
    };
  } catch {
    return fallback;
  }
}

export function saveProfilePrefs(prefs: ProfilePrefs, userId?: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(userId ? `${KEY}:${userId}` : KEY, JSON.stringify(prefs));
}
