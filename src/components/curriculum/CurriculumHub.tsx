"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  curriculumByLevel,
  curriculumLevels,
  levelMeta,
  type CefrLevel,
} from "@/lib/curriculum";

export default function CurriculumHub() {
  const t = useTranslations("Curriculum");
  const [level, setLevel] = useState<CefrLevel>("A1");
  const [kind, setKind] = useState<"all" | "grammar" | "reading">("all");

  const packs = useMemo(() => curriculumByLevel(level), [level]);
  const meta = levelMeta[level];

  const grammar =
    kind === "reading" ? [] : packs.grammar;
  const reading =
    kind === "grammar" ? [] : packs.reading;

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border-2 border-black bg-white p-5">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0016BD]">
          {t("eyebrow")}
        </p>
        <h2 className="mt-1 text-2xl font-bold text-[#0b0b1a]">{t("title")}</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-black/65">{t("intro")}</p>
        <p className="mt-3 text-sm font-semibold text-[#0016BD]">
          {t("counts", { grammar: 50, reading: 50 })}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {curriculumLevels.map((lv) => (
          <button
            key={lv}
            type="button"
            onClick={() => setLevel(lv)}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              level === lv
                ? "bg-[#0016BD] text-white"
                : "border border-black/20 bg-white text-[#0b0b1a]"
            }`}
          >
            {lv} · {levelMeta[lv].label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {(["all", "grammar", "reading"] as const).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setKind(k)}
            className={`rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-wide ${
              kind === k
                ? "bg-[#0b0b1a] text-white"
                : "border border-black/15 text-black/60"
            }`}
          >
            {t(`filter.${k}`)}
          </button>
        ))}
      </div>

      {grammar.length ? (
        <section>
          <h3 className="mb-3 text-lg font-bold text-[#0b0b1a]">
            {t("grammarTitle", { level })}
          </h3>
          <ul className="grid gap-3 sm:grid-cols-2">
            {grammar.map((item) => (
              <li key={item.id}>
                <Link
                  href={`/courses/curriculum/${item.id}`}
                  className="block rounded-2xl border border-black/10 p-4 transition hover:border-[#0016BD]/40"
                  style={{ backgroundColor: meta.tint }}
                >
                  <p className="text-xs font-bold uppercase tracking-wide" style={{ color: meta.accent }}>
                    {t("grammarBadge")} · {item.durationMin} {t("min")}
                  </p>
                  <p className="mt-1 font-bold text-[#0b0b1a]">
                    {item.number}. {item.title}
                  </p>
                  <p className="mt-1 line-clamp-2 text-sm text-black/60">{item.goal}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {reading.length ? (
        <section>
          <h3 className="mb-3 text-lg font-bold text-[#0b0b1a]">
            {t("readingTitle", { level })}
          </h3>
          <ul className="grid gap-3 sm:grid-cols-2">
            {reading.map((item) => (
              <li key={item.id}>
                <Link
                  href={`/courses/curriculum/${item.id}`}
                  className="block rounded-2xl border border-black/10 bg-white p-4 transition hover:border-[#0016BD]/40"
                >
                  <p className="text-xs font-bold uppercase tracking-wide text-[#0016BD]">
                    {t("readingBadge")} · {item.durationMin} {t("min")}
                  </p>
                  <p className="mt-1 font-bold text-[#0b0b1a]">
                    {item.number}. {item.title}
                  </p>
                  <p className="mt-1 text-sm text-black/55">{item.subject}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
