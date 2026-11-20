"use client";

import { FormEvent, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { getCurrentProfile, markOnboardingDone } from "@/lib/auth";
import { createBrowserClient } from "@/lib/appwrite/client";
import { appwriteConfig } from "@/lib/appwrite/config";
import { ID, Permission, Role } from "appwrite";

const supportOptions = [
  "captions",
  "text_to_speech",
  "dyslexia_mode",
  "reduce_motion",
  "speak_optional",
  "symbols_with_text",
] as const;

export default function OnboardingForm() {
  const t = useTranslations("Onboarding");
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(event.currentTarget);
    const goals = String(form.get("goals") || "").trim();
    const level = String(form.get("level") || "A1");
    const interests = String(form.get("interests") || "").trim();
    const selectedSupports = supportOptions.filter((key) => form.get(key) === "on");

    try {
      const profile = await getCurrentProfile();
      if (!profile) {
        router.push("/login");
        return;
      }

      const { tablesDB } = createBrowserClient();
      const ownerPermissions = [
        Permission.read(Role.user(profile.user_id)),
        Permission.update(Role.user(profile.user_id)),
        Permission.delete(Role.user(profile.user_id)),
      ];

      await tablesDB.createRow({
        databaseId: appwriteConfig.databaseId,
        tableId: appwriteConfig.tables.learnerProfiles,
        rowId: ID.unique(),
        data: {
          user_id: profile.user_id,
          goals,
          level,
          interests,
          guardian_required: false,
        },
        permissions: ownerPermissions,
      });

      for (const key of selectedSupports) {
        await tablesDB.createRow({
          databaseId: appwriteConfig.databaseId,
          tableId: appwriteConfig.tables.supportSettings,
          rowId: ID.unique(),
          data: {
            learner_id: profile.user_id,
            key,
            value: "true",
            share_with_teacher: true,
          },
          permissions: ownerPermissions,
        });
      }

      await markOnboardingDone(profile.$id);
      router.push("/dashboard");
    } catch (err) {
      const message = err instanceof Error ? err.message : t("failed");
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto w-full max-w-2xl space-y-6">
      <p className="text-base leading-7 text-[#000A5E]/80">{t("intro")}</p>

      <div>
        <label htmlFor="goals" className="mb-1 block text-sm font-medium">
          {t("goals")}
        </label>
        <textarea
          id="goals"
          name="goals"
          rows={3}
          required
          className="w-full rounded-xl border border-[#0016BD]/20 bg-white px-4 py-3"
          placeholder={t("goalsPlaceholder")}
        />
      </div>

      <div>
        <label htmlFor="level" className="mb-1 block text-sm font-medium">
          {t("level")}
        </label>
        <select
          id="level"
          name="level"
          className="w-full rounded-xl border border-[#0016BD]/20 bg-white px-4 py-3"
          defaultValue="A1"
        >
          {["Pre-A1", "A1", "A2", "B1", "B2", "C1"].map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="interests" className="mb-1 block text-sm font-medium">
          {t("interests")}
        </label>
        <input
          id="interests"
          name="interests"
          className="w-full rounded-xl border border-[#0016BD]/20 bg-white px-4 py-3"
          placeholder={t("interestsPlaceholder")}
        />
      </div>

      <fieldset>
        <legend className="mb-2 text-sm font-medium">{t("supports")}</legend>
        <p className="mb-3 text-sm text-[#000A5E]/70">{t("supportsHint")}</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {supportOptions.map((key) => (
            <label
              key={key}
              className="flex items-center gap-2 rounded-xl border border-[#0016BD]/20 bg-white px-3 py-3 text-sm"
            >
              <input type="checkbox" name={key} />
              {t(`supportOptions.${key}`)}
            </label>
          ))}
        </div>
      </fieldset>

      {error ? (
        <p role="alert" className="rounded-xl bg-[#ff5c5c]/15 px-4 py-3 text-sm text-[#8a1010]">
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-[#0016BD] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          {loading ? t("saving") : t("continue")}
        </button>
        <button
          type="button"
          className="rounded-full border border-[#0016BD]/25 px-5 py-3 text-sm font-semibold text-[#0016BD]"
          onClick={async () => {
            const profile = await getCurrentProfile();
            if (profile) await markOnboardingDone(profile.$id);
            router.push("/dashboard");
          }}
        >
          {t("skip")}
        </button>
      </div>
    </form>
  );
}
