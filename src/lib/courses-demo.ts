export type DemoCourse = {
  id: string;
  level: string;
  coverTint: string;
  coverPublicId: string;
  titleKey: "starter" | "conversation" | "business" | "exam";
};

/** Showcase courses — covers live under Cloudinary wattly/covers. */
export const DEMO_COURSES: DemoCourse[] = [
  {
    id: "starter-a1",
    level: "Pre-A1 → A1",
    coverTint: "#000ea8",
    coverPublicId: "starter-a1",
    titleKey: "starter",
  },
  {
    id: "conversation-a2",
    level: "A2 → B1",
    coverTint: "#0016BD",
    coverPublicId: "conversation-a2",
    titleKey: "conversation",
  },
  {
    id: "business-b1",
    level: "B1 → B2",
    coverTint: "#0b0b1a",
    coverPublicId: "business-b1",
    titleKey: "business",
  },
  {
    id: "exam-b2",
    level: "B2 → C1",
    coverTint: "#000A5E",
    coverPublicId: "exam-b2",
    titleKey: "exam",
  },
];
