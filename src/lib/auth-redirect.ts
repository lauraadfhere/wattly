import type { WattlyProfile } from "@/lib/auth";

/** Where a signed-in user should land after auth. */
export function postLoginPath(profile: WattlyProfile | null | undefined): string {
  if (!profile) return "/dashboard";
  if (profile.role === "admin") return "/admin";
  if (!profile.onboarding_done) return "/onboarding";
  if (profile.role === "teacher") return "/teacher/dashboard";
  return "/dashboard";
}

const GUEST_ONLY_PREFIXES = [
  "/login",
  "/signup",
  "/student/login",
  "/teacher/login",
  "/parent/login",
  "/admin/login",
] as const;

const AUTH_REQUIRED_PREFIXES = [
  "/dashboard",
  "/teacher/dashboard",
  "/onboarding",
  "/profile",
  "/practice",
  "/teachers",
  "/admin",
  "/lessons",
  "/levels",
  "/assessment",
  "/audiobooks",
  "/stories",
  "/live-lessons",
  "/courses",
] as const;

/** Paths that stay public even under an auth-required prefix. */
const AUTH_PUBLIC_EXCEPTIONS = ["/admin/login"] as const;

export function isGuestOnlyPath(pathname: string): boolean {
  return GUEST_ONLY_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export function isAuthRequiredPath(pathname: string): boolean {
  if (AUTH_PUBLIC_EXCEPTIONS.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return false;
  }
  return AUTH_REQUIRED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export function isAdminOnlyPath(pathname: string): boolean {
  if (pathname === "/admin/login" || pathname.startsWith("/admin/login/")) {
    return false;
  }
  return pathname === "/admin" || pathname.startsWith("/admin/");
}
