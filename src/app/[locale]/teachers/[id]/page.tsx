import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import PlatformShell from "@/components/platform/PlatformShell";

const teacherIds = ["amina", "karim", "sara"] as const;

export function generateStaticParams() {
  return teacherIds.map((id) => ({ id }));
}

async function TeacherProfileContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const t = await getTranslations("Teachers");

  return (
    <PlatformShell title={t("profileTitle")}>
      <p className="mb-4 text-sm uppercase tracking-wide text-[#0016BD]/70">
        {id}
      </p>
      <p className="max-w-2xl text-base leading-7 text-[#000A5E]/75">
        {t("profileBody")}
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/dashboard"
          className="rounded-full bg-[#0016BD] px-5 py-3 text-sm font-semibold text-white"
        >
          {t("bookTrial")}
        </Link>
        <Link
          href="/teachers"
          className="rounded-full border border-[#0016BD]/25 px-5 py-3 text-sm font-semibold text-[#0016BD]"
        >
          {t("back")}
        </Link>
      </div>
    </PlatformShell>
  );
}

type TeacherProfilePageProps = {
  params: Promise<{ id: string }>;
};

export default function TeacherProfilePage({
  params,
}: TeacherProfilePageProps) {
  return (
    <Suspense fallback={<div className="p-10">…</div>}>
      <TeacherProfileContent params={params} />
    </Suspense>
  );
}
