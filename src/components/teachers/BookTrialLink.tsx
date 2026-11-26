"use client";

import { Link } from "@/i18n/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { recordTeacherTrace } from "@/lib/teacher-traces";

export default function BookTrialLink({
  teacherId,
  label,
}: {
  teacherId: string;
  label: string;
}) {
  const { user } = useAuth();
  return (
    <Link
      href="/dashboard"
      onClick={() =>
        recordTeacherTrace({
          kind: "book_intent",
          teacherId,
          userId: user?.$id,
        })
      }
      className="rounded-full bg-[#0016BD] px-5 py-3 text-sm font-semibold text-white"
    >
      {label}
    </Link>
  );
}
