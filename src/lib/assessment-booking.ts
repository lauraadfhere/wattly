export type AssessmentTrack = "kids" | "adults";

export const ASSESSMENT_FEE_DA = 500;
export const ASSESSMENT_DURATION_MIN = 15;

/** Remote time slots (local demo hours). */
export const assessmentTimeSlots = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
] as const;

export const assessmentTrackStyles = {
  kids: {
    card: "border-[#ff9f43] bg-[#fff8ef]",
    selected: "border-[#ff9f43] bg-[#ffe0b8] ring-2 ring-[#ff9f43]/40",
    badge: "bg-[#ff9f43] text-white",
    accent: "text-[#c45c00]",
    button: "bg-[#ff9f43] text-white hover:bg-[#f08c2a]",
  },
  adults: {
    card: "border-[#0016BD]/35 bg-[#eef1ff]",
    selected: "border-[#0016BD] bg-[#d4dcff] ring-2 ring-[#0016BD]/35",
    badge: "bg-[#0016BD] text-white",
    accent: "text-[#0016BD]",
    button: "bg-[#0016BD] text-white hover:bg-[#000ea8]",
  },
} as const;

/** Next `count` bookable days starting tomorrow (skip none — remote every day). */
export function getBookableDays(count = 14): Date[] {
  const days: Date[] = [];
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  for (let i = 1; days.length < count; i += 1) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    days.push(d);
  }
  return days;
}

export function formatDayKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function formatDayLabel(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(date);
}
