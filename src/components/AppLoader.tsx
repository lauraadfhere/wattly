"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "@/i18n/navigation";

export default function AppLoader() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setVisible(true);
    const timer = window.setTimeout(() => setVisible(false), 650);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#000ea8]"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Loading Wattly"
    >
      <div className="relative flex flex-col items-center gap-5">
        <div className="absolute h-28 w-28 animate-ping rounded-full bg-[#8fa8ff]/20" />
        <div className="relative flex h-24 w-24 items-center justify-center rounded-[1.75rem] bg-[#000A5E] shadow-[0_18px_50px_rgba(0,0,0,0.35)]">
          <Image
            src="/favicon.png"
            alt=""
            width={96}
            height={96}
            className="h-16 w-16 rounded-2xl"
            priority
          />
        </div>
        <p className="text-sm font-semibold tracking-[0.22em] text-white/80 uppercase">
          Wattly
        </p>
        <span className="h-1.5 w-32 overflow-hidden rounded-full bg-white/15">
          <span className="app-loader-bar block h-full w-1/2 rounded-full bg-[#ffc933]" />
        </span>
      </div>
    </div>
  );
}
