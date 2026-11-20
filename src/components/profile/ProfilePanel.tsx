"use client";

import { FormEvent, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import Avatar from "@/components/Avatar";
import { updateProfileName } from "@/lib/auth";

export default function ProfilePanel() {
  const t = useTranslations("Profile");
  const tAuth = useTranslations("Auth");
  const { user, profile, loading, refresh, setProfile } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    setName(profile?.display_name || user?.name || "");
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
      await refresh();
      setMessage(t("saved"));
    } catch (err) {
      setError(err instanceof Error ? err.message : t("saveFailed"));
    } finally {
      setSaving(false);
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
        <Avatar name={profile.display_name || user.name} role={profile.role} size="lg" />
        <div>
          <p className="text-xl font-bold text-[#000A5E]">{profile.display_name}</p>
          <p className="text-sm text-[#000A5E]/70">{profile.email}</p>
          <p className="mt-1 inline-flex rounded-full bg-[#0016BD]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#0016BD]">
            {tAuth(`roles.${profile.role}` as "roles.learner")}
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
