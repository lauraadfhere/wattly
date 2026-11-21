"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  isAdminOnlyPath,
  isAuthRequiredPath,
  isGuestOnlyPath,
  postLoginPath,
} from "@/lib/auth-redirect";

type AuthGateProps = {
  children: React.ReactNode;
  /** Force guest-only or auth-required for a specific shell. */
  mode?: "guest" | "auth" | "admin" | "auto";
};

/**
 * Smart session redirects:
 * - Logged-in users hitting login/signup → dashboard / onboarding / admin
 * - Guests hitting protected pages → /login?next=…
 * - Non-admins hitting /admin → dashboard
 */
export default function AuthGate({ children, mode = "auto" }: AuthGateProps) {
  const t = useTranslations("Auth");
  const { user, profile, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  const intent = useMemo(() => {
    if (mode === "guest") return "guest" as const;
    if (mode === "auth") return "auth" as const;
    if (mode === "admin") return "admin" as const;
    if (isGuestOnlyPath(pathname)) return "guest" as const;
    if (isAdminOnlyPath(pathname)) return "admin" as const;
    if (isAuthRequiredPath(pathname)) return "auth" as const;
    return "open" as const;
  }, [mode, pathname]);

  useEffect(() => {
    if (loading) return;

    if (intent === "guest" && user) {
      router.replace(postLoginPath(profile));
      return;
    }

    if (intent === "auth" && !user) {
      const next = encodeURIComponent(pathname || "/dashboard");
      router.replace(`/login?next=${next}`);
      return;
    }

    if (intent === "admin") {
      if (!user) {
        router.replace(`/login?next=${encodeURIComponent("/admin")}`);
        return;
      }
      if (profile?.role !== "admin") {
        router.replace(postLoginPath(profile));
        return;
      }
    }

    setReady(true);
  }, [intent, loading, user, profile, pathname, router]);

  if (loading || !ready) {
    if (intent === "open") {
      return <>{children}</>;
    }

    return (
      <div
        className="flex min-h-[40vh] flex-col items-center justify-center gap-3 px-6 text-center"
        role="status"
        aria-live="polite"
      >
        <span className="h-10 w-10 animate-pulse rounded-full bg-black/15" />
        <p className="max-w-sm text-sm text-black/65">
          {intent === "guest" && user ? t("alreadySignedIn") : t("checkingSession")}
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
