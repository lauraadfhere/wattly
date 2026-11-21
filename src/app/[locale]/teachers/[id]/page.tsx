import Image from "next/image";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import PlatformShell from "@/components/platform/PlatformShell";
import { getTeacherById, teacherIds } from "@/lib/teachers";

export function generateStaticParams() {
  return teacherIds.map((id) => ({ id }));
}

async function TeacherProfileContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const teacher = getTeacherById(id);
  if (!teacher) notFound();

  const t = await getTranslations("Teachers");
  const locale = await getLocale();
  const isAr = locale === "ar";
  const name = isAr ? teacher.nameAr : teacher.nameEn;
  const focus = isAr ? teacher.focusAr : teacher.focus;
  const languages = isAr ? teacher.languagesAr : teacher.languages;
  const bio = isAr ? teacher.bioAr : teacher.bioEn;

  return (
    <PlatformShell title={t("profileTitle")}>
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
        <Image
          src={teacher.image}
          alt={name}
          width={160}
          height={160}
          className="h-40 w-40 rounded-2xl object-cover"
          priority
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-2xl font-bold text-[#000A5E]">{name}</h2>
            {teacher.verified ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#e8f5e9] px-2.5 py-0.5 text-xs font-semibold text-[#1b5e20]">
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
                  <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.7 5.3L7.2 10.8 4.3 7.9l1.1-1.1 1.8 1.8 3.4-3.4 1.1 1.1z" />
                </svg>
                {t("verified")}
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-base text-[#000A5E]/55" dir={isAr ? "ltr" : "rtl"}>
            {isAr ? teacher.nameEn : teacher.nameAr}
          </p>
          <p className="mt-3 text-sm text-[#000A5E]/75">{focus}</p>
          <p className="mt-1 text-sm text-[#000A5E]/60">{languages}</p>
          <p className="mt-3 text-sm font-semibold text-[#0016BD]">
            {t("budgetRate", { rate: teacher.rateUsd })}
          </p>
        </div>
      </div>

      <div className="mt-8 max-w-2xl">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-[#0016BD]/70">
          {t("bio")}
        </h3>
        <p className="mt-2 text-base leading-7 text-[#000A5E]/80">{bio}</p>
      </div>

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
