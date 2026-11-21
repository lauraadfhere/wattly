import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

type LoginAccessHubProps = {
  nextPath?: string | null;
};

function withNext(href: string, nextPath?: string | null) {
  if (!nextPath || !nextPath.startsWith("/") || nextPath.startsWith("//")) {
    return href;
  }
  return `${href}?next=${encodeURIComponent(nextPath)}`;
}

export default async function LoginAccessHub({ nextPath }: LoginAccessHubProps) {
  const t = await getTranslations("LoginHub");

  return (
    <div className="text-black">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0016BD]">
        {t("eyebrow")}
      </p>
      <h2 className="mt-3 max-w-[22ch] text-2xl font-semibold tracking-tight sm:text-3xl">
        {t("title")}
      </h2>
      <p className="mt-3 max-w-[46ch] text-sm leading-6 text-black/65 sm:text-base">
        {t("body")}
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link
          href={withNext("/student/login", nextPath)}
          className="group flex min-h-[180px] flex-col border-2 border-[#38bdf8] bg-[#f4f4f5] p-5 transition hover:-translate-y-0.5 hover:bg-white"
        >
          <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#38bdf8] text-black">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path
                d="M22 10v6M2 10l10-5 10 5-10 5-10-5zM6 12v5c0 1 2 3 6 3s6-2 6-3v-5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <h3 className="text-lg font-bold">{t("studentTitle")}</h3>
          <p className="mt-2 flex-1 text-sm leading-6 text-black/65">{t("studentBody")}</p>
          <span className="mt-4 text-sm font-semibold text-[#0016BD] underline underline-offset-4">
            {t("studentCta")}
          </span>
        </Link>

        <Link
          href={withNext("/teacher/login", nextPath)}
          className="group flex min-h-[180px] flex-col border-2 border-[#ffc933] bg-[#f4f4f5] p-5 transition hover:-translate-y-0.5 hover:bg-white"
        >
          <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#ffc933] text-black">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path
                d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5A2.5 2.5 0 0 0 6.5 22H20V2H6.5A2.5 2.5 0 0 0 4 4.5v15z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <h3 className="text-lg font-bold">{t("teacherTitle")}</h3>
          <p className="mt-2 flex-1 text-sm leading-6 text-black/65">{t("teacherBody")}</p>
          <span className="mt-4 text-sm font-semibold text-[#8a6a00] underline underline-offset-4">
            {t("teacherCta")}
          </span>
        </Link>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-5 border-t border-black/10 pt-5">
        <Link
          href={withNext("/parent/login", nextPath)}
          className="inline-flex items-center gap-2 text-xs font-semibold text-black/70 hover:text-black"
        >
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#000A5E] text-white">
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
              <path
                d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
                strokeLinecap="round"
              />
            </svg>
          </span>
          {t("parentAccess")}
        </Link>
        <Link
          href={withNext("/admin/login", nextPath)}
          className="inline-flex items-center gap-2 text-xs font-semibold text-black/70 hover:text-black"
        >
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-black text-[#ffc933]">
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 3l8 4v5c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V7l8-4z" />
              <path d="M9.5 12l1.8 1.8L15 10" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          {t("adminAccess")}
        </Link>
      </div>
    </div>
  );
}
