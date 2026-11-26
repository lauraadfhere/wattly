import { Query } from "node-appwrite";
import { createAdminClient } from "@/lib/appwrite/server";
import { appwriteConfig } from "@/lib/appwrite/config";
import {
  allActivities,
  type ActivityTrack,
  type WattlyActivity,
} from "@/lib/activities";

type ActivityRow = {
  $id: string;
  activity_id: string;
  track: ActivityTrack;
  number: number;
  skill: string;
  level: string;
  focus?: string;
  title: string;
  minutes?: number;
  outcome?: string;
  procedure?: string;
  model?: string;
  task: string;
  success?: string;
  body?: string;
};

function parseBody(raw?: string): Partial<WattlyActivity> {
  if (!raw) return {};
  try {
    const b = JSON.parse(raw) as Record<string, unknown>;
    return {
      group: typeof b.group === "number" ? b.group : undefined,
      groupLabel: typeof b.groupLabel === "string" ? b.groupLabel : undefined,
      genre: typeof b.genre === "string" ? b.genre : undefined,
      length: typeof b.length === "string" ? b.length : undefined,
      after: typeof b.after === "string" ? b.after : undefined,
    };
  } catch {
    return {};
  }
}

function rowToActivity(row: ActivityRow): WattlyActivity {
  return {
    id: row.$id,
    number: Number(row.number),
    externalId: row.activity_id,
    track: row.track,
    skill: row.skill,
    level: row.level,
    focus: row.focus,
    minutes: row.minutes ? Number(row.minutes) : undefined,
    title: row.title,
    outcome: row.outcome,
    procedure: row.procedure,
    model: row.model,
    task: row.task,
    success: row.success,
    ...parseBody(row.body),
  };
}

/** All activities from Appwrite, falling back to the bundled JSON. */
export async function fetchActivities(): Promise<WattlyActivity[]> {
  if (!process.env.APPWRITE_API_KEY) return allActivities;

  try {
    const { tablesDB } = createAdminClient();
    const result = await tablesDB.listRows({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.tables.activities,
      queries: [Query.limit(200)],
    });
    const rows = (result.rows ?? []) as unknown as ActivityRow[];
    if (!rows.length) return allActivities;
    return rows
      .map(rowToActivity)
      .sort((a, b) => (a.track === b.track ? a.number - b.number : a.track === "curriculum" ? -1 : 1));
  } catch {
    return allActivities;
  }
}

export async function fetchActivity(id: string): Promise<WattlyActivity | null> {
  const catalog = await fetchActivities();
  return catalog.find((a) => a.id === id) ?? null;
}
