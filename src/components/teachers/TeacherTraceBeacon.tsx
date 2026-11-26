"use client";

import { useEffect } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { recordTeacherTrace } from "@/lib/teacher-traces";

/** Records a profile view trace when a student opens a teacher page. */
export default function TeacherTraceBeacon({ teacherId }: { teacherId: string }) {
  const { user } = useAuth();

  useEffect(() => {
    recordTeacherTrace({
      kind: "profile_view",
      teacherId,
      userId: user?.$id,
    });
  }, [teacherId, user?.$id]);

  return null;
}
