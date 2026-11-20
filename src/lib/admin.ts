"use client";

import { ID, Query } from "appwrite";
import { createBrowserClient } from "@/lib/appwrite/client";
import { appwriteConfig } from "@/lib/appwrite/config";
import type { UserRole, WattlyProfile } from "@/lib/auth";

export type CourseRow = {
  $id: string;
  title: string;
  description?: string;
  level?: string;
  status: "draft" | "published" | "archived";
  created_by?: string;
};

export type VideoRow = {
  $id: string;
  title: string;
  url: string;
  course_id?: string;
  description?: string;
  status: "draft" | "published" | "archived";
  created_by?: string;
};

export type ContentRow = {
  $id: string;
  title: string;
  body?: string;
  type: "article" | "worksheet" | "notice" | "resource";
  status: "draft" | "published" | "archived";
  created_by?: string;
};

export async function listAllUsers(): Promise<WattlyProfile[]> {
  const { tablesDB } = createBrowserClient();
  const result = await tablesDB.listRows({
    databaseId: appwriteConfig.databaseId,
    tableId: appwriteConfig.tables.wattly,
    queries: [Query.limit(100), Query.orderDesc("$createdAt")],
  });
  return (result.rows ?? []) as unknown as WattlyProfile[];
}

export async function updateUserRole(profileId: string, role: UserRole) {
  const { tablesDB } = createBrowserClient();
  return tablesDB.updateRow({
    databaseId: appwriteConfig.databaseId,
    tableId: appwriteConfig.tables.wattly,
    rowId: profileId,
    data: { role },
  });
}

export async function listCourses(): Promise<CourseRow[]> {
  const { tablesDB } = createBrowserClient();
  const result = await tablesDB.listRows({
    databaseId: appwriteConfig.databaseId,
    tableId: appwriteConfig.tables.courses,
    queries: [Query.limit(100), Query.orderDesc("$createdAt")],
  });
  return (result.rows ?? []) as unknown as CourseRow[];
}

export async function createCourse(input: {
  title: string;
  description?: string;
  level?: string;
  status?: CourseRow["status"];
  created_by?: string;
}) {
  const { tablesDB } = createBrowserClient();
  return tablesDB.createRow({
    databaseId: appwriteConfig.databaseId,
    tableId: appwriteConfig.tables.courses,
    rowId: ID.unique(),
    data: {
      title: input.title,
      description: input.description || "",
      level: input.level || "A1",
      status: input.status || "draft",
      created_by: input.created_by || "",
    },
  });
}

export async function deleteCourse(id: string) {
  const { tablesDB } = createBrowserClient();
  return tablesDB.deleteRow({
    databaseId: appwriteConfig.databaseId,
    tableId: appwriteConfig.tables.courses,
    rowId: id,
  });
}

export async function listVideos(): Promise<VideoRow[]> {
  const { tablesDB } = createBrowserClient();
  const result = await tablesDB.listRows({
    databaseId: appwriteConfig.databaseId,
    tableId: appwriteConfig.tables.videos,
    queries: [Query.limit(100), Query.orderDesc("$createdAt")],
  });
  return (result.rows ?? []) as unknown as VideoRow[];
}

export async function createVideo(input: {
  title: string;
  url: string;
  course_id?: string;
  description?: string;
  status?: VideoRow["status"];
  created_by?: string;
}) {
  const { tablesDB } = createBrowserClient();
  return tablesDB.createRow({
    databaseId: appwriteConfig.databaseId,
    tableId: appwriteConfig.tables.videos,
    rowId: ID.unique(),
    data: {
      title: input.title,
      url: input.url,
      course_id: input.course_id || "",
      description: input.description || "",
      status: input.status || "draft",
      created_by: input.created_by || "",
    },
  });
}

export async function deleteVideo(id: string) {
  const { tablesDB } = createBrowserClient();
  return tablesDB.deleteRow({
    databaseId: appwriteConfig.databaseId,
    tableId: appwriteConfig.tables.videos,
    rowId: id,
  });
}

export async function listContent(): Promise<ContentRow[]> {
  const { tablesDB } = createBrowserClient();
  const result = await tablesDB.listRows({
    databaseId: appwriteConfig.databaseId,
    tableId: appwriteConfig.tables.contentItems,
    queries: [Query.limit(100), Query.orderDesc("$createdAt")],
  });
  return (result.rows ?? []) as unknown as ContentRow[];
}

export async function createContent(input: {
  title: string;
  body?: string;
  type?: ContentRow["type"];
  status?: ContentRow["status"];
  created_by?: string;
}) {
  const { tablesDB } = createBrowserClient();
  return tablesDB.createRow({
    databaseId: appwriteConfig.databaseId,
    tableId: appwriteConfig.tables.contentItems,
    rowId: ID.unique(),
    data: {
      title: input.title,
      body: input.body || "",
      type: input.type || "article",
      status: input.status || "draft",
      created_by: input.created_by || "",
    },
  });
}

export async function deleteContent(id: string) {
  const { tablesDB } = createBrowserClient();
  return tablesDB.deleteRow({
    databaseId: appwriteConfig.databaseId,
    tableId: appwriteConfig.tables.contentItems,
    rowId: id,
  });
}
