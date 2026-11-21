"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import Avatar from "@/components/Avatar";
import { updateProfileAvatar, updateProfileName } from "@/lib/auth";
import { uploadAvatarImage } from "@/lib/cloudinary";
import {
  ENGLISH_LEVELS,
  TIMEZONES,
  loadProfilePrefs,
  saveProfilePrefs,
  type EnglishLevel,
} from "@/lib/profile-prefs";

export default function ProfilePanel() {
  const t = useTranslations("Profile");
  const tAuth = useTranslations("Auth");
  const { user, profile, loading, refresh, setProfile } = useAuth();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [level, setLevel] = useState<EnglishLevel>("A1");
  const [timezone, setTimezone] = useState("UTC");
  const [preview, setPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    setName(profile?.display_name || user?.name || "");
    setPreview(profile?.avatar_url || null);
    const prefs = loadProfilePrefs(profile?.user_id || user?.$id);
    setLevel(prefs.level);
    setTimezone(prefs.timezone);
  }, [profile, user]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!profile) return;
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const updated = await updateProfileName(profile.$id, name.trim());
      setProfile(updated);
      saveProfilePrefs(
        { level, timezone },
        profile.user_id || user?.$id,
      );
      await refresh();
      setMessage(t("saved"));
    } catch (err) {
      setError(err instanceof Error ? err.message : t("saveFailed"));
    } finally {
      setSaving(false);
    }
  }

  async function onAvatarChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file || !profile || !user) return;

    if (!file.type.startsWith("image/")) {
      setError(t("avatarInvalid"));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError(t("avatarTooLarge"));
      return;
    }

    setUploading(true);
    setError(null);
    setMessage(null);
    try {
      const localPreview = URL.createObjectURL(file);
      setPreview(localPreview);

      const url = await uploadAvatarImage(file, profile.user_id);
      const updated = await updateProfileAvatar(profile.$id, url);
      setProfile(updated);
      setPreview(url);
      await refresh();
      setMessage(t("avatarSaved"));
      URL.revokeObjectURL(localPreview);
    } catch (err) {
      setPreview(profile.avatar_url || null);
      setError(err instanceof Error ? err.message : t("avatarFailed"));
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-20 w-20 animate-pulse rounded-full bg-[#0016BD]/10" />
        <div className="h-10 w-full max-w-md animate-pulse rounded-xl bg-[#0016BD]/10" />
      </div>
    );
  }

  if (!user || !profile) {
    return <p className="text-[#000A5E]/70">{t("needLogin")}</p>;
  }

  return (
    <div className="mx-auto w-full max-w-xl space-y-6">
      <div className="flex items-center gap-4 rounded-2xl border border-[#0016BD]/15 bg-white p-5">
        <div className="relative">
          <Avatar
            name={profile.display_name || user.name}
            role={profile.role}
            size="lg"
            src={preview}
          />
          <button
            type="button"
            disabled={uploading}
            onClick={() => fileRef.current?.click()}
            className="absolute -bottom-1 -end-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#0016BD] text-white shadow disabled:opacity-60"
            aria-label={t("changeAvatar")}
            title={t("changeAvatar")}
          >
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M12 5v14M5 12h14" strokeLinecap="round" />
            </svg>
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            className="sr-only"
            onChange={onAvatarChange}
          />
        </div>
        <div>
          <p className="text-xl font-bold text-[#000A5E]">{profile.display_name}</p>
          <p className="text-sm text-[#000A5E]/70">{profile.email}</p>
          <p className="mt-1 inline-flex rounded-full bg-[#0016BD]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#0016BD]">
            {tAuth(`roles.${profile.role}` as "roles.learner")}
          </p>
          <p className="mt-2 text-xs text-black/50">
            {uploading ? t("avatarUploading") : t("avatarHint")}
          </p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-[#0016BD]/15 bg-white p-5">
        <div>
          <label htmlFor="display_name" className="mb-1 block text-sm font-medium">
            {t("displayName")}
          </label>
          <input
            id="display_name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            className="w-full rounded-xl border border-[#0016BD]/20 px-4 py-3"
          />
        </div>

        <div>
          <p className="mb-1 text-sm font-medium">{t("email")}</p>
          <p className="rounded-xl bg-[#f5f7ff] px-4 py-3 text-sm text-[#000A5E]/80">
            {profile.email}
          </p>
        </div>

        <div>
          <p className="mb-1 text-sm font-medium">{t("role")}</p>
          <p className="rounded-xl bg-[#f5f7ff] px-4 py-3 text-sm text-[#000A5E]/80">
            {tAuth(`roles.${profile.role}` as "roles.learner")}
          </p>
        </div>

        <div>
          <label htmlFor="english_level" className="mb-1 block text-sm font-medium">
            {t("level")}
          </label>
          <select
            id="english_level"
            value={level}
            onChange={(e) => setLevel(e.target.value as EnglishLevel)}
            className="w-full rounded-xl border border-[#0016BD]/20 px-4 py-3"
          >
            {ENGLISH_LEVELS.map((lv) => (
              <option key={lv} value={lv}>
                {lv}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-black/50">{t("levelHint")}</p>
        </div>

        <div>
          <label htmlFor="timezone" className="mb-1 block text-sm font-medium">
            {t("timezone")}
          </label>
          <select
            id="timezone"
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="w-full rounded-xl border border-[#0016BD]/20 px-4 py-3"
          >
            {TIMEZONES.map((tz) => (
              <option key={tz} value={tz}>
                {tz}
              </option>
            ))}
            {!TIMEZONES.includes(timezone as (typeof TIMEZONES)[number]) ? (
              <option value={timezone}>{timezone}</option>
            ) : null}
          </select>
          <p className="mt-1 text-xs text-black/50">{t("timezoneHint")}</p>
        </div>

        {message ? (
          <p className="rounded-xl bg-[#0016BD]/10 px-4 py-3 text-sm text-[#0016BD]">
            {message}
          </p>
        ) : null}
        {error ? (
          <p role="alert" className="rounded-xl bg-[#ff5c5c]/15 px-4 py-3 text-sm text-[#8a1010]">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-[#0016BD] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          {saving ? t("saving") : t("save")}
        </button>
      </form>
    </div>
  );
}
