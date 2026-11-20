import type { UserRole } from "@/lib/auth";

export type DemoRole = Extract<
  UserRole,
  "learner" | "parent" | "teacher" | "admin"
>;

export const DEMO_ACCOUNTS: Record<
  DemoRole,
  { email: string; password: string; name: string; role: DemoRole }
> = {
  learner: {
    email: "learner@wattly.app",
    password: "demowattly",
    name: "Demo Learner",
    role: "learner",
  },
  parent: {
    email: "parent@wattly.app",
    password: "demowattly",
    name: "Demo Parent",
    role: "parent",
  },
  teacher: {
    email: "teacher@wattly.app",
    password: "demowattly",
    name: "Demo Teacher",
    role: "teacher",
  },
  admin: {
    email: "admin@wattly.app",
    password: "demowattly",
    name: "Wattly Admin",
    role: "admin",
  },
};

/** @deprecated use DEMO_ACCOUNTS.learner */
export const DEMO_CREDENTIALS = DEMO_ACCOUNTS.learner;
