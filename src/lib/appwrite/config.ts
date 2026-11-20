export const appwriteConfig = {
  endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!,
  projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!,
  databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "wattly",
  tables: {
    wattly: "wattly",
    profiles: "profiles",
    learnerProfiles: "learner_profiles",
    supportSettings: "support_settings",
    teacherProfiles: "teacher_profiles",
    bookings: "bookings",
  },
} as const;
