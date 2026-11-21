export type DeviceView = "mobile" | "tablet";

const PROGRESS_KEY = "wattly-kindle-progress";
const DEVICE_KEY = "wattly-reader-device";

export type ReadingProgress = {
  percent: number;
  location?: string | number;
  updatedAt: string;
};

function readAll(): Record<string, ReadingProgress> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(PROGRESS_KEY)?.trim();
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, ReadingProgress>;
  } catch {
    return {};
  }
}

export function loadReadingProgress(bookId: string): ReadingProgress {
  return (
    readAll()[bookId] || {
      percent: 0,
      updatedAt: new Date().toISOString(),
    }
  );
}

export function saveReadingProgress(
  bookId: string,
  progress: Omit<ReadingProgress, "updatedAt">,
) {
  if (typeof window === "undefined") return;
  const all = readAll();
  all[bookId] = {
    ...progress,
    percent: Math.max(0, Math.min(100, Math.round(progress.percent))),
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(all));
}

export function loadDeviceView(): DeviceView {
  if (typeof window === "undefined") return "mobile";
  const saved = localStorage.getItem(DEVICE_KEY);
  if (saved === "tablet" || saved === "mobile") return saved;
  return window.matchMedia("(min-width: 768px)").matches ? "tablet" : "mobile";
}

export function saveDeviceView(view: DeviceView) {
  if (typeof window === "undefined") return;
  localStorage.setItem(DEVICE_KEY, view);
}
