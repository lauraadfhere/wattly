"use client";

import Image from "next/image";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { loadProfilePrefs } from "@/lib/profile-prefs";
import {
  rankTeachers,
  TEACHER_SPECIALTIES,
  type RankedTeacher,
} from "@/lib/teacher-search";
import { recordTeacherTrace } from "@/lib/teacher-traces";

type Props = {
  initialQuery?: string;
};

const REASON_LABEL: Record<string, string> = {
  text: "reasonText",
  language: "reasonLanguage",
  specialty: "reasonSpecialty",
  level: "reasonLevel",
  history: "reasonHistory",
  popular: "reasonPopular",
  rated: "reasonRated",
  verified: "reasonVerified",
};

export default function TeachersSearchStudio({ initialQuery = "" }: Props) {
  const t = useTranslations("Teachers");
  const locale = useLocale();
  const isAr = locale === "ar";
  const router = useRouter();
  const { user } = useAuth();

  const [query, setQuery] = useState(initialQuery);
  const [language, setLanguage] = useState("all");
  const [specialty, setSpecialty] = useState("all");
  const [maxRate, setMaxRate] = useState<number | "all">("all");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sort, setSort] = useState<"smart" | "rate" | "name">("smart");
  const [results, setResults] = useState<RankedTeacher[]>([]);

  const level = useMemo(
    () => loadProfilePrefs(user?.$id).level,
    [user?.$id],
  );

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    const ranked = rankTeachers(
      {
        query,
        language,
        specialty,
        maxRate: maxRate === "all" ? undefined : maxRate,
        verifiedOnly,
        sort,
      },
      { userId: user?.$id, level },
    );
    setResults(ranked);
  }, [query, language, specialty, maxRate, verifiedOnly, sort, user?.$id, level]);

  function onSearch(e: FormEvent) {
    e.preventDefault();
    const q = query.trim();
    recordTeacherTrace({
      kind: "search",
      query: q || undefined,
      userId: user?.$id,
    });
    const ranked = rankTeachers(
      {
        query: q,
        language,
        specialty,
        maxRate: maxRate === "all" ? undefined : maxRate,
        verifiedOnly,
        sort,
      },
      { userId: user?.$id, level },
    );
    for (const teacher of ranked.slice(0, 6)) {
      recordTeacherTrace({
        kind: "impression",
        teacherId: teacher.id,
        query: q || undefined,
        userId: user?.$id,
      });
    }
    router.replace(q ? `/teachers?q=${encodeURIComponent(q)}` : "/teachers");
  }

  function onOpenTeacher(teacher: RankedTeacher) {
    recordTeacherTrace({
      kind: "click",
      teacherId: teacher.id,
      query: query || undefined,
      userId: user?.$id,
    });
  }

  return (
    <div>
      <p className="mb-5 max-w-2xl text-base text-[#000A5E]/75">{t("introSmart")}</p>

      <form
        onSubmit={onSearch}
        className="rounded-2xl border border-[#0016BD]/15 bg-white p-4 shadow-sm sm:p-5"
      >
        <label className="block text-xs font-bold uppercase tracking-wide text-[#0016BD]/70">
          {t("smartSearch")}
          <div className="mt-2 flex flex-col gap-2 sm:flex-row">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="min-w-0 flex-1 rounded-xl border border-[#0016BD]/20 px-4 py-3 text-sm text-[#0b0b1a] outline-none focus:border-[#0016BD]"
            />
            <button
              type="submit"
              className="rounded-xl bg-[#0016BD] px-5 py-3 text-sm font-bold text-white"
            >
              {t("searchAction")}
            </button>
          </div>
        </label>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <label className="text-xs font-semibold text-black/55">
            {t("filterLanguage")}
            <select
              className="mt-1 w-full rounded-lg border border-black/15 px-2 py-2 text-sm"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="all">{t("all")}</option>
              <option value="arabic">{t("langArabic")}</option>
              <option value="english">{t("langEnglish")}</option>
              <option value="french">{t("langFrench")}</option>
            </select>
          </label>
          <label className="text-xs font-semibold text-black/55">
            {t("filterSpecialty")}
            <select
              className="mt-1 w-full rounded-lg border border-black/15 px-2 py-2 text-sm"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
            >
              {TEACHER_SPECIALTIES.map((s) => (
                <option key={s.id} value={s.id}>
                  {t(s.labelKey)}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs font-semibold text-black/55">
            {t("filterBudget")}
            <select
              className="mt-1 w-full rounded-lg border border-black/15 px-2 py-2 text-sm"
              value={maxRate === "all" ? "all" : String(maxRate)}
              onChange={(e) =>
                setMaxRate(e.target.value === "all" ? "all" : Number(e.target.value))
              }
            >
              <option value="all">{t("all")}</option>
              <option value="9">{t("underRate", { rate: 9 })}</option>
              <option value="11">{t("underRate", { rate: 11 })}</option>
              <option value="13">{t("underRate", { rate: 13 })}</option>
            </select>
          </label>
          <label className="text-xs font-semibold text-black/55">
            {t("filterSort")}
            <select
              className="mt-1 w-full rounded-lg border border-black/15 px-2 py-2 text-sm"
              value={sort}
              onChange={(e) => setSort(e.target.value as "smart" | "rate" | "name")}
            >
              <option value="smart">{t("sortSmart")}</option>
              <option value="rate">{t("sortRate")}</option>
              <option value="name">{t("sortName")}</option>
            </select>
          </label>
        </div>

        <label className="mt-3 inline-flex items-center gap-2 text-sm text-[#0b0b1a]">
          <input
            type="checkbox"
            checked={verifiedOnly}
            onChange={(e) => setVerifiedOnly(e.target.checked)}
            className="size-4 rounded border-black/30"
          />
          {t("verifiedOnly")}
        </label>

        <p className="mt-3 text-xs text-black/50">
          {t("algorithmHint", { level })}
        </p>
      </form>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-[#000A5E]/70">
          {query
            ? t("smartResultsFor", { query, count: results.length })
            : t("smartResults", { count: results.length })}
        </p>
        {sort === "smart" ? (
          <span className="rounded-full bg-[#eef1ff] px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-[#0016BD]">
            {t("rankedBadge")}
          </span>
        ) : null}
      </div>

      {!results.length ? (
        <p className="mt-6 rounded-xl border border-dashed border-black/20 px-4 py-8 text-center text-sm text-black/55">
          {t("noResults")}
        </p>
      ) : (
        <ul className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {results.map((teacher, index) => {
            const name = isAr ? teacher.nameAr : teacher.nameEn;
            const focus = isAr ? teacher.focusAr : teacher.focus;
            const languages = isAr ? teacher.languagesAr : teacher.languages;

            return (
              <li
                key={teacher.id}
                className="flex flex-col rounded-2xl border border-[#0016BD]/15 bg-white p-5"
              >
                <div className="mb-3 flex items-center justify-between gap-2">
                  <span className="rounded-full bg-[#0b0b1a] px-2 py-0.5 text-[10px] font-bold text-white">
                    #{index + 1}
                  </span>
                  <span className="text-xs font-semibold text-[#0016BD]">
                    {t("matchScore", { percent: teacher.matchPercent })}
                  </span>
                </div>

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
                          {t("verified")}
                        </span>
                      ) : null}
                    </div>
                    <p
                      className="mt-0.5 text-sm text-[#000A5E]/55"
                      dir={isAr ? "ltr" : "rtl"}
                    >
                      {isAr ? teacher.nameEn : teacher.nameAr}
                    </p>
                  </div>
                </div>

                <p className="mt-3 text-sm text-[#000A5E]/75">{focus}</p>
                <p className="mt-1 text-sm text-[#000A5E]/60">{languages}</p>
                <p className="mt-3 text-sm font-semibold text-[#0016BD]">
                  {t("budgetRate", { rate: teacher.rateUsd })}
                </p>

                {teacher.reasons.length ? (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {teacher.reasons.slice(0, 4).map((reason) => (
                      <span
                        key={reason}
                        className="rounded-full bg-[#f4f6ff] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#0016BD]"
                      >
                        {t(REASON_LABEL[reason] || "reasonText")}
                      </span>
                    ))}
                  </div>
                ) : null}

                <Link
                  href={`/teachers/${teacher.id}`}
                  onClick={() => onOpenTeacher(teacher)}
                  className="mt-4 inline-flex w-fit rounded-full bg-[#ffc933] px-4 py-2 text-sm font-semibold text-[#0b0b1a]"
                >
                  {t("viewBio")}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
