"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import Avatar from "@/components/Avatar";

type ProfileMenuProps = {
  tone?: "dark" | "hero";
};

export default function ProfileMenu({ tone = "dark" }: ProfileMenuProps) {
  const t = useTranslations("Platform");
  const { user, profile, logout } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);

  const displayName = profile?.display_name || user?.name || user?.email || "";

  useEffect(() => {
    if (!open) return;

    const onPointer = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("mousedown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!user) return null;

  const nameClass = tone === "hero" ? "text-white" : "text-white";

  async function onLogout() {
    setOpen(false);
    await logout();
    router.push("/login");
  }

  const itemClass =
    "block px-4 py-2.5 text-sm text-[#1a1a1a] hover:bg-[#ececec]";

  return (
    <div
      ref={rootRef}
      className="group relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className="flex items-center gap-2 pe-1"
        aria-label={t("profile")}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
      >
        <Avatar
          name={displayName || user.email}
          role={profile?.role}
          size="sm"
          src={profile?.avatar_url}
        />
        <span className={`hidden max-w-[8rem] truncate text-sm font-medium lg:inline ${nameClass}`}>
          {displayName || user.email}
        </span>
      </button>

      <div
        id={menuId}
        role="menu"
        className={`absolute end-0 top-full z-50 pt-2.5 ${
          open ? "pointer-events-auto visible opacity-100" : "pointer-events-none invisible opacity-0"
        }`}
      >
        {/* Triangle tip */}
        <span
          className="absolute end-5 top-[2px] z-10 h-0 w-0 border-x-[7px] border-b-[8px] border-x-transparent border-b-[#f3f3f3] drop-shadow-[0_-1px_0_rgba(0,0,0,0.06)]"
          aria-hidden="true"
        />

        <div className="relative min-w-[12.5rem] overflow-hidden rounded-xl border border-[#e4e4e4] bg-[#f7f7f7] py-1.5 text-[#1a1a1a] shadow-[0_12px_28px_rgba(0,0,0,0.14)]">
          <p className="truncate border-b border-[#e8e8e8] bg-white px-4 py-2.5 text-xs text-[#666]">
            {displayName || user.email}
          </p>
          <Link href="/profile" role="menuitem" className={itemClass} onClick={() => setOpen(false)}>
            {t("profile")}
          </Link>
          <Link href="/dashboard" role="menuitem" className={itemClass} onClick={() => setOpen(false)}>
            {t("dashboard")}
          </Link>
          <Link href="/messages" role="menuitem" className={itemClass} onClick={() => setOpen(false)}>
            {t("messages")}
          </Link>
          <Link href="/teachers" role="menuitem" className={itemClass} onClick={() => setOpen(false)}>
            {t("teachers")}
          </Link>
          <Link href="/practice" role="menuitem" className={itemClass} onClick={() => setOpen(false)}>
            {t("practice")}
          </Link>
          {profile?.role === "admin" ? (
            <Link href="/admin" role="menuitem" className={itemClass} onClick={() => setOpen(false)}>
              {t("admin")}
            </Link>
          ) : null}
          <button
            type="button"
            role="menuitem"
            className="block w-full border-t border-[#e8e8e8] bg-white px-4 py-2.5 text-start text-sm font-semibold text-[#8a1010] hover:bg-[#f0f0f0]"
            onClick={() => void onLogout()}
          >
            {t("logout")}
          </button>
        </div>
      </div>
    </div>
  );
}
