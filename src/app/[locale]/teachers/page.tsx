import Image from "next/image";
import { Suspense } from "react";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import PlatformShell from "@/components/platform/PlatformShell";
import { demoTeachers } from "@/lib/teachers";

async function TeachersContent({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const t = await getTranslations("Teachers");
  const locale = await getLocale();
  const isAr = locale === "ar";
  const { q } = await searchParams;
  const query = q || "";
  const normalized = query.toLowerCase();

  const teachers = demoTeachers.filter((teacher) => {
    if (!normalized) return true;
    return `${teacher.nameEn} ${teacher.nameAr} ${teacher.focus} ${teacher.focusAr} ${teacher.languages}`
      .toLowerCase()
      .includes(normalized);
  });

  return (
    <PlatformShell title={t("title")}>
      <p className="mb-6 max-w-2xl text-base text-[#000A5E]/75">{t("intro")}</p>
      {query ? (
        <p className="mb-4 text-sm text-[#000A5E]/70">
          {t("resultsFor", { query })}
        </p>
      ) : null}
      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {teachers.map((teacher) => {
          const name = isAr ? teacher.nameAr : teacher.nameEn;
          const focus = isAr ? teacher.focusAr : teacher.focus;
          const languages = isAr ? teacher.languagesAr : teacher.languages;

          return (
            <li
              key={teacher.id}
              className="flex flex-col rounded-2xl border border-[#0016BD]/15 bg-white p-5"
            >
              <div className="flex items-start gap-4">
                <Image
                  src={teacher.image}
                  alt={name}
                  width={72}
                  height={72}
                  className="h-[72px] w-[72px] shrink-0 rounded-full object-cover"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-bold text-[#000A5E]">{name}</h2>
                    {teacher.verified ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#e8f5e9] px-2 py-0.5 text-[11px] font-semibold text-[#1b5e20]">
                        <svg viewBox="0 0 16 16" className="h-3 w-3" fill="currentColor" aria-hidden="true">
                          <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.7 5.3L7.2 10.8 4.3 7.9l1.1-1.1 1.8 1.8 3.4-3.4 1.1 1.1z" />
                        </svg>
                        {t("verified")}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-0.5 text-sm text-[#000A5E]/55" dir={isAr ? "ltr" : "rtl"}>
                    {isAr ? teacher.nameEn : teacher.nameAr}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-sm text-[#000A5E]/75">{focus}</p>
              <p className="mt-1 text-sm text-[#000A5E]/60">{languages}</p>
              <p className="mt-3 text-sm font-semibold text-[#0016BD]">
                {t("budgetRate", { rate: teacher.rateUsd })}
              </p>
              <Link
                href={`/teachers/${teacher.id}`}
                className="mt-4 inline-flex w-fit rounded-full bg-[#ffc933] px-4 py-2 text-sm font-semibold text-[#0b0b1a]"
              >
                {t("viewBio")}
              </Link>
            </li>
          );
        })}
      </ul>
    </PlatformShell>
  );
}

type TeachersPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default function TeachersPage({ searchParams }: TeachersPageProps) {
  return (
    <Suspense fallback={<div className="p-10">…</div>}>
      <TeachersContent searchParams={searchParams} />
    </Suspense>
  );
}
