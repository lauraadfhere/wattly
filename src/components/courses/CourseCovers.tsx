import Image from "next/image";
import { Link } from "@/i18n/navigation";

type Cover = {
  file: string;
  title: string;
  level: string;
  href: string;
};

const covers: Cover[] = [
  { file: "01_English_for_Beginners_A1-A2.png", title: "English for Beginners", level: "A1–A2", href: "/levels" },
  { file: "02_General_English_B1-B2.png", title: "General English", level: "B1–B2", href: "/levels" },
  { file: "03_Advanced_English_C1-C2.png", title: "Advanced English", level: "C1–C2", href: "/levels" },
  { file: "04_English_Grammar_Mastery.png", title: "English Grammar Mastery", level: "A1–C2", href: "/courses/activities" },
  { file: "05_English_Vocabulary.png", title: "English Vocabulary", level: "A1–C1", href: "/practice/vocabulary" },
  { file: "06_Speak_English_Confidently.png", title: "Speak English Confidently", level: "A2–C1", href: "/practice/oral" },
  { file: "07_English_Listening_Skills.png", title: "English Listening Skills", level: "A1–C1", href: "/practice/listening" },
  { file: "08_Improve_Your_Reading.png", title: "Improve Your Reading", level: "A1–C2", href: "/stories" },
  { file: "09_Write_Better_English.png", title: "Write Better English", level: "A2–C2", href: "/courses/activities" },
  { file: "10_English_Exam_Preparation.png", title: "English Exam Preparation", level: "B1–C2", href: "/assessment" },
];

export default function CourseCovers() {
  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {covers.map((cover) => (
        <li key={cover.file}>
          <Link
            href={cover.href}
            className="group block h-full overflow-hidden rounded-2xl border border-[#0016BD]/15 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-[#0016BD]/45 hover:shadow-md"
          >
            <div className="relative aspect-[3/4] overflow-hidden bg-[#eef1ff]">
              <Image
                src={`/brand/course-covers/${cover.file}`}
                alt={cover.title}
                fill
                sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 210px"
                className="object-cover transition duration-300 group-hover:scale-[1.03]"
              />
            </div>
            <div className="p-3">
              <p className="text-[11px] font-bold uppercase tracking-wide text-[#c45c00]">
                {cover.level}
              </p>
              <p className="mt-1 text-sm font-semibold leading-5 text-[#000A5E]">{cover.title}</p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
