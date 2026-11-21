import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { DEMO_COURSES } from "@/lib/courses-demo";
import { coverImageUrl, getCloudinaryCloudName } from "@/lib/cloudinary";

export default async function CoursesDemo() {
  const t = await getTranslations("Courses");
  const cloudName = getCloudinaryCloudName();

  return (
    <div className="space-y-8">
      <p className="max-w-2xl text-base leading-7 text-black/70">{t("intro")}</p>

      <ul className="grid gap-5 sm:grid-cols-2">
        {DEMO_COURSES.map((course) => {
          const coverSrc = coverImageUrl(course.coverPublicId, 900);
          return (
            <li
              key={course.id}
              className="overflow-hidden rounded-2xl border-2 border-black bg-white"
            >
              <div
                className="relative aspect-[16/9] overflow-hidden"
                style={{ backgroundColor: course.coverTint }}
              >
                <Image
                  src={coverSrc}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 40vw"
                  unoptimized
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-4 pb-3 pt-10">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#ffc933]">
                    {course.level}
                  </p>
                </div>
              </div>
              <div className="space-y-3 p-4">
                <h2 className="text-xl font-semibold tracking-tight text-black">
                  {t(`items.${course.titleKey}.title`)}
                </h2>
                <p className="text-sm leading-6 text-black/65">
                  {t(`items.${course.titleKey}.body`)}
                </p>
                <p className="text-xs text-black/40">
                  {t("mediaHint", { folder: `wattly/covers · ${cloudName}` })}
                </p>
              </div>
            </li>
          );
        })}
      </ul>

      <section className="rounded-2xl border-2 border-[#0016BD]/25 bg-[#f8f9ff] p-5">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0016BD]">
          {t("curriculumEyebrow")}
        </p>
        <h2 className="mt-1 text-xl font-bold text-[#0b0b1a]">{t("curriculumTitle")}</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-black/65">
          {t("curriculumBody")}
        </p>
        <Link
          href="/courses/curriculum"
          className="mt-4 inline-flex rounded-full bg-[#0016BD] px-5 py-3 text-sm font-semibold text-white"
        >
          {t("curriculumCta")}
        </Link>
      </section>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/courses/curriculum"
          className="inline-flex rounded-full bg-[#ffc933] px-5 py-3 text-sm font-semibold text-[#0b0b1a]"
        >
          {t("startLearning")}
        </Link>
        <Link
          href="/contact"
          className="inline-flex rounded-full border-2 border-black px-5 py-3 text-sm font-semibold text-black"
        >
          {t("askQuestion")}
        </Link>
      </div>
    </div>
  );
}
