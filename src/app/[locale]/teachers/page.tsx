import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import PlatformShell from "@/components/platform/PlatformShell";
import TeachersSearchStudio from "@/components/teachers/TeachersSearchStudio";

async function TeachersContent({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const t = await getTranslations("Teachers");
  const { q } = await searchParams;

  return (
    <PlatformShell title={t("title")} gate="auth">
      <TeachersSearchStudio initialQuery={q || ""} />
    </PlatformShell>
  );
}

type TeachersPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default function TeachersPage({ searchParams }: TeachersPageProps) {
  return (
    <Suspense
      fallback={
        <PlatformShell title="…">
          <div className="h-40 animate-pulse rounded-2xl bg-black/5" />
        </PlatformShell>
      }
    >
      <TeachersContent searchParams={searchParams} />
    </Suspense>
  );
}
