import curriculumData from "@/lib/activities/wattly-curriculum.json";
import writingData from "@/lib/activities/writing-practice.json";

export type ActivityTrack = "curriculum" | "writing";

export type WattlyActivity = {
  id: string;
  number: number;
  externalId: string;
  track: ActivityTrack;
  skill: string;
  level: string;
  focus?: string;
  minutes?: number;
  title: string;
  outcome?: string;
  procedure?: string;
  model?: string;
  task: string;
  success?: string;
  group?: number;
  groupLabel?: string;
  genre?: string;
  length?: string;
  after?: string;
};

export const curriculumActivities = curriculumData.activities as WattlyActivity[];
export const writingActivities = writingData.activities as WattlyActivity[];

export const allActivities: WattlyActivity[] = [
  ...curriculumActivities,
  ...writingActivities,
];

export function getActivity(id: string) {
  return allActivities.find((a) => a.id === id);
}
