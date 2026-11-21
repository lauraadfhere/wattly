export type DemoTeacher = {
  id: string;
  nameEn: string;
  nameAr: string;
  focus: string;
  focusAr: string;
  languages: string;
  languagesAr: string;
  rateUsd: number;
  verified: boolean;
  image: string;
  bioEn: string;
  bioAr: string;
};

/** Six demo teachers — English + Arabic names, budget rates, local portraits. */
export const demoTeachers: DemoTeacher[] = [
  {
    id: "amina",
    nameEn: "Amina Benali",
    nameAr: "أمينة بنعلي",
    focus: "Dyslexia support · A1–B1",
    focusAr: "دعم عسر القراءة · A1–B1",
    languages: "Arabic · English",
    languagesAr: "العربية · الإنجليزية",
    rateUsd: 9,
    verified: true,
    image: "/teachers/amina.jpg",
    bioEn:
      "Amina helps learners with dyslexia build reading confidence through short, multisensory sessions. She explains in Arabic or English and keeps every step calm and clear.",
    bioAr:
      "تساعد أمينة المتعلمين الذين يعانون من عسر القراءة على بناء ثقة في القراءة عبر حصص قصيرة ومتعددة الحواس. تشرح بالعربية أو الإنجليزية وتبقي كل خطوة هادئة وواضحة.",
  },
  {
    id: "karim",
    nameEn: "Karim Haddad",
    nameAr: "كريم حداد",
    focus: "Deaf education · captions",
    focusAr: "تعليم الصم · الترجمة النصية",
    languages: "Arabic · English · French",
    languagesAr: "العربية · الإنجليزية · الفرنسية",
    rateUsd: 11,
    verified: true,
    image: "/teachers/karim.jpg",
    bioEn:
      "Karim specializes in captioned lessons and visual English for deaf and hard-of-hearing learners. Sessions use clear lip patterns, text, and optional signing support.",
    bioAr:
      "يتخصص كريم في الدروس المترجمة بصريًا والإنجليزية المرئية للمتعلمين الصم وضعاف السمع. تستخدم الحصص أنماط شفاه واضحة ونصًا ودعم إشارة اختياري.",
  },
  {
    id: "sara",
    nameEn: "Sara Al-Mansouri",
    nameAr: "سارة المنصوري",
    focus: "Autism support · short sessions",
    focusAr: "دعم التوحد · حصص قصيرة",
    languages: "Arabic · English",
    languagesAr: "العربية · الإنجليزية",
    rateUsd: 10,
    verified: true,
    image: "/teachers/sara.jpg",
    bioEn:
      "Sara designs predictable, short English sessions for autistic learners. Visual schedules, soft pacing, and no surprise speaking drills.",
    bioAr:
      "تصمم سارة حصص إنجليزية قصيرة ومتوقعة للمتعلمين من طيف التوحد. جداول بصرية وإيقاع هادئ دون تمارين كلام مفاجئة.",
  },
  {
    id: "layla",
    nameEn: "Layla Farouk",
    nameAr: "ليلى فاروق",
    focus: "Kids beginners · phonics",
    focusAr: "مبتدئون أطفال · الصوتيات",
    languages: "Arabic · English",
    languagesAr: "العربية · الإنجليزية",
    rateUsd: 8,
    verified: true,
    image: "/teachers/layla.jpg",
    bioEn:
      "Layla teaches young beginners with songs, phonics games, and picture stories. Parents can join in Arabic while the child practices English.",
    bioAr:
      "تعلّم ليلى المبتدئين الصغار عبر الأغاني وألعاب الصوتيات وقصص الصور. يمكن لأولياء الأمور المشاركة بالعربية بينما يتدرب الطفل بالإنجليزية.",
  },
  {
    id: "omar",
    nameEn: "Omar Youssef",
    nameAr: "عمر يوسف",
    focus: "Conversation · B1–B2",
    focusAr: "محادثة · B1–B2",
    languages: "Arabic · English",
    languagesAr: "العربية · الإنجليزية",
    rateUsd: 12,
    verified: true,
    image: "/teachers/omar.jpg",
    bioEn:
      "Omar runs patient conversation practice for everyday work and travel. He corrects gently and always offers a typed option if speaking feels hard.",
    bioAr:
      "يدير عمر تمارين محادثة صبورة للعمل والسفر اليومي. يصحح بلطف ويوفر دائمًا خيار الكتابة إن بدا الكلام صعبًا.",
  },
  {
    id: "nour",
    nameEn: "Nour El-Amin",
    nameAr: "نور الأمين",
    focus: "Exam prep · IELTS basics",
    focusAr: "تحضير امتحانات · أساسيات IELTS",
    languages: "Arabic · English",
    languagesAr: "العربية · الإنجليزية",
    rateUsd: 13,
    verified: true,
    image: "/teachers/nour.jpg",
    bioEn:
      "Nour coaches IELTS and school-exam basics with calm timing and captioned listening. Budget-friendly packs for weekly goals.",
    bioAr:
      "تدرّب نور أساسيات IELTS وامتحانات المدرسة بتوقيت هادئ واستماع مترجم. باقات مناسبة للميزانية لأهداف أسبوعية.",
  },
];

export function getTeacherById(id: string) {
  return demoTeachers.find((teacher) => teacher.id === id);
}

export const teacherIds = demoTeachers.map((teacher) => teacher.id);
