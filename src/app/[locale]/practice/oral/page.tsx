import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import PlatformShell from "@/components/platform/PlatformShell";

export default async function OralPracticePage() {
  const t = await getTranslations("OralPractice");

  const drills = [
    { key: "warmup", href: "/practice/pronunciation" as const },
    { key: "dialogue", href: "/practice/conversation" as const },
    { key: "shadow", href: "/practice/listening" as const },
  ];

  return (
    <PlatformShell title={t("title")} intro={t("intro")} gate="none">
      <div className="grid gap-4 sm:grid-cols-3">
        {drills.map((drill) => (
          <Link
            key={drill.key}
            href={drill.href}
            className="flex min-h-[160px] flex-col border-2 border-black bg-white p-5 transition hover:-translate-y-0.5"
          >
            <h2 className="text-lg font-bold text-black">{t(`cards.${drill.key}.title`)}</h2>
            <p className="mt-2 flex-1 text-sm leading-6 text-black/65">
              {t(`cards.${drill.key}.body`)}
            </p>
            <span className="mt-4 text-sm font-semibold text-[#0016BD] underline underline-offset-4">
              {t("open")}
            </span>
          </Link>
        ))}
      </div>
      <p className="mt-8 text-sm text-black/60">
        <Link href="/dashboard" className="font-semibold text-[#0016BD] underline underline-offset-4">
          {t("backDashboard")}
        </Link>
      </p>
    </PlatformShell>
  );
}
