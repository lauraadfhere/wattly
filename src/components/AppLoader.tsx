"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "@/i18n/navigation";

export default function AppLoader() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setVisible(true);
    const timer = window.setTimeout(() => setVisible(false), 450);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  if (!visible) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[100] flex items-center justify-center bg-transparent"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Loading Wattly"
    >
      <Image
        src="/favicon.png"
        alt=""
        width={56}
        height={56}
        className="h-12 w-12 animate-pulse rounded-xl"
        priority
      />
    </div>
  );
}
