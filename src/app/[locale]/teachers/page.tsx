import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import PlatformShell from "@/components/platform/PlatformShell";

const sampleTeachers = [
  {
    id: "amina",
    name: "Ms. Amina",
    focus: "dyslexia · A1–B1",
    languages: "Arabic · English",
  },
  {
    id: "karim",
    name: "Mr. Karim",
    focus: "deaf education · captions",
    languages: "French · English",
  },
  {
    id: "sara",
    name: "Ms. Sara",
    focus: "autism support · short sessions",
    languages: "English",
  },
];

async function TeachersContent({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const t = await getTranslations("Teachers");
  const { q } = await searchParams;
  const query = q || "";
  const normalized = query.toLowerCase();

  const teachers = sampleTeachers.filter((teacher) => {
    if (!normalized) return true;
    return `${teacher.name} ${teacher.focus} ${teacher.languages}`
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
      <ul className="grid gap-4">
        {teachers.map((teacher) => (
          <li
            key={teacher.id}
            className="rounded-2xl border border-[#0016BD]/15 bg-white p-5"
          >
            <h2 className="text-xl font-bold text-[#000A5E]">{teacher.name}</h2>
            <p className="mt-1 text-sm text-[#000A5E]/75">{teacher.focus}</p>
            <p className="mt-1 text-sm text-[#000A5E]/60">{teacher.languages}</p>
            <Link
              href={`/teachers/${teacher.id}`}
              className="mt-4 inline-flex rounded-full bg-[#ffc933] px-4 py-2 text-sm font-semibold text-[#0b0b1a]"
            >
              {t("viewProfile")}
            </Link>
          </li>
        ))}
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
