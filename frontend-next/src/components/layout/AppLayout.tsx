"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import DoubtAssistant from "../DoubtAssistant";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Decide role based on URL for demo purposes, normally from auth state
  const isTeacher = pathname.startsWith("/dashboard/teacher") || pathname.startsWith("/analytics");
  const role = isTeacher ? "teacher" : "student";

  // If it's a login/register page, don't show the layout
  if (pathname === "/login" || pathname === "/register" || pathname === "/") {
    return <div className="h-screen w-full bg-background">{children}</div>;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar role={role} />
      <div className="flex flex-1 flex-col w-full relative">
        <Topbar userRole={role} />
        
        <main className="flex-1 overflow-y-auto w-full">
          <div className="h-full relative overflow-hidden">
            {/* Ambient background glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent/10 blur-[120px] pointer-events-none" />
            
            <div className="relative z-10 w-full h-full">
              {children}
            </div>
            
            <DoubtAssistant />
          </div>
        </main>
      </div>
    </div>
  );
}
