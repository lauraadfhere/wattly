export const appwriteConfig = {
  endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!,
  projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!,
  databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "wattly",
  buckets: {
    libraryEpubs:
      process.env.APPWRITE_LIBRARY_EPUBS_BUCKET || "library_epubs",
  },
  tables: {
    wattly: "wattly",
    profiles: "profiles",
    learnerProfiles: "learner_profiles",
    supportSettings: "support_settings",
    teacherProfiles: "teacher_profiles",
    bookings: "bookings",
    courses: "courses",
    videos: "videos",
    contentItems: "content_items",
    liveLessons: "live_lessons",
    stories: "stories",
    activities: "activities",
  },
} as const;
