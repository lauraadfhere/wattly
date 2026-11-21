import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import PlatformShell from "@/components/platform/PlatformShell";

export default async function PracticePage() {
  const t = await getTranslations("Practice");

  const activities = [
    { href: "/practice/vocabulary", title: t("vocabulary"), body: t("vocabularyBody") },
    { href: "/practice/listening", title: t("listening"), body: t("listeningBody") },
    { href: "/practice/conversation", title: t("conversation"), body: t("conversationBody") },
    { href: "/practice/pronunciation", title: t("pronunciation"), body: t("pronunciationBody") },
  ] as const;

  return (
    <PlatformShell title={t("title")} gate="auth">
      <p className="mb-8 max-w-2xl text-base text-[#000A5E]/75">{t("intro")}</p>
      <div className="grid gap-4 sm:grid-cols-2">
        {activities.map((activity) => (
          <Link
            key={activity.href}
            href={activity.href}
            className="rounded-2xl border border-[#0016BD]/15 bg-white p-5"
          >
            <h2 className="text-xl font-bold text-[#000A5E]">{activity.title}</h2>
            <p className="mt-2 text-sm leading-6 text-[#000A5E]/70">
              {activity.body}
            </p>
          </Link>
        ))}
      </div>
    </PlatformShell>
  );
}
