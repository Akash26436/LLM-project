"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, Clock, Users, BarChart3, Settings, BrainCircuit } from "lucide-react";
import { motion } from "framer-motion";

const teacherNavigation = [
  { name: "Dashboard", href: "/dashboard/teacher", icon: Home },
  { name: "Courses", href: "/courses", icon: BookOpen },
  { name: "Attendance", href: "/attendance", icon: Users },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Timetable", href: "/timetable", icon: Clock },
];

const studentNavigation = [
  { name: "Dashboard", href: "/dashboard/student", icon: Home },
  { name: "My Courses", href: "/my-courses", icon: BookOpen },
  { name: "Assignments", href: "/assignments", icon: BookOpen },
  { name: "Timetable", href: "/timetable", icon: Clock },
];

export default function Sidebar({ role = "teacher" }: { role?: "teacher" | "student" }) {
  const pathname = usePathname();
  const navigation = role === "teacher" ? teacherNavigation : studentNavigation;

  return (
    <div className="flex h-full w-64 flex-col glass border-r">
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-white/5">
        <BrainCircuit className="h-8 w-8 text-primary" />
        <span className="ml-3 text-xl font-bold tracking-tight gradient-text">
          AgenticClass
        </span>
      </div>
      
      <div className="flex flex-1 flex-col overflow-y-auto px-4 py-6">
        <nav className="flex-1 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group relative flex items-center rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200 ${
                  isActive 
                    ? "text-white" 
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded-xl bg-primary/20 border border-primary/30"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}
                <item.icon
                  className={`mr-3 h-5 w-5 shrink-0 transition-colors z-10 ${
                    isActive ? "text-primary" : "text-zinc-400 group-hover:text-white"
                  }`}
                  aria-hidden="true"
                />
                <span className="z-10">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
      
      <div className="border-t border-white/5 p-4 shrink-0">
        <Link
          href="/settings"
          className="group flex w-full items-center rounded-xl px-3 py-3 text-sm font-medium text-zinc-400 transition-colors hover:text-white"
        >
          <Settings className="mr-3 h-5 w-5 shrink-0 text-zinc-400 group-hover:text-white" aria-hidden="true" />
          Settings
        </Link>
      </div>
    </div>
  );
}
