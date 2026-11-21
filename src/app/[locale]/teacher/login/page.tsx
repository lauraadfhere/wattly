import { Suspense } from "react";
import TeacherLoginSplit from "@/components/auth/TeacherLoginSplit";

export default function TeacherLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-white p-10 text-black/60">…</div>}>
      <TeacherLoginSplit />
    </Suspense>
  );
}
