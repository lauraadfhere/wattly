import {
  loadFeedback,
  loadRecommendations,
  type CoachingFeedback,
  type LessonRecommendation,
} from "@/lib/teacher-coaching";

export type CenterMessageKind =
  | "chat"
  | "feedback"
  | "recommendation"
  | "notification";

export type CenterMessage = {
  id: string;
  threadId: string;
  kind: CenterMessageKind;
  fromRole: "teacher" | "student";
  fromId: string;
  fromName: string;
  toId: string;
  toName: string;
  body: string;
  createdAt: string;
  readByStudent: boolean;
  readByTeacher: boolean;
  meta?: {
    rating?: number;
    lessonId?: string;
    lessonTitle?: string;
    feedbackId?: string;
    recommendationId?: string;
  };
};

export type CenterThread = {
  id: string;
  teacherId: string;
  teacherName: string;
  studentKey: string;
  studentName: string;
  updatedAt: string;
  lastPreview: string;
  lastKind: CenterMessageKind;
};

const THREADS_KEY = "wattly-message-threads";
const MESSAGES_KEY = "wattly-center-messages";
const MIGRATED_KEY = "wattly-messages-migrated-v1";

function readList<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(key)?.trim();
    if (!raw) return [];
    const parsed = JSON.parse(raw) as T[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeList<T>(key: string, items: T[]) {
  localStorage.setItem(key, JSON.stringify(items.slice(0, 400)));
}

export function threadIdFor(teacherId: string, studentKey: string) {
  return `thread:${teacherId}:${studentKey}`;
}

function loadThreads(): CenterThread[] {
  return readList<CenterThread>(THREADS_KEY);
}

function saveThreads(threads: CenterThread[]) {
  writeList(
    THREADS_KEY,
    [...threads].sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    ),
  );
}

function loadMessages(): CenterMessage[] {
  return readList<CenterMessage>(MESSAGES_KEY);
}

function saveMessages(messages: CenterMessage[]) {
  writeList(
    MESSAGES_KEY,
    [...messages].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    ),
  );
}

function upsertThread( partial: Omit<CenterThread, "updatedAt" | "lastPreview" | "lastKind"> & {
  preview: string;
  kind: CenterMessageKind;
  at?: string;
}) {
  const threads = loadThreads();
  const at = partial.at || new Date().toISOString();
  const existing = threads.find((t) => t.id === partial.id);
  const next: CenterThread = {
    id: partial.id,
    teacherId: partial.teacherId,
    teacherName: partial.teacherName,
    studentKey: partial.studentKey,
    studentName: partial.studentName,
    updatedAt: at,
    lastPreview: partial.preview.slice(0, 140),
    lastKind: partial.kind,
  };
  if (existing) {
    saveThreads([next, ...threads.filter((t) => t.id !== partial.id)]);
  } else {
    saveThreads([next, ...threads]);
  }
  return next;
}

export function postCenterMessage(
  input: Omit<
    CenterMessage,
    "id" | "createdAt" | "readByStudent" | "readByTeacher" | "threadId"
  > & { threadId?: string; createdAt?: string },
): CenterMessage {
  const threadId =
    input.threadId ||
    threadIdFor(
      input.fromRole === "teacher" ? input.fromId : input.toId,
      input.fromRole === "student" ? input.fromId : input.toId,
    );

  const teacherId = input.fromRole === "teacher" ? input.fromId : input.toId;
  const teacherName =
    input.fromRole === "teacher" ? input.fromName : input.toName;
  const studentKey = input.fromRole === "student" ? input.fromId : input.toId;
  const studentName =
    input.fromRole === "student" ? input.fromName : input.toName;

  const createdAt = input.createdAt || new Date().toISOString();
  const message: CenterMessage = {
    id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    threadId,
    kind: input.kind,
    fromRole: input.fromRole,
    fromId: input.fromId,
    fromName: input.fromName,
    toId: input.toId,
    toName: input.toName,
    body: input.body.trim(),
    createdAt,
    readByStudent: input.fromRole === "student",
    readByTeacher: input.fromRole === "teacher",
    meta: input.meta,
  };

  saveMessages([message, ...loadMessages()]);
  upsertThread({
    id: threadId,
    teacherId,
    teacherName,
    studentKey,
    studentName,
    preview: message.body,
    kind: message.kind,
    at: createdAt,
  });
  return message;
}

