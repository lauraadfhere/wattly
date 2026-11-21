import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

const cards = [
  {
    key: "learners" as const,
    href: "/courses" as const,
    accent: "#22c55e",
    icon: (
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5A2.5 2.5 0 0 0 6.5 22H20V2H6.5A2.5 2.5 0 0 0 4 4.5v15z" />
    ),
  },
  {
    key: "schools" as const,
    href: "/courses" as const,
    accent: "#38bdf8",
    icon: (
      <path d="M22 10v6M2 10l10-5 10 5-10 5-10-5zM6 12v5c0 1 2 3 6 3s6-2 6-3v-5" />
    ),
  },
  {
    key: "teams" as const,
    href: "/contact" as const,
    accent: "#ffc933",
    icon: (
      <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16M8 20h8M4 20h16M12 6h.01M12 10h.01M12 14h.01" />
    ),
  },
  {
    key: "centers" as const,
    href: "/contact" as const,
    accent: "#f97316",
    icon: (
      <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6" />
    ),
  },
];

export default async function CoursesShowcase() {
  const t = await getTranslations("CoursesShowcase");

  return (
    <section className="relative overflow-hidden bg-[#1a1a1a] text-white">
      {/* Screenshot-style geometric forms (low-contrast arts) */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="wattly-dark-forms"
            width="280"
            height="120"
            patternUnits="userSpaceOnUse"
          >
            {/* Parallel bars */}
            <rect x="18" y="42" width="36" height="8" fill="#2f2f2f" />
            <rect x="18" y="58" width="36" height="8" fill="#2f2f2f" />
            {/* Offset squares */}
            <rect x="78" y="52" width="16" height="16" fill="#333333" />
            <rect x="92" y="38" width="16" height="16" fill="#333333" />
            {/* Striped square */}
            <g transform="translate(130 36)">
              <rect width="36" height="36" fill="#2a2a2a" />
              <path
                d="M0 28 L28 0 M0 36 L36 0 M8 36 L36 8 M20 36 L36 20"
                stroke="#3a3a3a"
                strokeWidth="5"
              />
            </g>
            {/* Right triangle */}
            <path d="M190 72 L226 72 L226 36 Z" fill="#2f2f2f" />
            {/* Circle in square */}
            <rect x="246" y="38" width="28" height="28" fill="#2a2a2a" />
            <circle cx="274" cy="52" r="14" fill="#1a1a1a" />
            <circle cx="274" cy="52" r="14" fill="none" stroke="#333" strokeWidth="3" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#wattly-dark-forms)" />
      </svg>

      <div className="relative mx-auto w-full max-w-6xl px-6 py-14 sm:px-10 sm:py-16 lg:px-16 lg:py-20">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#ffc933]">
            {t("eyebrow")}
          </p>
          <h2 className="mt-4 text-[clamp(1.65rem,3.6vw,2.5rem)] font-extrabold leading-tight tracking-[-0.02em]">
            {t("title")}
          </h2>
          <p className="mt-4 max-w-[46ch] text-base leading-7 text-white/75">
            {t("body")}{" "}
            <Link href="/courses" className="font-semibold text-white underline underline-offset-4">
              {t("learnMore")}
            </Link>
          </p>
        </div>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => (
            <li key={card.key}>
              <Link
                href={card.href}
                className="group relative flex h-full min-h-[220px] flex-col border bg-[#121212] p-5 transition hover:-translate-y-0.5"
                style={{ borderColor: card.accent, borderRadius: 0 }}
              >
                <span
                  className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-full"
                  style={{ backgroundColor: card.accent }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5 text-black"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    {card.icon}
                  </svg>
                </span>
                <h3 className="text-lg font-bold tracking-tight">{t(`cards.${card.key}.title`)}</h3>
                <p className="mt-2 flex-1 text-sm leading-6 text-white/70">
                  {t(`cards.${card.key}.body`)}
                </p>
                <span
                  className="mt-4 text-sm font-semibold underline underline-offset-4"
                  style={{ color: card.accent }}
                >
                  {t(`cards.${card.key}.link`)}
                </span>
                <span
                  className="absolute bottom-4 end-4 inline-flex h-7 w-7 items-center justify-center rounded-full transition group-hover:translate-x-0.5"
                  style={{ backgroundColor: card.accent }}
                  aria-hidden="true"
                >
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-black" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
