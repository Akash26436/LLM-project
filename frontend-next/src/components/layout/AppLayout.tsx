"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import DoubtAssistant from "../DoubtAssistant";
import { getStoredUser, getToken } from "@/lib/auth";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const publicRoutes = useMemo(() => new Set(["/", "/login", "/register"]), []);
  const teacherPaths = useMemo(
    () => ["/dashboard/teacher", "/courses", "/attendance", "/analytics"],
    [],
  );
  const studentPaths = useMemo(
    () => ["/dashboard/student", "/my-courses", "/assignments"],
    [],
  );

  const isPublic = publicRoutes.has(pathname);
  const token = !isPublic ? getToken() : "";
  const user = !isPublic ? getStoredUser() : null;
  const authedRole = user?.role === "student" ? "student" : "teacher";

  useEffect(() => {
    const timer = window.setTimeout(() => setMounted(true), 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isPublic) {
      return;
    }

    if (!token || !user) {
      router.replace("/login");
      return;
    }

    const isTeacherArea = teacherPaths.some((p) => pathname.startsWith(p));
    const isStudentArea = studentPaths.some((p) => pathname.startsWith(p));

    if (authedRole === "teacher" && isStudentArea) {
      router.replace("/dashboard/teacher");
      return;
    }
    if (authedRole === "student" && isTeacherArea) {
      router.replace("/dashboard/student");
    }
  }, [
    authedRole,
    isPublic,
    pathname,
    router,
    studentPaths,
    teacherPaths,
    token,
    user,
  ]);

  if (!mounted) {
    return <div className="h-screen w-full bg-background" />;
  }

  if (isPublic) {
    return <div className="h-screen w-full bg-background">{children}</div>;
  }

  if (!token || !user) {
    return <div className="h-screen w-full bg-background" />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar role={authedRole} />
      <div className="flex flex-1 flex-col w-full relative">
        <Topbar userRole={authedRole} />

        <main className="flex-1 overflow-y-auto w-full">
          <div className="relative min-h-full">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent/10 blur-[120px] pointer-events-none" />

            <div className="relative z-10 w-full min-h-full">{children}</div>

            <DoubtAssistant />
          </div>
        </main>
      </div>
    </div>
  );
}
