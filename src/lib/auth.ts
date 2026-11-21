"use client";

import { ID, Permission, Query, Role } from "appwrite";
import { createBrowserClient } from "@/lib/appwrite/client";
import { appwriteConfig } from "@/lib/appwrite/config";

export type UserRole = "learner" | "parent" | "teacher" | "admin";

export type WattlyProfile = {
  $id: string;
  user_id: string;
  role: UserRole;
  display_name: string;
  email: string;
  locale?: string;
  onboarding_done: boolean;
  avatar_url?: string;
};

export async function registerAccount(input: {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  locale: string;
}) {
  const { account, tablesDB } = createBrowserClient();

  const user = await account.create({
    userId: ID.unique(),
    email: input.email,
    password: input.password,
    name: input.name,
  });

  await account.createEmailPasswordSession({
    email: input.email,
    password: input.password,
  });

  const ownerPermissions = [
    Permission.read(Role.user(user.$id)),
    Permission.update(Role.user(user.$id)),
    Permission.delete(Role.user(user.$id)),
  ];

  const profileData = {
    user_id: user.$id,
    role: input.role,
    display_name: input.name,
    email: input.email,
    locale: input.locale,
    onboarding_done: false,
  };

  const profile = await tablesDB.createRow({
    databaseId: appwriteConfig.databaseId,
    tableId: appwriteConfig.tables.wattly,
    rowId: ID.unique(),
    data: profileData,
    permissions: ownerPermissions,
  });

  try {
    await tablesDB.createRow({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.tables.profiles,
      rowId: ID.unique(),
      data: profileData,
      permissions: ownerPermissions,
    });
  } catch {
    // Non-blocking if permissions lag after table creation
  }

  return { user, profile: profile as unknown as WattlyProfile };
}

export async function loginAccount(email: string, password: string) {
  const { account } = createBrowserClient();
  return account.createEmailPasswordSession({ email, password });
}

export async function logoutAccount() {
  const { account } = createBrowserClient();
  try {
    await account.deleteSession({ sessionId: "current" });
  } catch {
    // already logged out
  }
}

export async function getCurrentUser() {
  const { account } = createBrowserClient();
  try {
    return await account.get();
  } catch {
    return null;
  }
}

export async function getCurrentProfile(): Promise<WattlyProfile | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  const { tablesDB } = createBrowserClient();
  const result = await tablesDB.listRows({
    databaseId: appwriteConfig.databaseId,
    tableId: appwriteConfig.tables.wattly,
    queries: [Query.equal("user_id", user.$id), Query.limit(1)],
  });

  const rows = result.rows ?? [];
  if (!rows[0]) return null;
  return rows[0] as unknown as WattlyProfile;
}

export async function markOnboardingDone(profileId: string) {
  const { tablesDB } = createBrowserClient();
  return tablesDB.updateRow({
    databaseId: appwriteConfig.databaseId,
    tableId: appwriteConfig.tables.wattly,
    rowId: profileId,
    data: { onboarding_done: true },
  });
}

export async function updateProfileName(profileId: string, displayName: string) {
  const { account, tablesDB } = createBrowserClient();

  await account.updateName({ name: displayName });

  const updated = await tablesDB.updateRow({
    databaseId: appwriteConfig.databaseId,
    tableId: appwriteConfig.tables.wattly,
    rowId: profileId,
    data: { display_name: displayName },
  });

  return updated as unknown as WattlyProfile;
}

export async function updateProfileAvatar(profileId: string, avatarUrl: string) {
  const { tablesDB } = createBrowserClient();
  const updated = await tablesDB.updateRow({
    databaseId: appwriteConfig.databaseId,
    tableId: appwriteConfig.tables.wattly,
    rowId: profileId,
    data: { avatar_url: avatarUrl },
  });
  return updated as unknown as WattlyProfile;
}
