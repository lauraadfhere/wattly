import type { LessonArt } from "@/lib/lessons/types";

const paths: Record<LessonArt, React.ReactNode> = {
  abc: (
    <>
      <rect x="4" y="6" width="8" height="8" fill="currentColor" opacity="0.9" />
      <rect x="14" y="10" width="6" height="6" fill="currentColor" opacity="0.55" />
    </>
  ),
  colors: (
    <>
      <circle cx="8" cy="10" r="5" fill="currentColor" opacity="0.85" />
      <rect x="12" y="7" width="8" height="8" fill="currentColor" opacity="0.45" />
    </>
  ),
  animals: (
    <>
      <circle cx="10" cy="11" r="6" fill="currentColor" opacity="0.8" />
      <circle cx="7" cy="7" r="2" fill="currentColor" opacity="0.5" />
      <circle cx="13" cy="7" r="2" fill="currentColor" opacity="0.5" />
    </>
  ),
  nouns: (
    <>
      <path d="M4 18 L12 4 L20 18 Z" fill="currentColor" opacity="0.75" />
    </>
  ),
  family: (
    <>
      <circle cx="8" cy="8" r="3.5" fill="currentColor" opacity="0.85" />
      <circle cx="16" cy="9" r="3" fill="currentColor" opacity="0.55" />
      <rect x="5" y="13" width="14" height="6" rx="1" fill="currentColor" opacity="0.4" />
    </>
  ),
  verbs: (
    <>
      <path d="M5 17 L12 5 L19 17" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="12" cy="17" r="2" fill="currentColor" />
    </>
  ),
  balloon: (
    <>
      <ellipse cx="12" cy="9" rx="6" ry="7" fill="currentColor" opacity="0.85" />
      <path d="M12 16 L12 21" stroke="currentColor" strokeWidth="1.5" />
    </>
  ),
  adjectives: (
    <>
      <rect x="4" y="8" width="7" height="7" fill="currentColor" opacity="0.85" />
      <rect x="13" y="5" width="7" height="13" fill="currentColor" opacity="0.4" />
    </>
  ),
  food: (
    <>
      <circle cx="12" cy="12" r="7" fill="currentColor" opacity="0.35" />
      <circle cx="12" cy="12" r="3.5" fill="currentColor" opacity="0.9" />
    </>
  ),
  garden: (
    <>
      <path d="M12 20 V10" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="8" r="5" fill="currentColor" opacity="0.75" />
      <circle cx="7" cy="11" r="3" fill="currentColor" opacity="0.4" />
      <circle cx="17" cy="11" r="3" fill="currentColor" opacity="0.4" />
    </>
  ),
  debate: (
    <>
      <rect x="3" y="6" width="8" height="12" fill="currentColor" opacity="0.8" />
      <rect x="13" y="6" width="8" height="12" fill="currentColor" opacity="0.4" />
    </>
  ),
  idioms: (
    <>
      <path d="M6 18 C6 10 18 10 18 18" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="9" cy="9" r="2" fill="currentColor" />
      <circle cx="15" cy="9" r="2" fill="currentColor" />
    </>
  ),
  writing: (
    <>
      <path d="M5 5 H19 M5 10 H16 M5 15 H18 M5 20 H12" stroke="currentColor" strokeWidth="2" />
    </>
  ),
  listening: (
    <>
      <circle cx="8" cy="12" r="3" fill="currentColor" />
      <path d="M12 7 C16 9 16 15 12 17" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M15 4 C21 8 21 16 15 20" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.5" />
    </>
  ),
};

export default function LessonArtMark({
  art,
  className = "h-10 w-10",
}: {
  art: LessonArt;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      {paths[art]}
    </svg>
  );
}
