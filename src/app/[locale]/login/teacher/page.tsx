import { getLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";

export default async function TeacherLoginRedirect() {
  const locale = await getLocale();
  redirect({ href: "/teacher/login", locale });
}
