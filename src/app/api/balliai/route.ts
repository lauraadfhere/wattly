import { NextResponse } from "next/server";
import {
  BALLIAI_MAX_HISTORY,
  BALLIAI_MAX_MESSAGE,
  isBalliaiLevel,
  isBalliaiMode,
  type BalliaiMessage,
} from "@/lib/balliai";
import {
  buildSystemPrompt,
  callBalliai,
  isBalliaiConfigured,
  retrieveLessonContext,
} from "@/lib/balliai.server";

export const runtime = "nodejs";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 30;
const buckets = new Map<string, { count: number; resetAt: number }>();

function rateLimited(key: string) {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    if (buckets.size > 5000) {
      for (const [k, v] of buckets) if (v.resetAt < now) buckets.delete(k);
    }
    return false;
  }
  bucket.count += 1;
  return bucket.count > MAX_REQUESTS;
}

function clientKey(request: Request) {
  const forwarded = request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for");
  return (forwarded || "local").split(",")[0].trim();
}

type Body = {
  message?: unknown;
  history?: unknown;
  level?: unknown;
  mode?: unknown;
  activityId?: unknown;
  storyId?: unknown;
};

function normaliseHistory(raw: unknown): BalliaiMessage[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter(
      (item): item is BalliaiMessage =>
        Boolean(item) &&
        typeof item === "object" &&
        ((item as BalliaiMessage).role === "user" || (item as BalliaiMessage).role === "assistant") &&
        typeof (item as BalliaiMessage).content === "string",
    )
    .map((item) => ({ role: item.role, content: item.content.slice(0, BALLIAI_MAX_MESSAGE) }))
    .slice(-BALLIAI_MAX_HISTORY);
}

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const message = typeof body.message === "string" ? body.message.trim() : "";
  if (!message) {
    return NextResponse.json({ error: "empty_message" }, { status: 400 });
  }
  if (message.length > BALLIAI_MAX_MESSAGE) {
    return NextResponse.json({ error: "message_too_long" }, { status: 413 });
  }

  if (rateLimited(clientKey(request))) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  if (!isBalliaiConfigured()) {
    return NextResponse.json(
      {
        error: "not_configured",
        setup: {
          secrets: ["NVIDIA_API_KEY"],
          optional: ["NVIDIA_BASE_URL", "NVIDIA_MODEL"],
        },
      },
      { status: 503 },
    );
  }

  const level = isBalliaiLevel(body.level) ? body.level : "A1";
  const mode = isBalliaiMode(body.mode) ? body.mode : "ask";
  const history = normaliseHistory(body.history);

  const { lesson, text } = await retrieveLessonContext({
    activityId: typeof body.activityId === "string" ? body.activityId : undefined,
    storyId: typeof body.storyId === "string" ? body.storyId : undefined,
  });

  try {
    const result = await callBalliai(
      buildSystemPrompt({ level, mode, lessonText: text }),
      history,
      message,
    );

    return NextResponse.json({
      reply: result.reply,
      model: result.model,
      lesson,
    });
  } catch (error) {
    const err = error as Error & { status?: number };
    if (err.name === "AbortError") {
      return NextResponse.json({ error: "timeout" }, { status: 504 });
    }
    if (err.status === 429) {
      return NextResponse.json({ error: "provider_rate_limited" }, { status: 429 });
    }
    if (err.message === "empty_output") {
      return NextResponse.json({ error: "empty_output" }, { status: 502 });
    }
    console.error("BALLIAI request failed", err.status ?? err.message);
    return NextResponse.json({ error: "provider_error" }, { status: 502 });
  }
}
