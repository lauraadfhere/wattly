import { getTranslations } from "next-intl/server";
import SearchPageClient from "@/components/search/SearchPageClient";

export default async function SearchPage() {
  const t = await getTranslations("SearchPage");

  return (
    <SearchPageClient
      title={t("title")}
      placeholder={t("placeholder")}
      submit={t("submit")}
      hint={t("hint")}
      closeLabel={t("close")}
    />
  );
}
