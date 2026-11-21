"use client";

import AuthGate from "@/components/auth/AuthGate";

type Props = {
  children: React.ReactNode;
};

/** Full-viewport reading layout — no dashboard shell, title block, or footer. */
export default function ReadingShell({ children }: Props) {
  return (
    <AuthGate mode="auth">
      <div className="fixed inset-0 z-40 flex flex-col bg-[#0a0a0a] text-white">
        {children}
      </div>
    </AuthGate>
  );
}
