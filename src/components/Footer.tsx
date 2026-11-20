import Image from "next/image";
import { getTranslations } from "next-intl/server";

export default async function Footer() {
  const t = await getTranslations("Footer");

  return (
    <footer className="bg-black text-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-3 px-6 py-8 sm:px-10 lg:px-16">
        <Image
          src="/brand/wattly-logo-white.png"
          alt="Wattly"
          width={1000}
          height={280}
          className="h-auto w-[10vw] min-w-[72px] max-w-[120px]"
        />
        <p className="max-w-xl text-sm leading-6 text-white/70">{t("tagline")}</p>
        <p className="text-xs text-white/45">
          © 2026 Wattly. {t("rights")}
        </p>
      </div>
    </footer>
  );
}
