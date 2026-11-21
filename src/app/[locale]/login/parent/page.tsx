import { getLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";

export default async function ParentLoginRedirect() {
  const locale = await getLocale();
  redirect({ href: "/parent/login", locale });
}
