"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import type { UserRole, WattlyProfile } from "@/lib/auth";
import {
  createContent,
  createCourse,
  createVideo,
  deleteContent,
  deleteCourse,
  deleteVideo,
  listAllUsers,
  listContent,
  listCourses,
  listVideos,
  updateUserRole,
  type ContentRow,
  type CourseRow,
  type VideoRow,
} from "@/lib/admin";

type Tab = "users" | "courses" | "videos" | "content";

export default function AdminPanel() {
  const t = useTranslations("Admin");
  const tAuth = useTranslations("Auth");
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  const [tab, setTab] = useState<Tab>("users");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const [users, setUsers] = useState<WattlyProfile[]>([]);
  const [courses, setCourses] = useState<CourseRow[]>([]);
  const [videos, setVideos] = useState<VideoRow[]>([]);
  const [content, setContent] = useState<ContentRow[]>([]);

  const refresh = useCallback(async () => {
    setError(null);
    try {
      const [u, c, v, ct] = await Promise.all([
        listAllUsers(),
        listCourses(),
        listVideos(),
        listContent(),
      ]);
      setUsers(u);
      setCourses(c);
      setVideos(v);
      setContent(ct);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("loadFailed"));
    }
  }, [t]);

  useEffect(() => {
    if (!loading && (!user || profile?.role !== "admin")) {
      router.push("/login");
    }
  }, [loading, user, profile, router]);

  useEffect(() => {
    if (profile?.role === "admin") {
      void refresh();
    }
  }, [profile, refresh]);

  if (loading) {
    return <div className="h-40 animate-pulse rounded-2xl bg-black/10" />;
  }

  if (!profile || profile.role !== "admin") {
    return <p className="text-black/70">{t("adminOnly")}</p>;
  }

  async function onCreateCourse(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setBusy(true);
    try {
      await createCourse({
        title: String(form.get("title") || ""),
        description: String(form.get("description") || ""),
        level: String(form.get("level") || "A1"),
        status: "published",
        created_by: profile!.user_id,
      });
      event.currentTarget.reset();
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("saveFailed"));
    } finally {
      setBusy(false);
    }
  }

  async function onCreateVideo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setBusy(true);
    try {
      await createVideo({
        title: String(form.get("title") || ""),
        url: String(form.get("url") || ""),
        course_id: String(form.get("course_id") || ""),
        description: String(form.get("description") || ""),
        status: "published",
        created_by: profile!.user_id,
      });
      event.currentTarget.reset();
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("saveFailed"));
    } finally {
      setBusy(false);
    }
  }

  async function onCreateContent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setBusy(true);
    try {
      await createContent({
        title: String(form.get("title") || ""),
        body: String(form.get("body") || ""),
        type: String(form.get("type") || "article") as ContentRow["type"],
        status: "published",
        created_by: profile!.user_id,
      });
      event.currentTarget.reset();
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("saveFailed"));
    } finally {
      setBusy(false);
    }
  }

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: "users", label: t("users"), count: users.length },
    { id: "courses", label: t("courses"), count: courses.length },
    { id: "videos", label: t("videos"), count: videos.length },
    { id: "content", label: t("content"), count: content.length },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-4">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={`rounded-2xl border-2 px-4 py-3 text-start ${
              tab === item.id
                ? "border-black bg-black text-white"
                : "border-black/20 bg-white text-black"
            }`}
          >
            <p className="text-sm font-semibold">{item.label}</p>
            <p className="mt-1 text-2xl font-bold">{item.count}</p>
          </button>
        ))}
      </div>

      {error ? (
        <p role="alert" className="rounded-xl bg-[#ff5c5c]/15 px-4 py-3 text-sm text-[#8a1010]">
          {error}
        </p>
      ) : null}

      {tab === "users" ? (
        <section className="overflow-hidden rounded-2xl border-2 border-black bg-white">
          <div className="border-b-2 border-black px-4 py-3 font-semibold">{t("manageUsers")}</div>
          <ul className="divide-y divide-black/10">
            {users.map((item) => (
              <li key={item.$id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                <div>
                  <p className="font-semibold text-black">{item.display_name}</p>
                  <p className="text-sm text-black/60">{item.email}</p>
                </div>
                <select
                  className="rounded-lg border border-black/20 bg-white px-3 py-2 text-sm"
                  value={item.role}
                  disabled={busy}
                  onChange={async (event) => {
                    setBusy(true);
                    try {
                      await updateUserRole(item.$id, event.target.value as UserRole);
                      await refresh();
                    } catch (err) {
                      setError(err instanceof Error ? err.message : t("saveFailed"));
                    } finally {
                      setBusy(false);
                    }
                  }}
                >
                  {(["learner", "parent", "teacher", "admin"] as const).map((role) => (
                    <option key={role} value={role}>
                      {tAuth(`roles.${role}` as "roles.learner")}
                    </option>
                  ))}
                </select>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {tab === "courses" ? (
        <section className="space-y-4">
          <form onSubmit={onCreateCourse} className="grid gap-3 rounded-2xl border-2 border-black bg-white p-4 sm:grid-cols-2">
            <input name="title" required placeholder={t("courseTitle")} className="rounded-xl border border-black/20 px-3 py-2" />
            <select name="level" className="rounded-xl border border-black/20 px-3 py-2" defaultValue="A1">
              {["Pre-A1", "A1", "A2", "B1", "B2", "C1"].map((level) => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
            <textarea name="description" placeholder={t("courseDescription")} className="rounded-xl border border-black/20 px-3 py-2 sm:col-span-2" rows={3} />
            <button type="submit" disabled={busy} className="rounded-full bg-black px-4 py-2 text-sm font-semibold text-white sm:col-span-2 disabled:opacity-60">
              {t("addCourse")}
            </button>
          </form>
          <ul className="space-y-2">
            {courses.map((course) => (
              <li key={course.$id} className="flex items-start justify-between gap-3 rounded-2xl border-2 border-black bg-white p-4">
                <div>
                  <p className="font-semibold">{course.title}</p>
                  <p className="text-sm text-black/60">{course.level} · {course.status}</p>
                  {course.description ? <p className="mt-1 text-sm text-black/70">{course.description}</p> : null}
                </div>
                <button
                  type="button"
                  className="text-sm font-semibold text-[#8a1010]"
                  onClick={async () => {
                    await deleteCourse(course.$id);
                    await refresh();
                  }}
                >
                  {t("delete")}
                </button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {tab === "videos" ? (
        <section className="space-y-4">
          <form onSubmit={onCreateVideo} className="grid gap-3 rounded-2xl border-2 border-black bg-white p-4 sm:grid-cols-2">
            <input name="title" required placeholder={t("videoTitle")} className="rounded-xl border border-black/20 px-3 py-2" />
            <input name="url" type="url" required placeholder={t("videoUrl")} className="rounded-xl border border-black/20 px-3 py-2" />
            <input name="course_id" placeholder={t("courseIdOptional")} className="rounded-xl border border-black/20 px-3 py-2 sm:col-span-2" />
            <textarea name="description" placeholder={t("videoDescription")} className="rounded-xl border border-black/20 px-3 py-2 sm:col-span-2" rows={2} />
            <button type="submit" disabled={busy} className="rounded-full bg-black px-4 py-2 text-sm font-semibold text-white sm:col-span-2 disabled:opacity-60">
              {t("addVideo")}
            </button>
          </form>
          <ul className="space-y-2">
            {videos.map((video) => (
              <li key={video.$id} className="flex items-start justify-between gap-3 rounded-2xl border-2 border-black bg-white p-4">
                <div>
                  <p className="font-semibold">{video.title}</p>
                  <a href={video.url} target="_blank" rel="noreferrer" className="break-all text-sm text-[#0016BD] underline">
                    {video.url}
                  </a>
                </div>
                <button
                  type="button"
                  className="text-sm font-semibold text-[#8a1010]"
                  onClick={async () => {
                    await deleteVideo(video.$id);
                    await refresh();
                  }}
                >
                  {t("delete")}
                </button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {tab === "content" ? (
        <section className="space-y-4">
          <form onSubmit={onCreateContent} className="grid gap-3 rounded-2xl border-2 border-black bg-white p-4">
            <input name="title" required placeholder={t("contentTitle")} className="rounded-xl border border-black/20 px-3 py-2" />
            <select name="type" className="rounded-xl border border-black/20 px-3 py-2" defaultValue="article">
              {(["article", "worksheet", "notice", "resource"] as const).map((type) => (
                <option key={type} value={type}>{t(`types.${type}`)}</option>
              ))}
            </select>
            <textarea name="body" placeholder={t("contentBody")} className="rounded-xl border border-black/20 px-3 py-2" rows={4} />
            <button type="submit" disabled={busy} className="rounded-full bg-black px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
              {t("addContent")}
            </button>
          </form>
          <ul className="space-y-2">
            {content.map((item) => (
              <li key={item.$id} className="flex items-start justify-between gap-3 rounded-2xl border-2 border-black bg-white p-4">
                <div>
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-sm text-black/60">{item.type} · {item.status}</p>
                  {item.body ? <p className="mt-1 text-sm text-black/70">{item.body}</p> : null}
                </div>
                <button
                  type="button"
                  className="text-sm font-semibold text-[#8a1010]"
                  onClick={async () => {
                    await deleteContent(item.$id);
                    await refresh();
                  }}
                >
                  {t("delete")}
                </button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