/** Push teacher feedback into the Messages Center (notification + thread context). */
export function notifyFeedbackInMessages(feedback: CoachingFeedback) {
  const existing = loadMessages().some(
    (m) => m.meta?.feedbackId === feedback.id,
  );
  if (existing) return;

  postCenterMessage({
    kind: "feedback",
    fromRole: "teacher",
    fromId: feedback.teacherId,
    fromName: feedback.teacherName,
    toId: feedback.studentKey,
    toName: feedback.studentName,
    body: feedback.note,
    createdAt: feedback.createdAt,
    meta: {
      rating: feedback.rating,
      feedbackId: feedback.id,
    },
  });
}

/** Push lesson recommendation into the Messages Center. */
export function notifyRecommendationInMessages(rec: LessonRecommendation) {
  const existing = loadMessages().some(
    (m) => m.meta?.recommendationId === rec.id,
  );
  if (existing) return;

  const body = rec.lessonTitle
    ? `${rec.lessonTitle}${rec.reason ? ` — ${rec.reason}` : ""}`
    : rec.reason;
  postCenterMessage({
    kind: "recommendation",
    fromRole: "teacher",
    fromId: rec.teacherId,
    fromName: rec.teacherName,
    toId: rec.studentKey,
    toName: rec.studentName,
    body,
    createdAt: rec.createdAt,
    meta: {
      lessonId: rec.lessonId,
      lessonTitle: rec.lessonTitle,
      recommendationId: rec.id,
    },
  });
}

/** One-time import of existing coaching feedback/recs into Messages Center. */
export function migrateCoachingIntoMessages() {
  if (typeof window === "undefined") return;
  if (localStorage.getItem(MIGRATED_KEY) === "1") {
    // Still pick up any new coaching items not yet mirrored.
    for (const fb of loadFeedback()) notifyFeedbackInMessages(fb);
    for (const rec of loadRecommendations()) notifyRecommendationInMessages(rec);
    return;
  }
  for (const fb of loadFeedback()) notifyFeedbackInMessages(fb);
  for (const rec of loadRecommendations()) notifyRecommendationInMessages(rec);
  localStorage.setItem(MIGRATED_KEY, "1");
}

export function listThreadsForParticipant(opts: {
  role: "teacher" | "student" | "admin";
  teacherId?: string;
  studentKey?: string;
}): CenterThread[] {
  migrateCoachingIntoMessages();
  const threads = loadThreads();
  if (opts.role === "teacher" || opts.role === "admin") {
    if (!opts.teacherId) return threads;
    return threads.filter((t) => t.teacherId === opts.teacherId);
  }
  if (!opts.studentKey) return [];
  return threads.filter((t) => t.studentKey === opts.studentKey);
}

export function messagesForThread(threadId: string): CenterMessage[] {
  return loadMessages()
    .filter((m) => m.threadId === threadId)
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
}

export function unreadCountForThread(
  threadId: string,
  role: "teacher" | "student",
) {
  return loadMessages().filter((m) => {
    if (m.threadId !== threadId) return false;
    return role === "student" ? !m.readByStudent : !m.readByTeacher;
  }).length;
}

export function totalUnreadForParticipant(opts: {
  role: "teacher" | "student" | "admin";
  teacherId?: string;
  studentKey?: string;
}) {
  const threads = listThreadsForParticipant(opts);
  const role = opts.role === "admin" ? "teacher" : opts.role;
  return threads.reduce(
    (sum, thread) => sum + unreadCountForThread(thread.id, role),
    0,
  );
}

export function markThreadRead(
  threadId: string,
  role: "teacher" | "student",
) {
  const next = loadMessages().map((m) => {
    if (m.threadId !== threadId) return m;
    if (role === "student") return { ...m, readByStudent: true };
    return { ...m, readByTeacher: true };
  });
  saveMessages(next);
}

export function sendChatMessage(input: {
  teacherId: string;
  teacherName: string;
  studentKey: string;
  studentName: string;
  fromRole: "teacher" | "student";
  body: string;
}) {
  const fromId =
    input.fromRole === "teacher" ? input.teacherId : input.studentKey;
  const fromName =
    input.fromRole === "teacher" ? input.teacherName : input.studentName;
  const toId =
    input.fromRole === "teacher" ? input.studentKey : input.teacherId;
  const toName =
    input.fromRole === "teacher" ? input.studentName : input.teacherName;

  return postCenterMessage({
    kind: "chat",
    fromRole: input.fromRole,
    fromId,
    fromName,
    toId,
    toName,
    body: input.body,
  });
}
